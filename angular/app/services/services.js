'use strict';

/* Services */

var comagServices = angular.module('comagServices', []);

comagServices.value('Partage', {
	localisation : null
});

comagServices.factory('Utils', [ function() {
	var utils = {
		isChaineVide : function(chaine) {
			return ($.trim(chaine) == '');
		},
		inverserChaine : function(chaine) {
			return (chaine.split("").reverse().join(""));
		},
		convertirChaineMontant : function(montant) {
			return parseFloat(montant);
		}
	};
	return utils;
} ]);

