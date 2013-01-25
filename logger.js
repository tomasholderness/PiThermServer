// logger.js - Functions to log sensor readings to SQLite database

// Setup database connection for logging
var db = new sqlite3.Database('./piTemps.db');

function logger(database){
   // Write a single temperature record in JSON format to database table.
   this.write = function(data){
      // data is a javascript object   
      var statement = db.prepare("INSERT INTO temperature_records VALUES (?, ?)");
      // Insert values into prepared statement
      statement.run(data.temperature_record[0].unix_time, data.temperature_record[0].celsius);
      // Execute the statement
      statement.finalize();
}
   // Get temperature records from database
   this.query = function(num_records, start_date, callback){
      // - Num records is an SQL filter from latest record back trough time series, 
      // - start_date is the first date in the time-series required, 
      // - callback is the output function
      var current_temp = db.all("SELECT * FROM (SELECT * FROM temperature_records WHERE unix_time > (strftime('%s',?)*1000) ORDER BY unix_time DESC LIMIT ?) ORDER BY unix_time;", start_date, num_records,
         function(err, rows){
            if (err){
			      response.writeHead(500, { "Content-type": "text/html" });
			      response.end(err + "\n");
			      console.log('Error serving querying database. ' + err);
			      return;
				         }
            data = {temperature_record:[rows]}
            callback(data);
      });
   };
};
// Export the logging function.
exports.logger = logger;
