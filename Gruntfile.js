// Copyright 2002-2015, University of Colorado Boulder

var fs = require( 'fs' );
var esprima = require( 'esprima' );
var beautify_html = require( 'js-beautify' ).html;
var extractDocumentation = require( '../chipper/js/common/extractDocumentation' );
var documentationToHTML = require( '../chipper/js/common/documentationToHTML' );

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

  grunt.registerTask( 'doc', 'Generates Documentation', function() {
    var indexHTML = '';
    var contentHTML = '';

    var localTypeIds = {
      BinPacker: 'binPacker',
      Bin: 'binPacker-bin',
      Bounds2: 'bounds2',
      Bounds3: 'bounds3',
      Complex: 'complex',
      ConvexHull2: 'convexHull2',
      Dimension2: 'dimension2',
      EigenvalueDecomposition: 'eigenvalueDecomposition',
      LinearFunction: 'linearFunction',
      LUDecomposition: 'luDecomposition',
      Matrix: 'matrix',
      Matrix3: 'matrix3',
      Matrix4: 'matrix4',
      MatrixOps3: 'matrixOps3',
      ObservableVector2: 'observableVector2',
      Permutation: 'permutation',
      Plane3: 'plane3',
      QRDecomposition: 'qrDecomposition',
      Quaternion: 'quaternion',
      Random: 'random',
      Range: 'range',
      Ray2: 'ray2',
      Ray3: 'ray3',
      Rectangle: 'rectangle', // TODO: How to not have a namespace conflict?
      SingularValueDecomposition: 'singularValueDecomposition',
      Sphere3: 'sphere3',
      Transform3: 'transform3',
      Transform4: 'transform4',
      Util: 'util',
      Vector2: 'vector2',
      Vector3: 'vector3',
      Vector4: 'vector4'
    };

    var externalTypeURLs = {
      Events: '../../axon/doc#events',
      Shape: '../../kite/doc#shape'
    };

    function docFile( file, baseName, typeNames ) {
      var codeFile = fs.readFileSync( file, 'utf8' );
      var program = esprima.parse( codeFile, {
        attachComment: true
      } );
      var doc = extractDocumentation( program );
      if ( baseName === 'Vector2' ) { // for testing
        // console.log( JSON.stringify( doc, null, 2 ) );
      }
      var htmlDoc = documentationToHTML( doc, baseName, typeNames, localTypeIds, externalTypeURLs );

      indexHTML += htmlDoc.indexHTML;
      contentHTML += htmlDoc.contentHTML;
    }

    docFile( 'js/BinPacker.js', 'BinPacker', [ 'BinPacker', 'Bin' ] );
    docFile( 'js/Bounds2.js', 'Bounds2', [ 'Bounds2' ] );
    docFile( 'js/Bounds3.js', 'Bounds3', [ 'Bounds3' ] );
    docFile( 'js/Complex.js', 'Complex', [ 'Complex' ] );
    docFile( 'js/ConvexHull2.js', 'ConvexHull2', [ 'ConvexHull2' ] );
    docFile( 'js/Dimension2.js', 'Dimension2', [ 'Dimension2' ] );
    docFile( 'js/Transform3.js', 'Transform3', [ 'Transform3' ] );
    docFile( 'js/Transform4.js', 'Transform4', [ 'Transform4' ] );
    docFile( 'js/Util.js', 'Util', [ 'Util' ] );
    docFile( 'js/Vector2.js', 'Vector2', [ 'Vector2' ] );
    docFile( 'js/Vector3.js', 'Vector3', [ 'Vector3' ] );
    docFile( 'js/Vector4.js', 'Vector4', [ 'Vector4' ] );

    var template = fs.readFileSync( 'doc/template.html', 'utf8' );

    var html = template.replace( '$API_INDEX$', indexHTML ).replace( '$API_CONTENT$', contentHTML );

    html = beautify_html( html, { indent_size: 2 } );

    fs.writeFileSync( 'doc/index.html', html );
  } );

  // dependencies
  grunt.loadNpmTasks( 'grunt-requirejs' );
  grunt.loadNpmTasks( 'grunt-eslint' );
};
