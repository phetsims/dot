// Copyright 2017-2022, University of Colorado Boulder

/**
 * Bounds2 tests
 *
 * @author Jonathan Olson (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Complex from './Complex.js';

QUnit.module( 'Complex' );

function approximateComplexEquals( assert, a, b, msg ) {
  const epsilon = 0.00001;
  assert.ok( a.equalsEpsilon( b, epsilon ), `${msg} expected: ${b.toString()}, result: ${a.toString()}` );
}

QUnit.test( 'Basic', assert => {
  const c = new Complex( 2, 3 );
  assert.equal( c.real, 2, 'real' );
  assert.equal( c.imaginary, 3, 'imaginary' );
  assert.equal( c.conjugated().real, 2, 'real conjugated' );
  assert.equal( c.conjugated().imaginary, -3, 'imaginary conjugated' );
} );

QUnit.test( 'Multiplication', assert => {
  approximateComplexEquals( assert, new Complex( 2, 3 ).times( new Complex( 7, -13 ) ), new Complex( 53, -5 ), 'Multiplication' );
} );

QUnit.test( 'Division', assert => {
  approximateComplexEquals( assert, new Complex( 2, 3 ).dividedBy( new Complex( 7, -13 ) ), new Complex( -25 / 218, 47 / 218 ), 'Division' );
} );

QUnit.test( 'Canceling', assert => {
  const a = new Complex( 2, -3 );
  const b = new Complex( 7, 13 );
  approximateComplexEquals( assert, a.times( b ).dividedBy( b ), a, 'Canceling' );
} );

QUnit.test( 'Square root', assert => {
  approximateComplexEquals( assert, new Complex( 3, 4 ).sqrtOf(), new Complex( 2, 1 ), 'Division' );
  approximateComplexEquals( assert, new Complex( 3, -4 ).sqrtOf(), new Complex( 2, -1 ), 'Division' );

  const c = new Complex( 2.5, -7.1 );
  approximateComplexEquals( assert, c.sqrtOf().times( c.sqrtOf() ), c );

  const cc = c.plus( c );
  new Complex( cc.x, cc.y ).sqrtOf();
} );

QUnit.test( 'Exponentiation', assert => {
  approximateComplexEquals( assert, new Complex( 2, -3 ).exponentiated(), new Complex( -7.31511, -1.04274 ), 'Exponentiation' );
} );

QUnit.test( 'Cos of', assert => {
  const a = new Complex( 1, 1 );
  const b = new Complex( 0.8337300251311491, -0.9888977057628651 );
  approximateComplexEquals( assert, a.cosOf(), b, 'Cos Of' );
} );

QUnit.test( 'Sin of', assert => {
  const a = new Complex( 1, 1 );
  const b = new Complex( 1.29845758, 0.634963914 );
  approximateComplexEquals( assert, a.sinOf(), b, 'Sin Of' );
} );