/**
 * Aura — Portfolio Interactive Script
 */

document.addEventListener('DOMContentLoaded', () => {
    // -------------------------------------------------------------
    // 1. Theme Configuration (Dark / Light Mode)
    // -------------------------------------------------------------
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    
    // Check saved theme or system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
    
    // Apply initial theme
    htmlElement.setAttribute('data-theme', initialTheme);
    updateThemeIcon(initialTheme);

    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
        
        // Custom animation feedback on click
        themeToggleBtn.style.transform = 'scale(0.85) rotate(45deg)';
        setTimeout(() => {
            themeToggleBtn.style.transform = '';
        }, 150);
    });

    function updateThemeIcon(theme) {
        const icon = themeToggleBtn.querySelector('i');
        if (theme === 'dark') {
            icon.className = 'fa-solid fa-sun';
        } else {
            icon.className = 'fa-solid fa-moon';
        }
    }

    // -------------------------------------------------------------
    // 2. Custom Glow Cursor Tracker
    // -------------------------------------------------------------
    const cursorGlow = document.getElementById('cursor-glow');
    
    document.addEventListener('mousemove', (e) => {
        // Run asynchronously via requestAnimationFrame for performance
        requestAnimationFrame(() => {
            cursorGlow.style.left = `${e.clientX}px`;
            cursorGlow.style.top = `${e.clientY}px`;
        });
    });

    // -------------------------------------------------------------
    // 3. 3D Card Hover Tilt Effect
    // -------------------------------------------------------------
    const card3D = document.getElementById('card-3d');
    
    if (card3D) {
        card3D.addEventListener('mousemove', (e) => {
            const rect = card3D.getBoundingClientRect();
            const x = e.clientX - rect.left; // x coordinate within the element
            const y = e.clientY - rect.top;  // y coordinate within the element
            
            // Calculate tilt angle based on cursor position relative to card center
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Maximum tilt angle in degrees
            const maxTilt = 15; 
            const rotateY = ((x - centerX) / centerX) * maxTilt;
            const rotateX = -((y - centerY) / centerY) * maxTilt;
            
            card3D.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        });
        
        card3D.addEventListener('mouseleave', () => {
            // Smoothly reset transformations when cursor leaves
            card3D.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
        });
    }

    // -------------------------------------------------------------
    // 4. Mobile Menu Navigation
    // -------------------------------------------------------------
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    mobileMenuBtn.addEventListener('click', () => {
        mobileMenuBtn.classList.toggle('open');
        navMenu.classList.toggle('open');
    });

    // Close mobile menu when nav link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuBtn.classList.remove('open');
            navMenu.classList.remove('open');
        });
    });

    // -------------------------------------------------------------
    // 5. Active Link Highlighting on Scroll (Intersection Observer)
    // -------------------------------------------------------------
    const sections = document.querySelectorAll('section');
    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -60% 0px', // Trigger when section occupies the main view space
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));

    // -------------------------------------------------------------
    // 6. Portfolio Filtering and Animations
    // -------------------------------------------------------------
    const filterButtons = document.querySelectorAll('.filter-btn');
    const workCards = document.querySelectorAll('.work-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active filter button state
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            workCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = 'block';
                    // Quick fade/scale entering animation
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300); // match transition duration
                }
            });
        });
    });

    // -------------------------------------------------------------
    // 7. Work Details Modal Showcase Viewer
    // -------------------------------------------------------------
    const modal = document.getElementById('project-modal');
    const modalBody = document.getElementById('modal-body');
    const modalClose = document.getElementById('modal-close');
    const modalBackdrop = document.getElementById('modal-backdrop');

    // Project data repository
    const projectsData = {
        1: {
            title: "Synapse AI Interface",
            category: "Interactive Platform",
            tags: ["React", "D3.js", "TailwindCSS", "OpenAI API"],
            description: "Synapse is a next-generation neural explorer interface allowing users to map, visualize, and interact with complex machine learning neural models. It offers multi-dimensional graphical layouts, real-time node rendering, and custom parameter nodes. Created to bridge raw AI weights and human creative intuition.",
            bgClass: "p1-bg",
            iconClass: "fa-solid fa-cloud-bolt"
        },
        2: {
            title: "Chronos Finance",
            category: "Web App Design",
            tags: ["Figma", "UI/UX Design", "Interactive Prototyping"],
            description: "Chronos is a decentralized financial protocol dashboard built to optimize gas fees and transaction times across multiple blockchain protocols. Featuring fully customizable grid blocks, deep dark glassmorphism styling, and premium charts that make complex data structures instantly readable.",
            bgClass: "p2-bg",
            iconClass: "fa-solid fa-circle-nodes"
        },
        3: {
            title: "Nebula Dust Engine",
            category: "Three.js / GLSL",
            tags: ["Three.js", "GLSL Shaders", "Web Audio API"],
            description: "An experimental 3D interactive particle simulation featuring custom vertex and fragment shaders. Users can manipulate space dust using sound input or cursor drag. It leveragesGPU acceleration to compute physics for over 500,000 distinct particles in real-time.",
            bgClass: "p3-bg",
            iconClass: "fa-solid fa-cube"
        },
        4: {
            title: "Cypher Suite",
            category: "System Architecture",
            tags: ["Node.js", "Docker", "WebSockets", "PGP Encryption"],
            description: "A fully decentralized and encrypted mail and collaboration ecosystem. Built with absolute zero-knowledge privacy standards in mind, Cypher ensures message delivery and secure document storage across automated peer clusters, backed by automated fallback relays.",
            bgClass: "p4-bg",
            iconClass: "fa-solid fa-lock"
        },
        5: {
            title: "Aether Studios Brand",
            category: "Branding / Identity",
            tags: ["Graphic Design", "Logo Design", "Styleguide Design"],
            description: "A complete visual identity rebranding catalog developed for a futuristic game and design boutique. This workflow comprises everything from digital logo geometries, curated spatial typography scales, custom stationary patterns, to dynamic digital marketing layouts.",
            bgClass: "p5-bg",
            iconClass: "fa-solid fa-palette"
        },
        6: {
            title: "Vortex Sandbox",
            category: "Creative Engineering",
            tags: ["HTML5 Canvas", "Physics Engines", "Vanilla JS"],
            description: "An interactive fluid-dynamics playground exploring smoke, liquid, and pressure densities within the browser. It features a customizable gravity engine, thermal obstacles, and multiple interactive pressure injectors to design gorgeous organic visual movements.",
            bgClass: "p6-bg",
            iconClass: "fa-solid fa-wind"
        }
    };

    workCards.forEach(card => {
        card.addEventListener('click', () => {
            const projectId = card.getAttribute('data-id');
            const data = projectsData[projectId];
            if (data) {
                openModal(data);
            }
        });
    });

    function openModal(data) {
        // Construct Modal HTML markup
        modalBody.innerHTML = `
            <div class="modal-project-details">
                <div class="modal-project-img">
                    <div class="project-preview-mockup ${data.bgClass}">
                        <div class="mockup-content">
                            <div class="mockup-header">
                                <span></span><span></span><span></span>
                            </div>
                            <div class="mockup-body">
                                <i class="${data.iconClass}"></i>
                                <h4>${data.title}</h4>
                                <p>${data.category}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-project-info">
                    <h3>${data.title}</h3>
                    <div class="modal-project-tags">
                        ${data.tags.map(tag => `<span>${tag}</span>`).join('')}
                    </div>
                    <p class="modal-project-desc">${data.description}</p>
                    <div class="modal-cta-group">
                        <a href="#" class="btn btn-primary" onclick="event.preventDefault(); alert('Demo URL link simulation!');">
                            <span>Launch Live Project</span>
                            <i class="fa-solid fa-up-right-from-square"></i>
                        </a>
                    </div>
                </div>
            </div>
        `;
        
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden'; // Lock background scrolling
    }

    function closeModal() {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = ''; // Unlock scrolling
    }

    modalClose.addEventListener('click', closeModal);
    modalBackdrop.addEventListener('click', closeModal);
    
    // Close modal on Escape Key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // -------------------------------------------------------------
    // 8. Contact Form Submissions Handling
    // -------------------------------------------------------------
    const contactForm = document.getElementById('contact-form');
    const formFeedback = document.getElementById('form-feedback');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('.btn-submit');
            const submitBtnText = submitBtn.querySelector('span');
            const submitBtnIcon = submitBtn.querySelector('i');
            
            // Set Loading state
            submitBtnText.textContent = "Sending...";
            submitBtnIcon.className = "fa-solid fa-spinner fa-spin";
            submitBtn.disabled = true;
            
            // Simulate API request timeout
            setTimeout(() => {
                const nameInput = document.getElementById('name').value;
                
                // Show Success Notification
                formFeedback.className = "form-feedback success";
                formFeedback.textContent = `Thank you, ${nameInput}! Your message has been sent successfully. I'll get back to you shortly.`;
                
                // Reset submit button state
                submitBtnText.textContent = "Send Message";
                submitBtnIcon.className = "fa-solid fa-paper-plane";
                submitBtn.disabled = false;
                
                // Reset form fields
                contactForm.reset();
                
                // Hide feedback after 5 seconds
                setTimeout(() => {
                    formFeedback.style.display = 'none';
                }, 5000);

            }, 1800);
        });
    }
});
