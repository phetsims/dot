// Copyright 2013-2023, University of Colorado Boulder

/**
 * Forward and inverse transforms with 4x4 matrices, allowing flexibility including affine and perspective transformations.
 *
 * Methods starting with 'transform' will apply the transform from our
 * primary matrix, while methods starting with 'inverse' will apply the transform from the inverse of our matrix.
 *
 * Generally, this means transform.inverseThing( transform.transformThing( thing ) ).equals( thing ).
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import TinyEmitter from '../../axon/js/TinyEmitter.js';
import dot from './dot.js';
import Matrix4 from './Matrix4.js';
import Ray3 from './Ray3.js';
import Vector3 from './Vector3.js';

const scratchMatrix = new Matrix4();

/**
 * check if the matrix is Finite and is of type Matrix4
 * @private
 * @param matrix
 * @returns {boolean}
 */
function checkMatrix( matrix ) {
  return ( matrix instanceof Matrix4 ) && matrix.isFinite();
}

class Transform4 {
  /**
   * Creates a transform based around an initial matrix.
   * @public
   *
   * @param {Matrix4} matrix
   */
  constructor( matrix ) {

    // @private {Matrix4} - The primary matrix used for the transform
    this.matrix = Matrix4.IDENTITY.copy();

    // @private {Matrix4} - The inverse of the primary matrix, computed lazily
    this.inverse = Matrix4.IDENTITY.copy();

    // @private {Matrix4} - The transpose of the primary matrix, computed lazily
    this.matrixTransposed = Matrix4.IDENTITY.copy();

    // @private {Matrix4} - The inverse of the transposed primary matrix, computed lazily
    this.inverseTransposed = Matrix4.IDENTITY.copy();


    // @private {boolean} - Whether this.inverse has been computed based on the latest primary matrix
    this.inverseValid = true;

    // @private {boolean} - Whether this.matrixTransposed has been computed based on the latest primary matrix
    this.transposeValid = true;

    // @private {boolean} - Whether this.inverseTransposed has been computed based on the latest primary matrix
    this.inverseTransposeValid = true;

    // @public {TinyEmitter}
    this.changeEmitter = new TinyEmitter();

    if ( matrix ) {
      this.setMatrix( matrix );
    }
  }

  /*---------------------------------------------------------------------------*
   * mutators
   *---------------------------------------------------------------------------*/

  /**
   * Sets the value of the primary matrix directly from a Matrix4. Does not change the Matrix4 instance of this
   * Transform4.
   * @public
   *
   * @param {Matrix4} matrix
   */
  setMatrix( matrix ) {
    assert && assert( checkMatrix( matrix ), 'Matrix has NaNs, non-finite values, or isn\'t a matrix!' );

    // copy the matrix over to our matrix
    this.matrix.set( matrix );

    // set flags and notify
    this.invalidate();
  }

  /**
   * This should be called after our internal matrix is changed. It marks the other dependent matrices as invalid,
   * and sends out notifications of the change.
   * @private
   */
  invalidate() {
    // sanity check
    assert && assert( this.matrix.isFinite() );

    // dependent matrices now invalid
    this.inverseValid = false;
    this.transposeValid = false;
    this.inverseTransposeValid = false;

    this.changeEmitter.emit();
  }

  /**
   * Modifies the primary matrix such that: this.matrix = matrix * this.matrix.
   * @public
   *
   * @param {Matrix4} matrix
   */
  prepend( matrix ) {
    assert && assert( checkMatrix( matrix ), 'Matrix has NaNs, non-finite values, or isn\'t a matrix!' );

    // In the absence of a prepend-multiply function in Matrix4, copy over to a scratch matrix instead
    // TODO: implement a prepend-multiply directly in Matrix4 for a performance increase https://github.com/phetsims/dot/issues/120
    scratchMatrix.set( this.matrix );
    this.matrix.set( matrix );
    this.matrix.multiplyMatrix( scratchMatrix );

    // set flags and notify
    this.invalidate();
  }

  /**
   * Modifies the primary matrix such that: this.matrix = this.matrix * matrix
   * @public
   *
   * @param {Matrix4} matrix
   */
  append( matrix ) {
    assert && assert( checkMatrix( matrix ), 'Matrix has NaNs, non-finite values, or isn\'t a matrix!' );

    this.matrix.multiplyMatrix( matrix );

    // set flags and notify
    this.invalidate();
  }

