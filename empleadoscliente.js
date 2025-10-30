const BASE_URL = "http://localhost:8080/SneakStyle/api/empleados/";

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("searchEmpleadoBtn").addEventListener("click", searchEmpleados);
  loadEmpleados();
});

async function loadEmpleados() {
  try {
    const response = await fetch(BASE_URL + "getAll");
    const empleados = await response.json();
    renderEmpleados(empleados);
  } catch (error) {
    console.error("Error al cargar empleados", error);
    showError("No se pudieron cargar los empleados");
  }
}

function renderEmpleados(lista) {
  const tbody = document.getElementById("empleadosTableBody");
  tbody.innerHTML = "";

  lista.forEach((e) => {
    const row = document.createElement("tr");
    row.className = "hover:bg-gray-50";
    row.innerHTML = `
      <td>${e.idEmpleado}</td>
      <td>${e.nombreCompleto || "-"}</td>
      <td>${e.telefono || "-"}</td>
      <td>${e.correoUsuario || "-"}</td>
    `;
    tbody.appendChild(row);
  });
}

function searchEmpleados() {
  const query = document.getElementById("searchEmpleado").value.trim().toLowerCase();

  fetch(BASE_URL + "getAll")
    .then((res) => res.json())
    .then((empleados) => {
      const filtered = empleados.filter(
        (e) =>
          (e.nombreCompleto && e.nombreCompleto.toLowerCase().includes(query)) ||
          (e.telefono && e.telefono.toLowerCase().includes(query)) ||
          (e.correoUsuario && e.correoUsuario.toLowerCase().includes(query))
      );
      renderEmpleados(filtered);
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
