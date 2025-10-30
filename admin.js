document.addEventListener('DOMContentLoaded', function() {
    // Verificar si el usuario está logueado y es admin
    const user = JSON.parse(localStorage.getItem('sneakstyle_user'));
    
    if (!user || user.rol_usuario !== 'admin') {
        window.location.href = 'index.html';
        return;
    }
    
    // Mostrar nombre de usuario
    document.getElementById('welcomeMessage').textContent = `Bienvenido ${user.nombre_usuario} (${user.rol_usuario})`;
    
    // Manejar logout
    document.getElementById('logout').addEventListener('click', function() {
        localStorage.removeItem('sneakstyle_user');
        window.location.href = 'index.html';
    });
    
    // Botones de administración
    document.getElementById('manageProducts').addEventListener('click', function() {
        window.location.href = 'Productos.html';
    });
    
    document.getElementById('manageSuppliers').addEventListener('click', function() {
        window.location.href = 'admin-suppliers.html';
    });
    
    document.getElementById('manageUsers').addEventListener('click', function() {
        window.location.href = 'admin-users.html';
    });
    
    document.getElementById('manageInventory').addEventListener('click', function() {
        window.location.href = 'admin-inventory.html';
    });
    
    // Efectos hover para botones
    const adminButtons = document.querySelectorAll('.admin-btn');
    adminButtons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 10px 15px rgba(0, 0, 0, 0.2)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        });
    });
});