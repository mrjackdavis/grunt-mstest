/*
 * grunt-mstest
 * https://github.com/mrjackdavis/grunt-mstest
 *
 * Copyright (c) 2014 mrjackdavis
 * Licensed under the MIT license.
 */

'use strict';

var Path = require('path');

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>',
      ],
      options: {
        jshintrc: '.jshintrc',
      },
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp'],
    },

    //Build assembly files to test against
    msbuild: {
          solution: {
              src: ['test/fixtures/MsUnitTest/MsUnitTest.csproj'],
              options: {
                  projectConfiguration: 'Debug',
                  targets: ['Clean', 'Rebuild'],
                  stdout: true,
                  maxCpuCount: 4,
                  buildParameters: {
                      WarningLevel: 2,
                      OutDir: Path.resolve() + "/tmp"
                  },
                  verbosity: 'quiet'
              }
          }
      },

    // Configuration to be run (and then tested).
    mstest: {
      default_options: {
        options: {
        },
        src: ['tmp/*.dll']
      },
      // custom_options: {
      //   options: {
      //     separator: ': ',
      //     punctuation: ' !!!',
      //   },
      //   files: {
      //     'tmp/custom_options': ['test/fixtures/testing', 'test/fixtures/123'],
      //   },
      // },
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js'],
    },

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-msbuild');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.

  process.env.VS100COMNTOOLS = "Durp";
  
  grunt.registerTask('test', ['clean','msbuild', 'mstest', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
