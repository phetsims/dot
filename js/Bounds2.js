// Copyright 2013-2015, University of Colorado Boulder

/**
 * A 2D rectangle-shaped bounded area (bounding box).
 *
 * There are a number of convenience functions to get locations and points on the Bounds. Currently we do not
 * store these with the Bounds2 instance, since we want to lower the memory footprint.
 *
 * minX, minY, maxX, and maxY are actually stored. We don't do x,y,width,height because this can't properly express
 * semi-infinite bounds (like a half-plane), or easily handle what Bounds2.NOTHING and Bounds2.EVERYTHING do with
 * the constructive solid areas.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

define( function( require ) {
  'use strict';

  var dot = require( 'DOT/dot' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Poolable = require( 'PHET_CORE/Poolable' );
  var Vector2 = require( 'DOT/Vector2' );

  // Temporary instances to be used in the transform method.
  var scratchVector2 = new dot.Vector2( 0, 0 );

  /**
   * Creates a 2-dimensional bounds (bounding box).
   * @constructor
   * @public
   *
   * @param {number} minX - The initial minimum X coordinate of the bounds.
   * @param {number} minY - The initial minimum Y coordinate of the bounds.
   * @param {number} maxX - The initial maximum X coordinate of the bounds.
   * @param {number} maxY - The initial maximum Y coordinate of the bounds.
   */
  function Bounds2( minX, minY, maxX, maxY ) {
    assert && assert( maxY !== undefined, 'Bounds2 requires 4 parameters' );

    // @public {number} - The minimum X coordinate of the bounds.
    this.minX = minX;

    // @public {number} - The minimum Y coordinate of the bounds.
    this.minY = minY;

    // @public {number} - The maximum X coordinate of the bounds.
    this.maxX = maxX;

    // @public {number} - The maximum Y coordinate of the bounds.
    this.maxY = maxY;
  }

  dot.register( 'Bounds2', Bounds2 );

  inherit( Object, Bounds2, {
    // @public (read-only) - Helps to identify the dimension of the bounds
    isBounds: true,
    dimension: 2,

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

    /*
     * Convenience locations
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
     * @public
     *
     * @returns {number}
     */
    getX: function() { return this.minX; },
    get x() { return this.getX(); },

    /**
     * Alias for minY, when thinking of the bounds as an (x,y,width,height) rectangle.
     * @public
     *
     * @returns {number}
     */
    getY: function() { return this.minY; },
    get y() { return this.getY(); },

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
     * The point (minX, minY), in the UI-coordinate upper-left.
     * @public
     *
     * @returns {Vector2}
     */
    getLeftTop: function() { return new dot.Vector2( this.minX, this.minY ); },
    get leftTop() { return this.getLeftTop(); },

    /**
     * The point (centerX, minY), in the UI-coordinate upper-center.
     * @public
     *
     * @returns {Vector2}
     */
    getCenterTop: function() { return new dot.Vector2( this.getCenterX(), this.minY ); },
    get centerTop() { return this.getCenterTop(); },

    /**
     * The point (right, minY), in the UI-coordinate upper-right.
     * @public
     *
     * @returns {Vector2}
     */
    getRightTop: function() { return new dot.Vector2( this.maxX, this.minY ); },
    get rightTop() { return this.getRightTop(); },

    /**
     * The point (left, centerY), in the UI-coordinate center-left.
     * @public
     *
     * @returns {Vector2}
     */
    getLeftCenter: function() { return new dot.Vector2( this.minX, this.getCenterY() ); },
    get leftCenter() { return this.getLeftCenter(); },

    /**
     * The point (centerX, centerY), in the center of the bounds.
     * @public
     *
     * @returns {Vector2}
     */
    getCenter: function() { return new dot.Vector2( this.getCenterX(), this.getCenterY() ); },
    get center() { return this.getCenter(); },

    /**
     * The point (maxX, centerY), in the UI-coordinate center-right
     * @public
     *
     * @returns {Vector2}
     */
    getRightCenter: function() { return new dot.Vector2( this.maxX, this.getCenterY() ); },
    get rightCenter() { return this.getRightCenter(); },

    /**
     * The point (minX, maxY), in the UI-coordinate lower-left
     * @public
     *
     * @returns {Vector2}
     */
    getLeftBottom: function() { return new dot.Vector2( this.minX, this.maxY ); },
    get leftBottom() { return this.getLeftBottom(); },

    /**
     * The point (centerX, maxY), in the UI-coordinate lower-center
     * @public
     *
     * @returns {Vector2}
     */
    getCenterBottom: function() { return new dot.Vector2( this.getCenterX(), this.maxY ); },
    get centerBottom() { return this.getCenterBottom(); },

    /**
     * The point (maxX, maxY), in the UI-coordinate lower-right
     * @public
     *
     * @returns {Vector2}
     */
    getRightBottom: function() { return new dot.Vector2( this.maxX, this.maxY ); },
    get rightBottom() { return this.getRightBottom(); },

    /**
     * Whether we have negative width or height. Bounds2.NOTHING is a prime example of an empty Bounds2.
     * Bounds with width = height = 0 are considered not empty, since they include the single (0,0) point.
     * @public
     *
     * @returns {boolean}
     */
    isEmpty: function() { return this.getWidth() < 0 || this.getHeight() < 0; },

    /**
     * Whether our minimums and maximums are all finite numbers. This will exclude Bounds2.NOTHING and Bounds2.EVERYTHING.
     * @public
     *
     * @returns {boolean}
     */
    isFinite: function() {
      return isFinite( this.minX ) && isFinite( this.minY ) && isFinite( this.maxX ) && isFinite( this.maxY );
    },

    /**
     * Whether this bounds has a non-zero area (non-zero positive width and height).
     * @public
     *
     * @returns {boolean}
     */
    hasNonzeroArea: function() {
      return this.getWidth() > 0 && this.getHeight() > 0;
    },

    /**
     * Whether this bounds has a finite and non-negative width and height.
     * @public
     *
     * @returns {boolean}
     */
    isValid: function() {
      return !this.isEmpty() && this.isFinite();
    },

    /**
     * If the location is inside the bounds, the location will be returned. Otherwise, this will return a new location
     * on the edge of the bounds that is the closest to the provided location.
     * @public
     *
     * @param {Vector2} location
     * @returns {Vector2}
     */
    closestPointTo: function( location ) {
      if ( this.containsCoordinates( location.x, location.y ) ) {
        return location;
      }
      else {
        var xConstrained = Math.max( Math.min( location.x, this.maxX ), this.x );
        var yConstrained = Math.max( Math.min( location.y, this.maxY ), this.y );
        return new Vector2( xConstrained, yConstrained );
      }
    },

    /**
     * Whether the coordinates are contained inside the bounding box, or are on the boundary.
     * @public
     *
     * @param {number} x - X coordinate of the point to check
     * @param {number} y - Y coordinate of the point to check
     * @returns {boolean}
     */
    containsCoordinates: function( x, y ) {
      return this.minX <= x && x <= this.maxX && this.minY <= y && y <= this.maxY;
    },

    /**
     * Whether the point is contained inside the bounding box, or is on the boundary.
     * @public
     *
     * @param {Vector2} point
     * @returns {boolean}
     */
    containsPoint: function( point ) {
      return this.containsCoordinates( point.x, point.y );
    },

    /**
     * Whether this bounding box completely contains the bounding box passed as a parameter. The boundary of a box is
     * considered to be "contained".
     * @public
     *
     * @param {Bounds2} bounds
     * @returns {boolean}
     */
    containsBounds: function( bounds ) {
      return this.minX <= bounds.minX && this.maxX >= bounds.maxX && this.minY <= bounds.minY && this.maxY >= bounds.maxY;
    },

    /**
     * Whether this and another bounding box have any points of intersection (including touching boundaries).
     * @public
     *
     * @param {Bounds2} bounds
     * @returns {boolean}
     */
    intersectsBounds: function( bounds ) {
      var minX = Math.max( this.minX, bounds.minX );
      var minY = Math.max( this.minY, bounds.minY );
      var maxX = Math.min( this.maxX, bounds.maxX );
      var maxY = Math.min( this.maxY, bounds.maxY );
      return ( maxX - minX ) >= 0 && ( maxY - minY >= 0 );
    },

    /**
     * The squared distance from the input point to the point closest to it inside the bounding box.
     * @public
     *
     * @param {Vector2} point
     * @returns {number}
     */
    minimumDistanceToPointSquared: function( point ) {
      var closeX = point.x < this.minX ? this.minX : ( point.x > this.maxX ? this.maxX : null );
      var closeY = point.y < this.minY ? this.minY : ( point.y > this.maxY ? this.maxY : null );
      var d;
      if ( closeX === null && closeY === null ) {
        // inside, or on the boundary
        return 0;
      }
      else if ( closeX === null ) {
        // vertically directly above/below
        d = closeY - point.y;
        return d * d;
      }
      else if ( closeY === null ) {
        // horizontally directly to the left/right
        d = closeX - point.x;
        return d * d;
      }
      else {
        // corner case
        var dx = closeX - point.x;
        var dy = closeY - point.y;
        return dx * dx + dy * dy;
      }
    },

    /**
     * The squared distance from the input point to the point furthest from it inside the bounding box.
     * @public
     *
     * @param {Vector2} point
     * @returns {number}
     */
    maximumDistanceToPointSquared: function( point ) {
      var x = point.x > this.getCenterX() ? this.minX : this.maxX;
      var y = point.y > this.getCenterY() ? this.minY : this.maxY;
      x -= point.x;
      y -= point.y;
      return x * x + y * y;
    },

    /**
     * Debugging string for the bounds.
     * @public
     *
     * @returns {string}
     */
    toString: function() {
      return '[x:(' + this.minX + ',' + this.maxX + '),y:(' + this.minY + ',' + this.maxY + ')]';
    },

    /**
     * Exact equality comparison between this bounds and another bounds.
     * @public
     *
     * @param {Bounds2} other
     * @returns {boolean} - Whether the two bounds are equal
     */
    equals: function( other ) {
      return this.minX === other.minX && this.minY === other.minY && this.maxX === other.maxX && this.maxY === other.maxY;
    },

    /**
     * Approximate equality comparison between this bounds and another bounds.
     * @public
     *
     * @param {Bounds2} other
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
               Math.abs( this.maxX - other.maxX ) < epsilon &&
               Math.abs( this.maxY - other.maxY ) < epsilon;
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
               ( isFinite( this.maxX + other.maxX ) ? ( Math.abs( this.maxX - other.maxX ) < epsilon ) : ( this.maxX === other.maxX ) ) &&
               ( isFinite( this.maxY + other.maxY ) ? ( Math.abs( this.maxY - other.maxY ) < epsilon ) : ( this.maxY === other.maxY ) );
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
     * @param {Bounds2} [bounds] - If not provided, creates a new Bounds2 with filled in values. Otherwise, fills in the
     *                             values of the provided bounds so that it equals this bounds.
     * @returns {Bounds2}
     */
    copy: function( bounds ) {
      if ( bounds ) {
        return bounds.set( this );
      }
      else {
        return new Bounds2( this.minX, this.minY, this.maxX, this.maxY );
      }
    },

    /**
     * The smallest bounds that contains both this bounds and the input bounds, returned as a copy.
     * @public
     *
     * This is the immutable form of the function includeBounds(). This will return a new bounds, and will not modify
     * this bounds.
     *
     * @param {Bounds2} bounds
     * @returns {Bounds2}
     */
    union: function( bounds ) {
      return new Bounds2(
        Math.min( this.minX, bounds.minX ),
        Math.min( this.minY, bounds.minY ),
        Math.max( this.maxX, bounds.maxX ),
        Math.max( this.maxY, bounds.maxY )
      );
    },

    /**
     * The smallest bounds that is contained by both this bounds and the input bounds, returned as a copy.
     * @public
     *
     * This is the immutable form of the function constrainBounds(). This will return a new bounds, and will not modify
     * this bounds.
     *
     * @param {Bounds2} bounds
     * @returns {Bounds2}
     */
    intersection: function( bounds ) {
      return new Bounds2(
        Math.max( this.minX, bounds.minX ),
        Math.max( this.minY, bounds.minY ),
        Math.min( this.maxX, bounds.maxX ),
        Math.min( this.maxY, bounds.maxY )
      );
    },
    // TODO: difference should be well-defined, but more logic is needed to compute

    /**
     * The smallest bounds that contains this bounds and the point (x,y), returned as a copy.
     * @public
     *
     * This is the immutable form of the function addCoordinates(). This will return a new bounds, and will not modify
     * this bounds.
     *
     * @param {number} x
     * @param {number} y
     * @returns {Bounds2}
     */
    withCoordinates: function( x, y ) {
      return new Bounds2(
        Math.min( this.minX, x ),
        Math.min( this.minY, y ),
        Math.max( this.maxX, x ),
        Math.max( this.maxY, y )
      );
    },

    /**
     * The smallest bounds that contains this bounds and the input point, returned as a copy.
     * @public
     *
     * This is the immutable form of the function addPoint(). This will return a new bounds, and will not modify
     * this bounds.
     *
     * @param {Vector2} point
     * @returns {Bounds2}
     */
    withPoint: function( point ) {
      return this.withCoordinates( point.x, point.y );
    },

    /**
     * Returns the smallest bounds that contains both this bounds and the x value provided.
     * @public
     *
     * This is the immutable form of the function addX(). This will return a new bounds, and will not modify
     * this bounds.
     *
     * @param {number} x
     * @returns {Bounds2}
     */
    withX: function( x ) {
      return this.copy().addX( x );
    },

    /**
     * Returns the smallest bounds that contains both this bounds and the y value provided.
     * @public
     *
     * This is the immutable form of the function addY(). This will return a new bounds, and will not modify
     * this bounds.
     *
     * @param {number} y
     * @returns {Bounds2}
     */
    withY: function( y ) {
      return this.copy().addY( y );
    },

    /**
     * A copy of this bounds, with minX replaced with the input.
     * @public
     *
     * This is the immutable form of the function setMinX(). This will return a new bounds, and will not modify
     * this bounds.
     *
     * @param {number} minX
     * @returns {Bounds2}
     */
    withMinX: function( minX ) {
      return new Bounds2( minX, this.minY, this.maxX, this.maxY );
    },

    /**
     * A copy of this bounds, with minY replaced with the input.
     * @public
     *
     * This is the immutable form of the function setMinY(). This will return a new bounds, and will not modify
     * this bounds.
     *
     * @param {number} minY
     * @returns {Bounds2}
     */
    withMinY: function( minY ) {
      return new Bounds2( this.minX, minY, this.maxX, this.maxY );
    },

    /**
     * A copy of this bounds, with maxX replaced with the input.
     * @public
     *
     * This is the immutable form of the function setMaxX(). This will return a new bounds, and will not modify
     * this bounds.
     *
     * @param {number} maxX
     * @returns {Bounds2}
     */
    withMaxX: function( maxX ) {
      return new Bounds2( this.minX, this.minY, maxX, this.maxY );
    },

    /**
     * A copy of this bounds, with maxY replaced with the input.
     * @public
     *
     * This is the immutable form of the function setMaxY(). This will return a new bounds, and will not modify
     * this bounds.
     *
     * @param {number} maxY
     * @returns {Bounds2}
     */
    withMaxY: function( maxY ) {
      return new Bounds2( this.minX, this.minY, this.maxX, maxY );
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
     * @returns {Bounds2}
     */
    roundedOut: function() {
      return new Bounds2(
        Math.floor( this.minX ),
        Math.floor( this.minY ),
        Math.ceil( this.maxX ),
        Math.ceil( this.maxY )
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
     * @returns {Bounds2}
     */
    roundedIn: function() {
      return new Bounds2(
        Math.ceil( this.minX ),
        Math.ceil( this.minY ),
        Math.floor( this.maxX ),
        Math.floor( this.maxY )
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
     * @param {Matrix3} matrix
     * @returns {Bounds2}
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
     * @returns {Bounds2}
     */
    dilated: function( d ) {
      return new Bounds2( this.minX - d, this.minY - d, this.maxX + d, this.maxY + d );
    },

    /**
     * A bounding box that is expanded horizontally (on the left and right) by the specified amount.
     * @public
     *
     * This is the immutable form of the function dilateX(). This will return a new bounds, and will not modify
     * this bounds.
     *
     * @param {number} x
     * @returns {Bounds2}
     */
    dilatedX: function( x ) {
      return new Bounds2( this.minX - x, this.minY, this.maxX + x, this.maxY );
    },

    /**
     * A bounding box that is expanded vertically (on the top and bottom) by the specified amount.
     * @public
     *
     * This is the immutable form of the function dilateY(). This will return a new bounds, and will not modify
     * this bounds.
     *
     * @param {number} y
     * @returns {Bounds2}
     */
    dilatedY: function( y ) {
      return new Bounds2( this.minX, this.minY - y, this.maxX, this.maxY + y );
    },

    /**
     * A bounding box that is expanded on all sides, with different amounts of expansion horizontally and vertically.
     * Will be identical to the bounds returned by calling bounds.dilatedX( x ).dilatedY( y ).
     * @public
     *
     * This is the immutable form of the function dilateXY(). This will return a new bounds, and will not modify
     * this bounds.
     *
     * @param {number} x - Amount to dilate horizontally (for each side)
     * @param {number} y - Amount to dilate vertically (for each side)
     * @returns {Bounds2}
     */
    dilatedXY: function( x, y ) {
      return new Bounds2( this.minX - x, this.minY - y, this.maxX + x, this.maxY + y );
    },

    /**
     * A bounding box that is contracted on all sides by the specified amount.
     * @public
     *
     * This is the immutable form of the function erode(). This will return a new bounds, and will not modify
     * this bounds.
     *
     * @param {number} amount
     * @returns {Bounds2}
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
     * @returns {Bounds2}
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
     * @returns {Bounds2}
     */
    erodedY: function( y ) { return this.dilatedY( -y ); },

    /**
     * A bounding box that is contracted on all sides, with different amounts of contraction horizontally and vertically.
     * @public
     *
     * This is the immutable form of the function erodeXY(). This will return a new bounds, and will not modify
     * this bounds.
     *
     * @param {number} x - Amount to erode horizontally (for each side)
     * @param {number} y - Amount to erode vertically (for each side)
     * @returns {Bounds2}
     */
    erodedXY: function( x, y ) { return this.dilatedXY( -x, -y ); },

    /**
     * A bounding box that is expanded by a specific amount on all sides (or if some offsets are negative, will contract
     * those sides).
     * @public
     *
     * This is the immutable form of the function offset(). This will return a new bounds, and will not modify
     * this bounds.
     *
     * @param {number} left - Amount to expand to the left (subtracts from minX)
     * @param {number} top - Amount to expand to the top (subtracts from minY)
     * @param {number} right - Amount to expand to the right (adds to maxX)
     * @param {number} bottom - Amount to expand to the bottom (adds to maxY)
     * @returns {Bounds2}
     */
    withOffsets: function( left, top, right, bottom ) {
      return new Bounds2( this.minX - left, this.minY - top, this.maxX + right, this.maxY + bottom );
    },

    /**
     * Our bounds, translated horizontally by x, returned as a copy.
     * @public
     *
     * This is the immutable form of the function shiftX(). This will return a new bounds, and will not modify
     * this bounds.
     *
     * @param {number} x
     * @returns {Bounds2}
     */
    shiftedX: function( x ) {
      return new Bounds2( this.minX + x, this.minY, this.maxX + x, this.maxY );
    },

    /**
     * Our bounds, translated vertically by y, returned as a copy.
     * @public
     *
     * This is the immutable form of the function shiftY(). This will return a new bounds, and will not modify
     * this bounds.
     *
     * @param {number} y
     * @returns {Bounds2}
     */
    shiftedY: function( y ) {
      return new Bounds2( this.minX, this.minY + y, this.maxX, this.maxY + y );
    },

    /**
     * Our bounds, translated by (x,y), returned as a copy.
     * @public
     *
     * This is the immutable form of the function shift(). This will return a new bounds, and will not modify
     * this bounds.
     *
     * @param {number} x
     * @param {number} y
     * @returns {Bounds2}
     */
    shifted: function( x, y ) {
      return new Bounds2( this.minX + x, this.minY + y, this.maxX + x, this.maxY + y );
    },

    /**
     * Returns an interpolated value of this bounds and the argument.
     * @public
     *
     * @param {Bounds2} bounds
     * @param {number} ratio - 0 will result in a copy of `this`, 1 will result in bounds, and in-between controls the
     *                         amount of each.
     */
    blend: function( bounds, ratio ) {
      var t = 1 - ratio;
      return new Bounds2(
        t * this.minX + ratio * bounds.minX,
        t * this.minY + ratio * bounds.minY,
        t * this.maxX + ratio * bounds.maxX,
        t * this.maxY + ratio * bounds.maxY
      );
    },

    /*---------------------------------------------------------------------------*
     * Mutable operations
     *
     * All mutable operations should call one of the following:
     *   setMinMax, setMinX, setMinY, setMaxX, setMaxY
     *---------------------------------------------------------------------------*/

    /**
     * Sets each value for this bounds, and returns itself.
     * @public
     *
     * @param {number} minX
     * @param {number} minY
     * @param {number} maxX
     * @param {number} maxY
     * @returns {Bounds2}
     */
    setMinMax: function( minX, minY, maxX, maxY ) {
      this.minX = minX;
      this.minY = minY;
      this.maxX = maxX;
      this.maxY = maxY;
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
     * @returns {Bounds2}
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
     * @returns {Bounds2}
     */
    setMinY: function( minY ) {
      this.minY = minY;
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
     * @returns {Bounds2}
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
     * @returns {Bounds2}
     */
    setMaxY: function( maxY ) {
      this.maxY = maxY;
      return this;
    },

    /**
     * Sets the values of this bounds to be equal to the input bounds.
     * @public
     *
     * This is the mutable form of the function copy(). This will mutate (change) this bounds, in addition to returning
     * this bounds itself.
     *
     * @param {Bounds2} bounds
     * @returns {Bounds2}
     */
    set: function( bounds ) {
      return this.setMinMax( bounds.minX, bounds.minY, bounds.maxX, bounds.maxY );
    },

    /**
     * Modifies this bounds so that it contains both its original bounds and the input bounds.
     * @public
     *
     * This is the mutable form of the function union(). This will mutate (change) this bounds, in addition to returning
     * this bounds itself.
     *
     * @param {Bounds2} bounds
     * @returns {Bounds2}
     */
    includeBounds: function( bounds ) {
      return this.setMinMax(
        Math.min( this.minX, bounds.minX ),
        Math.min( this.minY, bounds.minY ),
        Math.max( this.maxX, bounds.maxX ),
        Math.max( this.maxY, bounds.maxY )
      );
    },

    /**
     * Modifies this bounds so that it is the largest bounds contained both in its original bounds and in the input bounds.
     * @public
     *
     * This is the mutable form of the function intersection(). This will mutate (change) this bounds, in addition to returning
     * this bounds itself.
     *
     * @param {Bounds2} bounds
     * @returns {Bounds2}
     */
    constrainBounds: function( bounds ) {
      return this.setMinMax(
        Math.max( this.minX, bounds.minX ),
        Math.max( this.minY, bounds.minY ),
        Math.min( this.maxX, bounds.maxX ),
        Math.min( this.maxY, bounds.maxY )
      );
    },

    /**
     * Modifies this bounds so that it contains both its original bounds and the input point (x,y).
     * @public
     *
     * This is the mutable form of the function withCoordinates(). This will mutate (change) this bounds, in addition to returning
     * this bounds itself.
     *
     * @param {number} x
     * @param {number} y
     * @returns {Bounds2}
     */
    addCoordinates: function( x, y ) {
      return this.setMinMax(
        Math.min( this.minX, x ),
        Math.min( this.minY, y ),
        Math.max( this.maxX, x ),
        Math.max( this.maxY, y )
      );
    },

    /**
     * Modifies this bounds so that it contains both its original bounds and the input point.
     * @public
     *
     * This is the mutable form of the function withPoint(). This will mutate (change) this bounds, in addition to returning
     * this bounds itself.
     *
     * @param {Vector2} point
     * @returns {Bounds2}
     */
    addPoint: function( point ) {
      return this.addCoordinates( point.x, point.y );
    },

    /**
     * Modifies this bounds so that it is guaranteed to include the given x value (if it didn't already). If the x value
     * was already contained, nothing will be done.
     * @public
     *
     * This is the mutable form of the function withX(). This will mutate (change) this bounds, in addition to returning
     * this bounds itself.
     *
     * @param {number} x
     * @returns {Bounds2}
     */
    addX: function( x ) {
      this.minX = Math.min( x, this.minX );
      this.maxX = Math.max( x, this.maxX );
      return this;
    },

    /**
     * Modifies this bounds so that it is guaranteed to include the given y value (if it didn't already). If the y value
     * was already contained, nothing will be done.
     * @public
     *
     * This is the mutable form of the function withY(). This will mutate (change) this bounds, in addition to returning
     * this bounds itself.
     *
     * @param {number} y
     * @returns {Bounds2}
     */
    addY: function( y ) {
      this.minY = Math.min( y, this.minY );
      this.maxY = Math.max( y, this.maxY );
      return this;
    },

    /**
     * Modifies this bounds so that its boundaries are integer-aligned, rounding the minimum boundaries down and the
     * maximum boundaries up (expanding as necessary).
     * @public
     *
     * This is the mutable form of the function roundedOut(). This will mutate (change) this bounds, in addition to returning
     * this bounds itself.
     *
     * @returns {Bounds2}
     */
    roundOut: function() {
      return this.setMinMax(
        Math.floor( this.minX ),
        Math.floor( this.minY ),
        Math.ceil( this.maxX ),
        Math.ceil( this.maxY )
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
     * @returns {Bounds2}
     */
    roundIn: function() {
      return this.setMinMax(
        Math.ceil( this.minX ),
        Math.ceil( this.minY ),
        Math.floor( this.maxX ),
        Math.floor( this.maxY )
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
     * @param {Matrix3} matrix
     * @returns {Bounds2}
     */
    transform: function( matrix ) {
      // if we contain no area, no change is needed
      if ( this.isEmpty() ) {
        return this;
      }

      // optimization to bail for identity matrices
      if ( matrix.isIdentity() ) {
        return this;
      }

      var minX = this.minX;
      var minY = this.minY;
      var maxX = this.maxX;
      var maxY = this.maxY;
      this.set( dot.Bounds2.NOTHING );

      // using mutable vector so we don't create excessive instances of Vector2 during this
      // make sure all 4 corners are inside this transformed bounding box

      this.addPoint( matrix.multiplyVector2( scratchVector2.setXY( minX, minY ) ) );
      this.addPoint( matrix.multiplyVector2( scratchVector2.setXY( minX, maxY ) ) );
      this.addPoint( matrix.multiplyVector2( scratchVector2.setXY( maxX, minY ) ) );
      this.addPoint( matrix.multiplyVector2( scratchVector2.setXY( maxX, maxY ) ) );
      return this;
    },

    /**
     * Expands this bounds on all sides by the specified amount.
     * @public
     *
     * This is the mutable form of the function dilated(). This will mutate (change) this bounds, in addition to returning
     * this bounds itself.
     *
     * @param {number} d
     * @returns {Bounds2}
     */
    dilate: function( d ) {
      return this.setMinMax( this.minX - d, this.minY - d, this.maxX + d, this.maxY + d );
    },

    /**
     * Expands this bounds horizontally (left and right) by the specified amount.
     * @public
     *
     * This is the mutable form of the function dilatedX(). This will mutate (change) this bounds, in addition to returning
     * this bounds itself.
     *
     * @param {number} x
     * @returns {Bounds2}
     */
    dilateX: function( x ) {
      return this.setMinMax( this.minX - x, this.minY, this.maxX + x, this.maxY );
    },

    /**
     * Expands this bounds vertically (top and bottom) by the specified amount.
     * @public
     *
     * This is the mutable form of the function dilatedY(). This will mutate (change) this bounds, in addition to returning
     * this bounds itself.
     *
     * @param {number} y
     * @returns {Bounds2}
     */
    dilateY: function( y ) {
      return this.setMinMax( this.minX, this.minY - y, this.maxX, this.maxY + y );
    },

    /**
     * Expands this bounds independently in the horizontal and vertical directions. Will be equal to calling
     * bounds.dilateX( x ).dilateY( y ).
     * @public
     *
     * This is the mutable form of the function dilatedXY(). This will mutate (change) this bounds, in addition to returning
     * this bounds itself.
     *
     * @param {number} x
     * @param {number} y
     * @returns {Bounds2}
     */
    dilateXY: function( x, y ) {
      return this.setMinMax( this.minX - x, this.minY - y, this.maxX + x, this.maxY + y );
    },

    /**
     * Contracts this bounds on all sides by the specified amount.
     * @public
     *
     * This is the mutable form of the function eroded(). This will mutate (change) this bounds, in addition to returning
     * this bounds itself.
     *
     * @param {number} d
     * @returns {Bounds2}
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
     * @returns {Bounds2}
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
     * @returns {Bounds2}
     */
    erodeY: function( y ) { return this.dilateY( -y ); },

    /**
     * Contracts this bounds independently in the horizontal and vertical directions. Will be equal to calling
     * bounds.erodeX( x ).erodeY( y ).
     * @public
     *
     * This is the mutable form of the function erodedXY(). This will mutate (change) this bounds, in addition to returning
     * this bounds itself.
     *
     * @param {number} x
     * @param {number} y
     * @returns {Bounds2}
     */
    erodeXY: function( x, y ) { return this.dilateXY( -x, -y ); },

    /**
     * Expands this bounds independently for each side (or if some offsets are negative, will contract those sides).
     * @public
     *
     * This is the mutable form of the function withOffsets(). This will mutate (change) this bounds, in addition to
     * returning this bounds itself.
     *
     * @param {number} left - Amount to expand to the left (subtracts from minX)
     * @param {number} top - Amount to expand to the top (subtracts from minY)
     * @param {number} right - Amount to expand to the right (adds to maxX)
     * @param {number} bottom - Amount to expand to the bottom (adds to maxY)
     * @returns {Bounds2}
     */
    offset: function( left, top, right, bottom ) {
      return new Bounds2( this.minX - left, this.minY - top, this.maxX + right, this.maxY + bottom );
    },

    /**
     * Translates our bounds horizontally by x.
     * @public
     *
     * This is the mutable form of the function shiftedX(). This will mutate (change) this bounds, in addition to returning
     * this bounds itself.
     *
     * @param {number} x
     * @returns {Bounds2}
     */
    shiftX: function( x ) {
      return this.setMinMax( this.minX + x, this.minY, this.maxX + x, this.maxY );
    },

    /**
     * Translates our bounds vertically by y.
     * @public
     *
     * This is the mutable form of the function shiftedY(). This will mutate (change) this bounds, in addition to returning
     * this bounds itself.
     *
     * @param {number} y
     * @returns {Bounds2}
     */
    shiftY: function( y ) {
      return this.setMinMax( this.minX, this.minY + y, this.maxX, this.maxY + y );
    },

    /**
     * Translates our bounds by (x,y).
     * @public
     *
     * This is the mutable form of the function shifted(). This will mutate (change) this bounds, in addition to returning
     * this bounds itself.
     *
     * @param {number} x
     * @param {number} y
     * @returns {Bounds2}
     */
    shift: function( x, y ) {
      return this.setMinMax( this.minX + x, this.minY + y, this.maxX + x, this.maxY + y );
    },

    /**
     * Find a point in the bounds closest to the specified point.
     * @public
     *
     * @param {number} x - X coordinate of the point to test.
     * @param {number} y - Y coordinate of the point to test.
     * @param {Vector2} [result] - Vector2 that can store the return value to avoid allocations.
     * @returns {Vector2}
     */
    getClosestPoint: function( x, y, result ) {
      if ( result ) {
        result.setXY( x, y );
      }
      else {
        result = new dot.Vector2( x, y );
      }
      if ( result.x < this.minX ) { result.x = this.minX; }
      if ( result.x > this.maxX ) { result.x = this.maxX; }
      if ( result.y < this.minY ) { result.y = this.minY; }
      if ( result.y > this.maxY ) { result.y = this.maxY; }
      return result;
    }
  }, {
    /**
     * Returns a new Bounds2 object, with the familiar rectangle construction with x, y, width, and height.
     * @public
     *
     * @param {number} x - The minimum value of X for the bounds.
     * @param {number} y - The minimum value of Y for the bounds.
     * @param {number} width - The width (maxX - minX) of the bounds.
     * @param {number} height - The height (maxY - minY) of the bounds.
     * @returns {Bounds2}
     */
    rect: function( x, y, width, height ) {
      return new Bounds2( x, y, x + width, y + height );
    },

    /**
     * Returns a new Bounds2 object that only contains the specified point (x,y). Useful for being dilated to form a
     * bounding box around a point. Note that the bounds will not be "empty" as it contains (x,y), but it will have
     * zero area. The x and y coordinates can be specified by numbers or with at Vector2
     * @public
     *
     * @param {number|Vector2} x
     * @param [number] y
     * @returns {Bounds2}
     */
    point: function( x, y ) {
      if ( x instanceof dot.Vector2 ) {
        var p = x;
        return new Bounds2( p.x, p.y, p.x, p.y );
      }
      else {
        return new Bounds2( x, y, x, y );
      }
    }
  } );

  /**
   * A contant Bounds2 with minimums = $\infty$, maximums = $-\infty$, so that it represents "no bounds whatsoever".
   * @public
   *
   * This allows us to take the union (union/includeBounds) of this and any other Bounds2 to get the other bounds back,
   * e.g. Bounds2.NOTHING.union( bounds ).equals( bounds ). This object naturally serves as the base case as a union of
   * zero bounds objects.
   *
   * Additionally, intersections with NOTHING will always return a Bounds2 equivalent to NOTHING.
   *
   * @constant {Bounds2} NOTHING
   */
  Bounds2.NOTHING = new Bounds2( Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY );

  /**
   * A contant Bounds2 with minimums = $-\infty$, maximums = $\infty$, so that it represents "all bounds".
   * @public
   *
   * This allows us to take the intersection (intersection/constrainBounds) of this and any other Bounds2 to get the
   * other bounds back, e.g. Bounds2.EVERYTHING.intersection( bounds ).equals( bounds ). This object naturally serves as
   * the base case as an intersection of zero bounds objects.
   *
   * Additionally, unions with EVERYTHING will always return a Bounds2 equivalent to EVERYTHING.
   *
   * @constant {Bounds2} EVERYTHING
   */
  Bounds2.EVERYTHING = new Bounds2( Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY );

  Poolable.mixInto( Bounds2, {
    initialize: Bounds2.prototype.setMinMax,

    // set default arguments to match Bounds2.NOTHING
    defaultArguments: [ Bounds2.NOTHING.minX, Bounds2.NOTHING.minY, Bounds2.NOTHING.maxX, Bounds2.NOTHING.maxY ]
  } );

  function catchImmutableSetterLowHangingFruit( bounds ) {
    bounds.setMinMax = function() { throw new Error( 'Attempt to set \"setMinMax\" of an immutable Bounds2 object' ); };
    bounds.set = function() { throw new Error( 'Attempt to set \"set\" of an immutable Bounds2 object' ); };
    bounds.includeBounds = function() { throw new Error( 'Attempt to set \"includeBounds\" of an immutable Bounds2 object' ); };
    bounds.constrainBounds = function() { throw new Error( 'Attempt to set \"constrainBounds\" of an immutable Bounds2 object' ); };
    bounds.addCoordinates = function() { throw new Error( 'Attempt to set \"addCoordinates\" of an immutable Bounds2 object' ); };
    bounds.transform = function() { throw new Error( 'Attempt to set \"transform\" of an immutable Bounds2 object' ); };
  }

  if ( assert ) {
    catchImmutableSetterLowHangingFruit( Bounds2.EVERYTHING );
    catchImmutableSetterLowHangingFruit( Bounds2.NOTHING );
  }

  return Bounds2;
} );
