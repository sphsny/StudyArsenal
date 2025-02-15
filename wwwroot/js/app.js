    $(document).ready(function () {

    $('#page-content-wrapper').load('pages/home.html');

    $('#home').click(function () {
        $('#page-content-wrapper').load('pages/home.html', 'home.js');
    });

    $('#overview').click(function () {
        $('#page-content-wrapper').load('pages/overview.html');
    });

    $('#timer').click(function () {
        $('#page-content-wrapper').load('pages/timer.html');
    });

    $('#statistics').click(function () {
        $('#page-content-wrapper').load('pages/statistics.html');
    });

    $('#calendar').click(function () {
        $('#page-content-wrapper').load('pages/calendar.html');
    });

    $('#about').click(function () {
        $('#page-content-wrapper').load('pages/about.html');
    });
});