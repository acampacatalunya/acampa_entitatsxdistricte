// script.js - Funcionalitat per a la presentació de Centres Cívics

// Variables globals
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;
const prevButton = document.getElementById('prevSlide');
const nextButton = document.getElementById('nextSlide');
const progressBar = document.getElementById('progressBar');
const currentSlideSpan = document.getElementById('currentSlide');
const totalSlidesSpan = document.getElementById('totalSlides');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

// Inicialització
document.addEventListener('DOMContentLoaded', () => {
    totalSlidesSpan.textContent = totalSlides;
    updateSlide();
    updateProgressBar();
    setupEventListeners();
    setupKeyboardNavigation();
    setupSmoothScroll();
});

// Configurar event listeners
function setupEventListeners() {
    // Botons de navegació
    prevButton.addEventListener('click', () => changeSlide(-1));
    nextButton.addEventListener('click', () => changeSlide(1));

    // Toggle menú mòbil
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    // Tancar menú mòbil en fer clic a un enllaç
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });

    // Actualitzar barra de progrés en fer scroll
    window.addEventListener('scroll', updateProgressBar);
}

// Navegació per teclat
function setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        switch(e.key) {
            case 'ArrowLeft':
            case 'PageUp':
                changeSlide(-1);
                break;
            case 'ArrowRight':
            case 'PageDown':
                changeSlide(1);
                break;
            case 'Home':
                goToSlide(0);
                break;
            case 'End':
                goToSlide(totalSlides - 1);
                break;
        }
    });
}

// Smooth scroll per als enllaços del menú
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSlide = document.querySelector(targetId);
            
            if (targetSlide) {
                const slideIndex = Array.from(slides).indexOf(targetSlide);
                if (slideIndex !== -1) {
                    goToSlide(slideIndex);
                }
            }
        });
    });
}

// Canviar diapositiva
function changeSlide(direction) {
    const newIndex = currentSlide + direction;
    
    if (newIndex >= 0 && newIndex < totalSlides) {
        goToSlide(newIndex);
    }
}

// Anar a una diapositiva específica
function goToSlide(index) {
    if (index < 0 || index >= totalSlides) return;

    // Amagar diapositiva actual
    slides[currentSlide].classList.remove('active');
    
    // Actualitzar índex
    currentSlide = index;
    
    // Mostrar nova diapositiva
    slides[currentSlide].classList.add('active');
    
    // Fer scroll a la part superior de la diapositiva
    slides[currentSlide].scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    // Actualitzar UI
    updateSlide();
    updateProgressBar();
}

// Actualitzar estat de la diapositiva actual
function updateSlide() {
    currentSlideSpan.textContent = currentSlide + 1;
    
    // Actualitzar estat dels botons
    prevButton.style.opacity = currentSlide === 0 ? '0.5' : '1';
    prevButton.style.pointerEvents = currentSlide === 0 ? 'none' : 'auto';
    
    nextButton.style.opacity = currentSlide === totalSlides - 1 ? '0.5' : '1';
    nextButton.style.pointerEvents = currentSlide === totalSlides - 1 ? 'none' : 'auto';
}

// Actualitzar barra de progrés
function updateProgressBar() {
    const scrollPosition = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight - windowHeight;
    const progress = (scrollPosition / documentHeight) * 100;
    
    progressBar.style.width = `${Math.min(progress, 100)}%`;
}

// Funció per destacar targetes en passar el ratolí
function setupCardInteractions() {
    const cards = document.querySelectorAll('.center-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Funció per filtrar centres per accessibilitat
function filterByAccessibility(level) {
    const cards = document.querySelectorAll('.center-card');
    
    cards.forEach(card => {
        const accessibilityText = card.textContent.toLowerCase();
        
        if (level === 'total') {
            card.style.display = accessibilityText.includes('accessibilitat: total') ? 'block' : 'none';
        } else if (level === 'adaptat') {
            card.style.display = accessibilityText.includes('adaptat') ? 'block' : 'none';
        } else {
            card.style.display = 'block';
        }
    });
}

// Funció per cercar centres per nom o barri
function searchCenters(searchTerm) {
    const cards = document.querySelectorAll('.center-card');
    const term = searchTerm.toLowerCase();
    
    cards.forEach(card => {
        const text = card.textContent.toLowerCase();
        card.style.display = text.includes(term) ? 'block' : 'none';
    });
}

// Funció per obtenir informació de contacte
function getContactInfo(centerName) {
    const cards = document.querySelectorAll('.center-card');
    
    cards.forEach(card => {
        if (card.querySelector('h3').textContent.includes(centerName)) {
            const phone = card.querySelector('p:nth-child(4)')?.textContent || 'No disponible';
            const web = card.querySelector('a')?.href || 'No disponible';
            const address = card.querySelector('p:nth-child(3)')?.textContent || 'No disponible';
            
            console.log(`
Centre: ${centerName}
Adreça: ${address}
Telèfon: ${phone}
Web: ${web}
            `);
        }
    });
}

// Exportar funcions per a ús extern (consola)
window.PresentacioCentres = {
    goToSlide,
    changeSlide,
    filterByAccessibility,
    searchCenters,
    getContactInfo,
    totalSlides
};

// Animació d'entrada per a les targetes
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observar totes les targetes
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.center-card, .checklist-item, .rec-card');
    
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;
        observer.observe(card);
    });
});

// Funció per imprimir la presentació
function printPresentation() {
    window.print();
}

// Afegir drecera de teclat per imprimir (Ctrl+P o Cmd+P)
document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        printPresentation();
    }
});

// Mostrar ajuda a la consola
console.log(`
️ Presentació de Centres Cívics de Barcelona
══════════════════════════════════════════════

Funcions disponibles:
• PresentacioCentres.goToSlide(número) - Anar a una diapositiva
• PresentacioCentres.changeSlide(direcció) - Canviar diapositiva (+1 o -1)
• PresentacioCentres.filterByAccessibility('total' | 'adaptat') - Filtrar per accessibilitat
• PresentacioCentres.searchCenters('terme') - Cercar centres
• PresentacioCentres.getContactInfo('nom centre') - Obtenir informació de contacte
• PresentacioCentres.totalSlides - Total de diapositives

Navegació per teclat:
• Fletxa esquerra / RePàg - Diapositiva anterior
• Fletxa dreta / AvPàg - Diapositiva següent
• Inici - Primera diapositiva
• Fi - Última diapositiva
• Ctrl+P / Cmd+P - Imprimir

══════════════════════════════════════════════
`);
