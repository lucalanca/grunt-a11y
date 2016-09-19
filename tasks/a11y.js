/*
 * grunt-a11y
 * https://github.com/lucalanca/grunt-a11y
 *
 * Copyright (c) 2014 Joao Figueiredo
 * Licensed under the MIT license.
 */

'use strict';

var fs          = require('fs');
var path        = require('path');
var a11y        = require('a11y');
var chalk       = require('chalk');
var indent      = require('indent-string');
var logSymbols  = require('log-symbols');
var Q           = require('q');
var globby      = require('globby');
var protocolify = require('protocolify');

var fail  = chalk.bold.red;
var log   = chalk.blue;
var pass  = chalk.green;

module.exports = function(grunt) {

  /**
   * A promise-based wrapper on a11y.
   * @param  {String}  url
   * @param  {String}  viewportSize
   * @return {Promise}
   */
  function a11yPromise (url, viewportSize) {
    var startTimestamp = Date.now();
    var deferred = Q.defer();
    a11y(url, {viewportSize: viewportSize}, function (err, reports) {
      if (err) {
        deferred.reject(new Error(err));
      } else {
        deferred.resolve({url: url, reports: reports, start: startTimestamp, end: Date.now()});
      }
    });
    return deferred.promise;
  }

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

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('a11y', 'Grunt wrapper for a11y', function() {
    var done = this.async();
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      urls: [],
      failOnError: false,
      junitDirectory: null,
      viewportSize: '1024x768'
    });

    var urls = globby.sync(options.urls, {
      nonull: true
    }).map(protocolify);
    var a11yPromises = urls.map(function (url) {
      return a11yPromise(url, options.viewportSize);
    });

    a11yPromises.forEach(function (f) {
      f.then(function (audit) {
        var valid = logReports(audit.url, audit.reports);
        generateJUnitReport(options.junitDirectory, audit);
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
   * Utility function that writes a JUnit report if directory is specified
   * @param {String} directory - directory in which to store the JUnit reports
   * @param {Object} auditParam - audit
   */
  function generateJUnitReport(directory, auditParam) {
    if (directory) {
      var mkdirp = require('mkdirp');
      var a11yJunitReporter = require('a11y-junit-reporter');

      var url = auditParam.url;
      var audit = auditParam.reports.audit;
      var start = auditParam.start;
      var end = auditParam.end;

      var duration = end - start;
      var junitReport = a11yJunitReporter.generateJUnitReport(url, audit, end, duration);

      var fileName = a11yJunitReporter
              .toRelativePath(url)
              .replace(new RegExp('[/\\:]', 'g'), '_') + '.xml';
      var file = path.join(directory, fileName);
      grunt.log.writeln('Writing JUnit report to %s', file);
      mkdirp.sync(path.dirname(file));
      fs.writeFile(file, junitReport);
    }
  }

};
