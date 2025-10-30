const apiUrlInventario = "http://localhost:8080/SneakStyle/api/inventario/"; // URL base de la API de inventario
let allInventario = []; // Cache local con los registros de inventario (sirve para filtrar/repintar)

document.addEventListener("DOMContentLoaded", () => { // Espera a que cargue el HTML
  getAllInventario();              // 1) Carga la tabla con todo el inventario
  populateProductsAndBranches();   // 2) Llena los <select> de productos y proveedores

  // Botón de búsqueda (solo busca cuando se da click, igual que en productos)
  const $searchBtn = document.getElementById("searchInventarioBtn");
  if ($searchBtn) $searchBtn.addEventListener("click", searchInventory);

  // Envío del formulario (insert o update según exista id)
  const $form = document.getElementById("inventoryForm");
  if ($form) {
    $form.addEventListener("submit", function (e) { // Al enviar
      e.preventDefault();                           // Evita recargar la página
      const id = document.getElementById("inventoryId").value; // Lee id oculto
      if (id) updateInventario(id);                 // Si hay id → actualizar
      else insertInventario();                      // Si no hay id → insertar
    });
  }

  // Abrir modal “Nuevo registro”
  const $addBtn = document.getElementById("addInventoryBtn");
  if ($addBtn) {
    $addBtn.addEventListener("click", () => {
      clearInventoryForm(); // Limpia el formulario del modal
      openModal();          // Muestra el modal
    });
  }

  // Cerrar modal (botón X y botón Cancelar)
  const $closeBtn = document.getElementById("closeInventoryModalBtn");
  const $cancelBtn = document.getElementById("cancelInventoryBtn");
  if ($closeBtn) $closeBtn.addEventListener("click", closeModal);
  if ($cancelBtn) $cancelBtn.addEventListener("click", closeModal);
});

function showSuccess(message) { // Muestra alerta de éxito (SweetAlert o alert nativo)
  if (window.Swal) {
    Swal.fire({ icon: "success", title: message, confirmButtonColor: "#E31837" });
  } else {
    alert(message);
  }
}

function showError(message) { // Muestra alerta de error (SweetAlert o alert nativo)
  if (window.Swal) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: message,
      confirmButtonColor: "#E31837",
    });
  } else {
    alert("Error: " + message);
  }
}

function getAllInventario() { // Pide todos los registros al backend
  fetch(apiUrlInventario + "getAll")      // GET /inventario/getAll
    .then((res) => {
      if (!res.ok) {                      // Si el HTTP no es 200…
        return res.text().then((t) => {   // Leemos el error como texto
          console.error("Inventario getAll HTTP", res.status, t); // Log técnico
          showError("No se pudo cargar el inventario");           // Mensaje al usuario
          return [];                      // Devolvemos arreglo vacío para no romper flujo
        });
      }
      return res.json();                  // Si todo bien, parsea JSON
    })
    .then((data) => {                     // data puede llegar en distintos envoltorios
      const lista = Array.isArray(data)
        ? data
        : data && Array.isArray(data.inventario)
        ? data.inventario
        : data && Array.isArray(data.data)
        ? data.data
        : [];

      allInventario = lista;              // Guarda copia local
      renderInventario(lista);            // Dibuja la tabla
    })
    .catch((err) => {                     // Error de red u otra excepción
      console.error("Error getAllInventario:", err);
      allInventario = [];
      renderInventario([]);               // Pinta “sin registros”
    });
}

function renderInventario(data) { // Dibuja las filas de la tabla de inventario
  const tableBody = document.getElementById("inventoryTableBody"); // <tbody>
  if (!tableBody) return;

  tableBody.innerHTML = ""; // Limpia contenido previo

  if (!Array.isArray(data) || data.length === 0) { // Si no hay datos…
    tableBody.innerHTML = `<tr><td colspan="5">Sin registros</td></tr>`; // Fila vacía
    return;
  }

  // Por cada registro, crea una fila con: id, producto, proveedor, cantidad y acciones
  data.forEach((item) => {
    const id = item.idInventario ?? item.id_inventario ?? ""; // Soporta nombres de columna distintos
    const prod =
      item.productoNombre ||
      (item.producto && item.producto.nombreProducto) ||
      item.producto ||
      "(sin nombre)";
    const prov =
      item.proveedorNombre ||
      (item.proveedor &&
        (item.proveedor.nombreProveedor || item.proveedor.nombreEmpresa)) ||
      item.proveedor ||
      "(sin proveedor)";
    const cant = item.cantidad ?? 0;

    const row = document.createElement("tr");
    row.className = "hover:bg-gray-50"; // Estilo de hover (Tailwind/propio)
    row.innerHTML = `
      <td>${id}</td>
      <td>${prod}</td>
      <td>${prov}</td>
      <td>${cant}</td>
      <td>
        <button class="action-btn edit" title="Editar" onclick="editInventario(${id})">
          <i class="fas fa-edit"></i>
        </button>
        <button class="action-btn delete" title="Eliminar" onclick="deleteInventario(${id})">
          <i class="fas fa-trash"></i>
        </button>
      </td>
    `;
    tableBody.appendChild(row); // Agrega la fila al <tbody>
  });
}

