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
  var myIoSocket = io.connect(serverHost);
  var mySocket = socketFactory({
    ioSocket: myIoSocket
  });
  return mySocket;
});

// check login middleware, handle authentication response
var checkLoggedin = function($q, $timeout, $http, $location, $rootScope, Partage){ 
	var deferred = $q.defer(); // promise
	
	$http.get(serverHost + '/loggedin', {
       withCredentials: true
    }).success(function(user){ 

		if (user !== '0'){ // is logged in
			// set profile info
			
			// set provider
			Partage.provider = user.provider;
			// set id
			Partage.id = user.id;
		  
			// facebook connect specific info
			if(user.provider == "facebook"){
				Partage.username = user.name.givenName + ' ' + user.name.familyName.substr(0,1) + '.';
				Partage.avatar = 'http://graph.facebook.com/'+user.id+'/picture';
			}

			// twitter connect specific info
			if(user.provider == "twitter"){
				Partage.username = user.username;
				Partage.avatar = user.photos[0].value;
			}

      // google connect specific info
      if(user.provider == "google"){
        Partage.username = user.name.givenName + ' ' + user.name.familyName.substr(0,1) + '.';
        Partage.avatar = user.photos[0].value;
      }
			
			deferred.resolve(); // authenticated
		}
		else { // is not logged in
			deferred.reject(); // not authenticated 
			$location.url('/login'); // redirect to login
		} 
			
		}); 
  		return deferred.promise;
};

// check the user joined a room middleware, handle chat access
var joinedRoom = function($q, $timeout, $http, $location, $rootScope, Partage){ 
  var deferred = $q.defer(); // promise
  
  if(Partage.room != ""){
      deferred.resolve(); // room ok
  } 
  else{
      deferred.reject(); // room not ok 
      $location.url('/lobby'); // redirect to lobby
  }

  return deferred.promise;
};

//routage
myApp.config(['$routeProvider', '$provide', '$httpProvider', 
  function($routeProvider, $provide, $httpProvider) {

	// configuration surcharge exception angular TODO
	
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
      when('/chat/:room', {
          templateUrl: 'angular/app/partials/chat.html',
          controller: 'ChatCtrl',
          animations: {
              enter: 'enter-left',
              leave: 'leave-left'
          },
		  resolve: { loggedin: checkLoggedin, joinedRoom: joinedRoom } // (got to be authenticated and has joined a room) to enter in the chatroom
      }).
      when('/lobby', {
          templateUrl: 'angular/app/partials/lobby.html',
          controller: 'LobbyCtrl',
          animations: {
              enter: 'enter-left',
              leave: 'leave-left'
          },
      resolve: { loggedin: checkLoggedin } // got to be authenticated to enter in the lobby
      }).
      otherwise({
          redirectTo: '/lobby'
      });

  }]);


myApp.run(function($rootScope, $location) {
    $rootScope.location = $location;
});


