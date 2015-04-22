'use strict';

/* Services */

var myappServices = angular.module('myappServices', []);

// Very useful piece of code in order to share data between controllers 
myappServices.value('Partage', {
	id: null,
	provider: null,
	city : null,
	username : null,
	avatar : null,
	isScrolling : false
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
}]);


// service that persists and retrieves chat messages from localStorage
myappServices.factory('MessageStorage', [ function () {
	//var encodedRoom = window.btoa(unescape(encodeURIComponent(room)));
	var STORAGE_ID = 'wanakofi-messages-';

	return {
		setId: function (room) {
			var encRoom= window.btoa(unescape(encodeURIComponent( room )));
			STORAGE_ID = STORAGE_ID + encRoom;
			console.log('store for ' + room + '=>' + STORAGE_ID);
		},
		get: function () {
			return JSON.parse(localStorage.getItem(STORAGE_ID) || '[]');
		},

		put: function (messages) {
			localStorage.setItem(STORAGE_ID, JSON.stringify(messages));
		}
	};
}]);


