'use strict';

/* App Module */

var myApp = angular.module('myApp', [
  'ngRoute',
  'ngAnimate',
  'ngSanitize',
  'btford.socket-io',
  'myappControllers',
  'myappFilters',
  'myappResources',
  'myappServices',
  'myappDirectives',
  'ui.bootstrap',
  'angular-loading-bar',
  'angular-peity'
]).
factory('mySocket', function (socketFactory) {
  var myIoSocket = io.connect(host_name + ':3000');
  var mySocket = socketFactory({
    ioSocket: myIoSocket
  });
  //mySocket.forward('broadcast');
  return mySocket;
});

//routage
myApp.config(['$routeProvider', '$provide',
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


myApp.run(function($rootScope, $location) {
    $rootScope.location = $location;
});


