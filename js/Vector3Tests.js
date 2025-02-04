// Copyright 2025, University of Colorado Boulder

/**
 * Vector3 tests
 *
 * @author Jonathan Olson (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Vector2 from './Vector2.js';
import Vector3 from './Vector3.js';

QUnit.module( 'Vector3' );

function approximateEquals( assert, a, b, msg ) {
  assert.ok( Math.abs( a - b ) < 0.00000001, `${msg} expected: ${b}, result: ${a}` );
}

QUnit.test( 'simple', assert => {
  approximateEquals( assert, new Vector3( 2, 0, 0 ).distance( Vector3.ZERO ), 2 );
  approximateEquals( assert, new Vector3( 2, 0, 0 ).distanceSquared( Vector3.ZERO ), 4 );
  approximateEquals( assert, new Vector3( 4, 7, 0 ).distance( new Vector3( 6, 9, 0 ) ), 2 * Math.sqrt( 2 ) );
  approximateEquals( assert, new Vector3( 4, 7, 0 ).distanceSquared( new Vector3( 6, 9, 0 ) ), 8 );
} );

QUnit.test( 'Vector3.from()', assert => {

  let vector2 = new Vector2( 2, 2 );

  assert.ok( Vector3.from( vector2 ).equals( Vector3.from( { x: 2, y: 2 } ) ) );
  assert.ok( Vector3.from( vector2 ).equals( Vector3.from( { x: 2, y: 2, z: 0 } ) ) );

  vector2 = new Vector2( 0, 2 );

  assert.ok( Vector3.from( vector2 ).equals( Vector3.from( { y: 2 } ) ) );
  assert.ok( Vector3.from( vector2 ).equals( Vector3.from( { x: 0, y: 2, z: 0, blarg: 'hi' } ) ) );
  assert.ok( new Vector3( 2, 3, 4 ).equals( Vector3.from( Vector3.fromStateObject( new Vector3( 2, 3, 4 ).toStateObject() ) ) ) );
} );