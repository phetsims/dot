// Copyright 2013-2021, University of Colorado Boulder

/**
 * Basic 4-dimensional vector, represented as (x,y).
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import Poolable from '../../phet-core/js/Poolable.js';
import Utils from './Utils.js';
import Vector3 from './Vector3.js';
import dot from './dot.js';

class Vector4 {
  /**
   * Creates a 4-dimensional vector with the specified X, Y, Z and W values.
   * @public
   *
   * @param {number} x - X coordinate
   * @param {number} y - Y coordinate
   * @param {number} z - Z coordinate
   * @param {number} w - W coordinate
   */
  constructor( x, y, z, w ) {

    assert && assert( typeof x === 'number', 'x needs to be a number' );
    assert && assert( typeof y === 'number', 'y needs to be a number' );
    assert && assert( typeof z === 'number', 'z needs to be a number' );
    assert && assert( typeof w === 'number', 'w needs to be a number' );

    // @public {number} - The X coordinate of the vector.
    this.x = x;

    // @public {number} - The Y coordinate of the vector.
    this.y = y;

    // @public {number} - The Z coordinate of the vector.
    this.z = z;

    // @public {number} - The W coordinate of the vector. Default is 1, for ease with homogeneous coordinates.
    this.w = w;
  }


  /**
   * The magnitude (Euclidean/L2 Norm) of this vector, i.e. $\sqrt{x^2+y^2+z^2+w^2}$.
   * @public
   *
   * @returns {number}
   */
  getMagnitude() {
    return Math.sqrt( this.magnitudeSquared );
  }

  get magnitude() {
    return this.getMagnitude();
  }

  /**
   * The squared magnitude (square of the Euclidean/L2 Norm) of this vector, i.e. $x^2+y^2+z^2+w^2$.
   * @public
   *
   * @returns {number}
   */
  getMagnitudeSquared() {
    return this.dot( this );
  }

  get magnitudeSquared() {
    return this.getMagnitudeSquared();
  }

  /**
   * The Euclidean distance between this vector (treated as a point) and another point.
   * @public
   *
   * @param {Vector4} point
   * @returns {number}
   */
  distance( point ) {
    return this.minus( point ).magnitude;
  }

  /**
   * The Euclidean distance between this vector (treated as a point) and another point (x,y,z,w).
   * @public
   *
   * @param {number} x
   * @param {number} y
   * @param {number} z
   * @param {number} w
   * @returns {number}
   */
  distanceXYZW( x, y, z, w ) {
    const dx = this.x - x;
    const dy = this.y - y;
    const dz = this.z - z;
    const dw = this.w - w;
    return Math.sqrt( dx * dx + dy * dy + dz * dz + dw * dw );
  }

  /**
   * The squared Euclidean distance between this vector (treated as a point) and another point.
   * @public
   *
   * @param {Vector4} point
   * @returns {number}
   */
  distanceSquared( point ) {
    return this.minus( point ).magnitudeSquared;
  }

  /**
   * The squared Euclidean distance between this vector (treated as a point) and another point (x,y,z,w).
   * @public
   *
   * @param {number} x
   * @param {number} y
   * @param {number} z
   * @param {number} w
   * @returns {number}
   */
  distanceSquaredXYZW( x, y, z, w ) {
    const dx = this.x - x;
    const dy = this.y - y;
    const dz = this.z - z;
    const dw = this.w - w;
    return dx * dx + dy * dy + dz * dz + dw * dw;
  }

  /**
   * The dot-product (Euclidean inner product) between this vector and another vector v.
   * @public
   *
   * @param {Vector4} v
   * @returns {number}
   */
  dot( v ) {
    return this.x * v.x + this.y * v.y + this.z * v.z + this.w * v.w;
  }

  /**
   * The dot-product (Euclidean inner product) between this vector and another vector (x,y,z,w).
   * @public
   *
   * @param {number} x
   * @param {number} y
   * @param {number} z
   * @param {number} w
   * @returns {number}
   */
  dotXYZW( x, y, z, w ) {
    return this.x * x + this.y * y + this.z * z + this.w * w;
  }

  /**
   * The angle between this vector and another vector, in the range $\theta\in[0, \pi]$.
   * @public
   *
   * Equal to $\theta = \cos^{-1}( \hat{u} \cdot \hat{v} )$ where $\hat{u}$ is this vector (normalized) and $\hat{v}$
   * is the input vector (normalized).
   *
   * @param {Vector4} v
   * @returns {number}
   */
  angleBetween( v ) {
    return Math.acos( dot.clamp( this.normalized().dot( v.normalized() ), -1, 1 ) );
  }

  /**
   * Exact equality comparison between this vector and another vector.
   * @public
   *
   * @param {Vector4} other
   * @returns {boolean} - Whether the two vectors have equal components
   */
  equals( other ) {
    return this.x === other.x && this.y === other.y && this.z === other.z && this.w === other.w;
  }

  /**
   * Approximate equality comparison between this vector and another vector.
   * @public
   *
   * @param {Vector4} other
   * @param {number} epsilon
   * @returns {boolean} - Whether difference between the two vectors has no component with an absolute value greater
   *                      than epsilon.
   */
  equalsEpsilon( other, epsilon ) {
    if ( !epsilon ) {
      epsilon = 0;
    }
    return Math.abs( this.x - other.x ) + Math.abs( this.y - other.y ) + Math.abs( this.z - other.z ) + Math.abs( this.w - other.w ) <= epsilon;
  }

  /**
   * Returns false if any component is NaN, infinity, or -infinity. Otherwise returns true.
   * @public
   *
   * @returns {boolean}
   */
  isFinite() {
    return isFinite( this.x ) && isFinite( this.y ) && isFinite( this.z ) && isFinite( this.w );
  }

  /*---------------------------------------------------------------------------*
   * Immutables
   *---------------------------------------------------------------------------*/

  /**
   * Creates a copy of this vector, or if a vector is passed in, set that vector's values to ours.
   * @public
   *
   * This is the immutable form of the function set(), if a vector is provided. This will return a new vector, and
   * will not modify this vector.
   *
   * @param {Vector4} [vector] - If not provided, creates a new Vector4 with filled in values. Otherwise, fills in the
   *                             values of the provided vector so that it equals this vector.
   * @returns {Vector4}
   */
  copy( vector ) {
    if ( vector ) {
      return vector.set( this );
    }
    else {
      return new Vector4( this.x, this.y, this.z, this.w );
    }
  }

  /**
   * Normalized (re-scaled) copy of this vector such that its magnitude is 1. If its initial magnitude is zero, an
   * error is thrown.
   * @public
   *
   * This is the immutable form of the function normalize(). This will return a new vector, and will not modify this
   * vector.
   *
   * @returns {Vector4}
   */
  normalized() {
    const magnitude = this.magnitude;
    assert && assert( magnitude !== 0, 'Cannot normalize a zero-magnitude vector' );
    return this.dividedScalar( magnitude );
  }

  /**
   * Returns a copy of this vector with each component rounded by Utils.roundSymmetric.
   * @public
   *
   * This is the immutable form of the function roundSymmetric(). This will return a new vector, and will not modify
   * this vector.
   *
   * @returns {Vector2}
   */
  roundedSymmetric() {
    return this.copy().roundSymmetric();
  }

  /**
   * Re-scaled copy of this vector such that it has the desired magnitude. If its initial magnitude is zero, an error
   * is thrown. If the passed-in magnitude is negative, the direction of the resulting vector will be reversed.
   * @public
   *
   * This is the immutable form of the function setMagnitude(). This will return a new vector, and will not modify
   * this vector.
   *
   * @param {number} magnitude
   * @returns {Vector4}
   */
  withMagnitude( magnitude ) {
    return this.copy().setMagnitude( magnitude );
  }

  /**
   * Copy of this vector, scaled by the desired scalar value.
   * @public
   *
   * This is the immutable form of the function multiplyScalar(). This will return a new vector, and will not modify
   * this vector.
   *
   * @param {number} scalar
   * @returns {Vector4}
   */
  timesScalar( scalar ) {
    return new Vector4( this.x * scalar, this.y * scalar, this.z * scalar, this.w * scalar );
  }

  /**
   * Same as timesScalar.
   * @public
   *
   * This is the immutable form of the function multiply(). This will return a new vector, and will not modify
   * this vector.
   *
   * @param {number} scalar
   * @returns {Vector4}
   */
  times( scalar ) {
    // make sure it's not a vector!
    assert && assert( scalar.dimension === undefined );
    return this.timesScalar( scalar );
  }

  /**
   * Copy of this vector, multiplied component-wise by the passed-in vector v.
   * @public
   *
   * This is the immutable form of the function componentMultiply(). This will return a new vector, and will not modify
   * this vector.
   *
   * @param {Vector4} v
   * @returns {Vector4}
   */
  componentTimes( v ) {
    return new Vector4( this.x * v.x, this.y * v.y, this.z * v.z, this.w * v.w );
  }

  /**
   * Addition of this vector and another vector, returning a copy.
   * @public
   *
   * This is the immutable form of the function add(). This will return a new vector, and will not modify
   * this vector.
   *
   * @param {Vector4} v
   * @returns {Vector4}
   */
  plus( v ) {
    return new Vector4( this.x + v.x, this.y + v.y, this.z + v.z, this.w + v.w );
  }

  /**
   * Addition of this vector and another vector (x,y,z,w), returning a copy.
   * @public
   *
   * This is the immutable form of the function addXYZW(). This will return a new vector, and will not modify
   * this vector.
   *
   * @param {number} x
   * @param {number} y
   * @param {number} z
   * @param {number} w
   * @returns {Vector4}
   */
  plusXYZW( x, y, z, w ) {
    return new Vector4( this.x + x, this.y + y, this.z + z, this.w + w );
  }

  /**
   * Addition of this vector with a scalar (adds the scalar to every component), returning a copy.
   * @public
   *
   * This is the immutable form of the function addScalar(). This will return a new vector, and will not modify
   * this vector.
   *
   * @param {number} scalar
   * @returns {Vector4}
   */
  plusScalar( scalar ) {
    return new Vector4( this.x + scalar, this.y + scalar, this.z + scalar, this.w + scalar );
  }

  /**
   * Subtraction of this vector by another vector v, returning a copy.
   * @public
   *
   * This is the immutable form of the function subtract(). This will return a new vector, and will not modify
   * this vector.
   *
   * @param {Vector4} v
   * @returns {Vector4}
   */
  minus( v ) {
    return new Vector4( this.x - v.x, this.y - v.y, this.z - v.z, this.w - v.w );
  }

  /**
   * Subtraction of this vector by another vector (x,y,z,w), returning a copy.
   * @public
   *
   * This is the immutable form of the function subtractXYZW(). This will return a new vector, and will not modify
   * this vector.
   *
   * @param {number} x
   * @param {number} y
   * @param {number} z
   * @param {number} w
   * @returns {Vector4}
   */
  minusXYZW( x, y, z, w ) {
    return new Vector4( this.x - x, this.y - y, this.z - z, this.w - w );
  }

  /**
   * Subtraction of this vector by a scalar (subtracts the scalar from every component), returning a copy.
   * @public
   *
   * This is the immutable form of the function subtractScalar(). This will return a new vector, and will not modify
   * this vector.
   *
   * @param {number} scalar
   * @returns {Vector4}
   */
  minusScalar( scalar ) {
    return new Vector4( this.x - scalar, this.y - scalar, this.z - scalar, this.w - scalar );
  }

  /**
   * Division of this vector by a scalar (divides every component by the scalar), returning a copy.
   * @public
   *
   * This is the immutable form of the function divideScalar(). This will return a new vector, and will not modify
   * this vector.
   *
   * @param {number} scalar
   * @returns {Vector4}
   */
  dividedScalar( scalar ) {
    return new Vector4( this.x / scalar, this.y / scalar, this.z / scalar, this.w / scalar );
  }

  /**
   * Negated copy of this vector (multiplies every component by -1).
   * @public
   *
   * This is the immutable form of the function negate(). This will return a new vector, and will not modify
   * this vector.
   *
   * @returns {Vector4}
   */
  negated() {
    return new Vector4( -this.x, -this.y, -this.z, -this.w );
  }

  /**
   * A linear interpolation between this vector (ratio=0) and another vector (ratio=1).
   * @public
   *
   * @param {Vector4} vector
   * @param {number} ratio - Not necessarily constrained in [0, 1]
   * @returns {Vector4}
   */
  blend( vector, ratio ) {
    return this.plus( vector.minus( this ).times( ratio ) );
  }

  /**
   * The average (midpoint) between this vector and another vector.
   * @public
   *
   * @param {Vector4} vector
   * @returns {Vector4}
   */
  average( vector ) {
    return this.blend( vector, 0.5 );
  }

  /**
   * Debugging string for the vector.
   * @public
   *
   * @returns {string}
   */
  toString() {
    return `Vector4(${this.x}, ${this.y}, ${this.z}, ${this.w})`;
  }

  /**
   * Converts this to a 3-dimensional vector, discarding the w-component.
   * @public
   *
   * @returns {Vector3}
   */
  toVector3() {
    return new Vector3( this.x, this.y, this.z );
  }

  /*---------------------------------------------------------------------------*
   * Mutables
   * - all mutation should go through setXYZW / setX / setY / setZ / setW
   *---------------------------------------------------------------------------*/

  /**
   * Sets all of the components of this vector, returning this.
   * @public
   *
   * @param {number} x
   * @param {number} y
   * @param {number} z
   * @param {number} w
   * @returns {Vector4}
   */
  setXYZW( x, y, z, w ) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
    return this;
  }

  /**
   * Sets the x-component of this vector, returning this.
   * @public
   *
   * @param {number} x
   * @returns {Vector4}
   */
  setX( x ) {
    this.x = x;
    return this;
  }

  /**
   * Sets the y-component of this vector, returning this.
   * @public
   *
   * @param {number} y
   * @returns {Vector4}
   */
  setY( y ) {
    this.y = y;
    return this;
  }

  /**
   * Sets the z-component of this vector, returning this.
   * @public
   *
   * @param {number} z
   * @returns {Vector4}
   */
  setZ( z ) {
    this.z = z;
    return this;
  }

  /**
   * Sets the w-component of this vector, returning this.
   * @public
   *
   * @param {number} w
   * @returns {Vector4}
   */
  setW( w ) {
    this.w = w;
    return this;
  }

  /**
   * Sets this vector to be a copy of another vector.
   * @public
   *
   * This is the mutable form of the function copy(). This will mutate (change) this vector, in addition to returning
   * this vector itself.
   *
   * @param {Vector4} v
   * @returns {Vector4}
   */
  set( v ) {
    return this.setXYZW( v.x, v.y, v.z, v.w );
  }

  /**
   * Sets the magnitude of this vector. If the passed-in magnitude is negative, this flips the vector and sets its
   * magnitude to abs( magnitude ).
   * @public
   *
   * This is the mutable form of the function withMagnitude(). This will mutate (change) this vector, in addition to
   * returning this vector itself.
   *
   * @param {number} magnitude
   * @returns {Vector4}
   */
  setMagnitude( magnitude ) {
    const scale = magnitude / this.magnitude;
    return this.multiplyScalar( scale );
  }

  /**
   * Adds another vector to this vector, changing this vector.
   * @public
   *
   * This is the mutable form of the function plus(). This will mutate (change) this vector, in addition to
   * returning this vector itself.
   *
   * @param {Vector4} v
   * @returns {Vector4}
   */
  add( v ) {
    return this.setXYZW( this.x + v.x, this.y + v.y, this.z + v.z, this.w + v.w );
  }

  /**
   * Adds another vector (x,y,z,w) to this vector, changing this vector.
   * @public
   *
   * This is the mutable form of the function plusXYZW(). This will mutate (change) this vector, in addition to
   * returning this vector itself.
   *
   * @param {number} x
   * @param {number} y
   * @param {number} z
   * @param {number} w
   * @returns {Vector4}
   */
  addXYZW( x, y, z, w ) {
    return this.setXYZW( this.x + x, this.y + y, this.z + z, this.w + w );
  }

  /**
   * Adds a scalar to this vector (added to every component), changing this vector.
   * @public
   *
   * This is the mutable form of the function plusScalar(). This will mutate (change) this vector, in addition to
   * returning this vector itself.
   *
   * @param {number} scalar
   * @returns {Vector4}
   */
  addScalar( scalar ) {
    return this.setXYZW( this.x + scalar, this.y + scalar, this.z + scalar, this.w + scalar );
  }

  /**
   * Subtracts this vector by another vector, changing this vector.
   * @public
   *
   * This is the mutable form of the function minus(). This will mutate (change) this vector, in addition to
   * returning this vector itself.
   *
   * @param {Vector4} v
   * @returns {Vector4}
   */
  subtract( v ) {
    return this.setXYZW( this.x - v.x, this.y - v.y, this.z - v.z, this.w - v.w );
  }

  /**
   * Subtracts this vector by another vector (x,y,z,w), changing this vector.
   * @public
   *
   * This is the mutable form of the function minusXYZW(). This will mutate (change) this vector, in addition to
   * returning this vector itself.
   *
   * @param {number} x
   * @param {number} y
   * @param {number} z
   * @param {number} w
   * @returns {Vector4}
   */
  subtractXYZW( x, y, z, w ) {
    return this.setXYZW( this.x - x, this.y - y, this.z - z, this.w - w );
  }

  /**
   * Subtracts this vector by a scalar (subtracts each component by the scalar), changing this vector.
   * @public
   *
   * This is the mutable form of the function minusScalar(). This will mutate (change) this vector, in addition to
   * returning this vector itself.
   *
   * @param {number} scalar
   * @returns {Vector4}
   */
  subtractScalar( scalar ) {
    return this.setXYZW( this.x - scalar, this.y - scalar, this.z - scalar, this.w - scalar );
  }

  /**
   * Multiplies this vector by a scalar (multiplies each component by the scalar), changing this vector.
   * @public
   *
   * This is the mutable form of the function timesScalar(). This will mutate (change) this vector, in addition to
   * returning this vector itself.
   *
   * @param {number} scalar
   * @returns {Vector4}
   */
  multiplyScalar( scalar ) {
    return this.setXYZW( this.x * scalar, this.y * scalar, this.z * scalar, this.w * scalar );
  }

  /**
   * Multiplies this vector by a scalar (multiplies each component by the scalar), changing this vector.
   * Same as multiplyScalar.
   * @public
   *
   * This is the mutable form of the function times(). This will mutate (change) this vector, in addition to
   * returning this vector itself.
   *
   * @param {number} scalar
   * @returns {Vector4}
   */
  multiply( scalar ) {
    // make sure it's not a vector!
    assert && assert( scalar.dimension === undefined );
    return this.multiplyScalar( scalar );
  }

  /**
   * Multiplies this vector by another vector component-wise, changing this vector.
   * @public
   *
   * This is the mutable form of the function componentTimes(). This will mutate (change) this vector, in addition to
   * returning this vector itself.
   *
   * @param {Vector4} v
   * @returns {Vector4}
   */
  componentMultiply( v ) {
    return this.setXYZW( this.x * v.x, this.y * v.y, this.z * v.z, this.w * v.w );
  }

  /**
   * Divides this vector by a scalar (divides each component by the scalar), changing this vector.
   * @public
   *
   * This is the mutable form of the function dividedScalar(). This will mutate (change) this vector, in addition to
   * returning this vector itself.
   *
   * @param {number} scalar
   * @returns {Vector4}
   */
  divideScalar( scalar ) {
    return this.setXYZW( this.x / scalar, this.y / scalar, this.z / scalar, this.w / scalar );
  }

  /**
   * Negates this vector (multiplies each component by -1), changing this vector.
   * @public
   *
   * This is the mutable form of the function negated(). This will mutate (change) this vector, in addition to
   * returning this vector itself.
   *
   * @returns {Vector4}
   */
  negate() {
    return this.setXYZW( -this.x, -this.y, -this.z, -this.w );
  }

  /**
   * Normalizes this vector (rescales to where the magnitude is 1), changing this vector.
   * @public
   *
   * This is the mutable form of the function normalized(). This will mutate (change) this vector, in addition to
   * returning this vector itself.
   *
   * @returns {Vector4}
   */
  normalize() {
    const mag = this.magnitude;
    if ( mag === 0 ) {
      throw new Error( 'Cannot normalize a zero-magnitude vector' );
    }
    return this.divideScalar( mag );
  }

  /**
   * Rounds each component of this vector with Utils.roundSymmetric.
   * @public
   *
   * This is the mutable form of the function roundedSymmetric(). This will mutate (change) this vector, in addition
   * to returning the vector itself.
   *
   * @returns {Vector4}
   */
  roundSymmetric() {
    return this.setXYZW( Utils.roundSymmetric( this.x ), Utils.roundSymmetric( this.y ), Utils.roundSymmetric( this.z ), Utils.roundSymmetric( this.w ) );
  }
}

