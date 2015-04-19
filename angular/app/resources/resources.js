'use strict';

/* Services */

var comagResources = angular.module('comagResources', ['ngResource']);

comagResources.factory('Test', ['$resource',
   	  function($resource){
   	    return $resource('http://localhost/angular', {}, {
   	    	 get: { method: 'GET', cache : false}
   	    });
   	  }]);


