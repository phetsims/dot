// Copyright 2019-2024, University of Colorado Boulder

/**
 * PiecewiseLinearFunction tests
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import PiecewiseLinearFunction from './PiecewiseLinearFunction.js';

QUnit.module( 'PiecewiseLinearFunction' );

function approximateEquals( assert: Assert, a: number, b: number ): void {
  assert.ok( Math.abs( a - b ) < 0.00000001, `expected: ${b}, result: ${a}` );
}

QUnit.test( 'PiecewiseLinearFunction', assert => {
  approximateEquals( assert, PiecewiseLinearFunction.evaluate( [ 0, 0, 1, 1 ], 0 ), 0 );
  approximateEquals( assert, PiecewiseLinearFunction.evaluate( [ 0, 0, 1, 1 ], 0.5 ), 0.5 );
  approximateEquals( assert, PiecewiseLinearFunction.evaluate( [ 0, 0, 1, 2 ], 0.5 ), 1 );
  approximateEquals( assert, PiecewiseLinearFunction.evaluate( [ 1, -1, -1, 1 ], 0 ), 0 );
  approximateEquals( assert, PiecewiseLinearFunction.evaluate( [ 100, 100, 1, -1, -1, 1 ], 0 ), 0 );
} );