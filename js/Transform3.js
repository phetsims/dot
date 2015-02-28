// Copyright 2002-2014, University of Colorado Boulder

/**
 * Forward and inverse transforms with 3x3 matrices
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

define( function( require ) {
  'use strict';

  var inherit = require( 'PHET_CORE/inherit' );
  var Events = require( 'AXON/Events' );
  var dot = require( 'DOT/dot' );

  require( 'DOT/Matrix3' );
  require( 'DOT/Vector2' );
  require( 'DOT/Ray2' );

  var scratchMatrix = new dot.Matrix3();

  function checkMatrix( matrix ) {
    return ( matrix instanceof dot.Matrix3 ) && matrix.isFinite();
  }

  /**
   * @param {Matrix3} matrix
   */
  dot.Transform3 = function Transform3( matrix ) {
    Events.call( this );

    this.matrix = dot.Matrix3.IDENTITY.copy();

    this.inverse = dot.Matrix3.IDENTITY.copy();
    this.matrixTransposed = dot.Matrix3.IDENTITY.copy();
    this.inverseTransposed = dot.Matrix3.IDENTITY.copy();

    // all three dependent matrices are valid at the start since everything is the identity matrix!
    this.inverseValid = true;
    this.transposeValid = true;
    this.inverseTransposeValid = true;

    if ( matrix ) {
      this.setMatrix( matrix );
    }

    phetAllocation && phetAllocation( 'Transform3' );
  };
  var Transform3 = dot.Transform3;

  inherit( Events, Transform3, {
    /*---------------------------------------------------------------------------*
     * mutators
     *----------------------------------------------------------------------------*/

    /**
     * Sets the value of the matrix directly from a Matrix3. Does not change the Matrix3 instance of this Transform3.
     *
     * @param {Matrix3} matrix
     */
    setMatrix: function( matrix ) {
      assert && assert( checkMatrix( matrix ), 'Matrix has NaNs, non-finite values, or isn\'t a matrix!' );

      // copy the matrix over to our matrix
      this.matrix.set( matrix );

      // set flags and notify
      this.invalidate();
    },

    /**
     * This should be called after our internal matrix is changed. It marks the other dependent matrices as invalid,
     * and sends out notifications of the change
     */
    invalidate: function() {
      // sanity check
      assert && assert( this.matrix.isFinite() );

      // dependent matrices now invalid
      this.inverseValid = false;
      this.transposeValid = false;
      this.inverseTransposeValid = false;

      this.trigger0( 'change' );
    },

    /**
     * this.matrix = matrix * this.matrix
     *
     * @param {Matrix3} matrix
     */
    prepend: function( matrix ) {
      assert && assert( checkMatrix( matrix ), 'Matrix has NaNs, non-finite values, or isn\'t a matrix!' );

      // In the absence of a prepend-multiply function in Matrix3, copy over to a scratch matrix instead
      // TODO: implement a prepend-multiply directly in Matrix3 for a performance increase
      scratchMatrix.set( this.matrix );
      this.matrix.set( matrix );
      this.matrix.multiplyMatrix( scratchMatrix );

      // set flags and notify
      this.invalidate();
    },

    /**
     * this.matrix = translation( x, y ) * this.matrix, see (scenery#119)
     *
     * @param {Matrix3} matrix
     */
    prependTranslation: function( x, y ) {
      assert && assert( typeof x === 'number' && typeof y === 'number' && isFinite( x ) && isFinite( y ),
        'Attempted to prepend non-finite or non-number (x,y) to the transform' );

      this.matrix.prependTranslation( x, y );

      // set flags and notify
      this.invalidate();
    },

    /**
     * this.matrix = this.matrix * matrix
     *
     * @param {Matrix3} matrix
     */
    append: function( matrix ) {
      assert && assert( checkMatrix( matrix ), 'Matrix has NaNs, non-finite values, or isn\'t a matrix!' );

      this.matrix.multiplyMatrix( matrix );

      // set flags and notify
      this.invalidate();
    },

    prependTransform: function( transform ) {
      this.prepend( transform.matrix );
    },

    appendTransform: function( transform ) {
      this.append( transform.matrix );
    },

    applyToCanvasContext: function( context ) {
      context.setTransform( this.matrix.m00(), this.matrix.m10(), this.matrix.m01(), this.matrix.m11(), this.matrix.m02(), this.matrix.m12() );
    },

    /*---------------------------------------------------------------------------*
     * getters
     *----------------------------------------------------------------------------*/

    copy: function() {
      var transform = new Transform3( this.matrix );

      transform.inverse = this.inverse;
      transform.matrixTransposed = this.matrixTransposed;
      transform.inverseTransposed = this.inverseTransposed;

      transform.inverseValid = this.inverseValid;
      transform.transposeValid = this.transposeValid;
      transform.inverseTransposeValid = this.inverseTransposeValid;
    },

    getMatrix: function() {
      return this.matrix;
    },

    getInverse: function() {
      if ( !this.inverseValid ) {
        this.inverseValid = true;

        this.inverse.set( this.matrix );
        this.inverse.invert();
      }
      return this.inverse;
    },

    getMatrixTransposed: function() {
      if ( !this.transposeValid ) {
        this.transposeValid = true;

        this.matrixTransposed.set( this.matrix );
        this.matrixTransposed.transpose();
      }
      return this.matrixTransposed;
    },

    getInverseTransposed: function() {
      if ( !this.inverseTransposeValid ) {
        this.inverseTransposeValid = true;

        this.inverseTransposed.set( this.getInverse() ); // triggers inverse to be valid
        this.inverseTransposed.transpose();
      }
      return this.inverseTransposed;
    },

    // false is "inconclusive"
    isIdentity: function() {
      return this.matrix.type === dot.Matrix3.Types.IDENTITY;
    },

    isFinite: function() {
      return this.matrix.isFinite();
    },

    /*---------------------------------------------------------------------------*
     * forward transforms (for Vector2 or scalar)
     *----------------------------------------------------------------------------*/

    // transform a position (includes translation)
    transformPosition2: function( vec2 ) {
      return this.matrix.timesVector2( vec2 );
    },

    // transform a vector (exclude translation)
    transformDelta2: function( vec2 ) {
      var m = this.getMatrix();
      // m . vec2 - m . Vector2.ZERO
      return new dot.Vector2( m.m00() * vec2.x + m.m01() * vec2.y, m.m10() * vec2.x + m.m11() * vec2.y );
    },

    // transform a normal vector (different than a normal vector)
    transformNormal2: function( vec2 ) {
      return this.getInverse().timesTransposeVector2( vec2 );
    },

    transformX: function( x ) {
      var m = this.getMatrix();
      assert && assert( !m.m01(), 'Transforming an X value with a rotation/shear is ill-defined' );
      return m.m00() * x + m.m02();
    },

    transformY: function( y ) {
      var m = this.getMatrix();
      assert && assert( !m.m10(), 'Transforming a Y value with a rotation/shear is ill-defined' );
      return m.m11() * y + m.m12();
    },

    transformDeltaX: function( x ) {
      var m = this.getMatrix();
      assert && assert( !m.m01(), 'Transforming an X value with a rotation/shear is ill-defined' );
      // same as this.transformDelta2( new dot.Vector2( x, 0 ) ).x;
      return m.m00() * x;
    },

    transformDeltaY: function( y ) {
      var m = this.getMatrix();
      assert && assert( !m.m10(), 'Transforming a Y value with a rotation/shear is ill-defined' );
      // same as this.transformDelta2( new dot.Vector2( 0, y ) ).y;
      return m.m11() * y;
    },

    transformBounds2: function( bounds2 ) {
      return bounds2.transformed( this.matrix );
    },

    transformShape: function( shape ) {
      return shape.transformed( this.matrix );
    },

    transformRay2: function( ray ) {
      return new dot.Ray2( this.transformPosition2( ray.pos ), this.transformDelta2( ray.dir ).normalized() );
    },

    /*---------------------------------------------------------------------------*
     * inverse transforms (for Vector2 or scalar)
     *----------------------------------------------------------------------------*/

    inversePosition2: function( vec2 ) {
      return this.getInverse().timesVector2( vec2 );
    },

    inverseDelta2: function( vec2 ) {
      var m = this.getInverse();
      // m . vec2 - m . Vector2.ZERO
      return new dot.Vector2( m.m00() * vec2.x + m.m01() * vec2.y, m.m10() * vec2.x + m.m11() * vec2.y );
    },

    inverseNormal2: function( vec2 ) {
      return this.matrix.timesTransposeVector2( vec2 );
    },

    inverseX: function( x ) {
      var m = this.getInverse();
      assert && assert( !m.m01(), 'Inverting an X value with a rotation/shear is ill-defined' );
      return m.m00() * x + m.m02();
    },

    inverseY: function( y ) {
      var m = this.getInverse();
      assert && assert( !m.m10(), 'Inverting a Y value with a rotation/shear is ill-defined' );
      return m.m11() * y + m.m12();
    },

    inverseDeltaX: function( x ) {
      var m = this.getInverse();
      assert && assert( !m.m01(), 'Inverting an X value with a rotation/shear is ill-defined' );
      // same as this.inverseDelta2( new dot.Vector2( x, 0 ) ).x;
      return m.m00() * x;
    },

    inverseDeltaY: function( y ) {
      var m = this.getInverse();
      assert && assert( !m.m10(), 'Inverting a Y value with a rotation/shear is ill-defined' );
      // same as this.inverseDelta2( new dot.Vector2( 0, y ) ).y;
      return m.m11() * y;
    },

    inverseBounds2: function( bounds2 ) {
      return bounds2.transformed( this.getInverse() );
    },

    inverseShape: function( shape ) {
      return shape.transformed( this.getInverse() );
    },

    inverseRay2: function( ray ) {
      return new dot.Ray2( this.inversePosition2( ray.pos ), this.inverseDelta2( ray.dir ).normalized() );
    }
  } );

  return Transform3;
} );
