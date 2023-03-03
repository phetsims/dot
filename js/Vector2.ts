// Copyright 2013-2023, University of Colorado Boulder

/**
 * Basic 2-dimensional vector, represented as (x,y).  Values can be numeric, or NaN or infinite.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import Pool, { TPoolable } from '../../phet-core/js/Pool.js';
import IOType from '../../tandem/js/types/IOType.js';
import NumberIO from '../../tandem/js/types/NumberIO.js';
import dot from './dot.js';
import Utils from './Utils.js';
import Vector3 from './Vector3.js';

const ADDING_ACCUMULATOR = ( vector: Vector2, nextVector: Vector2 ) => {
  return vector.add( nextVector );
};

export default class Vector2 implements TPoolable {

  // The X coordinate of the vector.
  public x: number;

  // The Y coordinate of the vector.
  public y: number;

  /**
   * Creates a 2-dimensional vector with the specified X and Y values.
   *
   * @param x - X coordinate
   * @param y - Y coordinate
   */
  public constructor( x: number, y: number ) {
    this.x = x;
    this.y = y;
  }

  /**
   * The magnitude (Euclidean/L2 Norm) of this vector, i.e. $\sqrt{x^2+y^2}$.
   */
  public getMagnitude(): number {
    return Math.sqrt( this.magnitudeSquared );
  }

  public get magnitude(): number { return this.getMagnitude(); }

  /**
   * The squared magnitude (square of the Euclidean/L2 Norm) of this vector, i.e. $x^2+y^2$.
   */
  public getMagnitudeSquared(): number {
    return this.x * this.x + this.y * this.y;
  }

  public get magnitudeSquared(): number { return this.getMagnitudeSquared(); }

  /**
   * The Euclidean distance between this vector (treated as a point) and another point.
   */
  public distance( point: Vector2 ): number {
    return Math.sqrt( this.distanceSquared( point ) );
  }

  /**
   * The Euclidean distance between this vector (treated as a point) and another point (x,y).
   */
  public distanceXY( x: number, y: number ): number {
    const dx = this.x - x;
    const dy = this.y - y;
    return Math.sqrt( dx * dx + dy * dy );
  }

  /**
   * The squared Euclidean distance between this vector (treated as a point) and another point.
   */
  public distanceSquared( point: Vector2 ): number {
    const dx = this.x - point.x;
    const dy = this.y - point.y;
    return dx * dx + dy * dy;
  }

  /**
   * The squared Euclidean distance between this vector (treated as a point) and another point with coordinates (x,y).
   */
  public distanceSquaredXY( x: number, y: number ): number {
    const dx = this.x - x;
    const dy = this.y - y;
    return dx * dx + dy * dy;
  }

  /**
   * The dot-product (Euclidean inner product) between this vector and another vector v.
   */
  public dot( v: Vector2 ): number {
    return this.x * v.x + this.y * v.y;
  }

  /**
   * The dot-product (Euclidean inner product) between this vector and another vector (x,y).
   */
  public dotXY( x: number, y: number ): number {
    return this.x * x + this.y * y;
  }

  /**
   * The angle $\theta$ of this vector, such that this vector is equal to
   * $$ u = \begin{bmatrix} r\cos\theta \\ r\sin\theta \end{bmatrix} $$
   * for the magnitude $r \ge 0$ of the vector, with $\theta\in(-\pi,\pi]$
   */
  public getAngle(): number {
    return Math.atan2( this.y, this.x );
  }

  public get angle(): number {
    return this.getAngle();
  }

  /**
   * The angle between this vector and another vector, in the range $\theta\in[0, \pi]$.
   *
   * Equal to $\theta = \cos^{-1}( \hat{u} \cdot \hat{v} )$ where $\hat{u}$ is this vector (normalized) and $\hat{v}$
   * is the input vector (normalized).
   */
  public angleBetween( v: Vector2 ): number {
    const thisMagnitude = this.magnitude;
    const vMagnitude = v.magnitude;
    // @ts-expect-error TODO: import with circular protection
    return Math.acos( dot.clamp( ( this.x * v.x + this.y * v.y ) / ( thisMagnitude * vMagnitude ), -1, 1 ) );
  }

  /**
   * Exact equality comparison between this vector and another vector.

   * @returns - Whether the two vectors have equal components
   */
  public equals( other: Vector2 ): boolean {
    return this.x === other.x && this.y === other.y;
  }

  /**
   * Approximate equality comparison between this vector and another vector.
   *
   * @returns - Whether difference between the two vectors has no component with an absolute value greater than epsilon.
   */
  public equalsEpsilon( other: Vector2, epsilon: number ): boolean {
    if ( !epsilon ) {
      epsilon = 0;
    }
    return Math.max( Math.abs( this.x - other.x ), Math.abs( this.y - other.y ) ) <= epsilon;
  }

  /**
   * Returns false if either component is NaN, infinity, or -infinity. Otherwise returns true.
   */
  public isFinite(): boolean {
    return isFinite( this.x ) && isFinite( this.y );
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
   * @param [vector] - If not provided, creates a new Vector2 with filled in values. Otherwise, fills in the
   *                   values of the provided vector so that it equals this vector.
   */
  public copy( vector?: Vector2 ): Vector2 {
    if ( vector ) {
      return vector.set( this );
    }
    else {
      return v2( this.x, this.y );
    }
  }

  /**
   * The scalar value of the z-component of the equivalent 3-dimensional cross product:
   * $$ f( u, v ) = \left( \begin{bmatrix} u_x \\ u_y \\ 0 \end{bmatrix} \times \begin{bmatrix} v_x \\ v_y \\ 0 \end{bmatrix} \right)_z = u_x v_y - u_y v_x $$
   */
  public crossScalar( v: Vector2 ): number {
    return this.x * v.y - this.y * v.x;
  }

  /**
   * Normalized (re-scaled) copy of this vector such that its magnitude is 1. If its initial magnitude is zero, an
   * error is thrown.
   *
   * This is the immutable form of the function normalize(). This will return a new vector, and will not modify this
   * vector.
   */
  public normalized(): Vector2 {
    const mag = this.magnitude;
    if ( mag === 0 ) {
      throw new Error( 'Cannot normalize a zero-magnitude vector' );
    }
    else {
      return v2( this.x / mag, this.y / mag );
    }
  }

  /**
   * Returns a copy of this vector with each component rounded by Utils.roundSymmetric.
   *
   * This is the immutable form of the function roundSymmetric(). This will return a new vector, and will not modify
   * this vector.
   */
  public roundedSymmetric(): Vector2 {
    return this.copy().roundSymmetric();
  }

  /**
   * Re-scaled copy of this vector such that it has the desired magnitude. If its initial magnitude is zero, an error
   * is thrown. If the passed-in magnitude is negative, the direction of the resulting vector will be reversed.
   *
   * This is the immutable form of the function setMagnitude(). This will return a new vector, and will not modify
   * this vector.
   */
  public withMagnitude( magnitude: number ): Vector2 {
    return this.copy().setMagnitude( magnitude );
  }

  /**
   * Copy of this vector, scaled by the desired scalar value.
   *
   * This is the immutable form of the function multiplyScalar(). This will return a new vector, and will not modify
   * this vector.
   */
  public timesScalar( scalar: number ): Vector2 {
    return v2( this.x * scalar, this.y * scalar );
  }

  /**
   * Same as timesScalar.
   *
   * This is the immutable form of the function multiply(). This will return a new vector, and will not modify
   * this vector.
   */
  public times( scalar: number ): Vector2 {
    return this.timesScalar( scalar );
  }

  /**
   * Copy of this vector, multiplied component-wise by the passed-in vector v.
   *
   * This is the immutable form of the function componentMultiply(). This will return a new vector, and will not modify
   * this vector.
   */
  public componentTimes( v: Vector2 ): Vector2 {
    return v2( this.x * v.x, this.y * v.y );
  }

  /**
   * Addition of this vector and another vector, returning a copy.
   *
   * This is the immutable form of the function add(). This will return a new vector, and will not modify
   * this vector.
   */
  public plus( v: Vector2 ): Vector2 {
    return v2( this.x + v.x, this.y + v.y );
  }

  /**
   * Addition of this vector and another vector (x,y), returning a copy.
   *
   * This is the immutable form of the function addXY(). This will return a new vector, and will not modify
   * this vector.
   */
  public plusXY( x: number, y: number ): Vector2 {
    return v2( this.x + x, this.y + y );
  }

  /**
   * Addition of this vector with a scalar (adds the scalar to every component), returning a copy.
   *
   * This is the immutable form of the function addScalar(). This will return a new vector, and will not modify
   * this vector.
   */
  public plusScalar( scalar: number ): Vector2 {
    return v2( this.x + scalar, this.y + scalar );
  }

  /**
   * Subtraction of this vector by another vector v, returning a copy.
   *
   * This is the immutable form of the function subtract(). This will return a new vector, and will not modify
   * this vector.
   */
  public minus( v: Vector2 ): Vector2 {
    return v2( this.x - v.x, this.y - v.y );
  }

  /**
   * Subtraction of this vector by another vector (x,y), returning a copy.
   *
   * This is the immutable form of the function subtractXY(). This will return a new vector, and will not modify
   * this vector.
   */
  public minusXY( x: number, y: number ): Vector2 {
    return v2( this.x - x, this.y - y );
  }

  /**
   * Subtraction of this vector by a scalar (subtracts the scalar from every component), returning a copy.
   *
   * This is the immutable form of the function subtractScalar(). This will return a new vector, and will not modify
   * this vector.
   */
  public minusScalar( scalar: number ): Vector2 {
    return v2( this.x - scalar, this.y - scalar );
  }

  /**
   * Division of this vector by a scalar (divides every component by the scalar), returning a copy.
   *
   * This is the immutable form of the function divideScalar(). This will return a new vector, and will not modify
   * this vector.
   */
  public dividedScalar( scalar: number ): Vector2 {
    return v2( this.x / scalar, this.y / scalar );
  }

  /**
   * Negated copy of this vector (multiplies every component by -1).
   *
   * This is the immutable form of the function negate(). This will return a new vector, and will not modify
   * this vector.
   */
  public negated(): Vector2 {
    return v2( -this.x, -this.y );
  }

  /**
   * Rotated by -pi/2 (perpendicular to this vector), returned as a copy.
   */
  public getPerpendicular(): Vector2 {
    return v2( this.y, -this.x );
  }

  public get perpendicular(): Vector2 {
    return this.getPerpendicular();
  }

  /**
   * Rotated by an arbitrary angle, in radians. Returned as a copy.
   *
   * This is the immutable form of the function rotate(). This will return a new vector, and will not modify
   * this vector.
   *
   * @param angle - In radians
   */
  public rotated( angle: number ): Vector2 {
    const newAngle = this.angle + angle;
    const mag = this.magnitude;
    return v2( mag * Math.cos( newAngle ), mag * Math.sin( newAngle ) );
  }

  /**
   * Mutable method that rotates this vector about an x,y point.
   *
   * @param x - origin of rotation in x
   * @param y - origin of rotation in y
   * @param angle - radians to rotate
   * @returns this for chaining
   */
  public rotateAboutXY( x: number, y: number, angle: number ): Vector2 {
    const dx = this.x - x;
    const dy = this.y - y;
    const cos = Math.cos( angle );
    const sin = Math.sin( angle );
    this.x = x + dx * cos - dy * sin;
    this.y = y + dx * sin + dy * cos;

    return this;
  }

  /**
   * Same as rotateAboutXY but with a point argument.
   */
  public rotateAboutPoint( point: Vector2, angle: number ): Vector2 {
    return this.rotateAboutXY( point.x, point.y, angle );
  }

  /**
   * Immutable method that returns a new Vector2 that is rotated about the given point.
   *
   * @param x - origin for rotation in x
   * @param y - origin for rotation in y
   * @param angle - radians to rotate
   */
  public rotatedAboutXY( x: number, y: number, angle: number ): Vector2 {
    return v2( this.x, this.y ).rotateAboutXY( x, y, angle );
  }

  /**
   * Immutable method that returns a new Vector2 rotated about the given point.
   */
  public rotatedAboutPoint( point: Vector2, angle: number ): Vector2 {
    return this.rotatedAboutXY( point.x, point.y, angle );
  }

  /**
   * A linear interpolation between this vector (ratio=0) and another vector (ratio=1).
   *
   * @param vector
   * @param ratio - Not necessarily constrained in [0, 1]
   */
  public blend( vector: Vector2, ratio: number ): Vector2 {
    return v2( this.x + ( vector.x - this.x ) * ratio, this.y + ( vector.y - this.y ) * ratio );
  }

  /**
   * The average (midpoint) between this vector and another vector.
   */
  public average( vector: Vector2 ): Vector2 {
    return this.blend( vector, 0.5 );
  }

  /**
   * Take a component-based mean of all vectors provided.
   */
  public static average( vectors: Vector2[] ): Vector2 {
    const added = _.reduce( vectors, ADDING_ACCUMULATOR, new Vector2( 0, 0 ) );
    return added.divideScalar( vectors.length );
  }


  /**
   * Debugging string for the vector.
   */
  public toString(): string {
    return `Vector2(${this.x}, ${this.y})`;
  }

  /**
   * Converts this to a 3-dimensional vector, with the z-component equal to 0.
   */
  public toVector3(): Vector3 {
    return new Vector3( this.x, this.y, 0 );
  }

  /*---------------------------------------------------------------------------*
   * Mutables
   * - all mutation should go through setXY / setX / setY
   *---------------------------------------------------------------------------*/

  /**
   * Sets all of the components of this vector, returning this.
   */
  public setXY( x: number, y: number ): Vector2 {
    this.x = x;
    this.y = y;
    return this;
  }

  /**
   * Sets the x-component of this vector, returning this.
   */
  public setX( x: number ): Vector2 {
    this.x = x;

    return this;
  }

  /**
   * Sets the y-component of this vector, returning this.
   */
  public setY( y: number ): Vector2 {
    this.y = y;
    return this;
  }

  /**
   * Sets this vector to be a copy of another vector.
   *
   * This is the mutable form of the function copy(). This will mutate (change) this vector, in addition to returning
   * this vector itself.
   */
  public set( v: Vector2 ): Vector2 {
    return this.setXY( v.x, v.y );
  }

  /**
   * Sets the magnitude of this vector. If the passed-in magnitude is negative, this flips the vector and sets its
   * magnitude to abs( magnitude ).
   *
   * This is the mutable form of the function withMagnitude(). This will mutate (change) this vector, in addition to
   * returning this vector itself.
   */
  public setMagnitude( magnitude: number ): Vector2 {
    const scale = magnitude / this.magnitude;

    return this.multiplyScalar( scale );
  }

  /**
   * Adds another vector to this vector, changing this vector.
   *
   * This is the mutable form of the function plus(). This will mutate (change) this vector, in addition to
   * returning this vector itself.
   */
  public add( v: Vector2 ): Vector2 {
    return this.setXY( this.x + v.x, this.y + v.y );
  }

  /**
   * Adds another vector (x,y) to this vector, changing this vector.
   *
   * This is the mutable form of the function plusXY(). This will mutate (change) this vector, in addition to
   * returning this vector itself.
   */
  public addXY( x: number, y: number ): Vector2 {
    return this.setXY( this.x + x, this.y + y );
  }

  /**
   * Adds a scalar to this vector (added to every component), changing this vector.
   *
   * This is the mutable form of the function plusScalar(). This will mutate (change) this vector, in addition to
   * returning this vector itself.
   */
  public addScalar( scalar: number ): Vector2 {
    return this.setXY( this.x + scalar, this.y + scalar );
  }

  /**
   * Subtracts this vector by another vector, changing this vector.
   *
   * This is the mutable form of the function minus(). This will mutate (change) this vector, in addition to
   * returning this vector itself.
   */
  public subtract( v: Vector2 ): Vector2 {
    return this.setXY( this.x - v.x, this.y - v.y );
  }

  /**
   * Subtracts this vector by another vector (x,y), changing this vector.
   *
   * This is the mutable form of the function minusXY(). This will mutate (change) this vector, in addition to
   * returning this vector itself.
   */
  public subtractXY( x: number, y: number ): Vector2 {
    return this.setXY( this.x - x, this.y - y );
  }

  /**
   * Subtracts this vector by a scalar (subtracts each component by the scalar), changing this vector.
   *
   * This is the mutable form of the function minusScalar(). This will mutate (change) this vector, in addition to
   * returning this vector itself.
   */
  public subtractScalar( scalar: number ): Vector2 {
    return this.setXY( this.x - scalar, this.y - scalar );
  }

  /**
   * Multiplies this vector by a scalar (multiplies each component by the scalar), changing this vector.
   *
   * This is the mutable form of the function timesScalar(). This will mutate (change) this vector, in addition to
   * returning this vector itself.
   */
  public multiplyScalar( scalar: number ): Vector2 {
    return this.setXY( this.x * scalar, this.y * scalar );
  }

  /**
   * Multiplies this vector by a scalar (multiplies each component by the scalar), changing this vector.
   * Same as multiplyScalar.
   *
   * This is the mutable form of the function times(). This will mutate (change) this vector, in addition to
   * returning this vector itself.
   */
  public multiply( scalar: number ): Vector2 {
    return this.multiplyScalar( scalar );
  }

  /**
   * Multiplies this vector by another vector component-wise, changing this vector.
   *
   * This is the mutable form of the function componentTimes(). This will mutate (change) this vector, in addition to
   * returning this vector itself.
   */
  public componentMultiply( v: Vector2 ): Vector2 {
    return this.setXY( this.x * v.x, this.y * v.y );
  }

  /**
   * Divides this vector by a scalar (divides each component by the scalar), changing this vector.
   *
   * This is the mutable form of the function dividedScalar(). This will mutate (change) this vector, in addition to
   * returning this vector itself.
   */
  public divideScalar( scalar: number ): Vector2 {
    return this.setXY( this.x / scalar, this.y / scalar );
  }

  /**
   * Negates this vector (multiplies each component by -1), changing this vector.
   *
   * This is the mutable form of the function negated(). This will mutate (change) this vector, in addition to
   * returning this vector itself.
   */
  public negate(): Vector2 {
    return this.setXY( -this.x, -this.y );
  }

  /**
   * Normalizes this vector (rescales to where the magnitude is 1), changing this vector.
   *
   * This is the mutable form of the function normalized(). This will mutate (change) this vector, in addition to
   * returning this vector itself.
   */
  public normalize(): Vector2 {
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
  public roundSymmetric(): Vector2 {
    return this.setXY( Utils.roundSymmetric( this.x ), Utils.roundSymmetric( this.y ) );
  }

  /**
   * Rotates this vector by the angle (in radians), changing this vector.
   *
   * This is the mutable form of the function rotated(). This will mutate (change) this vector, in addition to
   * returning this vector itself.
   *
   * @param angle - In radians
   */
  public rotate( angle: number ): Vector2 {
    const newAngle = this.angle + angle;
    const mag = this.magnitude;
    return this.setXY( mag * Math.cos( newAngle ), mag * Math.sin( newAngle ) );
  }

  /**
   * Sets this vector's value to be the x,y values matching the given magnitude and angle (in radians), changing
   * this vector, and returning itself.
   *
   * @param magnitude
   * @param angle - In radians
   */
  public setPolar( magnitude: number, angle: number ): Vector2 {
    return this.setXY( magnitude * Math.cos( angle ), magnitude * Math.sin( angle ) );
  }

  /**
   * Returns a duck-typed object meant for use with tandem/phet-io serialization. Although this is redundant with
   * stateSchema, it is a nice feature of such a heavily-used type to be able to call toStateObject directly on the type.
   *
   * @returns - see stateSchema for schema
   */
  public toStateObject(): Vector2StateObject {
    return {
      x: this.x,
      y: this.y
    };
  }

  public freeToPool(): void {
    Vector2.pool.freeToPool( this );
  }

  public static readonly pool = new Pool( Vector2, {
    maxSize: 1000,
    initialize: Vector2.prototype.setXY,
    defaultArguments: [ 0, 0 ]
  } );

  // static methods

  /**
   * Returns a Vector2 with the specified magnitude $r$ and angle $\theta$ (in radians), with the formula:
   * $$ f( r, \theta ) = \begin{bmatrix} r\cos\theta \\ r\sin\theta \end{bmatrix} $$
   */
  public static createPolar( magnitude: number, angle: number ): Vector2 {
    return new Vector2( 0, 0 ).setPolar( magnitude, angle );
  }

  /**
   * Constructs a Vector2 from a duck-typed object, for use with tandem/phet-io deserialization.
   *
   * @param stateObject - see stateSchema for schema
   */
  public static fromStateObject( stateObject: Vector2StateObject ): Vector2 {
    return v2(
      stateObject.x,
      stateObject.y
    );
  }

  /**
   * Allocation-free implementation that gets the angle between two vectors
   *
   * @returns the angle between the vectors
   */
  public static getAngleBetweenVectors( startVector: Vector2, endVector: Vector2 ): number {
    const dx = endVector.x - startVector.x;
    const dy = endVector.y - startVector.y;
    return Math.atan2( dy, dx );
  }

  /**
   * Allocation-free way to get the distance between vectors.
   *
   * @returns the angle between the vectors
   */
  public static getDistanceBetweenVectors( startVector: Vector2, endVector: Vector2 ): number {
    const dx = endVector.x - startVector.x;
    const dy = endVector.y - startVector.y;
    return Math.sqrt( dx * dx + dy * dy );
  }

  public isVector2!: boolean;
  public dimension!: number;

  /**
   * ImmutableVector2 zero vector: $\begin{bmatrix} 0\\0 \end{bmatrix}$
   */
  public static ZERO: Vector2; // eslint-disable-line uppercase-statics-should-be-readonly

  /**
   * ImmutableVector2 vector: $\begin{bmatrix} 1\\0 \end{bmatrix}$
   */
  public static X_UNIT: Vector2; // eslint-disable-line uppercase-statics-should-be-readonly

  /**
   * ImmutableVector2 vector: $\begin{bmatrix} 0\\1 \end{bmatrix}$
   */
  public static Y_UNIT: Vector2; // eslint-disable-line uppercase-statics-should-be-readonly

  public static Vector2IO: IOType;
}

// (read-only) - Helps to identify the dimension of the vector
Vector2.prototype.isVector2 = true;
Vector2.prototype.dimension = 2;

dot.register( 'Vector2', Vector2 );

const v2 = Vector2.pool.create.bind( Vector2.pool );
dot.register( 'v2', v2 );

class ImmutableVector2 extends Vector2 {
  /**
   * Throw errors whenever a mutable method is called on our immutable vector
   */
  public static mutableOverrideHelper( mutableFunctionName: 'setX' | 'setY' | 'setXY' ): void {
    ImmutableVector2.prototype[ mutableFunctionName ] = () => {
      throw new Error( `Cannot call mutable method '${mutableFunctionName}' on immutable Vector2` );
    };
  }
}

ImmutableVector2.mutableOverrideHelper( 'setXY' );
ImmutableVector2.mutableOverrideHelper( 'setX' );
ImmutableVector2.mutableOverrideHelper( 'setY' );

Vector2.ZERO = assert ? new ImmutableVector2( 0, 0 ) : new Vector2( 0, 0 );
Vector2.X_UNIT = assert ? new ImmutableVector2( 1, 0 ) : new Vector2( 1, 0 );
Vector2.Y_UNIT = assert ? new ImmutableVector2( 0, 1 ) : new Vector2( 0, 1 );

export type Vector2StateObject = {
  x: number;
  y: number;
};

Vector2.Vector2IO = new IOType<Vector2, Vector2StateObject>( 'Vector2IO', {
  valueType: Vector2,
  stateSchema: {
    x: NumberIO,
    y: NumberIO
  },
  toStateObject: ( vector2: Vector2 ) => vector2.toStateObject(),
  fromStateObject: ( stateObject: Vector2StateObject ) => Vector2.fromStateObject( stateObject ),
  documentation: 'A numerical object with x and y properties, like {x:3,y:4}'
} );

export { v2 };
