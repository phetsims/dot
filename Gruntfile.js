// Copyright 2013-2016, University of Colorado Boulder

/* eslint-env node */

const esprima = require( 'esprima' );
const jsBeautify = require( 'js-beautify' ); // eslint-disable-line require-statement-match
const extractDocumentation = require( '../chipper/js/common/extractDocumentation' );
const documentationToHTML = require( '../chipper/js/common/documentationToHTML' );
const fs = require( 'fs' );

// constants
const beautify_html = jsBeautify.html;

// use chipper's gruntfile
const Gruntfile = require( '../chipper/js/grunt/Gruntfile.js' ); // eslint-disable-line require-statement-match

// Add repo-specific grunt tasks
module.exports = function( grunt ) {
  

  grunt.registerTask( 'doc-dot', 'Generates Documentation', () => {
    let indexHTML = '';
    let contentHTML = '';

    const localTypeIds = {
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
      Utils: 'util',
      Vector2: 'vector2',
      Vector3: 'vector3',
      Vector4: 'vector4'
    };

    const externalTypeURLs = {
      Events: '../../axon/doc#events',
      Shape: '../../kite/doc#shape'
    };

    function docFile( file, baseName, typeNames ) {
      const codeFile = fs.readFileSync( file, 'utf8' );
      const program = esprima.parse( codeFile, {
        attachComment: true
      } );
      const doc = extractDocumentation( program );
      if ( baseName === 'ConvexHull2' ) { // for testing
        // console.log( JSON.stringify( doc, null, 2 ) );
      }
      const htmlDoc = documentationToHTML( doc, baseName, typeNames, localTypeIds, externalTypeURLs );

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
    docFile( 'js/Utils.js', 'Utils', [ 'Utils' ] );
    docFile( 'js/Vector2.js', 'Vector2', [ 'Vector2' ] );
    docFile( 'js/Vector3.js', 'Vector3', [ 'Vector3' ] );
    docFile( 'js/Vector4.js', 'Vector4', [ 'Vector4' ] );

    const template = fs.readFileSync( 'doc/template.html', 'utf8' );

    let html = template.replace( '{{API_INDEX}}', indexHTML ).replace( '{{API_CONTENT}}', contentHTML );

    html = beautify_html( html, { indent_size: 2 } );

    fs.writeFileSync( 'doc/index.html', html );
  } );

  Gruntfile( grunt );
};
