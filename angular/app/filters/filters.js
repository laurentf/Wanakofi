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
    var imgPattern = /\[img\](.*?)\[\/img\]/i;

	//var replace = "<a href=\""+img+"\" target=\"_blank\"><img style=\"border: 5px solid dodgerblue;\" id=\"imgB64\" src=\"$1\" alt=\"test\"></a>";
	var imgReplace = "<img style=\"cursor: pointer; border: 5px solid dodgerblue;\" id=\"imgB64\" src=\"$1\" alt=\"test\">";
	str = str.replace(search, replace);

    return function (text, target) {
    	var resp = "";
        resp += text.replace(urlPattern, '<a target="' + target + '" href="$&">$&</a>');
        resp += text.replace(imgPattern, imgReplace);
        //resp += text.replace(imgPattern, '<a target="' + target + '" href="$&">TEST</a>');
        return resp;
    };
});

