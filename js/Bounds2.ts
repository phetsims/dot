// Copyright 2013-2023, University of Colorado Boulder

/**
 * A 2D rectangle-shaped bounded area (bounding box).
 *
 * There are a number of convenience functions to get positions and points on the Bounds. Currently we do not
 * store these with the Bounds2 instance, since we want to lower the memory footprint.
 *
 * minX, minY, maxX, and maxY are actually stored. We don't do x,y,width,height because this can't properly express
 * semi-infinite bounds (like a half-plane), or easily handle what Bounds2.NOTHING and Bounds2.EVERYTHING do with
 * the constructive solid areas.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import IOType from '../../tandem/js/types/IOType.js';
import InfiniteNumberIO, { InfiniteNumberStateObject } from '../../tandem/js/types/InfiniteNumberIO.js';
import Vector2 from './Vector2.js';
import dot from './dot.js';
import Matrix3 from './Matrix3.js';
import Range from './Range.js';
import Pool, { TPoolable } from '../../phet-core/js/Pool.js';
import Orientation from '../../phet-core/js/Orientation.js';

// Temporary instances to be used in the transform method.
const scratchVector2 = new Vector2( 0, 0 );

export type Bounds2StateObject = {
  minX: InfiniteNumberStateObject;
  minY: InfiniteNumberStateObject;
  maxX: InfiniteNumberStateObject;
  maxY: InfiniteNumberStateObject;
};

// TODO: Why does freeToPool get promoted, but nothing else? https://github.com/phetsims/phet-core/issues/103
// TODO: Do we need TPoolable? Can classes just have a static pool method? https://github.com/phetsims/phet-core/issues/103
export default class Bounds2 implements TPoolable {

  // The minimum X coordinate of the bounds.
  public minX: number;

  // The minimum Y coordinate of the bounds.
  public minY: number;

  // The maximum X coordinate of the bounds.
  public maxX: number;

  // The maximum Y coordinate of the bounds.
  public maxY: number;

  /**
   * Creates a 2-dimensional bounds (bounding box).
   *
   * @param minX - The initial minimum X coordinate of the bounds.
   * @param minY - The initial minimum Y coordinate of the bounds.
   * @param maxX - The initial maximum X coordinate of the bounds.
   * @param maxY - The initial maximum Y coordinate of the bounds.
   */
  public constructor( minX: number, minY: number, maxX: number, maxY: number ) {
    assert && assert( maxY !== undefined, 'Bounds2 requires 4 parameters' );

    this.minX = minX;
    this.minY = minY;
    this.maxX = maxX;
    this.maxY = maxY;
  }

  /*---------------------------------------------------------------------------*
   * Properties
   *---------------------------------------------------------------------------*/

  /**
   * The width of the bounds, defined as maxX - minX.
   */
  public getWidth(): number { return this.maxX - this.minX; }

  public get width(): number { return this.getWidth(); }

  /**
   * The height of the bounds, defined as maxY - minY.
   */
  public getHeight(): number { return this.maxY - this.minY; }

  public get height(): number { return this.getHeight(); }

  /*
   * Convenience positions
   * upper is in terms of the visual layout in Scenery and other programs, so the minY is the "upper", and minY is the "lower"
   *
   *             minX (x)     centerX        maxX
   *          ---------------------------------------
   * minY (y) | leftTop     centerTop     rightTop
   * centerY  | leftCenter  center        rightCenter
   * maxY     | leftBottom  centerBottom  rightBottom
   */

  /**
   * Alias for minX, when thinking of the bounds as an (x,y,width,height) rectangle.
   */
  public getX(): number { return this.minX; }

  public get x(): number { return this.getX(); }

  /**
   * Alias for minY, when thinking of the bounds as an (x,y,width,height) rectangle.
   */
  public getY(): number { return this.minY; }

  public get y(): number { return this.getY(); }

  /**
   * Alias for minX, supporting the explicit getter function style.
   */
  public getMinX(): number { return this.minX; }

  /**
   * Alias for minY, supporting the explicit getter function style.
   */
  public getMinY(): number { return this.minY; }

  /**
   * Alias for maxX, supporting the explicit getter function style.
   */
  public getMaxX(): number { return this.maxX; }

  /**
   * Alias for maxY, supporting the explicit getter function style.
   */
  public getMaxY(): number { return this.maxY; }

  /**
   * Alias for minX, when thinking in the UI-layout manner.
   */
  public getLeft(): number { return this.minX; }

  public get left(): number { return this.minX; }

  /**
   * Alias for minY, when thinking in the UI-layout manner.
   */
  public getTop(): number { return this.minY; }

  public get top(): number { return this.minY; }

  /**
   * Alias for maxX, when thinking in the UI-layout manner.
   */
  public getRight(): number { return this.maxX; }

  public get right(): number { return this.maxX; }

  /**
   * Alias for maxY, when thinking in the UI-layout manner.
   */
  public getBottom(): number { return this.maxY; }

  public get bottom(): number { return this.maxY; }

  /**
   * The horizontal (X-coordinate) center of the bounds, averaging the minX and maxX.
   */
  public getCenterX(): number { return ( this.maxX + this.minX ) / 2; }

  public get centerX(): number { return this.getCenterX(); }

  /**
   * The vertical (Y-coordinate) center of the bounds, averaging the minY and maxY.
   */
  public getCenterY(): number { return ( this.maxY + this.minY ) / 2; }

  public get centerY(): number { return this.getCenterY(); }

  /**
   * The point (minX, minY), in the UI-coordinate upper-left.
   */
  public getLeftTop(): Vector2 { return new Vector2( this.minX, this.minY ); }

  public get leftTop(): Vector2 { return this.getLeftTop(); }

  /**
   * The point (centerX, minY), in the UI-coordinate upper-center.
   */
  public getCenterTop(): Vector2 { return new Vector2( this.getCenterX(), this.minY ); }

  public get centerTop(): Vector2 { return this.getCenterTop(); }

  /**
   * The point (right, minY), in the UI-coordinate upper-right.
   */
  public getRightTop(): Vector2 { return new Vector2( this.maxX, this.minY ); }

  public get rightTop(): Vector2 { return this.getRightTop(); }

  /**
   * The point (left, centerY), in the UI-coordinate center-left.
   */
  public getLeftCenter(): Vector2 { return new Vector2( this.minX, this.getCenterY() ); }

  public get leftCenter(): Vector2 { return this.getLeftCenter(); }

  /**
   * The point (centerX, centerY), in the center of the bounds.
   */
  public getCenter(): Vector2 { return new Vector2( this.getCenterX(), this.getCenterY() ); }

  public get center(): Vector2 { return this.getCenter(); }

  /**
   * The point (maxX, centerY), in the UI-coordinate center-right
   */
  public getRightCenter(): Vector2 { return new Vector2( this.maxX, this.getCenterY() ); }

  public get rightCenter(): Vector2 { return this.getRightCenter(); }

  /**
   * The point (minX, maxY), in the UI-coordinate lower-left
   */
  public getLeftBottom(): Vector2 { return new Vector2( this.minX, this.maxY ); }

  public get leftBottom(): Vector2 { return this.getLeftBottom(); }

  /**
   * The point (centerX, maxY), in the UI-coordinate lower-center
   */
  public getCenterBottom(): Vector2 { return new Vector2( this.getCenterX(), this.maxY ); }

  public get centerBottom(): Vector2 { return this.getCenterBottom(); }

  /**
   * The point (maxX, maxY), in the UI-coordinate lower-right
   */
  public getRightBottom(): Vector2 { return new Vector2( this.maxX, this.maxY ); }

  public get rightBottom(): Vector2 { return this.getRightBottom(); }

  /**
   * Whether we have negative width or height. Bounds2.NOTHING is a prime example of an empty Bounds2.
   * Bounds with width = height = 0 are considered not empty, since they include the single (0,0) point.
   */
  public isEmpty(): boolean { return this.getWidth() < 0 || this.getHeight() < 0; }

  /**
   * Whether our minimums and maximums are all finite numbers. This will exclude Bounds2.NOTHING and Bounds2.EVERYTHING.
   */
  public isFinite(): boolean {
    return isFinite( this.minX ) && isFinite( this.minY ) && isFinite( this.maxX ) && isFinite( this.maxY );
  }

  /**
   * Whether this bounds has a non-zero area (non-zero positive width and height).
   */
  public hasNonzeroArea(): boolean {
    return this.getWidth() > 0 && this.getHeight() > 0;
  }

  /**
   * Whether this bounds has a finite and non-negative width and height.
   */
  public isValid(): boolean {
    return !this.isEmpty() && this.isFinite();
  }

  /**
   * If the point is inside the bounds, the point will be returned. Otherwise, this will return a new point
   * on the edge of the bounds that is the closest to the provided point.
   */
  public closestPointTo( point: Vector2 ): Vector2 {
    if ( this.containsCoordinates( point.x, point.y ) ) {
      return point;
    }
    else {
      return this.getConstrainedPoint( point );
    }
  }

  /**
   * Find the point on the boundary of the Bounds2 that is closest to the provided point.
   */
  public closestBoundaryPointTo( point: Vector2 ): Vector2 {
    if ( this.containsCoordinates( point.x, point.y ) ) {
      const closestXEdge = point.x < this.centerX ? this.minX : this.maxX;
      const closestYEdge = point.y < this.centerY ? this.minY : this.maxY;

      // Decide which cardinal direction to go based on simple distance.
      if ( Math.abs( closestXEdge - point.x ) < Math.abs( closestYEdge - point.y ) ) {
        return new Vector2( closestXEdge, point.y );
      }
      else {
        return new Vector2( point.x, closestYEdge );
      }
    }
    else {
      return this.getConstrainedPoint( point );
    }
  }

  /**
   * Give a point outside of this Bounds2, constrain it to a point on the boundary of this Bounds2.
   */
  public getConstrainedPoint( point: Vector2 ): Vector2 {
    const xConstrained = Math.max( Math.min( point.x, this.maxX ), this.x );
    const yConstrained = Math.max( Math.min( point.y, this.maxY ), this.y );
    return new Vector2( xConstrained, yConstrained );
  }

  /**
   * Whether the coordinates are contained inside the bounding box, or are on the boundary.
   *
   * @param x - X coordinate of the point to check
   * @param y - Y coordinate of the point to check
   */
  public containsCoordinates( x: number, y: number ): boolean {
    return this.minX <= x && x <= this.maxX && this.minY <= y && y <= this.maxY;
  }

  /**
   * Whether the point is contained inside the bounding box, or is on the boundary.
   */
  public containsPoint( point: Vector2 ): boolean {
    return this.containsCoordinates( point.x, point.y );
  }

  /**
   * Whether this bounding box completely contains the bounding box passed as a parameter. The boundary of a box is
   * considered to be "contained".
   */
  public containsBounds( bounds: Bounds2 ): boolean {
    return this.minX <= bounds.minX && this.maxX >= bounds.maxX && this.minY <= bounds.minY && this.maxY >= bounds.maxY;
  }

  /**
   * Whether this and another bounding box have any points of intersection (including touching boundaries).
   */
  public intersectsBounds( bounds: Bounds2 ): boolean {
    const minX = Math.max( this.minX, bounds.minX );
    const minY = Math.max( this.minY, bounds.minY );
    const maxX = Math.min( this.maxX, bounds.maxX );
    const maxY = Math.min( this.maxY, bounds.maxY );
    return ( maxX - minX ) >= 0 && ( maxY - minY >= 0 );
  }

  /**
   * The squared distance from the input point to the point closest to it inside the bounding box.
   */
  public minimumDistanceToPointSquared( point: Vector2 ): number {
    const closeX = point.x < this.minX ? this.minX : ( point.x > this.maxX ? this.maxX : null );
    const closeY = point.y < this.minY ? this.minY : ( point.y > this.maxY ? this.maxY : null );
    let d;
    if ( closeX === null && closeY === null ) {
      // inside, or on the boundary
      return 0;
    }
    else if ( closeX === null ) {
      // vertically directly above/below
      d = closeY! - point.y;
      return d * d;
    }
    else if ( closeY === null ) {
      // horizontally directly to the left/right
      d = closeX - point.x;
      return d * d;
    }
    else {
      // corner case
      const dx = closeX - point.x;
      const dy = closeY - point.y;
      return dx * dx + dy * dy;
    }
  }

  /**
   * The squared distance from the input point to the point furthest from it inside the bounding box.
   */
  public maximumDistanceToPointSquared( point: Vector2 ): number {
    let x = point.x > this.getCenterX() ? this.minX : this.maxX;
    let y = point.y > this.getCenterY() ? this.minY : this.maxY;
    x -= point.x;
    y -= point.y;
    return x * x + y * y;
  }

  /**
   * Debugging string for the bounds.
   */
  public toString(): string {
    return `[x:(${this.minX},${this.maxX}),y:(${this.minY},${this.maxY})]`;
  }

  /**
   * Exact equality comparison between this bounds and another bounds.
   *
   * @returns - Whether the two bounds are equal
   */
  public equals( other: Bounds2 ): boolean {
    return this.minX === other.minX && this.minY === other.minY && this.maxX === other.maxX && this.maxY === other.maxY;
  }

  /**
   * Approximate equality comparison between this bounds and another bounds.
   *
   * @returns - Whether difference between the two bounds has no min/max with an absolute value greater
   *            than epsilon.
   */
  public equalsEpsilon( other: Bounds2, epsilon: number ): boolean {
    epsilon = epsilon !== undefined ? epsilon : 0;
    const thisFinite = this.isFinite();
    const otherFinite = other.isFinite();
    if ( thisFinite && otherFinite ) {
      // both are finite, so we can use Math.abs() - it would fail with non-finite values like Infinity
      return Math.abs( this.minX - other.minX ) < epsilon &&
             Math.abs( this.minY - other.minY ) < epsilon &&
             Math.abs( this.maxX - other.maxX ) < epsilon &&
             Math.abs( this.maxY - other.maxY ) < epsilon;
    }
    else if ( thisFinite !== otherFinite ) {
      return false; // one is finite, the other is not. definitely not equal
    }
    else if ( ( this as unknown as Bounds2 ) === other ) {
      return true; // exact same instance, must be equal
    }
    else {
      // epsilon only applies on finite dimensions. due to JS's handling of isFinite(), it's faster to check the sum of both
      return ( isFinite( this.minX + other.minX ) ? ( Math.abs( this.minX - other.minX ) < epsilon ) : ( this.minX === other.minX ) ) &&
             ( isFinite( this.minY + other.minY ) ? ( Math.abs( this.minY - other.minY ) < epsilon ) : ( this.minY === other.minY ) ) &&
             ( isFinite( this.maxX + other.maxX ) ? ( Math.abs( this.maxX - other.maxX ) < epsilon ) : ( this.maxX === other.maxX ) ) &&
             ( isFinite( this.maxY + other.maxY ) ? ( Math.abs( this.maxY - other.maxY ) < epsilon ) : ( this.maxY === other.maxY ) );
    }
  }

  /*---------------------------------------------------------------------------*
   * Immutable operations
   *---------------------------------------------------------------------------*/

  /**
   * Creates a copy of this bounds, or if a bounds is passed in, set that bounds's values to ours.
   *
   * This is the immutable form of the function set(), if a bounds is provided. This will return a new bounds, and
   * will not modify this bounds.
   *
   * @param [bounds] - If not provided, creates a new Bounds2 with filled in values. Otherwise, fills in the
   *                   values of the provided bounds so that it equals this bounds.
   */
  public copy( bounds?: Bounds2 ): Bounds2 {
    if ( bounds ) {
      return bounds.set( this as unknown as Bounds2 );
    }
    else {
      return b2( this.minX, this.minY, this.maxX, this.maxY );
    }
  }

  /**
   * The smallest bounds that contains both this bounds and the input bounds, returned as a copy.
   *
   * This is the immutable form of the function includeBounds(). This will return a new bounds, and will not modify
   * this bounds.
   */
  public union( bounds: Bounds2 ): Bounds2 {
    return b2(
      Math.min( this.minX, bounds.minX ),
      Math.min( this.minY, bounds.minY ),
      Math.max( this.maxX, bounds.maxX ),
      Math.max( this.maxY, bounds.maxY )
    );
  }

  /**
   * The smallest bounds that is contained by both this bounds and the input bounds, returned as a copy.
   *
   * This is the immutable form of the function constrainBounds(). This will return a new bounds, and will not modify
   * this bounds.
   */
  public intersection( bounds: Bounds2 ): Bounds2 {
    return b2(
      Math.max( this.minX, bounds.minX ),
      Math.max( this.minY, bounds.minY ),
      Math.min( this.maxX, bounds.maxX ),
      Math.min( this.maxY, bounds.maxY )
    );
  }

  // TODO: difference should be well-defined, but more logic is needed to compute

  /**
   * The smallest bounds that contains this bounds and the point (x,y), returned as a copy.
   *
   * This is the immutable form of the function addCoordinates(). This will return a new bounds, and will not modify
   * this bounds.
   */
  public withCoordinates( x: number, y: number ): Bounds2 {
    return b2(
      Math.min( this.minX, x ),
      Math.min( this.minY, y ),
      Math.max( this.maxX, x ),
      Math.max( this.maxY, y )
    );
  }

  /**
   * The smallest bounds that contains this bounds and the input point, returned as a copy.
   *
   * This is the immutable form of the function addPoint(). This will return a new bounds, and will not modify
   * this bounds.
   */
  public withPoint( point: Vector2 ): Bounds2 {
    return this.withCoordinates( point.x, point.y );
  }

  /**
   * Returns the smallest bounds that contains both this bounds and the x value provided.
   *
   * This is the immutable form of the function addX(). This will return a new bounds, and will not modify
   * this bounds.
   */
  public withX( x: number ): Bounds2 {
    return this.copy().addX( x );
  }

  /**
   * Returns the smallest bounds that contains both this bounds and the y value provided.
   *
   * This is the immutable form of the function addY(). This will return a new bounds, and will not modify
   * this bounds.
   */
  public withY( y: number ): Bounds2 {
    return this.copy().addY( y );
  }

  /**
   * A copy of this bounds, with minX replaced with the input.
   *
   * This is the immutable form of the function setMinX(). This will return a new bounds, and will not modify
   * this bounds.
   */
  public withMinX( minX: number ): Bounds2 {
    return b2( minX, this.minY, this.maxX, this.maxY );
  }

  /**
   * A copy of this bounds, with minY replaced with the input.
   *
   * This is the immutable form of the function setMinY(). This will return a new bounds, and will not modify
   * this bounds.
   */
  public withMinY( minY: number ): Bounds2 {
    return b2( this.minX, minY, this.maxX, this.maxY );
  }

  /**
   * A copy of this bounds, with maxX replaced with the input.
   *
   * This is the immutable form of the function setMaxX(). This will return a new bounds, and will not modify
   * this bounds.
   */
  public withMaxX( maxX: number ): Bounds2 {
    return b2( this.minX, this.minY, maxX, this.maxY );
  }

  /**
   * A copy of this bounds, with maxY replaced with the input.
   *
   * This is the immutable form of the function setMaxY(). This will return a new bounds, and will not modify
   * this bounds.
   */
  public withMaxY( maxY: number ): Bounds2 {
    return b2( this.minX, this.minY, this.maxX, maxY );
  }

  /**
   * A copy of this bounds, with the minimum values rounded down to the nearest integer, and the maximum values
   * rounded up to the nearest integer. This causes the bounds to expand as necessary so that its boundaries
   * are integer-aligned.
   *
   * This is the immutable form of the function roundOut(). This will return a new bounds, and will not modify
   * this bounds.
   */
  public roundedOut(): Bounds2 {
    return b2(
      Math.floor( this.minX ),
      Math.floor( this.minY ),
      Math.ceil( this.maxX ),
      Math.ceil( this.maxY )
    );
  }

  /**
   * A copy of this bounds, with the minimum values rounded up to the nearest integer, and the maximum values
   * rounded down to the nearest integer. This causes the bounds to contract as necessary so that its boundaries
   * are integer-aligned.
   *
   * This is the immutable form of the function roundIn(). This will return a new bounds, and will not modify
   * this bounds.
   */
  public roundedIn(): Bounds2 {
    return b2(
      Math.ceil( this.minX ),
      Math.ceil( this.minY ),
      Math.floor( this.maxX ),
      Math.floor( this.maxY )
    );
  }

  /**
   * A bounding box (still axis-aligned) that contains the transformed shape of this bounds, applying the matrix as
   * an affine transformation.
   *
   * NOTE: bounds.transformed( matrix ).transformed( inverse ) may be larger than the original box, if it includes
   * a rotation that isn't a multiple of $\pi/2$. This is because the returned bounds may expand in area to cover
   * ALL of the corners of the transformed bounding box.
   *
   * This is the immutable form of the function transform(). This will return a new bounds, and will not modify
   * this bounds.
   */
  public transformed( matrix: Matrix3 ): Bounds2 {
    return this.copy().transform( matrix );
  }

  /**
   * A bounding box that is expanded on all sides by the specified amount.)
   *
   * This is the immutable form of the function dilate(). This will return a new bounds, and will not modify
   * this bounds.
   */
  public dilated( d: number ): Bounds2 {
    return this.dilatedXY( d, d );
  }

  /**
   * A bounding box that is expanded horizontally (on the left and right) by the specified amount.
   *
   * This is the immutable form of the function dilateX(). This will return a new bounds, and will not modify
   * this bounds.
   */
  public dilatedX( x: number ): Bounds2 {
    return b2( this.minX - x, this.minY, this.maxX + x, this.maxY );
  }

  /**
   * A bounding box that is expanded vertically (on the top and bottom) by the specified amount.
   *
   * This is the immutable form of the function dilateY(). This will return a new bounds, and will not modify
   * this bounds.
   */
  public dilatedY( y: number ): Bounds2 {
    return b2( this.minX, this.minY - y, this.maxX, this.maxY + y );
  }

  /**
   * A bounding box that is expanded on all sides, with different amounts of expansion horizontally and vertically.
   * Will be identical to the bounds returned by calling bounds.dilatedX( x ).dilatedY( y ).
   *
   * This is the immutable form of the function dilateXY(). This will return a new bounds, and will not modify
   * this bounds.
   *
   * @param x - Amount to dilate horizontally (for each side)
   * @param y - Amount to dilate vertically (for each side)
   */
  public dilatedXY( x: number, y: number ): Bounds2 {
    return b2( this.minX - x, this.minY - y, this.maxX + x, this.maxY + y );
  }

  /**
   * A bounding box that is contracted on all sides by the specified amount.
   *
   * This is the immutable form of the function erode(). This will return a new bounds, and will not modify
   * this bounds.
   */
  public eroded( amount: number ): Bounds2 { return this.dilated( -amount ); }

  /**
   * A bounding box that is contracted horizontally (on the left and right) by the specified amount.
   *
   * This is the immutable form of the function erodeX(). This will return a new bounds, and will not modify
   * this bounds.
   */
  public erodedX( x: number ): Bounds2 { return this.dilatedX( -x ); }

  /**
   * A bounding box that is contracted vertically (on the top and bottom) by the specified amount.
   *
   * This is the immutable form of the function erodeY(). This will return a new bounds, and will not modify
   * this bounds.
   */
  public erodedY( y: number ): Bounds2 { return this.dilatedY( -y ); }

  /**
   * A bounding box that is contracted on all sides, with different amounts of contraction horizontally and vertically.
   *
   * This is the immutable form of the function erodeXY(). This will return a new bounds, and will not modify
   * this bounds.
   *
   * @param x - Amount to erode horizontally (for each side)
   * @param y - Amount to erode vertically (for each side)
   */
  public erodedXY( x: number, y: number ): Bounds2 { return this.dilatedXY( -x, -y ); }

  /**
   * A bounding box that is expanded by a specific amount on all sides (or if some offsets are negative, will contract
   * those sides).
   *
   * This is the immutable form of the function offset(). This will return a new bounds, and will not modify
   * this bounds.
   *
   * @param left - Amount to expand to the left (subtracts from minX)
   * @param top - Amount to expand to the top (subtracts from minY)
   * @param right - Amount to expand to the right (adds to maxX)
   * @param bottom - Amount to expand to the bottom (adds to maxY)
   */
  public withOffsets( left: number, top: number, right: number, bottom: number ): Bounds2 {
    return b2( this.minX - left, this.minY - top, this.maxX + right, this.maxY + bottom );
  }

  /**
   * Our bounds, translated horizontally by x, returned as a copy.
   *
   * This is the immutable form of the function shiftX(). This will return a new bounds, and will not modify
   * this bounds.
   */
  public shiftedX( x: number ): Bounds2 {
    return b2( this.minX + x, this.minY, this.maxX + x, this.maxY );
  }

  /**
   * Our bounds, translated vertically by y, returned as a copy.
   *
   * This is the immutable form of the function shiftY(). This will return a new bounds, and will not modify
   * this bounds.
   */
  public shiftedY( y: number ): Bounds2 {
    return b2( this.minX, this.minY + y, this.maxX, this.maxY + y );
  }

  /**
   * Our bounds, translated by (x,y), returned as a copy.
   *
   * This is the immutable form of the function shift(). This will return a new bounds, and will not modify
   * this bounds.
   */
  public shiftedXY( x: number, y: number ): Bounds2 {
    return b2( this.minX + x, this.minY + y, this.maxX + x, this.maxY + y );
  }

  /**
   * Returns our bounds, translated by a vector, returned as a copy.
   */
  public shifted( v: Vector2 ): Bounds2 {
    return this.shiftedXY( v.x, v.y );
  }

  /**
   * Returns an interpolated value of this bounds and the argument.
   *
   * @param bounds
   * @param ratio - 0 will result in a copy of `this`, 1 will result in bounds, and in-between controls the
   *                         amount of each.
   */
  public blend( bounds: Bounds2, ratio: number ): Bounds2 {
    const t = 1 - ratio;
    return b2(
      t * this.minX + ratio * bounds.minX,
      t * this.minY + ratio * bounds.minY,
      t * this.maxX + ratio * bounds.maxX,
      t * this.maxY + ratio * bounds.maxY
    );
  }

  /*---------------------------------------------------------------------------*
   * Mutable operations
   *
   * All mutable operations should call one of the following:
   *   setMinMax, setMinX, setMinY, setMaxX, setMaxY
   *---------------------------------------------------------------------------*/

  /**
   * Sets each value for this bounds, and returns itself.
   */
  public setMinMax( minX: number, minY: number, maxX: number, maxY: number ): Bounds2 {
    this.minX = minX;
    this.minY = minY;
    this.maxX = maxX;
    this.maxY = maxY;
    return ( this as unknown as Bounds2 );
  }

  /**
   * Sets the value of minX.
   *
   * This is the mutable form of the function withMinX(). This will mutate (change) this bounds, in addition to returning
   * this bounds itself.
   */
  public setMinX( minX: number ): Bounds2 {
    this.minX = minX;
    return ( this as unknown as Bounds2 );
  }

  /**
   * Sets the value of minY.
   *
   * This is the mutable form of the function withMinY(). This will mutate (change) this bounds, in addition to returning
   * this bounds itself.
   */
  public setMinY( minY: number ): Bounds2 {
    this.minY = minY;
    return ( this as unknown as Bounds2 );
  }

  /**
   * Sets the value of maxX.
   *
   * This is the mutable form of the function withMaxX(). This will mutate (change) this bounds, in addition to returning
   * this bounds itself.
   */
  public setMaxX( maxX: number ): Bounds2 {
    this.maxX = maxX;
    return ( this as unknown as Bounds2 );
  }

  /**
   * Sets the value of maxY.
   *
   * This is the mutable form of the function withMaxY(). This will mutate (change) this bounds, in addition to returning
   * this bounds itself.
   */
  public setMaxY( maxY: number ): Bounds2 {
    this.maxY = maxY;
    return ( this as unknown as Bounds2 );
  }

  /**
   * Sets the values of this bounds to be equal to the input bounds.
   *
   * This is the mutable form of the function copy(). This will mutate (change) this bounds, in addition to returning
   * this bounds itself.
   */
  public set( bounds: Bounds2 ): Bounds2 {
    return this.setMinMax( bounds.minX, bounds.minY, bounds.maxX, bounds.maxY );
  }

  /**
   * Modifies this bounds so that it contains both its original bounds and the input bounds.
   *
   * This is the mutable form of the function union(). This will mutate (change) this bounds, in addition to returning
   * this bounds itself.
   */
  public includeBounds( bounds: Bounds2 ): Bounds2 {
    return this.setMinMax(
      Math.min( this.minX, bounds.minX ),
      Math.min( this.minY, bounds.minY ),
      Math.max( this.maxX, bounds.maxX ),
      Math.max( this.maxY, bounds.maxY )
    );
  }

  /**
   * Modifies this bounds so that it is the largest bounds contained both in its original bounds and in the input bounds.
   *
   * This is the mutable form of the function intersection(). This will mutate (change) this bounds, in addition to returning
   * this bounds itself.
   */
  public constrainBounds( bounds: Bounds2 ): Bounds2 {
    return this.setMinMax(
      Math.max( this.minX, bounds.minX ),
      Math.max( this.minY, bounds.minY ),
      Math.min( this.maxX, bounds.maxX ),
      Math.min( this.maxY, bounds.maxY )
    );
  }

  /**
   * Modifies this bounds so that it contains both its original bounds and the input point (x,y).
   *
   * This is the mutable form of the function withCoordinates(). This will mutate (change) this bounds, in addition to returning
   * this bounds itself.
   */
  public addCoordinates( x: number, y: number ): Bounds2 {
    return this.setMinMax(
      Math.min( this.minX, x ),
      Math.min( this.minY, y ),
      Math.max( this.maxX, x ),
      Math.max( this.maxY, y )
    );
  }

  /**
   * Modifies this bounds so that it contains both its original bounds and the input point.
   *
   * This is the mutable form of the function withPoint(). This will mutate (change) this bounds, in addition to returning
   * this bounds itself.
   */
  public addPoint( point: Vector2 ): Bounds2 {
    return this.addCoordinates( point.x, point.y );
  }

  /**
   * Modifies this bounds so that it is guaranteed to include the given x value (if it didn't already). If the x value
   * was already contained, nothing will be done.
   *
   * This is the mutable form of the function withX(). This will mutate (change) this bounds, in addition to returning
   * this bounds itself.
   */
  public addX( x: number ): Bounds2 {
    this.minX = Math.min( x, this.minX );
    this.maxX = Math.max( x, this.maxX );
    return ( this as unknown as Bounds2 );
  }

  /**
   * Modifies this bounds so that it is guaranteed to include the given y value (if it didn't already). If the y value
   * was already contained, nothing will be done.
   *
   * This is the mutable form of the function withY(). This will mutate (change) this bounds, in addition to returning
   * this bounds itself.
   */
  public addY( y: number ): Bounds2 {
    this.minY = Math.min( y, this.minY );
    this.maxY = Math.max( y, this.maxY );
    return ( this as unknown as Bounds2 );
  }

  /**
   * Modifies this bounds so that its boundaries are integer-aligned, rounding the minimum boundaries down and the
   * maximum boundaries up (expanding as necessary).
   *
   * This is the mutable form of the function roundedOut(). This will mutate (change) this bounds, in addition to returning
   * this bounds itself.
   */
  public roundOut(): Bounds2 {
    return this.setMinMax(
      Math.floor( this.minX ),
      Math.floor( this.minY ),
      Math.ceil( this.maxX ),
      Math.ceil( this.maxY )
    );
  }

  /**
   * Modifies this bounds so that its boundaries are integer-aligned, rounding the minimum boundaries up and the
   * maximum boundaries down (contracting as necessary).
   *
   * This is the mutable form of the function roundedIn(). This will mutate (change) this bounds, in addition to returning
   * this bounds itself.
   */
  public roundIn(): Bounds2 {
    return this.setMinMax(
      Math.ceil( this.minX ),
      Math.ceil( this.minY ),
      Math.floor( this.maxX ),
      Math.floor( this.maxY )
    );
  }

  /**
   * Modifies this bounds so that it would fully contain a transformed version if its previous value, applying the
   * matrix as an affine transformation.
   *
   * NOTE: bounds.transform( matrix ).transform( inverse ) may be larger than the original box, if it includes
   * a rotation that isn't a multiple of $\pi/2$. This is because the bounds may expand in area to cover
   * ALL of the corners of the transformed bounding box.
   *
   * This is the mutable form of the function transformed(). This will mutate (change) this bounds, in addition to returning
   * this bounds itself.
   */
  public transform( matrix: Matrix3 ): Bounds2 {
    // if we contain no area, no change is needed
    if ( this.isEmpty() ) {
      return ( this as unknown as Bounds2 );
    }

    // optimization to bail for identity matrices
    if ( matrix.isIdentity() ) {
      return ( this as unknown as Bounds2 );
    }

    const minX = this.minX;
    const minY = this.minY;
    const maxX = this.maxX;
    const maxY = this.maxY;
    this.set( Bounds2.NOTHING );

    // using mutable vector so we don't create excessive instances of Vector2 during this
    // make sure all 4 corners are inside this transformed bounding box

    this.addPoint( matrix.multiplyVector2( scratchVector2.setXY( minX, minY ) ) );
    this.addPoint( matrix.multiplyVector2( scratchVector2.setXY( minX, maxY ) ) );
    this.addPoint( matrix.multiplyVector2( scratchVector2.setXY( maxX, minY ) ) );
    this.addPoint( matrix.multiplyVector2( scratchVector2.setXY( maxX, maxY ) ) );
    return ( this as unknown as Bounds2 );
  }

  /**
   * Expands this bounds on all sides by the specified amount.
   *
   * This is the mutable form of the function dilated(). This will mutate (change) this bounds, in addition to returning
   * this bounds itself.
   */
  public dilate( d: number ): Bounds2 {
    return this.dilateXY( d, d );
  }

  /**
   * Expands this bounds horizontally (left and right) by the specified amount.
   *
   * This is the mutable form of the function dilatedX(). This will mutate (change) this bounds, in addition to returning
   * this bounds itself.
   */
  public dilateX( x: number ): Bounds2 {
    return this.setMinMax( this.minX - x, this.minY, this.maxX + x, this.maxY );
  }

  /**
   * Expands this bounds vertically (top and bottom) by the specified amount.
   *
   * This is the mutable form of the function dilatedY(). This will mutate (change) this bounds, in addition to returning
   * this bounds itself.
   */
  public dilateY( y: number ): Bounds2 {
    return this.setMinMax( this.minX, this.minY - y, this.maxX, this.maxY + y );
  }

  /**
   * Expands this bounds independently in the horizontal and vertical directions. Will be equal to calling
   * bounds.dilateX( x ).dilateY( y ).
   *
   * This is the mutable form of the function dilatedXY(). This will mutate (change) this bounds, in addition to returning
   * this bounds itself.
   */
  public dilateXY( x: number, y: number ): Bounds2 {
    return this.setMinMax( this.minX - x, this.minY - y, this.maxX + x, this.maxY + y );
  }

  /**
   * Contracts this bounds on all sides by the specified amount.
   *
   * This is the mutable form of the function eroded(). This will mutate (change) this bounds, in addition to returning
   * this bounds itself.
   */
  public erode( d: number ): Bounds2 { return this.dilate( -d ); }

  /**
   * Contracts this bounds horizontally (left and right) by the specified amount.
   *
   * This is the mutable form of the function erodedX(). This will mutate (change) this bounds, in addition to returning
   * this bounds itself.
   */
  public erodeX( x: number ): Bounds2 { return this.dilateX( -x ); }

  /**
   * Contracts this bounds vertically (top and bottom) by the specified amount.
   *
   * This is the mutable form of the function erodedY(). This will mutate (change) this bounds, in addition to returning
   * this bounds itself.
   */
  public erodeY( y: number ): Bounds2 { return this.dilateY( -y ); }

  /**
   * Contracts this bounds independently in the horizontal and vertical directions. Will be equal to calling
   * bounds.erodeX( x ).erodeY( y ).
   *
   * This is the mutable form of the function erodedXY(). This will mutate (change) this bounds, in addition to returning
   * this bounds itself.
   */
  public erodeXY( x: number, y: number ): Bounds2 { return this.dilateXY( -x, -y ); }

  /**
   * Expands this bounds independently for each side (or if some offsets are negative, will contract those sides).
   *
   * This is the mutable form of the function withOffsets(). This will mutate (change) this bounds, in addition to
   * returning this bounds itself.
   *
   * @param left - Amount to expand to the left (subtracts from minX)
   * @param top - Amount to expand to the top (subtracts from minY)
   * @param right - Amount to expand to the right (adds to maxX)
   * @param bottom - Amount to expand to the bottom (adds to maxY)
   */
  public offset( left: number, top: number, right: number, bottom: number ): Bounds2 {
    return b2( this.minX - left, this.minY - top, this.maxX + right, this.maxY + bottom );
  }

  /**
   * Translates our bounds horizontally by x.
   *
   * This is the mutable form of the function shiftedX(). This will mutate (change) this bounds, in addition to returning
   * this bounds itself.
   */
  public shiftX( x: number ): Bounds2 {
    return this.setMinMax( this.minX + x, this.minY, this.maxX + x, this.maxY );
  }

  /**
   * Translates our bounds vertically by y.
   *
   * This is the mutable form of the function shiftedY(). This will mutate (change) this bounds, in addition to returning
   * this bounds itself.
   */
  public shiftY( y: number ): Bounds2 {
    return this.setMinMax( this.minX, this.minY + y, this.maxX, this.maxY + y );
  }

  /**
   * Translates our bounds by (x,y).
   *
   * This is the mutable form of the function shifted(). This will mutate (change) this bounds, in addition to returning
   * this bounds itself.
   */
  public shiftXY( x: number, y: number ): Bounds2 {
    return this.setMinMax( this.minX + x, this.minY + y, this.maxX + x, this.maxY + y );
  }

  /**
   * Translates our bounds by the given vector.
   */
  public shift( v: Vector2 ): Bounds2 {
    return this.shiftXY( v.x, v.y );
  }

  /**
   * Returns the range of the x-values of this bounds.
   */
  public getXRange(): Range {
    return new Range( this.minX, this.maxX );
  }

  /**
   * Sets the x-range of this bounds.
   */
  public setXRange( range: Range ): Bounds2 {
    return this.setMinMax( range.min, this.minY, range.max, this.maxY );
  }

  public get xRange(): Range { return this.getXRange(); }

  public set xRange( range: Range ) { this.setXRange( range ); }

  /**
   * Returns the range of the y-values of this bounds.
   */
  public getYRange(): Range {
    return new Range( this.minY, this.maxY );
  }

  /**
   * Sets the y-range of this bounds.
   */
  public setYRange( range: Range ): Bounds2 {
    return this.setMinMax( this.minX, range.min, this.maxX, range.max );
  }

  public get yRange(): Range { return this.getYRange(); }

  public set yRange( range: Range ) { this.setYRange( range ); }

  /**
   * Find a point in the bounds closest to the specified point.
   *
   * @param x - X coordinate of the point to test.
   * @param y - Y coordinate of the point to test.
   * @param [result] - Vector2 that can store the return value to avoid allocations.
   */
  public getClosestPoint( x: number, y: number, result?: Vector2 ): Vector2 {
    if ( result ) {
      result.setXY( x, y );
    }
    else {
      result = new Vector2( x, y );
    }
    if ( result.x < this.minX ) { result.x = this.minX; }
    if ( result.x > this.maxX ) { result.x = this.maxX; }
    if ( result.y < this.minY ) { result.y = this.minY; }
    if ( result.y > this.maxY ) { result.y = this.maxY; }
    return result;
  }

  public freeToPool(): void {
    Bounds2.pool.freeToPool( this );
  }

  public static readonly pool = new Pool( Bounds2, {
    initialize: Bounds2.prototype.setMinMax,
    defaultArguments: [ Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY ]
  } );

  /**
   * Returns a new Bounds2 object, with the familiar rectangle construction with x, y, width, and height.
   *
   * @param x - The minimum value of X for the bounds.
   * @param y - The minimum value of Y for the bounds.
   * @param width - The width (maxX - minX) of the bounds.
   * @param height - The height (maxY - minY) of the bounds.
   */
  public static rect( x: number, y: number, width: number, height: number ): Bounds2 {
    return b2( x, y, x + width, y + height );
  }

  /**
   * Returns a new Bounds2 object with a given orientation (min/max specified for both the given (primary) orientation,
   * and also the secondary orientation).
   */
  public static oriented( orientation: Orientation, minPrimary: number, minSecondary: number, maxPrimary: number, maxSecondary: number ): Bounds2 {
    return orientation === Orientation.HORIZONTAL ? new Bounds2(
      minPrimary,
      minSecondary,
      maxPrimary,
      maxSecondary
    ) : new Bounds2(
      minSecondary,
      minPrimary,
      maxSecondary,
      maxPrimary
    );
  }

  /**
   * Returns a new Bounds2 object that only contains the specified point (x,y). Useful for being dilated to form a
   * bounding box around a point. Note that the bounds will not be "empty" as it contains (x,y), but it will have
   * zero area. The x and y coordinates can be specified by numbers or with at Vector2
   *
   * @param x
   * @param y
   */
  public static point( x: number, y: number ): Bounds2;
  static point( v: Vector2 ): Bounds2; // eslint-disable-line @typescript-eslint/explicit-member-accessibility
  static point( x: Vector2 | number, y?: number ): Bounds2 { // eslint-disable-line @typescript-eslint/explicit-member-accessibility
    if ( x instanceof Vector2 ) {
      const p = x;
      return b2( p.x, p.y, p.x, p.y );
    }
    else {
      return b2( x, y!, x, y! );
    }
  }

  // Helps to identify the dimension of the bounds
  public isBounds!: boolean;
  public dimension?: number;

  /**
   * A constant Bounds2 with minimums = $\infty$, maximums = $-\infty$, so that it represents "no bounds whatsoever".
   *
   * This allows us to take the union (union/includeBounds) of this and any other Bounds2 to get the other bounds back,
   * e.g. Bounds2.NOTHING.union( bounds ).equals( bounds ). This object naturally serves as the base case as a union of
   * zero bounds objects.
   *
   * Additionally, intersections with NOTHING will always return a Bounds2 equivalent to NOTHING.
   */
  public static readonly NOTHING = new Bounds2( Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY );

  /**
   * A constant Bounds2 with minimums = $-\infty$, maximums = $\infty$, so that it represents "all bounds".
   *
   * This allows us to take the intersection (intersection/constrainBounds) of this and any other Bounds2 to get the
   * other bounds back, e.g. Bounds2.EVERYTHING.intersection( bounds ).equals( bounds ). This object naturally serves as
   * the base case as an intersection of zero bounds objects.
   *
   * Additionally, unions with EVERYTHING will always return a Bounds2 equivalent to EVERYTHING.
   */
  public static readonly EVERYTHING = new Bounds2( Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY );

  public static readonly Bounds2IO = new IOType( 'Bounds2IO', {
    valueType: Bounds2,
    documentation: 'a 2-dimensional bounds rectangle',
    toStateObject: ( bounds2: Bounds2 ) => ( { minX: bounds2.minX, minY: bounds2.minY, maxX: bounds2.maxX, maxY: bounds2.maxY } ),
    fromStateObject: ( stateObject: Bounds2StateObject ) => {
      return new Bounds2(
        InfiniteNumberIO.fromStateObject( stateObject.minX ),
        InfiniteNumberIO.fromStateObject( stateObject.minY ),
        InfiniteNumberIO.fromStateObject( stateObject.maxX ),
        InfiniteNumberIO.fromStateObject( stateObject.maxY )
      );
    },
    stateSchema: {
      minX: InfiniteNumberIO,
      maxX: InfiniteNumberIO,
      minY: InfiniteNumberIO,
      maxY: InfiniteNumberIO
    }
  } );
}

