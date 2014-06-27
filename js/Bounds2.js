// Copyright 2002-2014, University of Colorado Boulder

/**
 * A 2D rectangle-shaped bounded area (bounding box)
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
  var Poolable = require( 'PHET_CORE/Poolable' );

  require( 'DOT/Vector2' );

  //Temporary instances to be used in the transform method.
  var scratchVector2 = new dot.Vector2();

  // not using x,y,width,height so that it can handle infinity-based cases in a better way
  dot.Bounds2 = function Bounds2( minX, minY, maxX, maxY ) {
    assert && assert( maxY !== undefined, 'Bounds2 requires 4 parameters' );
    this.minX = minX;
    this.minY = minY;
    this.maxX = maxX;
    this.maxY = maxY;

    phetAllocation && phetAllocation( 'Bounds2' );
  };
  var Bounds2 = dot.Bounds2;

  Bounds2.prototype = {
    constructor: Bounds2,

    isBounds: true,
    dimension: 2,

    /*---------------------------------------------------------------------------*
    * Properties
    *----------------------------------------------------------------------------*/

    getWidth: function() { return this.maxX - this.minX; },
    get width() { return this.getWidth(); },

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
    getX: function() { return this.minX; },
    get x() { return this.getX(); },
    getY: function() { return this.minY; },
    get y() { return this.getY(); },

    getMinX: function() { return this.minX; },
    get left() { return this.minX; },
    getMinY: function() { return this.minY; },
    get top() { return this.minY; },
    getMaxX: function() { return this.maxX; },
    get right() { return this.maxX; },
    getMaxY: function() { return this.maxY; },
    get bottom() { return this.maxY; },

    getCenterX: function() { return ( this.maxX + this.minX ) / 2; },
    get centerX() { return this.getCenterX(); },
    getCenterY: function() { return ( this.maxY + this.minY ) / 2; },
    get centerY() { return this.getCenterY(); },

    getLeftTop: function() { return new dot.Vector2( this.minX, this.minY ); },
    get leftTop() { return this.getLeftTop(); },
    getCenterTop: function() { return new dot.Vector2( this.getCenterX(), this.minY ); },
    get centerTop() { return this.getCenterTop(); },
    getRightTop: function() { return new dot.Vector2( this.maxX, this.minY ); },
    get rightTop() { return this.getRightTop(); },
    getLeftCenter: function() { return new dot.Vector2( this.minX, this.getCenterY() ); },
    get leftCenter() { return this.getLeftCenter(); },
    getCenter: function() { return new dot.Vector2( this.getCenterX(), this.getCenterY() ); },
    get center() { return this.getCenter(); },
    getRightCenter: function() { return new dot.Vector2( this.maxX, this.getCenterY() ); },
    get rightCenter() { return this.getRightCenter(); },
    getLeftBottom: function() { return new dot.Vector2( this.minX, this.maxY ); },
    get leftBottom() { return this.getLeftBottom(); },
    getCenterBottom: function() { return new dot.Vector2( this.getCenterX(), this.maxY ); },
    get centerBottom() { return this.getCenterBottom(); },
    getRightBottom: function() { return new dot.Vector2( this.maxX, this.maxY ); },
    get rightBottom() { return this.getRightBottom(); },

    isEmpty: function() { return this.getWidth() < 0 || this.getHeight() < 0; },

    isFinite: function() {
      return isFinite( this.minX ) && isFinite( this.minY ) && isFinite( this.maxX ) && isFinite( this.maxY );
    },

    hasNonzeroArea: function() {
      return this.getWidth() > 0 && this.getHeight() > 0;
    },

    isValid: function() {
      return !this.isEmpty() && this.isFinite();
    },

    // whether the coordinates are inside the bounding box (or on the boundary)
    containsCoordinates: function( x, y ) {
      return this.minX <= x && x <= this.maxX && this.minY <= y && y <= this.maxY;
    },

    // whether the point is inside the bounding box (or on the boundary)
    containsPoint: function( point ) {
      return this.containsCoordinates( point.x, point.y );
    },

    // whether this bounding box completely contains the argument bounding box
    containsBounds: function( bounds ) {
      return this.minX <= bounds.minX && this.maxX >= bounds.maxX && this.minY <= bounds.minY && this.maxY >= bounds.maxY;
    },

    // whether the intersection is non-empty (if they share any part of a boundary, this will be true)
    intersectsBounds: function( bounds ) {
      // TODO: more efficient way of doing this?
      return !this.intersection( bounds ).isEmpty();
    },

    // distance to the closest point inside the Bounds2
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

    // distance to the farthest point inside the Bounds2
    maximumDistanceToPointSquared: function( point ) {
      var x = point.x > this.getCenterX() ? this.minX : this.maxX;
      var y = point.y > this.getCenterY() ? this.minY : this.maxY;
      x -= point.x;
      y -= point.y;
      return x * x + y * y;
    },

    toString: function() {
      return '[x:(' + this.minX + ',' + this.maxX + '),y:(' + this.minY + ',' + this.maxY + ')]';
    },

    equals: function( other ) {
      return this.minX === other.minX && this.minY === other.minY && this.maxX === other.maxX && this.maxY === other.maxY;
    },

    equalsEpsilon: function( other, epsilon ) {
      epsilon = epsilon || 0;
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
    *----------------------------------------------------------------------------*/

    // create a copy, or if bounds is passed in, set that bounds to our value
    copy: function( bounds ) {
      if ( bounds ) {
        return bounds.set( this );
      }
      else {
        return new Bounds2( this.minX, this.minY, this.maxX, this.maxY );
      }
    },

    // immutable operations (bounding-box style handling, so that the relevant bounds contain everything)
    union: function( bounds ) {
      return new Bounds2(
        Math.min( this.minX, bounds.minX ),
        Math.min( this.minY, bounds.minY ),
        Math.max( this.maxX, bounds.maxX ),
        Math.max( this.maxY, bounds.maxY )
      );
    },
    intersection: function( bounds ) {
      return new Bounds2(
        Math.max( this.minX, bounds.minX ),
        Math.max( this.minY, bounds.minY ),
        Math.min( this.maxX, bounds.maxX ),
        Math.min( this.maxY, bounds.maxY )
      );
    },
    // TODO: difference should be well-defined, but more logic is needed to compute

    withCoordinates: function( x, y ) {
      return new Bounds2(
        Math.min( this.minX, x ),
        Math.min( this.minY, y ),
        Math.max( this.maxX, x ),
        Math.max( this.maxY, y )
      );
    },

    // like a union with a point-sized bounding box
    withPoint: function( point ) {
      return this.withCoordinates( point.x, point.y );
    },

    withMinX: function( minX ) { return new Bounds2( minX, this.minY, this.maxX, this.maxY ); },
    withMinY: function( minY ) { return new Bounds2( this.minX, minY, this.maxX, this.maxY ); },
    withMaxX: function( maxX ) { return new Bounds2( this.minX, this.minY, maxX, this.maxY ); },
    withMaxY: function( maxY ) { return new Bounds2( this.minX, this.minY, this.maxX, maxY ); },

    // copy rounded to integral values, expanding where necessary
    roundedOut: function() {
      return new Bounds2(
        Math.floor( this.minX ),
        Math.floor( this.minY ),
        Math.ceil( this.maxX ),
        Math.ceil( this.maxY )
      );
    },

    // copy rounded to integral values, contracting where necessary
    roundedIn: function() {
      return new Bounds2(
        Math.ceil( this.minX ),
        Math.ceil( this.minY ),
        Math.floor( this.maxX ),
        Math.floor( this.maxY )
      );
    },

    // transform a bounding box.
    // NOTE that box.transformed( matrix ).transformed( inverse ) may be larger than the original box
    transformed: function( matrix ) {
      return this.copy().transform( matrix );
    },

    // returns copy expanded on all sides by length d
    dilated: function( d ) {
      return new Bounds2( this.minX - d, this.minY - d, this.maxX + d, this.maxY + d );
    },

    // dilates only in the x direction
    dilatedX: function( x ) {
      return new Bounds2( this.minX - x, this.minY, this.maxX + x, this.maxY );
    },

    // dilates only in the y direction
    dilatedY: function( y ) {
      return new Bounds2( this.minX, this.minY - y, this.maxX, this.maxY + y );
    },

    // dilate with different amounts in the x and y directions
    dilatedXY: function( x, y ) {
      return new Bounds2( this.minX - x, this.minY - y, this.maxX + x, this.maxY + y );
    },

    // returns copy contracted on all sides by length d, or for x/y independently
    eroded: function( d ) { return this.dilated( -d ); },
    erodedX: function( x ) { return this.dilatedX( -x ); },
    erodedY: function( y ) { return this.dilatedY( -y ); },
    erodedXY: function( x, y ) { return this.dilatedXY( -x, -y ); },

    shiftedX: function( x ) {
      return new Bounds2( this.minX + x, this.minY, this.maxX + x, this.maxY );
    },

    shiftedY: function( y ) {
      return new Bounds2( this.minX, this.minY + y, this.maxX, this.maxY + y );
    },

    shifted: function( x, y ) {
      return new Bounds2( this.minX + x, this.minY + y, this.maxX + x, this.maxY + y );
    },

    /*---------------------------------------------------------------------------*
    * Mutable operations
    *----------------------------------------------------------------------------*/

    // mutable core opreations (all other mutations should be called through these)
    setMinMax: function( minX, minY, maxX, maxY ) {
      this.minX = minX;
      this.minY = minY;
      this.maxX = maxX;
      this.maxY = maxY;
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
    setMaxX: function( maxX ) {
      this.maxX = maxX;
      return this;
    },
    setMaxY: function( maxY ) {
      this.maxY = maxY;
      return this;
    },

    set: function( bounds ) {
      return this.setMinMax( bounds.minX, bounds.minY, bounds.maxX, bounds.maxY );
    },

    // mutable union
    includeBounds: function( bounds ) {
      return this.setMinMax(
        Math.min( this.minX, bounds.minX ),
        Math.min( this.minY, bounds.minY ),
        Math.max( this.maxX, bounds.maxX ),
        Math.max( this.maxY, bounds.maxY )
      );
    },

    // mutable intersection
    constrainBounds: function( bounds ) {
      return this.setMinMax(
        Math.max( this.minX, bounds.minX ),
        Math.max( this.minY, bounds.minY ),
        Math.min( this.maxX, bounds.maxX ),
        Math.min( this.maxY, bounds.maxY )
      );
    },

    addCoordinates: function( x, y ) {
      return this.setMinMax(
        Math.min( this.minX, x ),
        Math.min( this.minY, y ),
        Math.max( this.maxX, x ),
        Math.max( this.maxY, y )
      );
    },

    addPoint: function( point ) {
      return this.addCoordinates( point.x, point.y );
    },

    // round to integral values, expanding where necessary
    roundOut: function() {
      return this.setMinMax(
        Math.floor( this.minX ),
        Math.floor( this.minY ),
        Math.ceil( this.maxX ),
        Math.ceil( this.maxY )
      );
    },

    // round to integral values, contracting where necessary
    roundIn: function() {
      return this.setMinMax(
        Math.ceil( this.minX ),
        Math.ceil( this.minY ),
        Math.floor( this.maxX ),
        Math.floor( this.maxY )
      );
    },

    // transform a bounding box.
    // NOTE that box.transformed( matrix ).transformed( inverse ) may be larger than the original box
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

    // expands on all sides by length d
    dilate: function( d ) {
      return this.setMinMax( this.minX - d, this.minY - d, this.maxX + d, this.maxY + d );
    },

    // dilates only in the x direction
    dilateX: function( x ) {
      return this.setMinMax( this.minX - x, this.minY, this.maxX + x, this.maxY );
    },

    // dilates only in the y direction
    dilateY: function( y ) {
      return this.setMinMax( this.minX, this.minY - y, this.maxX, this.maxY + y );
    },

    // dilate with different amounts in the x and y directions
    dilateXY: function( x, y ) {
      return this.setMinMax( this.minX - x, this.minY - y, this.maxX + x, this.maxY + y );
    },

    // contracts on all sides by length d, or for x/y independently
    erode: function( d ) { return this.dilate( -d ); },
    erodeX: function( x ) { return this.dilateX( -x ); },
    erodeY: function( y ) { return this.dilateY( -y ); },
    erodeXY: function( x, y ) { return this.dilateXY( -x, -y ); },

    shiftX: function( x ) {
      return this.setMinMax( this.minX + x, this.minY, this.maxX + x, this.maxY );
    },

    shiftY: function( y ) {
      return this.setMinMax( this.minX, this.minY + y, this.maxX, this.maxY + y );
    },

    shift: function( x, y ) {
      return this.setMinMax( this.minX + x, this.minY + y, this.maxX + x, this.maxY + y );
    },

    /**
     * Find a point in the Bounds2 closest to the specified point.  Used for making sure a dragged object doesn't get outside the visible play area.
     * @param x x point to test
     * @param y y point to test
     * @param {Vector2} result optional Vector2 that can store the return value to avoid allocations
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
  };

  Bounds2.rect = function( x, y, width, height ) {
    return new Bounds2( x, y, x + width, y + height );
  };

  // a volume-less point bounds, which can be dilated to form a centered bounds
  Bounds2.point = function( x, y ) {
    if ( x instanceof dot.Vector2 ) {
      var p = x;
      return new Bounds2( p.x, p.y, p.x, p.y );
    }
    else {
      return new Bounds2( x, y, x, y );
    }
  };

  // experimental object pooling
  /* jshint -W064 */
  Poolable( Bounds2, {
    defaultFactory: function() { return Bounds2.NOTHING.copy(); },
    constructorDuplicateFactory: function( pool ) {
      return function( minX, minY, maxX, maxY ) {
        if ( pool.length ) {
          return pool.pop().setMinMax( minX, minY, maxX, maxY );
        }
        else {
          return new Bounds2( minX, minY, maxX, maxY );
        }
      };
    }
  } );

  // specific bounds useful for operations
  Bounds2.EVERYTHING = new Bounds2( Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY );
  Bounds2.NOTHING = new Bounds2( Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY );

  return Bounds2;
} );
