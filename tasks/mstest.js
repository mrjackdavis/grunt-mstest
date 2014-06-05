/*
* grunt-mstest
* https://github.com/mrjackdavis/grunt-mstest
*
* Copyright (c) 2014 mrjackdavis
* Licensed under the MIT license.
*/

'use strict';
var spawn = require('child_process').spawn;
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
            details:["errormessage","errorstacktrace"],
            force:false
        });

        function gruntWarn(str){
            if(options.force)
                grunt.log.writeln(str);
            else
                grunt.fail.warn(str);
        }

        var args = [];

        // Iterate over all specified file groups.
        this.filesSrc.map(function(filePath){
            args.push("/testcontainer:"+filePath);
        });

        for (var i = options.details.length - 1; i >= 0; i--) {
            args.push("/detail:"+options.details[i]);
        };

        args.push("/usestderr");

        var process = spawn(options.mstestPath,args);

        process.stdout.on('data', function(data) { grunt.log.write(data) });

        process.stdout.on('exit', function(data) {
            done();
        });

        // var child = childProcess.exec(escapeShell(options.mstestPath) +containerString ,function (error, stdout, stderr) {
        //     grunt.log.writeln(stdout);

        //     if(!stderr && stderr !== ""){
        //         gruntWarn("stderr:\""+stderr+"\"",3);
        //     }
        //     if (error !== null) {
        //         gruntWarn(error,3);
        //     }

            
        // });
    });


    function getExePath() {
        //Possible env variables for visual studio tools, in reverse order of priority
        var vsToolsArr = [process.env.VS100COMNTOOLS,process.env.VS110COMNTOOLS,process.env.VS120COMNTOOLS]

        //Get highest priority VS tools
        var vsTools = null;
        for (var i = vsToolsArr.length - 1; i >= 0; i--) {
            var item = vsToolsArr[i]
            if(item && item != ""){
                vsTools = item;
                break;
            }
        };

        if(!vsTools)
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


