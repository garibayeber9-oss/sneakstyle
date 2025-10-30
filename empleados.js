const BASE_URL = "http://localhost:8080/SneakStyle/api/empleados/"; //URL base para empleados.

document.addEventListener("DOMContentLoaded", () => {   //Espera a que el HTML finalice de cargar para poder buscar elementos por id 
  document.getElementById("addEmpleadoBtn").addEventListener("click", () => {   //Aqui se abre el modal para crear un nuevo emplado 
    resetEmpleadoForm();    //Limpia el formulario
    document.getElementById("empleadoModal").classList.add("show");     //Nos muestra el modal 
  });
 
  document.getElementById("cancelEmpleadoBtn").addEventListener("click", () => {    //Cerrar el modal con el boton de cancelar
    document.getElementById("empleadoModal").classList.remove("show");      //Esconde el modal 
  });
  document.getElementById("closeEmpleadoModalBtn").addEventListener("click", () => {    //Cerrar el modal con el boton x
    document.getElementById("empleadoModal").classList.remove("show");      //Igualmente esconde el modal
  });

  document.getElementById("empleadoFotoFile").addEventListener("change", async (e) => {     //Cuando el usuario selecciona una foto pasa a convertirse a Base64 y se muestra en la vista previa
    const file = e.target.files?.[0];   //Toma el archivo seleccionado 
    if (!file) return;  //Si no hay archivo no hacemos nada
    const b64 = await fileToBase64(file);   //Convertimos la imagen a una cadena base64
    const onlyB64 = b64.split(",")[1] || b64;   //Quitamos el data:/image...;base64 y dejamos solo la parte de base64
    document.getElementById("empleadoFotoB64").value = onlyB64; //Guardamos el base64 en un input hidden
    const img = document.getElementById("empleadoFotoPreview");     //Mostramos la vista previa en el modal
    img.src = b64;  //Aqui usamos el DataURL completo para poder mostrarla
    img.style.display = "block";    //Esto nos asegura que se vea la imagen
  });

  document.getElementById("empleadoForm").addEventListener("submit", guardarEmpleado);  //Guardar el formulario para insertar o modificar 

  const btnSearch = document.getElementById("searchEmpleadoBtn");   //Boton de busqueda lo que hace es que pide toda la lista 
  if (btnSearch) btnSearch.addEventListener("click", searchEmployees);  //y la muestra en el navegador
 
  cargarEmpleados();    //Cargar la tabla de empleados completa
});

function showSuccess(m) { Swal.fire("Éxito", m, "success"); }   //Alerta de exito
function showError(m)   { Swal.fire("Error", m, "error"); }     //Alerta de error

function fileToBase64(file) {   //Convierte la imagen a base64 usando FileRender (api del navegador)
  return new Promise((res, rej) => {
    const reader = new FileReader();    //Creamos el lector de las imagenes 
    reader.onload = () => res(reader.result);   //Cuando termine regresa el resultado (DataURL)
    reader.onerror = (err) => rej(err);     //Si falla lo rechazamos
    reader.readAsDataURL(file);     //Lee la imagen como DataURL
  });
}

function resetEmpleadoForm() {  //Limpia el formulario 
  const form = document.getElementById("empleadoForm");
  form.reset();     //Limpia todos los campos del formulario 
  document.getElementById("empleadoId").value = "";     //Limpia el id oculto si es que tenia 
  document.getElementById("empleadoFotoB64").value = "";    //Limpia base64 oculta 
  const img = document.getElementById("empleadoFotoPreview");   
  img.src = "";     //Quita imagen previa
  img.style.display = "none";   //Oculta la vista previa
}

async function cargarEmpleados() {  //Pide a la api la lista de empleados y la muestra en la tabla
  try {
    const res = await fetch(BASE_URL + "getAll");   // GET/empleados/getAll
    const data = await res.json();  //Convertimos la respuesta a JSON
    renderEmpleados(Array.isArray(data) ? data : []);   //Si es arreglo lo muestra, si no, manda el arreglo vacio
  } catch {
    showError("No se pudieron cargar los empleados");   //Si algo falla mostramos el error
  }
}