function searchInventory() { // Filtra por id, nombre de producto o proveedor
  const input = document.getElementById("searchInventario");        // Input de búsqueda
  const q = (input?.value || "").trim().toLowerCase();              // Texto en minúsculas

  fetch(apiUrlInventario + "getAll") // Vuelve a pedir todo (y filtra en cliente)
    .then((r) => r.json())
    .then((data) => {
      const list = Array.isArray(data)
        ? data
        : data && Array.isArray(data.inventario)
        ? data.inventario
        : data && Array.isArray(data.data)
        ? data.data
        : [];

      // Coincidencias por id, producto o proveedor
      const filtered = list.filter((item) => {
        const id   = String(item.idInventario ?? item.id_inventario ?? "");
        const prod = (
          item.productoNombre ||
          (item.producto && item.producto.nombreProducto) ||
          item.producto ||
          ""
        ).toString().toLowerCase();
        const prov = (
          item.proveedorNombre ||
          (item.proveedor &&
            (item.proveedor.nombreProveedor || item.proveedor.nombreEmpresa)) ||
          item.proveedor ||
          ""
        ).toString().toLowerCase();

        return id.includes(q) || prod.includes(q) || prov.includes(q);
      });

      renderInventario(filtered); // Muestra el resultado
    })
    .catch((e) => {
      console.error("Error en búsqueda", e);
      showError("No se pudo realizar la búsqueda");
    });
}


function insertInventario() { // Inserta un registro nuevo
  const prodId = parseInt(document.getElementById("inventoryProduct").value, 10);  // id de producto
  const provId = parseInt(document.getElementById("inventoryBranch").value, 10);   // id de proveedor
  const qty = parseInt(document.getElementById("inventoryQuantity").value, 10);    // cantidad

  // Validaciones sencillas de formulario
  if (!Number.isInteger(prodId) || prodId <= 0)
    return showError("Selecciona un producto válido");
  if (!Number.isInteger(provId) || provId <= 0)
    return showError("Selecciona un proveedor válido");
  if (!Number.isInteger(qty) || qty <= 0)
    return showError("Ingresa una cantidad válida");

  // Formato anidado que espera el backend (producto y proveedor como objetos con id)
  const payload = {
    producto: { idProducto: prodId },
    proveedor: { idProveedor: provId },
    cantidad: qty,
  };

  fetch(apiUrlInventario + "insertar", {      // POST /inventario/insertar
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),            // Enviamos JSON
  })
    .then((res) => {
      if (!res.ok) return res.text().then((t) => { throw new Error(t); }); // Si falla, lanza error con texto
      return res.json().catch(() => ({}));                                 // Si no hay JSON, regresa {} para seguir
    })
    .then(() => {
      showSuccess("Inventario agregado"); // Éxito
      getAllInventario();                 // Refresca la tabla
      closeModal();                       // Cierra el modal
    })
    .catch((err) => {
      console.error("Error insertar:", err);
      showError(tryParseErr(err));        // Muestra texto “amigable” del error
    });
}

function editInventario(id) { // Carga un registro por id y abre modal en modo edición
  fetch(apiUrlInventario + "buscar/" + id) // GET /inventario/buscar/{id}
    .then((res) => {
      if (!res.ok) return res.text().then((t) => { throw new Error(t); });
      return res.json();
    })
    .then((data) => {
      const d = data && (data.inventario || data); // Acepta envolturas distintas

      // Llena los campos del modal
      document.getElementById("inventoryId").value =
        d.idInventario ?? d.id_inventario ?? "";

      // Extrae ids de producto/proveedor de distintas formas según lo que regrese la API
      const prodId =
        d.productoId ??
        (d.producto && d.producto.idProducto) ??
        d.id_producto ??
        "";
      const provId =
        d.proveedorId ??
        (d.proveedor && (d.proveedor.idProveedor || d.proveedor.id_proveedor)) ??
        d.id_proveedor ??
        "";

      document.getElementById("inventoryProduct").value = prodId;
      document.getElementById("inventoryBranch").value = provId;
      document.getElementById("inventoryQuantity").value = d.cantidad ?? 0;

      openModal(); // Abre el modal listo para editar
    })
    .catch((err) => {
      console.error("Error buscar:", err);
      showError("No se pudo cargar el registro");
    });
}

