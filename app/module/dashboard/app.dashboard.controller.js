(function () {
    'use strict';

    function DashboardCtrl($q,$state, $rootScope, $scope, $log,$location, MenuService) {
        filepicker.setKey("AxyphnToYSryOvLFNnrsAz");
        
        $scope.applications = [
          {
            icon : 'img/meteoFrance.png',
            name: 'meteo france',
            key:"meteo_fr",
            zipUrl : "http://blabla.com/blala.zip",
            events: [{}]
          },
          {
            icon : 'img/auchandrive.png',
            name: 'auchandrive',
            key: 'auchandrive',
            zipUrl : "http://blabla.com/blala.zip",
            events: [{}]
          },
          {
            icon : 'img/bonial.png',
            name: 'bonial',
            key: 'bonial',
            zipUrl : "http://blabla.com/blala.zip",
            events: [{}]
          },
          {
            icon : 'img/duolingo.png',
            name: 'duolingo',
            key: 'duolingo',
            zipUrl : "http://blabla.com/blala.zip",
            events: [{}]
          },
          {
            icon : 'img/promoqui.png',
            name: 'promoqui',
            key: 'promoqui',
            zipUrl : "http://blabla.com/blala.zip",
            events: [{}]
          },
          {
            icon : 'img/spoticast.png',
            name: 'spoticast',
            key: 'spoticast',
            zipUrl : "http://blabla.com/blala.zip",
            events: [{}]
          },
          {
            icon : 'img/uber.png',
            name: 'uber',
            key: 'uber',
            zipUrl : "http://blabla.com/blala.zip",
            events: [{}]
          }
        ];

        $scope.onSelectApp = function(app){
          console.log('Selected App (for detail)', app);
        }

        $scope.onStartApp = function(app){
          console.log('Launch App', app);
        }

        $scope.onRightSwipe = function(){
          console.log('onRightSwipe');
        }

    }

    DashboardCtrl.$inject = ["$q","$state","$rootScope","$scope", "$log","$location", "menuService"];

    angular
        .module('app.dashboard')
        .controller('DashboardCtrl', DashboardCtrl);

})();
