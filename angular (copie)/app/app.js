'use strict';

/* App Module */

var comagApp = angular.module('comagApp', [
  'ngRoute',
  'ngAnimate',
  'ngSanitize',
  'comagControllers',
  'comagFilters',
  'comagResources',
  'comagServices',
  'comagDirectives',
  'ui.bootstrap',
  'angular-loading-bar',
  'angular-peity'
]);

//routage
comagApp.config(['$routeProvider', '$provide',
  function($routeProvider, $provide) {

	// configuration surcharge exception angular
  // TODO
	
	// configuration routes application
    $routeProvider.
      when('/login', {
      		templateUrl: 'angular/app/partials/login.html',
      		controller: 'LoginCtrl',
      		animations: {
      		    enter: 'enter-left',
      		    leave: 'leave-left'
      		}
      }).
      when('/chat', {
          templateUrl: 'angular/app/partials/chat.html',
          controller: 'ChatCtrl',
          animations: {
              enter: 'enter-left',
              leave: 'leave-left'
          }
      }).
      otherwise({
          redirectTo: '/login'
      });

  }]);


comagApp.run(function($rootScope, $location) {
    $rootScope.location = $location;
});


