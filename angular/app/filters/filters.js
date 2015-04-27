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

myApp.filter('urlToLink', function () {
    var urlPattern = /(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/gi;
  
    return function (text, target) {
    	var resp = "";
        resp += text.replace(urlPattern, '<a target="' + target + '" href="$&">$&</a>');
        return resp;
    };
});

myApp.filter('imgToSrc', function () {

    var imgPattern = /\[img\](.*?)\[\/img\]/i;
	
    return function (text, target) {
    	var imgReplace = "<a href=\""+text+"\" target=\"_blank\"><img style=\"border: 5px solid dodgerblue;\" id=\"imgB64\" src=\"$1\" alt=\"test\"></a>";
    	var resp = "";
        resp += text.replace(imgPattern, imgReplace);
        return resp;
    };
});

