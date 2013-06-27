// Copyright 2002-2013, University of Colorado Boulder

/**
 * A 2D rectangle-shaped bounded area (bounding box)
 *
 * @author Jonathan Olson <olsonsjc@gmail.com>
 */

define( function( require ) {
  'use strict';
  
  var assert = require( 'ASSERT/assert' )( 'dot' );
  
  var dot = require( 'DOT/dot' );
  
  require( 'DOT/Vector2' );
  
  // not using x,y,width,height so that it can handle infinity-based cases in a better way
  dot.Bounds2 = function Bounds2( minX, minY, maxX, maxY ) {
    assert && assert( maxY !== undefined, 'Bounds2 requires 4 parameters' );
    this.minX = minX;
    this.minY = minY;
    this.maxX = maxX;
    this.maxY = maxY;
  };
  var Bounds2 = dot.Bounds2;

  Bounds2.prototype = {
    constructor: Bounds2,
    
    /*---------------------------------------------------------------------------*
    * Properties
    *----------------------------------------------------------------------------*/
    
    getWidth: function() { return this.maxX - this.minX; },
    get width() { return this.getWidth(); },
    
    getHeight: function() { return this.maxY - this.minY; },
    get height() { return this.getHeight(); },
    
    getX: function() { return this.minX; },
    get x() { return this.getX(); },
    
    getY: function() { return this.minY; },
    get y() { return this.getY(); },
    
    getCenter: function() { return new dot.Vector2( this.getCenterX(), this.getCenterY() ); },
    get center() { return this.getCenter(); },
    
    getCenterX: function() { return ( this.maxX + this.minX ) / 2; },
    get centerX() { return this.getCenterX(); },
    
    getCenterY: function() { return ( this.maxY + this.minY ) / 2; },
    get centerY() { return this.getCenterY(); },
    
    getMinX: function() { return this.minX; },
    getMinY: function() { return this.minY; },
    getMaxX: function() { return this.maxX; },
    getMaxY: function() { return this.maxY; },
    
    isEmpty: function() { return this.getWidth() < 0 || this.getHeight() < 0; },
    
    isFinite: function() {
      return isFinite( this.minX ) && isFinite( this.minY ) && isFinite( this.maxX ) && isFinite( this.maxY );
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
      } else if ( thisFinite !== otherFinite ) {
        return false; // one is finite, the other is not. definitely not equal
      } else if ( this === other ) {
        return true; // exact same instance, must be equal
      } else {
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
    
    copy: function() {
      return new Bounds2( this.minX, this.minY, this.maxX, this.maxY );
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
    
    // returns copy contracted on all sides by length d
    eroded: function( d ) {
      return this.dilated( -d );
    },
    
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
    
    set: function( minX, minY, maxX, maxY ) {
      this.minX = minX;
      this.minY = minY;
      this.maxX = maxX;
      this.maxY = maxY;
      return this;
    },
    
    setBounds: function( bounds ) {
      return this.set( bounds.minX, bounds.minY, bounds.maxX, bounds.maxY );
    },
    
    // mutable union
    includeBounds: function( bounds ) {
      this.minX = Math.min( this.minX, bounds.minX );
      this.minY = Math.min( this.minY, bounds.minY );
      this.maxX = Math.max( this.maxX, bounds.maxX );
      this.maxY = Math.max( this.maxY, bounds.maxY );
      return this;
    },
    
    // mutable intersection
    constrainBounds: function( bounds ) {
      this.minX = Math.max( this.minX, bounds.minX );
      this.minY = Math.max( this.minY, bounds.minY );
      this.maxX = Math.min( this.maxX, bounds.maxX );
      this.maxY = Math.min( this.maxY, bounds.maxY );
      return this;
    },
    
    addCoordinates: function( x, y ) {
      this.minX = Math.min( this.minX, x );
      this.minY = Math.min( this.minY, y );
      this.maxX = Math.max( this.maxX, x );
      this.maxY = Math.max( this.maxY, y );
      return this;
    },
    
    addPoint: function( point ) {
      return this.addCoordinates( point.x, point.y );
    },
    
    setMinX: function( minX ) { this.minX = minX; return this; },
    setMinY: function( minY ) { this.minY = minY; return this; },
    setMaxX: function( maxX ) { this.maxX = maxX; return this; },
    setMaxY: function( maxY ) { this.maxY = maxY; return this; },
    
    // round to integral values, expanding where necessary
    roundOut: function() {
      this.minX = Math.floor( this.minX );
      this.minY = Math.floor( this.minY );
      this.maxX = Math.ceil( this.maxX );
      this.maxY = Math.ceil( this.maxY );
      return this;
    },
    
    // round to integral values, contracting where necessary
    roundIn: function() {
      this.minX = Math.ceil( this.minX );
      this.minY = Math.ceil( this.minY );
      this.maxX = Math.floor( this.maxX );
      this.maxY = Math.floor( this.maxY );
      return this;
    },
    
    // transform a bounding box.
    // NOTE that box.transformed( matrix ).transformed( inverse ) may be larger than the original box
    transform: function( matrix ) {
      // do nothing
      if ( this.isEmpty() ) {
        return this;
      }
      var minX = this.minX;
      var minY = this.minY;
      var maxX = this.maxX;
      var maxY = this.maxY;
      
      // using mutable vector so we don't create excessive instances of Vector2 during this
      // make sure all 4 corners are inside this transformed bounding box
      var vector = new dot.Vector2();
      this.setBounds( Bounds2.NOTHING );
      this.addPoint( matrix.multiplyVector2( vector.set( minX, minY ) ) );
      this.addPoint( matrix.multiplyVector2( vector.set( minX, maxY ) ) );
      this.addPoint( matrix.multiplyVector2( vector.set( maxX, minY ) ) );
      this.addPoint( matrix.multiplyVector2( vector.set( maxX, maxY ) ) );
      return this;
    },
    
    // expands on all sides by length d
    dilate: function( d ) {
      return this.set( this.minX - d, this.minY - d, this.maxX + d, this.maxY + d );
    },
    
    // contracts on all sides by length d
    erode: function( d ) {
      return this.dilate( -d );
    },
    
    shiftX: function( x ) {
      return this.setMinX( this.minX + x ).setMaxX( this.maxX + x );
    },
    
    shiftY: function( y ) {
      return this.setMinY( this.minY + y ).setMaxY( this.maxY + y );
    },
    
    shift: function( x, y ) {
      return this.shiftX( x ).shiftY( y );
    }
  };
  
  Bounds2.rect = function( x, y, width, height ) {
    return new Bounds2( x, y, x + width, y + height );
  };
  
  // specific bounds useful for operations
  Bounds2.EVERYTHING = new Bounds2( Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY );
  Bounds2.NOTHING = new Bounds2( Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY );
  
  return Bounds2;
} );