function updateInventario(id) { // Actualiza un registro existente
  const prodId = parseInt(document.getElementById("inventoryProduct").value, 10);
  const provId = parseInt(document.getElementById("inventoryBranch").value, 10);
  const qty = parseInt(document.getElementById("inventoryQuantity").value, 10);

  // Validaciones
  if (!Number.isInteger(prodId) || prodId <= 0)
    return showError("Selecciona un producto válido");
  if (!Number.isInteger(provId) || provId <= 0)
    return showError("Selecciona un proveedor válido");
  if (!Number.isInteger(qty) || qty <= 0)
    return showError("Ingresa una cantidad válida");

  // Cuerpo del request tal como lo espera el backend
  const payload = {
    idInventario: parseInt(id, 10),
    producto: { idProducto: prodId },
    proveedor: { idProveedor: provId },
    cantidad: qty,
  };

  fetch(apiUrlInventario + "modificar", { // PUT /inventario/modificar
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
    .then((res) => {
      if (!res.ok) return res.text().then((t) => { throw new Error(t); });
      return res.json().catch(() => ({}));
    })
    .then(() => {
      showSuccess("Inventario actualizado"); // Éxito
      getAllInventario();                    // Refresca tabla
      closeModal();                          // Cierra modal
    })
    .catch((err) => {
      console.error("Error modificar:", err);
      showError(tryParseErr(err));
    });
}

function deleteInventario(id) { // Confirma y elimina (físico) un registro
  if (window.Swal) { // Con SweetAlert
    Swal.fire({
      title: "¿Eliminar registro?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#E31837",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((r) => {
      if (r.isConfirmed) doDelete(id); // Si confirma, ejecuta borrado
    });
  } else if (confirm("¿Deseas eliminar este registro?")) { // Fallback nativo
    doDelete(id);
  }
}

function doDelete(id) { // Llama al endpoint de borrado físico
  fetch(apiUrlInventario + "eliminarFisico/" + id, { method: "DELETE" })
    .then((res) => {
      if (!res.ok) return res.text().then((t) => { throw new Error(t); });
    })
    .then(() => {
      showSuccess("Registro eliminado"); // Éxito
      getAllInventario();                // Refresca tabla
    })
    .catch((err) => {
      console.error("Error eliminar:", err);
      showError(tryParseErr(err));
    });
}

function clearInventoryForm() { // Limpia el formulario del modal
  document.getElementById("inventoryForm").reset();
  document.getElementById("inventoryId").value = "";
}

function openModal() {  // Muestra modal
  document.getElementById("inventoryModal").classList.add("show");
}
function closeModal() { // Oculta modal
  document.getElementById("inventoryModal").classList.remove("show");
}

function populateProductsAndBranches() {
  // ----- Productos -----
  fetch("http://localhost:8080/SneakStyle/api/productos/getAll") // Pide productos
    .then((res) => {
      if (!res.ok) return res.text().then((t) => { throw new Error(t); });
      return res.json();
    })
    .then((data) => {
      const select = document.getElementById("inventoryProduct"); // <select> productos
      if (!select) return;
      select.innerHTML = ""; // Limpia opciones

      const arr = Array.isArray(data) // Normaliza respuesta
        ? data
        : data && Array.isArray(data.data)
        ? data.data
        : [];

      arr.forEach((p) => { // Crea <option> por cada producto
        const id = p.idProducto ?? p.productoId ?? "";
        const name = p.nombreProducto ?? p.productoNombre ?? "";
        if (id) select.appendChild(new Option(name, id)); // Texto=nombre, value=id
      });
    })
    .catch((err) => console.error("Error productos:", err));

  // ----- Proveedores -----
  fetch("http://localhost:8080/SneakStyle/api/proveedores/getAll") // Pide proveedores
    .then((res) => {
      if (!res.ok) return res.text().then((t) => { throw new Error(t); });
      return res.json();
    })
    .then((data) => {
      const select = document.getElementById("inventoryBranch"); // <select> proveedores
      if (!select) return;
      select.innerHTML = ""; // Limpia opciones

      const arr = Array.isArray(data) // Normaliza respuesta
        ? data
        : data && Array.isArray(data.data)
        ? data.data
        : [];

      arr.forEach((p) => { // Crea <option> por cada proveedor
        const id = p.idProveedor ?? p.id_proveedor ?? "";
        const name =
          p.nombreProveedor || p.nombre_empresa || p.nombre_contacto || `Proveedor ${id}`;
        if (id) select.appendChild(new Option(name, id)); // Texto=nombre, value=id
      });
    })
    .catch((err) => console.error("Error proveedores:", err));
}

function tryParseErr(err) { // Intenta leer { "error": "..." } desde el backend
  try {
    const obj = JSON.parse(err.message || "{}");
    return obj.error || err.message || "Ocurrió un error";
  } catch {
    return err.message || "Ocurrió un error";
  }
}
