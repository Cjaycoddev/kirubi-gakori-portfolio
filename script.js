document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Splash Screen Particle Effect ---
    const canvas = document.getElementById('splash-canvas');
    const ctx = canvas.getContext('2d');
    let width, height;
    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    const particles = [];
    const particleCount = 80;
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.4,
            vy: (Math.random() - 0.5) * 0.4,
            radius: Math.random() * 2 + 1
        });
    }

    function animateSplash() {
        ctx.clearRect(0, 0, width, height);
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx*dx + dy*dy);
                if (dist < 100) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(245, 158, 11, ${1 - dist/100})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
        particles.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = '#F59E0B';
            ctx.fill();
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < 0 || p.x > width) p.vx *= -1;
            if (p.y < 0 || p.y > height) p.vy *= -1;
        });
        requestAnimationFrame(animateSplash);
    }
    animateSplash();

    // Fade out splash after 2.5 seconds
    setTimeout(() => {
        const splash = document.getElementById('splash');
        if (splash) {
            splash.style.opacity = '0';
            setTimeout(() => {
                splash.remove();
            }, 800);
        }
    }, 2500);

    // --- 2. Copyright Year ---
    document.getElementById('year').textContent = new Date().getFullYear();

    // --- 3. Hamburger Menu & Overlay ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const overlay = document.getElementById('nav-overlay');

    function toggleMenu() {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
        overlay.classList.toggle('active');
    }

    hamburger.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', toggleMenu);

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                toggleMenu();
            }
        });
    });

    // --- 4. Scroll Reveal Animation ---
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    revealElements.forEach(el => revealObserver.observe(el));

    // --- 5. Form Validation & Submission ---
    const form = document.getElementById('contact-form');
    const statusDiv = document.getElementById('form-status');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Clear previous errors
        document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
        statusDiv.textContent = '';
        statusDiv.className = '';

        // Validate
        let isValid = true;
        const name = document.getElementById('name');
        const email = document.getElementById('email');
        const message = document.getElementById('message');

        // Name Validation: Letters, spaces, hyphens, and apostrophes only (no numbers)
        const nameRegex = /^[a-zA-Z\s\-']{2,}$/;
        if (!nameRegex.test(name.value.trim())) {
            document.getElementById('name-error').textContent = 'Please enter a valid name (letters only).';
            isValid = false;
        }

        // Email Validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.value.trim())) {
            document.getElementById('email-error').textContent = 'Please enter a valid email address.';
            isValid = false;
        }

        // Message Validation
        if (message.value.trim().length < 10) {
            document.getElementById('message-error').textContent = 'Message must be at least 10 characters.';
            isValid = false;
        }

        if (!isValid) return;

        // Submit via fetch
        const formData = new FormData(form);
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                statusDiv.textContent = 'Thank you! Your message has been sent successfully.';
                statusDiv.className = 'success';
                form.reset();
            } else {
                const data = await response.json();
                statusDiv.textContent = data.errors ? data.errors.map(err => err.message).join(', ') : 'Oops! Something went wrong. Please try again.';
                statusDiv.className = 'error';
            }
        } catch (error) {
            statusDiv.textContent = 'Network error. Please check your connection and try again.';
            statusDiv.className = 'error';
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
    // --- 6. Smart Email Link (Mobile vs Desktop) ---
    const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    if (!isMobile && emailLinks.length > 0) {
        emailLinks.forEach(link => {
            // If on desktop, change to Gmail Web compose link
            const emailAddress = "kirubigakori@gmail.com";
            const subject = "Inquiry%20from%20Portfolio%20Website";
            const body = "Hello%20Kirubi%2C%0A%0AI%20would%20like%20to%20discuss%20a%20project%20with%20you.";
            
            link.href = `https://mail.google.com/mail/?view=cm&fs=1&to=${emailAddress}&su=${subject}&body=${body}`;
            link.target = "_blank"; // Open in new tab
        });
    }
});

