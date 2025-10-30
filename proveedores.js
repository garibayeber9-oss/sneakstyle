const BASE_URL = "http://localhost:8080/SneakStyle/api/proveedores/"; //URL base para los endpoints de proveedores

document.addEventListener("DOMContentLoaded", () => {  //Espera a que el HTML termine de cargar para poder buscar elementos por id
  console.log("JS de Proveedores cargado");            //Mensaje en consola para saber que el script inició

  const addBtn    = document.getElementById("addProveedorBtn");        //Botón "Nuevo Proveedor"
  const modal     = document.getElementById("proveedorModal");         //Modal (ventana) de alta/edición
  const closeBtn  = document.getElementById("closeProveedorModalBtn"); //Botón "X" del modal
  const cancelBtn = document.getElementById("cancelProveedorBtn");     //Botón "Cancelar" del modal
  const form      = document.getElementById("proveedorForm");          //Formulario dentro del modal
  const searchBtn = document.getElementById("searchProveedorBtn");     //Botón de búsqueda

  addBtn?.addEventListener("click", () => openProveedorModal()); //Abrir modal en modo "nuevo"
  closeBtn?.addEventListener("click", closeProveedorModal);      //Cerrar modal con la X
  cancelBtn?.addEventListener("click", closeProveedorModal);     //Cerrar modal con "Cancelar"
  form?.addEventListener("submit", async (e) => {                //Al enviar el formulario…
    e.preventDefault();                                          //Evita recargar la página
    await saveProveedor();                                       //Guarda (inserta o actualiza)
  });
  searchBtn?.addEventListener("click", searchProveedores);       //Buscar proveedores al dar clic

  loadProveedores(); //Al iniciar, carga la tabla con todos los proveedores
});

async function loadProveedores() {                              //Pide la lista de proveedores al backend
  try {
    const res = await fetch(BASE_URL + "getAll");               //GET /proveedores/getAll
    const proveedores = await res.json();                       //Convierte la respuesta a JSON
    renderProveedores(proveedores);                             //Dibuja la tabla con los datos
  } catch (error) {
    console.error("Error al cargar proveedores", error);        //Log de error en consola
    showError("No se pudieron cargar los proveedores");         //Mensaje de error para el usuario
  }
}

function renderProveedores(proveedores) {                       //Rellena la tabla con las filas
  const tableBody = document.getElementById("proveedoresTableBody"); //Cuerpo <tbody> de la tabla
  tableBody.innerHTML = "";                                     //Limpia contenido previo

  proveedores.forEach((p) => {                                  //Por cada proveedor…
    const row = document.createElement("tr");                   //Crea una fila <tr>
    row.innerHTML = `                                          <!--Celdas de la fila-->
      <td>${p.idProveedor}</td>
      <td>${p.nombreEmpresa}</td>
      <td>${p.nombreContacto}</td>
      <td>${p.telefono}</td>
      <td>${p.direccion}</td>
      <td>
        <button class="action-btn edit" onclick="editProveedor(${p.idProveedor})">  <!--Editar-->
          <i class="fas fa-edit"></i>
        </button>
        <button class="action-btn delete" onclick="deleteProveedor(${p.idProveedor})"> <!--Eliminar-->
          <i class="fas fa-trash"></i>
        </button>
      </td>
    `;
    tableBody.appendChild(row);                                 //Agrega la fila al <tbody>
  });
}

function openProveedorModal(proveedor = null) {                 //Abre el modal (nuevo o editar)
  const modal = document.getElementById("proveedorModal");      //Modal
  const title = document.getElementById("proveedorModalTitle"); //Título del modal
  const form  = document.getElementById("proveedorForm");       //Formulario del modal

  title.textContent = proveedor ? "Editar Proveedor" : "Nuevo Proveedor"; //Cambia el título según modo

  if (proveedor) {                                              //Si es edición, llena los campos
    document.getElementById("proveedorId").value = proveedor.idProveedor;
    document.getElementById("empresa").value      = proveedor.nombreEmpresa;
    document.getElementById("contacto").value     = proveedor.nombreContacto;
    document.getElementById("telefono").value     = proveedor.telefono;
    document.getElementById("direccion").value    = proveedor.direccion;
  } else {                                                      //Si es nuevo, limpia el formulario
    form.reset();
    document.getElementById("proveedorId").value = "";
  }

  modal.classList.add("show");                                  //Muestra el modal
}

function closeProveedorModal() {                                //Cierra y limpia el modal
  const modal = document.getElementById("proveedorModal");      //Modal
  modal.classList.remove("show");                               //Oculta modal
  document.getElementById("proveedorForm").reset();             //Reinicia el formulario
}

