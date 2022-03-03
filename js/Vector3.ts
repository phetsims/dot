// Copyright 2013-2022, University of Colorado Boulder

/**
 * Basic 3-dimensional vector, represented as (x,y,z).
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import Pool, { IPoolable } from '../../phet-core/js/Pool.js';
import IOType from '../../tandem/js/types/IOType.js';
import NumberIO from '../../tandem/js/types/NumberIO.js';
import dot from './dot.js';
import Utils from './Utils.js';
import Vector2, { v2 } from './Vector2.js';
import Vector4, { v4 } from './Vector4.js';

type Vector3StateObject = {
  x: number;
  y: number;
  z: number;
};

class Vector3 implements IPoolable {

  // The X coordinate of the vector.
  x: number;

  // The Y coordinate of the vector.
  y: number;

  // The Z coordinate of the vector.
  z: number;

  /**
   * Creates a 3-dimensional vector with the specified X, Y and Z values.
   *
   * @param x - X coordinate
   * @param y - Y coordinate
   * @param z - Z coordinate
   */
  constructor( x: number, y: number, z: number ) {

    assert && assert( typeof x === 'number', 'x needs to be a number' );
    assert && assert( typeof y === 'number', 'y needs to be a number' );
    assert && assert( typeof z === 'number', 'z needs to be a number' );

    this.x = x;
    this.y = y;
    this.z = z;
  }


  /**
   * The magnitude (Euclidean/L2 Norm) of this vector, i.e. $\sqrt{x^2+y^2+z^2}$.
   */
  getMagnitude(): number {
    return Math.sqrt( this.magnitudeSquared );
  }

  get magnitude(): number {
    return this.getMagnitude();
  }

  /**
   * T squared magnitude (square of the Euclidean/L2 Norm) of this vector, i.e. $x^2+y^2+z^2$.
   */
  getMagnitudeSquared(): number {
    return this.dot( this as unknown as Vector3 );
  }

  get magnitudeSquared(): number {
    return this.getMagnitudeSquared();
  }

  /**
   * The Euclidean distance between this vector (treated as a point) and another point.
   */
  distance( point: Vector3 ): number {
    return Math.sqrt( this.distanceSquared( point ) );
  }

  /**
   * The Euclidean distance between this vector (treated as a point) and another point (x,y,z).
   */
  distanceXYZ( x: number, y: number, z: number ): number {
    const dx = this.x - x;
    const dy = this.y - y;
    const dz = this.z - z;
    return Math.sqrt( dx * dx + dy * dy + dz * dz );
  }

  /**
   * The squared Euclidean distance between this vector (treated as a point) and another point.
   */
  distanceSquared( point: Vector3 ): number {
    const dx = this.x - point.x;
    const dy = this.y - point.y;
    const dz = this.z - point.z;
    return dx * dx + dy * dy + dz * dz;
  }

  /**
   * The squared Euclidean distance between this vector (treated as a point) and another point (x,y,z).
   */
  distanceSquaredXYZ( x: number, y: number, z: number ): number {
    const dx = this.x - x;
    const dy = this.y - y;
    const dz = this.z - z;
    return dx * dx + dy * dy + dz * dz;
  }

  /**
   * The dot-product (Euclidean inner product) between this vector and another vector v.
   */
  dot( v: Vector3 ): number {
    return this.x * v.x + this.y * v.y + this.z * v.z;
  }

  /**
   * The dot-product (Euclidean inner product) between this vector and another vector (x,y,z).
   */
  dotXYZ( x: number, y: number, z: number ): number {
    return this.x * x + this.y * y + this.z * z;
  }

  /**
   * The angle between this vector and another vector, in the range $\theta\in[0, \pi]$.
   *
   * Equal to $\theta = \cos^{-1}( \hat{u} \cdot \hat{v} )$ where $\hat{u}$ is this vector (normalized) and $\hat{v}$
   * is the input vector (normalized).
   */
  angleBetween( v: Vector3 ): number {
    // @ts-ignore TODO: import with circular protection
    return Math.acos( dot.clamp( this.normalized().dot( v.normalized() ), -1, 1 ) );
  }

  /**
   * Exact equality comparison between this vector and another vector.
   *
   * @returns - Whether the two vectors have equal components
   */
  equals( other: Vector3 ): boolean {
    return this.x === other.x && this.y === other.y && this.z === other.z;
  }

  /**
   * Approximate equality comparison between this vector and another vector.
   *
   * @returns - Whether difference between the two vectors has no component with an absolute value greater
   *                      than epsilon.
   */
  equalsEpsilon( other: Vector3, epsilon: number ): boolean {
    if ( !epsilon ) {
      epsilon = 0;
    }
    return Math.abs( this.x - other.x ) + Math.abs( this.y - other.y ) + Math.abs( this.z - other.z ) <= epsilon;
  }

  /**
   * Returns false if any component is NaN, infinity, or -infinity. Otherwise returns true.
   */
  isFinite(): boolean {
    return isFinite( this.x ) && isFinite( this.y ) && isFinite( this.z );
  }

  /*---------------------------------------------------------------------------*
   * Immutables
   *---------------------------------------------------------------------------*/

  /**
   * Creates a copy of this vector, or if a vector is passed in, set that vector's values to ours.
   *
   * This is the immutable form of the function set(), if a vector is provided. This will return a new vector, and
   * will not modify this vector.
   *
   * @param [vector] - If not provided, creates a new Vector3 with filled in values. Otherwise, fills in the
   *                   values of the provided vector so that it equals this vector.
   */
  copy( vector?: Vector3 ): Vector3 {
    if ( vector ) {
      return vector.set( this as unknown as Vector3 );
    }
    else {
      return v3( this.x, this.y, this.z );
    }
  }

  /**
   * The Euclidean 3-dimensional cross-product of this vector by the passed-in vector.
   */
  cross( v: Vector3 ): Vector3 {
    return v3(
      this.y * v.z - this.z * v.y,
      this.z * v.x - this.x * v.z,
      this.x * v.y - this.y * v.x
    );
  }

  /**
   * Normalized (re-scaled) copy of this vector such that its magnitude is 1. If its initial magnitude is zero, an
   * error is thrown.
   *
   * This is the immutable form of the function normalize(). This will return a new vector, and will not modify this
   * vector.
   */
  normalized(): Vector3 {
    const mag = this.magnitude;
    if ( mag === 0 ) {
      throw new Error( 'Cannot normalize a zero-magnitude vector' );
    }
    else {
      return v3( this.x / mag, this.y / mag, this.z / mag );
    }
  }

  /**
   *
   * This is the immutable form of the function roundSymmetric(). This will return a new vector, and will not modify
   * this vector.
   */
  roundedSymmetric(): Vector3 {
    return this.copy().roundSymmetric();
  }

  /**
   * Re-scaled copy of this vector such that it has the desired magnitude. If its initial magnitude is zero, an error
   * is thrown. If the passed-in magnitude is negative, the direction of the resulting vector will be reversed.
   *
   * This is the immutable form of the function setMagnitude(). This will return a new vector, and will not modify
   * this vector.
   */
  withMagnitude( magnitude: number ): Vector3 {
    return this.copy().setMagnitude( magnitude );
  }

  /**
   * Copy of this vector, scaled by the desired scalar value.
   *
   * This is the immutable form of the function multiplyScalar(). This will return a new vector, and will not modify
   * this vector.
   */
  timesScalar( scalar: number ): Vector3 {
    return v3( this.x * scalar, this.y * scalar, this.z * scalar );
  }

  /**
   * Same as timesScalar.
   *
   * This is the immutable form of the function multiply(). This will return a new vector, and will not modify
   * this vector.
   */
  times( scalar: number ): Vector3 {
    // make sure it's not a vector!
    assert && assert( typeof scalar === 'number' );
    return this.timesScalar( scalar );
  }

  /**
   * Copy of this vector, multiplied component-wise by the passed-in vector v.
   *
   * This is the immutable form of the function componentMultiply(). This will return a new vector, and will not modify
   * this vector.
   */
  componentTimes( v: Vector3 ): Vector3 {
    return v3( this.x * v.x, this.y * v.y, this.z * v.z );
  }

  /**
   * Addition of this vector and another vector, returning a copy.
   *
   * This is the immutable form of the function add(). This will return a new vector, and will not modify
   * this vector.
   */
  plus( v: Vector3 ): Vector3 {
    return v3( this.x + v.x, this.y + v.y, this.z + v.z );
  }

  /**
   * Addition of this vector and another vector (x,y,z), returning a copy.
   *
   * This is the immutable form of the function addXYZ(). This will return a new vector, and will not modify
   * this vector.
   */
  plusXYZ( x: number, y: number, z: number ): Vector3 {
    return v3( this.x + x, this.y + y, this.z + z );
  }

  /**
   * Addition of this vector with a scalar (adds the scalar to every component), returning a copy.
   *
   * This is the immutable form of the function addScalar(). This will return a new vector, and will not modify
   * this vector.
   */
  plusScalar( scalar: number ): Vector3 {
    return v3( this.x + scalar, this.y + scalar, this.z + scalar );
  }

  /**
   * Subtraction of this vector by another vector v, returning a copy.
   *
   * This is the immutable form of the function subtract(). This will return a new vector, and will not modify
   * this vector.
   */
  minus( v: Vector3 ): Vector3 {
    return v3( this.x - v.x, this.y - v.y, this.z - v.z );
  }

  /**
   * Subtraction of this vector by another vector (x,y,z), returning a copy.
   *
   * This is the immutable form of the function subtractXYZ(). This will return a new vector, and will not modify
   * this vector.
   */
  minusXYZ( x: number, y: number, z: number ): Vector3 {
    return v3( this.x - x, this.y - y, this.z - z );
  }

  /**
   * Subtraction of this vector by a scalar (subtracts the scalar from every component), returning a copy.
   *
   * This is the immutable form of the function subtractScalar(). This will return a new vector, and will not modify
   * this vector.
   */
  minusScalar( scalar: number ): Vector3 {
    return v3( this.x - scalar, this.y - scalar, this.z - scalar );
  }

  /**
   * Division of this vector by a scalar (divides every component by the scalar), returning a copy.
   *
   * This is the immutable form of the function divideScalar(). This will return a new vector, and will not modify
   * this vector.
   */
  dividedScalar( scalar: number ): Vector3 {
    return v3( this.x / scalar, this.y / scalar, this.z / scalar );
  }

  /**
   * Negated copy of this vector (multiplies every component by -1).
   *
   * This is the immutable form of the function negate(). This will return a new vector, and will not modify
   * this vector.
   *
   */
  negated(): Vector3 {
    return v3( -this.x, -this.y, -this.z );
  }

  /**
   * A linear interpolation between this vector (ratio=0) and another vector (ratio=1).
   *
   * @param vector
   * @param ratio - Not necessarily constrained in [0, 1]
   */
  blend( vector: Vector3, ratio: number ): Vector3 {
    return this.plus( vector.minus( this as unknown as Vector3 ).times( ratio ) );
  }

  /**
   * The average (midpoint) between this vector and another vector.
   */
  average( vector: Vector3 ): Vector3 {
    return this.blend( vector, 0.5 );
  }

  /**
   * Debugging string for the vector.
   */
  toString(): string {
    return `Vector3(${this.x}, ${this.y}, ${this.z})`;
  }

  /**
   * Converts this to a 2-dimensional vector, discarding the z-component.
   */
  toVector2(): Vector2 {
    return v2( this.x, this.y );
  }

  /**
   * Converts this to a 4-dimensional vector, with the w-component equal to 1 (useful for homogeneous coordinates).
   */
  toVector4(): Vector4 {
    return v4( this.x, this.y, this.z, 1 );
  }

  /*---------------------------------------------------------------------------*
   * Mutables
   * - all mutation should go through setXYZ / setX / setY / setZ
   *---------------------------------------------------------------------------*/

  /**
   * Sets all of the components of this vector, returning this.
   */
  setXYZ( x: number, y: number, z: number ): Vector3 {
    this.x = x;
    this.y = y;
    this.z = z;
    return this as unknown as Vector3;
  }

  /**
   * Sets the x-component of this vector, returning this.
   */
  setX( x: number ): Vector3 {
    this.x = x;
    return this as unknown as Vector3;
  }

  /**
   * Sets the y-component of this vector, returning this.
   */
  setY( y: number ): Vector3 {
    this.y = y;
    return this as unknown as Vector3;
  }

  /**
   * Sets the z-component of this vector, returning this.
   */
  setZ( z: number ): Vector3 {
    this.z = z;
    return this as unknown as Vector3;
  }

  /**
   * Sets this vector to be a copy of another vector.
   *
   * This is the mutable form of the function copy(). This will mutate (change) this vector, in addition to returning
   * this vector itself.
   */
  set( v: Vector3 ): Vector3 {
    return this.setXYZ( v.x, v.y, v.z );
  }

  /**
   * Sets the magnitude of this vector. If the passed-in magnitude is negative, this flips the vector and sets its
   * magnitude to abs( magnitude ).
   *
   * This is the mutable form of the function withMagnitude(). This will mutate (change) this vector, in addition to
   * returning this vector itself.
   */
  setMagnitude( magnitude: number ): Vector3 {
    const scale = magnitude / this.magnitude;
    return this.multiplyScalar( scale );
  }

  /**
   * Adds another vector to this vector, changing this vector.
   *
   * This is the mutable form of the function plus(). This will mutate (change) this vector, in addition to
   * returning this vector itself.
   */
  add( v: Vector3 ): Vector3 {
    return this.setXYZ( this.x + v.x, this.y + v.y, this.z + v.z );
  }

  /**
   * Adds another vector (x,y,z) to this vector, changing this vector.
   *
   * This is the mutable form of the function plusXYZ(). This will mutate (change) this vector, in addition to
   * returning this vector itself.
   */
  addXYZ( x: number, y: number, z: number ): Vector3 {
    return this.setXYZ( this.x + x, this.y + y, this.z + z );
  }

  /**
   * Adds a scalar to this vector (added to every component), changing this vector.
   *
   * This is the mutable form of the function plusScalar(). This will mutate (change) this vector, in addition to
   * returning this vector itself.
   */
  addScalar( scalar: number ): Vector3 {
    return this.setXYZ( this.x + scalar, this.y + scalar, this.z + scalar );
  }

  /**
   * Subtracts this vector by another vector, changing this vector.
   *
   * This is the mutable form of the function minus(). This will mutate (change) this vector, in addition to
   * returning this vector itself.
   */
  subtract( v: Vector3 ): Vector3 {
    return this.setXYZ( this.x - v.x, this.y - v.y, this.z - v.z );
  }

  /**
   * Subtracts this vector by another vector (x,y,z), changing this vector.
   *
   * This is the mutable form of the function minusXYZ(). This will mutate (change) this vector, in addition to
   * returning this vector itself.
   */
  subtractXYZ( x: number, y: number, z: number ): Vector3 {
    return this.setXYZ( this.x - x, this.y - y, this.z - z );
  }

  /**
   * Subtracts this vector by a scalar (subtracts each component by the scalar), changing this vector.
   *
   * This is the mutable form of the function minusScalar(). This will mutate (change) this vector, in addition to
   * returning this vector itself.
   */
  subtractScalar( scalar: number ): Vector3 {
    return this.setXYZ( this.x - scalar, this.y - scalar, this.z - scalar );
  }

  /**
   * Multiplies this vector by a scalar (multiplies each component by the scalar), changing this vector.
   *
   * This is the mutable form of the function timesScalar(). This will mutate (change) this vector, in addition to
   * returning this vector itself.
   */
  multiplyScalar( scalar: number ): Vector3 {
    return this.setXYZ( this.x * scalar, this.y * scalar, this.z * scalar );
  }

  /**
   * Multiplies this vector by a scalar (multiplies each component by the scalar), changing this vector.
   * Same as multiplyScalar.
   *
   * This is the mutable form of the function times(). This will mutate (change) this vector, in addition to
   * returning this vector itself.
   */
  multiply( scalar: number ): Vector3 {
    // make sure it's not a vector!
    assert && assert( typeof scalar === 'number' );
    return this.multiplyScalar( scalar );
  }

  /**
   * Multiplies this vector by another vector component-wise, changing this vector.
   *
   * This is the mutable form of the function componentTimes(). This will mutate (change) this vector, in addition to
   * returning this vector itself.
   */
  componentMultiply( v: Vector3 ): Vector3 {
    return this.setXYZ( this.x * v.x, this.y * v.y, this.z * v.z );
  }

  /**
   * Divides this vector by a scalar (divides each component by the scalar), changing this vector.
   *
   * This is the mutable form of the function dividedScalar(). This will mutate (change) this vector, in addition to
   * returning this vector itself.
   */
  divideScalar( scalar: number ): Vector3 {
    return this.setXYZ( this.x / scalar, this.y / scalar, this.z / scalar );
  }

  /**
   * Negates this vector (multiplies each component by -1), changing this vector.
   *
   * This is the mutable form of the function negated(). This will mutate (change) this vector, in addition to
   * returning this vector itself.
   */
  negate(): Vector3 {
    return this.setXYZ( -this.x, -this.y, -this.z );
  }

  /**
   * Sets our value to the Euclidean 3-dimensional cross-product of this vector by the passed-in vector.
   */
  setCross( v: Vector3 ): Vector3 {
    return this.setXYZ(
      this.y * v.z - this.z * v.y,
      this.z * v.x - this.x * v.z,
      this.x * v.y - this.y * v.x
    );
  }

  /**
   * Normalizes this vector (rescales to where the magnitude is 1), changing this vector.
   *
   * This is the mutable form of the function normalized(). This will mutate (change) this vector, in addition to
   * returning this vector itself.
   */
  normalize(): Vector3 {
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
   *
   * This is the mutable form of the function roundedSymmetric(). This will mutate (change) this vector, in addition
   * to returning the vector itself.
   */
  roundSymmetric(): Vector3 {
    return this.setXYZ( Utils.roundSymmetric( this.x ), Utils.roundSymmetric( this.y ), Utils.roundSymmetric( this.z ) );
  }

  /**
   * Returns a duck-typed object meant for use with tandem/phet-io serialization.
   */
  toStateObject(): Vector3StateObject {
    return {
      x: NumberIO.toStateObject( this.x ),
      y: NumberIO.toStateObject( this.y ),
      z: NumberIO.toStateObject( this.z )
    };
  }

  freeToPool() {
    Vector3.pool.freeToPool( this );
  }

  static pool = new Pool( Vector3, {
    maxSize: 1000,
    initialize: Vector3.prototype.setXYZ,
    defaultArguments: [ 0, 0, 0 ]
  } );

  // static methods

  /**
   * Spherical linear interpolation between two unit vectors.
   *
   * @param start - Start unit vector
   * @param end - End unit vector
   * @param ratio  - Between 0 (at start vector) and 1 (at end vector)
   * @returns Spherical linear interpolation between the start and end
   */
  static slerp( start: Vector3, end: Vector3, ratio: number ): Vector3 {
    // NOTE: we can't create a require() loop here
    // @ts-ignore TODO: import with circular protection
    return dot.Quaternion.slerp( new dot.Quaternion(), dot.Quaternion.getRotationQuaternion( start, end ), ratio ).timesVector3( start );
  }

  /**
   * Constructs a Vector3 from a duck-typed object, for use with tandem/phet-io deserialization.
   */
  static fromStateObject( stateObject: Vector3StateObject ): Vector3 {
    return v3(
      NumberIO.fromStateObject( stateObject.x ),
      NumberIO.fromStateObject( stateObject.y ),
      NumberIO.fromStateObject( stateObject.z )
    );
  }

  isVector3!: boolean;
  dimension!: number;
  static ZERO: Vector3;
  static X_UNIT: Vector3;
  static Y_UNIT: Vector3;
  static Z_UNIT: Vector3;
  static Vector3IO: IOType;
}

