// Authentication Functions
function initAuthentication() {
    // Initialize authentication system
    initAuthModals();
    initAuthForms();
    checkAuthState();
}

function initAuthModals() {
    const loginBtn = document.querySelector('.login-btn');
    const registerBtn = document.querySelector('.register-btn');
    const loginModal = document.getElementById('loginModal');
    const registerModal = document.getElementById('registerModal');
    const modalCloses = document.querySelectorAll('.modal-close');
    const switchToRegister = document.querySelector('.switch-to-register');
    const switchToLogin = document.querySelector('.switch-to-login');

    // Open login modal
    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            loginModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    // Open register modal
    if (registerBtn) {
        registerBtn.addEventListener('click', () => {
            registerModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    // Close modals
    modalCloses.forEach(closeBtn => {
        closeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const modal = closeBtn.closest('.modal');
            modal.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Switch between login and register
    if (switchToRegister) {
        switchToRegister.addEventListener('click', (e) => {
            e.preventDefault();
            loginModal.classList.remove('active');
            registerModal.classList.add('active');
        });
    }

    if (switchToLogin) {
        switchToLogin.addEventListener('click', (e) => {
            e.preventDefault();
            registerModal.classList.remove('active');
            loginModal.classList.add('active');
        });
    }

    // Close modal when clicking outside
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const activeModal = document.querySelector('.modal.active');
            if (activeModal) {
                activeModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
    });
}

function initAuthForms() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
}

function handleLogin(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');

    // Clear previous errors
    clearErrors('login');

    // Validate inputs
    let isValid = true;

    if (!email) {
        showError('loginEmail', 'Email is required');
        isValid = false;
    } else if (!isValidEmail(email)) {
        showError('loginEmail', 'Please enter a valid email');
        isValid = false;
    }

    if (!password) {
        showError('loginPassword', 'Password is required');
        isValid = false;
    }

    if (!isValid) return;

    // Simulate login (replace with actual API call)
    simulateLogin(email, password);
}

function handleRegister(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = formData.get('name');
    const email = formData.get('email');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');

    // Clear previous errors
    clearErrors('register');

    // Validate inputs
    let isValid = true;

    if (!name) {
        showError('registerName', 'Full name is required');
        isValid = false;
    }

    if (!email) {
        showError('registerEmail', 'Email is required');
        isValid = false;
    } else if (!isValidEmail(email)) {
        showError('registerEmail', 'Please enter a valid email');
        isValid = false;
    }

    if (!password) {
        showError('registerPassword', 'Password is required');
        isValid = false;
    } else if (password.length < 6) {
        showError('registerPassword', 'Password must be at least 6 characters');
        isValid = false;
    }

    if (!confirmPassword) {
        showError('registerConfirmPassword', 'Please confirm your password');
        isValid = false;
    } else if (password !== confirmPassword) {
        showError('registerConfirmPassword', 'Passwords do not match');
        isValid = false;
    }

    if (!isValid) return;

    // Simulate registration (replace with actual API call)
    simulateRegistration(name, email, password);
}

function showError(fieldId, message) {
    const errorElement = document.getElementById(fieldId + 'Error');
    if (errorElement) {
        errorElement.textContent = message;
    }
}

function clearErrors(formType) {
    const errorElements = document.querySelectorAll(`#${formType}Form .error-message`);
    errorElements.forEach(element => {
        element.textContent = '';
    });
}

function simulateLogin(email, password) {
    const loginBtn = document.querySelector('#loginForm button[type="submit"]');
    const originalText = loginBtn.textContent;
    
    // Show loading state
    loginBtn.textContent = 'Logging in...';
    loginBtn.disabled = true;

    // Simulate API call
    setTimeout(() => {
        // Check if user exists in localStorage
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            // Successful login
            localStorage.setItem('currentUser', JSON.stringify(user));
            updateUIAfterLogin(user);
            showNotification('Login successful!', 'success');
            document.getElementById('loginModal').classList.remove('active');
            document.body.style.overflow = '';
        } else {
            // Failed login
            showError('loginPassword', 'Invalid email or password');
            showNotification('Invalid credentials', 'error');
        }

        // Reset button
        loginBtn.textContent = originalText;
        loginBtn.disabled = false;
    }, 1500);
}

function simulateRegistration(name, email, password) {
    const registerBtn = document.querySelector('#registerForm button[type="submit"]');
    const originalText = registerBtn.textContent;
    
    // Show loading state
    registerBtn.textContent = 'Creating account...';
    registerBtn.disabled = true;

    // Simulate API call
    setTimeout(() => {
        // Check if email already exists
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const existingUser = users.find(u => u.email === email);

        if (existingUser) {
            showError('registerEmail', 'Email already registered');
            showNotification('Email already exists', 'error');
            registerBtn.textContent = originalText;
            registerBtn.disabled = false;
            return;
        }

        // Create new user
        const newUser = {
            id: Date.now(),
            name,
            email,
            password,
            createdAt: new Date().toISOString()
        };

        // Save user
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(newUser));

        // Update UI
        updateUIAfterLogin(newUser);
        showNotification('Account created successfully!', 'success');
        document.getElementById('registerModal').classList.remove('active');
        document.body.style.overflow = '';

        // Reset button
        registerBtn.textContent = originalText;
        registerBtn.disabled = false;
    }, 1500);
}

function updateUIAfterLogin(user) {
    // Hide auth buttons
    const authButtons = document.querySelector('.auth-buttons');
    const userMenu = document.querySelector('.user-menu');
    
    if (authButtons) authButtons.style.display = 'none';
    if (userMenu) userMenu.style.display = 'flex';

    // Update user info
    const usernameSpan = document.querySelector('.username');
    if (usernameSpan) {
        usernameSpan.textContent = user.name;
    }
}

function checkAuthState() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    
    if (currentUser) {
        updateUIAfterLogin(currentUser);
    }
}

