$(document).ready(function () {
    loadPage('home'); // load home page by default

    // routing spa set up to load each page when corresponding element with id is clicked (navbar)
    $('#home').click(function () { loadPage('home'); });
    $('#overview').click(function () { loadPage('overview'); });
    $('#timer').click(function () { loadPage('timer'); });
    $('#statistics').click(function () { loadPage('statistics'); });
    $('#calendar').click(function () { loadPage('calendar'); });
    $('#about').click(function () { loadPage('about'); });

    // function to load page
    function loadPage(pageName) {
        $('#page-content-wrapper').load(`pages/${pageName}.html`, function () { // load the page from /pages
            $.getScript(`js/${pageName}.js`); // load the js script along with the page from /js
        });
    }
});
