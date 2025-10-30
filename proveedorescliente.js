const BASE_URL = "http://localhost:8080/SneakStyle/api/proveedores/";

document.addEventListener("DOMContentLoaded", () => {
  console.log("JS cargado");

  const searchBtn = document.getElementById("searchProviderBtn");
  if (searchBtn) {
    searchBtn.addEventListener("click", searchProviders);
  }

  loadProviders();
});

async function loadProviders() {
  try {
    const response = await fetch(BASE_URL + "getAll");
    const proveedores = await response.json();
    renderProviders(proveedores);
  } catch (error) {
    console.error("Error al cargar proveedores", error);
    showError("No se pudieron cargar los proveedores");
  }
}

function renderProviders(proveedores) {
  const tableBody = document.getElementById("providersTableBody");
  tableBody.innerHTML = "";

  proveedores.forEach((p) => {
    const row = document.createElement("tr");
    row.className = "hover:bg-gray-50";
    row.innerHTML = `
      <td>${p.idProveedor}</td>
      <td>${p.nombreContacto || "-"}</td>
      <td>${p.nombreEmpresa || "-"}</td>
      <td>${p.telefono || "-"}</td>
      <td>${p.direccion || "-"}</td>
    `;
    tableBody.appendChild(row);
  });
}

function searchProviders() {
  const query = document.getElementById("searchProvider").value.trim().toLowerCase();

  fetch(BASE_URL + "getAll")
    .then((res) => res.json())
    .then((proveedores) => {
      const filtered = proveedores.filter(
        (p) =>
          (p.nombreEmpresa && p.nombreEmpresa.toLowerCase().includes(query)) ||
          (p.nombreContacto && p.nombreContacto.toLowerCase().includes(query)) ||
          (p.direccion && p.direccion.toLowerCase().includes(query))
      );
      renderProviders(filtered);
    })
    .catch((error) => {
      console.error("Error en búsqueda", error);
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