  /**
   * Like prepend(), but prepends the other transform's matrix.
   * @public
   *
   * @param {Transform4} transform
   */
  prependTransform( transform ) {
    this.prepend( transform.matrix );
  }

  /**
   * Like append(), but appends the other transform's matrix.
   * @public
   *
   * @param {Transform4} transform
   */
  appendTransform( transform ) {
    this.append( transform.matrix );
  }

  /**
   * Sets the transform of a Canvas context to be equivalent to the 2D affine part of this transform.
   * @public
   *
   * @param {CanvasRenderingContext2D} context
   */
  applyToCanvasContext( context ) {
    context.setTransform( this.matrix.m00(), this.matrix.m10(), this.matrix.m01(), this.matrix.m11(), this.matrix.m03(), this.matrix.m13() );
  }

  /*---------------------------------------------------------------------------*
   * getters
   *---------------------------------------------------------------------------*/

  /**
   * Creates a copy of this transform.
   * @public
   *
   * @returns {Transform4}
   */
  copy() {
    const transform = new Transform4( this.matrix );

    transform.inverse = this.inverse;
    transform.matrixTransposed = this.matrixTransposed;
    transform.inverseTransposed = this.inverseTransposed;

    transform.inverseValid = this.inverseValid;
    transform.transposeValid = this.transposeValid;
    transform.inverseTransposeValid = this.inverseTransposeValid;
  }

  /**
   * Returns the primary matrix of this transform.
   * @public
   *
   * @returns {Matrix4}
   */
  getMatrix() {
    return this.matrix;
  }

  /**
   * Returns the inverse of the primary matrix of this transform.
   * @public
   *
   * @returns {Matrix4}
   */
  getInverse() {
    if ( !this.inverseValid ) {
      this.inverseValid = true;

      this.inverse.set( this.matrix );
      this.inverse.invert();
    }
    return this.inverse;
  }

  /**
   * Returns the transpose of the primary matrix of this transform.
   * @public
   *
   * @returns {Matrix4}
   */
  getMatrixTransposed() {
    if ( !this.transposeValid ) {
      this.transposeValid = true;

      this.matrixTransposed.set( this.matrix );
      this.matrixTransposed.transpose();
    }
    return this.matrixTransposed;
  }

  /**
   * Returns the inverse of the transpose of matrix of this transform.
   * @public
   *
   * @returns {Matrix4}
   */
  getInverseTransposed() {
    if ( !this.inverseTransposeValid ) {
      this.inverseTransposeValid = true;

      this.inverseTransposed.set( this.getInverse() ); // triggers inverse to be valid
      this.inverseTransposed.transpose();
    }
    return this.inverseTransposed;
  }

  /**
   * Returns whether our primary matrix is known to be an identity matrix. If false is returned, it doesn't necessarily
   * mean our matrix isn't an identity matrix, just that it is unlikely in normal usage.
   * @public
   *
   * @returns {boolean}
   */
  isIdentity() {
    return this.matrix.type === Matrix4.Types.IDENTITY;
  }

  /**
   * Returns whether any components of our primary matrix are either infinite or NaN.
   * @public
   *
   * @returns {boolean}
   */
  isFinite() {
    return this.matrix.isFinite();
  }

  /*---------------------------------------------------------------------------*
   * forward transforms (for Vector3 or scalar)
   *---------------------------------------------------------------------------*/

  /**
   * Transforms a 3-dimensional vector like it is a point with a position (translation is applied).
   * @public
   *
   * For an affine matrix $M$, the result is the homogeneous multiplication $M\begin{bmatrix} x \\ y \\ z \\ 1 \end{bmatrix}$.
   *
   * @param {Vector3} v
   * @returns {Vector3}
   */
  transformPosition3( v ) {
    return this.matrix.timesVector3( v );
  }

  /**
   * Transforms a 3-dimensional vector like position is irrelevant (translation is not applied).
   * @public
   *
   * @param {Vector3} v
   * @returns {Vector3}
   */
  transformDelta3( v ) {
    return this.matrix.timesRelativeVector3( v );
  }

  /**
   * Transforms a 3-dimensional vector like it is a normal to a surface (so that the surface is transformed, and the new
   * normal to the surface at the transformed point is returned).
   * @public
   *
   * @param {Vector3} v
   * @returns {Vector3}
   */
  transformNormal3( v ) {
    return this.getInverse().timesTransposeVector3( v );
  }

  /**
   * Returns the x-coordinate difference for two transformed vectors, which add the x-coordinate difference of the input
   * x (and same y,z values) beforehand.
   * @public
   *
   * @param {number} x
   * @returns {number}
   */
  transformDeltaX( x ) {
    return this.transformDelta3( new Vector3( x, 0, 0 ) ).x;
  }

