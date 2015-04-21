'use strict';

/* App Module */

var myApp = angular.module('myApp', [
  'ngRoute',
  'ngAnimate',
  'ngSanitize',
  'ngCookies',
  'btford.socket-io',
  'myappControllers',
  'myappFilters',
  'myappResources',
  'myappServices',
  'myappDirectives',
  'ui.bootstrap',
  'ui.utils',
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

// small function in order to check if the user is authenticated on the nodejs server
var checkLoggedin = function($q, $timeout, $http, $location, $rootScope, Partage){ 
	var deferred = $q.defer(); // promise
	
	$http.get('http://localhost:3000/loggedin', {
       withCredentials: true
    }).success(function(user){ 

      // facebook connect
      if(user.provider == "facebook"){
          Partage.username = user.name.givenName + ' ' + user.name.familyName.substr(0,1) + '.';
          Partage.avatar = 'http://graph.facebook.com/'+user.id+'/picture';
      }

      // twitter connect
      if(user.provider == "twitter"){
          Partage.username = user.username;
          Partage.avatar = user.photos[0].value;
      }


  		if (user !== '0'){ // ok
  			deferred.resolve(); // authenticated
  		}
  		else { // need to log in
  			deferred.reject(); // not Authenticated 
  			$location.url('/login'); // redirect to login
  		} 
  		}); 
  		return deferred.promise;
};

//routage
myApp.config(['$routeProvider', '$provide', '$httpProvider', 
  function($routeProvider, $provide, $httpProvider) {

	// configuration surcharge exception angular TODO
	
	// allow cross domains http request
	//$httpProvider.defaults.useXDomain = true;
  //delete $httpProvider.defaults.headers.common['X-Requested-With'];
	
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
          },
		  resolve: { loggedin: checkLoggedin } // got to be authenticated to enter in the chatroom
      }).
      otherwise({
          redirectTo: '/login'
      });

  }]);


myApp.run(function($rootScope, $location) {
    $rootScope.location = $location;
});


