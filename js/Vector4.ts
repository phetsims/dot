// Copyright 2013-2021, University of Colorado Boulder

/**
 * Basic 4-dimensional vector, represented as (x,y).
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import Poolable, { PoolableVersion } from '../../phet-core/js/Poolable.js';
import Utils from './Utils.js';
import Vector3 from './Vector3.js';
import dot from './dot.js';

class Vector4 {

  // The X coordinate of the vector.
  x: number;

  // The Y coordinate of the vector.
  y: number;

  // The Z coordinate of the vector.
  z: number;

  // The W coordinate of the vector.
  w: number;

  /**
   * Creates a 4-dimensional vector with the specified X, Y, Z and W values.
   *
   * @param x - X coordinate
   * @param y - Y coordinate
   * @param z - Z coordinate
   * @param w - W coordinate
   */
  constructor( x: number, y: number, z: number, w: number ) {

    assert && assert( typeof x === 'number', 'x needs to be a number' );
    assert && assert( typeof y === 'number', 'y needs to be a number' );
    assert && assert( typeof z === 'number', 'z needs to be a number' );
    assert && assert( typeof w === 'number', 'w needs to be a number' );

    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
  }


  /**
   * The magnitude (Euclidean/L2 Norm) of this vector, i.e. $\sqrt{x^2+y^2+z^2+w^2}$.
   */
  getMagnitude(): number {
    return Math.sqrt( this.magnitudeSquared );
  }

  get magnitude(): number {
    return this.getMagnitude();
  }

  /**
   * The squared magnitude (square of the Euclidean/L2 Norm) of this vector, i.e. $x^2+y^2+z^2+w^2$.
   */
  getMagnitudeSquared(): number {
    return this.dot( this as unknown as PoolableVector4 );
  }

  get magnitudeSquared(): number {
    return this.getMagnitudeSquared();
  }

  /**
   * The Euclidean distance between this vector (treated as a point) and another point.
   */
  distance( point: PoolableVector4 ): number {
    return this.minus( point ).magnitude;
  }

  /**
   * The Euclidean distance between this vector (treated as a point) and another point (x,y,z,w).
   */
  distanceXYZW( x: number, y: number, z: number, w: number ): number {
    const dx = this.x - x;
    const dy = this.y - y;
    const dz = this.z - z;
    const dw = this.w - w;
    return Math.sqrt( dx * dx + dy * dy + dz * dz + dw * dw );
  }

  /**
   * The squared Euclidean distance between this vector (treated as a point) and another point.
   */
  distanceSquared( point: PoolableVector4 ): number {
    return this.minus( point ).magnitudeSquared;
  }

  /**
   * The squared Euclidean distance between this vector (treated as a point) and another point (x,y,z,w).
   */
  distanceSquaredXYZW( x: number, y: number, z: number, w: number ): number {
    const dx = this.x - x;
    const dy = this.y - y;
    const dz = this.z - z;
    const dw = this.w - w;
    return dx * dx + dy * dy + dz * dz + dw * dw;
  }

  /**
   * The dot-product (Euclidean inner product) between this vector and another vector v.
   */
  dot( v: PoolableVector4 ): number {
    return this.x * v.x + this.y * v.y + this.z * v.z + this.w * v.w;
  }

  /**
   * The dot-product (Euclidean inner product) between this vector and another vector (x,y,z,w).
   */
  dotXYZW( x: number, y: number, z: number, w: number ): number {
    return this.x * x + this.y * y + this.z * z + this.w * w;
  }

  /**
   * The angle between this vector and another vector, in the range $\theta\in[0, \pi]$.
   *
   * Equal to $\theta = \cos^{-1}( \hat{u} \cdot \hat{v} )$ where $\hat{u}$ is this vector (normalized) and $\hat{v}$
   * is the input vector (normalized).
   */
  angleBetween( v: PoolableVector4 ): number {
    // @ts-ignore TODO: import with circular protection
    return Math.acos( dot.clamp( this.normalized().dot( v.normalized() ), -1, 1 ) );
  }

  /**
   * Exact equality comparison between this vector and another vector.
   *
   * @param other
   * @returns - Whether the two vectors have equal components
   */
  equals( other: PoolableVector4 ): boolean {
    return this.x === other.x && this.y === other.y && this.z === other.z && this.w === other.w;
  }

  /**
   * Approximate equality comparison between this vector and another vector.
   *
   * @returns - Whether difference between the two vectors has no component with an absolute value greater
   *                      than epsilon.
   */
  equalsEpsilon( other: PoolableVector4, epsilon: number ): boolean {
    if ( !epsilon ) {
      epsilon = 0;
    }
    return Math.abs( this.x - other.x ) + Math.abs( this.y - other.y ) + Math.abs( this.z - other.z ) + Math.abs( this.w - other.w ) <= epsilon;
  }

  /**
   * Returns false if any component is NaN, infinity, or -infinity. Otherwise returns true.
   */
  isFinite(): boolean {
    return isFinite( this.x ) && isFinite( this.y ) && isFinite( this.z ) && isFinite( this.w );
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
   * @param  [vector] - If not provided, creates a PoolableVector4.createFromPool with filled in values. Otherwise, fills in the
   *                    values of the provided vector so that it equals this vector.
   */
  copy( vector?: PoolableVector4 ): PoolableVector4 {
    if ( vector ) {
      return vector.set( this as unknown as PoolableVector4 );
    }
    else {
      return PoolableVector4.createFromPool( this.x, this.y, this.z, this.w );
    }
  }

  /**
   * Normalized (re-scaled) copy of this vector such that its magnitude is 1. If its initial magnitude is zero, an
   * error is thrown.
   *
   * This is the immutable form of the function normalize(). This will return a new vector, and will not modify this
   * vector.
   */
  normalized(): PoolableVector4 {
    const magnitude = this.magnitude;
    assert && assert( magnitude !== 0, 'Cannot normalize a zero-magnitude vector' );
    return this.dividedScalar( magnitude );
  }

  /**
   * Returns a copy of this vector with each component rounded by Utils.roundSymmetric.
   *
   * This is the immutable form of the function roundSymmetric(). This will return a new vector, and will not modify
   * this vector.
   */
  roundedSymmetric(): PoolableVector4 {
    return this.copy().roundSymmetric();
  }

  /**
   * Re-scaled copy of this vector such that it has the desired magnitude. If its initial magnitude is zero, an error
   * is thrown. If the passed-in magnitude is negative, the direction of the resulting vector will be reversed.
   *
   * This is the immutable form of the function setMagnitude(). This will return a new vector, and will not modify
   * this vector.
   *
   */
  withMagnitude( magnitude: number ): PoolableVector4 {
    return this.copy().setMagnitude( magnitude );
  }

  /**
   * Copy of this vector, scaled by the desired scalar value.
   *
   * This is the immutable form of the function multiplyScalar(). This will return a new vector, and will not modify
   * this vector.
   *
   * @param {number} scalar
   */
  timesScalar( scalar: number ): PoolableVector4 {
    return PoolableVector4.createFromPool( this.x * scalar, this.y * scalar, this.z * scalar, this.w * scalar );
  }

  /**
   * Same as timesScalar.
   *
   * This is the immutable form of the function multiply(). This will return a new vector, and will not modify
   * this vector.
   */
  times( scalar: number ): PoolableVector4 {
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
  componentTimes( v: PoolableVector4 ): PoolableVector4 {
    return PoolableVector4.createFromPool( this.x * v.x, this.y * v.y, this.z * v.z, this.w * v.w );
  }

  /**
   * Addition of this vector and another vector, returning a copy.
   *
   * This is the immutable form of the function add(). This will return a new vector, and will not modify
   * this vector.
   */
  plus( v: PoolableVector4 ): PoolableVector4 {
    return PoolableVector4.createFromPool( this.x + v.x, this.y + v.y, this.z + v.z, this.w + v.w );
  }

  /**
   * Addition of this vector and another vector (x,y,z,w), returning a copy.
   *
   * This is the immutable form of the function addXYZW(). This will return a new vector, and will not modify
   * this vector.
   */
  plusXYZW( x: number, y: number, z: number, w: number ): PoolableVector4 {
    return PoolableVector4.createFromPool( this.x + x, this.y + y, this.z + z, this.w + w );
  }

  /**
   * Addition of this vector with a scalar (adds the scalar to every component), returning a copy.
   *
   * This is the immutable form of the function addScalar(). This will return a new vector, and will not modify
   * this vector.
   */
  plusScalar( scalar: number ): PoolableVector4 {
    return PoolableVector4.createFromPool( this.x + scalar, this.y + scalar, this.z + scalar, this.w + scalar );
  }

  /**
   * Subtraction of this vector by another vector v, returning a copy.
   *
   * This is the immutable form of the function subtract(). This will return a new vector, and will not modify
   * this vector.
   */
  minus( v: PoolableVector4 ): PoolableVector4 {
    return PoolableVector4.createFromPool( this.x - v.x, this.y - v.y, this.z - v.z, this.w - v.w );
  }

  /**
   * Subtraction of this vector by another vector (x,y,z,w), returning a copy.
   *
   * This is the immutable form of the function subtractXYZW(). This will return a new vector, and will not modify
   * this vector.
   */
  minusXYZW( x: number, y: number, z: number, w: number ): PoolableVector4 {
    return PoolableVector4.createFromPool( this.x - x, this.y - y, this.z - z, this.w - w );
  }

  /**
   * Subtraction of this vector by a scalar (subtracts the scalar from every component), returning a copy.
   *
   * This is the immutable form of the function subtractScalar(). This will return a new vector, and will not modify
   * this vector.
   */
  minusScalar( scalar: number ): PoolableVector4 {
    return PoolableVector4.createFromPool( this.x - scalar, this.y - scalar, this.z - scalar, this.w - scalar );
  }

  /**
   * Division of this vector by a scalar (divides every component by the scalar), returning a copy.
   *
   * This is the immutable form of the function divideScalar(). This will return a new vector, and will not modify
   * this vector.
   */
  dividedScalar( scalar: number ): PoolableVector4 {
    return PoolableVector4.createFromPool( this.x / scalar, this.y / scalar, this.z / scalar, this.w / scalar );
  }

  /**
   * Negated copy of this vector (multiplies every component by -1).
   *
   * This is the immutable form of the function negate(). This will return a new vector, and will not modify
   * this vector.
   *
   */
  negated(): PoolableVector4 {
    return PoolableVector4.createFromPool( -this.x, -this.y, -this.z, -this.w );
  }

  /**
   * A linear interpolation between this vector (ratio=0) and another vector (ratio=1).
   *
   * @param vector
   * @param ratio - Not necessarily constrained in [0, 1]
   */
  blend( vector: PoolableVector4, ratio: number ): PoolableVector4 {
    return this.plus( vector.minus( this as unknown as PoolableVector4 ).times( ratio ) );
  }

  /**
   * The average (midpoint) between this vector and another vector.
   */
  average( vector: PoolableVector4 ): PoolableVector4 {
    return this.blend( vector, 0.5 );
  }

  /**
   * Debugging string for the vector.
   */
  toString(): string {
    return `Vector4(${this.x}, ${this.y}, ${this.z}, ${this.w})`;
  }

  /**
   * Converts this to a 3-dimensional vector, discarding the w-component.
   */
  toVector3(): Vector3 {
    return new Vector3( this.x, this.y, this.z );
  }

  /*---------------------------------------------------------------------------*
   * Mutables
   * - all mutation should go through setXYZW / setX / setY / setZ / setW
   *---------------------------------------------------------------------------*/

  /**
   * Sets all of the components of this vector, returning this.
   */
  setXYZW( x: number, y: number, z: number, w: number ): PoolableVector4 {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
    return this as unknown as PoolableVector4;
  }

  /**
   * Sets the x-component of this vector, returning this.
   */
  setX( x: number ): PoolableVector4 {
    this.x = x;
    return this as unknown as PoolableVector4;
  }

  /**
   * Sets the y-component of this vector, returning this.
   */
  setY( y: number ): PoolableVector4 {
    this.y = y;
    return this as unknown as PoolableVector4;
  }

  /**
   * Sets the z-component of this vector, returning this.
   */
  setZ( z: number ): PoolableVector4 {
    this.z = z;
    return this as unknown as PoolableVector4;
  }

  /**
   * Sets the w-component of this vector, returning this.
   */
  setW( w: number ): PoolableVector4 {
    this.w = w;
    return this as unknown as PoolableVector4;
  }

  /**
   * Sets this vector to be a copy of another vector.
   *
   * This is the mutable form of the function copy(). This will mutate (change) this vector, in addition to returning
   * this vector itself.
   */
  set( v: PoolableVector4 ): PoolableVector4 {
    return this.setXYZW( v.x, v.y, v.z, v.w );
  }

  /**
   * Sets the magnitude of this vector. If the passed-in magnitude is negative, this flips the vector and sets its
   * magnitude to abs( magnitude ).
   *
   * This is the mutable form of the function withMagnitude(). This will mutate (change) this vector, in addition to
   * returning this vector itself.
   */
  setMagnitude( magnitude: number ): PoolableVector4 {
    const scale = magnitude / this.magnitude;
    return this.multiplyScalar( scale );
  }

  /**
   * Adds another vector to this vector, changing this vector.
   *
   * This is the mutable form of the function plus(). This will mutate (change) this vector, in addition to
   * returning this vector itself.
   */
  add( v: PoolableVector4 ): PoolableVector4 {
    return this.setXYZW( this.x + v.x, this.y + v.y, this.z + v.z, this.w + v.w );
  }

  /**
   * Adds another vector (x,y,z,w) to this vector, changing this vector.
   *
   * This is the mutable form of the function plusXYZW(). This will mutate (change) this vector, in addition to
   * returning this vector itself.
   */
  addXYZW( x: number, y: number, z: number, w: number ): PoolableVector4 {
    return this.setXYZW( this.x + x, this.y + y, this.z + z, this.w + w );
  }

  /**
   * Adds a scalar to this vector (added to every component), changing this vector.
   *
   * This is the mutable form of the function plusScalar(). This will mutate (change) this vector, in addition to
   * returning this vector itself.
   */
  addScalar( scalar: number ): PoolableVector4 {
    return this.setXYZW( this.x + scalar, this.y + scalar, this.z + scalar, this.w + scalar );
  }

  /**
   * Subtracts this vector by another vector, changing this vector.
   *
   * This is the mutable form of the function minus(). This will mutate (change) this vector, in addition to
   * returning this vector itself.
   */
  subtract( v: PoolableVector4 ): PoolableVector4 {
    return this.setXYZW( this.x - v.x, this.y - v.y, this.z - v.z, this.w - v.w );
  }

  /**
   * Subtracts this vector by another vector (x,y,z,w), changing this vector.
   *
   * This is the mutable form of the function minusXYZW(). This will mutate (change) this vector, in addition to
   * returning this vector itself.
   */
  subtractXYZW( x: number, y: number, z: number, w: number ): PoolableVector4 {
    return this.setXYZW( this.x - x, this.y - y, this.z - z, this.w - w );
  }

  /**
   * Subtracts this vector by a scalar (subtracts each component by the scalar), changing this vector.
   *
   * This is the mutable form of the function minusScalar(). This will mutate (change) this vector, in addition to
   * returning this vector itself.
   */
  subtractScalar( scalar: number ): PoolableVector4 {
    return this.setXYZW( this.x - scalar, this.y - scalar, this.z - scalar, this.w - scalar );
  }

  /**
   * Multiplies this vector by a scalar (multiplies each component by the scalar), changing this vector.
   *
   * This is the mutable form of the function timesScalar(). This will mutate (change) this vector, in addition to
   * returning this vector itself.
   */
  multiplyScalar( scalar: number ): PoolableVector4 {
    return this.setXYZW( this.x * scalar, this.y * scalar, this.z * scalar, this.w * scalar );
  }

  /**
   * Multiplies this vector by a scalar (multiplies each component by the scalar), changing this vector.
   * Same as multiplyScalar.
   *
   * This is the mutable form of the function times(). This will mutate (change) this vector, in addition to
   * returning this vector itself.
   */
  multiply( scalar: number ): PoolableVector4 {
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
  componentMultiply( v: PoolableVector4 ): PoolableVector4 {
    return this.setXYZW( this.x * v.x, this.y * v.y, this.z * v.z, this.w * v.w );
  }

  /**
   * Divides this vector by a scalar (divides each component by the scalar), changing this vector.
   *
   * This is the mutable form of the function dividedScalar(). This will mutate (change) this vector, in addition to
   * returning this vector itself.
   */
  divideScalar( scalar: number ): PoolableVector4 {
    return this.setXYZW( this.x / scalar, this.y / scalar, this.z / scalar, this.w / scalar );
  }

  /**
   * Negates this vector (multiplies each component by -1), changing this vector.
   *
   * This is the mutable form of the function negated(). This will mutate (change) this vector, in addition to
   * returning this vector itself.
   */
  negate(): PoolableVector4 {
    return this.setXYZW( -this.x, -this.y, -this.z, -this.w );
  }

  /**
   * Normalizes this vector (rescales to where the magnitude is 1), changing this vector.
   *
   * This is the mutable form of the function normalized(). This will mutate (change) this vector, in addition to
   * returning this vector itself.
   */
  normalize(): PoolableVector4 {
    const mag = this.magnitude;
    if ( mag === 0 ) {
      throw new Error( 'Cannot normalize a zero-magnitude vector' );
    }
    return this.divideScalar( mag );
  }

  /**
   * Rounds each component of this vector with Utils.roundSymmetric.
   *
   * This is the mutable form of the function roundedSymmetric(). This will mutate (change) this vector, in addition
   * to returning the vector itself.
   */
  roundSymmetric(): PoolableVector4 {
    return this.setXYZW( Utils.roundSymmetric( this.x ), Utils.roundSymmetric( this.y ), Utils.roundSymmetric( this.z ), Utils.roundSymmetric( this.w ) );
  }

  isVector4!: boolean;
  dimension!: number;
  static ZERO: PoolableVector4;
  static X_UNIT: PoolableVector4;
  static Y_UNIT: PoolableVector4;
  static Z_UNIT: PoolableVector4;
  static W_UNIT: PoolableVector4;
}

// @public (read-only) - Helps to identify the dimension of the vector
Vector4.prototype.isVector4 = true;
Vector4.prototype.dimension = 4;

dot.register( 'Vector4', Vector4 );

type PoolableVector4 = PoolableVersion<typeof Vector4>;
const PoolableVector4 = Poolable.mixInto( Vector4, { // eslint-disable-line
  maxSize: 1000,
  initialize: Vector4.prototype.setXYZW,
  defaultArguments: [ 0, 0, 0, 0 ]
} );

class ImmutableVector4 extends PoolableVector4 {
  /**
   * Throw errors whenever a mutable method is called on our immutable vector
   */
  static mutableOverrideHelper( mutableFunctionName: 'setX' | 'setY' | 'setZ' | 'setW' | 'setXYZW' ) {
    ImmutableVector4.prototype[ mutableFunctionName ] = () => {
      throw new Error( `Cannot call mutable method '${mutableFunctionName}' on immutable Vector3` );
    };
  }
}

ImmutableVector4.mutableOverrideHelper( 'setXYZW' );
ImmutableVector4.mutableOverrideHelper( 'setX' );
ImmutableVector4.mutableOverrideHelper( 'setY' );
ImmutableVector4.mutableOverrideHelper( 'setZ' );
ImmutableVector4.mutableOverrideHelper( 'setW' );

Vector4.ZERO = assert ? new ImmutableVector4( 0, 0, 0, 0 ) : new PoolableVector4( 0, 0, 0, 0 );
Vector4.X_UNIT = assert ? new ImmutableVector4( 1, 0, 0, 0 ) : new PoolableVector4( 1, 0, 0, 0 );
Vector4.Y_UNIT = assert ? new ImmutableVector4( 0, 1, 0, 0 ) : new PoolableVector4( 0, 1, 0, 0 );
Vector4.Z_UNIT = assert ? new ImmutableVector4( 0, 0, 1, 0 ) : new PoolableVector4( 0, 0, 1, 0 );
Vector4.W_UNIT = assert ? new ImmutableVector4( 0, 0, 0, 1 ) : new PoolableVector4( 0, 0, 0, 1 );

export default PoolableVector4;
export { Vector4 as RawVector4 };
