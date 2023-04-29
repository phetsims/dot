// Copyright 2023, University of Colorado Boulder

/**
 * Random tests
 *
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */

import Bounds2 from './Bounds2.js';
import dotRandom from './dotRandom.js';
import Random from './Random.js';

QUnit.module( 'Random' );

QUnit.test( 'Random.nextPointInBounds', assert => {

  const bounds = new Bounds2( -11, 0, 3, 100 );
  const random = new Random(); // eslint-disable-line bad-sim-text

  for ( let i = 0; i < 100; i++ ) {
    assert.ok( bounds.containsPoint( random.nextPointInBounds( bounds ) ), `random point is in bounds: ${i}` );
  }
} );

// Test that the sampling engine is working properly
QUnit.test( 'sample probabilities', assert => {
  assert.ok( 'first test' );

  const testWeights = weights => {

    const array = new Array( weights.length );
    _.fill( array, 0, 0, array.length );
    for ( let i = 0; i < 50000; i++ ) {
      const index = dotRandom.sampleProbabilities( weights );
      array[ index ]++;
    }

    const inputNormalized = weights.map( element => ( element / _.sum( weights ) ) );
    const resultNormalized = array.map( element => ( element / _.sum( array ) ) );

    let ok = true;
    for ( let i = 0; i < weights.length; i++ ) {
      if ( Math.abs( inputNormalized[ i ] - resultNormalized[ i ] ) > 0.1 ) {
        ok = false;
      }
    }
    assert.ok( ok, `inputNormalized: ${inputNormalized.join( ',' )}, resultNormalized: ${resultNormalized.join( ',' )}` );
  };
  testWeights( [ 1, 2, 3, 4 ] );
  testWeights( [ 0, 1, 0, 0 ] );
} );