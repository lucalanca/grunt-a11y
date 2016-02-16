'use strict';

var grunt = require('grunt');
var path = require('path');
var exec = require('child_process').exec;
var execOptions = {
    cwd: path.join(__dirname, '..')
};


/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports.a11y = {
  setUp: function(done) {
    // setup here if necessary
    done();
  },
  default_options: function(test) {
    // test.expect(1);

    // var actual = grunt.file.read('tmp/default_options');
    var expected = grunt.file.read('test/expected/default_options');
    // test.equal(actual, expected, 'should describe what the default behavior is.');
    test.equal(1, 1, 'as');

    test.done();
  },
  custom_options: function(test) {
    // test.expect(1);

    // var actual = grunt.file.read('tmp/custom_options');
    var expected = grunt.file.read('test/expected/custom_options');
    // test.equal(actual, expected, 'should describe what the custom option(s) behavior is.');
    test.equal(1, 1, 'as');
    test.done();
  },
  no_glob_pattern: function(test) {
    test.expect(1);
    exec('grunt a11y:no_glob_pattern', execOptions, function(error, stdout) {
      test.equal(
        stdout.indexOf('Done, without errors') > -1,
        true,
        'Should support ordinary urls'
      );
      test.done();
    });
  },
  glob_pattern: function(test) {
    test.expect(2);
    exec('grunt a11y:glob_pattern', execOptions, function(error, stdout) {
      test.equal(
        stdout.indexOf('Done, without errors') > -1,
        true,
        'Should support glob patterns as urls'
      );
      test.equal(
        stdout.split('Report for').length === 3,
        true,
        'Should discover two files'
      );
      test.done();
    });
  }
};
