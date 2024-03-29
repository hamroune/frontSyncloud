(function () {
  'use strict';

  angular.module('app.toolbar')
    .directive('toolbar', function() {
      return {
        restrict: 'E',
        require :"ngModel",
        templateUrl: 'module/directives/toolbar/toolbar.html',

         controller : ['$scope', 'ApplicationService',
				function($scope, ApplicationService) {
					$scope.syncAll = function(){
						ApplicationService.syncAll();
					}
				}
			]
  	  };
  });
})();
