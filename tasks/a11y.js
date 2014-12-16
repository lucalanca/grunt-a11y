/*
 * grunt-a11y
 * https://github.com/lucalanca/grunt-a11y
 *
 * Copyright (c) 2014 Joao Figueiredo
 * Licensed under the MIT license.
 */

'use strict';

var a11y       = require('a11y');
var chalk      = require('chalk');
var _          = require('lodash');
var indent     = require('indent-string');
var logSymbols = require('log-symbols');


var fail  = chalk.bold.red;
var log   = chalk.blue;
var pass  = chalk.green;

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('a11y', 'Grunt wrapper for a11y', function() {
    var done = this.async();
    grunt.log.writeln("a11y running");
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      urls: []
    });
    options.urls.forEach(function (url, index) {
      a11y(url, function (err, reports) {

        var passes = '';
        var failures = '';

        grunt.log.writeln(chalk.underline(chalk.cyan('\nReport for ' + url + '\n')));
        reports.audit.forEach(function (el) {
            if (el.result === 'PASS') {
                passes += logSymbols.success + ' ' + el.heading + '\n';
            }

            if (el.result === 'FAIL') {
                failures += logSymbols.error + ' ' + el.heading + '\n';
                failures += el.elements + '\n\n';
            }
        });

        console.log(indent(failures, ' ', 2));
        console.log(indent(passes, ' ', 2));

        if (index === options.urls.length - 1){
          done();
        }
      });
    });
  });

};
