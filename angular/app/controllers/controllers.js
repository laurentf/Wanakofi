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
    	$http.get('http://localhost:3000/logout', {
         withCredentials: true
         }).success(function(data){
            // do something ?
         }); 
    }

    $scope.init();
    
}]);

myappControllers.controller('MenuCtrl', ['$scope', '$routeParams', '$location', '$timeout', '$filter', 'Partage', 'Utils',
 function($scope, $routeParams, $location, $timeout, $filter, Partage, Utils) {
	
    $scope.partage = Partage; // Share data between controllers
    $scope.geocoder = null;

    // INIT
    $scope.init = function(){


        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(successFunction, errorFunction);
        }
        // Get the latitude and the longitude;
        function successFunction(position) {
            var lat = position.coords.latitude;
            var lng = position.coords.longitude;
            codeLatLng(lat, lng);
        }

        function errorFunction() {
            Partage.city = "GEO_ERROR1";
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
                            //console.log(results);
                            // iterate through address_component array
                            $.each(arrAddress,
                                        function(i, address_component) {
                                            if (address_component.types[0] == "locality") {
                                                var completeCityName = address_component.address_components[0].long_name;
                                                //console.log("City: " + completeCityName);
                                                Partage.city = completeCityName; 
                                            }
                                        });
                        } else {
                            Partage.city = "NOWHERE";
                        }
                    } else {
                        Partage.city = "GEO_ERROR2";
                    }
                });
        }

        initializeGeolocation();

    }

    $scope.init();

}]);

myappControllers.controller('ChatCtrl', ['$scope', '$routeParams', '$location', '$timeout', '$filter', 'Partage', 'Utils', 'mySocket',
 function($scope, $routeParams, $location, $timeout, $filter, Partage, Utils, mySocket) {

    $scope.partage = Partage; // Share data between controllers
   
    $scope.errors = []; // errors
    $scope.alert = {text:'', type:''}; // alert

	$scope.message = ""; // chat message
    $scope.usersList = [];
	$scope.messages = [] // chat messages
    $scope.numUsers = 0;
  
    // INIT
    $scope.init = function(){

        // when geoloc is ready
        $scope.$watch('partage.city', function(newValue, oldValue) {
            if(newValue !== null) {
                mySocket.emit('NEW_USER', {username: $scope.partage.username , city: $scope.partage.city, avatar: $scope.partage.avatar});
            }
        });

        mySocket.on('LOGIN', function(data){
            $scope.numUsers = data.numUsers;
            console.log('LOGIN ' + data.numUsers);
        });

        mySocket.on('NEW_USER', function(data){
            $scope.numUsers = data.numUsers;
            console.log('NEW USER ' + data.username + ' ' + data.city + ' ' + data.avatar);
            $scope.usersList.push({username: data.username, city: data.city, avatar: data.avatar});
        });

        mySocket.on('USER_LEFT', function(data){
            $scope.numUsers = data.numUsers;
            console.log('USER LEFT ' + data.username + ' ' + data.city);
        });
		
		mySocket.on('NEW_MESSAGE', function(data){
            console.log ('get a new message');
			$scope.messages.push(data);
			
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
			console.log('send message')
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
		$scope.message="";
		$('#chatInput').focus();
	}
	
    $scope.init();

}]);
