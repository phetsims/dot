// Copyright 2017-2022, University of Colorado Boulder

/**
 * Vector2 tests
 *
 * @author Jonathan Olson (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Vector2 from './Vector2.js';

QUnit.module( 'Vector2' );

function approximateEquals( assert, a, b, msg ) {
  assert.ok( Math.abs( a - b ) < 0.00000001, `${msg} expected: ${b}, result: ${a}` );
}

QUnit.test( 'distance', assert => {
  approximateEquals( assert, new Vector2( 2, 0 ).distance( Vector2.ZERO ), 2 );
  approximateEquals( assert, new Vector2( 2, 0 ).distanceSquared( Vector2.ZERO ), 4 );
  approximateEquals( assert, new Vector2( 4, 7 ).distance( new Vector2( 6, 9 ) ), 2 * Math.sqrt( 2 ) );
  approximateEquals( assert, new Vector2( 4, 7 ).distanceSquared( new Vector2( 6, 9 ) ), 8 );
} );

QUnit.test( 'component average', assert => {

  const vector1 = new Vector2( 2, 2 );
  const vector2 = new Vector2( 3, 3 );
  const vectors = [ vector1, vector2 ];
  let average = Vector2.average( vectors );
  assert.ok( average.x === 2.5, 'x average' );
  assert.ok( average.y === 2.5, 'y average' );

  vectors.push( new Vector2( 7, 1 ) );
  average = Vector2.average( vectors );
  assert.ok( average.x === 4, 'x average again' );
  assert.ok( average.y === 2, 'y average again' );
} );