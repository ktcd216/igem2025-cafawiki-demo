// js/main.js
document.addEventListener('DOMContentLoaded', () => {

    // --- Collapsible Panel Logic ---
    const collapsibleBtns = document.querySelectorAll('.collapsible-btn');
    collapsibleBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            this.classList.toggle('active');
            const content = this.nextElementSibling;
            if (content.style.maxHeight) {
                content.style.maxHeight = null;
            } else {
                content.style.maxHeight = content.scrollHeight + 'px';
            }
        });
    });

    // --- Navigation Submenu Logic (Hover-triggered) ---
    const hasSubmenus = document.querySelectorAll('.has-submenu');

    hasSubmenus.forEach(item => {
        const submenu = item.querySelector('.submenu');
        if (submenu) {
            let timeout;

            // Show submenu on mouse enter
            item.addEventListener('mouseenter', () => {
                clearTimeout(timeout);
                submenu.style.display = 'block';
                setTimeout(() => { // Small delay for opacity/transform transition
                    submenu.style.opacity = '1';
                    submenu.style.visibility = 'visible';
                    submenu.style.transform = 'translateY(0)';
                }, 10); // A very small delay
            });

            // Hide submenu on mouse leave
            item.addEventListener('mouseleave', () => {
                timeout = setTimeout(() => {
                    submenu.style.opacity = '0';
                    submenu.style.visibility = 'hidden';
                    submenu.style.transform = 'translateY(10px)';
                    // After transition, set display to none
                    submenu.addEventListener('transitionend', function handler() {
                        if (submenu.style.opacity === '0') {
                            submenu.style.display = 'none';
                        }
                        submenu.removeEventListener('transitionend', handler);
                    });
                }, 300); // Delay before hiding
            });

            // Keep submenu visible if mouse enters submenu directly from parent
            submenu.addEventListener('mouseenter', () => {
                clearTimeout(timeout);
            });

            submenu.addEventListener('mouseleave', () => {
                timeout = setTimeout(() => {
                    submenu.style.opacity = '0';
                    submenu.style.visibility = 'hidden';
                    submenu.style.transform = 'translateY(10px)';
                    submenu.addEventListener('transitionend', function handler() {
                        if (submenu.style.opacity === '0') {
                            submenu.style.display = 'none';
                        }
                        submenu.removeEventListener('transitionend', handler);
                    });
                }, 300);
            });
        }
    });

    // --- Smooth scrolling for internal links (if not using CSS scroll-behavior) ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});