function renderEmpleados(list) {    //Dibuja las filas de la tabla con los empleados recibidos
  const tbody = document.getElementById("empleadosTableBody");
  tbody.innerHTML = "";     //Limpia el cuerpo de la tabla

  if (!Array.isArray(list) || list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="text-center text-sm text-gray-500">Sin resultados</td></tr>`; //Si no hay datos mostramos
    return;                                                                                                     //una fila indicando sin resultados
  }

  list.forEach(e => {   //Recorremos a cada empleado y creamos su fila
    const tr = document.createElement("tr");    //Creamos una fila <tr>

    const fotoSrc = e.fotoBase64    //Si nuestro empleado tiene foto bas64, le armamos una DataURL si no la tiene le ponemos una por defecto
      ? `data:image/*;base64,${e.fotoBase64}`
      : `imagenes/user_default.png`;
        //Definimos el contenido HTML de la fila con los datos de los empleados
    tr.innerHTML = `
      <td class="text-sm font-semibold">${e.idEmpleado}</td>
      <td class="text-sm"><img class="emp-img" src="${fotoSrc}" alt="${e.nombreCompleto || "Empleado"}" /></td>
      <td class="text-sm">${e.nombreCompleto || ""}</td>
      <td class="text-sm">${e.telefono || ""}</td>
      <td class="text-sm">${e.correoUsuario || e.correoEmpleado || "N/A"}</td>
      <td class="text-center space-x-2">
        <button onclick="editarEmpleado(${e.idEmpleado})" class="action-btn edit" title="Editar">
          <i class="fas fa-edit"></i>
        </button>
        <button onclick="eliminarEmpleado(${e.idEmpleado})" class="action-btn delete" title="Eliminar">
          <i class="fas fa-trash-alt"></i>
        </button>
      </td>
    `;
    tbody.appendChild(tr);  //Agregamos la fila a la tabla
  });
}


function searchEmployees() {    //Tomamos lo que escribio el usuario, lo vuelve a pedir a la lista completa y lo filtra en el navegador
  const input = document.getElementById("searchEmpleado");
  const q = (input?.value || "").trim().toLowerCase();  //Texto por si se busca en  minusculas

  fetch(BASE_URL + "getAll")    //Pide todos los empleados otra vez
    .then(r => r.json())
    .then((empleados) => {
      const list = Array.isArray(empleados) ? empleados : [];
      const filtered = list.filter((e) => {                                         //Busca coincidencias en:
        const nombre = (e.nombreCompleto || "").toLowerCase();                      //el nombre completo,
        const tel    = (e.telefono || "").toLowerCase();                            //el numero de telefono,
        const mail   = ((e.correoUsuario || e.correoEmpleado) || "").toLowerCase(); //el correo de usuario o id
        return (
          nombre.includes(q) ||
          tel.includes(q) ||
          mail.includes(q) ||
          String(e.idEmpleado || "").includes(q)
        );
      });
      renderEmpleados(filtered);        //Muestra solo los que coincidieron
    })
    .catch(() => showError("No se pudo realizar la búsqueda")); //En caso de falla mostramos un mensaje de error
}

function guardarEmpleado(event) {   //Se activara al enviar el formulario del modal
  event.preventDefault();   //Advertencia para evitar el envio normal del formulario

  const id = document.getElementById("empleadoId").value.trim();                            //Tomamos los valores de los campos del formulario
  const nombre = document.getElementById("nombreEmpleado").value.trim();
  const apellidoPaterno = document.getElementById("apellidoPaternoEmpleado").value.trim();
  const apellidoMaterno = document.getElementById("apellidoMaternoEmpleado").value.trim();
  const telefono = document.getElementById("telefonoEmpleado").value.trim();
  const fotoBase64 = document.getElementById("empleadoFotoB64").value.trim();
  const direccion = "Sin dirección";

  if (!nombre || !apellidoPaterno || !apellidoMaterno || !telefono) {   //Validacion para que se rellenen todos los campos
    return showError("Todos los campos son obligatorios.");  
  }

  const nombreCompleto = `${nombre} ${apellidoPaterno} ${apellidoMaterno}`;     //Construimos el nombre completo para enviar al backend 
  const payload = { nombreCompleto, telefono, fotoBase64 }; //Estructura base para el backend

  if (id) {
    // UPDATE
    payload.idEmpleado = parseInt(id);  //Añadimos el id para que el backend sepa a que empleado actualizar
    fetch(BASE_URL + "modificar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },  //Enviamos el JSON
      body: JSON.stringify(payload)     //Convertimos el objeto a JSON
    })
      .then(res => res.json())      //Parseamos la respuesta como JSON
      .then(r => {
        if (r.error) throw new Error(r.error);  //Si la respuesta es error forzamos el catch
        showSuccess("Empleado modificado correctamente");
        document.getElementById("empleadoModal").classList.remove("show");  //Cerramos el modal
        cargarEmpleados();  //Refrescamos la tabla
      })
      .catch(() => showError("Error al modificar empleado"));   //Mensaje por cualquier error
  } else {
    
    const mkSlug = (s) =>
      s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9]/g, "").toLowerCase();    //Nos sirve para quitar acentos, espacios, caracteres y lo vuelve a minuscula

    const inicP = apellidoPaterno ? apellidoPaterno.charAt(0) : ""; //Inicial del apellido paterno
    const inicM = apellidoMaterno ? apellidoMaterno.charAt(0) : ""; //Inicial del apellido materno

    const usernameRaw = `${nombre}${inicP}${inicM}`;    //Base del usuario
    const nombreUsuario = mkSlug(usernameRaw);                   // ej. ebergl
    const correoUsuario = `${nombreUsuario}@sneakstyle.com`;     // ej. ebergl@sneakstyle.com
    const contrasenia   = nombre + "123";       //Eber123

    payload.nombreUsuario = nombreUsuario;
    payload.correoUsuario = correoUsuario; // el backend genera también a partir del usuario; lo mandamos por claridad
    payload.contrasenia   = contrasenia;
    payload.direccion     = direccion;

    fetch(BASE_URL + "insertar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },  //Enviamos el JSON
      body: JSON.stringify(payload)     //Convertimos el objeto  a JSON
    })
      .then(res => res.json())      //Parseamos la respuesta como JSON
      .then(r => {
        if (r.error) throw new Error(r.error);
        showSuccess("Empleado registrado correctamente");   //Si la respuesta es error forzamos el catch
        document.getElementById("empleadoModal").classList.remove("show");  //Cerramos el modal
        cargarEmpleados();  //Refrescamos la tabla
      })
      .catch(() => showError("Error al registrar empleado"));   //Mensaje por cualquier error
  }
}


function editarEmpleado(id) {   //Llena el formulario con los datos del empleado para editarlo
  fetch(BASE_URL + "buscar/" + id)  //Pide al backend el empleado por id
    .then(res => res.json())
    .then(e => {
      if (!e) throw new Error();    //Si no muestra nada forzamos el error
      const partes = (e.nombreCompleto || "").split(" ");   //Parte el nombre completo en 3 
      document.getElementById("empleadoId").value = e.idEmpleado || "";
      document.getElementById("nombreEmpleado").value = partes[0] || "";    //1
      document.getElementById("apellidoPaternoEmpleado").value = partes[1] || "";   //2
      document.getElementById("apellidoMaternoEmpleado").value = partes[2] || "";   //3
      document.getElementById("telefonoEmpleado").value = e.telefono || "";

      // Cargar foto al hidden y en la vista previa
      const img = document.getElementById("empleadoFotoPreview");
      if (e.fotoBase64) {
        document.getElementById("empleadoFotoB64").value = e.fotoBase64;    //Guarda en base64
        img.src = `data:image/*;base64,${e.fotoBase64}`;    //Muestra la imagen
        img.style.display = "block";
      } else {
        document.getElementById("empleadoFotoB64").value = "";  //Limpia si no hay foto
        img.src = "";
        img.style.display = "none";
      }

      document.getElementById("empleadoModal").classList.add("show");   //Abre el modal para rellenar los campos
    })
    .catch(() => showError("Error al obtener empleado"));   //Mostramos error si la peticion falla
}

function eliminarEmpleado(id) {     //Pide confirmacion y si se acepta borra al empleado por id 
  Swal.fire({
    title: "¿Eliminar empleado?",
    text: "Esta acción no se puede deshacer.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#E31837",
    cancelButtonColor: "#6B7280",
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar"
  }).then(result => {
    if (result.isConfirmed) {   //Si el usuario confirma
      fetch(BASE_URL + "eliminar", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },   //Enviamos como formulario
        body: "idEmpleado=" + id
      })
        .then(res => res.json())
        .then(r => {
          if (r.error) throw new Error(r.error);
          showSuccess("Empleado eliminado correctamente");  //Volvemos a cargar la tabla
          cargarEmpleados();
        })
        .catch(() => showError("Error al eliminar empleado"));  //En caso de falla mostramos un mensaje de error
    }
  });
}