function logout() {
    localStorage.removeItem('currentUser');
    
    // Show auth buttons
    const authButtons = document.querySelector('.auth-buttons');
    const userMenu = document.querySelector('.user-menu');
    
    if (authButtons) authButtons.style.display = 'flex';
    if (userMenu) userMenu.style.display = 'none';

    showNotification('Logged out successfully', 'success');
}

// Initialize logout functionality
function initLogout() {
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    }
}

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize authentication first
    initAuthentication();
    initLogout();
    
    // Initialize all other functionality
    initNavigation();
    initTypingEffect();
    initSmoothScrolling();
    initAnimations();
    initFormHandling();
    initMobileMenu();
});

// Navigation and Smooth Scrolling
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');
    
    // Highlight active section in navigation
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// Typing Effect in Hero Section
function initTypingEffect() {
    const typedText = document.querySelector('.typed-text');
    const cursor = document.querySelector('.cursor');
    
    const textArray = [
        'responsive websites',
        'web applications',
        'user experiences',
        'digital solutions'
    ];
    
    let textArrayIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingDelay = 100;
    let erasingDelay = 50;
    let newTextDelay = 2000;
    
    function type() {
        if (charIndex < textArray[textArrayIndex].length && !isDeleting) {
            typedText.textContent += textArray[textArrayIndex].charAt(charIndex);
            charIndex++;
            setTimeout(type, typingDelay);
        } else if (isDeleting && charIndex > 0) {
            typedText.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
            charIndex--;
            setTimeout(type, erasingDelay);
        } else {
            isDeleting = !isDeleting;
            if (!isDeleting) {
                textArrayIndex++;
                if (textArrayIndex >= textArray.length) textArrayIndex = 0;
            }
            setTimeout(type, newTextDelay);
        }
    }
    
    // Start typing effect after a short delay
    setTimeout(type, 1000);
}

// Smooth Scrolling for Navigation Links
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Close mobile menu if open
                const hamburger = document.querySelector('.hamburger');
                const navMenu = document.querySelector('.nav-menu');
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    });
}

// Scroll Animations
function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe all elements with fade-in class
    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });

    // Add fade-in class to sections for animation
    document.querySelectorAll('section').forEach((section, index) => {
        section.classList.add('fade-in');
        // Add delay based on section order
        section.style.transitionDelay = `${index * 0.1}s`;
    });
}

// Form Handling
function initFormHandling() {
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const name = formData.get('name') || this.querySelector('input[type="text"]').value;
            const email = formData.get('email') || this.querySelector('input[type="email"]').value;
            const message = formData.get('message') || this.querySelector('textarea').value;
            
            // Simple validation
            if (!name || !email || !message) {
                showNotification('Please fill in all fields', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showNotification('Please enter a valid email address', 'error');
                return;
            }
            
            // Simulate form submission (replace with actual form submission)
            simulateFormSubmission(name, email, message);
        });
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function simulateFormSubmission(name, email, message) {
    // Show loading state
    const submitBtn = document.querySelector('.contact-form button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Success message
        showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
        
        // Reset form
        document.querySelector('.contact-form').reset();
        
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }, 2000);
}

