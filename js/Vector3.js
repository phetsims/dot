// Copyright 2013-2021, University of Colorado Boulder

/**
 * Basic 3-dimensional vector, represented as (x,y,z).
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import Poolable from '../../phet-core/js/Poolable.js';
import IOType from '../../tandem/js/types/IOType.js';
import NumberIO from '../../tandem/js/types/NumberIO.js';
import dot from './dot.js';
import Utils from './Utils.js';
import Vector2 from './Vector2.js';
import Vector4 from './Vector4.js';

class Vector3 {
  /**
   * Creates a 3-dimensional vector with the specified X, Y and Z values.
   * @public
   *
   * @param {number} x - X coordinate
   * @param {number} y - Y coordinate
   * @param {number} z - Z coordinate
   */
  constructor( x, y, z ) {

    assert && assert( typeof x === 'number', 'x needs to be a number' );
    assert && assert( typeof y === 'number', 'y needs to be a number' );
    assert && assert( typeof z === 'number', 'z needs to be a number' );

    // @public {number} - The X coordinate of the vector.
    this.x = x;

    // @public {number} - The Y coordinate of the vector.
    this.y = y;

    // @public {number} - The Z coordinate of the vector.
    this.z = z;
  }


  /**
   * The magnitude (Euclidean/L2 Norm) of this vector, i.e. $\sqrt{x^2+y^2+z^2}$.
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
   * T squared magnitude (square of the Euclidean/L2 Norm) of this vector, i.e. $x^2+y^2+z^2$.
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
   * @param {Vector3} point
   * @returns {number}
   */
  distance( point ) {
    return Math.sqrt( this.distanceSquared( point ) );
  }

  /**
   * The Euclidean distance between this vector (treated as a point) and another point (x,y,z).
   * @public
   *
   * @param {number} x
   * @param {number} y
   * @param {number} z
   * @returns {number}
   */
  distanceXYZ( x, y, z ) {
    const dx = this.x - x;
    const dy = this.y - y;
    const dz = this.z - z;
    return Math.sqrt( dx * dx + dy * dy + dz * dz );
  }

  /**
   * The squared Euclidean distance between this vector (treated as a point) and another point.
   * @public
   *
   * @param {Vector3} point
   * @returns {number}
   */
  distanceSquared( point ) {
    const dx = this.x - point.x;
    const dy = this.y - point.y;
    const dz = this.z - point.z;
    return dx * dx + dy * dy + dz * dz;
  }

  /**
   * The squared Euclidean distance between this vector (treated as a point) and another point (x,y,z).
   * @public
   *
   * @param {number} x
   * @param {number} y
   * @param {number} z
   * @returns {number}
   */
  distanceSquaredXYZ( x, y, z ) {
    const dx = this.x - x;
    const dy = this.y - y;
    const dz = this.z - z;
    return dx * dx + dy * dy + dz * dz;
  }

  /**
   * The dot-product (Euclidean inner product) between this vector and another vector v.
   * @public
   *
   * @param {Vector3} v
   * @returns {number}
   */
  dot( v ) {
    return this.x * v.x + this.y * v.y + this.z * v.z;
  }

  /**
   * The dot-product (Euclidean inner product) between this vector and another vector (x,y,z).
   * @public
   *
   * @param {number} x
   * @param {number} y
   * @param {number} z
   * @returns {number}
   */
  dotXYZ( x, y, z ) {
    return this.x * x + this.y * y + this.z * z;
  }

  /**
   * The angle between this vector and another vector, in the range $\theta\in[0, \pi]$.
   * @public
   *
   * Equal to $\theta = \cos^{-1}( \hat{u} \cdot \hat{v} )$ where $\hat{u}$ is this vector (normalized) and $\hat{v}$
   * is the input vector (normalized).
   *
   * @param {Vector3} v
   * @returns {number}
   */
  angleBetween( v ) {
    return Math.acos( dot.clamp( this.normalized().dot( v.normalized() ), -1, 1 ) );
  }

  /**
   * Exact equality comparison between this vector and another vector.
   * @public
   *
   * @param {Vector3} other
   * @returns {boolean} - Whether the two vectors have equal components
   */
  equals( other ) {
    return this.x === other.x && this.y === other.y && this.z === other.z;
  }

  /**
   * Approximate equality comparison between this vector and another vector.
   * @public
   *
   * @param {Vector3} other
   * @param {number} epsilon
   * @returns {boolean} - Whether difference between the two vectors has no component with an absolute value greater
   *                      than epsilon.
   */
  equalsEpsilon( other, epsilon ) {
    if ( !epsilon ) {
      epsilon = 0;
    }
    return Math.abs( this.x - other.x ) + Math.abs( this.y - other.y ) + Math.abs( this.z - other.z ) <= epsilon;
  }

  /**
   * Returns false if any component is NaN, infinity, or -infinity. Otherwise returns true.
   * @public
   *
   * @returns {boolean}
   */
  isFinite() {
    return isFinite( this.x ) && isFinite( this.y ) && isFinite( this.z );
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
   * @param {Vector3} [vector] - If not provided, creates a new Vector3 with filled in values. Otherwise, fills in the
   *                             values of the provided vector so that it equals this vector.
   * @returns {Vector3}
   */
  copy( vector ) {
    if ( vector ) {
      return vector.set( this );
    }
    else {
      return new Vector3( this.x, this.y, this.z );
    }
  }

  /**
   * The Euclidean 3-dimensional cross-product of this vector by the passed-in vector.
   * @public
   *
   * @param {Vector3} v
   * @returns {Vector3}
   */
  cross( v ) {
    return new Vector3(
      this.y * v.z - this.z * v.y,
      this.z * v.x - this.x * v.z,
      this.x * v.y - this.y * v.x
    );
  }

  /**
   * Normalized (re-scaled) copy of this vector such that its magnitude is 1. If its initial magnitude is zero, an
   * error is thrown.
   * @public
   *
   * This is the immutable form of the function normalize(). This will return a new vector, and will not modify this
   * vector.
   *
   * @returns {Vector3}
   */
  normalized() {
    const mag = this.magnitude;
    if ( mag === 0 ) {
      throw new Error( 'Cannot normalize a zero-magnitude vector' );
    }
    else {
      return new Vector3( this.x / mag, this.y / mag, this.z / mag );
    }
  }

  /**
   * Returns a copy of this vector with each component rounded by Utils.roundSymmetric.
   * @public
   *
   * This is the immutable form of the function roundSymmetric(). This will return a new vector, and will not modify
   * this vector.
   *
   * @returns {Vector3}
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
   * @returns {Vector3}
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
   * @returns {Vector3}
   */
  timesScalar( scalar ) {
    return new Vector3( this.x * scalar, this.y * scalar, this.z * scalar );
  }

  /**
   * Same as timesScalar.
   * @public
   *
   * This is the immutable form of the function multiply(). This will return a new vector, and will not modify
   * this vector.
   *
   * @param {number} scalar
   * @returns {Vector3}
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
   * @param {Vector3} v
   * @returns {Vector3}
   */
  componentTimes( v ) {
    return new Vector3( this.x * v.x, this.y * v.y, this.z * v.z );
  }

  /**
   * Addition of this vector and another vector, returning a copy.
   * @public
   *
   * This is the immutable form of the function add(). This will return a new vector, and will not modify
   * this vector.
   *
   * @param {Vector3} v
   * @returns {Vector3}
   */
  plus( v ) {
    return new Vector3( this.x + v.x, this.y + v.y, this.z + v.z );
  }

  /**
   * Addition of this vector and another vector (x,y,z), returning a copy.
   * @public
   *
   * This is the immutable form of the function addXYZ(). This will return a new vector, and will not modify
   * this vector.
   *
   * @param {number} x
   * @param {number} y
   * @param {number} z
   * @returns {Vector3}
   */
  plusXYZ( x, y, z ) {
    return new Vector3( this.x + x, this.y + y, this.z + z );
  }

  /**
   * Addition of this vector with a scalar (adds the scalar to every component), returning a copy.
   * @public
   *
   * This is the immutable form of the function addScalar(). This will return a new vector, and will not modify
   * this vector.
   *
   * @param {number} scalar
   * @returns {Vector3}
   */
  plusScalar( scalar ) {
    return new Vector3( this.x + scalar, this.y + scalar, this.z + scalar );
  }

  /**
   * Subtraction of this vector by another vector v, returning a copy.
   * @public
   *
   * This is the immutable form of the function subtract(). This will return a new vector, and will not modify
   * this vector.
   *
   * @param {Vector3} v
   * @returns {Vector3}
   */
  minus( v ) {
    return new Vector3( this.x - v.x, this.y - v.y, this.z - v.z );
  }

  /**
   * Subtraction of this vector by another vector (x,y,z), returning a copy.
   * @public
   *
   * This is the immutable form of the function subtractXYZ(). This will return a new vector, and will not modify
   * this vector.
   *
   * @param {number} x
   * @param {number} y
   * @param {number} z
   * @returns {Vector3}
   */
  minusXYZ( x, y, z ) {
    return new Vector3( this.x - x, this.y - y, this.z - z );
  }

  /**
   * Subtraction of this vector by a scalar (subtracts the scalar from every component), returning a copy.
   * @public
   *
   * This is the immutable form of the function subtractScalar(). This will return a new vector, and will not modify
   * this vector.
   *
   * @param {number} scalar
   * @returns {Vector3}
   */
  minusScalar( scalar ) {
    return new Vector3( this.x - scalar, this.y - scalar, this.z - scalar );
  }

  /**
   * Division of this vector by a scalar (divides every component by the scalar), returning a copy.
   * @public
   *
   * This is the immutable form of the function divideScalar(). This will return a new vector, and will not modify
   * this vector.
   *
   * @param {number} scalar
   * @returns {Vector3}
   */
  dividedScalar( scalar ) {
    return new Vector3( this.x / scalar, this.y / scalar, this.z / scalar );
  }

  /**
   * Negated copy of this vector (multiplies every component by -1).
   * @public
   *
   * This is the immutable form of the function negate(). This will return a new vector, and will not modify
   * this vector.
   *
   * @returns {Vector3}
   */
  negated() {
    return new Vector3( -this.x, -this.y, -this.z );
  }

  /**
   * A linear interpolation between this vector (ratio=0) and another vector (ratio=1).
   * @public
   *
   * @param {Vector3} vector
   * @param {number} ratio - Not necessarily constrained in [0, 1]
   * @returns {Vector3}
   */
  blend( vector, ratio ) {
    return this.plus( vector.minus( this ).times( ratio ) );
  }

  /**
   * The average (midpoint) between this vector and another vector.
   * @public
   *
   * @param {Vector3} vector
   * @returns {Vector3}
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
    return `Vector3(${this.x}, ${this.y}, ${this.z})`;
  }

  /**
   * Converts this to a 2-dimensional vector, discarding the z-component.
   * @public
   *
   * @returns {Vector2}
   */
  toVector2() {
    return new Vector2( this.x, this.y );
  }

  /**
   * Converts this to a 4-dimensional vector, with the w-component equal to 1 (useful for homogeneous coordinates).
   * @public
   *
   * @returns {Vector4}
   */
  toVector4() {
    return new Vector4( this.x, this.y, this.z, 1 );
  }

  /*---------------------------------------------------------------------------*
   * Mutables
   * - all mutation should go through setXYZ / setX / setY / setZ
   *---------------------------------------------------------------------------*/

  /**
   * Sets all of the components of this vector, returning this.
   * @public
   *
   * @param {number} x
   * @param {number} y
   * @param {number} z
   * @returns {Vector3}
   */
  setXYZ( x, y, z ) {
    this.x = x;
    this.y = y;
    this.z = z;
    return this;
  }

  /**
   * Sets the x-component of this vector, returning this.
   * @public
   *
   * @param {number} x
   * @returns {Vector3}
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
   * @returns {Vector3}
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
   * @returns {Vector3}
   */
  setZ( z ) {
    this.z = z;
    return this;
  }

  /**
   * Sets this vector to be a copy of another vector.
   * @public
   *
   * This is the mutable form of the function copy(). This will mutate (change) this vector, in addition to returning
   * this vector itself.
   *
   * @param {Vector3} v
   * @returns {Vector3}
   */
  set( v ) {
    return this.setXYZ( v.x, v.y, v.z );
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
   * @returns {Vector3}
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
   * @param {Vector2} v
   * @returns {Vector2}
   */
  add( v ) {
    return this.setXYZ( this.x + v.x, this.y + v.y, this.z + v.z );
  }

  /**
   * Adds another vector (x,y,z) to this vector, changing this vector.
   * @public
   *
   * This is the mutable form of the function plusXYZ(). This will mutate (change) this vector, in addition to
   * returning this vector itself.
   *
   * @param {number} x
   * @param {number} y
   * @param {number} z
   * @returns {Vector3}
   */
  addXYZ( x, y, z ) {
    return this.setXYZ( this.x + x, this.y + y, this.z + z );
  }

  /**
   * Adds a scalar to this vector (added to every component), changing this vector.
   * @public
   *
   * This is the mutable form of the function plusScalar(). This will mutate (change) this vector, in addition to
   * returning this vector itself.
   *
   * @param {number} scalar
   * @returns {Vector3}
   */
  addScalar( scalar ) {
    return this.setXYZ( this.x + scalar, this.y + scalar, this.z + scalar );
  }

  /**
   * Subtracts this vector by another vector, changing this vector.
   * @public
   *
   * This is the mutable form of the function minus(). This will mutate (change) this vector, in addition to
   * returning this vector itself.
   *
   * @param {Vector3} v
   * @returns {Vector3}
   */
  subtract( v ) {
    return this.setXYZ( this.x - v.x, this.y - v.y, this.z - v.z );
  }

  /**
   * Subtracts this vector by another vector (x,y,z), changing this vector.
   * @public
   *
   * This is the mutable form of the function minusXYZ(). This will mutate (change) this vector, in addition to
   * returning this vector itself.
   *
   * @param {number} x
   * @param {number} y
   * @param {number} z
   * @returns {Vector3}
   */
  subtractXYZ( x, y, z ) {
    return this.setXYZ( this.x - x, this.y - y, this.z - z );
  }

  /**
   * Subtracts this vector by a scalar (subtracts each component by the scalar), changing this vector.
   * @public
   *
   * This is the mutable form of the function minusScalar(). This will mutate (change) this vector, in addition to
   * returning this vector itself.
   *
   * @param {number} scalar
   * @returns {Vector3}
   */
  subtractScalar( scalar ) {
    return this.setXYZ( this.x - scalar, this.y - scalar, this.z - scalar );
  }

  /**
   * Multiplies this vector by a scalar (multiplies each component by the scalar), changing this vector.
   * @public
   *
   * This is the mutable form of the function timesScalar(). This will mutate (change) this vector, in addition to
   * returning this vector itself.
   *
   * @param {number} scalar
   * @returns {Vector3}
   */
  multiplyScalar( scalar ) {
    return this.setXYZ( this.x * scalar, this.y * scalar, this.z * scalar );
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
   * @returns {Vector3}
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
   * @param {Vector3} v
   * @returns {Vector3}
   */
  componentMultiply( v ) {
    return this.setXYZ( this.x * v.x, this.y * v.y, this.z * v.z );
  }

  /**
   * Divides this vector by a scalar (divides each component by the scalar), changing this vector.
   * @public
   *
   * This is the mutable form of the function dividedScalar(). This will mutate (change) this vector, in addition to
   * returning this vector itself.
   *
   * @param {number} scalar
   * @returns {Vector3}
   */
  divideScalar( scalar ) {
    return this.setXYZ( this.x / scalar, this.y / scalar, this.z / scalar );
  }

  /**
   * Negates this vector (multiplies each component by -1), changing this vector.
   * @public
   *
   * This is the mutable form of the function negated(). This will mutate (change) this vector, in addition to
   * returning this vector itself.
   *
   * @returns {Vector3}
   */
  negate() {
    return this.setXYZ( -this.x, -this.y, -this.z );
  }

  /**
   * Sets our value to the Euclidean 3-dimensional cross-product of this vector by the passed-in vector.
   * @public
   *
   * @param {Vector3} v
   * @returns {Vector3}
   */
  setCross( v ) {
    return this.setXYZ(
      this.y * v.z - this.z * v.y,
      this.z * v.x - this.x * v.z,
      this.x * v.y - this.y * v.x
    );
  }

  /**
   * Normalizes this vector (rescales to where the magnitude is 1), changing this vector.
   * @public
   *
   * This is the mutable form of the function normalized(). This will mutate (change) this vector, in addition to
   * returning this vector itself.
   *
   * @returns {Vector3}
   */
  normalize() {
    const mag = this.magnitude;
    if ( mag === 0 ) {
      throw new Error( 'Cannot normalize a zero-magnitude vector' );
    }
    else {
      return this.divideScalar( mag );
    }
  }

  /**
   * Rounds each component of this vector with Utils.roundSymmetric.
   * @public
   *
   * This is the mutable form of the function roundedSymmetric(). This will mutate (change) this vector, in addition
   * to returning the vector itself.
   *
   * @returns {Vector3}
   */
  roundSymmetric() {
    return this.setXYZ( Utils.roundSymmetric( this.x ), Utils.roundSymmetric( this.y ), Utils.roundSymmetric( this.z ) );
  }

  /**
   * Returns a duck-typed object meant for use with tandem/phet-io serialization.
   * @public
   *
   * @returns {{x:number, y:number, z:number}}
   */
  toStateObject() {
    return { x: this.x, y: this.y, z: this.z };
  }

  // static methods

  /**
   * Spherical linear interpolation between two unit vectors.
   * @public
   * @static
   *
   * @param {Vector3} start - Start unit vector
   * @param {Vector3} end - End unit vector
   * @param {number} ratio  - Between 0 (at start vector) and 1 (at end vector)
   * @returns {Vector3} Spherical linear interpolation between the start and end
   */
  static slerp( start, end, ratio ) {
    // NOTE: we can't create a require() loop here
    return dot.Quaternion.slerp( new dot.Quaternion(), dot.Quaternion.getRotationQuaternion( start, end ), ratio ).timesVector3( start );
  }

  /**
   * Constructs a Vector3 from a duck-typed object, for use with tandem/phet-io deserialization.
   * @public
   * @static
   *
   * @param {{x:number, y:number, z:number}} stateObject
   * @returns {Vector3}
   */
  static fromStateObject( stateObject ) {
    return new Vector3( stateObject.x, stateObject.y, stateObject.z );
  }
}

// @public (read-only) - Helps to identify the dimension of the vector
Vector3.prototype.isVector3 = true;
Vector3.prototype.dimension = 3;

dot.register( 'Vector3', Vector3 );

// Sets up pooling on Vector3
Poolable.mixInto( Vector3, {
  initialize: Vector3.prototype.setXYZ,
  defaultArguments: [ 0, 0, 0 ]
} );

class ImmutableVector3 extends Vector3 {
  /**
   * Throw errors whenever a mutable method is called on our immutable vector
   * @public
   *
   * @param {*} mutableFunctionName
   */
  static mutableOverrideHelper( mutableFunctionName ) {
    ImmutableVector3.prototype[ mutableFunctionName ] = () => {
      throw new Error( `Cannot call mutable method '${mutableFunctionName}' on immutable Vector3` );
    };
  }
}

// TODO: better way to handle this list?
ImmutableVector3.mutableOverrideHelper( 'setXYZ' );
ImmutableVector3.mutableOverrideHelper( 'setX' );
ImmutableVector3.mutableOverrideHelper( 'setY' );
ImmutableVector3.mutableOverrideHelper( 'setZ' );

// @public {Vector3} - helpful immutable constants
Vector3.ZERO = assert ? new ImmutableVector3( 0, 0, 0 ) : new Vector3( 0, 0, 0 );
Vector3.X_UNIT = assert ? new ImmutableVector3( 1, 0, 0 ) : new Vector3( 1, 0, 0 );
Vector3.Y_UNIT = assert ? new ImmutableVector3( 0, 1, 0 ) : new Vector3( 0, 1, 0 );
Vector3.Z_UNIT = assert ? new ImmutableVector3( 0, 0, 1 ) : new Vector3( 0, 0, 1 );

Vector3.Vector3IO = new IOType( 'Vector3IO', {
  valueType: Vector3,
  documentation: 'Basic 3-dimensional vector, represented as (x,y,z)',
  toStateObject: vector3 => vector3.toStateObject(),
  fromStateObject: Vector3.fromStateObject,
  stateSchema: {
    x: NumberIO,
    y: NumberIO,
    z: NumberIO
  }
} );

export default Vector3;