const BASE_URL = "http://localhost:8080/SneakStyle/api/productos/"; // URL base para los endpoints de productos

document.addEventListener("DOMContentLoaded", () => {   // Espera a que cargue todo el HTML
  const addBtn   = document.getElementById("addProductBtn");    // Botón "Nuevo producto"
  const closeBtn = document.getElementById("closeProductModalBtn"); // Botón "X" del modal
  const cancelBtn= document.getElementById("cancelProductBtn"); // Botón "Cancelar" del modal
  const form     = document.getElementById("productForm");  // Formulario del modal
  const searchBtn= document.getElementById("searchProductBtn"); // Botón de búsqueda
  const fileIn   = document.getElementById("productImage"); // Input tipo file para la imagen

  if (addBtn) addBtn.addEventListener("click", () => openProductModal());   // Abrir modal para crear
  if (closeBtn) closeBtn.addEventListener("click", closeProductModal);  // Cerrar modal (X)
  if (cancelBtn) cancelBtn.addEventListener("click", closeProductModal);    // Cerrar modal (Cancelar)
  if (form) form.addEventListener("submit", async (e) => {  // Enviar formulario
    e.preventDefault(); // Evita recargar la página
    await saveProduct();    // Guarda (insert/update)
  });
  if (searchBtn) searchBtn.addEventListener("click", searchProducts);   // Click en buscar

  // Leer imagen y guardar Base64 en hidden + mostrar vista previa
  if (fileIn) fileIn.addEventListener("change", async (e) => {  // Cuando se elige un archivo
    const file = e.target.files?.[0];   // Primer archivo seleccionado
    const hidden = document.getElementById("productImageB64");  // Input oculto para Base64
    const preview = document.getElementById("productPreview");  // <img> de vista previa

    if (!file) {    // Si no hay archivo
      if (preview) { preview.style.display = "none"; preview.src = ""; }    // Oculta preview
      if (hidden) hidden.value = "";    // Limpia Base64
      return;
    }

    // Límite de tamaño de imagen (2 MB)
    const MAX = 2 * 1024 * 1024;    // 2 megas en bytes
    if (file.size > MAX) {   // Si excede
      showError("La imagen supera 2MB.");   // Aviso de error
      e.target.value = "";  // Limpia el input file
      return;
    }

    try {
      const dataUrl = await fileToDataURL(file);    // Convierte a dataURL "data:image/...;base64,AAAA"
      const base64  = stripDataUrl(dataUrl);    // Deja solo "AAAA..."
      if (hidden) hidden.value = base64;    // Guarda Base64 en hidden
      if (preview) {     // Muestra vista previa
        preview.src = dataUrl;   // Usa el dataURL completo
        preview.style.display = "inline-block"; // La hace visible
      }
    } catch {
      showError("No se pudo leer la imagen.");  // Error leyendo archivo
    }
  });

  loadProducts();   // Carga la tabla al abrir la página
});


function fileToDataURL(file) {  // Convierte archivo a dataURL
  return new Promise((resolve, reject) => {
    const r = new FileReader(); // Lector del navegador
    r.onload = () => resolve(r.result); // Cuando termina, regresa dataURL
    r.onerror = reject; // Si falla, rechaza promesa
    r.readAsDataURL(file);  // Lee como dataURL
  });
}
function stripDataUrl(dataUrl) {    // Quita "data:image/...;base64,"
  const i = dataUrl.indexOf(",");   // Busca coma separadora
  return i >= 0 ? dataUrl.slice(i + 1) : dataUrl;   // Regresa solo la parte Base64
}

async function loadProducts() { // Pide productos al backend
  try {
    const res = await fetch(BASE_URL + "getAll");   // GET /productos/getAll
    const productos = await res.json();  // Respuesta a JSON
    renderProducts(Array.isArray(productos) ? productos : []);  // Dibuja tabla (o vacía)
  } catch (e) {
    console.error("Error al cargar productos", e);  // Log en consola
    showError("No se pudieron cargar los productos");// Mensaje al usuario
  }
}

