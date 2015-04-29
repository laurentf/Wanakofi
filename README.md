# Wanakofi client
A simple AngularJS/Bootstrap3 front-end application to connect to the Wanakofi server (see the other repository). 

This project intends to show the "power" of NodeJS/Socket.io as an API with a responsive and modern front-end UI. Note: the front and the back are not on the same servers, it shows the implementation of a very simple CORS (http://en.wikipedia.org/wiki/Cross-origin_resource_sharing).

## Features

* Responsive UI (works fine on every support)
* Full AngularJS 1.3.8 application (with, i hope so, best practices)
* A login page with a social network authentication (Facebook, Twitter and Google+)
* A lobby page in order to choose a tag (this is more a Twitter hashtag) to join the corresponding room
* A chat page, people are grouped by tag/hashtag in order to share and talk
* Socket.io client with on/emit events (realtime)
* A button let you join to another tag if needed
* Bold and Italic text with markdown syntax
* "In chat" HTML5 Image Sharing, 2MB max, no upload. This feature is using the HTML5 FileReader to read the file on the client and send base64 encoded data through the WebSockets (the image is first resized (100px fixed width image in chat poiting on a 480px fixed width image, only work on Firefox and Chrome since IE is blocking any data that is bigger than 32KB)
* Logout

## Dependencies

* JQuery 2.1.3
* AngularJS 1.3.8
* Bootstrap 3.3.4 - Bootswatch theme => https://bootswatch.com/paper/
* Angular core modules : resource, cookie, animate, route, sanitize...
* Socket.io client for Angular - 
* Bootstrap UI for Angular - https://angular-ui.github.io/bootstrap/
* Utils UI for Angular - http://angular-ui.github.io/ui-utils/
* Peity - http://benpickles.github.io/peity/ and Angular Peity directive - https://github.com/projectweekend/angular-peity
* Socket.io client Angular directive - https://github.com/btford/angular-socket-io
* Angular loading bar - http://chieffancypants.github.io/angular-loading-bar/

## Note 
There is no bower/grunt jobs but it could be done quite easily. For instance, in the index.html page you can see a global js variable named "v" which is used to force the reload of some static resources (yea it's ugly), you'll like to change that into a nice minification job. Same thing for vendors, you'll like to create a nice bower file to automatically get JQuery, Angular, Bootstrap and so on. Using CDNs (with fallbacks) are good practices too.

## DEMO 

http://vast-headland-2092.herokuapp.com
