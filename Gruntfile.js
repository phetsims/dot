/*global module:false*/
module.exports = function( grunt ) {
  
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
        src: [ "contrib/almond/almond.js", "dist/standalone/dot.min.js" ],
        dest: "dist/standalone/dot.min.js"
      }
    },
    
    uglify: {
      standalone: {
        build: {
          src: [ 'dist/standalone/dot.min.js' ],
          dest: 'dist/standalone/dot.min.js'
        }
      }
    },
    
    requirejs: {
      standalone: {
        options: {
          mainConfigFile: "js/config.js",
          out: "dist/standalone/dot.min.js",
          name: "config",
          optimize: 'uglify2',
          wrap: {
            start: "(function() {",
            end: " window.dot = require( 'main' ); }());"
          }
        }
      },
      production: {
        options: {
          mainConfigFile: "js/config.js",
          out: "dist/production/dot.min.js",
          name: "config",
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
      options: {
        curly: true,
        eqeqeq: true,
        immed: false,
        latedef: false,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        browser: true,
        node: true,
        jQuery: true,
        expr: true
      },
      globals: {
        Modernizr: true,
        define: true,
        $: true
      }
    }
  } );
  
  // Default task.
  grunt.registerTask( 'default', [ 'production', 'standalone' ] );
  grunt.registerTask( 'production', [ 'requirejs:production' ] );
  grunt.registerTask( 'standalone', [ 'requirejs:standalone', 'concat:standalone', 'uglify:standalone' ] );
  grunt.loadNpmTasks( 'grunt-contrib-requirejs' );
  grunt.loadNpmTasks( 'grunt-contrib-concat' );
  grunt.loadNpmTasks( 'grunt-contrib-uglify' );
};
