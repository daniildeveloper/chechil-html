'use strict';

var owl = {};

window.onload = function () {
    owl = $('.slider'); // init owl carousel

    owl.owlCarousel({
        loop: true,
        items: 1,
        singleItem: true,
        lazyLoad: true,
        dots: false,
        nav: false,
        animateOut: 'slideOutDown',
        animateIn: 'fadeIn',
        autoPlay: true,
        autoPlayTimeout: 1000,
        autoplayHoverPause: true
    });

    initAppointmentPicker();
    initDatePicker();
    selectsInit();
    calendarInit();

    $(document).ready(function (e) {
        $('#doctor-choose').msDropdown();
        $('#doctor-choose_msdd').removeAttr("style");

        // decline proposalmodal show
        $('#proposalDecline').on('click', function (e) {
            $('#exampleModalCenter').modal();
        });

        $('#calendar').fullCalendar({
            defaultView: 'agendaWeek',
            minTime: "08:00:00",
            maxTime: "21:00:00",
            locale: 'ru'
        });

        $('#fc-shedule-doctor-week-agenda-peeker').fullCalendar({
            defaultView: 'agendaWeek',
            minTime: "08:00:00",
            maxTime: "21:00:00",
            locale: 'ru',
            header: { // hide header data
                center: '',
                right: '',
                left: ''
            },
            allDaySlot: false
        });
    });

    // for development uses only
    addHotkeysWatch();
    initMap();
};

/**
 * Go to next slide in owl carousel
 */
function nextSlide(e) {
    owl.trigger('next.owl.carousel');
    window.dispatchEvent(new Event('owl.next'));
    window.dispatchEvent(new Event('next.owl.carousel'));
}

/**
 * Go to previous slide in owl carousel
 * @param {Event} e passed event
 */
function prevSlide(e) {
    owl.trigger('prev.owl.carousel');
    window.dispatchEvent(new Event('owl.prev'));
    window.dispatchEvent(new Event('prev.owl.carousel'));
}

/**
 * Create new route by type and coordinates
 * @param {String} type route type. Pert or car
 * @param {Array} startPoint array with start point coordinates
 */
function createRoute(type, startPoint) {
    var multiRoute = new ymaps.multiRouter.MultiRoute({
        referencePoints: [startPoint, [55.749511, 37.537083]],
        params: {
            routingMode: type
        }
    }, {
        // Автоматически устанавливать границы карты так, чтобы маршрут был виден целиком.
        boundsAutoApply: true
    });

    return multiRoute;
}

/**
 * nitialzie car route to given object
 * @param {ymaps.Map} map Map where to init
 */
function createAutoRoute(map) {
    map.geoObjects.removeAll();
    map.geoObjects.add(createRoute('auto', [55.738539, 37.528629]));
    map.geoObjects.add(createRoute('auto', [55.754147, 37.560601]));
}

/**
 * nitialzie pericipinat route to given object
 * @param {ymaps.Map} map Map where to init
 */
function createPerticipinatRoute(map) {
    map.geoObjects.removeAll();
    map.geoObjects.add(createRoute('masstransit', [55.747806, 37.533070]));
    // map.geoObjects.add(createRoute('masstransit', [55.655400, 37.954024]));
    // map.geoObjects.add(createRoute('masstransit', [55.668686, 37.923359]));
}

/**
 * Initialize map. Ussually in popup
 */
function initMap() {
    var myMap;
    var myPlacemark;
    // if (!$('#map_yandex').size()) return;
    ymaps.ready(init);

    function init() {
        myMap = new ymaps.Map("map_yandex", {
            center: [55.749511, 37.537083],
            zoom: 16
        }), myPlacemark = new ymaps.Placemark([55.749511, 37.537083], {}, {});
        myMap.geoObjects.add(myPlacemark);
    }
    $('body').on('click', '.btn-walk', function () {
        createPerticipinatRoute(myMap);
        return false;
    });
    $('body').on('click', '.btn-car', function () {
        createAutoRoute(myMap);
        return false;
    });
}

function initAppointmentPicker() {
    var picker = new AppointmentPicker(document.getElementById('appointment-picker'), {
        title: 'Пятница, 18.05.2018',
        interval: 30,
        mode: '24h',
        minTime: 9,
        maxTime: 19,
        startTime: 9,
        endTime: 19,
        disabled: ['16:30', '17:00'],
        static: true
    });
}

function initDatePicker() {
    var datePicker = new Pikaday({
        field: document.getElementById('date-reseravation-picker'),
        bound: false,
        firstDay: 1,
        showDaysInNextAndPreviousMonths: true,
        disableDayFn: function disableDayFn(date) {
            return date.getDay() === 1;
        }
    });
}

function closeContents() {
    $('#contents').addClass('disabled');
}

function addHotkeysWatch() {
    hotkeys('ctrl+x', function (event, handler) {
        event.preventDefault();
        console.log('now toggling show contents');
        $('#contents').toggleClass('disabled');
    });
}

function selectsInit() {
    customSelect('#doctor-category-choose');
}

function calendarInit() {}