'use strict';

/* Controllers */

var myappControllers = angular.module('myappControllers', []);

myappControllers.controller('LoginCtrl', ['$scope', '$routeParams', '$location', '$timeout', '$filter', 'Partage', 'Utils',
 function($scope, $routeParams, $location, $timeout, $filter, Partage, Utils) {
	
    $scope.partage = Partage; //objet de partage de données
    
    $scope.message = "";
    $scope.errors = []; //liste des erreurs
    $scope.alert = {text:'', type:''}; //liste des alertes 

    // INIT
    $scope.init = function(){
    	
    }

    $scope.init();
    
}]);

myappControllers.controller('MenuCtrl', ['$scope', '$routeParams', '$location', '$timeout', '$filter', 'Partage', 'Utils',
 function($scope, $routeParams, $location, $timeout, $filter, Partage, Utils) {
	
    $scope.partage = Partage; //objet de partage de données

    $scope.message = "";
    $scope.errors = []; //liste des erreurs
    $scope.alert = {text:'', type:''}; //liste des alertes 

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
            Partage.localisation = "Geocoder failed";
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
                            console.log(results);
                            // iterate through address_component array
                            $.each(arrAddress,
                                        function(i, address_component) {
                                            if (address_component.types[0] == "locality") {
                                                var completeCityName = address_component.address_components[0].long_name;
                                                console.log("City: "
                                                                + completeCityName);
                                                Partage.localisation = completeCityName;
                                            }
                                        });
                        } else {
                            Partage.localisation = "No result";
                        }
                    } else {
                        Partage.localisation = "Geocoder failed due to: " + status;
                    }
                });
        }

        initializeGeolocation();

    }

    $scope.init();
    
}]);

myappControllers.controller('ChatCtrl', ['$scope', '$routeParams', '$location', '$timeout', '$filter', 'Partage', 'Utils', 'mySocket',
 function($scope, $routeParams, $location, $timeout, $filter, Partage, Utils, mySocket) {
	
    $scope.partage = Partage; //objet de partage de données
    $scope.message = "";
    $scope.errors = []; //liste des erreurs
    $scope.alert = {text:'', type:''}; //liste des alertes 

    // INIT
    $scope.init = function(){
		mySocket.emit('join', $scope.partage.localisation);
		$scope.$emit('socket:join', $scope.partage.localisation);
		
		mySocket.on('loc', function(data){
			console.log('YOOOO'+data);
			Partage.localisation = data;
		});
    }
		
    $scope.init();
	
}]);
