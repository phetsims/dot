// Copyright 2013-2025, University of Colorado Boulder

/**
 * A 3D cuboid-shaped bounded area (bounding box).
 *
 * There are a number of convenience functions to get locations and points on the Bounds. Currently we do not
 * store these with the Bounds3 instance, since we want to lower the memory footprint.
 *
 * minX, minY, minZ, maxX, maxY, and maxZ are actually stored. We don't do x,y,z,width,height,depth because this can't properly express
 * semi-infinite bounds (like a half-plane), or easily handle what Bounds3.NOTHING and Bounds3.EVERYTHING do with
 * the constructive solid areas.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import Poolable from '../../phet-core/js/Poolable.js';
import IntentionalAny from '../../phet-core/js/types/IntentionalAny.js';
import IOType from '../../tandem/js/types/IOType.js';
import NumberIO from '../../tandem/js/types/NumberIO.js';
import dot from './dot.js';
import Matrix4 from './Matrix4.js';
import Vector3 from './Vector3.js';

class Bounds3 {

  /**
   * Creates a 3-dimensional bounds (bounding box).
   *
   * @param minX - The initial minimum X coordinate of the bounds.
   * @param minY - The initial minimum Y coordinate of the bounds.
   * @param minZ - The initial minimum Z coordinate of the bounds.
   * @param maxX - The initial maximum X coordinate of the bounds.
   * @param maxY - The initial maximum Y coordinate of the bounds.
   * @param maxZ - The initial maximum Z coordinate of the bounds.
   */
  public constructor(
    public minX: number,
    public minY: number,
    public minZ: number,
    public maxX: number,
    public maxY: number,
    public maxZ: number ) {
    assert && assert( maxY !== undefined, 'Bounds3 requires 4 parameters' );
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

  /**
   * The depth of the bounds, defined as maxZ - minZ.
   */
  public getDepth(): number { return this.maxZ - this.minZ; }

  public get depth(): number { return this.getDepth(); }

  /*
   * Convenience locations
   * upper is in terms of the visual layout in Scenery and other programs, so the minY is the "upper", and minY is the "lower"
   *
   *             minX (x)     centerX        maxX
   *          ---------------------------------------
   * minY (y) | upperLeft   upperCenter   upperRight
   * centerY  | centerLeft    center      centerRight
   * maxY     | lowerLeft   lowerCenter   lowerRight
   */

  /**
   * Alias for minX, when thinking of the bounds as an (x,y,z,width,height,depth) cuboid.
   */
  public getX(): number { return this.minX; }

  public get x(): number { return this.getX(); }

  /**
   * Alias for minY, when thinking of the bounds as an (x,y,z,width,height,depth) cuboid.
   */
  public getY(): number { return this.minY; }

  public get y(): number { return this.getY(); }

  /**
   * Alias for minZ, when thinking of the bounds as an (x,y,z,width,height,depth) cuboid.
   */
  public getZ(): number { return this.minZ; }

  public get z(): number { return this.getZ(); }

  /**
   * Alias for minX, supporting the explicit getter function style.
   */
  public getMinX(): number { return this.minX; }

  /**
   * Alias for minY, supporting the explicit getter function style.
   */
  public getMinY(): number { return this.minY; }

  /**
   * Alias for minZ, supporting the explicit getter function style.
   */
  public getMinZ(): number { return this.minZ; }

  /**
   * Alias for maxX, supporting the explicit getter function style.
   */
  public getMaxX(): number { return this.maxX; }

  /**
   * Alias for maxY, supporting the explicit getter function style.
   */
  public getMaxY(): number { return this.maxY; }

  /**
   * Alias for maxZ, supporting the explicit getter function style.
   */
  public getMaxZ(): number { return this.maxZ; }

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
   * Alias for minZ, when thinking in the UI-layout manner.
   */
  public getBack(): number { return this.minZ; }

  public get back(): number { return this.minZ; }

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
   * Alias for maxZ, when thinking in the UI-layout manner.
   */
  public getFront(): number { return this.maxZ; }

  public get front(): number { return this.maxZ; }

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
   * The depthwise (Z-coordinate) center of the bounds, averaging the minZ and maxZ.
   */
  public getCenterZ(): number { return ( this.maxZ + this.minZ ) / 2; }

  public get centerZ(): number { return this.getCenterZ(); }

  /**
   * The point (centerX, centerY, centerZ), in the center of the bounds.
   */
  public getCenter(): Vector3 { return new Vector3( this.getCenterX(), this.getCenterY(), this.getCenterZ() ); }

  public get center(): Vector3 { return this.getCenter(); }

  /**
   * Get the volume of the Bounds3 as if it were a cube.
   */
  public get volume(): number { return this.width * this.height * this.depth;}

  /**
   * Whether we have negative width, height or depth. Bounds3.NOTHING is a prime example of an empty Bounds3.
   * Bounds with width = height = depth = 0 are considered not empty, since they include the single (0,0,0) point.
   */
  public isEmpty(): boolean { return this.getWidth() < 0 || this.getHeight() < 0 || this.getDepth() < 0; }

  /**
   * Whether our minimums and maximums are all finite numbers. This will exclude Bounds3.NOTHING and Bounds3.EVERYTHING.
   */
  public isFinite(): boolean {
    return isFinite( this.minX ) && isFinite( this.minY ) && isFinite( this.minZ ) && isFinite( this.maxX ) && isFinite( this.maxY ) && isFinite( this.maxZ );
  }

  /**
   * Whether this bounds has a non-zero volume (non-zero positive width, height and depth).
   */
  public hasNonzeroVolume(): boolean {
    return this.getWidth() > 0 && this.getHeight() > 0 && this.getDepth() > 0;
  }

  /**
   * Whether this bounds has a finite and non-negative width, height and depth.
   */
  public isValid(): boolean {
    return !this.isEmpty() && this.isFinite();
  }

  /**
   * Whether the coordinates are contained inside the bounding box, or are on the boundary.
   *
   * @param x - X coordinate of the point to check
   * @param y - Y coordinate of the point to check
   * @param z - Z coordinate of the point to check
   */
  public containsCoordinates( x: number, y: number, z: number ): boolean {
    return this.minX <= x && x <= this.maxX && this.minY <= y && y <= this.maxY && this.minZ <= z && z <= this.maxZ;
  }

  /**
   * Whether the point is contained inside the bounding box, or is on the boundary.
   */
  public containsPoint( point: Vector3 ): boolean {
    return this.containsCoordinates( point.x, point.y, point.z );
  }

  /**
   * Whether this bounding box completely contains the bounding box passed as a parameter. The boundary of a box is
   * considered to be "contained".
   */
  public containsBounds( bounds: Bounds3 ): boolean {
    return this.minX <= bounds.minX && this.maxX >= bounds.maxX && this.minY <= bounds.minY && this.maxY >= bounds.maxY && this.minZ <= bounds.minZ && this.maxZ >= bounds.maxZ;
  }

  /**
   * Whether this and another bounding box have any points of intersection (including touching boundaries).
   */
  public intersectsBounds( bounds: Bounds3 ): boolean {
    // TODO: more efficient way of doing this? https://github.com/phetsims/dot/issues/96
    return !this.intersection( bounds ).isEmpty();
  }

  /**
   * Debugging string for the bounds.
   */
  public toString(): string {
    return `[x:(${this.minX},${this.maxX}),y:(${this.minY},${this.maxY}),z:(${this.minZ},${this.maxZ})]`;
  }

  /**
   * Exact equality comparison between this bounds and another bounds.
   */
  public equals( other: Bounds3 ): boolean {
    return this.minX === other.minX &&
           this.minY === other.minY &&
           this.minZ === other.minZ &&
           this.maxX === other.maxX &&
           this.maxY === other.maxY &&
           this.maxZ === other.maxZ;
  }

  /**
   * Approximate equality comparison between this bounds and another bounds.
   * @returns - Whether difference between the two bounds has no min/max with an absolute value greater than epsilon.
   */
  public equalsEpsilon( other: Bounds3, epsilon: number ): boolean {
    epsilon = epsilon !== undefined ? epsilon : 0;
    const thisFinite = this.isFinite();
    const otherFinite = other.isFinite();
    if ( thisFinite && otherFinite ) {
      // both are finite, so we can use Math.abs() - it would fail with non-finite values like Infinity
      return Math.abs( this.minX - other.minX ) < epsilon &&
             Math.abs( this.minY - other.minY ) < epsilon &&
             Math.abs( this.minZ - other.minZ ) < epsilon &&
             Math.abs( this.maxX - other.maxX ) < epsilon &&
             Math.abs( this.maxY - other.maxY ) < epsilon &&
             Math.abs( this.maxZ - other.maxZ ) < epsilon;
    }
    else if ( thisFinite !== otherFinite ) {
      return false; // one is finite, the other is not. definitely not equal
    }
    else if ( this === other ) {
      return true; // exact same instance, must be equal
    }
    else {
      // epsilon only applies on finite dimensions. due to JS's handling of isFinite(), it's faster to check the sum of both
      return ( isFinite( this.minX + other.minX ) ? ( Math.abs( this.minX - other.minX ) < epsilon ) : ( this.minX === other.minX ) ) &&
             ( isFinite( this.minY + other.minY ) ? ( Math.abs( this.minY - other.minY ) < epsilon ) : ( this.minY === other.minY ) ) &&
             ( isFinite( this.minZ + other.minZ ) ? ( Math.abs( this.minZ - other.minZ ) < epsilon ) : ( this.minZ === other.minZ ) ) &&
             ( isFinite( this.maxX + other.maxX ) ? ( Math.abs( this.maxX - other.maxX ) < epsilon ) : ( this.maxX === other.maxX ) ) &&
             ( isFinite( this.maxY + other.maxY ) ? ( Math.abs( this.maxY - other.maxY ) < epsilon ) : ( this.maxY === other.maxY ) ) &&
             ( isFinite( this.maxZ + other.maxZ ) ? ( Math.abs( this.maxZ - other.maxZ ) < epsilon ) : ( this.maxZ === other.maxZ ) );
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
   * @param bounds - If not provided, creates a new Bounds3 with filled in values. Otherwise, fills in the
   *                             values of the provided bounds so that it equals this bounds.
   */
  public copy( bounds?: Bounds3 ): Bounds3 {
    if ( bounds ) {
      return bounds.set( this );
    }
    else {
      return new Bounds3( this.minX, this.minY, this.minZ, this.maxX, this.maxY, this.maxZ );
    }
  }

  /**
   * The smallest bounds that contains both this bounds and the input bounds, returned as a copy.
   *
   * This is the immutable form of the function includeBounds(). This will return a new bounds, and will not modify
   * this bounds.
   */
  public union( bounds: Bounds3 ): Bounds3 {
    return new Bounds3(
      Math.min( this.minX, bounds.minX ),
      Math.min( this.minY, bounds.minY ),
      Math.min( this.minZ, bounds.minZ ),
      Math.max( this.maxX, bounds.maxX ),
      Math.max( this.maxY, bounds.maxY ),
      Math.max( this.maxZ, bounds.maxZ )
    );
  }

  /**
   * The smallest bounds that is contained by both this bounds and the input bounds, returned as a copy.
   *
   * This is the immutable form of the function constrainBounds(). This will return a new bounds, and will not modify
   * this bounds.
   */
  public intersection( bounds: Bounds3 ): Bounds3 {
    return new Bounds3(
      Math.max( this.minX, bounds.minX ),
      Math.max( this.minY, bounds.minY ),
      Math.max( this.minZ, bounds.minZ ),
      Math.min( this.maxX, bounds.maxX ),
      Math.min( this.maxY, bounds.maxY ),
      Math.min( this.maxZ, bounds.maxZ )
    );
  }

  // TODO: difference should be well-defined, but more logic is needed to compute https://github.com/phetsims/dot/issues/96

  /**
   * The smallest bounds that contains this bounds and the point (x,y,z), returned as a copy.
   *
   * This is the immutable form of the function addCoordinates(). This will return a new bounds, and will not modify
   * this bounds.
   */
  public withCoordinates( x: number, y: number, z: number ): Bounds3 {
    return new Bounds3(
      Math.min( this.minX, x ),
      Math.min( this.minY, y ),
      Math.min( this.minZ, z ),
      Math.max( this.maxX, x ),
      Math.max( this.maxY, y ),
      Math.max( this.maxZ, z )
    );
  }

  /**
   * The smallest bounds that contains this bounds and the input point, returned as a copy.
   *
   * This is the immutable form of the function addPoint(). This will return a new bounds, and will not modify
   * this bounds.
   */
  public withPoint( point: Vector3 ): Bounds3 {
    return this.withCoordinates( point.x, point.y, point.z );
  }

  /**
   * A copy of this bounds, with minX replaced with the input.
   *
   * This is the immutable form of the function setMinX(). This will return a new bounds, and will not modify
   * this bounds.
   */
  public withMinX( minX: number ): Bounds3 {
    return new Bounds3( minX, this.minY, this.minZ, this.maxX, this.maxY, this.maxZ );
  }

  /**
   * A copy of this bounds, with minY replaced with the input.
   *
   * This is the immutable form of the function setMinY(). This will return a new bounds, and will not modify
   * this bounds.
   */
  public withMinY( minY: number ): Bounds3 {
    return new Bounds3( this.minX, minY, this.minZ, this.maxX, this.maxY, this.maxZ );
  }

  /**
   * A copy of this bounds, with minZ replaced with the input.
   *
   * This is the immutable form of the function setMinZ(). This will return a new bounds, and will not modify
   * this bounds.
   */
  public withMinZ( minZ: number ): Bounds3 {
    return new Bounds3( this.minX, this.minY, minZ, this.maxX, this.maxY, this.maxZ );
  }

  /**
   * A copy of this bounds, with maxX replaced with the input.
   *
   * This is the immutable form of the function setMaxX(). This will return a new bounds, and will not modify
   * this bounds.
   */
  public withMaxX( maxX: number ): Bounds3 {
    return new Bounds3( this.minX, this.minY, this.minZ, maxX, this.maxY, this.maxZ );
  }

  /**
   * A copy of this bounds, with maxY replaced with the input.
   *
   * This is the immutable form of the function setMaxY(). This will return a new bounds, and will not modify
   * this bounds.
   */
  public withMaxY( maxY: number ): Bounds3 {
    return new Bounds3( this.minX, this.minY, this.minZ, this.maxX, maxY, this.maxZ );
  }

  /**
   * A copy of this bounds, with maxZ replaced with the input.
   *
   * This is the immutable form of the function setMaxZ(). This will return a new bounds, and will not modify
   * this bounds.
   */
  public withMaxZ( maxZ: number ): Bounds3 {
    return new Bounds3( this.minX, this.minY, this.minZ, this.maxX, this.maxY, maxZ );
  }

  /**
   * A copy of this bounds, with the minimum values rounded down to the nearest integer, and the maximum values
   * rounded up to the nearest integer. This causes the bounds to expand as necessary so that its boundaries
   * are integer-aligned.
   *
   * This is the immutable form of the function roundOut(). This will return a new bounds, and will not modify
   * this bounds.
   */
  public roundedOut(): Bounds3 {
    return new Bounds3(
      Math.floor( this.minX ),
      Math.floor( this.minY ),
      Math.floor( this.minZ ),
      Math.ceil( this.maxX ),
      Math.ceil( this.maxY ),
      Math.ceil( this.maxZ )
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
  public roundedIn(): Bounds3 {
    return new Bounds3(
      Math.ceil( this.minX ),
      Math.ceil( this.minY ),
      Math.ceil( this.minZ ),
      Math.floor( this.maxX ),
      Math.floor( this.maxY ),
      Math.floor( this.maxZ )
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
  public transformed( matrix: Matrix4 ): Bounds3 {
    return this.copy().transform( matrix );
  }

  /**
   * A bounding box that is expanded on all sides by the specified amount.)
   *
   * This is the immutable form of the function dilate(). This will return a new bounds, and will not modify
   * this bounds.
   */
  public dilated( d: number ): Bounds3 {
    return this.dilatedXYZ( d, d, d );
  }

  /**
   * A bounding box that is expanded horizontally (on the left and right) by the specified amount.
   *
   * This is the immutable form of the function dilateX(). This will return a new bounds, and will not modify
   * this bounds.
   */
  public dilatedX( x: number ): Bounds3 {
    return new Bounds3( this.minX - x, this.minY, this.minZ, this.maxX + x, this.maxY, this.maxZ );
  }

  /**
   * A bounding box that is expanded vertically (on the top and bottom) by the specified amount.
   *
   * This is the immutable form of the function dilateY(). This will return a new bounds, and will not modify
   * this bounds.
   */
  public dilatedY( y: number ): Bounds3 {
    return new Bounds3( this.minX, this.minY - y, this.minZ, this.maxX, this.maxY + y, this.maxZ );
  }

  /**
   * A bounding box that is expanded depth-wise (on the front and back) by the specified amount.
   *
   * This is the immutable form of the function dilateZ(). This will return a new bounds, and will not modify
   * this bounds.
   */
  public dilatedZ( z: number ): Bounds3 {
    return new Bounds3( this.minX, this.minY, this.minZ - z, this.maxX, this.maxY, this.maxZ + z );
  }

  /**
   * A bounding box that is expanded on all sides, with different amounts of expansion along each axis.
   * Will be identical to the bounds returned by calling bounds.dilatedX( x ).dilatedY( y ).dilatedZ( z ).
   *
   * This is the immutable form of the function dilateXYZ(). This will return a new bounds, and will not modify
   * this bounds.
   * @param x - Amount to dilate horizontally (for each side)
   * @param y - Amount to dilate vertically (for each side)
   * @param z - Amount to dilate depth-wise (for each side)
   */
  public dilatedXYZ( x: number, y: number, z: number ): Bounds3 {
    return new Bounds3( this.minX - x, this.minY - y, this.minZ - z, this.maxX + x, this.maxY + y, this.maxZ + z );
  }

  /**
   * A bounding box that is contracted on all sides by the specified amount.
   *
   * This is the immutable form of the function erode(). This will return a new bounds, and will not modify
   * this bounds.
   */
  public eroded( amount: number ): Bounds3 {
    return this.dilated( -amount );
  }

  /**
   * A bounding box that is contracted horizontally (on the left and right) by the specified amount.
   *
   * This is the immutable form of the function erodeX(). This will return a new bounds, and will not modify
   * this bounds.
   */
  public erodedX( x: number ): Bounds3 {
    return this.dilatedX( -x );
  }

  /**
   * A bounding box that is contracted vertically (on the top and bottom) by the specified amount.
   *
   * This is the immutable form of the function erodeY(). This will return a new bounds, and will not modify
   * this bounds.
   */
  public erodedY( y: number ): Bounds3 {
    return this.dilatedY( -y );
  }

  /**
   * A bounding box that is contracted depth-wise (on the front and back) by the specified amount.
   *
   * This is the immutable form of the function erodeZ(). This will return a new bounds, and will not modify
   * this bounds.
   */
  public erodedZ( z: number ): Bounds3 {
    return this.dilatedZ( -z );
  }

  /**
   * A bounding box that is contracted on all sides, with different amounts of contraction along each axis.
   *
   * This is the immutable form of the function erodeXYZ(). This will return a new bounds, and will not modify
   * this bounds.
   * @param x - Amount to erode horizontally (for each side)
   * @param y - Amount to erode vertically (for each side)
   * @param z - Amount to erode depth-wise (for each side)
   */
  public erodedXYZ( x: number, y: number, z: number ): Bounds3 {
    return this.dilatedXYZ( -x, -y, -z );
  }

  /**
   * Our bounds, translated horizontally by x, returned as a copy.
   *
   * This is the immutable form of the function shiftX(). This will return a new bounds, and will not modify
   * this bounds.
   */
  public shiftedX( x: number ): Bounds3 {
    return new Bounds3( this.minX + x, this.minY, this.minZ, this.maxX + x, this.maxY, this.maxZ );
  }

  /**
   * Our bounds, translated vertically by y, returned as a copy.
   *
   * This is the immutable form of the function shiftY(). This will return a new bounds, and will not modify
   * this bounds.
   */
  public shiftedY( y: number ): Bounds3 {
    return new Bounds3( this.minX, this.minY + y, this.minZ, this.maxX, this.maxY + y, this.maxZ );
  }

  /**
   * Our bounds, translated depth-wise by z, returned as a copy.
   *
   * This is the immutable form of the function shiftZ(). This will return a new bounds, and will not modify
   * this bounds.
   */
  public shiftedZ( z: number ): Bounds3 {
    return new Bounds3( this.minX, this.minY, this.minZ + z, this.maxX, this.maxY, this.maxZ + z );
  }

  /**
   * Our bounds, translated by (x,y,z), returned as a copy.
   *
   * This is the immutable form of the function shift(). This will return a new bounds, and will not modify
   * this bounds.
   */
  public shiftedXYZ( x: number, y: number, z: number ): Bounds3 {
    return new Bounds3( this.minX + x, this.minY + y, this.minZ + z, this.maxX + x, this.maxY + y, this.maxZ + z );
  }

  /**
   * Returns our bounds, translated by a vector, returned as a copy.
   */
  public shifted( v: Vector3 ): Bounds3 {
    return this.shiftedXYZ( v.x, v.y, v.z );
  }

  /*---------------------------------------------------------------------------*
   * Mutable operations
   *
   * All mutable operations should call one of the following:
   *   setMinMax, setMinX, setMinY, setMinZ, setMaxX, setMaxY, setMaxZ
   *---------------------------------------------------------------------------*/

  /**
   * Sets each value for this bounds, and returns itself.
   */
  public setMinMax( minX: number, minY: number, minZ: number, maxX: number, maxY: number, maxZ: number ): Bounds3 {
    this.minX = minX;
    this.minY = minY;
    this.minZ = minZ;
    this.maxX = maxX;
    this.maxY = maxY;
    this.maxZ = maxZ;
    return this;
  }

  /**
   * Sets the value of minX.
   *
   * This is the mutable form of the function withMinX(). This will mutate (change) this bounds, in addition to returning
   * this bounds itself.
   */
  public setMinX( minX: number ): Bounds3 {
    this.minX = minX;
    return this;
  }

  /**
   * Sets the value of minY.
   *
   * This is the mutable form of the function withMinY(). This will mutate (change) this bounds, in addition to returning
   * this bounds itself.
   */
  public setMinY( minY: number ): Bounds3 {
    this.minY = minY;
    return this;
  }

  /**
   * Sets the value of minZ.
   *
   * This is the mutable form of the function withMinZ(). This will mutate (change) this bounds, in addition to returning
   * this bounds itself.
   */
  public setMinZ( minZ: number ): Bounds3 {
    this.minZ = minZ;
    return this;
  }

  /**
   * Sets the value of maxX.
   *
   * This is the mutable form of the function withMaxX(). This will mutate (change) this bounds, in addition to returning
   * this bounds itself.
   */
  public setMaxX( maxX: number ): Bounds3 {
    this.maxX = maxX;
    return this;
  }

  /**
   * Sets the value of maxY.
   *
   * This is the mutable form of the function withMaxY(). This will mutate (change) this bounds, in addition to returning
   * this bounds itself.
   */
  public setMaxY( maxY: number ): Bounds3 {
    this.maxY = maxY;
    return this;
  }

  /**
   * Sets the value of maxZ.
   *
   * This is the mutable form of the function withMaxZ(). This will mutate (change) this bounds, in addition to returning
   * this bounds itself.
   */
  public setMaxZ( maxZ: number ): Bounds3 {
    this.maxZ = maxZ;
    return this;
  }

  /**
   * Sets the values of this bounds to be equal to the input bounds.
   *
   * This is the mutable form of the function copy(). This will mutate (change) this bounds, in addition to returning
   * this bounds itself.
   */
  public set( bounds: Bounds3 ): Bounds3 {
    return this.setMinMax( bounds.minX, bounds.minY, bounds.minZ, bounds.maxX, bounds.maxY, bounds.maxZ );
  }

  /**
   * Modifies this bounds so that it contains both its original bounds and the input bounds.
   *
   * This is the mutable form of the function union(). This will mutate (change) this bounds, in addition to returning
   * this bounds itself.
   */
  public includeBounds( bounds: Bounds3 ): Bounds3 {
    return this.setMinMax(
      Math.min( this.minX, bounds.minX ),
      Math.min( this.minY, bounds.minY ),
      Math.min( this.minZ, bounds.minZ ),
      Math.max( this.maxX, bounds.maxX ),
      Math.max( this.maxY, bounds.maxY ),
      Math.max( this.maxZ, bounds.maxZ )
    );
  }

  /**
   * Modifies this bounds so that it is the largest bounds contained both in its original bounds and in the input bounds.
   *
   * This is the mutable form of the function intersection(). This will mutate (change) this bounds, in addition to returning
   * this bounds itself.
   */
  public constrainBounds( bounds: Bounds3 ): Bounds3 {
    return this.setMinMax(
      Math.max( this.minX, bounds.minX ),
      Math.max( this.minY, bounds.minY ),
      Math.max( this.minZ, bounds.minZ ),
      Math.min( this.maxX, bounds.maxX ),
      Math.min( this.maxY, bounds.maxY ),
      Math.min( this.maxZ, bounds.maxZ )
    );
  }

  /**
   * Modifies this bounds so that it contains both its original bounds and the input point (x,y,z).
   *
   * This is the mutable form of the function withCoordinates(). This will mutate (change) this bounds, in addition to returning
   * this bounds itself.
   */
  public addCoordinates( x: number, y: number, z: number ): Bounds3 {
    return this.setMinMax(
      Math.min( this.minX, x ),
      Math.min( this.minY, y ),
      Math.min( this.minZ, z ),
      Math.max( this.maxX, x ),
      Math.max( this.maxY, y ),
      Math.max( this.maxZ, z )
    );
  }

  /**
   * Modifies this bounds so that it contains both its original bounds and the input point.
   *
   * This is the mutable form of the function withPoint(). This will mutate (change) this bounds, in addition to returning
   * this bounds itself.
   */
  public addPoint( point: Vector3 ): Bounds3 {
    return this.addCoordinates( point.x, point.y, point.z );
  }

  /**
   * Modifies this bounds so that its boundaries are integer-aligned, rounding the minimum boundaries down and the
   * maximum boundaries up (expanding as necessary).
   *
   * This is the mutable form of the function roundedOut(). This will mutate (change) this bounds, in addition to returning
   * this bounds itself.
   */
  public roundOut(): Bounds3 {
    return this.setMinMax(
      Math.floor( this.minX ),
      Math.floor( this.minY ),
      Math.floor( this.minZ ),
      Math.ceil( this.maxX ),
      Math.ceil( this.maxY ),
      Math.ceil( this.maxZ )
    );
  }

  /**
   * Modifies this bounds so that its boundaries are integer-aligned, rounding the minimum boundaries up and the
   * maximum boundaries down (contracting as necessary).
   *
   * This is the mutable form of the function roundedIn(). This will mutate (change) this bounds, in addition to returning
   * this bounds itself.
   */
  public roundIn(): Bounds3 {
    return this.setMinMax(
      Math.ceil( this.minX ),
      Math.ceil( this.minY ),
      Math.ceil( this.minZ ),
      Math.floor( this.maxX ),
      Math.floor( this.maxY ),
      Math.floor( this.maxZ )
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
  public transform( matrix: Matrix4 ): Bounds3 {
    // do nothing
    if ( this.isEmpty() ) {
      return this;
    }

    // optimization to bail for identity matrices
    if ( matrix.isIdentity() ) {
      return this;
    }

    let minX = Number.POSITIVE_INFINITY;
    let minY = Number.POSITIVE_INFINITY;
    let minZ = Number.POSITIVE_INFINITY;
    let maxX = Number.NEGATIVE_INFINITY;
    let maxY = Number.NEGATIVE_INFINITY;
    let maxZ = Number.NEGATIVE_INFINITY;

    // using mutable vector so we don't create excessive instances of Vector2 during this
    // make sure all 4 corners are inside this transformed bounding box
    const vector = new Vector3( 0, 0, 0 );

    function withIt( vector: Vector3 ): void {
      minX = Math.min( minX, vector.x );
      minY = Math.min( minY, vector.y );
      minZ = Math.min( minZ, vector.z );
      maxX = Math.max( maxX, vector.x );
      maxY = Math.max( maxY, vector.y );
      maxZ = Math.max( maxZ, vector.z );
    }

    withIt( matrix.timesVector3( vector.setXYZ( this.minX, this.minY, this.minZ ) ) );
    withIt( matrix.timesVector3( vector.setXYZ( this.minX, this.maxY, this.minZ ) ) );
    withIt( matrix.timesVector3( vector.setXYZ( this.maxX, this.minY, this.minZ ) ) );
    withIt( matrix.timesVector3( vector.setXYZ( this.maxX, this.maxY, this.minZ ) ) );
    withIt( matrix.timesVector3( vector.setXYZ( this.minX, this.minY, this.maxZ ) ) );
    withIt( matrix.timesVector3( vector.setXYZ( this.minX, this.maxY, this.maxZ ) ) );
    withIt( matrix.timesVector3( vector.setXYZ( this.maxX, this.minY, this.maxZ ) ) );
    withIt( matrix.timesVector3( vector.setXYZ( this.maxX, this.maxY, this.maxZ ) ) );
    return this.setMinMax( minX, minY, minZ, maxX, maxY, maxZ );
  }

  /**
   * Expands this bounds on all sides by the specified amount.
   *
   * This is the mutable form of the function dilated(). This will mutate (change) this bounds, in addition to returning
   * this bounds itself.
   */
  public dilate( d: number ): Bounds3 {
    return this.dilateXYZ( d, d, d );
  }

  /**
   * Expands this bounds horizontally (left and right) by the specified amount.
   *
   * This is the mutable form of the function dilatedX(). This will mutate (change) this bounds, in addition to returning
   * this bounds itself.
   */
  public dilateX( x: number ): Bounds3 {
    return this.setMinMax( this.minX - x, this.minY, this.minZ, this.maxX + x, this.maxY, this.maxZ );
  }

  /**
   * Expands this bounds vertically (top and bottom) by the specified amount.
   *
   * This is the mutable form of the function dilatedY(). This will mutate (change) this bounds, in addition to returning
   * this bounds itself.
   */
  public dilateY( y: number ): Bounds3 {
    return this.setMinMax( this.minX, this.minY - y, this.minZ, this.maxX, this.maxY + y, this.maxZ );
  }

  /**
   * Expands this bounds depth-wise (front and back) by the specified amount.
   *
   * This is the mutable form of the function dilatedZ(). This will mutate (change) this bounds, in addition to returning
   * this bounds itself.
   */
  public dilateZ( z: number ): Bounds3 {
    return this.setMinMax( this.minX, this.minY, this.minZ - z, this.maxX, this.maxY, this.maxZ + z );
  }

  /**
   * Expands this bounds independently along each axis. Will be equal to calling
   * bounds.dilateX( x ).dilateY( y ).dilateZ( z ).
   *
   * This is the mutable form of the function dilatedXYZ(). This will mutate (change) this bounds, in addition to returning
   * this bounds itself.
   */
  public dilateXYZ( x: number, y: number, z: number ): Bounds3 {
    return this.setMinMax( this.minX - x, this.minY - y, this.minZ - z, this.maxX + x, this.maxY + y, this.maxZ + z );
  }

  /**
   * Contracts this bounds on all sides by the specified amount.
   *
   * This is the mutable form of the function eroded(). This will mutate (change) this bounds, in addition to returning
   * this bounds itself.
   */
  public erode( d: number ): Bounds3 {
    return this.dilate( -d );
  }

  /**
   * Contracts this bounds horizontally (left and right) by the specified amount.
   *
   * This is the mutable form of the function erodedX(). This will mutate (change) this bounds, in addition to returning
   * this bounds itself.
   */
  public erodeX( x: number ): Bounds3 {
    return this.dilateX( -x );
  }

  /**
   * Contracts this bounds vertically (top and bottom) by the specified amount.
   *
   * This is the mutable form of the function erodedY(). This will mutate (change) this bounds, in addition to returning
   * this bounds itself.
   */
  public erodeY( y: number ): Bounds3 {
    return this.dilateY( -y );
  }

  /**
   * Contracts this bounds depth-wise (front and back) by the specified amount.
   *
   * This is the mutable form of the function erodedZ(). This will mutate (change) this bounds, in addition to returning
   * this bounds itself.
   */
  public erodeZ( z: number ): Bounds3 {
    return this.dilateZ( -z );
  }

  /**
   * Contracts this bounds independently along each axis. Will be equal to calling
   * bounds.erodeX( x ).erodeY( y ).erodeZ( z ).
   *
   * This is the mutable form of the function erodedXYZ(). This will mutate (change) this bounds, in addition to returning
   * this bounds itself.
   */
  public erodeXYZ( x: number, y: number, z: number ): Bounds3 {
    return this.dilateXYZ( -x, -y, -z );
  }

  /**
   * Translates our bounds horizontally by x.
   *
   * This is the mutable form of the function shiftedX(). This will mutate (change) this bounds, in addition to returning
   * this bounds itself.
   */
  public shiftX( x: number ): Bounds3 {
    return this.setMinMax( this.minX + x, this.minY, this.minZ, this.maxX + x, this.maxY, this.maxZ );
  }

  /**
   * Translates our bounds vertically by y.
   *
   * This is the mutable form of the function shiftedY(). This will mutate (change) this bounds, in addition to returning
   * this bounds itself.
   */
  public shiftY( y: number ): Bounds3 {
    return this.setMinMax( this.minX, this.minY + y, this.minZ, this.maxX, this.maxY + y, this.maxZ );
  }

  /**
   * Translates our bounds depth-wise by z.
   *
   * This is the mutable form of the function shiftedZ(). This will mutate (change) this bounds, in addition to returning
   * this bounds itself.
   */
  public shiftZ( z: number ): Bounds3 {
    return this.setMinMax( this.minX, this.minY, this.minZ + z, this.maxX, this.maxY, this.maxZ + z );
  }

  /**
   * Translates our bounds by (x,y,z).
   *
   * This is the mutable form of the function shifted(). This will mutate (change) this bounds, in addition to returning
   * this bounds itself.
   */
  public shiftXYZ( x: number, y: number, z: number ): Bounds3 {
    return this.setMinMax( this.minX + x, this.minY + y, this.minZ + z, this.maxX + x, this.maxY + y, this.maxZ + z );
  }

  /**
   * Translates our bounds by the given vector.
   */
  public shift( v: Vector3 ): Bounds3 {
    return this.shiftXYZ( v.x, v.y, v.z );
  }

  /**
   * Returns a new Bounds3 object, with the cuboid (3d rectangle) construction with x, y, z, width, height and depth.
   *
   * @param x - The minimum value of X for the bounds.
   * @param y - The minimum value of Y for the bounds.
   * @param z - The minimum value of Z for the bounds.
   * @param width - The width (maxX - minX) of the bounds.`
   * @param height - The height (maxY - minY) of the bounds.
   * @param depth - The depth (maxZ - minZ) of the bounds.
   */
  public static cuboid( x: number, y: number, z: number, width: number, height: number, depth: number ): Bounds3 {
    return new Bounds3( x, y, z, x + width, y + height, z + depth );
  }

  /**
   * Returns a new Bounds3 object that only contains the specified point (x,y,z). Useful for being dilated to form a
   * bounding box around a point. Note that the bounds will not be "empty" as it contains (x,y,z), but it will have
   * zero area.
   */
  public static point( x: number, y: number, z: number ): Bounds3 {
    return new Bounds3( x, y, z, x, y, z );
  }

  // Helps to identify the dimension of the bounds
  public readonly isBounds = true;
  public readonly dimension = 3;

  /**
   * A constant Bounds3 with minimums = $\infty$, maximums = $-\infty$, so that it represents "no bounds whatsoever".
   *
   * This allows us to take the union (union/includeBounds) of this and any other Bounds3 to get the other bounds back,
   * e.g. Bounds3.NOTHING.union( bounds ).equals( bounds ). This object naturally serves as the base case as a union of
   * zero bounds objects.
   *
   * Additionally, intersections with NOTHING will always return a Bounds3 equivalent to NOTHING.
   *
   * @constant {Bounds3} NOTHING
   */
  public static readonly NOTHING = new Bounds3( Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY );

  /**
   * A constant Bounds3 with minimums = $-\infty$, maximums = $\infty$, so that it represents "all bounds".
   *
   * This allows us to take the intersection (intersection/constrainBounds) of this and any other Bounds3 to get the
   * other bounds back, e.g. Bounds3.EVERYTHING.intersection( bounds ).equals( bounds ). This object naturally serves as
   * the base case as an intersection of zero bounds objects.
   *
   * Additionally, unions with EVERYTHING will always return a Bounds3 equivalent to EVERYTHING.
   *
   * @constant {Bounds3} EVERYTHING
   */
  public static readonly EVERYTHING = new Bounds3( Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY );

  public static readonly Bounds3IO = new IOType<IntentionalAny, IntentionalAny>( 'Bounds3IO', {
    valueType: Bounds3,
    documentation: 'a 3-dimensional bounds (bounding box)',
    stateSchema: {
      minX: NumberIO, minY: NumberIO, minZ: NumberIO,
      maxX: NumberIO, maxY: NumberIO, maxZ: NumberIO
    },
    toStateObject: bounds3 => ( {
      minX: bounds3.minX, minY: bounds3.minY, minZ: bounds3.minZ,
      maxX: bounds3.maxX, maxY: bounds3.maxY, maxZ: bounds3.maxZ
    } ),
    fromStateObject: stateObject => new Bounds3(
      stateObject.minX, stateObject.minY, stateObject.minZ,
      stateObject.maxX, stateObject.maxY, stateObject.maxZ
    )
  } );
}

dot.register( 'Bounds3', Bounds3 );

Poolable.mixInto( Bounds3, {
  initialize: Bounds3.prototype.setMinMax
} );

export default Bounds3;