  /**
   * Returns the y-coordinate difference for two transformed vectors, which add the y-coordinate difference of the input
   * y (and same x,z values) beforehand.
   * @public
   *
   * @param {number} y
   * @returns {number}
   */
  transformDeltaY( y ) {
    return this.transformDelta3( new Vector3( 0, y, 0 ) ).y;
  }

  /**
   * Returns the z-coordinate difference for two transformed vectors, which add the z-coordinate difference of the input
   * z (and same x,y values) beforehand.
   * @public
   *
   * @param {number} z
   * @returns {number}
   */
  transformDeltaZ( z ) {
    return this.transformDelta3( new Vector3( 0, 0, z ) ).z;
  }

  /**
   * Returns a transformed ray.
   * @public
   *
   * @param {Ray3} ray
   * @returns {Ray3}
   */
  transformRay( ray ) {
    return new Ray3(
      this.transformPosition3( ray.position ),
      this.transformPosition3( ray.position.plus( ray.direction ) ).minus( this.transformPosition3( ray.position ) ) );
  }

  /*---------------------------------------------------------------------------*
   * inverse transforms (for Vector3 or scalar)
   *---------------------------------------------------------------------------*/

  /**
   * Transforms a 3-dimensional vector by the inverse of our transform like it is a point with a position (translation is applied).
   * @public
   *
   * For an affine matrix $M$, the result is the homogeneous multiplication $M^{-1}\begin{bmatrix} x \\ y \\ z \\ 1 \end{bmatrix}$.
   *
   * This is the inverse of transformPosition3().
   *
   * @param {Vector3} v
   * @returns {Vector3}
   */
  inversePosition3( v ) {
    return this.getInverse().timesVector3( v );
  }

  /**
   * Transforms a 3-dimensional vector by the inverse of our transform like position is irrelevant (translation is not applied).
   * @public
   *
   * This is the inverse of transformDelta3().
   *
   * @param {Vector3} v
   * @returns {Vector3}
   */
  inverseDelta3( v ) {
    // inverse actually has the translation rolled into the other coefficients, so we have to make this longer
    return this.inversePosition3( v ).minus( this.inversePosition3( Vector3.ZERO ) );
  }

  /**
   * Transforms a 3-dimensional vector by the inverse of our transform like it is a normal to a curve (so that the
   * curve is transformed, and the new normal to the curve at the transformed point is returned).
   * @public
   *
   * This is the inverse of transformNormal3().
   *
   * @param {Vector3} v
   * @returns {Vector3}
   */
  inverseNormal3( v ) {
    return this.matrix.timesTransposeVector3( v );
  }

  /**
   * Returns the x-coordinate difference for two inverse-transformed vectors, which add the x-coordinate difference of the input
   * x (and same y,z values) beforehand.
   * @public
   *
   * This is the inverse of transformDeltaX().
   *
   * @param {number} x
   * @returns {number}
   */
  inverseDeltaX( x ) {
    return this.inverseDelta3( new Vector3( x, 0, 0 ) ).x;
  }

  /**
   * Returns the y-coordinate difference for two inverse-transformed vectors, which add the y-coordinate difference of the input
   * y (and same x,z values) beforehand.
   * @public
   *
   * This is the inverse of transformDeltaY().
   *
   * @param {number} y
   * @returns {number}
   */
  inverseDeltaY( y ) {
    return this.inverseDelta3( new Vector3( 0, y, 0 ) ).y;
  }

  /**
   * Returns the z-coordinate difference for two inverse-transformed vectors, which add the z-coordinate difference of the input
   * z (and same x,y values) beforehand.
   * @public
   *
   * This is the inverse of transformDeltaZ().
   *
   * @param {number} z
   * @returns {number}
   */
  inverseDeltaZ( z ) {
    return this.inverseDelta3( new Vector3( 0, 0, z ) ).z;
  }

  /**
   * Returns an inverse-transformed ray.
   * @public
   *
   * This is the inverse of transformRay()
   *
   * @param {Ray3} ray
   * @returns {Ray3}
   */
  inverseRay( ray ) {
    return new Ray3(
      this.inversePosition3( ray.position ),
      this.inversePosition3( ray.position.plus( ray.direction ) ).minus( this.inversePosition3( ray.position ) )
    );
  }
}

dot.register( 'Transform4', Transform4 );

export default Transform4;