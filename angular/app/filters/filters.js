'use strict';

/* Filters */

var comagFilters = angular.module('comagFilters', []);

comagFilters.filter('checkmark', function() {
	return function(input) {
		return input ? '\u2713' : '\u2718';
	};
});
/* Filters */

comagFilters.filter('formaterTexte', function() {
	return function(input) {
		return input.replace(/\n/g, "<"+"br/>");
	};
});

