// Copyright 2002-2013, University of Colorado Boulder

/**
 * Basic 4-dimensional vector
 *
 * TODO: sync with Vector2 changes
 * TODO: add quaternion extension
 *
 * @author Jonathan Olson <olsonsjc@gmail.com>
 */

define( function( require ) {
  'use strict';
  
  var dot = require( 'DOT/dot' );
  
  require( 'DOT/Util' );
  // require( 'DOT/Vector3' ); // commented out so Require.js doesn't complain about the circular dependency
  
  dot.Vector4 = function Vector4( x, y, z, w ) {
    // allow optional parameters
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
    this.w = w !== undefined ? w : 1; // since w could be zero!
  };
  var Vector4 = dot.Vector4;
  
  Vector4.prototype = {
    constructor: Vector4,

    magnitude: function() {
      return Math.sqrt( this.magnitudeSquared() );
    },

    magnitudeSquared: function() {
      this.dot( this );
    },
    
    // the distance between this vector (treated as a point) and another point
    distance: function( point ) {
      return this.minus( point ).magnitude();
    },
    
    // the squared distance between this vector (treated as a point) and another point
    distanceSquared: function( point ) {
      return this.minus( point ).magnitudeSquared();
    },

    dot: function( v ) {
      return this.x * v.x + this.y * v.y + this.z * v.z + this.w * v.w;
    },
    
    isFinite: function() {
      return isFinite( this.x ) && isFinite( this.y ) && isFinite( this.z ) && isFinite( this.w );
    },

    /*---------------------------------------------------------------------------*
     * Immutables
     *----------------------------------------------------------------------------*/

    normalized: function() {
      var mag = this.magnitude();
      if ( mag === 0 ) {
        throw new Error( "Cannot normalize a zero-magnitude vector" );
      }
      else {
        return new Vector4( this.x / mag, this.y / mag, this.z / mag, this.w / mag );
      }
    },

    timesScalar: function( scalar ) {
      return new Vector4( this.x * scalar, this.y * scalar, this.z * scalar, this.w * scalar );
    },

    times: function( scalar ) {
      // make sure it's not a vector!
      assert && assert( scalar.dimension === undefined );
      return this.timesScalar( scalar );
    },

    componentTimes: function( v ) {
      return new Vector4( this.x * v.x, this.y * v.y, this.z * v.z, this.w * v.w );
    },

    plus: function( v ) {
      return new Vector4( this.x + v.x, this.y + v.y, this.z + v.z, this.w + v.w );
    },

    plusScalar: function( scalar ) {
      return new Vector4( this.x + scalar, this.y + scalar, this.z + scalar, this.w + scalar );
    },

    minus: function( v ) {
      return new Vector4( this.x - v.x, this.y - v.y, this.z - v.z, this.w - v.w );
    },

    minusScalar: function( scalar ) {
      return new Vector4( this.x - scalar, this.y - scalar, this.z - scalar, this.w - scalar );
    },

    dividedScalar: function( scalar ) {
      return new Vector4( this.x / scalar, this.y / scalar, this.z / scalar, this.w / scalar );
    },

    negated: function() {
      return new Vector4( -this.x, -this.y, -this.z, -this.w );
    },

    angleBetween: function( v ) {
      return Math.acos( dot.clamp( this.normalized().dot( v.normalized() ), -1, 1 ) );
    },
    
    // linear interpolation from this (ratio=0) to vector (ratio=1)
    blend: function( vector, ratio ) {
      return this.plus( vector.minus( this ).times( ratio ) );
    },

    toString: function() {
      return "Vector4(" + this.x + ", " + this.y + ", " + this.z + ", " + this.w + ")";
    },

    toVector3: function() {
      return new dot.Vector3( this.x, this.y, this.z );
    },

    /*---------------------------------------------------------------------------*
     * Mutables
     *----------------------------------------------------------------------------*/

    set: function( x, y, z, w ) {
      this.x = x;
      this.y = y;
      this.z = z;
      this.w = w;
    },

    setX: function( x ) {
      this.x = x;
    },

    setY: function( y ) {
      this.y = y;
    },

    setZ: function( z ) {
      this.z = z;
    },

    setW: function( w ) {
      this.w = w;
    },

    copy: function( v ) {
      this.x = v.x;
      this.y = v.y;
      this.z = v.z;
      this.w = v.w;
    },

    add: function( v ) {
      this.x += v.x;
      this.y += v.y;
      this.z += v.z;
      this.w += v.w;
    },

    addScalar: function( scalar ) {
      this.x += scalar;
      this.y += scalar;
      this.z += scalar;
      this.w += scalar;
    },

    subtract: function( v ) {
      this.x -= v.x;
      this.y -= v.y;
      this.z -= v.z;
      this.w -= v.w;
    },

    subtractScalar: function( scalar ) {
      this.x -= scalar;
      this.y -= scalar;
      this.z -= scalar;
      this.w -= scalar;
    },

    componentMultiply: function( v ) {
      this.x *= v.x;
      this.y *= v.y;
      this.z *= v.z;
      this.w *= v.w;
    },

    divideScalar: function( scalar ) {
      this.x /= scalar;
      this.y /= scalar;
      this.z /= scalar;
      this.w /= scalar;
    },

    negate: function() {
      this.x = -this.x;
      this.y = -this.y;
      this.z = -this.z;
      this.w = -this.w;
    },
    
    normalize: function() {
      var mag = this.magnitude();
      if ( mag === 0 ) {
        throw new Error( "Cannot normalize a zero-magnitude vector" );
      } else {
        this.x /= mag;
        this.y /= mag;
        this.z /= mag;
        this.w /= mag;
      }
      return this;
    },
    
    equals: function( other ) {
      return this.x === other.x && this.y === other.y && this.z === other.z && this.w === other.w;
    },
    
    equalsEpsilon: function( other, epsilon ) {
      if ( !epsilon ) {
        epsilon = 0;
      }
      return Math.abs( this.x - other.x ) + Math.abs( this.y - other.y ) + Math.abs( this.z - other.z ) + Math.abs( this.w - other.w ) <= epsilon;
    },

    isVector4: true,

    dimension: 4

  };

  /*---------------------------------------------------------------------------*
   * Immutable Vector form
   *----------------------------------------------------------------------------*/
  Vector4.Immutable = function( x, y, z, w ) {
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
    this.w = w !== undefined ? w : 1;
  };
  var Immutable = Vector4.Immutable;

  Immutable.prototype = new Vector4();
  Immutable.prototype.constructor = Immutable;

  // throw errors whenever a mutable method is called on our immutable vector
  Immutable.mutableOverrideHelper = function( mutableFunctionName ) {
    Immutable.prototype[mutableFunctionName] = function() {
      throw new Error( "Cannot call mutable method '" + mutableFunctionName + "' on immutable Vector4" );
    };
  };

  // TODO: better way to handle this list?
  Immutable.mutableOverrideHelper( 'set' );
  Immutable.mutableOverrideHelper( 'setX' );
  Immutable.mutableOverrideHelper( 'setY' );
  Immutable.mutableOverrideHelper( 'setZ' );
  Immutable.mutableOverrideHelper( 'setW' );
  Immutable.mutableOverrideHelper( 'copy' );
  Immutable.mutableOverrideHelper( 'add' );
  Immutable.mutableOverrideHelper( 'addScalar' );
  Immutable.mutableOverrideHelper( 'subtract' );
  Immutable.mutableOverrideHelper( 'subtractScalar' );
  Immutable.mutableOverrideHelper( 'componentMultiply' );
  Immutable.mutableOverrideHelper( 'divideScalar' );
  Immutable.mutableOverrideHelper( 'negate' );

  // helpful immutable constants
  Vector4.ZERO = new Immutable( 0, 0, 0, 0 );
  Vector4.X_UNIT = new Immutable( 1, 0, 0, 0 );
  Vector4.Y_UNIT = new Immutable( 0, 1, 0, 0 );
  Vector4.Z_UNIT = new Immutable( 0, 0, 1, 0 );
  Vector4.W_UNIT = new Immutable( 0, 0, 0, 1 );
  
  return Vector4;
} );
