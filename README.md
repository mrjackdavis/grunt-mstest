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

###Example

```javascript
mstest: {
  myTest: {
    src: ['tmp/*.dll'] // Points to test dll
  },
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
