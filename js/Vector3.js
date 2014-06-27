// Copyright 2002-2014, University of Colorado Boulder

/**
 * Basic 3-dimensional vector
 *
 * TODO: sync with Vector2 changes
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

define( function( require ) {
  'use strict';

  var dot = require( 'DOT/dot' );

  require( 'DOT/Util' );
  require( 'DOT/Vector2' );
  require( 'DOT/Vector4' );

  dot.Vector3 = function Vector3( x, y, z ) {
    // allow optional parameters
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
  };
  var Vector3 = dot.Vector3;

  Vector3.prototype = {
    constructor: Vector3,
    isVector3: true,
    dimension: 3,

    magnitude: function() {
      return Math.sqrt( this.magnitudeSquared() );
    },

    magnitudeSquared: function() {
      return this.dot( this );
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
      return this.x * v.x + this.y * v.y + this.z * v.z;
    },

    isFinite: function() {
      return isFinite( this.x ) && isFinite( this.y ) && isFinite( this.z );
    },

    equals: function( other ) {
      return this.x === other.x && this.y === other.y && this.z === other.z;
    },

    equalsEpsilon: function( other, epsilon ) {
      if ( !epsilon ) {
        epsilon = 0;
      }
      return Math.abs( this.x - other.x ) + Math.abs( this.y - other.y ) + Math.abs( this.z - other.z ) <= epsilon;
    },

    /*---------------------------------------------------------------------------*
     * Immutables
     *----------------------------------------------------------------------------*/

    // create a copy, or if a vector is passed in, set that vector to our value
    copy: function( vector ) {
      if ( vector ) {
        return vector.set( this );
      }
      else {
        return new Vector3( this.x, this.y, this.z );
      }
    },

    cross: function( v ) {
      return new Vector3(
          this.y * v.z - this.z * v.y,
          this.z * v.x - this.x * v.z,
          this.x * v.y - this.y * v.x
      );
    },

    normalized: function() {
      var mag = this.magnitude();
      if ( mag === 0 ) {
        throw new Error( "Cannot normalize a zero-magnitude vector" );
      }
      else {
        return new Vector3( this.x / mag, this.y / mag, this.z / mag );
      }
    },

    timesScalar: function( scalar ) {
      return new Vector3( this.x * scalar, this.y * scalar, this.z * scalar );
    },

    times: function( scalar ) {
      // make sure it's not a vector!
      assert && assert( scalar.dimension === undefined );
      return this.timesScalar( scalar );
    },

    componentTimes: function( v ) {
      return new Vector3( this.x * v.x, this.y * v.y, this.z * v.z );
    },

    plus: function( v ) {
      return new Vector3( this.x + v.x, this.y + v.y, this.z + v.z );
    },

    plusScalar: function( scalar ) {
      return new Vector3( this.x + scalar, this.y + scalar, this.z + scalar );
    },

    minus: function( v ) {
      return new Vector3( this.x - v.x, this.y - v.y, this.z - v.z );
    },

    minusScalar: function( scalar ) {
      return new Vector3( this.x - scalar, this.y - scalar, this.z - scalar );
    },

    dividedScalar: function( scalar ) {
      return new Vector3( this.x / scalar, this.y / scalar, this.z / scalar );
    },

    negated: function() {
      return new Vector3( -this.x, -this.y, -this.z );
    },

    angleBetween: function( v ) {
      return Math.acos( dot.clamp( this.normalized().dot( v.normalized() ), -1, 1 ) );
    },

    // linear interpolation from this (ratio=0) to vector (ratio=1)
    blend: function( vector, ratio ) {
      return this.plus( vector.minus( this ).times( ratio ) );
    },

    // average position between this and the provided vector
    average: function( vector ) {
      return this.blend( vector, 0.5 );
    },

    toString: function() {
      return "Vector3(" + this.x + ", " + this.y + ", " + this.z + ")";
    },

    toVector2: function() {
      return new dot.Vector2( this.x, this.y );
    },

    toVector4: function() {
      return new dot.Vector4( this.x, this.y, this.z );
    },

    /*---------------------------------------------------------------------------*
     * Mutables
     *----------------------------------------------------------------------------*/

    // our core mutables, all mutation should go through these
    setXYZ: function( x, y, z ) {
      this.x = x;
      this.y = y;
      this.z = z;
      return this;
    },
    setX: function( x ) {
      this.x = x;
      return this;
    },
    setY: function( y ) {
      this.y = y;
      return this;
    },
    setZ: function( z ) {
      this.z = z;
      return this;
    },

    set: function( v ) {
      return this.setXYZ( v.x, v.y, v.z );
    },

    add: function( v ) {
      return this.setXYZ( this.x + v.x, this.y + v.y, this.z + v.z );
    },

    addScalar: function( scalar ) {
      return this.setXYZ( this.x + scalar, this.y + scalar, this.z + scalar );
    },

    subtract: function( v ) {
      return this.setXYZ( this.x - v.x, this.y - v.y, this.z - v.z );
    },

    subtractScalar: function( scalar ) {
      return this.setXYZ( this.x - scalar, this.y - scalar, this.z - scalar );
    },

    multiplyScalar: function( scalar ) {
      return this.setXYZ( this.x * scalar, this.y * scalar, this.z * scalar );
    },

    multiply: function( scalar ) {
      // make sure it's not a vector!
      assert && assert( scalar.dimension === undefined );
      return this.multiplyScalar( scalar );
    },

    componentMultiply: function( v ) {
      return this.setXYZ( this.x * v.x, this.y * v.y, this.z * v.z );
    },

    divideScalar: function( scalar ) {
      return this.setXYZ( this.x / scalar, this.y / scalar, this.z / scalar );
    },

    negate: function() {
      return this.setXYZ( -this.x, -this.y, -this.z );
    },

    normalize: function() {
      var mag = this.magnitude();
      if ( mag === 0 ) {
        throw new Error( "Cannot normalize a zero-magnitude vector" );
      }
      else {
        return this.divideScalar( mag );
      }
    }
  };

  /*---------------------------------------------------------------------------*
   * Immutable Vector form
   *----------------------------------------------------------------------------*/
  Vector3.Immutable = function( x, y, z ) {
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
  };
  var Immutable = Vector3.Immutable;

  Immutable.prototype = new Vector3();
  Immutable.prototype.constructor = Immutable;

  // throw errors whenever a mutable method is called on our immutable vector
  Immutable.mutableOverrideHelper = function( mutableFunctionName ) {
    Immutable.prototype[mutableFunctionName] = function() {
      throw new Error( "Cannot call mutable method '" + mutableFunctionName + "' on immutable Vector3" );
    };
  };

  // TODO: better way to handle this list?
  Immutable.mutableOverrideHelper( 'setXYZ' );
  Immutable.mutableOverrideHelper( 'setX' );
  Immutable.mutableOverrideHelper( 'setY' );
  Immutable.mutableOverrideHelper( 'setZ' );

  // helpful immutable constants
  Vector3.ZERO = new Immutable( 0, 0, 0 );
  Vector3.X_UNIT = new Immutable( 1, 0, 0 );
  Vector3.Y_UNIT = new Immutable( 0, 1, 0 );
  Vector3.Z_UNIT = new Immutable( 0, 0, 1 );

  return Vector3;
} );
