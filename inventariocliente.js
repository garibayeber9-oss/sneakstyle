const BASE_URL_INV = "http://localhost:8080/SneakStyle/api/inventario/";

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("searchInventoryBtn");
  if (btn) btn.addEventListener("click", searchInventory);
  loadInventory();
});

/* Carga inicial */
async function loadInventory() {
  try {
    const res = await fetch(BASE_URL_INV + "getAll");
    const data = await res.json();
    const list = normalizeList(data);
    renderInventory(list);
  } catch (e) {
    console.error("Error al cargar inventario", e);
    showError("No se pudo cargar el inventario");
  }
}

/* Render */
function renderInventory(items) {
  const tbody = document.getElementById("inventoryTableBody");
  if (!tbody) return;
  tbody.innerHTML = "";

  if (!Array.isArray(items) || items.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4">Sin registros</td></tr>`;
    return;
  }

  items.forEach((it) => {
    const id = it.idInventario ?? it.id_inventario ?? "-";
    const prod =
      it.productoNombre ||
      (it.producto && it.producto.nombreProducto) ||
      it.producto ||
      "(sin producto)";
    const prov =
      it.proveedorNombre ||
      (it.proveedor &&
        (it.proveedor.nombreProveedor || it.proveedor.nombreEmpresa)) ||
      it.proveedor ||
      "(sin proveedor)";
    const cant = it.cantidad ?? 0;

    const tr = document.createElement("tr");
    tr.className = "hover:bg-gray-50";
    tr.innerHTML = `
      <td>${id}</td>
      <td>${prod}</td>
      <td>${prov}</td>
      <td>${cant}</td>
    `;
    tbody.appendChild(tr);
  });
}

/* Búsqueda (por id, producto, proveedor) */
function searchInventory() {
  const q = (document.getElementById("searchInventory")?.value || "")
    .trim()
    .toLowerCase();

  fetch(BASE_URL_INV + "getAll")
    .then((r) => r.json())
    .then((data) => {
      const list = normalizeList(data);
      const filtered = list.filter((it) => {
        const id = String(it.idInventario ?? it.id_inventario ?? "");
        const prod = (
          it.productoNombre ||
          (it.producto && it.producto.nombreProducto) ||
          it.producto ||
          ""
        ).toString().toLowerCase();
        const prov = (
          it.proveedorNombre ||
          (it.proveedor &&
            (it.proveedor.nombreProveedor || it.proveedor.nombreEmpresa)) ||
          it.proveedor ||
          ""
        ).toString().toLowerCase();

        return id.includes(q) || prod.includes(q) || prov.includes(q);
      });

      renderInventory(filtered);
    })
    .catch((e) => {
      console.error("Error en búsqueda", e);
      showError("No se pudo realizar la búsqueda");
    });
}

/* Helpers */
function normalizeList(data) {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.inventario)) return data.inventario;
  if (data && Array.isArray(data.data)) return data.data;
  return [];
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
