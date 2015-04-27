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

myApp.filter('parseMessage', function () {
  
    var search = new Array(
		  /\*\*(.*?)\*\*/gi,  
		  /\*(.*?)\*/gi,
		  /(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/gi
	);

	var replace = new Array(
		  "<strong>$1</strong>",
		  "<em>$1</em>",
		  "<a target=\"_blank\" href=\"$&\">$&</a>"
	);
		  
    return function (text) {
    	for (var i = 0; i < search.length; i++) {
			text = text.replace(search[i], replace[i]);
		}
    	return text;
    };
});

myApp.filter('imgToSrc', function () {

	var parseImg = function (img) {
		var search = /\[img\](.*?)\[\/img\]/i;
		var replace = "$1";
		var str = img.replace(search, replace);
		
		return str;
	}

	var resizeImg = function (img, w) {
	    var oW = img.naturalWidth;
	    var oH = img.naturalHeight;
	    // create an off-screen canvas for resized image
	    var canvas = document.createElement('canvas'),
	        ctx = canvas.getContext('2d');

	    // set its dimension to target size
	    canvas.width = w;
	    canvas.height = oH*(w/oW);
	    
	    // draw source image into the off-screen canvas
	    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

	    // encode image to data-uri with base64 version of compressed image
	    return canvas.toDataURL();
	}

    return function (text, target) {
    	var imgB64 = parseImg(text);
    	var imgObject = new Image();
    	var resp = "";
    	imgObject.src = imgB64;
    	alert(imgB64);
    	if(imgB64 != ""){
    		var imgResize = resizeImg(imgObject,100);
    		var imgReplace = "<img style=\"border: 5px solid dodgerblue;\" id=\"imgB64\" src=\""+imgResize+"\" alt=\"test\">";
       		resp += imgReplace;
       	}
        return resp;
    };
});

