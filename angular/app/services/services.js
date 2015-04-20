'use strict';

/* Services */

var myappServices = angular.module('myappServices', []);

// Very useful piece of code in order to share data between controllers 
myappServices.value('Partage', {
	localisation : null
});

myappServices.factory('Utils', [ function() {
	var utils = {
		isestr : function(chaine) {
			return ($.trim(chaine) == '');
		},
		invstr : function(chaine) {
			return (chaine.split("").reverse().join(""));
		},
		strtof : function(montant) {
			return parseFloat(montant);
		}
	};
	return utils;
} ]);