async function saveProveedor() {                                //Guarda proveedor (insert/update)
  const id        = document.getElementById("proveedorId").value; //Id (si existe, es edición)
  const isEditing = !!id;                                        //Bandera de edición

  const data = {                                                 //Objeto a enviar al backend
    nombreEmpresa:  document.getElementById("empresa").value.trim(),
    nombreContacto: document.getElementById("contacto").value.trim(),
    telefono:       document.getElementById("telefono").value.trim(),
    direccion:      document.getElementById("direccion").value.trim()
  };

  if (isEditing) data.idProveedor = parseInt(id);               //En edición, añadimos el id

  try {
    const res = await fetch(BASE_URL + (isEditing ? "modificar" : "insertar"), { //Endpoint según acción
      method: isEditing ? "PUT" : "POST",                                       //PUT si edita, POST si inserta
      headers: { "Content-Type": "application/json" },                           //Indicamos que mandamos JSON
      body: JSON.stringify(data),                                               //Cuerpo de la petición
    });

    const result = await res.json();                                            //Respuesta en JSON
    if (!res.ok) throw new Error(result.error || "Error al guardar");          //Si no ok, lanzamos error

    showSuccess(isEditing ? "Proveedor actualizado" : "Proveedor agregado");   //Mensaje de éxito
    closeProveedorModal();                                                     //Cerramos modal
    loadProveedores();                                                         //Refrescamos la tabla
  } catch (error) {
    console.error(error);                                                      //Log del error
    showError(error.message);                                                  //Mensaje al usuario
  }
}

async function editProveedor(id) {                                             //Carga un proveedor y abre modal en editar
  try {
    const res = await fetch(BASE_URL + "buscar/" + id);                        //GET /buscar/{id}
    const proveedor = await res.json();                                        //JSON → objeto
    if (!proveedor || proveedor.error) throw new Error("Proveedor no encontrado"); //Validación
    openProveedorModal(proveedor);                                             //Abre modal con datos
  } catch (error) {
    console.error(error);                                                      //Log
    showError("No se pudo cargar el proveedor");                               //Mensaje de error
  }
}

async function deleteProveedor(id) {                                           //Elimina proveedor (confirmación)
  if (!window.Swal) return alert("¿Eliminar proveedor?");                      //Fallback si no está SweetAlert

  Swal.fire({                                                                  //Cuadro de confirmación
    title: "¿Estás seguro?",
    text: "Esta acción no se puede deshacer.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#E31837",
    cancelButtonColor: "#6B7280",
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
  }).then(async (result) => {                                                  //Si confirma…
    if (result.isConfirmed) {
      try {
        const res = await fetch(BASE_URL + "eliminarFisico/" + id, {           //DELETE /eliminarFisico/{id}
          method: "DELETE",
        });
        const result = await res.json();                                       //Respuesta JSON
        if (!res.ok) throw new Error(result.error);                            //Si error, lanzar excepción
        showSuccess("Proveedor eliminado");                                     //Éxito
        loadProveedores();                                                      //Refrescar tabla
      } catch (error) {
        console.error(error);                                                  //Log error
        showError(error.message);                                              //Mensaje al usuario
      }
    }
  });
}

function searchProveedores() {                                                 //Filtra proveedores por texto
  const query = document.getElementById("searchProveedor").value               //Toma el texto del input
                 .trim().toLowerCase();                                        //Lo normaliza a minúsculas

  fetch(BASE_URL + "getAll")                                                   //Pide toda la lista
    .then((res) => res.json())                                                 //A JSON
    .then((proveedores) => {
      const filtered = proveedores.filter(                                     //Filtra por empresa, contacto o dirección
        (p) =>
          (p.nombreEmpresa  && p.nombreEmpresa.toLowerCase().includes(query)) ||
          (p.nombreContacto && p.nombreContacto.toLowerCase().includes(query)) ||
          (p.direccion      && p.direccion.toLowerCase().includes(query))
      );
      renderProveedores(filtered);                                             //Muestra solo los que coincidieron
    })
    .catch((error) => {
      console.error("Error en búsqueda", error);                               //Log error
      showError("No se pudo realizar la búsqueda");                            //Mensaje al usuario
    });
}

function showSuccess(message) {                                                //Helper: alerta de éxito
  if (window.Swal) {
    Swal.fire({ icon: "success", title: message, confirmButtonColor: "#E31837" });
  } else {
    alert(message);
  }
}

function showError(message) {                                                  //Helper: alerta de error
  if (window.Swal) {
    Swal.fire({ icon: "error", title: "Error", text: message, confirmButtonColor: "#E31837" });
  } else {
    alert("Error: " + message);
  }
}
