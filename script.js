// --- NEW SLIDER FUNCTION ---
// We define this function out here so 'loadPage' can call it.
let isDragging = false;
let currentPosition = 50;

function setPosition(position) {
    const sliderHandle = document.getElementById("sliderHandle");
    const sliderLine = document.getElementById("sliderLine");
    const beforeImage = document.getElementById("beforeImage");

    // Limit position between 0 and 100
    position = Math.max(0, Math.min(100, position));
    currentPosition = position;

    // Position handle and line
    const leftPercent = position + "%";
    if (sliderHandle) sliderHandle.style.left = leftPercent;
    if (sliderLine) sliderLine.style.left = leftPercent;

    // Clip before image
    if (beforeImage) beforeImage.style.clipPath = `inset(0 ${100 - position}% 0 0)`;
}

function initializeBeforeAfterSlider() {
    // Reset dragging state just in case
    isDragging = false;
    currentPosition = 50;

    const sliderContainer = document.getElementById("sliderContainer");
    const sliderHandle = document.getElementById("sliderHandle");
    const sliderLine = document.getElementById("sliderLine");
    const beforeImage = document.getElementById("beforeImage");

    // Exit if elements don't exist
    if (!sliderContainer || !sliderHandle || !sliderLine || !beforeImage) {
        console.log("Slider elements not found. Skipping init.");
        return;
    }

    function getPositionFromEvent(e) {
        const rect = sliderContainer.getBoundingClientRect();
        const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
        return (x / rect.width) * 100;
    }

    // --- MOUSE EVENTS ---
    // We bind to 'document' for mouseup/mousemove to catch events
    // that happen outside the slider container while dragging.

    function onMouseDown(e) {
        isDragging = true;
        e.preventDefault();
    }

    function onContainerMouseDown(e) {
        if (
            e.target === sliderContainer ||
            e.target === beforeImage ||
            e.target.classList.contains("image")
        ) {
            const position = getPositionFromEvent(e);
            setPosition(position);
        }
    }

    function onDocumentMouseMove(e) {
        if (isDragging) {
            const position = getPositionFromEvent(e);
            setPosition(position);
        }
    }

    function onDocumentMouseUp() {
        isDragging = false;
    }

    // --- TOUCH EVENTS ---
    function onTouchStart(e) {
        isDragging = true;
        e.preventDefault();
    }

    function onContainerTouchStart(e) {
        if (
            e.target === sliderContainer ||
            e.target === beforeImage ||
            e.target.classList.contains("image")
        ) {
            const position = getPositionFromEvent(e);
            setPosition(position);
        }
    }

    function onDocumentTouchMove(e) {
        if (isDragging) {
            e.preventDefault();
            const position = getPositionFromEvent(e);
            setPosition(position);
        }
    }

    function onDocumentTouchEnd() {
        isDragging = false;
    }

    // --- KEYBOARD EVENTS ---
    function onKeyDown(e) {
        if (e.key === "ArrowLeft") {
            setPosition(currentPosition - 5);
        } else if (e.key === "ArrowRight") {
            setPosition(currentPosition + 5);
        }
    }

    // Add all event listeners
    sliderHandle.addEventListener("mousedown", onMouseDown);
    sliderContainer.addEventListener("mousedown", onContainerMouseDown);
    document.addEventListener("mousemove", onDocumentMouseMove);
    document.addEventListener("mouseup", onDocumentMouseUp);

    sliderHandle.addEventListener("touchstart", onTouchStart, { passive: false });
    sliderContainer.addEventListener("touchstart", onContainerTouchStart, { passive: false });
    document.addEventListener("touchmove", onDocumentTouchMove, { passive: false });
    document.addEventListener("touchend", onDocumentTouchEnd);

    document.addEventListener("keydown", onKeyDown);

    // Initialization
    setPosition(50);
}
// --- END OF NEW SLIDER FUNCTION ---