// @public (read-only) - Helps to identify the dimension of the vector
Vector4.prototype.isVector4 = true;
Vector4.prototype.dimension = 4;

dot.register( 'Vector4', Vector4 );

// Sets up pooling on Vector4
Poolable.mixInto( Vector4, {
  initialize: Vector4.prototype.setXYZW,
  defaultArguments: [ 0, 0, 0, 0 ]
} );

class ImmutableVector4 extends Vector4 {
  /**
   * Throw errors whenever a mutable method is called on our immutable vector
   * @public
   *
   * @param {*} mutableFunctionName
   */
  static mutableOverrideHelper( mutableFunctionName ) {
    ImmutableVector4.prototype[ mutableFunctionName ] = () => {
      throw new Error( `Cannot call mutable method '${mutableFunctionName}' on immutable Vector4` );
    };
  }
}

// TODO: better way to handle this list?
ImmutableVector4.mutableOverrideHelper( 'setXYZW' );
ImmutableVector4.mutableOverrideHelper( 'setX' );
ImmutableVector4.mutableOverrideHelper( 'setY' );
ImmutableVector4.mutableOverrideHelper( 'setZ' );
ImmutableVector4.mutableOverrideHelper( 'setW' );

// @public {Vector4} - helpful immutable constants
Vector4.ZERO = assert ? new ImmutableVector4( 0, 0, 0, 0 ) : new Vector4( 0, 0, 0, 0 );
Vector4.X_UNIT = assert ? new ImmutableVector4( 1, 0, 0, 0 ) : new Vector4( 1, 0, 0, 0 );
Vector4.Y_UNIT = assert ? new ImmutableVector4( 0, 1, 0, 0 ) : new Vector4( 0, 1, 0, 0 );
Vector4.Z_UNIT = assert ? new ImmutableVector4( 0, 0, 1, 0 ) : new Vector4( 0, 0, 1, 0 );
Vector4.W_UNIT = assert ? new ImmutableVector4( 0, 0, 0, 1 ) : new Vector4( 0, 0, 0, 1 );

export default Vector4;