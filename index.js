document.addEventListener('DOMContentLoaded', function() {
    // Toggle password visibility
    const togglePassword = document.querySelector('.toggle-password');
    const passwordInput = document.getElementById('password');
    
    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', function() {
            const icon = this.querySelector('i');
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            // Toggle eye icon
            icon.classList.toggle('fa-eye');
            icon.classList.toggle('fa-eye-slash');
            
            // Change icon color
            icon.style.color = type === 'text' ? 'var(--dark-gray)' : 'var(--medium-gray)';
        });
    }
    
    // Add hover effect to animated buttons
    const animatedButtons = document.querySelectorAll('.animated-btn');
    animatedButtons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.boxShadow = '0 5px 10px rgba(0, 0, 0, 0.1)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.boxShadow = 'none';
        });
    });
    
    // Add hover effect to social buttons
    const socialButtons = document.querySelectorAll('.social-btn');
    socialButtons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.boxShadow = 'none';
        });
    });
    
    // Add focus effect to form inputs
    const formInputs = document.querySelectorAll('.input-group input');
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.querySelector('.input-icon').style.color = 'var(--dark-gray)';
            this.parentElement.style.boxShadow = '0 0 0 2px rgba(51, 51, 51, 0.1)';
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.querySelector('.input-icon').style.color = 'var(--medium-gray)';
            this.parentElement.style.boxShadow = 'none';
        });
    });
    
    // Handle form submission
    const loginForm = document.getElementById('loginForm');
    const loginBtn = document.getElementById('loginBtn');
    
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            // Mostrar loader
            const originalBtnText = loginBtn.innerHTML;
            loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Validando...';
            loginBtn.disabled = true;
            
            try {
                const response = await fetch('http://localhost:8080/SneakStyle/api/login/auth', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        correo_usuario: email,
                        contra_usuario: password
                    })
                });
                
                const data = await response.json();
                
                if (data.success) {
                    // Login exitoso
                    showAlert('success', data.message);
                    
                    // Guardar usuario en localStorage
                    localStorage.setItem('sneakstyle_user', JSON.stringify(data.user));
                    
                    // Redireccionar según el rol
                    setTimeout(() => {
                        if (data.user.rol_usuario === 'admin') {
                            window.location.href = 'admin.html';
                        } else {
                            window.location.href = 'Principal.html'; // Redirección a Principal.html para clientes
                        }
                    }, 1500);
                } else {
                    // Error en credenciales
                    showAlert('error', data.message);
                }
            } catch (error) {
                console.error('Error:', error);
                showAlert('error', 'Error al conectar con el servidor');
            } finally {
                // Restaurar botón
                loginBtn.innerHTML = originalBtnText;
                loginBtn.disabled = false;
            }
        });
    }
    
    // Función para mostrar alertas
    function showAlert(type, message) {
        // Eliminar alertas anteriores
        const existingAlert = document.querySelector('.custom-alert');
        if (existingAlert) {
            existingAlert.remove();
        }
        
        // Crear elemento de alerta
        const alertDiv = document.createElement('div');
        alertDiv.className = `custom-alert alert-${type}`;
        alertDiv.textContent = message;
        
        // Añadir al DOM
        document.body.appendChild(alertDiv);
        
        // Mostrar animación
        setTimeout(() => {
            alertDiv.style.opacity = '1';
            alertDiv.style.transform = 'translateY(0)';
        }, 10);
        
        // Ocultar después de 3 segundos
        setTimeout(() => {
            alertDiv.style.opacity = '0';
            alertDiv.style.transform = 'translateY(-20px)';
            setTimeout(() => alertDiv.remove(), 300);
        }, 3000);
    }
});