document.addEventListener('DOMContentLoaded', () => {
    const mainContent = document.getElementById('main-content');
    const projectPagesContainer = document.getElementById('project-pages');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const pageLinks = document.querySelectorAll('.page-link');

    // --- SMART TEMPLATE LOADER (Replace your old const projectTemplates block with this) ---
    const projectTemplates = {};

    // 1. Automatically find ALL project templates (project-1 to project-100+)
    document.querySelectorAll('template[id^="winsper-project-"]').forEach(template => {
        projectTemplates['#' + template.id] = template.innerHTML;
    });

    // 2. Add the special pages (Privacy & Terms) manually
    const privacyTemplate = document.getElementById('privacy-policy-page');
    if (privacyTemplate) projectTemplates['#privacy-policy'] = privacyTemplate.innerHTML;

    const termsTemplate = document.getElementById('terms-conditions-page');
    if (termsTemplate) projectTemplates['#terms-conditions'] = termsTemplate.innerHTML;
    // --- END OF SMART TEMPLATE LOADER ---

    const loadPage = (hash) => {
        if (projectTemplates[hash]) {
            // Loading a Project Page
            mainContent.style.display = 'none';
            projectPagesContainer.innerHTML = projectTemplates[hash];
            projectPagesContainer.style.display = 'block';
            window.scrollTo(0, 0);

            if (hash === '#winsper-project-1') {
                initializeBeforeAfterSlider();
            }

        } else {
            // Loading a Main Page Section (Home, Services, etc.)
            mainContent.style.display = 'block';
            projectPagesContainer.innerHTML = '';
            projectPagesContainer.style.display = 'none';
            
            // FIX: Handle empty hash or standard sections safely
            const targetId = hash ? hash.substring(1) : 'home';
            const targetElement = document.getElementById(targetId);
            
            // FIX: Only try to scroll if the element actually exists
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        }
    };

    // --- CONSOLIDATED AND FIXED LINK CLICK HANDLING ---
    pageLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const path = link.getAttribute('href');

            // Handle project page loading
            if (projectTemplates[path]) {
                e.preventDefault();
                history.pushState(null, '', path);
                loadPage(path);
            }

            // Handle mobile menu closing for non-project links
            if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                // If it's a link to a section on the main page, close the menu
                if (!projectTemplates[path]) {
                    mobileMenu.classList.add('hidden');
                }
            }
        });
    });

    // --- MOBILE MENU BUTTON HANDLING ---
    if (mobileMenuButton) {
        mobileMenuButton.addEventListener('click', (e) => {
            e.stopPropagation();
            mobileMenu.classList.toggle('hidden');
        });
    }

    // Close mobile menu when clicking outside of it
    document.addEventListener('click', (e) => {
        if (mobileMenu && !mobileMenu.classList.contains('hidden') && !mobileMenu.contains(e.target) && !mobileMenuButton.contains(e.target)) {
            mobileMenu.classList.add('hidden');
        }
    });

    window.addEventListener('popstate', () => {
        loadPage(window.location.hash || '#home');
    });

    // Initial load
    loadPage(window.location.hash || '#home');

    // The rest of your script...
    const cursorLight = document.getElementById('cursor-light');
    if (cursorLight) {
        document.addEventListener('mousemove', (e) => {
            requestAnimationFrame(() => {
                cursorLight.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
            });
        });
    }

    const revealElements = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.1
    });
    revealElements.forEach(el => observer.observe(el));

    const backToTopButton = document.getElementById('back-to-top');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            if (backToTopButton) backToTopButton.classList.add('visible');
        } else {
            if (backToTopButton) backToTopButton.classList.remove('visible');
        }
    });

    const video = document.getElementById('moon-video-background');
    const servicesSection = document.getElementById('services-container');

    if (video && servicesSection) {
        const videoObserver = new IntersectionObserver((entries) => {
            entries.forEach(async entry => {
                try {
                    if (entry.isIntersecting) {
                        await video.play();
                    } else {
                        video.pause();
                    }
                } catch (error) {
                    if (error.name !== 'AbortError') {
                        console.error("Video playback error:", error);
                    }
                }
            });
        }, {
            threshold: 0.1
        });
        videoObserver.observe(servicesSection);
    }

    const filterButtons = document.querySelectorAll('#portfolio-filters .filter-btn');
    const portfolioCards = document.querySelectorAll('.portfolio-card');

    if (filterButtons.length > 0 && portfolioCards.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                const filter = button.dataset.filter;
                portfolioCards.forEach(card => {
                    if (filter === 'all' || card.dataset.category === filter) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });

        // --- FIX FOR MOBILE VIEW ---
        // We use a small delay (setTimeout) to ensure the browser is ready 
        // before we simulate the click. This forces the cards to appear.
        const allFilterBtn = document.querySelector('#portfolio-filters .filter-btn[data-filter="all"]');
        if (allFilterBtn) {
            setTimeout(() => {
                allFilterBtn.click();
            }, 100); 
        }
    }


    // 3D hover effect for portfolio cards
    portfolioCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const rotateY = -1 * ((x - rect.width / 2) / rect.width) * 15;
            const rotateX = ((y - rect.height / 2) / rect.height) * 15;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        });
    });

    // Make entire portfolio card clickable
    portfolioCards.forEach(card => {
        card.addEventListener('click', (e) => {
            // Prevent this from firing if the 'See More' button itself was clicked
            if (e.target.closest('.button')) {
                return;
            }
            const link = card.querySelector('.page-link');
            if (link) {
                link.click();
            }
        });
    });


    // --- NEW MOUSE TRAIL CODE STARTS HERE ---

    // ✅ Run mouse-trail ONLY on desktop (prevents lag on phones)
    if (window.matchMedia("(min-width: 768px)").matches) {

        const trailCanvas = document.getElementById("trail-canvas");

        // Check if the canvas element exists
        if (trailCanvas) {
            const ctx = trailCanvas.getContext('2d');
            let mouseMoved = false;

            const pointer = {
                x: 0.5 * window.innerWidth,
                y: 0.5 * window.innerHeight,
            };

            const params = {
                pointsNumber: 40,
                widthFactor: 0.3,
                mouseThreshold: 0.6,
                spring: 0.4,
                friction: 0.5
            };

            // Build points array
            const trail = new Array(params.pointsNumber);
            for (let i = 0; i < params.pointsNumber; i++) {
                trail[i] = {
                    x: pointer.x,
                    y: pointer.y,
                    dx: 0,
                    dy: 0,
                };
            }

            // Mouse & touch events
            window.addEventListener("click", e => {
                updateMousePosition(e.pageX, e.pageY);
            });

            window.addEventListener("mousemove", e => {
                mouseMoved = true;
                updateMousePosition(e.pageX, e.pageY);
            });

            window.addEventListener("touchmove", e => {
                mouseMoved = true;
                updateMousePosition(e.targetTouches[0].pageX, e.targetTouches[0].pageY);
            });

            function updateMousePosition(x, y) {
                pointer.x = x;
                pointer.y = y;
            }

            function setupCanvas() {
                trailCanvas.width = window.innerWidth;
                trailCanvas.height = window.innerHeight;
            }

            function update(t) {
                if (!mouseMoved) {
                    // Idle animation when mouse is not moving
                    pointer.x = (0.5 + 0.3 * Math.cos(0.002 * t) * Math.sin(0.005 * t)) * window.innerWidth;
                    pointer.y = (0.5 + 0.2 * Math.cos(0.005 * t) + 0.1 * Math.cos(0.01 * t)) * window.innerHeight;
                }

                ctx.clearRect(0, 0, trailCanvas.width, trailCanvas.height);

                // Move points like springs
                trail.forEach((p, i) => {
                    const prev = i === 0 ? pointer : trail[i - 1];
                    const spring = i === 0 ? 0.4 * params.spring : params.spring;

                    p.dx += (prev.x - p.x) * spring;
                    p.dy += (prev.y - p.y) * spring;
                    p.dx *= params.friction;
                    p.dy *= params.friction;
                    p.x += p.dx;
                    p.y += p.dy;
                });

                // Draw line
                ctx.strokeStyle = "white";
                ctx.lineCap = "round";
                ctx.beginPath();
                ctx.moveTo(trail[0].x, trail[0].y);

                for (let i = 1; i < trail.length - 1; i++) {
                    const xc = 0.5 * (trail[i].x + trail[i + 1].x);
                    const yc = 0.5 * (trail[i].y + trail[i + 1].y);
                    ctx.quadraticCurveTo(trail[i].x, trail[i].y, xc, yc);
                    ctx.lineWidth = params.widthFactor * (params.pointsNumber - i);
                    ctx.stroke();
                }

                ctx.lineTo(trail[trail.length - 1].x, trail[trail.length - 1].y);
                ctx.stroke();

                window.requestAnimationFrame(update);
            }

            setupCanvas();
            update(0);

            window.addEventListener("resize", setupCanvas);
        }
    }

    // --- NEW MOUSE TRAIL CODE ENDS HERE ---

});
