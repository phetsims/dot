// Copyright 2002-2014, University of Colorado Boulder

/**
 * Forward and inverse transforms with 4x4 matrices, allowing flexibility including affine and perspective transformations.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

define( function( require ) {
  'use strict';

  var dot = require( 'DOT/dot' );

  require( 'DOT/Matrix4' );
  require( 'DOT/Vector3' );
  require( 'DOT/Ray3' );

  // takes a 4x4 matrix
  dot.Transform4 = function Transform4( matrix ) {
    // using immutable version for now. change it to the mutable identity copy if we need mutable operations on the matrices
    this.setMatrix( matrix === undefined ? dot.Matrix4.IDENTITY : matrix );
  };
  var Transform4 = dot.Transform4;

  Transform4.prototype = {
    constructor: Transform4,

    setMatrix: function( matrix ) {
      this.matrix = matrix;

      // compute these lazily
      this.inverse = null;
      this.matrixTransposed = null; // since WebGL won't allow transpose == true
      this.inverseTransposed = null;
    },

    getMatrix: function() {
      return this.matrix;
    },

    getInverse: function() {
      if ( this.inverse === null ) {
        this.inverse = this.matrix.inverted();
      }
      return this.inverse;
    },

    getMatrixTransposed: function() {
      if ( this.matrixTransposed === null ) {
        this.matrixTransposed = this.matrix.transposed();
      }
      return this.matrixTransposed;
    },

    getInverseTransposed: function() {
      if ( this.inverseTransposed === null ) {
        this.inverseTransposed = this.getInverse().transposed();
      }
      return this.inverseTransposed;
    },

    prepend: function( matrix ) {
      this.setMatrix( matrix.timesMatrix( this.matrix ) );
    },

    append: function( matrix ) {
      this.setMatrix( this.matrix.timesMatrix( matrix ) );
    },

    prependTransform: function( transform ) {
      this.prepend( transform.matrix );
    },

    appendTransform: function( transform ) {
      this.append( transform.matrix );
    },

    isIdentity: function() {
      return this.matrix.type === dot.Matrix4.Types.IDENTITY;
    },

    // applies the 2D affine transform part of the transformation
    applyToCanvasContext: function( context ) {
      context.setTransform( this.matrix.m00(), this.matrix.m10(), this.matrix.m01(), this.matrix.m11(), this.matrix.m03(), this.matrix.m13() );
    },

    /*---------------------------------------------------------------------------*
     * forward transforms (for Vector3 or scalar)
     *----------------------------------------------------------------------------*/

    // transform a position (includes translation)
    transformPosition3: function( vec3 ) {
      return this.matrix.timesVector3( vec3 );
    },

    // transform a vector (exclude translation)
    transformDelta3: function( vec3 ) {
      return this.matrix.timesRelativeVector3( vec3 );
    },

    // transform a normal vector (different than a normal vector)
    transformNormal3: function( vec3 ) {
      return this.getInverse().timesTransposeVector3( vec3 );
    },

    transformDeltaX: function( x ) {
      return this.transformDelta3( new dot.Vector3( x, 0, 0 ) ).x;
    },

    transformDeltaY: function( y ) {
      return this.transformDelta3( new dot.Vector3( 0, y, 0 ) ).y;
    },

    transformDeltaZ: function( z ) {
      return this.transformDelta3( new dot.Vector3( 0, 0, z ) ).z;
    },

    transformRay: function( ray ) {
      return new dot.Ray3(
        this.transformPosition3( ray.pos ),
        this.transformPosition3( ray.pos.plus( ray.dir ) ).minus( this.transformPosition3( ray.pos ) ) );
    },

    /*---------------------------------------------------------------------------*
     * inverse transforms (for Vector3 or scalar)
     *----------------------------------------------------------------------------*/

    inversePosition3: function( vec3 ) {
      return this.getInverse().timesVector3( vec3 );
    },

    inverseDelta3: function( vec3 ) {
      // inverse actually has the translation rolled into the other coefficients, so we have to make this longer
      return this.inversePosition3( vec3 ).minus( this.inversePosition3( dot.Vector3.ZERO ) );
    },

    inverseNormal3: function( vec3 ) {
      return this.matrix.timesTransposeVector3( vec3 );
    },

    inverseDeltaX: function( x ) {
      return this.inverseDelta3( new dot.Vector3( x, 0, 0 ) ).x;
    },

    inverseDeltaY: function( y ) {
      return this.inverseDelta3( new dot.Vector3( 0, y, 0 ) ).y;
    },

    inverseDeltaZ: function( z ) {
      return this.inverseDelta3( new dot.Vector3( 0, 0, z ) ).z;
    },

    inverseRay: function( ray ) {
      return new dot.Ray3(
        this.inversePosition3( ray.pos ),
        this.inversePosition3( ray.pos.plus( ray.dir ) ).minus( this.inversePosition3( ray.pos ) )
      );
    }
  };

  return Transform4;
} );
