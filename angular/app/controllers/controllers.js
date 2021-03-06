'use strict';

/* Controllers */

var myappControllers = angular.module('myappControllers', []);

myappControllers.controller('LoginCtrl', ['$scope', '$routeParams', '$location', '$http', '$timeout', '$filter', 'Partage', 'Utils',
 function($scope, $routeParams, $location, $http, $timeout, $filter, Partage, Utils) {
	
    Partage.hideStuff = false;

    $scope.partage = Partage; // Share data between controllers
    $scope.message = "";
    $scope.errors = []; // errors
    $scope.alert = {text:'', type:''}; // alert 

    // INIT
    $scope.init = function(){
        // CLEAN SESSION 
    	$http.get(serverHost + '/logout', {
         withCredentials: true
         }).success(function(data){
            // do something ?
         }); 
    }

    $scope.init();
    
}]);

myappControllers.controller('MenuCtrl', ['$scope', '$routeParams', '$location', '$timeout', '$filter', 'Partage', 'Utils', 'mySocket',
 function($scope, $routeParams, $location, $timeout, $filter, Partage, Utils, mySocket) {
	
    $scope.partage = Partage; // share data between controllers
    $scope.room = "";
   
    // INIT
    $scope.init = function(){
       
    }

    $scope.logout = function () {
        Partage.room = "";
        mySocket.disconnect();
        $location.path('/login');
    }

    $scope.change = function (){
        $location.path('/lobby');
        $('#lobbyInput').focus();
    }

    $scope.init();

}]);

myappControllers.controller('LobbyCtrl', ['$scope', '$routeParams', '$location', '$timeout', '$filter', 'Partage', 'Utils',
 function($scope, $routeParams, $location, $timeout, $filter, Partage, Utils) {
    
    Partage.hideStuff = true;

    $scope.partage = Partage; // share data between controllers
    $scope.room = "";
    $scope.hideStuff = Partage.hideStuff;

    // INIT
    $scope.init = function(){
        $('#lobbyInput').focus();
    }

    $scope.join = function (){
        if($.trim($scope.room) != ""){
            Partage.room = $scope.room;
            $location.path('/chat/'+Partage.room);
        }
        else{
            $scope.room = "";     
        }
    }

    $scope.init();


}]);

