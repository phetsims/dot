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
      development: {
        "dist/debug/dot.js": [
          "contrib/almond/almond.js",
          "dist/debug/dot.js"
        ]
      },
      
      production: {
        almond: true,
        
      }
    },
    
    uglify: {
      development: {
        options: {
          // source map
          sourceMap: 'dist/release/dot.min.js.map'
        },
        build: {
          src: 'dist/debug/dot.js',
          dest: 'dist/release/dot.min.js'
        }
      }
    },
    
    requirejs: {
      development: {
        options: {
          mainConfigFile: "js/config.js",
          out: "dist/debug/dot.js",
          name: "config",
          wrap: {
            start: "(function() {",
            end: " window.dot = require( 'main' ); }());"
          },
          optimize: 'none'
        }
      },
      production: {
        options: {
          mainConfigFile: "js/config.js",
          almond: true,
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
  grunt.registerTask( 'default', [ 'production' ] );
  grunt.registerTask( 'production', [ 'requirejs:production' ] );
  grunt.registerTask( 'development', [ 'requirejs:development', 'concat:development', 'uglify:development' ] );
  grunt.loadNpmTasks( 'grunt-contrib-requirejs' );
  grunt.loadNpmTasks( 'grunt-contrib-concat' );
  grunt.loadNpmTasks( 'grunt-contrib-uglify' );
};
