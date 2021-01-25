var gulp = require("gulp");
var ts = require("gulp-typescript");
var tsProject = ts.createProject("tsconfig.json");
const javascriptObfuscator = require('gulp-javascript-obfuscator');

gulp.task("default", function () {
  return tsProject.src().pipe(tsProject()).js
  .pipe(javascriptObfuscator({
	  compact: true,
	  stringArrayEncoding:['base64'],
	  controlFlowFlatteningThreshold: 1,
	  selfDefending: true,
	  shuffleStringArray: true, 
	  stringArrayWrappersCount: 5,
	  stringArrayWrappersChainedCalls: true,    
	  stringArrayWrappersParametersMaxCount: 5,
	  stringArrayWrappersType: 'function'
  }))
  .pipe(gulp.dest("dist"));
});