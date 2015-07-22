(function () {
    'use strict';

    function DashboardCtrl($q,$state, $rootScope, $scope, $log, MenuService) {

        var that = this;


    $scope.todos = [
      {
        face : 'img/meteoFrance.png',
        name: 'meteo france',
        zipUrl : "http://blabla.com/blala.zip",
        events: [{}]
      },
      {
        face : 'img/auchandrive.png',
        name: 'auchandrive',
        zipUrl : "http://blabla.com/blala.zip",
        events: [{}]
      },
      {
        face : 'img/bonial.png',
        name: 'bonial',
        zipUrl : "http://blabla.com/blala.zip",
        events: [{}]
      },
      {
        face : 'img/duolingo.png',
        name: 'duolingo',
        zipUrl : "http://blabla.com/blala.zip",
        events: [{}]
      },
      {
        face : 'img/promoqui.png',
        name: 'promoqui',
        zipUrl : "http://blabla.com/blala.zip",
        events: [{}]
      },
      {
        face : 'img/spoticast.png',
        name: 'spoticast',
        zipUrl : "http://blabla.com/blala.zip",
        events: [{}]
      },
      {
        face : 'img/uber.png',
        name: 'uber',
        zipUrl : "http://blabla.com/blala.zip",
        events: [{}]
      }
    ];
    $scope.a=function(){
      console.log(2);
    }

    }

    DashboardCtrl.$inject = ["$q","$state","$rootScope","$scope", "$log", "menuService"];

    angular
        .module('app.dashboard')
        .controller('DashboardCtrl', DashboardCtrl);

})();
