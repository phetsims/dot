/*global module:false*/
module.exports = function( grunt ) {
  
  // print this immediately, so it is clear what project grunt is building
  grunt.log.writeln( 'Dot' );
  
  // Project configuration.
  grunt.initConfig( {
    pkg: '<json:package.json>',
    
    lint: {
      files: [
       // 'grunt.js',
       // 'app-easel/*.js'
      ]
    },
    
    concat: {
      standalone: {
        src: [ "contrib/almond/almond.js", "contrib/has/has.js", "dist/standalone/dot.min.js" ],
        dest: "dist/standalone/dot.min.js"
      }
    },
    
    uglify: {
      standalone: {
        src: [ 'dist/standalone/dot.min.js' ],
        dest: 'dist/standalone/dot.min.js'
      }
    },
    
    requirejs: {
      standalone: {
        options: {
          mainConfigFile: "js/performance-config.js",
          out: "dist/standalone/dot.min.js",
          name: "performance-config",
          optimize: 'uglify2',
          wrap: {
            start: "(function() {",
            end: " window.dot = require( 'main' ); }());"
          }
        }
      },
      production: {
        options: {
          mainConfigFile: "js/performance-config.js",
          out: "dist/production/dot.min.js",
          name: "performance-config",
          optimize: 'uglify2',
          generateSourceMaps: true,
          preserveLicenseComments: false,
          wrap: {
            start: "(function() {",
            end: " window.dot = require( 'main' ); }());"
          }
        }
      }
    },
    
    jshint: {
      all: [
        'Gruntfile.js', 'js/**/*.js'
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
        // strict: true,
        trailing: true,
        
        expr: true, // so we can use assert && assert( ... )
        
        // relaxing options
        es5: true, // we use ES5 getters and setters for now
        loopfunc: true, // we know how not to shoot ourselves in the foot, and this is useful for _.each
        
        globals: {
          // for require.js
          define: true,
          require: true,
          
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
  
  // Default task.
  grunt.registerTask( 'default', [ 'jshint', 'production', 'standalone' ] );
  grunt.registerTask( 'production', [ 'requirejs:production' ] );
  grunt.registerTask( 'standalone', [ 'requirejs:standalone', 'concat:standalone', 'uglify:standalone' ] );
  grunt.loadNpmTasks( 'grunt-contrib-requirejs' );
  grunt.loadNpmTasks( 'grunt-contrib-concat' );
  grunt.loadNpmTasks( 'grunt-contrib-uglify' );
  grunt.loadNpmTasks( 'grunt-contrib-jshint' );
};
