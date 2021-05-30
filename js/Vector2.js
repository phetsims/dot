// Copyright 2013-2021, University of Colorado Boulder

/**
 * Basic 2-dimensional vector, represented as (x,y).
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import Poolable from '../../phet-core/js/Poolable.js';
import IOType from '../../tandem/js/types/IOType.js';
import NumberIO from '../../tandem/js/types/NumberIO.js';
import dot from './dot.js';
import Utils from './Utils.js';
import Vector3 from './Vector3.js';

class Vector2 {
  /**
   * Creates a 2-dimensional vector with the specified X and Y values.
   * @public
   *
   * @param {number} x - X coordinate
   * @param {number} y - Y coordinate
   */
  constructor( x, y ) {
    assert && assert( typeof x === 'number', 'x needs to be a number' );
    assert && assert( typeof y === 'number', 'y needs to be a number' );

    // @public {number} - The X coordinate of the vector.
    this.x = x;

    // @public {number} - The Y coordinate of the vector.
    this.y = y;
  }


  /**
   * The magnitude (Euclidean/L2 Norm) of this vector, i.e. $\sqrt{x^2+y^2}$.
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
   * The squared magnitude (square of the Euclidean/L2 Norm) of this vector, i.e. $x^2+y^2$.
   * @public
   *
   * @returns {number}
   */
  getMagnitudeSquared() {
    return this.x * this.x + this.y * this.y;
  }

  get magnitudeSquared() {
    return this.getMagnitudeSquared();
  }

  /**
   * The Euclidean distance between this vector (treated as a point) and another point.
   * @public
   *
   * @param {Vector2} point
   * @returns {number}
   */
  distance( point ) {
    return Math.sqrt( this.distanceSquared( point ) );
  }

  /**
   * The Euclidean distance between this vector (treated as a point) and another point (x,y).
   * @public
   *
   * @param {number} x
   * @param {number} y
   * @returns {number}
   */
  distanceXY( x, y ) {
    const dx = this.x - x;
    const dy = this.y - y;
    return Math.sqrt( dx * dx + dy * dy );
  }

  /**
   * The squared Euclidean distance between this vector (treated as a point) and another point.
   * @public
   *
   * @param {Vector2} point
   * @returns {number}
   */
  distanceSquared( point ) {
    const dx = this.x - point.x;
    const dy = this.y - point.y;
    return dx * dx + dy * dy;
  }

  /**
   * The squared Euclidean distance between this vector (treated as a point) and another point with coordinates (x,y).
   * @public
   *
   * @param {number} x
   * @param {number} y
   * @returns {number}
   */
  distanceSquaredXY( x, y ) {
    const dx = this.x - x;
    const dy = this.y - y;
    return dx * dx + dy * dy;
  }

  /**
   * The dot-product (Euclidean inner product) between this vector and another vector v.
   * @public
   *
   * @param {Vector2} v
   * @returns {number}
   */
  dot( v ) {
    return this.x * v.x + this.y * v.y;
  }

  /**
   * The dot-product (Euclidean inner product) between this vector and another vector (x,y).
   * @public
   *
   * @param {number} x
   * @param {number} y
   * @returns {number}
   */
  dotXY( x, y ) {
    return this.x * x + this.y * y;
  }

  /**
   * The angle $\theta$ of this vector, such that this vector is equal to
   * $$ u = \begin{bmatrix} r\cos\theta \\ r\sin\theta \end{bmatrix} $$
   * for the magnitude $r \ge 0$ of the vector, with $\theta\in(-\pi,\pi]$
   * @public
   *
   * @returns {number}
   */
  getAngle() {
    return Math.atan2( this.y, this.x );
  }

  get angle() {
    return this.getAngle();
  }

  /**
   * The angle between this vector and another vector, in the range $\theta\in[0, \pi]$.
   * @public
   *
   * Equal to $\theta = \cos^{-1}( \hat{u} \cdot \hat{v} )$ where $\hat{u}$ is this vector (normalized) and $\hat{v}$
   * is the input vector (normalized).
   *
   * @param {Vector2} v
   * @returns {number}
   */
  angleBetween( v ) {
    const thisMagnitude = this.magnitude;
    const vMagnitude = v.magnitude;
    return Math.acos( dot.clamp( ( this.x * v.x + this.y * v.y ) / ( thisMagnitude * vMagnitude ), -1, 1 ) );
  }

  /**
   * Exact equality comparison between this vector and another vector.
   * @public
   *
   * @param {Vector2} other
   * @returns {boolean} - Whether the two vectors have equal components
   */
  equals( other ) {
    return this.x === other.x && this.y === other.y;
  }

  /**
   * Approximate equality comparison between this vector and another vector.
   * @public
   *
   * @param {Vector2} other
   * @param {number} epsilon
   * @returns {boolean} - Whether difference between the two vectors has no component with an absolute value greater
   *                      than epsilon.
   */
  equalsEpsilon( other, epsilon ) {
    if ( !epsilon ) {
      epsilon = 0;
    }
    return Math.max( Math.abs( this.x - other.x ), Math.abs( this.y - other.y ) ) <= epsilon;
  }

  /**
   * Returns false if either component is NaN, infinity, or -infinity. Otherwise returns true.
   * @public
   *
   * @returns {boolean}
   */
  isFinite() {
    return isFinite( this.x ) && isFinite( this.y );
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
   * @param {Vector2} [vector] - If not provided, creates a new Vector2 with filled in values. Otherwise, fills in the
   *                             values of the provided vector so that it equals this vector.
   * @returns {Vector2}
   */
  copy( vector ) {
    if ( vector ) {
      return vector.set( this );
    }
    else {
      return new Vector2( this.x, this.y );
    }
  }

  /**
   * The scalar value of the z-component of the equivalent 3-dimensional cross product:
   * $$ f( u, v ) = \left( \begin{bmatrix} u_x \\ u_y \\ 0 \end{bmatrix} \times \begin{bmatrix} v_x \\ v_y \\ 0 \end{bmatrix} \right)_z = u_x v_y - u_y v_x $$
   * @public
   *
   * @param {Vector2} v
   * @returns {number}
   */
  crossScalar( v ) {
    return this.x * v.y - this.y * v.x;
  }

  /**
   * Normalized (re-scaled) copy of this vector such that its magnitude is 1. If its initial magnitude is zero, an
   * error is thrown.
   * @public
   *
   * This is the immutable form of the function normalize(). This will return a new vector, and will not modify this
   * vector.
   *
   * @returns {Vector2}
   */
  normalized() {
    const mag = this.magnitude;
    if ( mag === 0 ) {
      throw new Error( 'Cannot normalize a zero-magnitude vector' );
    }
    else {
      return new Vector2( this.x / mag, this.y / mag );
    }
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
   * @returns {Vector2}
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
   * @returns {Vector2}
   */
  timesScalar( scalar ) {
    return new Vector2( this.x * scalar, this.y * scalar );
  }

  /**
   * Same as timesScalar.
   * @public
   *
   * This is the immutable form of the function multiply(). This will return a new vector, and will not modify
   * this vector.
   *
   * @param {number} scalar
   * @returns {Vector2}
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
   * @param {Vector2} v
   * @returns {Vector2}
   */
  componentTimes( v ) {
    return new Vector2( this.x * v.x, this.y * v.y );
  }

  /**
   * Addition of this vector and another vector, returning a copy.
   * @public
   *
   * This is the immutable form of the function add(). This will return a new vector, and will not modify
   * this vector.
   *
   * @param {Vector2} v
   * @returns {Vector2}
   */
  plus( v ) {
    return new Vector2( this.x + v.x, this.y + v.y );
  }

  /**
   * Addition of this vector and another vector (x,y), returning a copy.
   * @public
   *
   * This is the immutable form of the function addXY(). This will return a new vector, and will not modify
   * this vector.
   *
   * @param {number} x
   * @param {number} y
   * @returns {Vector2}
   */
  plusXY( x, y ) {
    return new Vector2( this.x + x, this.y + y );
  }

  /**
   * Addition of this vector with a scalar (adds the scalar to every component), returning a copy.
   * @public
   *
   * This is the immutable form of the function addScalar(). This will return a new vector, and will not modify
   * this vector.
   *
   * @param {number} scalar
   * @returns {Vector2}
   */
  plusScalar( scalar ) {
    return new Vector2( this.x + scalar, this.y + scalar );
  }

  /**
   * Subtraction of this vector by another vector v, returning a copy.
   * @public
   *
   * This is the immutable form of the function subtract(). This will return a new vector, and will not modify
   * this vector.
   *
   * @param {Vector2} v
   * @returns {Vector2}
   */
  minus( v ) {
    return new Vector2( this.x - v.x, this.y - v.y );
  }

  /**
   * Subtraction of this vector by another vector (x,y), returning a copy.
   * @public
   *
   * This is the immutable form of the function subtractXY(). This will return a new vector, and will not modify
   * this vector.
   *
   * @param {number} x
   * @param {number} y
   * @returns {Vector2}
   */
  minusXY( x, y ) {
    return new Vector2( this.x - x, this.y - y );
  }

  /**
   * Subtraction of this vector by a scalar (subtracts the scalar from every component), returning a copy.
   * @public
   *
   * This is the immutable form of the function subtractScalar(). This will return a new vector, and will not modify
   * this vector.
   *
   * @param {number} scalar
   * @returns {Vector2}
   */
  minusScalar( scalar ) {
    return new Vector2( this.x - scalar, this.y - scalar );
  }

  /**
   * Division of this vector by a scalar (divides every component by the scalar), returning a copy.
   * @public
   *
   * This is the immutable form of the function divideScalar(). This will return a new vector, and will not modify
   * this vector.
   *
   * @param {number} scalar
   * @returns {Vector2}
   */
  dividedScalar( scalar ) {
    return new Vector2( this.x / scalar, this.y / scalar );
  }

  /**
   * Negated copy of this vector (multiplies every component by -1).
   * @public
   *
   * This is the immutable form of the function negate(). This will return a new vector, and will not modify
   * this vector.
   *
   * @returns {Vector2}
   */
  negated() {
    return new Vector2( -this.x, -this.y );
  }

  /**
   * Rotated by -pi/2 (perpendicular to this vector), returned as a copy.
   * @public
   *
   * @returns {Vector2}
   */
  getPerpendicular() {
    return new Vector2( this.y, -this.x );
  }

  get perpendicular() {
    return this.getPerpendicular();
  }

  /**
   * Rotated by an arbitrary angle, in radians. Returned as a copy.
   * @public
   *
   * This is the immutable form of the function rotate(). This will return a new vector, and will not modify
   * this vector.
   *
   * @param {number} angle - In radians
   * @returns {Vector2}
   */
  rotated( angle ) {
    const newAngle = this.angle + angle;
    const mag = this.magnitude;
    return new Vector2( mag * Math.cos( newAngle ), mag * Math.sin( newAngle ) );
  }

  /**
   * Mutable method that rotates this vector about an x,y point.
   * @public
   *
   * @param {number} x - origin of rotation in x
   * @param {number} y - origin of rotation in y
   * @param {number} angle - radians to rotate
   * @returns {Vector2} this for chaining
   */
  rotateAboutXY( x, y, angle ) {
    const dx = this.x - x;
    const dy = this.y - y;
    const cos = Math.cos( angle );
    const sin = Math.sin( angle );
    this.x = x + dx * cos - dy * sin;
    this.y = y + dx * sin + dy * cos;
    return this; // for chaining
  }

  /**
   * Same as rotateAboutXY but with a point argument.
   * @public
   *
   * @param {Vector2} point
   * @param {number} angle
   * @returns {Vector2} this for chaining
   */
  rotateAboutPoint( point, angle ) {
    return this.rotateAboutXY( point.x, point.y, angle );
  }

  /**
   * Immutable method that returns a new Vector2 that is rotated about the given point.
   * @public
   *
   * @param {number} x - origin for rotation in x
   * @param {number} y - origin for rotation in y
   * @param {number} angle - radians to rotate
   * @returns {Vector2} the new Vector2
   */
  rotatedAboutXY( x, y, angle ) {
    return new Vector2( this.x, this.y ).rotateAboutXY( x, y, angle );
  }

  /**
   * Immutable method that returns a new Vector2 rotated about the given point.
   * @public
   *
   * @param {Vector2} point
   * @param {number} angle
   * @returns {Vector2} the new Vector2
   */
  rotatedAboutPoint( point, angle ) {
    return this.rotatedAboutXY( point.x, point.y, angle );
  }

  /**
   * A linear interpolation between this vector (ratio=0) and another vector (ratio=1).
   * @public
   *
   * @param {Vector2} vector
   * @param {number} ratio - Not necessarily constrained in [0, 1]
   * @returns {Vector2}
   */
  blend( vector, ratio ) {
    return new Vector2( this.x + ( vector.x - this.x ) * ratio, this.y + ( vector.y - this.y ) * ratio );
  }

  /**
   * The average (midpoint) between this vector and another vector.
   * @public
   *
   * @param {Vector2} vector
   * @returns {Vector2}
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
    return `Vector2(${this.x}, ${this.y})`;
  }

  /**
   * Converts this to a 3-dimensional vector, with the z-component equal to 0.
   * @public
   *
   * @returns {Vector3}
   */
  toVector3() {
    return new Vector3( this.x, this.y, 0 );
  }

  /*---------------------------------------------------------------------------*
   * Mutables
   * - all mutation should go through setXY / setX / setY
   *---------------------------------------------------------------------------*/

  /**
   * Sets all of the components of this vector, returning this.
   * @public
   *
   * @param {number} x
   * @param {number} y
   * @returns {Vector2}
   */
  setXY( x, y ) {
    this.x = x;
    this.y = y;
    return this;
  }

  /**
   * Sets the x-component of this vector, returning this.
   * @public
   *
   * @param {number} x
   * @returns {Vector2}
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
   * @returns {Vector2}
   */
  setY( y ) {
    this.y = y;
    return this;
  }

  /**
   * Sets this vector to be a copy of another vector.
   * @public
   *
   * This is the mutable form of the function copy(). This will mutate (change) this vector, in addition to returning
   * this vector itself.
   *
   * @param {Vector2} v
   * @returns {Vector2}
   */
  set( v ) {
    return this.setXY( v.x, v.y );
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
   * @returns {Vector2}
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
    return this.setXY( this.x + v.x, this.y + v.y );
  }

  /**
   * Adds another vector (x,y) to this vector, changing this vector.
   * @public
   *
   * This is the mutable form of the function plusXY(). This will mutate (change) this vector, in addition to
   * returning this vector itself.
   *
   * @param {number} x
   * @param {number} y
   * @returns {Vector2}
   */
  addXY( x, y ) {
    return this.setXY( this.x + x, this.y + y );
  }

  /**
   * Adds a scalar to this vector (added to every component), changing this vector.
   * @public
   *
   * This is the mutable form of the function plusScalar(). This will mutate (change) this vector, in addition to
   * returning this vector itself.
   *
   * @param {number} scalar
   * @returns {Vector2}
   */
  addScalar( scalar ) {
    return this.setXY( this.x + scalar, this.y + scalar );
  }

  /**
   * Subtracts this vector by another vector, changing this vector.
   * @public
   *
   * This is the mutable form of the function minus(). This will mutate (change) this vector, in addition to
   * returning this vector itself.
   *
   * @param {Vector2} v
   * @returns {Vector2}
   */
  subtract( v ) {
    return this.setXY( this.x - v.x, this.y - v.y );
  }

  /**
   * Subtracts this vector by another vector (x,y), changing this vector.
   * @public
   *
   * This is the mutable form of the function minusXY(). This will mutate (change) this vector, in addition to
   * returning this vector itself.
   *
   * @param {number} x
   * @param {number} y
   * @returns {Vector2}
   */
  subtractXY( x, y ) {
    return this.setXY( this.x - x, this.y - y );
  }

  /**
   * Subtracts this vector by a scalar (subtracts each component by the scalar), changing this vector.
   * @public
   *
   * This is the mutable form of the function minusScalar(). This will mutate (change) this vector, in addition to
   * returning this vector itself.
   *
   * @param {number} scalar
   * @returns {Vector2}
   */
  subtractScalar( scalar ) {
    return this.setXY( this.x - scalar, this.y - scalar );
  }

  /**
   * Multiplies this vector by a scalar (multiplies each component by the scalar), changing this vector.
   * @public
   *
   * This is the mutable form of the function timesScalar(). This will mutate (change) this vector, in addition to
   * returning this vector itself.
   *
   * @param {number} scalar
   * @returns {Vector2}
   */
  multiplyScalar( scalar ) {
    return this.setXY( this.x * scalar, this.y * scalar );
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
   * @returns {Vector2}
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
   * @param {Vector2} v
   * @returns {Vector2}
   */
  componentMultiply( v ) {
    return this.setXY( this.x * v.x, this.y * v.y );
  }

  /**
   * Divides this vector by a scalar (divides each component by the scalar), changing this vector.
   * @public
   *
   * This is the mutable form of the function dividedScalar(). This will mutate (change) this vector, in addition to
   * returning this vector itself.
   *
   * @param {number} scalar
   * @returns {Vector2}
   */
  divideScalar( scalar ) {
    return this.setXY( this.x / scalar, this.y / scalar );
  }

  /**
   * Negates this vector (multiplies each component by -1), changing this vector.
   * @public
   *
   * This is the mutable form of the function negated(). This will mutate (change) this vector, in addition to
   * returning this vector itself.
   *
   * @returns {Vector2}
   */
  negate() {
    return this.setXY( -this.x, -this.y );
  }

  /**
   * Normalizes this vector (rescales to where the magnitude is 1), changing this vector.
   * @public
   *
   * This is the mutable form of the function normalized(). This will mutate (change) this vector, in addition to
   * returning this vector itself.
   *
   * @returns {Vector2}
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
   * @returns {Vector2}
   */
  roundSymmetric() {
    return this.setXY( Utils.roundSymmetric( this.x ), Utils.roundSymmetric( this.y ) );
  }

  /**
   * Rotates this vector by the angle (in radians), changing this vector.
   * @public
   *
   * This is the mutable form of the function rotated(). This will mutate (change) this vector, in addition to
   * returning this vector itself.
   *
   * @param {number} angle - In radians
   * @returns {Vector2}
   */
  rotate( angle ) {
    const newAngle = this.angle + angle;
    const mag = this.magnitude;
    return this.setXY( mag * Math.cos( newAngle ), mag * Math.sin( newAngle ) );
  }

  /**
   * Sets this vector's value to be the x,y values matching the given magnitude and angle (in radians), changing
   * this vector, and returning itself.
   * @public
   *
   * @param {number} magnitude
   * @param {number} angle - In radians
   * @returns {Vector2}
   */
  setPolar( magnitude, angle ) {
    return this.setXY( magnitude * Math.cos( angle ), magnitude * Math.sin( angle ) );
  }

  /**
   * Returns a duck-typed object meant for use with tandem/phet-io serialization.
   * @public
   *
   * @returns {{x:number, y:number}}
   */
  toStateObject() {
    return { x: this.x, y: this.y };
  }

  // static methods

  /**
   * Returns a Vector2 with the specified magnitude $r$ and angle $\theta$ (in radians), with the formula:
   * $$ f( r, \theta ) = \begin{bmatrix} r\cos\theta \\ r\sin\theta \end{bmatrix} $$
   * @public
   * @static
   *
   * @param {number} magnitude
   * @param {number} angle
   * @returns {Vector2}
   */
  static createPolar( magnitude, angle ) {
    return new Vector2( 0, 0 ).setPolar( magnitude, angle );
  }

  /**
   * Constructs a Vector2 from a duck-typed object, for use with tandem/phet-io deserialization.
   * @public
   * @static
   *
   * @param {{x:number, y:number}} stateObject
   * @returns {Vector2}
   */
  static fromStateObject( stateObject ) {
    return new Vector2( stateObject.x, stateObject.y );
  }

  /**
   * Allocation-free implementation that gets the angle between two vectors
   * @public
   * @static
   *
   * @param {Vector2} startVector
   * @param {Vector2} endVector
   * @returns {number} the angle between the vectors
   */
  static getAngleBetweenVectors( startVector, endVector ) {
    const dx = endVector.x - startVector.x;
    const dy = endVector.y - startVector.y;
    return Math.atan2( dy, dx );
  }

  /**
   * Allocation-free way to get the distance between vectors.
   * @public
   * @static
   *
   * @param {Vector2} startVector
   * @param {Vector2} endVector
   * @returns {number} the angle between the vectors
   */
  static getDistanceBetweenVectors( startVector, endVector ) {
    const dx = endVector.x - startVector.x;
    const dy = endVector.y - startVector.y;
    return Math.sqrt( dx * dx + dy * dy );
  }
}

// @public (read-only) - Helps to identify the dimension of the vector
Vector2.prototype.isVector2 = true;
Vector2.prototype.dimension = 2;

dot.register( 'Vector2', Vector2 );

// Sets up pooling on Vector2
Poolable.mixInto( Vector2, {
  initialize: Vector2.prototype.setXY,
  defaultArguments: [ 0, 0 ]
} );

class ImmutableVector2 extends Vector2 {
  /**
   * Throw errors whenever a mutable method is called on our immutable vector
   * @public
   *
   * @param {*} mutableFunctionName
   */
  static mutableOverrideHelper( mutableFunctionName ) {
    ImmutableVector2.prototype[ mutableFunctionName ] = () => {
      throw new Error( `Cannot call mutable method '${mutableFunctionName}' on immutable Vector2` );
    };
  }
}

// TODO: better way to handle this list?
ImmutableVector2.mutableOverrideHelper( 'setXY' );
ImmutableVector2.mutableOverrideHelper( 'setX' );
ImmutableVector2.mutableOverrideHelper( 'setY' );

/**
 * ImmutableVector2 zero vector: $\begin{bmatrix} 0\\0 \end{bmatrix}$
 * @public
 *
 * @constant {Vector2} ZERO
 */
Vector2.ZERO = assert ? new ImmutableVector2( 0, 0 ) : new Vector2( 0, 0 );

/**
 * ImmutableVector2 vector: $\begin{bmatrix} 1\\0 \end{bmatrix}$
 * @public
 *
 * @constant {Vector2} X_UNIT
 */
Vector2.X_UNIT = assert ? new ImmutableVector2( 1, 0 ) : new Vector2( 1, 0 );

/**
 * ImmutableVector2 vector: $\begin{bmatrix} 0\\1 \end{bmatrix}$
 * @public
 *
 * @constant {Vector2} Y_UNIT
 */
Vector2.Y_UNIT = assert ? new ImmutableVector2( 0, 1 ) : new Vector2( 0, 1 );

Vector2.Vector2IO = IOType.fromCoreType( 'Vector2IO', Vector2, {
  documentation: 'A numerical object with x and y properties, like {x:3,y:4}',
  stateSchema: {
    x: NumberIO,
    y: NumberIO
  }
} );

export default Vector2;