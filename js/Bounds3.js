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
   * @param {number} minX - The intial minimum X coordinate of the bounds.
   * @param {number} minY - The intial minimum Y coordinate of the bounds.
   * @param {number} minZ - The intial minimum Z coordinate of the bounds.
   * @param {number} maxX - The intial maximum X coordinate of the bounds.
   * @param {number} maxY - The intial maximum Y coordinate of the bounds.
   * @param {number} maxZ - The intial maximum Z coordinate of the bounds.
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

    phetAllocation && phetAllocation( 'Bounds3' );
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

    // immutable operations (bounding-box style handling, so that the relevant bounds contain everything)
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

    // like a union with a point-sized bounding box
    withPoint: function( point ) {
      return this.withCoordinates( point.x, point.y, point.z );
    },

    withMinX: function( minX ) { return new Bounds3( minX, this.minY, this.minZ, this.maxX, this.maxY, this.maxZ ); },
    withMinY: function( minY ) { return new Bounds3( this.minX, minY, this.minZ, this.maxX, this.maxY, this.maxZ ); },
    withMinZ: function( minZ ) { return new Bounds3( this.minX, this.minY, minZ, this.maxX, this.maxY, this.maxZ ); },
    withMaxX: function( maxX ) { return new Bounds3( this.minX, this.minY, this.minZ, maxX, this.maxY, this.maxZ ); },
    withMaxY: function( maxY ) { return new Bounds3( this.minX, this.minY, this.minZ, this.maxX, maxY, this.maxZ ); },
    withMaxZ: function( maxZ ) { return new Bounds3( this.minX, this.minY, this.minZ, this.maxX, this.maxY, maxZ ); },

    // copy rounded to integral values, expanding where necessary
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

    // copy rounded to integral values, contracting where necessary
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

    // transform a bounding box.
    // NOTE that box.transformed( matrix ).transformed( inverse ) may be larger than the original box
    transformed: function( matrix ) {
      return this.copy().transform( matrix );
    },

    // returns copy expanded on all sides by length d
    dilated: function( d ) {
      return new Bounds3( this.minX - d, this.minY - d, this.minZ - d, this.maxX + d, this.maxY + d, this.maxZ + d );
    },

    // dilates only in the x direction
    dilatedX: function( x ) {
      return new Bounds3( this.minX - x, this.minY, this.minZ, this.maxX + x, this.maxY, this.maxZ );
    },

    // dilates only in the y direction
    dilatedY: function( y ) {
      return new Bounds3( this.minX, this.minY - y, this.minZ, this.maxX, this.maxY + y, this.maxZ );
    },

    // dilates only in the z direction
    dilatedZ: function( z ) {
      return new Bounds3( this.minX, this.minY, this.minZ - z, this.maxX, this.maxY, this.maxZ + z );
    },

    // dilate with different amounts in the x, y and z directions
    dilatedXYZ: function( x, y, z ) {
      return new Bounds3( this.minX - x, this.minY - y, this.minZ - z, this.maxX + x, this.maxY + y, this.maxZ + z );
    },

    // returns copy contracted on all sides by length d, or x/y/z separately
    eroded: function( d ) { return this.dilated( -d ); },
    erodedX: function( x ) { return this.dilatedX( -x ); },
    erodedY: function( y ) { return this.dilatedY( -y ); },
    erodedZ: function( z ) { return this.dilatedZ( -z ); },
    erodedXYZ: function( x, y, z ) { return this.dilatedXYZ( -x, -y, -z ); },

    shiftedX: function( x ) {
      return new Bounds3( this.minX + x, this.minY, this.minZ, this.maxX + x, this.maxY, this.maxZ );
    },

    shiftedY: function( y ) {
      return new Bounds3( this.minX, this.minY + y, this.minZ, this.maxX, this.maxY + y, this.maxZ );
    },

    shiftedZ: function( z ) {
      return new Bounds3( this.minX, this.minY, this.minZ + z, this.maxX, this.maxY, this.maxZ + z );
    },

    shifted: function( x, y, z ) {
      return new Bounds3( this.minX + x, this.minY + y, this.minZ + z, this.maxX + x, this.maxY + y, this.maxZ + z );
    },

    /*---------------------------------------------------------------------------*
     * Mutable operations
     *---------------------------------------------------------------------------*/

    // core mutations (every other mutator should call one of these once)
    setMinMax: function( minX, minY, minZ, maxX, maxY, maxZ ) {
      this.minX = minX;
      this.minY = minY;
      this.minZ = minZ;
      this.maxX = maxX;
      this.maxY = maxY;
      this.maxZ = maxZ;
      return this;
    },
    setMinX: function( minX ) {
      this.minX = minX;
      return this;
    },
    setMinY: function( minY ) {
      this.minY = minY;
      return this;
    },
    setMinZ: function( minZ ) {
      this.minZ = minZ;
      return this;
    },
    setMaxX: function( maxX ) {
      this.maxX = maxX;
      return this;
    },
    setMaxY: function( maxY ) {
      this.maxY = maxY;
      return this;
    },
    setMaxZ: function( maxZ ) {
      this.maxZ = maxZ;
      return this;
    },

    set: function( bounds ) {
      return this.setMinMax( bounds.minX, bounds.minY, bounds.minZ, bounds.maxX, bounds.maxY, bounds.maxZ );
    },

    // mutable union
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

    // mutable intersection
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

    addPoint: function( point ) {
      return this.addCoordinates( point.x, point.y, point.z );
    },

    // round to integral values, expanding where necessary
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

    // round to integral values, contracting where necessary
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

    // transform a bounding box.
    // NOTE that box.transformed( matrix ).transformed( inverse ) may be larger than the original box
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
      var vector = new dot.Vector3();

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

    // expands on all sides by length d
    dilate: function( d ) {
      return this.setMinMax( this.minX - d, this.minY - d, this.minZ - d, this.maxX + d, this.maxY + d, this.maxZ + d );
    },

    // dilates only in the x direction
    dilateX: function( x ) {
      return this.setMinMax( this.minX - x, this.minY, this.minZ, this.maxX + x, this.maxY, this.maxZ );
    },

    // dilates only in the y direction
    dilateY: function( y ) {
      return this.setMinMax( this.minX, this.minY - y, this.minZ, this.maxX, this.maxY + y, this.maxZ );
    },

    // dilates only in the z direction
    dilateZ: function( z ) {
      return this.setMinMax( this.minX, this.minY, this.minZ - z, this.maxX, this.maxY, this.maxZ + z );
    },

    // dilate with different amounts in the x, y and z directions
    dilateXYZ: function( x, y, z ) {
      return this.setMinMax( this.minX - x, this.minY - y, this.minZ - z, this.maxX + x, this.maxY + y, this.maxZ + z );
    },

    // contracts on all sides by length d, or x/y/z independently
    erode: function( d ) { return this.dilate( -d ); },
    erodeX: function( x ) { return this.dilateX( -x ); },
    erodeY: function( y ) { return this.dilateY( -y ); },
    erodeZ: function( z ) { return this.dilateZ( -z ); },
    erodeXYZ: function( x, y, z ) { return this.dilateXYZ( -x, -y, -z ); },

    shiftX: function( x ) {
      return this.setMinMax( this.minX + x, this.minY, this.minZ, this.maxX + x, this.maxY, this.maxZ );
    },

    shiftY: function( y ) {
      return this.setMinMax( this.minX, this.minY + y, this.minZ, this.maxX, this.maxY + y, this.maxZ );
    },

    shiftZ: function( z ) {
      return this.setMinMax( this.minX, this.minY, this.minZ + z, this.maxX, this.maxY, this.maxZ + z );
    },

    shift: function( x, y, z ) {
      return this.setMinMax( this.minX + x, this.minY + y, this.minZ + z, this.maxX + x, this.maxY + y, this.maxZ + z );
    }
  }, {
    cuboid: function( x, y, z, width, height, depth ) {
      return new Bounds3( x, y, z, x + width, y + height, z + depth );
    },

    // a volume-less point bounds, which can be dilated to form a centered bounds
    point: function( x, y, z ) {
      return new Bounds3( x, y, z, x, y, z );
    }
  } );

  Poolable.mixin( Bounds3, {
    defaultFactory: function() { return Bounds3.NOTHING.copy(); },
    constructorDuplicateFactory: function( pool ) {
      return function( minX, minY, minZ, maxX, maxY, maxZ ) {
        if ( pool.length ) {
          return pool.pop().setMinMax( minX, minY, minZ, maxX, maxY, maxZ );
        }
        else {
          return new Bounds3( minX, minY, minZ, maxX, maxY, maxZ );
        }
      };
    }
  } );

  // specific bounds useful for operations
  Bounds3.EVERYTHING = new Bounds3( Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY );
  Bounds3.NOTHING = new Bounds3( Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY );

  return Bounds3;
} );