function renderProducts(productos) {    // Dibuja filas en la tabla
  const tbody = document.getElementById("productsTableBody");   // <tbody> de la tabla
  if (!tbody) return;   // Si no existe, salimos
  tbody.innerHTML = ""; // Limpia la tabla

  productos.forEach((p) => {    // Recorre cada producto
    const tr = document.createElement("tr");    // Crea fila
    tr.className = "hover:bg-gray-50";  // Clase de hover (estilo)
    const precio = (typeof p.precio === "number" && !isNaN(p.precio))   // Formatea precio a 2 decimales
      ? p.precio.toFixed(2) : "0.00";

    const imgSrc = p.imagenBase64   // Si tiene imagen Base64
      ? `data:image/*;base64,${p.imagenBase64}`     // Usa dataURL
      : "imagenes/producto_default.jpg";    // Si no, imagen por defecto

    tr.innerHTML = `     <!-- Crea las celdas -->
      <td>${p.idProducto ?? "-"}</td>
      <td><img src="${imgSrc}" alt="${p.nombreProducto ?? "Producto"}" class="product-img" /></td>
      <td>${p.nombreProducto ?? "-"}</td>
      <td>${p.descripcion ?? "-"}</td>
      <td>$${precio}</td>
      <td>${p.categoria ?? "-"}</td>
      <td class="space-x-2">
        <button class="action-btn edit" onclick="editProduct(${p.idProducto})">  <!-- Botón editar -->
          <i class="fas fa-edit"></i>
        </button>
        <button class="action-btn delete" onclick="deleteProduct(${p.idProducto})"> <!-- Botón eliminar (baja lógica) -->
          <i class="fas fa-trash"></i>
        </button>
      </td>
    `;
    tbody.appendChild(tr);      // Agrega la fila a la tabla
  });
}

function openProductModal(product = null) { // Abre modal (nuevo o editar)
  const modal   = document.getElementById("productModal");  // Modal
  const title   = document.getElementById("productModalTitle"); // Título del modal
  const form    = document.getElementById("productForm");   // Form del modal
  const hidden  = document.getElementById("productImageB64");   // Hidden Base64
  const preview = document.getElementById("productPreview");    // Preview de imagen
  const fileIn  = document.getElementById("productImage");  // Input file

  if (!modal || !title || !form) return;    // Si falta algo, salimos

  title.textContent = product ? "Editar Producto" : "Nuevo Producto";   // Cambia título según modo

  if (product) {    // Si es editar, llena campos
    document.getElementById("productId").value = product.idProducto ?? "";
    document.getElementById("productName").value = product.nombreProducto ?? "";
    document.getElementById("productDesc").value = product.descripcion ?? "";
    document.getElementById("productPrice").value = product.precio ?? "";
    document.getElementById("productCategory").value = product.categoria ?? "";

    if (hidden) hidden.value = product.imagenBase64 || "";  // Guarda Base64 existente
    if (preview) {
      if (product.imagenBase64) {   // Si hay imagen, muéstrala
        preview.src = `data:image/*;base64,${product.imagenBase64}`;
        preview.style.display = "inline-block";
      } else {  // Si no hay, oculta
        preview.style.display = "none";
        preview.src = "";
      }
    }
    if (fileIn) fileIn.value = "";  // Limpia input file
  } else {  // Si es nuevo, limpia todo
    form.reset();
    document.getElementById("productId").value = "";
    if (hidden) hidden.value = "";
    if (preview) { preview.style.display = "none"; preview.src = ""; }
    if (fileIn) fileIn.value = "";
  }

  modal.classList.add("show");  // Muestra el modal
}

function closeProductModal() {  // Cierra y limpia el modal
  const modal   = document.getElementById("productModal");
  const form    = document.getElementById("productForm");
  const hidden  = document.getElementById("productImageB64");
  const preview = document.getElementById("productPreview");
  const fileIn  = document.getElementById("productImage");

  if (modal) modal.classList.remove("show");    // Oculta modal
  if (form) form.reset();   // Limpia formulario
  if (hidden) hidden.value = "";    // Limpia Base64
  if (preview) { preview.style.display = "none"; preview.src = ""; }    // Oculta preview
  if (fileIn) fileIn.value = "";    // Limpia file input
}

