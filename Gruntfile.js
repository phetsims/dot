var escodegen = require( 'escodegen' );
var esprima = require( 'esprima' );

var chipperRewrite = require( '../chipper/ast/chipperRewrite.js' );

/*global module:false*/
module.exports = function( grunt ) {
  'use strict';

  // print this immediately, so it is clear what project grunt is building
  grunt.log.writeln( 'Dot' );

  var onBuildRead = function( name, path, contents ) {
    return chipperRewrite.chipperRewrite( contents, esprima, escodegen );
  };

  // Project configuration.
  grunt.initConfig( {
    pkg: '<json:package.json>',

    requirejs: {
      // unminified
      development: {
        options: {
          almond: true,
          mainConfigFile: "js/config.js",
          out: "build/development/dot.js",
          name: "config",
          optimize: 'none',
          wrap: {
            startFile: [ "js/wrap-start.frag", "../assert/js/assert.js" ],
            endFile: [ "js/wrap-end.frag" ]
          }
        }
      },

      production: {
        options: {
          almond: true,
          mainConfigFile: "js/config.js",
          out: "build/production/dot.min.js",
          name: "config",
          optimize: 'uglify2',
          generateSourceMaps: true,
          preserveLicenseComments: false,
          wrap: {
            startFile: [ "js/wrap-start.frag", "../assert/js/assert.js" ],
            endFile: [ "js/wrap-end.frag" ]
          },
          uglify2: {
            compress: {
              global_defs: {
                assert: false,
                assertSlow: false,
                phetAllocation: false
              },
              dead_code: true
            }
          },
          onBuildRead: onBuildRead
        }
      }
    },

    jshint: {
      all: [
        'Gruntfile.js', 'js/**/*.js', '../phet-core/js/**/*.js', '../assert/js/**/*.js'
      ],
      dot: [
        'js/**/*.js'
      ],
      // reference external JSHint options in jshintOptions.js
      options: require( '../chipper/grunt/jshintOptions' )
    }
  } );

  // default task ('grunt')
  grunt.registerTask( 'default', [ 'jshint', 'development', 'production' ] );

  // linter on dot subset only ('grunt lint')
  grunt.registerTask( 'lint', [ 'jshint:dot' ] );

  // compilation targets. invoke only one like ('grunt development')
  grunt.registerTask( 'production', [ 'requirejs:production' ] );
  grunt.registerTask( 'development', [ 'requirejs:development' ] );

  // dependencies
  grunt.loadNpmTasks( 'grunt-requirejs' );
  grunt.loadNpmTasks( 'grunt-contrib-jshint' );
};
