// Copyright 2017-2020, University of Colorado Boulder

/**
 * Bounds2 tests
 *
 * @author Jonathan Olson (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import LinearFunction from './LinearFunction.js';

QUnit.module( 'LinearFunction' );

function approximateEquals( assert, a, b, msg ) {
  assert.ok( Math.abs( a - b ) < 0.00000001, msg + ' expected: ' + b + ', result: ' + a );
}

QUnit.test( 'LinearFunction', function( assert ) {
  const f = new LinearFunction( 4, 8, 8, 0 ); // not clamped

  approximateEquals( assert, f( 0 ), 16 );
  approximateEquals( assert, f( 4 ), 8 );
  approximateEquals( assert, f( 8 ), 0 );
  approximateEquals( assert, f( 6 ), 4 );
  approximateEquals( assert, f.inverse( 16 ), 0 );
  approximateEquals( assert, f.inverse( 8 ), 4 );
  approximateEquals( assert, f.inverse( 0 ), 8 );
  approximateEquals( assert, f.inverse( 4 ), 6 );

  const g = new LinearFunction( 4, 8, 8, 0, true ); // clamped

  approximateEquals( assert, g( 0 ), 8 );
  approximateEquals( assert, g( 4 ), 8 );
  approximateEquals( assert, g( 8 ), 0 );
  approximateEquals( assert, g( 6 ), 4 );
  approximateEquals( assert, g.inverse( 16 ), 4 );
  approximateEquals( assert, g.inverse( 8 ), 4 );
  approximateEquals( assert, g.inverse( 0 ), 8 );
  approximateEquals( assert, g.inverse( 4 ), 6 );
} );