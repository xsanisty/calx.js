// Navigation component for all example pages
(function() {
    const examples = [
        { name: 'Home', url: 'index.html' },
        { name: 'Basic', url: 'jquery-basic.html' },
        { name: 'Data Types', url: 'jquery-datatypes.html' },
        { name: 'Dynamic Form', url: 'jquery-dynamic-form.html' },
        { name: 'Formatters', url: 'jquery-formatters.html' },
        { name: 'Multisheet', url: 'jquery-multisheet.html' },
        { name: 'Advanced', url: 'jquery-advanced.html' },
        { name: 'Test Suite', url: 'jquery-test-suite.html' }
    ];

    // Get current page filename
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    // Build navigation HTML
    function buildNavbar() {
        const linksHTML = examples.map(ex => {
            const isActive = ex.url === currentPage ? 'active' : '';
            return `<a href="${ex.url}" class="${isActive}">${ex.name}</a>`;
        }).join('');

        return `
            <nav class="navbar">
                <div class="navbar-content">
                    <a href="index.html" class="navbar-brand">
                        <span>📊</span> jQuery Calx Examples
                    </a>
                    <div class="navbar-links">
                        ${linksHTML}
                    </div>
                </div>
            </nav>
        `;
    }

    // Insert navbar at the beginning of body
    document.addEventListener('DOMContentLoaded', function() {
        // Check if navbar already exists
        if (document.querySelector('.navbar')) {
            return;
        }

        const navbar = buildNavbar();
        document.body.insertAdjacentHTML('afterbegin', navbar);

        // Wrap existing content if not already wrapped
        const existingContent = document.body.querySelector(':not(.navbar)');
        if (existingContent && !document.querySelector('.content')) {
            const wrapper = document.createElement('div');
            wrapper.className = 'content';

            // Move all non-navbar elements to wrapper
            while (document.body.children.length > 1) {
                const child = document.body.children[1];
                wrapper.appendChild(child);
            }

            document.body.appendChild(wrapper);
        }
    });
})();
