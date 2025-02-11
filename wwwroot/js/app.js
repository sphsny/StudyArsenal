/*
 * Solution for SPA with dynamic content loading and script reattachment
 * Based on concepts from:
 * - JavaScript Fetch API (for dynamic content loading)
 * - jQuery (for DOM manipulation)
 * - Custom logic for executing scripts after dynamic page load
 * 
 * Created with assistance from ChatGPT (OpenAI) and learning resources such as MDN, Stack Overflow
 */

document.addEventListener("DOMContentLoaded", function () {
    const pages = {
        home: "pages/home.html",
        overview: "pages/overview.html",
        timer: "pages/timer.html",
        calendar: "pages/calendar.html",
        statistics: "pages/statistics.html",
        about: "pages/about.html"
    };

    function loadPage(page) {
        if (!pages[page]) {
            document.getElementById("main-content").innerHTML = "<h2>404 - Page Not Found</h2>";
            return;
        }

        fetch(pages[page])
            .then(response => response.text())
            .then(html => {
                document.getElementById("main-content").innerHTML = html;
                history.pushState({ page }, "", `#${page}`);
                reattachScripts(); // run scripts after loading main-content, else js doesn't work
            })
            .catch(error => {
                console.error("Error loading page:", error);
                document.getElementById("main-content").innerHTML = "<h2>Failed to load the page.</h2>";
            });
    }

    function reattachScripts() {
        const scripts = document.querySelectorAll("#main-content script");
        scripts.forEach(oldScript => {
            const newScript = document.createElement("script");
            if (oldScript.src) {
                newScript.src = oldScript.src; 
            } else {
                newScript.textContent = oldScript.textContent;
            }
            document.body.appendChild(newScript);
            oldScript.remove();
        });

    }

    // handle nav bar
    document.querySelectorAll("nav a").forEach(link => {
        link.addEventListener("click", function (e) {
            e.preventDefault();
            loadPage(this.getAttribute("data-page"));
        });
    });

    loadPage(location.hash.substring(1) || "home");

});
