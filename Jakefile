var sys = require('util')
var exec = require('child_process').exec;

desc("This is the default task.");
task("default", function(params) {
	//Do something.
});

desc("Runs all the tests.");
task("test", function(params){
	var child = exec("jasmine-node spec/", function (error, stdout, stderr) {
		sys.print(stdout);

		if (error !== null) {
			console.log('[EXEC ERROR] ' + error);
		}
	});
});