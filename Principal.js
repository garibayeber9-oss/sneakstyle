document.addEventListener('DOMContentLoaded', function() {
    // Menú mobile
    const mobileMenuButton = document.querySelector('.md\\:hidden');
    const mobileMenu = document.createElement('div');
    mobileMenu.className = 'mobile-menu hidden py-4 px-6';
    mobileMenu.innerHTML = `
        <div class="flex flex-col space-y-4">
            <a href="#" class="text-dark-gray hover:text-black">Novedades</a>
            <a href="#" class="text-dark-gray hover:text-black">Hombres</a>
            <a href="#" class="text-dark-gray hover:text-black">Mujeres</a>
            <a href="#" class="text-dark-gray hover:text-black">Niños</a>
            <a href="#" class="text-dark-gray hover:text-black">Colecciones</a>
        </div>
    `;
    document.querySelector('nav').appendChild(mobileMenu);
    
    mobileMenuButton.addEventListener('click', function() {
        mobileMenu.classList.toggle('hidden');
        mobileMenu.classList.toggle('block');
    });
    
    // Carrusel de productos (simplificado)
    let currentSlide = 0;
    const slides = document.querySelectorAll('.testimonial-slide');
    
    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.style.transform = `translateX(${100 * (i - index)}%)`;
        });
    }
    
    // Botones de favoritos
    const favoriteButtons = document.querySelectorAll('[aria-label="Añadir a favoritos"]');
    favoriteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const icon = this.querySelector('i');
            icon.classList.toggle('bi-heart');
            icon.classList.toggle('bi-heart-fill');
            icon.classList.toggle('text-red-500');
            
            // Efecto de confeti al añadir a favoritos
            if (icon.classList.contains('bi-heart-fill')) {
                createConfetti(this);
            }
        });
    });
    
    // Efecto de confeti
    function createConfetti(element) {
        const rect = element.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top;
        
        for (let i = 0; i < 20; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti absolute w-2 h-2 bg-red-500 rounded-full';
            confetti.style.left = `${x}px`;
            confetti.style.top = `${y}px`;
            confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
            
            document.body.appendChild(confetti);
            
            const angle = Math.random() * Math.PI * 2;
            const velocity = 3 + Math.random() * 3;
            const rotationSpeed = (Math.random() - 0.5) * 20;
            let rotation = 0;
            
            let posX = x;
            let posY = y;
            let opacity = 1;
            
            const animate = () => {
                posX += Math.cos(angle) * velocity;
                posY += Math.sin(angle) * velocity + 0.5; // gravedad
                rotation += rotationSpeed;
                opacity -= 0.02;
                
                confetti.style.left = `${posX}px`;
                confetti.style.top = `${posY}px`;
                confetti.style.transform = `rotate(${rotation}deg)`;
                confetti.style.opacity = opacity;
                
                if (opacity > 0) {
                    requestAnimationFrame(animate);
                } else {
                    confetti.remove();
                }
            };
            
            requestAnimationFrame(animate);
        }
    }
    
    // Animación al hacer scroll
    function animateOnScroll() {
        const elements = document.querySelectorAll('.animate-on-scroll');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - 100) {
                element.classList.add('animate-fade-in-up');
            }
        });
    }
    
    // Inicializar animaciones
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll();
});