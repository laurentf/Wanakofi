'use strict';

/* Controllers */

var myappControllers = angular.module('myappControllers', []);

myappControllers.controller('LoginCtrl', ['$scope', '$routeParams', '$location', '$timeout', '$filter', 'Partage', 'Utils',
 function($scope, $routeParams, $location, $timeout, $filter, Partage, Utils) {
	
    $scope.partage = Partage; // Share data between controllers
    $scope.message = "";
    $scope.errors = []; // errors
    $scope.alert = {text:'', type:''}; // alert 

    // INIT
    $scope.init = function(){
    	
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
            Partage.city = "GEO_ERROR";
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
                                                Partage.username = 'Laurent B.';  
                                            }
                                        });
                        } else {
                            Partage.city = "NOWHERE";
                        }
                    } else {
                        Partage.city = "GEO_ERROR";
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
    $scope.message = "";
    $scope.errors = []; // errors
    $scope.alert = {text:'', type:''}; // alert

    $scope.usersList = [];
    $scope.numUsers = 0;
  
    // INIT
    $scope.init = function(){

        // when geoloc is ready
        $scope.$watch('partage.city', function(newValue, oldValue) {
            if(newValue !== null) {
                mySocket.emit('NEW_USER', {username: $scope.partage.username , city: $scope.partage.city});
            }
        });

        mySocket.on('LOGIN', function(data){
            $scope.numUsers = data.numUsers;
            console.log('LOGIN');
        });

        mySocket.on('NEW_USER', function(data){
            $scope.numUsers = data.numUsers;
            console.log('NEW USER ' + data.username + ' ' + data.city);
            $scope.usersList.push({username: data.username, city: data.city});
        });

        mySocket.on('USER_LEFT', function(data){
            $scope.numUsers = data.numUsers;
            console.log('USER LEFT ' + data.username + ' ' + data.city);
        });

	
    }
		
    $scope.init();

   
	
}]);
