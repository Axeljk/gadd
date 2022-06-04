const gulp = require("gulp");
const browsersync = require("browser-sync").create();

function dev(done) {
	browsersync.init({
		server: {
			baseDir: "./",
			index: "gadd.html",
		},
		browser: "chrome",
		open: true
	});
	done();
}

exports.dev = dev;