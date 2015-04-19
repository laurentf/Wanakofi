'use strict';

var myappDirectives = angular.module('myappDirectives', []);
/* Directives */
myappDirectives.directive('viewAnimations', ['$route',
function($route) {
	  return {
		    restrict: 'A',
		    link: function (scope, element) {
		      var animations = $route.current.animations;
		      if (!animations) return;
		      
		      if (animations.enter) element.addClass(animations.enter);
		      if (animations.leave) element.addClass(animations.leave);
		    }
		  };
}]);


myappDirectives.directive('confirmButton', ['$document','$parse',
    function($document, $parse) {
    return {
        restrict: 'A',
        scope: {
            confirmAction: '&confirmButton',
            placementCallback: '&'
        },
        link: function (scope, element, attrs) {
            var buttonId = Math.floor(Math.random() * 10000000000),
                message = attrs.message || "Are you sure ?",
                yep = attrs.yes || "Yes",
                nope = attrs.no || "No",
                title = attrs.title || "Confirm",
                classes = attrs.classes || "",
                placement = attrs.placement || "right";

            attrs.buttonId = buttonId;

            var html = "<div id=\"button-" + buttonId + "\" class=\"" + classes + "\">" +
                            "<p class=\"confirmbutton-msg\">" + message + "</p>" +
                            "<button class=\"confirmbutton-yes btn btn-success\"><span class=\"glyphicon glyphicon-ok-circle\"></span> " + yep + "</button>" +
                            "<button class=\"confirmbutton-no btn btn-danger\"><span class=\"glyphicon glyphicon-remove-circle\"></span> " + nope + "</button>" +
                        "</div>";

            element.popover({
                content: html,
                html: true,
                trigger: "manual",
                title: title,
                placement: (angular.isDefined(attrs.placementCallback) ? scope.placementCallback() : placement)
            });

            element.bind('click', function(e) {
                var dontBubble = true;
                e.stopPropagation();

                element.popover('show');

                var pop = $("#button-" + buttonId);

                pop.closest(".popover").click(function(e) {
                    if (dontBubble) {
                        e.stopPropagation();
                    }
                });

                pop.find('.confirmbutton-yes').click(function(e) {
                    dontBubble = false;
                    scope.$apply(scope.confirmAction);
                });

                pop.find('.confirmbutton-no').click(function(e) {
                    dontBubble = false;
                    $document.off('click.confirmbutton.' + buttonId);
                    element.popover('hide');
                });

                $document.on('click.confirmbutton.' + buttonId, ":not(.popover, .popover *)", function() {
                    $document.off('click.confirmbutton.' + buttonId);
                    element.popover('hide');
                });
            });
        }
    };
}]);
