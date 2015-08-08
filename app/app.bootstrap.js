(function () {

    'use strict';

    if ('addEventListener' in document) {
        alert('listen deviceready')
        document.addEventListener('DOMContentLoaded', contentLoaded, false);
        document.addEventListener('deviceready', deviceReady, false);
    }

    function contentLoaded() {
        FastClick.attach(document.body);
        if(window.isMock){
            deviceReady();
        }
    }

    function deviceReady() {
        alert('starting...')
        angular.bootstrap(document, ['app']);
    }

})();