function showNotification(message, type) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 5px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        min-width: 300px;
        text-align: center;
    `;
    
    if (type === 'success') {
        notification.style.background = 'var(--accent)';
    } else {
        notification.style.background = '#dc3545';
    }
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Mobile Menu Toggle
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
}

// Portfolio Item Hover Effects
function initPortfolioHover() {
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    portfolioItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.transform = 'translateY(-10px) scale(1.02)';
            item.style.boxShadow = '0 25px 50px rgba(0, 0, 0, 0.4)';
        });
        
        item.addEventListener('mouseleave', () => {
            item.style.transform = 'translateY(0) scale(1)';
            item.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.2)';
        });
    });
}

// Skill Item Animation
function initSkillAnimations() {
    const skillItems = document.querySelectorAll('.skill-item');
    
    skillItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
        item.classList.add('fade-in');
    });
}

// Service Item Hover Effects
function initServiceHover() {
    const serviceItems = document.querySelectorAll('.service-item');
    
    serviceItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            const icon = item.querySelector('.service-icon');
            icon.style.transform = 'scale(1.1) rotate(5deg)';
            icon.style.background = 'linear-gradient(45deg, var(--accent), #ff8c66)';
        });
        
        item.addEventListener('mouseleave', () => {
            const icon = item.querySelector('.service-icon');
            icon.style.transform = 'scale(1) rotate(0)';
            icon.style.background = 'var(--accent)';
        });
    });
}

// Scroll to Top Button
function initScrollToTop() {
    const scrollBtn = document.createElement('button');
    scrollBtn.innerHTML = '↑';
    scrollBtn.className = 'scroll-to-top';
    scrollBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: var(--accent);
        color: white;
        border: none;
        cursor: pointer;
        font-size: 1.2rem;
        font-weight: bold;
        opacity: 0;
        transform: translateY(100px);
        transition: all 0.3s ease;
        z-index: 1000;
        box-shadow: 0 5px 15px rgba(255, 107, 53, 0.3);
    `;
    
    document.body.appendChild(scrollBtn);
    
    scrollBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            scrollBtn.style.opacity = '1';
            scrollBtn.style.transform = 'translateY(0)';
        } else {
            scrollBtn.style.opacity = '0';
            scrollBtn.style.transform = 'translateY(100px)';
        }
    });
}

// Initialize additional features
function initAdditionalFeatures() {
    initPortfolioHover();
    initSkillAnimations();
    initServiceHover();
    initScrollToTop();
}

// Load additional features after main content
window.addEventListener('load', initAdditionalFeatures);

// Performance optimization: Lazy loading for images
document.addEventListener('DOMContentLoaded', function() {
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    }
});

// Add CSS for scroll-to-top button
const scrollToTopStyles = `
.scroll-to-top:hover {
    background: var(--accent-hover);
    transform: translateY(-3px) scale(1.1);
    box-shadow: 0 8px 25px rgba(255, 107, 53, 0.4);
}
`;

// Inject styles
const styleSheet = document.createElement('style');
styleSheet.textContent = scrollToTopStyles;
document.head.appendChild(styleSheet);

// Handle page loading
window.addEventListener('load', function() {
    // Remove loading screen if exists
    const loadingScreen = document.querySelector('.loading');
    if (loadingScreen) {
        loadingScreen.classList.add('hidden');
        setTimeout(() => {
            loadingScreen.remove();
        }, 500);
    }
    
    // Initialize animations after page load
    setTimeout(initAnimations, 100);
});

// Add error handling for images
document.addEventListener('error', function(e) {
    if (e.target.tagName === 'IMG') {
        e.target.style.display = 'none';
        console.warn('Image failed to load:', e.target.src);
    }
}, true);

// Add keyboard navigation support
document.addEventListener('keydown', function(e) {
    // Escape key closes mobile menu
    if (e.key === 'Escape') {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        if (hamburger && navMenu && hamburger.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    }
});

// Add touch device detection for hover effects
function isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

if (isTouchDevice()) {
    document.body.classList.add('touch-device');
}

// Export functions for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initNavigation,
        initTypingEffect,
        initSmoothScrolling,
        initAnimations,
        initFormHandling
    };
}
