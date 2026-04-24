document.addEventListener('DOMContentLoaded', () => {
    // --- Typed subtitle (simple, beginner-friendly) ---
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

    // --- Sticky header + small parallax effect for hero background ---
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
});