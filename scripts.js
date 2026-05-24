document.addEventListener("DOMContentLoaded", () => {
    /* ==========================================================================
       SELECTORS
       ========================================================================== */
    const menuBtn = document.getElementById("menuBtn");
    const closeBtn = document.getElementById("closeBtn");
    const overlay = document.getElementById("menuOverlay");
    const backdrop = document.querySelector(".menu-backdrop");
    const navLinks = document.querySelectorAll(".nav-link");
    const themeToggle = document.getElementById("themeToggle");
    const header = document.querySelector(".site-header");
    const contactForm = document.querySelector(".contact-form");

    // Highlight active link based on current page filename
    const path = window.location.pathname;
    const page = path.split("/").pop() || "index.html";
    navLinks.forEach(link => {
        link.classList.remove("active");
        const href = link.getAttribute("href");
        if (href === page || (page === "" && href === "index.html")) {
            link.classList.add("active");
        }
    });

    /* ==========================================================================
       DRAWER MENU NAVIGATION
       ========================================================================== */
    function openMenu() {
        overlay.classList.add("open");
        overlay.setAttribute("aria-hidden", "false");
        menuBtn.setAttribute("aria-expanded", "true");
        menuBtn.classList.add("open");
        document.body.style.overflow = "hidden"; // Disable scroll when menu is open
    }

    function closeMenu() {
        overlay.classList.remove("open");
        overlay.setAttribute("aria-hidden", "true");
        menuBtn.setAttribute("aria-expanded", "false");
        menuBtn.classList.remove("open");
        document.body.style.overflow = ""; // Enable scroll
    }

    // Toggle menu click
    if (menuBtn) {
        menuBtn.addEventListener("click", () => {
            if (overlay.classList.contains("open")) {
                closeMenu();
            } else {
                openMenu();
            }
        });
    }

    // Close button & backdrop click
    if (closeBtn) closeBtn.addEventListener("click", closeMenu);
    if (backdrop) backdrop.addEventListener("click", closeMenu);

    // Close menu on navigation link click (smooth scroll handling)
    navLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            const targetId = link.getAttribute("href");
            
            // Check if it's a hash link
            if (targetId && targetId.startsWith("#")) {
                e.preventDefault();
                closeMenu();
                
                // Perform scroll
                const targetSection = document.querySelector(targetId === "#" ? "body" : targetId);
                if (targetSection) {
                    // Slight delay to allow side navigation close animation to complete
                    setTimeout(() => {
                        const headerHeight = header ? header.offsetHeight : 0;
                        const targetPosition = targetSection.getBoundingClientRect().top + window.scrollY - headerHeight;
                        window.scrollTo({
                            top: targetPosition,
                            behavior: "smooth"
                        });
                    }, 250);
                }
            }
        });
    });

    // Keyboard ESC key to close menu
    window.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && overlay.classList.contains("open")) {
            closeMenu();
        }
    });

    /* ==========================================================================
       DARK & LIGHT THEME TOGGLE
       ========================================================================== */
    if (themeToggle) {
        // Retrieve cached choice or default to dark-mode (classic Villo is dark first)
        const savedTheme = localStorage.getItem("theme");
        const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
        
        if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
            document.body.classList.add("dark-mode");
        } else if (savedTheme === "light") {
            document.body.classList.remove("dark-mode");
        }

        themeToggle.addEventListener("click", () => {
            document.body.classList.toggle("dark-mode");
            const isDark = document.body.classList.contains("dark-mode");
            localStorage.setItem("theme", isDark ? "dark" : "light");
        });
    }

    /* ==========================================================================
       HEADER SCROLL ACCENT
       ========================================================================== */
    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    });
    // Trigger once on load in case of direct refresh page scroll
    if (window.scrollY > 50) {
        header.classList.add("scrolled");
    }

    /* ==========================================================================
       INTERSECTION OBSERVER: NAV HIGHLIGHTS & SECTION ENTRANCE
       ========================================================================== */
    // Select all main sections of the website
    const sections = document.querySelectorAll("main > section, header");
    
    const sectionObserverOptions = {
        root: null,
        rootMargin: "-25% 0px -65% 0px", // Trigger when section occupies the focal center-top of viewport
        threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute("id");
                


                // Trigger heading progress line animation when section comes into view
                const aboutHeader = entry.target.querySelector(".about-header");
                if (aboutHeader) {
                    aboutHeader.classList.add("active");
                }
            }
        });
    }, sectionObserverOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    /* ==========================================================================
       RADIAL SKILLS ANIMATOR
       ========================================================================== */
    const circularSkillsSection = document.querySelector(".circular-skills-panel");
    const progressCircles = document.querySelectorAll(".circle-fg");

    if (circularSkillsSection && progressCircles.length > 0) {
        const skillsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    progressCircles.forEach(circle => {
                        const percentage = parseInt(circle.getAttribute("data-pct"), 10);
                        const radius = circle.r.baseVal.value;
                        const circumference = 2 * Math.PI * radius; // 314.16
                        
                        // Calculate stroke-dashoffset
                        const offset = circumference - (percentage / 100) * circumference;
                        
                        // Apply animation transition offset
                        circle.style.strokeDashoffset = offset;
                    });
                    
                    // Stop observing once animated
                    skillsObserver.unobserve(entry.target);
                }
            });
        }, {
            root: null,
            threshold: 0.15 // Animate when at least 15% of grid is visible
        });

        skillsObserver.observe(circularSkillsSection);
    }

    /* ==========================================================================
       INFINITE TICKER SEAMLESS LOOP CLONING
       ========================================================================== */
    const marqueeTracks = document.querySelectorAll(".marquee-track");
    marqueeTracks.forEach(track => {
        // Clone and duplicate the inner content to ensure seamless loop
        const innerContent = track.innerHTML;
        track.innerHTML = innerContent + innerContent + innerContent + innerContent;
    });

    /* ==========================================================================
       FORM SUBMISSION TOAST SUCCESS
       ========================================================================== */
    /* ==========================================================================
       PROJECT CARDS VIDEO CONTROLLER (PLAY ONE AT A TIME)
       ========================================================================== */
    const playButtons = document.querySelectorAll(".play-btn");

    playButtons.forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();

            const card = btn.closest(".project-card");
            const video = card.querySelector(".project-video");

            if (!video) return;

            if (card.classList.contains("playing")) {
                // Video is currently playing, so pause it
                video.pause();
                card.classList.remove("playing");
            } else {
                // Pause all other videos on the page first
                document.querySelectorAll(".project-card.playing").forEach(otherCard => {
                    const otherVideo = otherCard.querySelector(".project-video");
                    if (otherVideo) {
                        otherVideo.pause();
                    }
                    otherCard.classList.remove("playing");
                });

                // Play this video with audio unmuted
                video.muted = false;
                video.play()
                    .then(() => {
                        card.classList.add("playing");
                    })
                    .catch(err => {
                        console.warn("Autoplay / audio play blocked. Trying muted...", err);
                        // Fallback to muted playback if audio is blocked by browser policy
                        video.muted = true;
                        video.play();
                        card.classList.add("playing");
                    });
            }
        });
    });

    window.showContactSuccess = function() {
        const toast = document.createElement("div");
        toast.className = "contact-toast";
        toast.textContent = "Thanks — message sent!";
        document.body.appendChild(toast);

        // Show toast
        setTimeout(() => {
            toast.classList.add("visible");
        }, 100);

        // Hide and remove toast
        setTimeout(() => {
            toast.classList.remove("visible");
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3000);

        // Reset form inputs
        if (contactForm) {
            contactForm.reset();
        }
    };
});
