/*
 * grunt-mstest
 * https://github.com/mrjackdavis/grunt-mstest
 *
 * Copyright (c) 2014 mrjackdavis
 * Licensed under the MIT license.
 */

'use strict';
var exec = require('child_process').exec;
var Path = require('path');

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('mstest', 'The best mstest Grunt plugin ever.', function() {

    var done = this.async();

    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      mstestPath: "\"\\Program Files (x86)\\Microsoft Visual Studio 11.0\\Common7\\IDE\\MSTest.exe\"",
    });

    // Iterate over all specified file groups.
    var fileAmount = this.filesSrc.length;
    var i = 0;
    this.filesSrc.forEach(function(filepath) {
      // Concat specified files.
        var thePath = filepath;
        grunt.log.writeln(options.mstestPath + " /testcontainer:"+thePath);

        var child = exec(options.mstestPath + "/testcontainer:"+thePath ,function (error, stdout, stderr) {
            grunt.log.writeln(stdout);

            if(!stderr && stderr !== ""){
              grunt.fail.warn("stderr:\""+stderr+"\"",3);
            }
            if (error !== null) {
              grunt.fail.warn(error,3);
            }


            i++;
            if(i === fileAmount){
              done();
            }
        });

    });
  });

};
