// Copyright 2013-2023, University of Colorado Boulder

/**
 * Basic 4-dimensional vector, represented as (x,y).
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import Utils from './Utils.js';
import Vector3 from './Vector3.js';
import dot from './dot.js';
import Pool, { TPoolable } from '../../phet-core/js/Pool.js';

export default class Vector4 implements TPoolable {

  // The X coordinate of the vector.
  public x: number;

  // The Y coordinate of the vector.
  public y: number;

  // The Z coordinate of the vector.
  public z: number;

  // The W coordinate of the vector.
  public w: number;

  /**
   * Creates a 4-dimensional vector with the specified X, Y, Z and W values.
   *
   * @param x - X coordinate
   * @param y - Y coordinate
   * @param z - Z coordinate
   * @param w - W coordinate
   */
  public constructor( x: number, y: number, z: number, w: number ) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
  }


  /**
   * The magnitude (Euclidean/L2 Norm) of this vector, i.e. $\sqrt{x^2+y^2+z^2+w^2}$.
   */
  public getMagnitude(): number {
    return Math.sqrt( this.magnitudeSquared );
  }

  public get magnitude(): number {
    return this.getMagnitude();
  }

  /**
   * The squared magnitude (square of the Euclidean/L2 Norm) of this vector, i.e. $x^2+y^2+z^2+w^2$.
   */
  public getMagnitudeSquared(): number {
    return this.dot( this as unknown as Vector4 );
  }

  public get magnitudeSquared(): number {
    return this.getMagnitudeSquared();
  }

  /**
   * The Euclidean distance between this vector (treated as a point) and another point.
   */
  public distance( point: Vector4 ): number {
    return this.minus( point ).magnitude;
  }

  /**
   * The Euclidean distance between this vector (treated as a point) and another point (x,y,z,w).
   */
  public distanceXYZW( x: number, y: number, z: number, w: number ): number {
    const dx = this.x - x;
    const dy = this.y - y;
    const dz = this.z - z;
    const dw = this.w - w;
    return Math.sqrt( dx * dx + dy * dy + dz * dz + dw * dw );
  }

  /**
   * The squared Euclidean distance between this vector (treated as a point) and another point.
   */
  public distanceSquared( point: Vector4 ): number {
    return this.minus( point ).magnitudeSquared;
  }

  /**
   * The squared Euclidean distance between this vector (treated as a point) and another point (x,y,z,w).
   */
  public distanceSquaredXYZW( x: number, y: number, z: number, w: number ): number {
    const dx = this.x - x;
    const dy = this.y - y;
    const dz = this.z - z;
    const dw = this.w - w;
    return dx * dx + dy * dy + dz * dz + dw * dw;
  }

  /**
   * The dot-product (Euclidean inner product) between this vector and another vector v.
   */
  public dot( v: Vector4 ): number {
    return this.x * v.x + this.y * v.y + this.z * v.z + this.w * v.w;
  }

  /**
   * The dot-product (Euclidean inner product) between this vector and another vector (x,y,z,w).
   */
  public dotXYZW( x: number, y: number, z: number, w: number ): number {
    return this.x * x + this.y * y + this.z * z + this.w * w;
  }

  /**
   * The angle between this vector and another vector, in the range $\theta\in[0, \pi]$.
   *
   * Equal to $\theta = \cos^{-1}( \hat{u} \cdot \hat{v} )$ where $\hat{u}$ is this vector (normalized) and $\hat{v}$
   * is the input vector (normalized).
   */
  public angleBetween( v: Vector4 ): number {
    // @ts-expect-error TODO: import with circular protection
    return Math.acos( dot.clamp( this.normalized().dot( v.normalized() ), -1, 1 ) );
  }

  /**
   * Exact equality comparison between this vector and another vector.
   *
   * @param other
   * @returns - Whether the two vectors have equal components
   */
  public equals( other: Vector4 ): boolean {
    return this.x === other.x && this.y === other.y && this.z === other.z && this.w === other.w;
  }

  /**
   * Approximate equality comparison between this vector and another vector.
   *
   * @returns - Whether difference between the two vectors has no component with an absolute value greater
   *                      than epsilon.
   */
  public equalsEpsilon( other: Vector4, epsilon: number ): boolean {
    if ( !epsilon ) {
      epsilon = 0;
    }
    return Math.abs( this.x - other.x ) + Math.abs( this.y - other.y ) + Math.abs( this.z - other.z ) + Math.abs( this.w - other.w ) <= epsilon;
  }

  /**
   * Returns false if any component is NaN, infinity, or -infinity. Otherwise returns true.
   */
  public isFinite(): boolean {
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
   * @param  [vector] - If not provided, creates a v4 with filled in values. Otherwise, fills in the
   *                    values of the provided vector so that it equals this vector.
   */
  public copy( vector?: Vector4 ): Vector4 {
    if ( vector ) {
      return vector.set( this as unknown as Vector4 );
    }
    else {
      return v4( this.x, this.y, this.z, this.w );
    }
  }

  /**
   * Normalized (re-scaled) copy of this vector such that its magnitude is 1. If its initial magnitude is zero, an
   * error is thrown.
   *
   * This is the immutable form of the function normalize(). This will return a new vector, and will not modify this
   * vector.
   */
  public normalized(): Vector4 {
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
  public roundedSymmetric(): Vector4 {
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
  public withMagnitude( magnitude: number ): Vector4 {
    return this.copy().setMagnitude( magnitude );
  }

  /**
   * Copy of this vector, scaled by the desired scalar value.
   *
   * This is the immutable form of the function multiplyScalar(). This will return a new vector, and will not modify
   * this vector.
   */
  public timesScalar( scalar: number ): Vector4 {
    return v4( this.x * scalar, this.y * scalar, this.z * scalar, this.w * scalar );
  }

  /**
   * Same as timesScalar.
   *
   * This is the immutable form of the function multiply(). This will return a new vector, and will not modify
   * this vector.
   */
  public times( scalar: number ): Vector4 {
    return this.timesScalar( scalar );
  }

  /**
   * Copy of this vector, multiplied component-wise by the passed-in vector v.
   *
   * This is the immutable form of the function componentMultiply(). This will return a new vector, and will not modify
   * this vector.
   */
  public componentTimes( v: Vector4 ): Vector4 {
    return v4( this.x * v.x, this.y * v.y, this.z * v.z, this.w * v.w );
  }

  /**
   * Addition of this vector and another vector, returning a copy.
   *
   * This is the immutable form of the function add(). This will return a new vector, and will not modify
   * this vector.
   */
  public plus( v: Vector4 ): Vector4 {
    return v4( this.x + v.x, this.y + v.y, this.z + v.z, this.w + v.w );
  }

  /**
   * Addition of this vector and another vector (x,y,z,w), returning a copy.
   *
   * This is the immutable form of the function addXYZW(). This will return a new vector, and will not modify
   * this vector.
   */
  public plusXYZW( x: number, y: number, z: number, w: number ): Vector4 {
    return v4( this.x + x, this.y + y, this.z + z, this.w + w );
  }

  /**
   * Addition of this vector with a scalar (adds the scalar to every component), returning a copy.
   *
   * This is the immutable form of the function addScalar(). This will return a new vector, and will not modify
   * this vector.
   */
  public plusScalar( scalar: number ): Vector4 {
    return v4( this.x + scalar, this.y + scalar, this.z + scalar, this.w + scalar );
  }

  /**
   * Subtraction of this vector by another vector v, returning a copy.
   *
   * This is the immutable form of the function subtract(). This will return a new vector, and will not modify
   * this vector.
   */
  public minus( v: Vector4 ): Vector4 {
    return v4( this.x - v.x, this.y - v.y, this.z - v.z, this.w - v.w );
  }

  /**
   * Subtraction of this vector by another vector (x,y,z,w), returning a copy.
   *
   * This is the immutable form of the function subtractXYZW(). This will return a new vector, and will not modify
   * this vector.
   */
  public minusXYZW( x: number, y: number, z: number, w: number ): Vector4 {
    return v4( this.x - x, this.y - y, this.z - z, this.w - w );
  }

  /**
   * Subtraction of this vector by a scalar (subtracts the scalar from every component), returning a copy.
   *
   * This is the immutable form of the function subtractScalar(). This will return a new vector, and will not modify
   * this vector.
   */
  public minusScalar( scalar: number ): Vector4 {
    return v4( this.x - scalar, this.y - scalar, this.z - scalar, this.w - scalar );
  }

  /**
   * Division of this vector by a scalar (divides every component by the scalar), returning a copy.
   *
   * This is the immutable form of the function divideScalar(). This will return a new vector, and will not modify
   * this vector.
   */
  public dividedScalar( scalar: number ): Vector4 {
    return v4( this.x / scalar, this.y / scalar, this.z / scalar, this.w / scalar );
  }

  /**
   * Negated copy of this vector (multiplies every component by -1).
   *
   * This is the immutable form of the function negate(). This will return a new vector, and will not modify
   * this vector.
   *
   */
  public negated(): Vector4 {
    return v4( -this.x, -this.y, -this.z, -this.w );
  }

  /**
   * A linear interpolation between this vector (ratio=0) and another vector (ratio=1).
   *
   * @param vector
   * @param ratio - Not necessarily constrained in [0, 1]
   */
  public blend( vector: Vector4, ratio: number ): Vector4 {
    return this.plus( vector.minus( this as unknown as Vector4 ).times( ratio ) );
  }

  /**
   * The average (midpoint) between this vector and another vector.
   */
  public average( vector: Vector4 ): Vector4 {
    return this.blend( vector, 0.5 );
  }

  /**
   * Debugging string for the vector.
   */
  public toString(): string {
    return `Vector4(${this.x}, ${this.y}, ${this.z}, ${this.w})`;
  }

  /**
   * Converts this to a 3-dimensional vector, discarding the w-component.
   */
  public toVector3(): Vector3 {
    return new Vector3( this.x, this.y, this.z );
  }

  /*---------------------------------------------------------------------------*
   * Mutables
   * - all mutation should go through setXYZW / setX / setY / setZ / setW
   *---------------------------------------------------------------------------*/

  /**
   * Sets all of the components of this vector, returning this.
   */
  public setXYZW( x: number, y: number, z: number, w: number ): Vector4 {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
    return this as unknown as Vector4;
  }

  /**
   * Sets the x-component of this vector, returning this.
   */
  public setX( x: number ): Vector4 {
    this.x = x;
    return this as unknown as Vector4;
  }

  /**
   * Sets the y-component of this vector, returning this.
   */
  public setY( y: number ): Vector4 {
    this.y = y;
    return this as unknown as Vector4;
  }

  /**
   * Sets the z-component of this vector, returning this.
   */
  public setZ( z: number ): Vector4 {
    this.z = z;
    return this as unknown as Vector4;
  }

  /**
   * Sets the w-component of this vector, returning this.
   */
  public setW( w: number ): Vector4 {
    this.w = w;
    return this as unknown as Vector4;
  }

  /**
   * Sets this vector to be a copy of another vector.
   *
   * This is the mutable form of the function copy(). This will mutate (change) this vector, in addition to returning
   * this vector itself.
   */
  public set( v: Vector4 ): Vector4 {
    return this.setXYZW( v.x, v.y, v.z, v.w );
  }

  /**
   * Sets the magnitude of this vector. If the passed-in magnitude is negative, this flips the vector and sets its
   * magnitude to abs( magnitude ).
   *
   * This is the mutable form of the function withMagnitude(). This will mutate (change) this vector, in addition to
   * returning this vector itself.
   */
  public setMagnitude( magnitude: number ): Vector4 {
    const scale = magnitude / this.magnitude;
    return this.multiplyScalar( scale );
  }

  /**
   * Adds another vector to this vector, changing this vector.
   *
   * This is the mutable form of the function plus(). This will mutate (change) this vector, in addition to
   * returning this vector itself.
   */
  public add( v: Vector4 ): Vector4 {
    return this.setXYZW( this.x + v.x, this.y + v.y, this.z + v.z, this.w + v.w );
  }

  /**
   * Adds another vector (x,y,z,w) to this vector, changing this vector.
   *
   * This is the mutable form of the function plusXYZW(). This will mutate (change) this vector, in addition to
   * returning this vector itself.
   */
  public addXYZW( x: number, y: number, z: number, w: number ): Vector4 {
    return this.setXYZW( this.x + x, this.y + y, this.z + z, this.w + w );
  }

  /**
   * Adds a scalar to this vector (added to every component), changing this vector.
   *
   * This is the mutable form of the function plusScalar(). This will mutate (change) this vector, in addition to
   * returning this vector itself.
   */
  public addScalar( scalar: number ): Vector4 {
    return this.setXYZW( this.x + scalar, this.y + scalar, this.z + scalar, this.w + scalar );
  }

  /**
   * Subtracts this vector by another vector, changing this vector.
   *
   * This is the mutable form of the function minus(). This will mutate (change) this vector, in addition to
   * returning this vector itself.
   */
  public subtract( v: Vector4 ): Vector4 {
    return this.setXYZW( this.x - v.x, this.y - v.y, this.z - v.z, this.w - v.w );
  }

  /**
   * Subtracts this vector by another vector (x,y,z,w), changing this vector.
   *
   * This is the mutable form of the function minusXYZW(). This will mutate (change) this vector, in addition to
   * returning this vector itself.
   */
  public subtractXYZW( x: number, y: number, z: number, w: number ): Vector4 {
    return this.setXYZW( this.x - x, this.y - y, this.z - z, this.w - w );
  }

  /**
   * Subtracts this vector by a scalar (subtracts each component by the scalar), changing this vector.
   *
   * This is the mutable form of the function minusScalar(). This will mutate (change) this vector, in addition to
   * returning this vector itself.
   */
  public subtractScalar( scalar: number ): Vector4 {
    return this.setXYZW( this.x - scalar, this.y - scalar, this.z - scalar, this.w - scalar );
  }

  /**
   * Multiplies this vector by a scalar (multiplies each component by the scalar), changing this vector.
   *
   * This is the mutable form of the function timesScalar(). This will mutate (change) this vector, in addition to
   * returning this vector itself.
   */
  public multiplyScalar( scalar: number ): Vector4 {
    return this.setXYZW( this.x * scalar, this.y * scalar, this.z * scalar, this.w * scalar );
  }

  /**
   * Multiplies this vector by a scalar (multiplies each component by the scalar), changing this vector.
   * Same as multiplyScalar.
   *
   * This is the mutable form of the function times(). This will mutate (change) this vector, in addition to
   * returning this vector itself.
   */
  public multiply( scalar: number ): Vector4 {
    return this.multiplyScalar( scalar );
  }

  /**
   * Multiplies this vector by another vector component-wise, changing this vector.
   *
   * This is the mutable form of the function componentTimes(). This will mutate (change) this vector, in addition to
   * returning this vector itself.
   */
  public componentMultiply( v: Vector4 ): Vector4 {
    return this.setXYZW( this.x * v.x, this.y * v.y, this.z * v.z, this.w * v.w );
  }

  /**
   * Divides this vector by a scalar (divides each component by the scalar), changing this vector.
   *
   * This is the mutable form of the function dividedScalar(). This will mutate (change) this vector, in addition to
   * returning this vector itself.
   */
  public divideScalar( scalar: number ): Vector4 {
    return this.setXYZW( this.x / scalar, this.y / scalar, this.z / scalar, this.w / scalar );
  }

  /**
   * Negates this vector (multiplies each component by -1), changing this vector.
   *
   * This is the mutable form of the function negated(). This will mutate (change) this vector, in addition to
   * returning this vector itself.
   */
  public negate(): Vector4 {
    return this.setXYZW( -this.x, -this.y, -this.z, -this.w );
  }

  /**
   * Normalizes this vector (rescales to where the magnitude is 1), changing this vector.
   *
   * This is the mutable form of the function normalized(). This will mutate (change) this vector, in addition to
   * returning this vector itself.
   */
  public normalize(): Vector4 {
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
  public roundSymmetric(): Vector4 {
    return this.setXYZW( Utils.roundSymmetric( this.x ), Utils.roundSymmetric( this.y ), Utils.roundSymmetric( this.z ), Utils.roundSymmetric( this.w ) );
  }

  public freeToPool(): void {
    Vector4.pool.freeToPool( this );
  }

  public static readonly pool = new Pool( Vector4, {
    maxSize: 1000,
    initialize: Vector4.prototype.setXYZW,
    defaultArguments: [ 0, 0, 0, 0 ]
  } );

  public isVector4!: boolean;
  public dimension!: number;
  public static ZERO: Vector4; // eslint-disable-line uppercase-statics-should-be-readonly
  public static X_UNIT: Vector4; // eslint-disable-line uppercase-statics-should-be-readonly
  public static Y_UNIT: Vector4; // eslint-disable-line uppercase-statics-should-be-readonly
  public static Z_UNIT: Vector4; // eslint-disable-line uppercase-statics-should-be-readonly
  public static W_UNIT: Vector4; // eslint-disable-line uppercase-statics-should-be-readonly
}

// (read-only) - Helps to identify the dimension of the vector
Vector4.prototype.isVector4 = true;
Vector4.prototype.dimension = 4;

dot.register( 'Vector4', Vector4 );

const v4 = Vector4.pool.create.bind( Vector4.pool );
dot.register( 'v4', v4 );

class ImmutableVector4 extends Vector4 {
  /**
   * Throw errors whenever a mutable method is called on our immutable vector
   */
  public static mutableOverrideHelper( mutableFunctionName: 'setX' | 'setY' | 'setZ' | 'setW' | 'setXYZW' ): void {
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

Vector4.ZERO = assert ? new ImmutableVector4( 0, 0, 0, 0 ) : new Vector4( 0, 0, 0, 0 );
Vector4.X_UNIT = assert ? new ImmutableVector4( 1, 0, 0, 0 ) : new Vector4( 1, 0, 0, 0 );
Vector4.Y_UNIT = assert ? new ImmutableVector4( 0, 1, 0, 0 ) : new Vector4( 0, 1, 0, 0 );
Vector4.Z_UNIT = assert ? new ImmutableVector4( 0, 0, 1, 0 ) : new Vector4( 0, 0, 1, 0 );
Vector4.W_UNIT = assert ? new ImmutableVector4( 0, 0, 0, 1 ) : new Vector4( 0, 0, 0, 1 );

export { v4 };
