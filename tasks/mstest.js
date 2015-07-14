/*
* grunt-mstest
* https://github.com/mrjackdavis/grunt-mstest
*
* Copyright (c) 2014-2015 mrjackdavis mscheepers
* Licensed under the MIT license.
*/

/*jslint white:true vars:true plusplus:true*/
/*global module, require, process*/
module.exports = function(grunt) {
    'use strict';

    // extend string prototype and add method to quote strings
    // yes, I am a lazy typer
    if (!String.prototype.quotes) {
        String.prototype.quotes = function() {
            return '"' + this + '"';
        };
    }

    // documentation https://nodejs.org/api/fs.html#fs_fs_existssync_path
    // tells us this method will be deprecated, thus if that method is not
    // available we implement it by the use of statSync encapsulated
    // with try catch to determine whether a path exists.
    var fs = require('fs');

    if (!fs.existsSync) {
        grunt.log.debug('adding method fs.existsSync');
        fs.existsSync = function(path) {
            var result = true;
            try {
                this.statSync(path);
            } catch (err) {
                grunt.log.debug(err);
                result = false;
            }
            return result;
        };
    }

    // switched to span to gain performance due to streaming support
    var spawn = require('child_process').spawn,
        path = require('path');
        
    // will search for an appropriate mstest.exe if no executable was specified
    function findExecutable() {
        // environment variables for visual studio tools paths
        var paths = [process.env.VS100COMNTOOLS, process.env.VS110COMNTOOLS, process.env.VS120COMNTOOLS],
            executable = null,
            notools = true,
            p = null,
            i = 0;

        // check each path and try to find the MSText.exe
        for(i = 0; i < paths.length; i++) {
            p = paths[i];
            if (p && p !== "") {
                if (notools) {
                    notools = false;
                }
                var temp = path.join(p, '../IDE', 'MSTest.exe');
                if (fs.existsSync(temp)) {
                    if (!executable) {
                        grunt.log.debug("using MSTest.exe at " + path.join(p, '../IDE'));
                    }
                    else {
                        grunt.log.debug("switching to more recent version at " + path.join(p, '../IDE'));
                    }
                    executable = temp;
                }
            }
        }

        if(notools) {
            grunt.fatal("Neither Visual Studio Tools where found (checked VS100, VS110, VS120).");
        }

        if (!executable) {
            grunt.fatal("Unable to find MSTest.exe. Use the 'executable' option to override");
        }

        return executable;
    }

    // returns the specified path to the mstest command. if none was
    // specified findExecutable() looks for it
    function composeCommand(options) {
        // compose the command
        var result = options.executable || options.mstestPath;
        if (!result) {
            result = findExecutable();
        }
        return result;
    }

    // composes an argument array populated with the MsTest.exe arguments
    // according to the specified options
    function composeArguments(files, options) {
        // compose the arguments
        var result = [],
            i = 0;

        // add a test container for each source
        files.map(function(filepath) {
            result.push('/testcontainer:' + filepath.quotes());
        });

        // add category if specified
        if (options.category && options.category !== "") {
            result.push('/category:' + options.category.quotes());
        }

        // add test settings if specified
        if (options.settings && options.settings !== "") {
            result.push('/testsettings:' + options.settings.quotes());
        }

        // add result file if specified
        if (options.results && options.results !== "") {
            result.push('/resultsfile:' + options.results.quotes());
        }

        // add details if specified
        // NOTE: don't quote the property ids otherwise mstest can't find them
        for(i = 0; i < options.details.length; i++) {
            result.push('/detail:' + options.details[i]);
        }

        // add nologo if specified
        if (options.nologo) {
            result.push('/nologo');
        }
        
        // add usestderr if specified
        if (options.usestderr) {
            result.push('/usestderr');
        }
        
        return result;
    }

    // Please see the Grunt documentation for more information regarding task
    // creation: http://gruntjs.com/creating-tasks
    grunt.registerMultiTask('mstest', 'Executes Visual Studio test projects', function() {

        // initialize default options and start asynchronously
        var options = this.options({
            category: null,
            settings: null,
            results: null,
            details: ["errormessage", "errorstacktrace"],
            usestderr: true,
            nologo: true,
            executable: null,
            mstestPath: null,       // deprecated (renamed to executable)
            force: false
        }),
            cmd = null,
            args = null,
            done = this.async();

        grunt.log.debug('options: ' + JSON.stringify(options, null, 4));
        
        if (this.filesSrc.length === 0) {
            grunt.fatal('At least one test container must be specified');
            done(false);
        }
        
        cmd = composeCommand(options);
        args = composeArguments(this.filesSrc, options);
        
        grunt.log.debug('command: ' + cmd);
        grunt.log.debug('arguments: ' + args);
        
        var cp = spawn(cmd, args, {stdio: 'inherit'});
        
        // handle general error (e.g. ENOENT)
        cp.on('error', function(err) {
            grunt.fatal(err);
            done(false);
        });
        
        // handle child process exit result and force option
        cp.on('exit', function(code, signal) {
            grunt.log.debug('close received - code: ' + code + ' signal: ' + signal);
            if (code !== 0) {
                // recognize configuration options: { force:true } _and_ grunt command line -f --force
                if (options.force || grunt.option('force')) {
                    grunt.log.warn("Even though tests failed execution is continued");
                }
                else {
                    grunt.warn("Test run failed");
                    done(false);
                }
            } 
            done();
        });
    });
};
