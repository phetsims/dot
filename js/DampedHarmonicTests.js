// Copyright 2017, University of Colorado Boulder

/**
 * Bounds2 tests
 *
 * @author Jonathan Olson (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var DampedHarmonic = require( 'DOT/DampedHarmonic' );

  QUnit.module( 'DampedHarmonic' );

  function approxEquals( assert, a, b, msg ) {
    assert.ok( Math.abs( a - b ) < 1e-4, msg + ': ' + a + ' ~= ' + b );
  }

  function estimateDerivative( harmonic, t ) {
    return ( harmonic.getValue( t + 1e-5 ) - harmonic.getValue( t - 1e-5 ) ) / 2e-5;
  }

  function runHarmonic( a, b, c, initialValue, initialDerivative, assert ) {
    var harmonic = new DampedHarmonic( a, b, c, initialValue, initialDerivative );

    approxEquals( assert, harmonic.getValue( 0 ), initialValue, 'Initial value' );
    approxEquals( assert, harmonic.getDerivative( 0 ), initialDerivative, 'Initial derivative' );

    approxEquals( assert, harmonic.getDerivative( 0 ), estimateDerivative( harmonic, 0 ), 'Derivative at 0' );
    approxEquals( assert, harmonic.getDerivative( 0.35 ), estimateDerivative( harmonic, 0.35 ), 'Derivative at 0.35' );
  }

  QUnit.test( 'Critically damped, no initial velocity', runHarmonic.bind( null, 1, 4, 4, 10, 0 ) );
  QUnit.test( 'Under damped, no initial velocity', runHarmonic.bind( null, 1, 2, 4, 10, 0 ) );
  QUnit.test( 'Over damped, no initial velocity', runHarmonic.bind( null, 1, 10, 4, 10, 0 ) );

  QUnit.test( 'Critically damped, no initial position', runHarmonic.bind( null, 1, 4, 4, 0, 10 ) );
  QUnit.test( 'Under damped, no initial position', runHarmonic.bind( null, 1, 2, 4, 0, 10 ) );
  QUnit.test( 'Over damped, no initial position', runHarmonic.bind( null, 1, 10, 4, 0, 10 ) );

  QUnit.test( 'Harmonic A', runHarmonic.bind( null, 1.2, 10.154, 4.2, 0.154, 1.515 ) );
  QUnit.test( 'Harmonic B', runHarmonic.bind( null, -5.2, -1.2, -103.2, 14.32, -17.5 ) );
} );