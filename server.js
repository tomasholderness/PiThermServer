// server.js - NodeJS server for the PiThermServer project.

// Parses data from DS18B20 temperature sensor and servers as a JSON object.
// Uses node-static module to server a plot of current temperautre (uses highcharts).
// Tom Holderness 03/01/2013
// Ref: www.cl.cam.ac.uk/freshers/raspberrypi/tutorials/temperature/

// Load node modules
var fs = require('fs');
var sys = require('sys');
var http = require('http');

// Use node-static module to server chart for client-side dynamic graph
var nodestatic = require('/usr/local/lib/node_modules/node-static');

// Setup static server for current directory
var staticServer = new nodestatic.Server(".");

// Setup node http server
var server = http.createServer(
	// Our main server function
	function(request, response)
	{
		// Grab the URL requested by the client
		var url = require('url').parse(request.url);
		var pathfile = url.pathname;

		// Test to see if it's a request for temperature data
		if (pathfile == '/temperature.json')
		{
			// Function to read thermal sensor and return JSON representation of first word (i.e. the data)
			// Note device location is sensor specific.
			fs.readFile('/sys/bus/w1/devices/28-00000400a88a/w1_slave', function(err, buffer)
			{
				if (err)
				{
					response.writeHead(500, { "Content-type": "text/html" });
					response.end(err + "\n");
					console.log('Error serving /temperature.json. ' + err);
					return;
				}
			// Read data from file (using fast node ASCII encoding).
			var data = buffer.toString('ascii').split(" "); // Split by space

            		// Extract temperature from string and divide by 1000 to give celsius
			var temp  = parseFloat(data[data.length-1].split("=")[1])/1000.0;
			
			// Round to one decimal place
			temp = Math.round(temp * 10) / 10
			
			// Add date/time to temperature
			var jsonData = [Date.now(), temp];
			
			// Return JSON data	
			response.writeHead(200, { "Content-type": "application/json" });		
			response.end(JSON.stringify(jsonData), "ascii");
			// Log to console (debugging)
			// console.log('returned JSON data: ' + jsonData);
			
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
			console.log('Request from '+ request.connection.remoteAddress +', for: ' + pathfile);

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
// Enable server
server.listen(8000);
// Log message
console.log('Server running at http://localhost:8000');
