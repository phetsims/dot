// Copyright 2017-2021, University of Colorado Boulder

/**
 * Bounds2 tests
 *
 * @author Jonathan Olson (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import LinearFunction from './LinearFunction.js';

QUnit.module( 'LinearFunction' );

function approximateEquals( assert, a, b, msg ) {
  assert.ok( Math.abs( a - b ) < 0.00000001, `${msg} expected: ${b}, result: ${a}` );
}

QUnit.test( 'LinearFunction', assert => {
  const f = new LinearFunction( 4, 8, 8, 0 ); // not clamped

  approximateEquals( assert, f.evaluate( 0 ), 16 );
  approximateEquals( assert, f.evaluate( 4 ), 8 );
  approximateEquals( assert, f.evaluate( 8 ), 0 );
  approximateEquals( assert, f.evaluate( 6 ), 4 );
  approximateEquals( assert, f.inverse( 16 ), 0 );
  approximateEquals( assert, f.inverse( 8 ), 4 );
  approximateEquals( assert, f.inverse( 0 ), 8 );
  approximateEquals( assert, f.inverse( 4 ), 6 );

  const g = new LinearFunction( 4, 8, 8, 0, true ); // clamped

  approximateEquals( assert, g.evaluate( 0 ), 8 );
  approximateEquals( assert, g.evaluate( 4 ), 8 );
  approximateEquals( assert, g.evaluate( 8 ), 0 );
  approximateEquals( assert, g.evaluate( 6 ), 4 );
  approximateEquals( assert, g.inverse( 16 ), 4 );
  approximateEquals( assert, g.inverse( 8 ), 4 );
  approximateEquals( assert, g.inverse( 0 ), 8 );
  approximateEquals( assert, g.inverse( 4 ), 6 );
} );