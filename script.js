// ===================================
// NAVIGATION
// ===================================

const navbar = document.getElementById('navbar');
const navBurger = document.getElementById('navBurger');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

// Toggle mobile menu
navBurger.addEventListener('click', () => {
    navBurger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navBurger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Navbar scroll effect
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
});

// Active navigation link on scroll
const sections = document.querySelectorAll('section');

function updateActiveNav() {
    const scrollPosition = window.pageYOffset + 200;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', updateActiveNav);
updateActiveNav();

// ===================================
// LANGUAGE TOGGLE
// ===================================

const langToggle = document.getElementById('langToggle');
let currentLang = 'ru';

const translations = {
    en: {
        elements: document.querySelectorAll('[data-en]')
    },
    ru: {
        elements: document.querySelectorAll('[data-ru]')
    }
};

langToggle.addEventListener('click', () => {
    currentLang = currentLang === 'ru' ? 'en' : 'ru';
    updateLanguage();
});

function updateLanguage() {
    const langText = langToggle.querySelector('.lang-text');
    langText.textContent = currentLang === 'ru' ? 'EN' : 'RU';

    // Update all elements with language attributes
    document.querySelectorAll('[data-en][data-ru]').forEach(element => {
        const text = currentLang === 'en' ? element.getAttribute('data-en') : element.getAttribute('data-ru');

        // Check if it's an input element
        if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
            element.placeholder = text;
        } else if (element.tagName === 'OPTION') {
            element.textContent = text;
        } else {
            element.textContent = text;
        }
    });

    // Store preference
    localStorage.setItem('preferredLanguage', currentLang);
}

// Load saved language preference
const savedLang = localStorage.getItem('preferredLanguage');
if (savedLang && savedLang !== currentLang) {
    currentLang = savedLang;
    updateLanguage();
}

// ===================================
// SMOOTH SCROLL
// ===================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');

        // Skip if it's just "#"
        if (href === '#') {
            e.preventDefault();
            return;
        }

        const target = document.querySelector(href);

        if (target) {
            e.preventDefault();
            const offsetTop = target.offsetTop - 80;

            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ===================================
// SCROLL ANIMATIONS
// ===================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe sections for fade-in animation
document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});

// Observe cards and items
document.querySelectorAll('.achievement-card, .brand-card, .media-card, .detail-item').forEach(item => {
    observer.observe(item);
});

// ===================================
// FORM HANDLING
// ===================================

const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);

        // For demo purposes, just show an alert
        // In production, you would send this to a backend API
        const message = currentLang === 'ru'
            ? 'Спасибо за ваше сообщение! Мы свяжемся с вами в ближайшее время.'
            : 'Thank you for your message! We will contact you soon.';

        alert(message);
        contactForm.reset();

        // Here you would typically send the form data to your backend:
        /*
        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                alert(message);
                contactForm.reset();
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error sending message. Please try again.');
        }
        */
    });
}

// ===================================
// COUNTER ANIMATION
// ===================================

function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);

    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start);
        }
    }, 16);
}

// Animate stats when they come into view
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                const text = stat.textContent.trim();
                if (text.includes('+')) {
                    const num = parseInt(text);
                    animateCounter(stat, num, 2000);
                }
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
    statsObserver.observe(heroStats);
}

// ===================================
// DYNAMIC YEAR IN FOOTER
// ===================================

const yearElements = document.querySelectorAll('.current-year');
const currentYear = new Date().getFullYear();
yearElements.forEach(el => el.textContent = currentYear);

// ===================================
// PARALLAX EFFECT (Optional Enhancement)
// ===================================
// Disabled to keep hero section fixed and stable
// Users reported that the moving hero was distracting

// let ticking = false;

// function updateParallax() {
//     const scrolled = window.pageYOffset;
//     const parallaxElements = document.querySelectorAll('.hero');

//     parallaxElements.forEach(element => {
//         const speed = 0.5;
//         element.style.transform = `translateY(${scrolled * speed}px)`;
//     });

//     ticking = false;
// }

