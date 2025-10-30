// js/productoscliente.js
const BASE_URL = "http://localhost:8080/SneakStyle/api/productos/";

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("searchProductBtn");
  if (btn) btn.addEventListener("click", searchProducts);
  loadProducts();
});

async function loadProducts() {
  try {
    const res = await fetch(BASE_URL + "getAll");
    const productos = await res.json();
    renderProducts(Array.isArray(productos) ? productos : []);
  } catch (e) {
    console.error("Error al cargar productos", e);
    showError("No se pudieron cargar los productos");
  }
}

function normalizeImageSrc(p) {
  const PLACEHOLDER = "imagenes/producto_default.jpg";

  // 1) ¿Hay una URL directa que venga del backend?
  let url = p.imagenUrl || p.urlImagen || null;
  // O tal vez guardaste el nombre de archivo; expón /imagenes/** en tu backend
  if (!url && p.nombreArchivoImagen) url = `/imagenes/${encodeURIComponent(p.nombreArchivoImagen)}`;
  if (!url && typeof p.imagen === "string" && (p.imagen.includes("/") || p.imagen.includes("."))) {
    // si "imagen" parece ruta o nombre de archivo
    url = p.imagen.startsWith("http") || p.imagen.startsWith("/") ? p.imagen : `/imagenes/${encodeURIComponent(p.imagen)}`;
  }

  // 2) ¿Hay base64?
  let b64 =
    p.imagenBase64 || p.imagen_base64 || p.fotoBase64 || p.foto || "";

  if (typeof b64 === "string") {
    b64 = b64.trim();
    // si ya viene con "data:image", úsalo como está (pero limpiando espacios)
    if (b64.startsWith("data:image")) {
      b64 = b64.replace(/\s+/g, ""); // quitar saltos de línea/espacios
    } else if (b64.length > 0) {
      // viene sin prefijo; quita espacios y agrega prefijo
      b64 = `data:image/*;base64,${b64.replace(/\s+/g, "")}`;
    } else {
      b64 = "";
    }
  } else {
    b64 = "";
  }

  // 3) Orden de preferencia: URL → Base64 → placeholder
  return url || b64 || PLACEHOLDER;
}

function renderProducts(productos) {
  const tbody = document.getElementById("productsTableBody");
  if (!tbody) return;
  tbody.innerHTML = "";

  if (!Array.isArray(productos) || productos.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" class="text-center text-sm text-gray-500">Sin productos</td></tr>`;
    return;
  }

  productos.forEach((p) => {
    const precio = Number.isFinite(+p.precio) ? (+p.precio).toFixed(2) : "0.00";
    const src = normalizeImageSrc(p);

    const tr = document.createElement("tr");
    tr.className = "hover:bg-gray-50";
    tr.innerHTML = `
      <td>${p.idProducto ?? "-"}</td>
      <td>
        <img
          src="${src}"
          alt="${p.nombreProducto ?? "Producto"}"
          class="product-img"
          loading="lazy"
          onerror="this.onerror=null; this.src='imagenes/producto_default.jpg';"
        />
      </td>
      <td>${p.nombreProducto ?? "-"}</td>
      <td>${p.descripcion ?? "-"}</td>
      <td>$${precio}</td>
      <td>${p.categoria ?? "-"}</td>
      <!-- si tu tabla cliente NO tiene 'Acciones', ignora la col -->
    `;
    tbody.appendChild(tr);
  });
}

function searchProducts() {
  const q = (document.getElementById("searchProduct")?.value || "").trim().toLowerCase();

  fetch(BASE_URL + "getAll")
    .then((r) => r.json())
    .then((productos) => {
      const list = Array.isArray(productos) ? productos : [];
      const filtered = list.filter((p) =>
        (p.nombreProducto || "").toLowerCase().includes(q) ||
        (p.descripcion || "").toLowerCase().includes(q) ||
        (p.categoria || "").toLowerCase().includes(q)
      );
      renderProducts(filtered);
    })
    .catch((e) => {
      console.error("Error en búsqueda", e);
      showError("No se pudo realizar la búsqueda");
    });
}

function showError(message) {
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
