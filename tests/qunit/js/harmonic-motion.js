// Copyright 2016, University of Colorado Boulder

(function() {
  'use strict';

  module( 'Dot: Harmonic Motion' );

  function approxEquals( a, b, msg ) {
    ok( Math.abs( a - b ) < 1e-4, msg + ': ' + a + ' ~= ' + b );
  }

  function estimateDerivative( harmonic, t ) {
    return ( harmonic.getValue( t + 1e-5 ) - harmonic.getValue( t - 1e-5 ) ) / 2e-5;
  }

  function runHarmonic( a, b, c, initialValue, initialDerivative ) {
    var harmonic = new dot.DampedHarmonic( a, b, c, initialValue, initialDerivative );

    approxEquals( harmonic.getValue( 0 ), initialValue, 'Initial value' );
    approxEquals( harmonic.getDerivative( 0 ), initialDerivative, 'Initial derivative' );

    approxEquals( harmonic.getDerivative( 0 ), estimateDerivative( harmonic, 0 ), 'Derivative at 0' );
    approxEquals( harmonic.getDerivative( 0.35 ), estimateDerivative( harmonic, 0.35 ), 'Derivative at 0.35' );
  }

  test( 'Critically damped, no initial velocity', runHarmonic.bind( null, 1, 4, 4, 10, 0 ) );
  test( 'Under damped, no initial velocity', runHarmonic.bind( null, 1, 2, 4, 10, 0 ) );
  test( 'Over damped, no initial velocity', runHarmonic.bind( null, 1, 10, 4, 10, 0 ) );

  test( 'Critically damped, no initial position', runHarmonic.bind( null, 1, 4, 4, 0, 10 ) );
  test( 'Under damped, no initial position', runHarmonic.bind( null, 1, 2, 4, 0, 10 ) );
  test( 'Over damped, no initial position', runHarmonic.bind( null, 1, 10, 4, 0, 10 ) );

  test( 'Harmonic A', runHarmonic.bind( null, 1.2, 10.154, 4.2, 0.154, 1.515 ) );
  test( 'Harmonic B', runHarmonic.bind( null, -5.2, -1.2, -103.2, 14.32, -17.5 ) );
})();
