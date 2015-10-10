// Copyright 2002-2015, University of Colorado Boulder

/*global module:false*/
module.exports = function( grunt ) {
  'use strict';

  // print this immediately, so it is clear what project grunt is building
  grunt.log.writeln( 'Dot' );

  // --disable-es-cache disables the cache, useful for developing rules
  var cache = !grunt.option( 'disable-eslint-cache' );

  // Project configuration.
  grunt.initConfig( {
    pkg: '<json:package.json>',

    requirejs: {
      // unminified
      development: {
        options: {
          almond: true,
          mainConfigFile: 'js/config.js',
          out: 'build/development/dot.js',
          name: 'config',
          optimize: 'none',
          wrap: {
            startFile: [ 'js/wrap-start.frag', '../assert/js/assert.js' ],
            endFile: [ 'js/wrap-end.frag' ]
          }
        }
      },

      production: {
        options: {
          almond: true,
          mainConfigFile: 'js/config.js',
          out: 'build/production/dot.min.js',
          name: 'config',
          optimize: 'uglify2',
          generateSourceMaps: true,
          preserveLicenseComments: false,
          wrap: {
            startFile: [ 'js/wrap-start.frag', '../assert/js/assert.js' ],
            endFile: [ 'js/wrap-end.frag' ]
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
          }
        }
      }
    },

    eslint: {
      options: {

        // Rules are specified in the .eslintrc file
        configFile: '../chipper/eslint/.eslintrc',

        // Caching only checks changed files or when the list of rules is changed.  Changing the implementation of a
        // custom rule does not invalidate the cache.  Caches are declared in .eslintcache files in the directory where
        // grunt was run from.
        cache: cache,

        // Our custom rules live here
        rulePaths: [ '../chipper/eslint/rules' ]
      },

      files: [
        'Gruntfile.js',
        '../phet-core/js/**/*.js',
        '../axon/js/**/*.js',
        '../assert/js/**/*.js',
        'js/**/*.js'
      ]
    }
  } );

  // default task ('grunt')
  grunt.registerTask( 'default', [ 'lint', 'development', 'production' ] );

  // linter on dot subset only ('grunt lint')
  grunt.registerTask( 'lint', [ 'eslint:files' ] );

  // compilation targets. invoke only one like ('grunt development')
  grunt.registerTask( 'production', [ 'requirejs:production' ] );
  grunt.registerTask( 'development', [ 'requirejs:development' ] );

  // dependencies
  grunt.loadNpmTasks( 'grunt-requirejs' );
  grunt.loadNpmTasks( 'grunt-eslint' );
};
