// ===== Mobile Menu Toggle =====
document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuBtn.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close menu when clicking on a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuBtn.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    // ===== Form Validation =====
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const messageInput = document.getElementById('message');
        
        const nameError = document.getElementById('nameError');
        const emailError = document.getElementById('emailError');
        const messageError = document.getElementById('messageError');

        // Validation functions
        const validators = {
            name: (value) => {
                if (!value.trim()) {
                    return 'Пожалуйста, введите ваше имя';
                }
                if (value.trim().length < 2) {
                    return 'Имя должно содержать минимум 2 символа';
                }
                if (!/^[a-zA-Zа-яА-ЯёЁ\s-]+$/.test(value)) {
                    return 'Имя может содержать только буквы, пробелы и дефисы';
                }
                return '';
            },
            
            email: (value) => {
                if (!value.trim()) {
                    return 'Пожалуйста, введите ваш email';
                }
                // RFC 5322 compliant email regex (simplified)
                const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
                if (!emailRegex.test(value)) {
                    return 'Пожалуйста, введите корректный email адрес';
                }
                return '';
            },
            
            message: (value) => {
                if (!value.trim()) {
                    return 'Пожалуйста, введите сообщение';
                }
                if (value.trim().length < 10) {
                    return 'Сообщение должно содержать минимум 10 символов';
                }
                return '';
            }
        };

        // Helper function to show error
        const showError = (input, errorElement, message) => {
            input.classList.remove('success');
            input.classList.add('error');
            errorElement.textContent = message;
        };

        // Helper function to show success
        const showSuccess = (input, errorElement) => {
            input.classList.remove('error');
            input.classList.add('success');
            errorElement.textContent = '';
        };

        // Helper function to validate field
        const validateField = (input, errorElement, validatorName) => {
            const error = validators[validatorName](input.value);
            if (error) {
                showError(input, errorElement, error);
                return false;
            } else {
                showSuccess(input, errorElement);
                return true;
            }
        };

        // Real-time validation on blur
        nameInput.addEventListener('blur', () => {
            validateField(nameInput, nameError, 'name');
        });

        emailInput.addEventListener('blur', () => {
            validateField(emailInput, emailError, 'email');
        });

        messageInput.addEventListener('blur', () => {
            validateField(messageInput, messageError, 'message');
        });

        // Real-time validation on input (only if already has error)
        nameInput.addEventListener('input', () => {
            if (nameInput.classList.contains('error')) {
                validateField(nameInput, nameError, 'name');
            }
        });

        emailInput.addEventListener('input', () => {
            if (emailInput.classList.contains('error')) {
                validateField(emailInput, emailError, 'email');
            }
        });

        messageInput.addEventListener('input', () => {
            if (messageInput.classList.contains('error')) {
                validateField(messageInput, messageError, 'message');
            }
        });

        // Form submission
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Validate all fields
            const isNameValid = validateField(nameInput, nameError, 'name');
            const isEmailValid = validateField(emailInput, emailError, 'email');
            const isMessageValid = validateField(messageInput, messageError, 'message');

            if (isNameValid && isEmailValid && isMessageValid) {
                // Form is valid - show success message
                showSuccessNotification();
                
                // Reset form
                contactForm.reset();
                [nameInput, emailInput, messageInput].forEach(input => {
                    input.classList.remove('success', 'error');
                });
            }
        });
    }

    // ===== Success Notification =====
    function showSuccessNotification() {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.innerHTML = `
            <div class="notification-content">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                <span>Сообщение успешно отправлено!</span>
            </div>
        `;

        // Add styles dynamically
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: linear-gradient(135deg, #10b981, #059669);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            z-index: 2000;
            animation: slideIn 0.3s ease-out forwards;
        `;

        // Add animation styles
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from {
                    opacity: 0;
                    transform: translateX(100px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
            @keyframes slideOut {
                from {
                    opacity: 1;
                    transform: translateX(0);
                }
                to {
                    opacity: 0;
                    transform: translateX(100px);
                }
            }
            .notification-content {
                display: flex;
                align-items: center;
                gap: 0.75rem;
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(notification);

        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out forwards';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    // ===== Smooth Scroll for Navigation Links =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const navHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ===== Navbar Background Change on Scroll =====
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
        }
    });

    // ===== Intersection Observer for Animations =====
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

    // Observe elements for animation
    document.querySelectorAll('.info-card, .skill-card, .project-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});