async function saveProduct() {  // Inserta o actualiza producto
  const id        = document.getElementById("productId").value.trim();  // Id (si existe, es edición)
  const nombre    = document.getElementById("productName").value.trim();    // Nombre
  const desc      = document.getElementById("productDesc").value.trim();    // Descripción
  const precio    = parseFloat(document.getElementById("productPrice").value);  // Precio (numero)
  const categoria = document.getElementById("productCategory").value.trim();    // Categoría
  const hidden    = document.getElementById("productImageB64"); // Hidden con Base64

  if (!nombre) return showError("El nombre es obligatorio");    // Validación simple
  if (isNaN(precio)) return showError("El precio no es válido");    // Precio válido

  const imagenBase64 = hidden?.value || null;

  const data = {    // Objeto que enviaremos al backend
    idProducto: id ? parseInt(id) : 0,  // 0 si es nuevo
    nombreProducto: nombre,
    descripcion: desc,
    precio: precio,
    categoria: categoria,
    imagenBase64: imagenBase64,  //Se envía la imagen en Base64
  };

  try {
    const url = BASE_URL + (id ? "modificar" : "insertar");     // Endpoint según acción
    const method = id ? "PUT" : "POST"; // Método HTTP según acción

    const res = await fetch(url, {  // Llamada al backend
      method,
      headers: { "Content-Type": "application/json" },  // Enviamos JSON
      body: JSON.stringify(data),   // Datos en el body
    });

    const result = await res.json();    // Respuesta en JSON
    if (!res.ok || result.error) throw new Error(result.error || "Error al guardar"); // Manejo de error

    showSuccess(id ? "Producto actualizado" : "Producto agregado"); // Mensaje de éxito
    closeProductModal();    // Cierra modal
    loadProducts(); // Refresca tabla
  } catch (e) {
    console.error(e);   // Log error
    showError(e.message || "Ocurrió un error al guardar");  // Mensaje al usuario
  }
}

async function editProduct(id) {    // Carga producto y abre modal en modo editar
  try {
    const res = await fetch(BASE_URL + "buscar/" + id); // GET /buscar/{id}
    const producto = await res.json();  // JSON -> objeto
    if (!producto || producto.error) throw new Error("Producto no encontrado"); // Valida existencia
    openProductModal(producto);  // Abre modal con datos cargados
  } catch (e) {
    console.error(e);
    showError("No se pudo cargar el producto");  // Error al cargar
  }
}

async function deleteProduct(id) {   // Baja lógica del producto
  const doDelete = async () => {    // Función que elimina (se llama tras confirmar)
    try {
      const res = await fetch(BASE_URL + "eliminar/" + id, { method: "DELETE" });// DELETE /eliminar/{id}
      const result = await res.json();  // Respuesta JSON
      if (!res.ok || result.error) throw new Error(result.error || "No se pudo eliminar");
      showSuccess("Producto dado de baja"); // Éxito
      loadProducts();   // Refresca tabla
    } catch (e) {
      console.error(e);
      showError(e.message || "No se pudo eliminar");    // Mensaje de error
    }
  };

  if (window.Swal) {    // Si está SweetAlert
    Swal.fire({ // Cuadro de confirmación
      title: "¿Estás seguro?",
      text: "Se dará de baja el producto.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#E31837",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((r) => { if (r.isConfirmed) doDelete(); }); // Si confirma, elimina
  } else {
    if (confirm("¿Estás seguro de eliminar este producto?")) doDelete();    // Fallback con confirm()
  }
}

function searchProducts() { // Filtra productos por texto
  const input = document.getElementById("searchProduct");   // Input de búsqueda
  const q = (input?.value || "").trim().toLowerCase();  // Texto en minúsculas

  fetch(BASE_URL + "getAll")  // Pide todos otra vez
    .then((r) => r.json())  // A JSON
    .then((productos) => {
      const list = Array.isArray(productos) ? productos : [];  // Asegura arreglo
      const filtered = list.filter((p) =>   // Filtra por nombre/desc/categoría
        (p.nombreProducto || "").toLowerCase().includes(q) ||
        (p.descripcion || "").toLowerCase().includes(q) ||
        (p.categoria || "").toLowerCase().includes(q)
      );
      renderProducts(filtered);     // Muestra los filtrados
    })
    .catch((e) => {
      console.error("Error en búsqueda", e);    // Log error
      showError("No se pudo realizar la búsqueda"); // Mensaje error
    });
}

function showSuccess(message) { // Alerta de éxito
  if (window.Swal) Swal.fire({ icon: "success", title: message, confirmButtonColor: "#E31837" });
  else alert(message);
}
function showError(message) {   // Alerta de error
  if (window.Swal) Swal.fire({ icon: "error", title: "Error", text: message, confirmButtonColor: "#E31837" });
  else alert("Error: " + message);
}
