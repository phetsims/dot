/*global module:false*/
module.exports = function( grunt ) {
  
  // print this immediately, so it is clear what project grunt is building
  grunt.log.writeln( 'Dot' );
  
  // Project configuration.
  grunt.initConfig( {
    pkg: '<json:package.json>',
    
    requirejs: {
      // unminified, with has.js
      development: {
        options: {
          almond: true,
          mainConfigFile: "js/config.js",
          out: "dist/development/dot.js",
          name: "config",
          optimize: 'none',
          wrap: {
            startFile: [ "js/wrap-start.frag", "contrib/has.js" ],
            endFile: [ "js/wrap-end.frag" ]
          }
        }
      },
      
      // with has.js
      standalone: {
        options: {
          almond: true,
          mainConfigFile: "js/production-config.js",
          out: "dist/standalone/dot.min.js",
          name: "production-config",
          optimize: 'uglify2',
          generateSourceMaps: true,
          preserveLicenseComments: false,
          wrap: {
            startFile: [ "js/wrap-start.frag", "contrib/has.js" ],
            endFile: [ "js/wrap-end.frag" ]
          }
        }
      },
      
      // without has.js
      production: {
        options: {
          almond: true,
          mainConfigFile: "js/production-config.js",
          out: "dist/production/dot.min.js",
          name: "production-config",
          optimize: 'uglify2',
          generateSourceMaps: true,
          preserveLicenseComments: false,
          wrap: {
            startFile: [ "js/wrap-start.frag" ],
            endFile: [ "js/wrap-end.frag" ]
          }
        }
      }
    },
    
    jshint: {
      all: [
        'Gruntfile.js', 'js/**/*.js', 'common/phet-core/js/**/*.js', 'common/assert/js/**/*.js'
      ],
      dot: [
        'js/**/*.js'
      ],
      // adjust with options from http://www.jshint.com/docs/
      options: {
        // enforcing options
        curly: true, // brackets for conditionals
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        // noempty: true,
        nonew: true,
        // quotmark: 'single',
        undef: true,
        // unused: true, // certain layer APIs not used in cases
        strict: true,
        
        expr: true, // so we can use assert && assert( ... )
        
        // relaxing options
        es5: true, // we use ES5 getters and setters for now
        loopfunc: true, // we know how not to shoot ourselves in the foot, and this is useful for _.each
        
        globals: {
          // for require.js
          define: true,
          require: true,
          
          _: false,
          
          Uint16Array: false,
          Uint32Array: false,
          document: false,
          window: false,
          console: false,
          Float32Array: true // we actually polyfill this, so allow it to be set
        }
      },
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
