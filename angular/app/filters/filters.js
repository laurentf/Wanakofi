'use strict';

/* Filters */

var myappFilters = angular.module('myappFilters', []);

myappFilters.filter('checkmark', function() {
	return function(input) {
		return input ? '\u2713' : '\u2718';
	};
});

myappFilters.filter('textFormat', function() {
	return function(input) {
		return input.replace(/\n/g, "<"+"br/>");
	};
});

myApp.filter('getUrl', function () {
    var urlPattern = /(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/gi;
    return function (text, target) {
        return text.replace(urlPattern, '<a target="' + target + '" href="$&">$&</a>');
    };
});

