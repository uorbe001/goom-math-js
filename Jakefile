var sys = require('util');
var fs = require('fs');
var exec = require('child_process').exec;
var requirejs = require('requirejs');

var config = {
	appDir: "src/",
	baseUrl: ".",
	dir: "dist/",
	findNestedDependencies: true,
	modules: [
		{
			name: "goom-math"
		}
	]
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
	requirejs.optimize(config, function (buildResponse) {
		fs.unlink('dist/build.txt');
		fs.unlink('dist/quaternion.js');
		fs.unlink('dist/vector3d.js');
		fs.unlink('dist/matrix3d.js');
		fs.unlink('dist/matrix4d.js');
		fs.rename('dist/goom-math.js', 'dist/goom-math.min.js');
		console.log("The file is ready at dist/goom-math.min.js");
	});
});