myappControllers.controller('ChatCtrl', ['$scope', '$sce', '$routeParams', '$location', '$timeout', '$filter', 'Partage', 'Utils', 'mySocket', 'MessageStorage',
 function($scope, $sce, $routeParams, $location, $timeout, $filter, Partage, Utils, mySocket, MessageStorage) {

    Partage.hideStuff = false;

    $scope.partage = Partage; // share data between controllers
   
    $scope.errors = []; // errors
    $scope.alert = {text:'', type:''}; // alert

    $scope.room = "";
    $scope.hideStuff = Partage.hideStuff;

	$scope.message = ""; // chat message
	$scope.messages = []; // chat messages
    $scope.usersList = [];
    $scope.numUsers = 0;
    $scope.numUsersLabel = "";
    $scope.fullUrl = "";
  
    // INIT
    $scope.init = function(){
        // we need the room name in the route
        if($.trim($routeParams.room) == ""){
            $location.path('/lobby');
        }

        // init room from the route
        Partage.room = $routeParams.room;
        $scope.room = $routeParams.room;

        $scope.fullUrl = $location.absUrl();
        $scope.displayUsersNumber();
        $('#chatInput').focus();

        // NEW USER ENTER
        MessageStorage.setId(Partage.room); // set storage id
        $scope.messages = MessageStorage.get(); // chat messages from localStorage
        mySocket.emit('NEW_USER', {id: $scope.partage.id, provider: $scope.partage.provider, username: $scope.partage.username , room: $scope.partage.room, avatar: $scope.partage.avatar});

		// destroy socket when leaving the chat
		$scope.$on('$destroy', function () {
              Partage.room = "";
			  mySocket.disconnect();
              mySocket.connect();
		});

        mySocket.on('LOGIN', function(data){
            $('#chatInput').focus();
            $scope.numUsers = data.numUsers;
            $scope.displayUsersNumber();
            // scroll bottom if necessary
                if(!Partage.isScrolling){
                    Partage.isScrolling = true;
                    $("html, body").animate(
                    { scrollTop: $(document).height() },
                    1000,
                        function(){
                            Partage.isScrolling = false;
                        }
                    );
                }
            // console.log('LOGIN ' + data.numUsers);
        });

        mySocket.on('NEW_USER', function(data){
            $scope.numUsers = data.numUsers;
            $scope.usersList.push({username: data.username, room: data.room, avatar: data.avatar});
            $scope.displayUsersNumber();
            var mome = new Date().getTime();
            $scope.messages.push({username: 'System', avatar: 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACwAAAAAAQABAAACAkQBADs=', message: '### ' + data.username + ' just joined the room', moment: mome});
			// console.log('NEW USER ' + data.username + ' ' + data.room + ' ' + data.avatar);
        });

        mySocket.on('USER_LEFT', function(data){
            $scope.numUsers = data.numUsers;
            $scope.displayUsersNumber();
            var mome = new Date().getTime();
            $scope.messages.push({username: 'System', avatar: 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACwAAAAAAQABAAACAkQBADs=', message: '### ' + data.username + ' just left the room', moment: mome});
            // console.log('USER LEFT ' + data.username + ' ' + data.room);
        });
		
		mySocket.on('NEW_MESSAGE', function(data){
            // limit to 100 messages (by room) in the localStorage
            if($scope.messages.length == 100){
                 $scope.messages.shift();
            }
            // console.log ('get a new message');
            $scope.messages.push(data);
            // store the messages list in the localStorage (max = 100)
            MessageStorage.put($scope.messages);
			
			// scroll bottom if necessary
			if(!Partage.isScrolling){
				Partage.isScrolling = true;
				$("html, body").animate(
				{ scrollTop: $(document).height() },
				1000,
					function(){
						Partage.isScrolling = false;
					}
				);
			}
			
        });
	
    }

    $scope.displayUsersNumber = function(){
        if($scope.numUsers == 1){
            $scope.numUsersLabel = "lonely user";
        }
        else{
            $scope.numUsersLabel = $scope.numUsers + " users"; 
        }
    }
	
    $scope.init();

}]);

myappControllers.controller('MessageCtrl', ['$scope', '$sce','$routeParams', '$location', '$timeout', '$filter', 'Partage', 'Utils', 'mySocket',
 function($scope, $sce, $routeParams, $location, $timeout, $filter, Partage, Utils, mySocket) {

    $scope.partage = Partage; // Share data between controllers
	$scope.message = ""; // chat message
    $scope.uploadme = "";

    // INIT
    $scope.init = function(){
		$('#chatInput').focus();
    }
	
	$scope.sendMessage = function (){
		if($.trim($scope.message)!= ""){
			// console.log('send message')
            var mome = new Date().getTime();
			mySocket.emit('NEW_MESSAGE', {message : $scope.message, moment: mome});
			
			// scroll bottom if necessary
			if(!Partage.isScrolling){
				Partage.isScrolling = true;
				$("html, body").animate(
				{ scrollTop: $(document).height() },
				1000,
					function(){
						Partage.isScrolling = false;
					}
				);
			}	
		}
		$scope.message = "";
		$('#chatInput').focus();
	}

    $scope.$watch('uploadme', function(newValue, oldValue){
       var resizeImg = function (img, w) {
            var newImg = new Image();
            newImg.src = img;
            var oW = newImg.naturalWidth;
            var oH = newImg.naturalHeight;
            // create an off-screen canvas for resized image
            var canvas = document.createElement('canvas');
            var ctx = canvas.getContext('2d');

            // set its dimension to target size
            canvas.width = w;
            canvas.height = oH*(w/oW);
            
            // draw source image into the off-screen canvas
            ctx.drawImage(newImg, 0, 0, canvas.width, canvas.height);

            // encode image to data-uri with base64 version of compressed image
            return canvas.toDataURL();
        }

        if(newValue != ""){
            var imgResize = resizeImg(newValue, 200);
            var mome = new Date().getTime();
            var imgMessage = "<a href=\""+newValue+"\" target=\"_blank\"><img class=\"chatImg\" src=\""+imgResize+"\" /></a>";
            mySocket.emit('NEW_MESSAGE', {message : imgMessage, moment: mome});
        }
    });
	
    $scope.init();

}]);
