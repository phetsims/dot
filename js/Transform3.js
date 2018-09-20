// Copyright 2013-2015, University of Colorado Boulder

/**
 * Forward and inverse transforms with 3x3 matrices. Methods starting with 'transform' will apply the transform from our
 * primary matrix, while methods starting with 'inverse' will apply the transform from the inverse of our matrix.
 *
 * Generally, this means transform.inverseThing( transform.transformThing( thing ) ).equals( thing ).
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

define( function( require ) {
  'use strict';

  var dot = require( 'DOT/dot' );
  var Events = require( 'AXON/Events' );
  var inherit = require( 'PHET_CORE/inherit' );

  require( 'DOT/Matrix3' );
  require( 'DOT/Vector2' );
  require( 'DOT/Ray2' );

  var scratchMatrix = new dot.Matrix3();

  function checkMatrix( matrix ) {
    return ( matrix instanceof dot.Matrix3 ) && matrix.isFinite();
  }

  /**
   * Creates a transform based around an initial matrix.
   * @constructor
   * @public
   *
   * @param {Matrix3} matrix
   */
  function Transform3( matrix ) {
    Events.call( this );

    // @private {Matrix3} - The primary matrix used for the transform
    this.matrix = dot.Matrix3.IDENTITY.copy();

    // @private {Matrix3} - The inverse of the primary matrix, computed lazily
    this.inverse = dot.Matrix3.IDENTITY.copy();

    // @private {Matrix3} - The transpose of the primary matrix, computed lazily
    this.matrixTransposed = dot.Matrix3.IDENTITY.copy();

    // @private {Matrix3} - The inverse of the transposed primary matrix, computed lazily
    this.inverseTransposed = dot.Matrix3.IDENTITY.copy();


    // @private {boolean} - Whether this.inverse has been computed based on the latest primary matrix
    this.inverseValid = true;

    // @private {boolean} - Whether this.matrixTransposed has been computed based on the latest primary matrix
    this.transposeValid = true;

    // @private {boolean} - Whether this.inverseTransposed has been computed based on the latest primary matrix
    this.inverseTransposeValid = true;

    if ( matrix ) {
      this.setMatrix( matrix );
    }
  }

  dot.register( 'Transform3', Transform3 );

  inherit( Events, Transform3, {
    /*---------------------------------------------------------------------------*
     * mutators
     *---------------------------------------------------------------------------*/

    /**
     * Sets the value of the primary matrix directly from a Matrix3. Does not change the Matrix3 instance of this
     * Transform3.
     * @public
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
     * and sends out notifications of the change.
     * @private
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
     * Modifies the primary matrix such that: this.matrix = matrix * this.matrix.
     * @public
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
     * Optimized prepended translation such that: this.matrix = translation( x, y ) * this.matrix.
     * @public
     *
     * @param {number} x -  x-coordinate
     * @param {number} y -  y-coordinate
     */
    prependTranslation: function( x, y ) {
      // See scenery#119 for more details on the need.

      assert && assert( typeof x === 'number' && typeof y === 'number' && isFinite( x ) && isFinite( y ),
        'Attempted to prepend non-finite or non-number (x,y) to the transform' );

      this.matrix.prependTranslation( x, y );

      // set flags and notify
      this.invalidate();
    },

    /**
     * Modifies the primary matrix such that: this.matrix = this.matrix * matrix
     * @public
     *
     * @param {Matrix3} matrix
     */
    append: function( matrix ) {
      assert && assert( checkMatrix( matrix ), 'Matrix has NaNs, non-finite values, or isn\'t a matrix!' );

      this.matrix.multiplyMatrix( matrix );

      // set flags and notify
      this.invalidate();
    },

    /**
     * Like prepend(), but prepends the other transform's matrix.
     * @public
     *
     * @param {Transform3} transform
     */
    prependTransform: function( transform ) {
      this.prepend( transform.matrix );
    },

    /**
     * Like append(), but appends the other transform's matrix.
     * @public
     *
     * @param {Transform3} transform
     */
    appendTransform: function( transform ) {
      this.append( transform.matrix );
    },

    /**
     * Sets the transform of a Canvas context to be equivalent to this transform.
     * @public
     *
     * @param {CanvasRenderingContext2D} context
     */
    applyToCanvasContext: function( context ) {
      context.setTransform( this.matrix.m00(), this.matrix.m10(), this.matrix.m01(), this.matrix.m11(), this.matrix.m02(), this.matrix.m12() );
    },

    /*---------------------------------------------------------------------------*
     * getters
     *---------------------------------------------------------------------------*/

    /**
     * Creates a copy of this transform.
     * @public
     *
     * @returns {Transform3}
     */
    copy: function() {
      var transform = new Transform3( this.matrix );

      transform.inverse = this.inverse;
      transform.matrixTransposed = this.matrixTransposed;
      transform.inverseTransposed = this.inverseTransposed;

      transform.inverseValid = this.inverseValid;
      transform.transposeValid = this.transposeValid;
      transform.inverseTransposeValid = this.inverseTransposeValid;
    },

    /**
     * Returns the primary matrix of this transform.
     * @public
     *
     * @returns {Matrix3}
     */
    getMatrix: function() {
      return this.matrix;
    },

    /**
     * Returns the inverse of the primary matrix of this transform.
     * @public
     *
     * @returns {Matrix3}
     */
    getInverse: function() {
      if ( !this.inverseValid ) {
        this.inverseValid = true;

        this.inverse.set( this.matrix );
        this.inverse.invert();
      }
      return this.inverse;
    },

    /**
     * Returns the transpose of the primary matrix of this transform.
     * @public
     *
     * @returns {Matrix3}
     */
    getMatrixTransposed: function() {
      if ( !this.transposeValid ) {
        this.transposeValid = true;

        this.matrixTransposed.set( this.matrix );
        this.matrixTransposed.transpose();
      }
      return this.matrixTransposed;
    },

    /**
     * Returns the inverse of the transpose of matrix of this transform.
     * @public
     *
     * @returns {Matrix3}
     */
    getInverseTransposed: function() {
      if ( !this.inverseTransposeValid ) {
        this.inverseTransposeValid = true;

        this.inverseTransposed.set( this.getInverse() ); // triggers inverse to be valid
        this.inverseTransposed.transpose();
      }
      return this.inverseTransposed;
    },

    /**
     * Returns whether our primary matrix is known to be an identity matrix. If false is returned, it doesn't necessarily
     * mean our matrix isn't an identity matrix, just that it is unlikely in normal usage.
     * @public
     *
     * @returns {boolean}
     */
    isIdentity: function() {
      return this.matrix.type === dot.Matrix3.Types.IDENTITY;
    },

    /**
     * Returns whether any components of our primary matrix are either infinite or NaN.
     * @public
     *
     * @returns {boolean}
     */
    isFinite: function() {
      return this.matrix.isFinite();
    },

    /*---------------------------------------------------------------------------*
     * forward transforms (for Vector2 or scalar)
     *---------------------------------------------------------------------------*/

    /**
     * Transforms a 2-dimensional vector like it is a point with a position (translation is applied).
     * @public
     *
     * For an affine matrix $M$, the result is the homogeneous multiplication $M\begin{bmatrix} x \\ y \\ 1 \end{bmatrix}$.
     *
     * @param {Vector2} v
     * @returns {Vector2}
     */
    transformPosition2: function( v ) {
      return this.matrix.timesVector2( v );
    },

    /**
     * Transforms a 2-dimensional vector like position is irrelevant (translation is not applied).
     * @public
     *
     * For an affine matrix $\begin{bmatrix} a & b & c \\ d & e & f \\ 0 & 0 & 1 \end{bmatrix}$,
     * the result is $\begin{bmatrix} a & b & 0 \\ d & e & 0 \\ 0 & 0 & 1 \end{bmatrix} \begin{bmatrix} x \\ y \\ 1 \end{bmatrix}$.
     *
     * @param {Vector2} v
     * @returns {Vector2}
     */
    transformDelta2: function( v ) {
      var m = this.getMatrix();
      // m . v - m . Vector2.ZERO
      return new dot.Vector2( m.m00() * v.x + m.m01() * v.y, m.m10() * v.x + m.m11() * v.y );
    },

    /**
     * Transforms a 2-dimensional vector like it is a normal to a curve (so that the curve is transformed, and the new
     * normal to the curve at the transformed point is returned).
     * @public
     *
     * For an affine matrix $\begin{bmatrix} a & b & c \\ d & e & f \\ 0 & 0 & 1 \end{bmatrix}$,
     * the result is $\begin{bmatrix} a & e & 0 \\ d & b & 0 \\ 0 & 0 & 1 \end{bmatrix}^{-1} \begin{bmatrix} x \\ y \\ 1 \end{bmatrix}$.
     * This is essentially the transposed inverse with translation removed.
     *
     * @param {Vector2} v
     * @returns {Vector2}
     */
    transformNormal2: function( v ) {
      return this.getInverse().timesTransposeVector2( v ).normalize();
    },

    /**
     * Returns the resulting x-coordinate of the transformation of all vectors with the initial input x-coordinate. If
     * this is not well-defined (the x value depends on y), an assertion is thrown (and y is assumed to be 0).
     * @public
     *
     * @param {number} x
     * @returns {number}
     */
    transformX: function( x ) {
      var m = this.getMatrix();
      assert && assert( !m.m01(), 'Transforming an X value with a rotation/shear is ill-defined' );
      return m.m00() * x + m.m02();
    },

    /**
     * Returns the resulting y-coordinate of the transformation of all vectors with the initial input y-coordinate. If
     * this is not well-defined (the y value depends on x), an assertion is thrown (and x is assumed to be 0).
     * @public
     *
     * @param {number} y
     * @returns {number}
     */
    transformY: function( y ) {
      var m = this.getMatrix();
      assert && assert( !m.m10(), 'Transforming a Y value with a rotation/shear is ill-defined' );
      return m.m11() * y + m.m12();
    },

    /**
     * Returns the x-coordinate difference for two transformed vectors, which add the x-coordinate difference of the input
     * x (and same y values) beforehand.
     * @public
     *
     * @param {number} x
     * @returns {number}
     */
    transformDeltaX: function( x ) {
      var m = this.getMatrix();
      // same as this.transformDelta2( new dot.Vector2( x, 0 ) ).x;
      return m.m00() * x;
    },

    /**
     * Returns the y-coordinate difference for two transformed vectors, which add the y-coordinate difference of the input
     * y (and same x values) beforehand.
     * @public
     *
     * @param {number} y
     * @returns {number}
     */
    transformDeltaY: function( y ) {
      var m = this.getMatrix();
      // same as this.transformDelta2( new dot.Vector2( 0, y ) ).y;
      return m.m11() * y;
    },

    /**
     * Returns bounds (axis-aligned) that contains the transformed bounds rectangle.
     * @public
     *
     * NOTE: transform.inverseBounds2( transform.transformBounds2( bounds ) ) may be larger than the original box,
     * if it includes a rotation that isn't a multiple of $\pi/2$. This is because the returned bounds may expand in
     * area to cover ALL of the corners of the transformed bounding box.
     *
     * @param {Bounds2} bounds
     * @returns {Bounds2}
     */
    transformBounds2: function( bounds ) {
      return bounds.transformed( this.matrix );
    },

    /**
     * Returns a transformed kite.Shape.
     * @public
     *
     * @param {Shape} shape
     * @returns {Shape}
     */
    transformShape: function( shape ) {
      return shape.transformed( this.matrix );
    },

    /**
     * Returns a transformed ray.
     * @public
     *
     * @param {Ray2} ray
     * @returns {Ray2}
     */
    transformRay2: function( ray ) {
      return new dot.Ray2( this.transformPosition2( ray.position ), this.transformDelta2( ray.direction ).normalized() );
    },

    /*---------------------------------------------------------------------------*
     * inverse transforms (for Vector2 or scalar)
     *---------------------------------------------------------------------------*/

    /**
     * Transforms a 2-dimensional vector by the inverse of our transform like it is a point with a position (translation is applied).
     * @public
     *
     * For an affine matrix $M$, the result is the homogeneous multiplication $M^{-1}\begin{bmatrix} x \\ y \\ 1 \end{bmatrix}$.
     *
     * This is the inverse of transformPosition2().
     *
     * @param {Vector2} v
     * @returns {Vector2}
     */
    inversePosition2: function( v ) {
      return this.getInverse().timesVector2( v );
    },

    /**
     * Transforms a 2-dimensional vector by the inverse of our transform like position is irrelevant (translation is not applied).
     * @public
     *
     * For an affine matrix $\begin{bmatrix} a & b & c \\ d & e & f \\ 0 & 0 & 1 \end{bmatrix}$,
     * the result is $\begin{bmatrix} a & b & 0 \\ d & e & 0 \\ 0 & 0 & 1 \end{bmatrix}^{-1} \begin{bmatrix} x \\ y \\ 1 \end{bmatrix}$.
     *
     * This is the inverse of transformDelta2().
     *
     * @param {Vector2} v
     * @returns {Vector2}
     */
    inverseDelta2: function( v ) {
      var m = this.getInverse();
      // m . v - m . Vector2.ZERO
      return new dot.Vector2( m.m00() * v.x + m.m01() * v.y, m.m10() * v.x + m.m11() * v.y );
    },

    /**
     * Transforms a 2-dimensional vector by the inverse of our transform like it is a normal to a curve (so that the
     * curve is transformed, and the new normal to the curve at the transformed point is returned).
     * @public
     *
     * For an affine matrix $\begin{bmatrix} a & b & c \\ d & e & f \\ 0 & 0 & 1 \end{bmatrix}$,
     * the result is $\begin{bmatrix} a & e & 0 \\ d & b & 0 \\ 0 & 0 & 1 \end{bmatrix} \begin{bmatrix} x \\ y \\ 1 \end{bmatrix}$.
     * This is essentially the transposed transform with translation removed.
     *
     * This is the inverse of transformNormal2().
     *
     * @param {Vector2} v
     * @returns {Vector2}
     */
    inverseNormal2: function( v ) {
      return this.matrix.timesTransposeVector2( v ).normalize();
    },

    /**
     * Returns the resulting x-coordinate of the inverse transformation of all vectors with the initial input x-coordinate. If
     * this is not well-defined (the x value depends on y), an assertion is thrown (and y is assumed to be 0).
     * @public
     *
     * This is the inverse of transformX().
     *
     * @param {number} x
     * @returns {number}
     */
    inverseX: function( x ) {
      var m = this.getInverse();
      assert && assert( !m.m01(), 'Inverting an X value with a rotation/shear is ill-defined' );
      return m.m00() * x + m.m02();
    },

    /**
     * Returns the resulting y-coordinate of the inverse transformation of all vectors with the initial input y-coordinate. If
     * this is not well-defined (the y value depends on x), an assertion is thrown (and x is assumed to be 0).
     * @public
     *
     * This is the inverse of transformY().
     *
     * @param {number} y
     * @returns {number}
     */
    inverseY: function( y ) {
      var m = this.getInverse();
      assert && assert( !m.m10(), 'Inverting a Y value with a rotation/shear is ill-defined' );
      return m.m11() * y + m.m12();
    },

    /**
     * Returns the x-coordinate difference for two inverse-transformed vectors, which add the x-coordinate difference of the input
     * x (and same y values) beforehand.
     * @public
     *
     * This is the inverse of transformDeltaX().
     *
     * @param {number} x
     * @returns {number}
     */
    inverseDeltaX: function( x ) {
      var m = this.getInverse();
      assert && assert( !m.m01(), 'Inverting an X value with a rotation/shear is ill-defined' );
      // same as this.inverseDelta2( new dot.Vector2( x, 0 ) ).x;
      return m.m00() * x;
    },

    /**
     * Returns the y-coordinate difference for two inverse-transformed vectors, which add the y-coordinate difference of the input
     * y (and same x values) beforehand.
     * @public
     *
     * This is the inverse of transformDeltaY().
     *
     * @param {number} y
     * @returns {number}
     */
    inverseDeltaY: function( y ) {
      var m = this.getInverse();
      assert && assert( !m.m10(), 'Inverting a Y value with a rotation/shear is ill-defined' );
      // same as this.inverseDelta2( new dot.Vector2( 0, y ) ).y;
      return m.m11() * y;
    },

    /**
     * Returns bounds (axis-aligned) that contains the inverse-transformed bounds rectangle.
     * @public
     *
     * NOTE: transform.inverseBounds2( transform.transformBounds2( bounds ) ) may be larger than the original box,
     * if it includes a rotation that isn't a multiple of $\pi/2$. This is because the returned bounds may expand in
     * area to cover ALL of the corners of the transformed bounding box.
     *
     * @param {Bounds2} bounds
     * @returns {Bounds2}
     */
    inverseBounds2: function( bounds ) {
      return bounds.transformed( this.getInverse() );
    },

    /**
     * Returns an inverse-transformed kite.Shape.
     * @public
     *
     * This is the inverse of transformShape()
     *
     * @param {Shape} shape
     * @returns {Shape}
     */
    inverseShape: function( shape ) {
      return shape.transformed( this.getInverse() );
    },

    /**
     * Returns an inverse-transformed ray.
     * @public
     *
     * This is the inverse of transformRay2()
     *
     * @param {Ray2} ray
     * @returns {Ray2}
     */
    inverseRay2: function( ray ) {
      return new dot.Ray2( this.inversePosition2( ray.position ), this.inverseDelta2( ray.direction ).normalized() );
    }
  } );

  return Transform3;
} );
