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
var versions = {
        1.0: '1.0.3705',
        1.1: '1.1.4322',
        2.0: '2.0.50727',
        3.5: '3.5',
        4.0: '4.0.30319'
    };
module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('mstest', 'The best mstest Grunt plugin ever.', function() {

    var done = this.async();

    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      mstestPath: "\"\\Program Files (x86)\\Microsoft Visual Studio 11.0\\Common7\\IDE\\MSTest.exe\"",
	  processor: '',
	  version: 4.0,
    });

    // Iterate over all specified file groups.
    var containerString = this.filesSrc.map(function(filePath){
      return "/testcontainer:"+filePath;
    }).join(" ");

    var child = exec(getBuildExecutablePath(options.version, options.processor) + " " +containerString ,function (error, stdout, stderr) {
        grunt.log.writeln(stdout);

        if(!stderr && stderr !== ""){
          grunt.fail.warn("stderr:\""+stderr+"\"",3);
        }
        if (error !== null) {
          grunt.fail.warn(error,3);
        }

        done();
    });
  });
  
 
  function getBuildExecutablePath(version, processor) {

        // temp mono xbuild hack for linux / osx - assumes xbuild is in the path, works on my machine (Ubuntu 12.04 with Mono JIT compiler version 3.2.1 (Debian 3.2.1+dfsg-1~pre2))
        if (process.platform === 'linux' || process.platform === 'darwin') {
            return 'xbuild';
        }

        processor = 'Framework' + (processor === 64 ? processor : '');

        version = versions[version];

        if (!version) {
            grunt.fatal('Unrecognised .NET framework version "' + version + '"');
        }

        var buildExecutablePath = path.join(process.env.WINDIR, 'Microsoft.Net', processor, 'v' + version, 'MSBuild.exe');

        if (!fs.existsSync(buildExecutablePath)) {
            grunt.fatal('Unable to find MSBuild executable');
        }

        return buildExecutablePath;

    }

};


