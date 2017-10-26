# grunt-a11y  [![Build Status](https://travis-ci.org/lucalanca/grunt-a11y.svg?branch=master)](https://travis-ci.org/lucalanca/grunt-a11y) [![devDependency Status](https://david-dm.org/lucalanca/grunt-a11y/dev-status.svg)](https://david-dm.org/lucalanca/grunt-a11y#info=devDependencies)  [![Dependency Status](https://david-dm.org/lucalanca/grunt-a11y.svg)](https://david-dm.org/lucalanca/grunt-a11y)

> Grunt wrapper for [a11y](https://github.com/addyosmani/a11y), automate your accessibility audits

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-a11y --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-a11y');
```

## The "a11y" task

### Overview
In your project's Gruntfile, add a section named `a11y` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  a11y: {
    dev: {
      options: {
        urls: ['www.twitter.com', 'www.google.com', 'dist/**/*.html']
      }
    }
  }
});
```

### Options

#### options.urls
Type: `Array`
Default value: `[]`

An Array of strings representing the url's to process. Supports globbing.

#### options.failOnError
Type: `Boolean`
Default value: `false`

If set to true, the grunt task fails when there is an accessibility error in one of the audits.

#### options.viewportSize
Type: `String`
Default value: `1024x768`

Sets the viewport size

#### options.vebose
Type: `Boolean`
Default value: `false`

Sets the viewport size


## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).


### Contributors
- [lucalanca](https://github.com/lucalanca)
- [jrcryer](https://github.com/jrcryer)

## Release History

0.1.5 Adds `verbose` flag. [#19](https://github.com/lucalanca/grunt-a11y/pull/19) Thanks to [@srescio](https://github.com/srescio).

0.1.4 Makes `protocolify` and `globby` part of dependencies. [#13](https://github.com/lucalanca/grunt-a11y/pull/13)) Thanks to [@shortdiv](https://github.com/shortdiv)

0.1.3 Added globbing possibility to `urls`option (See [#12](https://github.com/lucalanca/grunt-a11y/issues/12)) Thanks to [@peterhaldbaek](https://github.com/peterhaldbaek)

0.1.2 Added `viewportSize` option (See [#10](https://github.com/lucalanca/grunt-a11y/issues/10))

0.1.1 Added `failOnError` option (See [#2](https://github.com/lucalanca/grunt-a11y/issues/2))

0.1.0 First release just wrapping a11y
