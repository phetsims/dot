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
      // unminified, with has.js
      development: {
        options: {
          almond: true,
          mainConfigFile: "js/config.js",
          out: "build/development/dot.js",
          name: "config",
          optimize: 'none',
          wrap: {
            startFile: [ "js/wrap-start.frag", "../sherpa/has.js" ],
            endFile: [ "js/wrap-end.frag" ]
          }
        }
      },
      
      // with has.js
      standalone: {
        options: {
          almond: true,
          mainConfigFile: "js/production-config.js",
          out: "build/standalone/dot.min.js",
          name: "production-config",
          optimize: 'uglify2',
          generateSourceMaps: true,
          preserveLicenseComments: false,
          wrap: {
            startFile: [ "js/wrap-start.frag", "../sherpa/has.js" ],
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
      },
      
      // without has.js
      production: {
        options: {
          almond: true,
          mainConfigFile: "js/production-config.js",
          out: "build/production/dot.min.js",
          name: "production-config",
          optimize: 'uglify2',
          generateSourceMaps: true,
          preserveLicenseComments: false,
          wrap: {
            startFile: [ "js/wrap-start.frag" ],
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
      // reference external JSHint options in jshint-options.js
      options: require( '../chipper/grunt/jshint-options' )
    }
  } );
  
  // default task ('grunt')
  grunt.registerTask( 'default', [ 'jshint', 'development', 'standalone', 'production' ] );
  
  // linter on dot subset only ('grunt lint')
  grunt.registerTask( 'lint', [ 'jshint:dot' ] );
  
  // compilation targets. invoke only one like ('grunt development')
  grunt.registerTask( 'production', [ 'requirejs:production' ] );
  grunt.registerTask( 'standalone', [ 'requirejs:standalone' ] );
  grunt.registerTask( 'development', [ 'requirejs:development' ] );
  
  // dependencies
  grunt.loadNpmTasks( 'grunt-requirejs' );
  grunt.loadNpmTasks( 'grunt-contrib-jshint' );
};
