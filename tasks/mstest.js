/*
* grunt-mstest
* https://github.com/mrjackdavis/grunt-mstest
*
* Copyright (c) 2014 mrjackdavis
* Licensed under the MIT license.
*/

'use strict';
var exec = require('child_process').exec;
var path = require('path');
var fs = require('fs');

module.exports = function(grunt) {

// Please see the Grunt documentation for more information regarding task
// creation: http://gruntjs.com/creating-tasks

    grunt.registerMultiTask('mstest', 'The best mstest Grunt plugin ever.', function() {

        var done = this.async();

        // Merge task-specific and/or target-specific options with these defaults.
        var options = this.options({
            mstestPath: getExePath(),
            details:["errormessage","errorstacktrace"]
        });

        // Iterate over all specified file groups.
        var containerString = this.filesSrc.map(function(filePath){
            return "/testcontainer:"+filePath;
        }).join(" ");

        for (var i = options.details.length - 1; i >= 0; i--) {
            containerString += " /detail:"+options.details[i]
        };

        containerString +=" /usestderr";

        var child = exec(escapeShell(options.mstestPath) +containerString ,function (error, stdout, stderr) {
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


    function getExePath() {
        var vsTools = process.env.VS120COMNTOOLS;
        vsTools = vsTools || process.env.VS110COMNTOOLS;
        vsTools = vsTools || process.env.VS100COMNTOOLS;
        
        if(!vsTools || vsTools === "")
            grunt.fatal("Visual studio tools not installed")

        var exePath = path.join(vsTools, "../IDE", 'MSTest.exe');

        if (!fs.existsSync(exePath)) {
            grunt.fatal('Unable to find MSTest executable at '+exePath +" use the option 'mstestPath' to override");
        }

        return exePath;
    }

    function escapeShell(cmd) {
      return '"'+cmd+'"';
    };
};