dot.register( 'Bounds2', Bounds2 );

const b2 = Bounds2.pool.create.bind( Bounds2.pool );
dot.register( 'b2', b2 );

Bounds2.prototype.isBounds = true;
Bounds2.prototype.dimension = 2;

function catchImmutableSetterLowHangingFruit( bounds: Bounds2 ): void {
  bounds.setMinMax = () => { throw new Error( 'Attempt to set "setMinMax" of an immutable Bounds2 object' ); };
  bounds.set = () => { throw new Error( 'Attempt to set "set" of an immutable Bounds2 object' ); };
  bounds.includeBounds = () => { throw new Error( 'Attempt to set "includeBounds" of an immutable Bounds2 object' ); };
  bounds.constrainBounds = () => { throw new Error( 'Attempt to set "constrainBounds" of an immutable Bounds2 object' ); };
  bounds.addCoordinates = () => { throw new Error( 'Attempt to set "addCoordinates" of an immutable Bounds2 object' ); };
  bounds.transform = () => { throw new Error( 'Attempt to set "transform" of an immutable Bounds2 object' ); };
}

if ( assert ) {
  catchImmutableSetterLowHangingFruit( Bounds2.EVERYTHING );
  catchImmutableSetterLowHangingFruit( Bounds2.NOTHING );
}