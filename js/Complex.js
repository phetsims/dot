// Copyright 2002-2014, University of Colorado Boulder

/**
 * Immutable complex number handling
 *
 * TODO: handle quaternions in a Quaternion.js!
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 * @author Chris Malley
 */

define( function( require ) {
  'use strict';

  var dot = require( 'DOT/dot' );

  var inherit = require( 'PHET_CORE/inherit' );
  var Vector2 = require( 'DOT/Vector2' );

  // not using x,y,width,height so that it can handle infinity-based cases in a better way
  dot.Complex = function Complex( real, imaginary ) {
    Vector2.call( this, real, imaginary );
    this.real = real;
    this.imaginary = imaginary;
  };
  var Complex = dot.Complex;

  Complex.real = function( real ) {
    return new Complex( real, 0 );
  };

  Complex.imaginary = function( imaginary ) {
    return new Complex( 0, imaginary );
  };

  Complex.createPolar = function( magnitude, phase ) {
    return new Complex( magnitude * Math.cos( phase ), magnitude * Math.sin( phase ) );
  };

  // inheriting Vector2 for now since many times we may want to treat the complex number as a vector
  // ideally, we should have Vector2-likeness be a mixin?
  // we also inherit the immutable form since we add 'real' and 'imaginary' properties,
  // without adding extra logic to mutators in Vector2
  inherit( Vector2.Immutable, Complex, {
    phase: Vector2.prototype.angle,

    // TODO: remove times() from Vector2? or have it do this for vectors
    times: function( c ) {
      return new Complex( this.real * c.real - this.imaginary * c.imaginary, this.real * c.imaginary + this.imaginary * c.real );
    },

    dividedBy: function( c ) {
      var cMag = c.magnitudeSquared();
      return new Complex(
          ( this.real * c.real + this.imaginary * c.imaginary ) / cMag,
          ( this.imaginary * c.real - this.real * c.imaginary ) / cMag
      );
    },

    // TODO: pow()
    sqrt: function() {
      var mag = this.magnitude();
      return new Complex( Math.sqrt( ( mag + this.real ) / 2 ),
          ( this.imaginary >= 0 ? 1 : -1 ) * Math.sqrt( ( mag - this.real ) / 2 ) );
    },

    conjugate: function() {
      return new Complex( this.real, -this.imaginary );
    },

    // e^(a+bi) = ( e^a ) * ( cos(b) + i * sin(b) )
    exponentiated: function() {
      return Complex.createPolar( Math.exp( this.real ), this.imaginary );
    },

    toString: function() {
      return "Complex(" + this.x + ", " + this.y + ")";
    }
  } );

  Complex.ZERO = new Complex( 0, 0 );
  Complex.ONE = new Complex( 1, 0 );
  Complex.I = new Complex( 0, 1 );

  return Complex;
} );
