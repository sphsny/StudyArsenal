// page definitions
const pages = {
    home: 'pages/home.html',
    overview: 'pages/overview.html',
    timer: 'pages/timer.html',
    calendar: 'pages/calendar.html',
    statistics: 'pages/statistics.html',
    about: 'pages/about.html',
    contact: 'pages/contact.html'
};

// load content into #main-content div
function loadPage(page) {
    if (pages[page]) {
        fetch(pages[page])
            .then(response => {
                if (!response.ok) {
                    throw new Error('Page not found');
                }
                return response.text();
            })
            .then(data => {
                document.getElementById('main-content').innerHTML = data; // Update main content
                history.pushState({ page: page }, page, `#${page}`); // Update URL hash
            })
            .catch(error => {
                console.error('Error fetching the page:', error);
                document.getElementById('main-content').innerHTML = '<p>Sorry, the page could not be loaded.</p>';
            });
    } else {
        // fallback for undefined pages
        document.getElementById('main-content').innerHTML = "<h2>404 - Page Not Found</h2>";
    }
}

// event listeners for navigation links
document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault(); // Prevent default link behavior
            const page = this.getAttribute('data-page'); // Get the page name from data-page
            loadPage(page);
        });
    });

    // load the initial page based on the URL hash
    const initialPage = location.hash.replace('#', '') || 'home'; // default to home if no hash
    loadPage(initialPage);
});

// handle browser navigation (back/forward buttons)
window.addEventListener("hashchange", () => {
    const page = location.hash.substring(1) || "home";
    loadPage(page);
});