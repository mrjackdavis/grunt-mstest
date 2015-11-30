# grunt-mstest

> The best mstest Grunt plugin ever.

## Getting Started
This plugin requires Grunt `~0.4.2`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-mstest --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-mstest');
```

## The "mstest" task

Run this task with the `grunt mstest` command.

Task files and options may be specified according to the grunt [Configuring tasks](http://gruntjs.com/configuring-tasks) guide.

### Options
##### category
Type: `String`

Specify and filter which test categories to run (mstest /category).

##### settings
Type: `String`

Use the specified test settings file (mstest /testsettings).

##### results
Type: `String`

Save the test run results to the specified file (mstest /resultsfile).

##### details
Type: `Array` (defaults to `["errormessage", "errorstacktrace"]`)

Specify the name of a property that you want to show values for, if any, in addition to the test outcome (mstest /detail).

##### usestderr
Type: `Boolean` (defaults to `true`)

Use standard error to output error information (mstest /usestderr).

##### nologo
Type: `Boolean` (defaults to `true`)

Display no startup banner and copyright message (mstest /nologo).


##### executable
Type: `String`

The path to the mstest executable. If omitted this task tries to find the executable for VS100, VS110 and VS120. If no executable could be found this task will fail.

##### mstestPath
Type: `String` (deprecated: replaced by `executable`)

The path to the mstest executable.

###Example

Usage with just a test library

```javascript
mstest: {
  myTest: {
    src: ['tmp/*.dll'] // Points to test dll
  },
}
```

Usage with unit and integration tests identified by categories
```javascript
mstest: {
    unittests: {
        src: ['tmp/*.dll],          // points to test dll
        options: {
            category: 'Unit Tests'  // executes only tests decorated with the TestCategory("Unit Tests") attribute.
        }
    },
    integrationtests: {
        src: ['tmp/*.dll'],
        options: {
            force: true,                    // integration tests may fail without failing the build
            category: 'Integration Tests'   // executes only tests decorated with the TestCategory("Integration Tests") attribute.
        }
    }
}
```


### Forcing tests
You can add force:true to the options to prevent test failures resulting in a build failure, useful for CI workflow.


## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
- 0.1.6 Add support for additional mstest command line arguments
- 0.1.5 Stream mstest results, providing faster feedback
- 0.1.4 Add force feature
- 0.1.3 Change priority of vstools to newest first
- 0.1.2 Fix issue where vstools 10 or 12 was not detected
- 0.1.0 Initial release
