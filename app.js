var pg = require("pg");

var express = require('express');
var app = express();


var conString = "pg://shiv:root@localhost:5432/test";

var client = new pg.Client(conString);

// client.connect(function(err) {
// 	if(err) {
//     return console.error('could not connect to postgres', err);
//   }
//   client.query('SELECT NOW() AS "theTime"', function(err, result) {
//     if(err) {
//       return console.error('error running query', err);
//     }
//     console.log(result.rows[0].theTime);
//     //output: Tue Jan 15 2013 19:12:47 GMT-600 (CST)
//     client.end();
//   });
// });


client.query("CREATE TABLE IF NOT EXISTS emps(firstname varchar(64), lastname varchar(64))");
client.query("INSERT INTO emps(firstname, lastname) values($1, $2)", ['Ronald', 'McDonald']);
client.query("INSERT INTO emps(firstname, lastname) values($1, $2)", ['Mayor', 'McCheese']);


app.get('/', function(req,res){
	res.json({"hello":"Go to test route to obtain query results"});
});

app.get('/test', function(req,res){
		var client = new pg.Client(conString);
		client.connect(function(err){
			if(!err)
			{
				var query = client.query("SELECT firstname, lastname FROM emps ORDER BY lastname, firstname");

				query.on("row", function (row, result) {
				result.addRow(row);
				});
				query.on("end", function (result) {
				console.log(JSON.stringify(result.rows, null, "    "));
				client.end();
				res.end("Cool");
				});
			}
			else
				console.log("client connection error");
		});
});




app.listen(3000, function(){
	console.log("listening on port 3000");
});