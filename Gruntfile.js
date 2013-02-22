/*global module:false*/
module.exports = function ( grunt ) {

  // Project configuration.
  grunt.initConfig( {
                      pkg: '<json:package.json>',


                      lint: {
                        files: [
//                                  'grunt.js',
//                                  'app-easel/*.js'
                        ]
                      },

                      concat: {
                        "dist/debug/require.js": [
                          "js/vendor/almond.js",
                          "dist/debug/require.js"
                        ]
                      },

                      uglify: {
                        "dist/release/require.js": [
                          "dist/debug/require.js"
                        ]
                      },

                      requirejs: {
                        compile: {
                          options: {
                            mainConfigFile: "js/config.js",
                            out: "dist/debug/require.js",
                            name: "config",
                            wrap: false
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
  grunt.registerTask( 'default', ['requirejs', 'concat', 'uglify'] );
  grunt.loadNpmTasks( 'grunt-contrib-requirejs' );
  grunt.loadNpmTasks( 'grunt-contrib-concat' );
  grunt.loadNpmTasks( 'grunt-contrib-uglify' );
};