'use strict';

/* Controllers */

var myappControllers = angular.module('myappControllers', []);

myappControllers.controller('LoginCtrl', ['$scope', '$routeParams', '$location', '$http', '$timeout', '$filter', 'Partage', 'Utils',
 function($scope, $routeParams, $location, $http, $timeout, $filter, Partage, Utils) {
	
    $scope.partage = Partage; // Share data between controllers
    $scope.message = "";
    $scope.errors = []; // errors
    $scope.alert = {text:'', type:''}; // alert 

    // INIT
    $scope.init = function(){
        // CLEAN SESSION 
    	$http.get(serverHost + '/logout', {
         withCredentials: true
         }).success(function(data){
            // do something ?
         }); 
    }

    $scope.init();
    
}]);

myappControllers.controller('MenuCtrl', ['$scope', '$routeParams', '$location', '$timeout', '$filter', 'Partage', 'Utils',
 function($scope, $routeParams, $location, $timeout, $filter, Partage, Utils) {
	
    $scope.partage = Partage; // share data between controllers
    $scope.geocoder = null;

    // INIT
    $scope.init = function(){


        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(successFunction, errorFunction);
        }
        // get the latitude and the longitude;
        function successFunction(position) {
            var lat = position.coords.latitude;
            var lng = position.coords.longitude;
            codeLatLng(lat, lng);
        }

        function errorFunction() {
            Partage.city = "GEO_ERROR_1";
        }

        function initializeGeolocation() {
            $scope.geocoder = new google.maps.Geocoder();
        }

        function codeLatLng(lat, lng) {
            var latlng = new google.maps.LatLng(lat, lng);
            $scope.geocoder.geocode({'latLng' : latlng},
                function(results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        if (results[1]) {
                            var arrAddress = results;
                            // console.log(results);
                            // iterate through address_component array
                            $.each(arrAddress,
                                        function(i, address_component) {
                                            if (address_component.types[0] == "locality") {
                                                var completeCityName = address_component.address_components[0].long_name;
                                                // console.log("City: " + completeCityName);
                                                Partage.city = completeCityName; 
                                                // Partage.city = 'Test';
                                            }
                                        });
                        } else {
                            Partage.city = "NO_WHERE";
                        }
                    } else {
                        Partage.city = "GEO_ERROR_2";
                    }
                });
        }

        initializeGeolocation();

    }

    $scope.init();

}]);

myappControllers.controller('ChatCtrl', ['$scope', '$routeParams', '$location', '$timeout', '$filter', 'Partage', 'Utils', 'mySocket', 'MessageStorage',
 function($scope, $routeParams, $location, $timeout, $filter, Partage, Utils, mySocket, MessageStorage) {

    $scope.partage = Partage; // share data between controllers
   
    $scope.errors = []; // errors
    $scope.alert = {text:'', type:''}; // alert

	$scope.message = ""; // chat message
	$scope.messages = null // chat messages
    $scope.usersList = [];
    $scope.numUsers = 0;
  
    // INIT
    $scope.init = function(){

        // when geoloc is ready
        $scope.$watch('partage.city', function(newValue, oldValue) {
            if(newValue !== null) {
                // if the geoloc is not in error, then weve got a city to connect
                if(newValue !== 'GEO_ERROR_1' && newValue !== 'GEO_ERROR_2' && newValue !== 'NO_WHERE'){
                    MessageStorage.setId(newValue); // set storage id
                    $scope.messages = MessageStorage.get(); // chat messages from localStorage
                    mySocket.emit('NEW_USER', {id: $scope.partage.id, provider: $scope.partage.provider, username: $scope.partage.username , city: $scope.partage.city, avatar: $scope.partage.avatar});
                }
                else{
                    // if geoloc is in error, redirect to login
                    $location.path('/login');
                }
            }
        });
					
		// destroy socket when leaving the chat
		$scope.$on('$destroy', function () {
			  mySocket.disconnect();
		});

        mySocket.on('LOGIN', function(data){
            $scope.numUsers = data.numUsers;
            // scroll bottom if necessary
                if(!Partage.isScrolling){
                    Partage.isScrolling = true;
                    $("html, body").animate(
                    { scrollTop: $(document).height() },
                    1000,
                        function(){
                            Partage.isScrolling = false;
                        }
                    );
                }
            // console.log('LOGIN ' + data.numUsers);
        });

        mySocket.on('NEW_USER', function(data){
            $scope.numUsers = data.numUsers;
            $scope.usersList.push({username: data.username, city: data.city, avatar: data.avatar});
			// console.log('NEW USER ' + data.username + ' ' + data.city + ' ' + data.avatar);
        });

        mySocket.on('USER_LEFT', function(data){
            $scope.numUsers = data.numUsers;
            // console.log('USER LEFT ' + data.username + ' ' + data.city);
        });
		
		mySocket.on('NEW_MESSAGE', function(data){
            // limit to 100 messages (by city) in the localStorage
            if($scope.messages.length == 100){
                 $scope.messages.shift();
            }
            // console.log ('get a new message');
            $scope.messages.push(data);
            // store the messages list in the localStorage (max = 100)
            MessageStorage.put($scope.messages);
			
			// scroll bottom if necessary
			if(!Partage.isScrolling){
				Partage.isScrolling = true;
				$("html, body").animate(
				{ scrollTop: $(document).height() },
				1000,
					function(){
						Partage.isScrolling = false;
					}
				);
			}
			
        });
	
    }
	
    $scope.init();

}]);

myappControllers.controller('MessageCtrl', ['$scope', '$routeParams', '$location', '$timeout', '$filter', 'Partage', 'Utils', 'mySocket',
 function($scope, $routeParams, $location, $timeout, $filter, Partage, Utils, mySocket) {

    $scope.partage = Partage; // Share data between controllers
	$scope.message = ""; // chat message
	
    // INIT
    $scope.init = function(){
		$('#chatInput').focus();
    }
	
	$scope.sendMessage = function (){
		if($.trim($scope.message)!= ""){
			// console.log('send message')
            var mome = new Date().getTime();
			mySocket.emit('NEW_MESSAGE', {message : $scope.message, moment: mome});
			
			// scroll bottom if necessary
			if(!Partage.isScrolling){
				Partage.isScrolling = true;
				$("html, body").animate(
				{ scrollTop: $(document).height() },
				1000,
					function(){
						Partage.isScrolling = false;
					}
				);
			}	
		}
		$scope.message = "";
		$('#chatInput').focus();
	}
	
    $scope.init();

}]);
