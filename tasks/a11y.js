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
var indent     = require('indent-string');
var logSymbols = require('log-symbols');
var Q          = require('q');


var fail  = chalk.bold.red;
var log   = chalk.blue;
var pass  = chalk.green;

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('a11y', 'Grunt wrapper for a11y', function() {
    var done = this.async();
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      urls: [],
      failOnError: false
    });

    var a11yPromises = options.urls.map(function (url) {
      return a11yPromise(url);
    });

    a11yPromises.forEach(function (f) {
      f.then(function (audit) {
        var valid = logReports(audit.url, audit.reports);
        if (!valid) {
          if (options.failOnError) {
            grunt.fail.fatal('FATAL: Audit failed for ' + audit.url);
          } else {
            grunt.log.error('WARN: Audit failed for ' + audit.url);
          }
        }
      }).catch(function (error) {
        if (options.failOnError) {
          grunt.fail.fatal(error);
        } else {
          grunt.log.error(error);
        }
      });
    });

    Q.all(a11yPromises).then(done);
  });

  /**
   * Utility function that logs an audit in the console and
   * returns a boolean with the validity of the audit.
   *
   * @param  {String}       url
   * @param  {a11y reports} reports
   * @return {Boolean}      if the audit is valid
   */
  function logReports (url, reports) {
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

    grunt.log.writeln(indent(failures, ' ', 2));
    grunt.log.writeln(indent(passes  , ' ', 2));

    return !failures.length;
  }

  /**
   * A promise-based wrapper on a11y.
   * @param  {String}  url
   * @return {Promise}
   */
  function a11yPromise (url) {
    var deferred = Q.defer();
    a11y(url, function (err, reports) {
      if (err) {
        deferred.reject(new Error(err));
      } else {
        deferred.resolve({url: url, reports: reports});
      }
    });
    return deferred.promise;
  }

};
