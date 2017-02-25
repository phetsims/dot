// Copyright 2013-2015, University of Colorado Boulder

/**
 * Solves for a specific solution of a damped harmonic oscillator
 * (https://en.wikipedia.org/wiki/Harmonic_oscillator#Damped_harmonic_oscillator), given the initial value and
 * derivative.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

define( function( require ) {
  'use strict';

  var dot = require( 'DOT/dot' );
  var inherit = require( 'PHET_CORE/inherit' );

  /**
   * For solving ax'' + bx' + cx = 0 with initial conditions x(0) and x'(0).
   * @constructor
   * @public
   *
   * @param {number} a - Coefficient in front of the second derivative.
   * @param {number} b - Coefficient in front of the first derivative, responsible for the amount of damping applied.
   * @param {number} c - Coefficient in front of the current value, responsible for the amount of force towards equilibrium.
   * @param {number} initialValue - The value of x(0), i.e. the initial position at t=0.
   * @param {number} initialDerivative - The value of x'(0), i.e. the initial velocity at t=0;
   */
  function DampedHarmonic( a, b, c, initialValue, initialDerivative ) {
    assert && assert( typeof a === 'number' && isFinite( a ) && a !== 0 );
    assert && assert( typeof b === 'number' && isFinite( b ) );
    assert && assert( typeof c === 'number' && isFinite( c ) && c !== 0 );
    assert && assert( typeof initialValue === 'number' && isFinite( initialValue ) );
    assert && assert( typeof initialDerivative === 'number' && isFinite( initialDerivative ) );

    // We'll transform into the simpler: x'' + dampingConstant x' + angularFrequencySquared x = 0
    // @private {number}
    this.dampingConstant = b / a;
    this.angularFrequencySquared = c / a;

    assert && assert( this.dampingConstant >= 0, 'a and b should share the same sign' );
    assert && assert( this.angularFrequencySquared > 0, 'a and c should share the same sign' );

    // @private {number} - Determines what type of solution is required.
    this.discriminant = this.dampingConstant * this.dampingConstant - 4 * this.angularFrequencySquared;

    // @private {number} - One of DampedHarmonic.[OVER_DAMPED,UNDER_DAMPED,CRITICALLY_DAMPED]
    this.solutionType = 0; // will be filled in below

    // @private {number} - Constants that determine what linear combination of solutions satisfies the initial
    // conditions
    this.c1 = 0;
    this.c2 = 0;

    if ( Math.abs( this.discriminant ) < 1e-5 ) {
      this.solutionType = DampedHarmonic.CRITICALLY_DAMPED;

      // @private {number}
      this.angularFrequency = Math.sqrt( this.angularFrequencySquared );

      this.c1 = initialValue;
      this.c2 = initialDerivative + this.angularFrequency * initialValue;
    }
    else if ( this.discriminant < 0 ) {
      this.solutionType = DampedHarmonic.UNDER_DAMPED;

      // @private {number}
      this.frequency = 0.5 * Math.sqrt( -this.discriminant );

      this.c1 = initialValue;
      this.c2 = ( this.dampingConstant * initialValue ) / ( 2 * this.frequency ) + initialDerivative / this.frequency;
    }
    else {
      this.solutionType = DampedHarmonic.OVER_DAMPED;

      // @private {number}
      this.positiveRoot = 0.5 * ( -this.dampingConstant + Math.sqrt( this.discriminant ) );
      this.negativeRoot = 0.5 * ( -this.dampingConstant - Math.sqrt( this.discriminant ) );

      this.c2 = ( this.negativeRoot * initialValue - initialDerivative ) / ( this.negativeRoot - this.positiveRoot );
      this.c1 = initialValue - this.c2;
    }
  }

  dot.register( 'DampedHarmonic', DampedHarmonic );

  inherit( Object, DampedHarmonic, {
    /**
     * Returns the value of x(t) determined by the differential equation and initial conditions.
     * @public
     *
     * @param {number} t
     * @returns {number}
     */
    getValue: function( t ) {
      if ( this.solutionType === DampedHarmonic.CRITICALLY_DAMPED ) {
        return ( this.c1 + this.c2 * t ) * Math.exp( -this.angularFrequency * t );
      }
      else if ( this.solutionType === DampedHarmonic.UNDER_DAMPED ) {
        var theta = this.frequency * t;
        return Math.exp( -( this.dampingConstant / 2 ) * t ) * ( this.c1 * Math.cos( theta ) + this.c2 * Math.sin( theta ) );
      }
      else if ( this.solutionType === DampedHarmonic.OVER_DAMPED ) {
        return this.c1 * Math.exp( this.negativeRoot * t ) + this.c2 * Math.exp( this.positiveRoot * t );
      }
      else {
        throw new Error( 'Unknown solution type?' );
      }
    },

    /**
     * Returns the value of x'(t) determined by the differential equation and initial conditions.
     * @public
     *
     * @param {number} t
     * @returns {number}
     */
    getDerivative: function( t ) {
      if ( this.solutionType === DampedHarmonic.CRITICALLY_DAMPED ) {
        return Math.exp( -this.angularFrequency * t ) * ( this.c2 - this.angularFrequency * ( this.c1 + this.c2 * t ) );
      }
      else if ( this.solutionType === DampedHarmonic.UNDER_DAMPED ) {
        var theta = this.frequency * t;
        var cos = Math.cos( theta );
        var sin = Math.sin( theta );
        var term1 = this.frequency * ( this.c2 * cos - this.c1 * sin );
        var term2 = 0.5 * this.dampingConstant * ( this.c1 * cos + this.c2 * sin );
        return Math.exp( -0.5 * this.dampingConstant * t ) * ( term1 - term2 );
      }
      else if ( this.solutionType === DampedHarmonic.OVER_DAMPED ) {
        return this.c1 * this.negativeRoot * Math.exp( this.negativeRoot * t ) + this.c2 * this.positiveRoot * Math.exp( this.positiveRoot * t );
      }
      else {
        throw new Error( 'Unknown solution type?' );
      }
    }
  }, {
    // @public {number} - Enumeration values designed for fast comparison.
    OVER_DAMPED: 1,
    UNDER_DAMPED: 2,
    CRITICALLY_DAMPED: 3
  } );

  return DampedHarmonic;
} );
