// Copyright 2002-2014, University of Colorado Boulder

/**
 * Basic 2-dimensional vector
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

define( function( require ) {
  'use strict';

  var dot = require( 'DOT/dot' );

  var inherit = require( 'PHET_CORE/inherit' );
  var Poolable = require( 'PHET_CORE/Poolable' );
  require( 'DOT/Util' );
  // require( 'DOT/Vector3' ); // commented out since Require.js complains about the circular dependency

  dot.Vector2 = function Vector2( x, y ) {
    // allow optional parameters
    this.x = x || 0;
    this.y = y || 0;

    assert && assert( typeof this.x === 'number', 'x needs to be a number' );
    assert && assert( typeof this.y === 'number', 'y needs to be a number' );

    phetAllocation && phetAllocation( 'Vector2' );
  };
  var Vector2 = dot.Vector2;

  Vector2.createPolar = function( magnitude, angle ) {
    return new Vector2().setPolar( magnitude, angle );
  };

  Vector2.prototype = {
    constructor: Vector2,
    isVector2: true,
    dimension: 2,

    magnitude: function() {
      return Math.sqrt( this.magnitudeSquared() );
    },

    magnitudeSquared: function() {
      return this.x * this.x + this.y * this.y;
    },

    // the distance between this vector (treated as a point) and another point
    distance: function( point ) {
      return Math.sqrt( this.distanceSquared( point ) );
    },

    // the distance between this vector (treated as a point) and another point specified as x:Number, y:Number
    distanceXY: function( x, y ) {
      var dx = this.x - x;
      var dy = this.y - y;
      return Math.sqrt( dx * dx + dy * dy );
    },

    // the squared distance between this vector (treated as a point) and another point
    distanceSquared: function( point ) {
      var dx = this.x - point.x;
      var dy = this.y - point.y;
      return dx * dx + dy * dy;
    },

    // the squared distance between this vector (treated as a point) and another point as (x,y)
    distanceSquaredXY: function( x, y ) {
      var dx = this.x - x;
      var dy = this.y - y;
      return dx * dx + dy * dy;
    },

    dot: function( v ) {
      return this.x * v.x + this.y * v.y;
    },

    dotXY: function( vx, vy ) {
      return this.x * vx + this.y * vy;
    },

    equals: function( other ) {
      return this.x === other.x && this.y === other.y;
    },

    equalsEpsilon: function( other, epsilon ) {
      if ( !epsilon ) {
        epsilon = 0;
      }
      return Math.max( Math.abs( this.x - other.x ), Math.abs( this.y - other.y ) ) <= epsilon;
    },

    isFinite: function() {
      return isFinite( this.x ) && isFinite( this.y );
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
        return new Vector2( this.x, this.y );
      }
    },

    // z component of the equivalent 3-dimensional cross product (this.x, this.y,0) x (v.x, v.y, 0)
    crossScalar: function( v ) {
      return this.x * v.y - this.y * v.x;
    },

    normalized: function() {
      var mag = this.magnitude();
      if ( mag === 0 ) {
        throw new Error( "Cannot normalize a zero-magnitude vector" );
      }
      else {
        return new Vector2( this.x / mag, this.y / mag );
      }
    },

    timesScalar: function( scalar ) {
      return new Vector2( this.x * scalar, this.y * scalar );
    },

    times: function( scalar ) {
      // make sure it's not a vector!
      assert && assert( scalar.dimension === undefined );
      return this.timesScalar( scalar );
    },

    componentTimes: function( v ) {
      return new Vector2( this.x * v.x, this.y * v.y );
    },

    plus: function( v ) {
      return new Vector2( this.x + v.x, this.y + v.y );
    },

    plusXY: function( x, y ) {
      return new Vector2( this.x + x, this.y + y );
    },

    plusScalar: function( scalar ) {
      return new Vector2( this.x + scalar, this.y + scalar );
    },

    minus: function( v ) {
      return new Vector2( this.x - v.x, this.y - v.y );
    },

    minusXY: function( x, y ) {
      return new Vector2( this.x - x, this.y - y );
    },

    minusScalar: function( scalar ) {
      return new Vector2( this.x - scalar, this.y - scalar );
    },

    dividedScalar: function( scalar ) {
      return new Vector2( this.x / scalar, this.y / scalar );
    },

    negated: function() {
      return new Vector2( -this.x, -this.y );
    },

    angle: function() {
      return Math.atan2( this.y, this.x );
    },

    // equivalent to a -PI/2 rotation (right hand rotation)
    perpendicular: function() {
      return new Vector2( this.y, -this.x );
    },

    angleBetween: function( v ) {
      var thisMagnitude = this.magnitude();
      var vMagnitude = v.magnitude();
      return Math.acos( dot.clamp( ( this.x * v.x + this.y * v.y ) / ( thisMagnitude * vMagnitude ), -1, 1 ) );
    },

    rotated: function( angle ) {
      var newAngle = this.angle() + angle;
      var mag = this.magnitude();
      return new Vector2( mag * Math.cos( newAngle ), mag * Math.sin( newAngle ) );
    },

    // linear interpolation from this (ratio=0) to vector (ratio=1)
    blend: function( vector, ratio ) {
      return new Vector2( this.x + (vector.x - this.x) * ratio, this.y + (vector.y - this.y) * ratio );
    },

    // average position between this and the provided vector
    average: function( vector ) {
      return this.blend( vector, 0.5 );
    },

    toString: function() {
      return 'Vector2(' + this.x + ', ' + this.y + ')';
    },

    toVector3: function() {
      return new dot.Vector3( this.x, this.y );
    },

    /*---------------------------------------------------------------------------*
     * Mutables
     *----------------------------------------------------------------------------*/

    // our core three functions which all mutation should go through
    setXY: function( x, y ) {
      this.x = x;
      this.y = y;
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

    set: function( v ) {
      return this.setXY( v.x, v.y );
    },

    //Sets the magnitude of the vector, keeping the same direction (though a negative magnitude will flip the vector direction)
    setMagnitude: function( m ) {
      var scale = m / this.magnitude();
      return this.multiplyScalar( scale );
    },

    add: function( v ) {
      return this.setXY( this.x + v.x, this.y + v.y );
    },

    addXY: function( x, y ) {
      return this.setXY( this.x + x, this.y + y );
    },

    addScalar: function( scalar ) {
      return this.setXY( this.x + scalar, this.y + scalar );
    },

    subtract: function( v ) {
      return this.setXY( this.x - v.x, this.y - v.y );
    },

    subtractScalar: function( scalar ) {
      return this.setXY( this.x - scalar, this.y - scalar );
    },

    multiplyScalar: function( scalar ) {
      return this.setXY( this.x * scalar, this.y * scalar );
    },

    multiply: function( scalar ) {
      // make sure it's not a vector!
      assert && assert( scalar.dimension === undefined );
      return this.multiplyScalar( scalar );
    },

    componentMultiply: function( v ) {
      return this.setXY( this.x * v.x, this.y * v.y );
    },

    divideScalar: function( scalar ) {
      return this.setXY( this.x / scalar, this.y / scalar );
    },

    negate: function() {
      return this.setXY( -this.x, -this.y );
    },

    normalize: function() {
      var mag = this.magnitude();
      if ( mag === 0 ) {
        throw new Error( "Cannot normalize a zero-magnitude vector" );
      }
      else {
        return this.divideScalar( mag );
      }
    },

    rotate: function( angle ) {
      var newAngle = this.angle() + angle;
      var mag = this.magnitude();
      return this.setXY( mag * Math.cos( newAngle ), mag * Math.sin( newAngle ) );
    },

    setPolar: function( magnitude, angle ) {
      return this.setXY( magnitude * Math.cos( angle ), magnitude * Math.sin( angle ) );
    }

  };

  // experimental object pooling
  /* jshint -W064 */
  Poolable( Vector2, {
    defaultFactory: function() { return new Vector2(); },
    constructorDuplicateFactory: function( pool ) {
      return function( x, y ) {
        if ( pool.length ) {
          return pool.pop().setXY( x, y );
        }
        else {
          return new Vector2( x, y );
        }
      };
    }
  } );

  /*---------------------------------------------------------------------------*
   * Immutable Vector form
   *----------------------------------------------------------------------------*/
  Vector2.Immutable = function ImmutableVector2( x, y ) {
    Vector2.call( this, x, y );
  };
  var Immutable = Vector2.Immutable;

  inherit( Vector2, Immutable );

  // throw errors whenever a mutable method is called on our immutable vector
  Immutable.mutableOverrideHelper = function( mutableFunctionName ) {
    Immutable.prototype[mutableFunctionName] = function() {
      throw new Error( "Cannot call mutable method '" + mutableFunctionName + "' on immutable Vector2" );
    };
  };

  // TODO: better way to handle this list?
  Immutable.mutableOverrideHelper( 'setXY' );
  Immutable.mutableOverrideHelper( 'setX' );
  Immutable.mutableOverrideHelper( 'setY' );

  // helpful immutable constants
  Vector2.ZERO = new Immutable( 0, 0 );
  Vector2.X_UNIT = new Immutable( 1, 0 );
  Vector2.Y_UNIT = new Immutable( 0, 1 );

  return Vector2;
} );
