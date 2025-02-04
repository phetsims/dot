// Copyright 2025, University of Colorado Boulder

/**
 * Vector4 tests
 *
 * @author Jonathan Olson (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Vector3 from './Vector3.js';
import Vector4 from './Vector4.js';

QUnit.module( 'Vector4' );

function approximateEquals( assert, a, b, msg ) {
  assert.ok( Math.abs( a - b ) < 0.00000001, `${msg} expected: ${b}, result: ${a}` );
}

QUnit.test( 'simple', assert => {
  approximateEquals( assert, new Vector4( 2, 0, 0, 0 ).distance( Vector4.ZERO ), 2 );
  approximateEquals( assert, new Vector4( 2, 0, 0, 0 ).distanceSquared( Vector4.ZERO ), 4 );
  approximateEquals( assert, new Vector4( 4, 7, 0, 0 ).distance( new Vector4( 6, 9, 0, 0 ) ), 2 * Math.sqrt( 2 ) );
  approximateEquals( assert, new Vector4( 4, 7, 0, 0 ).distanceSquared( new Vector4( 6, 9, 0, 0 ) ), 8 );
} );


QUnit.test( 'Vector4.from()', assert => {

  let vector3 = new Vector3( 2, 2 );

  assert.ok( Vector4.from( vector3 ).equals( Vector4.from( { x: 2, y: 2 } ) ) );
  assert.ok( Vector4.from( vector3, 5 ).equals( Vector4.from( { x: 2, y: 2, z: 0 }, 5 ) ) );

  vector3 = new Vector3( 0, 2 );

  assert.ok( Vector4.from( vector3 ).equals( Vector4.from( { y: 2 } ) ) );
  assert.ok( Vector4.from( vector3 ).equals( Vector4.from( { x: 0, y: 2, z: 0 } ) ) );
  assert.ok( new Vector4( 2, 3, 4, 6 ).equals( Vector4.from( Vector4.fromStateObject( new Vector4( 2, 3, 4, 6 ).toStateObject() ) ) ) );
} );