// @public (read-only) - Helps to identify the dimension of the vector
Vector3.prototype.isVector3 = true;
Vector3.prototype.dimension = 3;

dot.register( 'Vector3', Vector3 );

const v3 = Vector3.pool.create.bind( Vector3.pool );
dot.register( 'v3', v3 );

class ImmutableVector3 extends Vector3 {
  /**
   * Throw errors whenever a mutable method is called on our immutable vector
   */
  static mutableOverrideHelper( mutableFunctionName: 'setX' | 'setY' | 'setZ' | 'setXYZ' ) {
    ImmutableVector3.prototype[ mutableFunctionName ] = () => {
      throw new Error( `Cannot call mutable method '${mutableFunctionName}' on immutable Vector3` );
    };
  }
}

ImmutableVector3.mutableOverrideHelper( 'setXYZ' );
ImmutableVector3.mutableOverrideHelper( 'setX' );
ImmutableVector3.mutableOverrideHelper( 'setY' );
ImmutableVector3.mutableOverrideHelper( 'setZ' );

Vector3.ZERO = assert ? new ImmutableVector3( 0, 0, 0 ) : new Vector3( 0, 0, 0 );
Vector3.X_UNIT = assert ? new ImmutableVector3( 1, 0, 0 ) : new Vector3( 1, 0, 0 );
Vector3.Y_UNIT = assert ? new ImmutableVector3( 0, 1, 0 ) : new Vector3( 0, 1, 0 );
Vector3.Z_UNIT = assert ? new ImmutableVector3( 0, 0, 1 ) : new Vector3( 0, 0, 1 );

Vector3.Vector3IO = new IOType( 'Vector3IO', {
  valueType: Vector3,
  documentation: 'Basic 3-dimensional vector, represented as (x,y,z)',
  toStateObject: ( vector3: Vector3 ) => vector3.toStateObject(),
  fromStateObject: Vector3.fromStateObject,
  stateSchema: {
    x: NumberIO,
    y: NumberIO,
    z: NumberIO
  }
} );

export default Vector3;
export { v3 };
