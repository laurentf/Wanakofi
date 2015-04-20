'use strict';

/* Services */

var myappResources = angular.module('myappResources', ['ngResource']);

myappResources.factory('Test', ['$resource',
   	  function($resource){
   	    return $resource('http://localhost/angular', {}, {
   	    	 get: { method: 'GET', cache : false}
   	    });
   	  }]);


