// Copyright 2023, University of Colorado Boulder

/**
 * Random tests
 *
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */

import Bounds2 from './Bounds2.js';
import Random from './Random.js';

QUnit.module( 'Random' );

QUnit.test( 'Random.nextPointInBounds', assert => {

  const bounds = new Bounds2( -11, 0, 3, 100 );
  const random = new Random(); // eslint-disable-line bad-sim-text

  for ( let i = 0; i < 100; i++ ) {
    assert.ok( bounds.containsPoint( random.nextPointInBounds( bounds ) ), `random point is in bounds: ${i}` );
  }
} );
