var sys = require('util');
var fs = require('fs');
var exec = require('child_process').exec;
var requirejs = require('requirejs');

var config = {
	baseUrl: "src/",
	name: "goom-math",
	out: "dist/goom-math.min.js",
};

desc("This is the default task.");
task("default", function(params) {
	//Do something.
});

desc("Runs all the tests.");
task("test", function(params){
	exec("jasmine-node spec/", function (error, stdout, stderr) {
		sys.print(stdout);
	});
});

desc("Builds the project into a minified file.");
task("build", function(params){
	console.log("Building the project into a minified file...")
	exec("browserify src/goom-math.js  -o dist/goom-math.js", function (error, stdout, stderr) {
		sys.print(stdout);
		console.log("The file is ready at dist/goom-math.js");
	});
});
