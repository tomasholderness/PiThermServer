// server.js - NodeJS server for the PiThermServer project.

/* 

Parses data from DS18B20 temperature sensor and serves as a JSON object.
Uses node-static module to serve a plot of current temperature (uses highcharts).

Tom Holderness 03/01/2013
Ref: www.cl.cam.ac.uk/freshers/raspberrypi/tutorials/temperature/
*/

// Load node modules
var fs = require('fs');
var sys = require('sys');
var http = require('http');
var sqlite3 = require('sqlite3');
var sensors = require('./sensors');

// Use node-static module to server chart for client-side dynamic graph
var nodestatic = require('node-static');

// Setup static server for current directory
var staticServer = new nodestatic.Server(".");

// Create a new instance of a temperature sensor
var thermo = new sensors.temperature('28-00000400a88a');

// Setup node http server
var server = http.createServer(
	// Our main server function
	function(request, response)
	{
		// Grab the URL requested by the client and parse any query options
		var url = require('url').parse(request.url, true);
		var pathfile = url.pathname;
      var query = url.query;

		// Test to see if it's a database query
		if (pathfile == '/temperature_query.json'){
         // Test to see if number of observations was specified as url query
         if (query.num_obs){
            var num_obs = parseInt(query.num_obs);
         }
         else{
         // If not specified default to 20. Note use -1 in query string to get all.
            var num_obs = -1;
         }
         if (query.start_date){
            var start_date = query.start_date;
         }
         else{
            var start_date = '1970-01-01T00:00';
         }   
         // Send a message to console log
         console.log('Database query request from '+ request.connection.remoteAddress +' for ' + num_obs + ' records from ' + start_date+'.');
         // call selectTemp function to get data from database
         selectTemp(num_obs, start_date, function(data){
            response.writeHead(200, { "Content-type": "application/json" });		
	         response.end(JSON.stringify(data), "ascii");
         });
      return;
      }
      
      // Test to see if it's a request for current temperature   
      if (pathfile == '/temperature_now.json'){
            thermo.read(function(data){
			      response.writeHead(200, { "Content-type": "application/json" });		
			      response.end(JSON.stringify(data), "ascii");
               });
      return;
      }
      
      // Handler for favicon.ico requests
		if (pathfile == '/favicon.ico'){
			response.writeHead(200, {'Content-Type': 'image/x-icon'});
			response.end();

			// Optionally log favicon requests.
			//console.log('favicon requested');
			return;
		}


		else {
			// Print requested file to terminal
			console.log('Request from '+ request.connection.remoteAddress +' for: ' + pathfile);

			// Serve file using node-static			
			staticServer.serve(request, response, function (err, result) {
					if (err){
						// Log the error
						sys.error("Error serving " + request.url + " - " + err.message);
						
						// Respond to the client
						response.writeHead(err.status, err.headers);
						response.end('Error 404 - file not found');
						return;
						}
					return;	
					})
		}
});

// Start temperature logging (every 5 min).
//var msecs = (60 * 5) * 1000; // log interval duration in milliseconds
//logTemp(msecs);
// Send a message to console
//console.log('Server is logging to database at '+msecs+'ms intervals');
// Enable server
server.listen(8080);
// Log message
console.log('Server running at http://localhost:8000');
