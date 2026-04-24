document.addEventListener('DOMContentLoaded', () => {

    const typedEl = document.getElementById('typed');
    const words = ['Puissance', 'Élégance', 'Performance', 'Design'];
    let wordIndex = 0;
    let charIndex = 0;

    function type() {
        const current = words[wordIndex];
        if (!typedEl) return;
        if (charIndex <= current.length) {
            typedEl.textContent = current.slice(0, charIndex);
            charIndex++;
            setTimeout(type, 110);
        } else {
            setTimeout(backspace, 800);
        }
    }

    function backspace() {
        const current = words[wordIndex];
        if (!typedEl) return;
        if (charIndex >= 0) {
            typedEl.textContent = current.slice(0, charIndex);
            charIndex--;
            setTimeout(backspace, 50);
        } else {
            wordIndex = (wordIndex + 1) % words.length;
            setTimeout(type, 200);
        }
    }

    if (typedEl) type();


    const header = document.querySelector('.entete');
    const hero = document.querySelector('.hero');

    function onScroll() {
        if (header) {
            if (window.scrollY > 20) header.classList.add('scrolled');
            else header.classList.remove('scrolled');
        }
        if (hero) {
            hero.style.backgroundPositionY = `${window.scrollY * 0.3}px`;
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });


    const m4Viewer = document.getElementById('m4-viewer');
    const m4StageBadge = document.querySelector('[data-stage-badge]');
    const m4Engine = document.querySelector('[data-m4-engine]');
    const m4Power = document.querySelector('[data-m4-power]');
    const m4Time = document.querySelector('[data-m4-time]');
    const m4Drive = document.querySelector('[data-m4-drive]');
    const sportiveSteps = Array.from(document.querySelectorAll('.sportive-step'));

    function applySportiveStep(step) {
        if (!m4Viewer || !step) return;

        const orbit = step.dataset.orbit || '42deg 72deg 150%';
        const fieldOfView = step.dataset.fov || '28deg';

        m4Viewer.setAttribute('camera-orbit', orbit);
        m4Viewer.setAttribute('field-of-view', fieldOfView);

        if ('cameraOrbit' in m4Viewer) {
            m4Viewer.cameraOrbit = orbit;
        }

        if ('fieldOfView' in m4Viewer) {
            m4Viewer.fieldOfView = fieldOfView;
        }

        if (m4StageBadge) m4StageBadge.textContent = step.dataset.stageName || 'M4';
        if (m4Engine) m4Engine.textContent = step.dataset.engine || '';
        if (m4Power) m4Power.textContent = step.dataset.power || '';
        if (m4Time) m4Time.textContent = step.dataset.time || '';
        if (m4Drive) m4Drive.textContent = step.dataset.drive || '';

        sportiveSteps.forEach((panel) => {
            panel.classList.toggle('is-active', panel === step);
        });
    }

    if (m4Viewer && sportiveSteps.length) {
        const sportyObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    applySportiveStep(entry.target);
                }
            });
        }, {
            threshold: 0.65,
            rootMargin: '-12% 0px -20% 0px',
        });

        sportiveSteps.forEach((step) => sportyObserver.observe(step));
        applySportiveStep(sportiveSteps[0]);
    }

    // --- Simple model slider: prev/next with rotating transition ---
    const sliders = document.querySelectorAll('[data-slider]');

    sliders.forEach((slider) => {
        const slides = Array.from(slider.querySelectorAll('.slide'));
        const prevBtn = slider.querySelector('.slider-btn-prev');
        const nextBtn = slider.querySelector('.slider-btn-next');
        const specsBox = slider.parentElement?.querySelector('.model-specs');
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const transitionDurationMs = 860;
        let isAnimating = false;

        if (!slides.length || !prevBtn || !nextBtn) return;

        let currentIndex = slides.findIndex((slide) => slide.classList.contains('is-active'));
        if (currentIndex < 0) currentIndex = 0;

        const specTargets = {
            name: specsBox?.querySelector('[data-spec="name"]') || null,
            motor: specsBox?.querySelector('[data-spec="motor"]') || null,
            power: specsBox?.querySelector('[data-spec="power"]') || null,
            time: specsBox?.querySelector('[data-spec="time"]') || null,
            drive: specsBox?.querySelector('[data-spec="drive"]') || null,
        };

        function updateSpecs(slide) {
            if (!slide || !specsBox) return;
            if (specTargets.name) specTargets.name.textContent = slide.dataset.name || '';
            if (specTargets.motor) specTargets.motor.textContent = slide.dataset.motor || '';
            if (specTargets.power) specTargets.power.textContent = slide.dataset.power || '';
            if (specTargets.time) specTargets.time.textContent = slide.dataset.time || '';
            if (specTargets.drive) specTargets.drive.textContent = slide.dataset.drive || '';
        }

        function resetSlideState() {
            slider.classList.remove('is-next', 'is-prev');
            slides.forEach((slide) => {
                slide.classList.remove('is-entering', 'is-leaving');
            });
        }

        function render(index) {
            slides.forEach((slide, i) => {
                slide.classList.remove('is-entering', 'is-leaving');
                slide.classList.toggle('is-active', i === index);
            });
            slider.classList.remove('is-next', 'is-prev');
            updateSpecs(slides[index]);
            currentIndex = index;
        }

        function animateTo(nextIndex, direction) {
            if (nextIndex === currentIndex || isAnimating) return;

            if (prefersReducedMotion) {
                render(nextIndex);
                return;
            }

            isAnimating = true;

            const currentSlide = slides[currentIndex];
            const nextSlide = slides[nextIndex];

            resetSlideState();

            slider.classList.add(direction === 'next' ? 'is-next' : 'is-prev');
            currentSlide.classList.add('is-leaving');
            nextSlide.classList.add('is-entering');


            updateSpecs(nextSlide);

            window.setTimeout(() => {
                currentSlide.classList.remove('is-active', 'is-leaving');
                nextSlide.classList.remove('is-entering');
                nextSlide.classList.add('is-active');
                slider.classList.remove('is-next', 'is-prev');
                currentIndex = nextIndex;
                isAnimating = false;
            }, transitionDurationMs);
        }

        prevBtn.addEventListener('click', () => {
            const nextIndex = (currentIndex - 1 + slides.length) % slides.length;
            animateTo(nextIndex, 'prev');
        });

        nextBtn.addEventListener('click', () => {
            const nextIndex = (currentIndex + 1) % slides.length;
            animateTo(nextIndex, 'next');
        });

        render(currentIndex);
    });

    const title = document.querySelector('.hero-title');

    if (title) {
        title.addEventListener('mousemove', (e) => {
            const r = title.getBoundingClientRect();
            const x = ((e.clientX - r.left) / r.width) * 100;
            const y = ((e.clientY - r.top) / r.height) * 100;
            title.style.setProperty('--mx', `${x}%`);
            title.style.setProperty('--my', `${y}%`);
        });

        // Optionnel: quand la souris sort, retour au centre
        title.addEventListener('mouseleave', () => {
            title.style.setProperty('--mx', '50%');
            title.style.setProperty('--my', '50%');
        });
    }
});