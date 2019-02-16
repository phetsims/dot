// Copyright 2013-2015, University of Colorado Boulder

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

define( function( require ) {
  'use strict';

  var dot = require( 'DOT/dot' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Poolable = require( 'PHET_CORE/Poolable' );

  require( 'DOT/Vector3' );

  /**
   * Creates a 3-dimensional bounds (bounding box).
   * @constructor
   * @public
   *
   * @param {number} minX - The initial minimum X coordinate of the bounds.
   * @param {number} minY - The initial minimum Y coordinate of the bounds.
   * @param {number} minZ - The initial minimum Z coordinate of the bounds.
   * @param {number} maxX - The initial maximum X coordinate of the bounds.
   * @param {number} maxY - The initial maximum Y coordinate of the bounds.
   * @param {number} maxZ - The initial maximum Z coordinate of the bounds.
   */
  function Bounds3( minX, minY, minZ, maxX, maxY, maxZ ) {
    assert && assert( maxY !== undefined, 'Bounds3 requires 4 parameters' );

    // @public {number} - The minimum X coordinate of the bounds.
    this.minX = minX;

    // @public {number} - The minimum Y coordinate of the bounds.
    this.minY = minY;

    // @public {number} - The minimum Z coordinate of the bounds.
    this.minZ = minZ;

    // @public {number} - The maximum X coordinate of the bounds.
    this.maxX = maxX;

    // @public {number} - The maximum Y coordinate of the bounds.
    this.maxY = maxY;

    // @public {number} - The maximum Z coordinate of the bounds.
    this.maxZ = maxZ;
  }

  dot.register( 'Bounds3', Bounds3 );

  inherit( Object, Bounds3, {
    // @public (read-only) - Helps to identify the dimension of the bounds
    isBounds: true,
    dimension: 3,

    /*---------------------------------------------------------------------------*
     * Properties
     *---------------------------------------------------------------------------*/

    /**
     * The width of the bounds, defined as maxX - minX.
     * @public
     *
     * @returns {number}
     */
    getWidth: function() { return this.maxX - this.minX; },
    get width() { return this.getWidth(); },

    /**
     * The height of the bounds, defined as maxY - minY.
     * @public
     *
     * @returns {number}
     */
    getHeight: function() { return this.maxY - this.minY; },
    get height() { return this.getHeight(); },

    /**
     * The depth of the bounds, defined as maxZ - minZ.
     * @public
     *
     * @returns {number}
     */
    getDepth: function() { return this.maxZ - this.minZ; },
    get depth() { return this.getDepth(); },

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
     * @public
     *
     * @returns {number}
     */
    getX: function() { return this.minX; },
    get x() { return this.getX(); },

    /**
     * Alias for minY, when thinking of the bounds as an (x,y,z,width,height,depth) cuboid.
     * @public
     *
     * @returns {number}
     */
    getY: function() { return this.minY; },
    get y() { return this.getY(); },

    /**
     * Alias for minZ, when thinking of the bounds as an (x,y,z,width,height,depth) cuboid.
     * @public
     *
     * @returns {number}
     */
    getZ: function() { return this.minZ; },
    get z() { return this.getZ(); },

    /**
     * Alias for minX, supporting the explicit getter function style.
     * @public
     *
     * @returns {number}
     */
    getMinX: function() { return this.minX; },

    /**
     * Alias for minY, supporting the explicit getter function style.
     * @public
     *
     * @returns {number}
     */
    getMinY: function() { return this.minY; },

    /**
     * Alias for minZ, supporting the explicit getter function style.
     * @public
     *
     * @returns {number}
     */
    getMinZ: function() { return this.minZ; },

    /**
     * Alias for maxX, supporting the explicit getter function style.
     * @public
     *
     * @returns {number}
     */
    getMaxX: function() { return this.maxX; },

    /**
     * Alias for maxY, supporting the explicit getter function style.
     * @public
     *
     * @returns {number}
     */
    getMaxY: function() { return this.maxY; },

    /**
     * Alias for maxZ, supporting the explicit getter function style.
     * @public
     *
     * @returns {number}
     */
    getMaxZ: function() { return this.maxZ; },

    /**
     * Alias for minX, when thinking in the UI-layout manner.
     * @public
     *
     * @returns {number}
     */
    getLeft: function() { return this.minX; },
    get left() { return this.minX; },

    /**
     * Alias for minY, when thinking in the UI-layout manner.
     * @public
     *
     * @returns {number}
     */
    getTop: function() { return this.minY; },
    get top() { return this.minY; },

    /**
     * Alias for minZ, when thinking in the UI-layout manner.
     * @public
     *
     * @returns {number}
     */
    getBack: function() { return this.minZ; },
    get back() { return this.minZ; },

    /**
     * Alias for maxX, when thinking in the UI-layout manner.
     * @public
     *
     * @returns {number}
     */
    getRight: function() { return this.maxX; },
    get right() { return this.maxX; },

    /**
     * Alias for maxY, when thinking in the UI-layout manner.
     * @public
     *
     * @returns {number}
     */
    getBottom: function() { return this.maxY; },
    get bottom() { return this.maxY; },

    /**
     * Alias for maxZ, when thinking in the UI-layout manner.
     * @public
     *
     * @returns {number}
     */
    getFront: function() { return this.maxZ; },
    get front() { return this.maxZ; },

    /**
     * The horizontal (X-coordinate) center of the bounds, averaging the minX and maxX.
     * @public
     *
     * @returns {number}
     */
    getCenterX: function() { return ( this.maxX + this.minX ) / 2; },
    get centerX() { return this.getCenterX(); },

    /**
     * The vertical (Y-coordinate) center of the bounds, averaging the minY and maxY.
     * @public
     *
     * @returns {number}
     */
    getCenterY: function() { return ( this.maxY + this.minY ) / 2; },
    get centerY() { return this.getCenterY(); },

    /**
     * The depthwise (Z-coordinate) center of the bounds, averaging the minZ and maxZ.
     * @public
     *
     * @returns {number}
     */
    getCenterZ: function() { return ( this.maxZ + this.minZ ) / 2; },
    get centerZ() { return this.getCenterZ(); },

    /**
     * The point (centerX, centerY, centerZ), in the center of the bounds.
     * @public
     *
     * @returns {Vector3}
     */
    getCenter: function() { return new dot.Vector3( this.getCenterX(), this.getCenterY(), this.getCenterZ() ); },
    get center() { return this.getCenter(); },

    /**
     * Whether we have negative width, height or depth. Bounds3.NOTHING is a prime example of an empty Bounds3.
     * Bounds with width = height = depth = 0 are considered not empty, since they include the single (0,0,0) point.
     * @public
     *
     * @returns {boolean}
     */
    isEmpty: function() { return this.getWidth() < 0 || this.getHeight() < 0 || this.getDepth() < 0; },

    /**
     * Whether our minimums and maximums are all finite numbers. This will exclude Bounds3.NOTHING and Bounds3.EVERYTHING.
     * @public
     *
     * @returns {boolean}
     */
    isFinite: function() {
      return isFinite( this.minX ) && isFinite( this.minY ) && isFinite( this.minZ ) && isFinite( this.maxX ) && isFinite( this.maxY ) && isFinite( this.maxZ );
    },

    /**
     * Whether this bounds has a non-zero area (non-zero positive width, height and depth).
     * @public
     *
     * @returns {boolean}
     */
    hasNonzeroArea: function() {
      return this.getWidth() > 0 && this.getHeight() > 0 && this.getDepth() > 0;
    },

    /**
     * Whether this bounds has a finite and non-negative width, height and depth.
     * @public
     *
     * @returns {boolean}
     */
    isValid: function() {
      return !this.isEmpty() && this.isFinite();
    },

    /**
     * Whether the coordinates are contained inside the bounding box, or are on the boundary.
     * @public
     *
     * @param {number} x - X coordinate of the point to check
     * @param {number} y - Y coordinate of the point to check
     * @param {number} z - Z coordinate of the point to check
     * @returns {boolean}
     */
    containsCoordinates: function( x, y, z ) {
      return this.minX <= x && x <= this.maxX && this.minY <= y && y <= this.maxY && this.minZ <= z && z <= this.maxZ;
    },

    /**
     * Whether the point is contained inside the bounding box, or is on the boundary.
     * @public
     *
     * @param {Vector3} point
     * @returns {boolean}
     */
    containsPoint: function( point ) {
      return this.containsCoordinates( point.x, point.y, point.z );
    },

    /**
     * Whether this bounding box completely contains the bounding box passed as a parameter. The boundary of a box is
     * considered to be "contained".
     * @public
     *
     * @param {Bounds3} bounds
     * @returns {boolean}
     */
    containsBounds: function( bounds ) {
      return this.minX <= bounds.minX && this.maxX >= bounds.maxX && this.minY <= bounds.minY && this.maxY >= bounds.maxY && this.minZ <= bounds.minZ && this.maxZ >= bounds.maxZ;
    },

    /**
     * Whether this and another bounding box have any points of intersection (including touching boundaries).
     * @public
     *
     * @param {Bounds3} bounds
     * @returns {boolean}
     */
    intersectsBounds: function( bounds ) {
      // TODO: more efficient way of doing this?
      return !this.intersection( bounds ).isEmpty();
    },

    /**
     * Debugging string for the bounds.
     * @public
     *
     * @returns {string}
     */
    toString: function() {
      return '[x:(' + this.minX + ',' + this.maxX + '),y:(' + this.minY + ',' + this.maxY + '),z:(' + this.minZ + ',' + this.maxZ + ')]';
    },

    /**
     * Exact equality comparison between this bounds and another bounds.
     * @public
     *
     * @param {Bounds3} other
     * @returns {boolean} - Whether the two bounds are equal
     */
    equals: function( other ) {
      return this.minX === other.minX && this.minY === other.minY && this.minZ === other.minZ && this.maxX === other.maxX && this.maxY === other.maxY && this.maxZ === other.maxZ;
    },

    /**
     * Approximate equality comparison between this bounds and another bounds.
     * @public
     *
     * @param {Bounds3} other
     * @param {number} epsilon
     * @returns {boolean} - Whether difference between the two bounds has no min/max with an absolute value greater
     *                      than epsilon.
     */
    equalsEpsilon: function( other, epsilon ) {
      epsilon = epsilon !== undefined ? epsilon : 0;
      var thisFinite = this.isFinite();
      var otherFinite = other.isFinite();
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
    },

    /*---------------------------------------------------------------------------*
     * Immutable operations
     *---------------------------------------------------------------------------*/

    /**
     * Creates a copy of this bounds, or if a bounds is passed in, set that bounds's values to ours.
     * @public
     *
     * This is the immutable form of the function set(), if a bounds is provided. This will return a new bounds, and
     * will not modify this bounds.
     *
     * @param {Bounds3} [bounds] - If not provided, creates a new Bounds3 with filled in values. Otherwise, fills in the
     *                             values of the provided bounds so that it equals this bounds.
     * @returns {Bounds3}
     */
    copy: function( bounds ) {
      if ( bounds ) {
        return bounds.set( this );
      }
      else {
        return new Bounds3( this.minX, this.minY, this.minZ, this.maxX, this.maxY, this.maxZ );
      }
    },

    /**
     * The smallest bounds that contains both this bounds and the input bounds, returned as a copy.
     * @public
     *
     * This is the immutable form of the function includeBounds(). This will return a new bounds, and will not modify
     * this bounds.
     *
     * @param {Bounds3} bounds
     * @returns {Bounds3}
     */
    union: function( bounds ) {
      return new Bounds3(
        Math.min( this.minX, bounds.minX ),
        Math.min( this.minY, bounds.minY ),
        Math.min( this.minZ, bounds.minZ ),
        Math.max( this.maxX, bounds.maxX ),
        Math.max( this.maxY, bounds.maxY ),
        Math.max( this.maxZ, bounds.maxZ )
      );
    },

    /**
     * The smallest bounds that is contained by both this bounds and the input bounds, returned as a copy.
     * @public
     *
     * This is the immutable form of the function constrainBounds(). This will return a new bounds, and will not modify
     * this bounds.
     *
     * @param {Bounds3} bounds
     * @returns {Bounds3}
     */
    intersection: function( bounds ) {
      return new Bounds3(
        Math.max( this.minX, bounds.minX ),
        Math.max( this.minY, bounds.minY ),
        Math.max( this.minZ, bounds.minZ ),
        Math.min( this.maxX, bounds.maxX ),
        Math.min( this.maxY, bounds.maxY ),
        Math.min( this.maxZ, bounds.maxZ )
      );
    },
    // TODO: difference should be well-defined, but more logic is needed to compute

    /**
     * The smallest bounds that contains this bounds and the point (x,y,z), returned as a copy.
     * @public
     *
     * This is the immutable form of the function addCoordinates(). This will return a new bounds, and will not modify
     * this bounds.
     *
     * @param {number} x
     * @param {number} y
     * @param {number} z
     * @returns {Bounds3}
     */
    withCoordinates: function( x, y, z ) {
      return new Bounds3(
        Math.min( this.minX, x ),
        Math.min( this.minY, y ),
        Math.min( this.minZ, z ),
        Math.max( this.maxX, x ),
        Math.max( this.maxY, y ),
        Math.max( this.maxZ, z )
      );
    },

    /**
     * The smallest bounds that contains this bounds and the input point, returned as a copy.
     * @public
     *
     * This is the immutable form of the function addPoint(). This will return a new bounds, and will not modify
     * this bounds.
     *
     * @param {Vector3} point
     * @returns {Bounds3}
     */
    withPoint: function( point ) {
      return this.withCoordinates( point.x, point.y, point.z );
    },

    /**
     * A copy of this bounds, with minX replaced with the input.
     * @public
     *
     * This is the immutable form of the function setMinX(). This will return a new bounds, and will not modify
     * this bounds.
     *
     * @param {number} minX
     * @returns {Bounds3}
     */
    withMinX: function( minX ) {
      return new Bounds3( minX, this.minY, this.minZ, this.maxX, this.maxY, this.maxZ );
    },

    /**
     * A copy of this bounds, with minY replaced with the input.
     * @public
     *
     * This is the immutable form of the function setMinY(). This will return a new bounds, and will not modify
     * this bounds.
     *
     * @param {number} minY
     * @returns {Bounds3}
     */
    withMinY: function( minY ) {
      return new Bounds3( this.minX, minY, this.minZ, this.maxX, this.maxY, this.maxZ );
    },

    /**
     * A copy of this bounds, with minZ replaced with the input.
     * @public
     *
     * This is the immutable form of the function setMinZ(). This will return a new bounds, and will not modify
     * this bounds.
     *
     * @param {number} minZ
     * @returns {Bounds3}
     */
    withMinZ: function( minZ ) {
      return new Bounds3( this.minX, this.minY, minZ, this.maxX, this.maxY, this.maxZ );
    },

    /**
     * A copy of this bounds, with maxX replaced with the input.
     * @public
     *
     * This is the immutable form of the function setMaxX(). This will return a new bounds, and will not modify
     * this bounds.
     *
     * @param {number} maxX
     * @returns {Bounds3}
     */
    withMaxX: function( maxX ) {
      return new Bounds3( this.minX, this.minY, this.minZ, maxX, this.maxY, this.maxZ );
    },

    /**
     * A copy of this bounds, with maxY replaced with the input.
     * @public
     *
     * This is the immutable form of the function setMaxY(). This will return a new bounds, and will not modify
     * this bounds.
     *
     * @param {number} maxY
     * @returns {Bounds3}
     */
    withMaxY: function( maxY ) {
      return new Bounds3( this.minX, this.minY, this.minZ, this.maxX, maxY, this.maxZ );
    },

    /**
     * A copy of this bounds, with maxZ replaced with the input.
     * @public
     *
     * This is the immutable form of the function setMaxZ(). This will return a new bounds, and will not modify
     * this bounds.
     *
     * @param {number} maxZ
     * @returns {Bounds3}
     */
    withMaxZ: function( maxZ ) {
      return new Bounds3( this.minX, this.minY, this.minZ, this.maxX, this.maxY, maxZ );
    },

    /**
     * A copy of this bounds, with the minimum values rounded down to the nearest integer, and the maximum values
     * rounded up to the nearest integer. This causes the bounds to expand as necessary so that its boundaries
     * are integer-aligned.
     * @public
     *
     * This is the immutable form of the function roundOut(). This will return a new bounds, and will not modify
     * this bounds.
     *
     * @returns {Bounds3}
     */
    roundedOut: function() {
      return new Bounds3(
        Math.floor( this.minX ),
        Math.floor( this.minY ),
        Math.floor( this.minZ ),
        Math.ceil( this.maxX ),
        Math.ceil( this.maxY ),
        Math.ceil( this.maxZ )
      );
    },

    /**
     * A copy of this bounds, with the minimum values rounded up to the nearest integer, and the maximum values
     * rounded down to the nearest integer. This causes the bounds to contract as necessary so that its boundaries
     * are integer-aligned.
     * @public
     *
     * This is the immutable form of the function roundIn(). This will return a new bounds, and will not modify
     * this bounds.
     *
     * @returns {Bounds3}
     */
    roundedIn: function() {
      return new Bounds3(
        Math.ceil( this.minX ),
        Math.ceil( this.minY ),
        Math.ceil( this.minZ ),
        Math.floor( this.maxX ),
        Math.floor( this.maxY ),
        Math.floor( this.maxZ )
      );
    },

    /**
     * A bounding box (still axis-aligned) that contains the transformed shape of this bounds, applying the matrix as
     * an affine transformation.
     * @public
     *
     * NOTE: bounds.transformed( matrix ).transformed( inverse ) may be larger than the original box, if it includes
     * a rotation that isn't a multiple of $\pi/2$. This is because the returned bounds may expand in area to cover
     * ALL of the corners of the transformed bounding box.
     *
     * This is the immutable form of the function transform(). This will return a new bounds, and will not modify
     * this bounds.
     *
     * @param {Matrix4} matrix
     * @returns {Bounds3}
     */
    transformed: function( matrix ) {
      return this.copy().transform( matrix );
    },

    /**
     * A bounding box that is expanded on all sides by the specified amount.)
     * @public
     *
     * This is the immutable form of the function dilate(). This will return a new bounds, and will not modify
     * this bounds.
     *
     * @param {number} d
     * @returns {Bounds3}
     */
    dilated: function( d ) {
      return new Bounds3( this.minX - d, this.minY - d, this.minZ - d, this.maxX + d, this.maxY + d, this.maxZ + d );
    },

    /**
     * A bounding box that is expanded horizontally (on the left and right) by the specified amount.
     * @public
     *
     * This is the immutable form of the function dilateX(). This will return a new bounds, and will not modify
     * this bounds.
     *
     * @param {number} x
     * @returns {Bounds3}
     */
    dilatedX: function( x ) {
      return new Bounds3( this.minX - x, this.minY, this.minZ, this.maxX + x, this.maxY, this.maxZ );
    },

    /**
     * A bounding box that is expanded vertically (on the top and bottom) by the specified amount.
     * @public
     *
     * This is the immutable form of the function dilateY(). This will return a new bounds, and will not modify
     * this bounds.
     *
     * @param {number} y
     * @returns {Bounds3}
     */
    dilatedY: function( y ) {
      return new Bounds3( this.minX, this.minY - y, this.minZ, this.maxX, this.maxY + y, this.maxZ );
    },

    /**
     * A bounding box that is expanded depth-wise (on the front and back) by the specified amount.
     * @public
     *
     * This is the immutable form of the function dilateZ(). This will return a new bounds, and will not modify
     * this bounds.
     *
     * @param {number} z
     * @returns {Bounds3}
     */
    dilatedZ: function( z ) {
      return new Bounds3( this.minX, this.minY, this.minZ - z, this.maxX, this.maxY, this.maxZ + z );
    },

    /**
     * A bounding box that is expanded on all sides, with different amounts of expansion along each axis.
     * Will be identical to the bounds returned by calling bounds.dilatedX( x ).dilatedY( y ).dilatedZ( z ).
     * @public
     *
     * This is the immutable form of the function dilateXYZ(). This will return a new bounds, and will not modify
     * this bounds.
     *
     * @param {number} x - Amount to dilate horizontally (for each side)
     * @param {number} y - Amount to dilate vertically (for each side)
     * @param {number} z - Amount to dilate depth-wise (for each side)
     * @returns {Bounds3}
     */
    dilatedXYZ: function( x, y, z ) {
      return new Bounds3( this.minX - x, this.minY - y, this.minZ - z, this.maxX + x, this.maxY + y, this.maxZ + z );
    },

    /**
     * A bounding box that is contracted on all sides by the specified amount.
     * @public
     *
     * This is the immutable form of the function erode(). This will return a new bounds, and will not modify
     * this bounds.
     *
     * @param {number} amount
     * @returns {Bounds3}
     */
    eroded: function( amount ) { return this.dilated( -amount ); },

    /**
     * A bounding box that is contracted horizontally (on the left and right) by the specified amount.
     * @public
     *
     * This is the immutable form of the function erodeX(). This will return a new bounds, and will not modify
     * this bounds.
     *
     * @param {number} x
     * @returns {Bounds3}
     */
    erodedX: function( x ) { return this.dilatedX( -x ); },

    /**
     * A bounding box that is contracted vertically (on the top and bottom) by the specified amount.
     * @public
     *
     * This is the immutable form of the function erodeY(). This will return a new bounds, and will not modify
     * this bounds.
     *
     * @param {number} y
     * @returns {Bounds3}
     */
    erodedY: function( y ) { return this.dilatedY( -y ); },

    /**
     * A bounding box that is contracted depth-wise (on the front and back) by the specified amount.
     * @public
     *
     * This is the immutable form of the function erodeZ(). This will return a new bounds, and will not modify
     * this bounds.
     *
     * @param {number} z
     * @returns {Bounds3}
     */
    erodedZ: function( z ) { return this.dilatedZ( -z ); },

    /**
     * A bounding box that is contracted on all sides, with different amounts of contraction along each axis.
     * @public
     *
     * This is the immutable form of the function erodeXYZ(). This will return a new bounds, and will not modify
     * this bounds.
     *
     * @param {number} x - Amount to erode horizontally (for each side)
     * @param {number} y - Amount to erode vertically (for each side)
     * @param {number} z - Amount to erode depth-wise (for each side)
     * @returns {Bounds3}
     */
    erodedXYZ: function( x, y, z ) { return this.dilatedXYZ( -x, -y, -z ); },

    /**
     * Our bounds, translated horizontally by x, returned as a copy.
     * @public
     *
     * This is the immutable form of the function shiftX(). This will return a new bounds, and will not modify
     * this bounds.
     *
     * @param {number} x
     * @returns {Bounds3}
     */
    shiftedX: function( x ) {
      return new Bounds3( this.minX + x, this.minY, this.minZ, this.maxX + x, this.maxY, this.maxZ );
    },

    /**
     * Our bounds, translated vertically by y, returned as a copy.
     * @public
     *
     * This is the immutable form of the function shiftY(). This will return a new bounds, and will not modify
     * this bounds.
     *
     * @param {number} y
     * @returns {Bounds3}
     */
    shiftedY: function( y ) {
      return new Bounds3( this.minX, this.minY + y, this.minZ, this.maxX, this.maxY + y, this.maxZ );
    },

    /**
     * Our bounds, translated depth-wise by z, returned as a copy.
     * @public
     *
     * This is the immutable form of the function shiftZ(). This will return a new bounds, and will not modify
     * this bounds.
     *
     * @param {number} z
     * @returns {Bounds3}
     */
    shiftedZ: function( z ) {
      return new Bounds3( this.minX, this.minY, this.minZ + z, this.maxX, this.maxY, this.maxZ + z );
    },

    /**
     * Our bounds, translated by (x,y,z), returned as a copy.
     * @public
     *
     * This is the immutable form of the function shift(). This will return a new bounds, and will not modify
     * this bounds.
     *
     * @param {number} x
     * @param {number} y
     * @param {number} z
     * @returns {Bounds3}
     */
    shifted: function( x, y, z ) {
      return new Bounds3( this.minX + x, this.minY + y, this.minZ + z, this.maxX + x, this.maxY + y, this.maxZ + z );
    },

    /*---------------------------------------------------------------------------*
     * Mutable operations
     *
     * All mutable operations should call one of the following:
     *   setMinMax, setMinX, setMinY, setMinZ, setMaxX, setMaxY, setMaxZ
     *---------------------------------------------------------------------------*/

    /**
     * Sets each value for this bounds, and returns itself.
     * @public
     *
     * @param {number} minX
     * @param {number} minY
     * @param {number} minZ
     * @param {number} maxX
     * @param {number} maxY
     * @param {number} maxZ
     * @returns {Bounds3}
     */
    setMinMax: function( minX, minY, minZ, maxX, maxY, maxZ ) {
      this.minX = minX;
      this.minY = minY;
      this.minZ = minZ;
      this.maxX = maxX;
      this.maxY = maxY;
      this.maxZ = maxZ;
      return this;
    },

    /**
     * Sets the value of minX.
     * @public
     *
     * This is the mutable form of the function withMinX(). This will mutate (change) this bounds, in addition to returning
     * this bounds itself.
     *
     * @param {number} minX
     * @returns {Bounds3}
     */
    setMinX: function( minX ) {
      this.minX = minX;
      return this;
    },

    /**
     * Sets the value of minY.
     * @public
     *
     * This is the mutable form of the function withMinY(). This will mutate (change) this bounds, in addition to returning
     * this bounds itself.
     *
     * @param {number} minY
     * @returns {Bounds3}
     */
    setMinY: function( minY ) {
      this.minY = minY;
      return this;
    },

    /**
     * Sets the value of minZ.
     * @public
     *
     * This is the mutable form of the function withMinZ(). This will mutate (change) this bounds, in addition to returning
     * this bounds itself.
     *
     * @param {number} minZ
     * @returns {Bounds3}
     */
    setMinZ: function( minZ ) {
      this.minZ = minZ;
      return this;
    },

    /**
     * Sets the value of maxX.
     * @public
     *
     * This is the mutable form of the function withMaxX(). This will mutate (change) this bounds, in addition to returning
     * this bounds itself.
     *
     * @param {number} maxX
     * @returns {Bounds3}
     */
    setMaxX: function( maxX ) {
      this.maxX = maxX;
      return this;
    },

    /**
     * Sets the value of maxY.
     * @public
     *
     * This is the mutable form of the function withMaxY(). This will mutate (change) this bounds, in addition to returning
     * this bounds itself.
     *
     * @param {number} maxY
     * @returns {Bounds3}
     */
    setMaxY: function( maxY ) {
      this.maxY = maxY;
      return this;
    },

    /**
     * Sets the value of maxZ.
     * @public
     *
     * This is the mutable form of the function withMaxZ(). This will mutate (change) this bounds, in addition to returning
     * this bounds itself.
     *
     * @param {number} maxZ
     * @returns {Bounds3}
     */
    setMaxZ: function( maxZ ) {
      this.maxZ = maxZ;
      return this;
    },

    /**
     * Sets the values of this bounds to be equal to the input bounds.
     * @public
     *
     * This is the mutable form of the function copy(). This will mutate (change) this bounds, in addition to returning
     * this bounds itself.
     *
     * @param {Bounds3} bounds
     * @returns {Bounds3}
     */
    set: function( bounds ) {
      return this.setMinMax( bounds.minX, bounds.minY, bounds.minZ, bounds.maxX, bounds.maxY, bounds.maxZ );
    },

    /**
     * Modifies this bounds so that it contains both its original bounds and the input bounds.
     * @public
     *
     * This is the mutable form of the function union(). This will mutate (change) this bounds, in addition to returning
     * this bounds itself.
     *
     * @param {Bounds3} bounds
     * @returns {Bounds3}
     */
    includeBounds: function( bounds ) {
      return this.setMinMax(
        Math.min( this.minX, bounds.minX ),
        Math.min( this.minY, bounds.minY ),
        Math.min( this.minZ, bounds.minZ ),
        Math.max( this.maxX, bounds.maxX ),
        Math.max( this.maxY, bounds.maxY ),
        Math.max( this.maxZ, bounds.maxZ )
      );
    },

    /**
     * Modifies this bounds so that it is the largest bounds contained both in its original bounds and in the input bounds.
     * @public
     *
     * This is the mutable form of the function intersection(). This will mutate (change) this bounds, in addition to returning
     * this bounds itself.
     *
     * @param {Bounds3} bounds
     * @returns {Bounds3}
     */
    constrainBounds: function( bounds ) {
      return this.setMinMax(
        Math.max( this.minX, bounds.minX ),
        Math.max( this.minY, bounds.minY ),
        Math.max( this.minZ, bounds.minZ ),
        Math.min( this.maxX, bounds.maxX ),
        Math.min( this.maxY, bounds.maxY ),
        Math.min( this.maxZ, bounds.maxZ )
      );
    },

    /**
     * Modifies this bounds so that it contains both its original bounds and the input point (x,y,z).
     * @public
     *
     * This is the mutable form of the function withCoordinates(). This will mutate (change) this bounds, in addition to returning
     * this bounds itself.
     *
     * @param {number} x
     * @param {number} y
     * @param {number} z
     * @returns {Bounds3}
     */
    addCoordinates: function( x, y, z ) {
      return this.setMinMax(
        Math.min( this.minX, x ),
        Math.min( this.minY, y ),
        Math.min( this.minZ, z ),
        Math.max( this.maxX, x ),
        Math.max( this.maxY, y ),
        Math.max( this.maxZ, z )
      );
    },

    /**
     * Modifies this bounds so that it contains both its original bounds and the input point.
     * @public
     *
     * This is the mutable form of the function withPoint(). This will mutate (change) this bounds, in addition to returning
     * this bounds itself.
     *
     * @param {Vector3} point
     * @returns {Bounds3}
     */
    addPoint: function( point ) {
      return this.addCoordinates( point.x, point.y, point.z );
    },

    /**
     * Modifies this bounds so that its boundaries are integer-aligned, rounding the minimum boundaries down and the
     * maximum boundaries up (expanding as necessary).
     * @public
     *
     * This is the mutable form of the function roundedOut(). This will mutate (change) this bounds, in addition to returning
     * this bounds itself.
     *
     * @returns {Bounds3}
     */
    roundOut: function() {
      return this.setMinMax(
        Math.floor( this.minX ),
        Math.floor( this.minY ),
        Math.floor( this.minZ ),
        Math.ceil( this.maxX ),
        Math.ceil( this.maxY ),
        Math.ceil( this.maxZ )
      );
    },

    /**
     * Modifies this bounds so that its boundaries are integer-aligned, rounding the minimum boundaries up and the
     * maximum boundaries down (contracting as necessary).
     * @public
     *
     * This is the mutable form of the function roundedIn(). This will mutate (change) this bounds, in addition to returning
     * this bounds itself.
     *
     * @returns {Bounds3}
     */
    roundIn: function() {
      return this.setMinMax(
        Math.ceil( this.minX ),
        Math.ceil( this.minY ),
        Math.ceil( this.minZ ),
        Math.floor( this.maxX ),
        Math.floor( this.maxY ),
        Math.floor( this.maxZ )
      );
    },

    /**
     * Modifies this bounds so that it would fully contain a transformed version if its previous value, applying the
     * matrix as an affine transformation.
     * @public
     *
     * NOTE: bounds.transform( matrix ).transform( inverse ) may be larger than the original box, if it includes
     * a rotation that isn't a multiple of $\pi/2$. This is because the bounds may expand in area to cover
     * ALL of the corners of the transformed bounding box.
     *
     * This is the mutable form of the function transformed(). This will mutate (change) this bounds, in addition to returning
     * this bounds itself.
     *
     * @param {Matrix4} matrix
     * @returns {Bounds3}
     */
    transform: function( matrix ) {
      // do nothing
      if ( this.isEmpty() ) {
        return this;
      }

      // optimization to bail for identity matrices
      if ( matrix.isIdentity() ) {
        return this;
      }

      var minX = Number.POSITIVE_INFINITY;
      var minY = Number.POSITIVE_INFINITY;
      var minZ = Number.POSITIVE_INFINITY;
      var maxX = Number.NEGATIVE_INFINITY;
      var maxY = Number.NEGATIVE_INFINITY;
      var maxZ = Number.NEGATIVE_INFINITY;

      // using mutable vector so we don't create excessive instances of Vector2 during this
      // make sure all 4 corners are inside this transformed bounding box
      var vector = new dot.Vector3( 0, 0, 0 );

      function withIt( vector ) {
        minX = Math.min( minX, vector.x );
        minY = Math.min( minY, vector.y );
        minZ = Math.min( minZ, vector.z );
        maxX = Math.max( maxX, vector.x );
        maxY = Math.max( maxY, vector.y );
        maxZ = Math.max( maxZ, vector.z );
      }

      withIt( matrix.multiplyVector3( vector.setXYZ( this.minX, this.minY, this.minZ ) ) );
      withIt( matrix.multiplyVector3( vector.setXYZ( this.minX, this.maxY, this.minZ ) ) );
      withIt( matrix.multiplyVector3( vector.setXYZ( this.maxX, this.minY, this.minZ ) ) );
      withIt( matrix.multiplyVector3( vector.setXYZ( this.maxX, this.maxY, this.minZ ) ) );
      withIt( matrix.multiplyVector3( vector.setXYZ( this.minX, this.minY, this.maxZ ) ) );
      withIt( matrix.multiplyVector3( vector.setXYZ( this.minX, this.maxY, this.maxZ ) ) );
      withIt( matrix.multiplyVector3( vector.setXYZ( this.maxX, this.minY, this.maxZ ) ) );
      withIt( matrix.multiplyVector3( vector.setXYZ( this.maxX, this.maxY, this.maxZ ) ) );
      return this.setMinMax( minX, minY, minZ, maxX, maxY, maxZ );
    },

    /**
     * Expands this bounds on all sides by the specified amount.
     * @public
     *
     * This is the mutable form of the function dilated(). This will mutate (change) this bounds, in addition to returning
     * this bounds itself.
     *
     * @param {number} d
     * @returns {Bounds3}
     */
    dilate: function( d ) {
      return this.setMinMax( this.minX - d, this.minY - d, this.minZ - d, this.maxX + d, this.maxY + d, this.maxZ + d );
    },

    /**
     * Expands this bounds horizontally (left and right) by the specified amount.
     * @public
     *
     * This is the mutable form of the function dilatedX(). This will mutate (change) this bounds, in addition to returning
     * this bounds itself.
     *
     * @param {number} x
     * @returns {Bounds3}
     */
    dilateX: function( x ) {
      return this.setMinMax( this.minX - x, this.minY, this.minZ, this.maxX + x, this.maxY, this.maxZ );
    },

    /**
     * Expands this bounds vertically (top and bottom) by the specified amount.
     * @public
     *
     * This is the mutable form of the function dilatedY(). This will mutate (change) this bounds, in addition to returning
     * this bounds itself.
     *
     * @param {number} y
     * @returns {Bounds3}
     */
    dilateY: function( y ) {
      return this.setMinMax( this.minX, this.minY - y, this.minZ, this.maxX, this.maxY + y, this.maxZ );
    },

    /**
     * Expands this bounds depth-wise (front and back) by the specified amount.
     * @public
     *
     * This is the mutable form of the function dilatedZ(). This will mutate (change) this bounds, in addition to returning
     * this bounds itself.
     *
     * @param {number} z
     * @returns {Bounds3}
     */
    dilateZ: function( z ) {
      return this.setMinMax( this.minX, this.minY, this.minZ - z, this.maxX, this.maxY, this.maxZ + z );
    },

    /**
     * Expands this bounds independently along each axis. Will be equal to calling
     * bounds.dilateX( x ).dilateY( y ).dilateZ( z ).
     * @public
     *
     * This is the mutable form of the function dilatedXYZ(). This will mutate (change) this bounds, in addition to returning
     * this bounds itself.
     *
     * @param {number} x
     * @param {number} y
     * @param {number} z
     * @returns {Bounds3}
     */
    dilateXYZ: function( x, y, z ) {
      return this.setMinMax( this.minX - x, this.minY - y, this.minZ - z, this.maxX + x, this.maxY + y, this.maxZ + z );
    },

    /**
     * Contracts this bounds on all sides by the specified amount.
     * @public
     *
     * This is the mutable form of the function eroded(). This will mutate (change) this bounds, in addition to returning
     * this bounds itself.
     *
     * @param {number} d
     * @returns {Bounds3}
     */
    erode: function( d ) { return this.dilate( -d ); },

    /**
     * Contracts this bounds horizontally (left and right) by the specified amount.
     * @public
     *
     * This is the mutable form of the function erodedX(). This will mutate (change) this bounds, in addition to returning
     * this bounds itself.
     *
     * @param {number} x
     * @returns {Bounds3}
     */
    erodeX: function( x ) { return this.dilateX( -x ); },

    /**
     * Contracts this bounds vertically (top and bottom) by the specified amount.
     * @public
     *
     * This is the mutable form of the function erodedY(). This will mutate (change) this bounds, in addition to returning
     * this bounds itself.
     *
     * @param {number} y
     * @returns {Bounds3}
     */
    erodeY: function( y ) { return this.dilateY( -y ); },

    /**
     * Contracts this bounds depth-wise (front and back) by the specified amount.
     * @public
     *
     * This is the mutable form of the function erodedZ(). This will mutate (change) this bounds, in addition to returning
     * this bounds itself.
     *
     * @param {number} z
     * @returns {Bounds3}
     */
    erodeZ: function( z ) { return this.dilateZ( -z ); },

    /**
     * Contracts this bounds independently along each axis. Will be equal to calling
     * bounds.erodeX( x ).erodeY( y ).erodeZ( z ).
     * @public
     *
     * This is the mutable form of the function erodedXYZ(). This will mutate (change) this bounds, in addition to returning
     * this bounds itself.
     *
     * @param {number} x
     * @param {number} y
     * @param {number} z
     * @returns {Bounds3}
     */
    erodeXYZ: function( x, y, z ) { return this.dilateXYZ( -x, -y, -z ); },

    /**
     * Translates our bounds horizontally by x.
     * @public
     *
     * This is the mutable form of the function shiftedX(). This will mutate (change) this bounds, in addition to returning
     * this bounds itself.
     *
     * @param {number} x
     * @returns {Bounds3}
     */
    shiftX: function( x ) {
      return this.setMinMax( this.minX + x, this.minY, this.minZ, this.maxX + x, this.maxY, this.maxZ );
    },

    /**
     * Translates our bounds vertically by y.
     * @public
     *
     * This is the mutable form of the function shiftedY(). This will mutate (change) this bounds, in addition to returning
     * this bounds itself.
     *
     * @param {number} y
     * @returns {Bounds3}
     */
    shiftY: function( y ) {
      return this.setMinMax( this.minX, this.minY + y, this.minZ, this.maxX, this.maxY + y, this.maxZ );
    },

    /**
     * Translates our bounds depth-wise by z.
     * @public
     *
     * This is the mutable form of the function shiftedZ(). This will mutate (change) this bounds, in addition to returning
     * this bounds itself.
     *
     * @param {number} z
     * @returns {Bounds3}
     */
    shiftZ: function( z ) {
      return this.setMinMax( this.minX, this.minY, this.minZ + z, this.maxX, this.maxY, this.maxZ + z );
    },

    /**
     * Translates our bounds by (x,y,z).
     * @public
     *
     * This is the mutable form of the function shifted(). This will mutate (change) this bounds, in addition to returning
     * this bounds itself.
     *
     * @param {number} x
     * @param {number} y
     * @param {number} z
     * @returns {Bounds3}
     */
    shift: function( x, y, z ) {
      return this.setMinMax( this.minX + x, this.minY + y, this.minZ + z, this.maxX + x, this.maxY + y, this.maxZ + z );
    }
  }, {
    /**
     * Returns a new Bounds3 object, with the cuboid (3d rectangle) construction with x, y, z, width, height and depth.
     * @public
     *
     * @param {number} x - The minimum value of X for the bounds.
     * @param {number} y - The minimum value of Y for the bounds.
     * @param {number} z - The minimum value of Z for the bounds.
     * @param {number} width - The width (maxX - minX) of the bounds.
     * @param {number} height - The height (maxY - minY) of the bounds.
     * @param {number} depth - The depth (maxZ - minZ) of the bounds.
     * @returns {Bounds3}
     */
    cuboid: function( x, y, z, width, height, depth ) {
      return new Bounds3( x, y, z, x + width, y + height, z + depth );
    },

    /**
     * Returns a new Bounds3 object that only contains the specified point (x,y,z). Useful for being dilated to form a
     * bounding box around a point. Note that the bounds will not be "empty" as it contains (x,y,z), but it will have
     * zero area.
     * @public
     *
     * @param {number} x
     * @param {number} y
     * @param {number} z
     * @returns {Bounds3}
     */
    point: function( x, y, z ) {
      return new Bounds3( x, y, z, x, y, z );
    }
  } );
  Poolable.mixInto( Bounds3, {
    initialize: Bounds3.prototype.setMinMax
  } );

  /**
   * A contant Bounds3 with minimums = $\infty$, maximums = $-\infty$, so that it represents "no bounds whatsoever".
   * @public
   *
   * This allows us to take the union (union/includeBounds) of this and any other Bounds3 to get the other bounds back,
   * e.g. Bounds3.NOTHING.union( bounds ).equals( bounds ). This object naturally serves as the base case as a union of
   * zero bounds objects.
   *
   * Additionally, intersections with NOTHING will always return a Bounds3 equivalent to NOTHING.
   *
   * @constant {Bounds3} NOTHING
   */
  Bounds3.NOTHING = new Bounds3( Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY );

  /**
   * A contant Bounds3 with minimums = $-\infty$, maximums = $\infty$, so that it represents "all bounds".
   * @public
   *
   * This allows us to take the intersection (intersection/constrainBounds) of this and any other Bounds3 to get the
   * other bounds back, e.g. Bounds3.EVERYTHING.intersection( bounds ).equals( bounds ). This object naturally serves as
   * the base case as an intersection of zero bounds objects.
   *
   * Additionally, unions with EVERYTHING will always return a Bounds3 equivalent to EVERYTHING.
   *
   * @constant {Bounds3} EVERYTHING
   */
  Bounds3.EVERYTHING = new Bounds3( Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY );

  return Bounds3;
} );