// window.addEventListener('scroll', () => {
//     if (!ticking) {
//         window.requestAnimationFrame(updateParallax);
//         ticking = true;
//     }
// });

// ===================================
// STATS VISIBILITY TRACKING
// ===================================

function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// ===================================
// IMAGE LAZY LOADING (for future images)
// ===================================

if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ===================================
// SCROLL TO TOP BUTTON (Optional)
// ===================================

function createScrollToTopButton() {
    const button = document.createElement('button');
    button.innerHTML = '↑';
    button.className = 'scroll-to-top';
    button.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
        color: white;
        border: none;
        font-size: 24px;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 999;
        box-shadow: 0 4px 15px rgba(255, 69, 0, 0.3);
    `;

    button.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    document.body.appendChild(button);

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 500) {
            button.style.opacity = '1';
            button.style.visibility = 'visible';
        } else {
            button.style.opacity = '0';
            button.style.visibility = 'hidden';
        }
    });
}

// Initialize scroll to top button
createScrollToTopButton();

// ===================================
// PREVENT ORPHANED WIDOW WORDS IN TITLES
// ===================================

function preventWidows() {
    const headings = document.querySelectorAll('h1, h2, h3, .hero-description');
    headings.forEach(heading => {
        const text = heading.innerHTML;
        const words = text.trim().split(' ');
        if (words.length > 3) {
            words[words.length - 2] += '&nbsp;' + words[words.length - 1];
            words.pop();
            heading.innerHTML = words.join(' ');
        }
    });
}

preventWidows();

// ===================================
// EASTER EGG - Konami Code
// ===================================

const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
    if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
            activateEasterEgg();
            konamiIndex = 0;
        }
    } else {
        konamiIndex = 0;
    }
});

function activateEasterEgg() {
    // Add fire emoji rain effect
    const emojis = ['🔥', '💪', '⚒️', '🚒'];
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            createFallingEmoji(emojis[Math.floor(Math.random() * emojis.length)]);
        }, i * 100);
    }
}

function createFallingEmoji(emoji) {
    const element = document.createElement('div');
    element.textContent = emoji;
    element.style.cssText = `
        position: fixed;
        top: -50px;
        left: ${Math.random() * 100}vw;
        font-size: ${20 + Math.random() * 30}px;
        z-index: 9999;
        pointer-events: none;
        animation: fall ${3 + Math.random() * 2}s linear;
    `;

    document.body.appendChild(element);

    setTimeout(() => {
        element.remove();
    }, 5000);
}

// Add falling animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fall {
        to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ===================================
// PERFORMANCE MONITORING
// ===================================

if ('PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
            if (entry.entryType === 'largest-contentful-paint') {
                console.log('LCP:', entry.startTime);
            }
        }
    });
    observer.observe({ entryTypes: ['largest-contentful-paint'] });
}

// ===================================
// ACCESSIBILITY ENHANCEMENTS
// ===================================

// Add skip to main content link
function addSkipLink() {
    const skipLink = document.createElement('a');
    skipLink.href = '#about';
    skipLink.textContent = currentLang === 'ru' ? 'Перейти к содержимому' : 'Skip to content';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 0;
        background: var(--color-primary);
        color: white;
        padding: 8px;
        text-decoration: none;
        z-index: 10000;
    `;
    skipLink.addEventListener('focus', () => {
        skipLink.style.top = '0';
    });
    skipLink.addEventListener('blur', () => {
        skipLink.style.top = '-40px';
    });
    document.body.insertBefore(skipLink, document.body.firstChild);
}

addSkipLink();

// ===================================
// CONSOLE MESSAGE
// ===================================

console.log(`
%c🔥 BATYA_SW - Сила для защиты 🔥
%cРазработано с мощью и профессионализмом
%cИнтересует сотрудничество? Свяжитесь с нами!
`,
'color: #FF4500; font-size: 24px; font-weight: bold;',
'color: #FFD700; font-size: 14px;',
'color: #FFFFFF; font-size: 12px;'
);

// ===================================
// INITIALIZATION COMPLETE
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ Batya_SW website initialized successfully');
});
