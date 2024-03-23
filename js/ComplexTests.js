// Copyright 2017-2024, University of Colorado Boulder

/**
 * Complex.js tests
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

QUnit.test( 'getCubeRoots', assert => {
  const actual = new Complex( 0, 8 ).getCubeRoots();
  const expected = [
    new Complex( Math.sqrt( 3 ), 1 ),
    new Complex( -Math.sqrt( 3 ), 1 ),
    new Complex( 0, -2 )
  ];
  approximateComplexEquals( assert, expected[ 0 ], actual[ 0 ], 'root 1' );
  approximateComplexEquals( assert, expected[ 1 ], actual[ 1 ], 'root 2' );
  approximateComplexEquals( assert, expected[ 2 ], actual[ 2 ], 'root 3' );
} );

QUnit.test( 'linear roots', assert => {
  approximateComplexEquals( assert, Complex.real( -2 ), Complex.solveLinearRoots( Complex.real( 3 ), Complex.real( 6 ) )[ 0 ], '3x + 6 = 0  //  x=-2' );
  approximateComplexEquals( assert, new Complex( -2, -1 ), Complex.solveLinearRoots( Complex.real( 3 ), new Complex( 6, 3 ) )[ 0 ], '3x + 6 + 3i = 0  //  x=-2-i' );
  approximateComplexEquals( assert, Complex.real( -3 ), Complex.solveLinearRoots( new Complex( 2, 1 ), new Complex( 6, 3 ) )[ 0 ], '(2 + i)x + 6 + 3i = 0  //  x=-3' );
} );

QUnit.test( 'quadratic roots 0', assert => {
  const roots0 = Complex.solveQuadraticRoots( Complex.real( 1 ), Complex.real( -3 ), Complex.real( 2 ) );
  const roots0_0 = Complex.real( 2 );
  const roots0_1 = Complex.real( 1 );
  approximateComplexEquals( assert, roots0[ 0 ], roots0_0, 'x^2 - 3x + 2 = 0  //  x=2 case' );
  approximateComplexEquals( assert, roots0[ 1 ], roots0_1, 'x^2 - 3x + 2 = 0  //  x=1 case' );
} );

QUnit.test( 'quadratic roots 1', assert => {
  const roots1 = Complex.solveQuadraticRoots( Complex.real( 2 ), Complex.real( 8 ), Complex.real( 8 ) );
  const roots1_x = Complex.real( -2 );
  approximateComplexEquals( assert, roots1[ 0 ], roots1_x, '8x^2 + 8x + 2 = 0  //  x=-2 case (first)' );
  approximateComplexEquals( assert, roots1[ 1 ], roots1_x, '8x^2 + 8x + 2 = 0  //  x=-2 case (second)' );
} );

QUnit.test( 'quadratic roots 2', assert => {
  const roots2 = Complex.solveQuadraticRoots( Complex.real( 1 ), Complex.real( 0 ), Complex.real( -2 ) );
  const roots2_0 = Complex.real( Math.sqrt( 2 ) );
  const roots2_1 = Complex.real( -Math.sqrt( 2 ) );
  approximateComplexEquals( assert, roots2[ 0 ], roots2_0, 'x^2 - 2 = 0  //  x=sqrt(2) case' );
  approximateComplexEquals( assert, roots2[ 1 ], roots2_1, 'x^2 - 2 = 0  //  x=-sqrt(2) case' );
} );

QUnit.test( 'quadratic roots 3', assert => {
  const roots3 = Complex.solveQuadraticRoots( Complex.real( 1 ), Complex.real( -2 ), Complex.real( 2 ) );
  const roots3_0 = new Complex( 1, 1 );
  const roots3_1 = new Complex( 1, -1 );
  approximateComplexEquals( assert, roots3[ 0 ], roots3_0, 'x^2 - 2x + 2 = 0  //  x=1+i case' );
  approximateComplexEquals( assert, roots3[ 1 ], roots3_1, 'x^2 - 2x + 2 = 0  //  x=1-i case' );
} );

QUnit.test( 'quadratic roots 4', assert => {
  const roots4 = Complex.solveQuadraticRoots( Complex.real( 1 ), new Complex( -3, -2 ), new Complex( 1, 3 ) );
  const roots4_0 = new Complex( 2, 1 );
  const roots4_1 = new Complex( 1, 1 );
  approximateComplexEquals( assert, roots4[ 0 ], roots4_0, '(1 + 3i)x^2 + (-3 - 2i)x + 1 = 0  //  x=2+i case' );
  approximateComplexEquals( assert, roots4[ 1 ], roots4_1, '(1 + 3i)x^2 + (-3 - 2i)x + 1 = 0  //  x=1+i case' );
} );

QUnit.test( 'cubic roots 0', assert => {
  const roots = Complex.solveCubicRoots( Complex.real( 1 ), Complex.real( -6 ), Complex.real( 11 ), Complex.real( -6 ) );
  const roots_0 = Complex.real( 1 );
  const roots_1 = Complex.real( 3 );
  const roots_2 = Complex.real( 2 );
  approximateComplexEquals( assert, roots[ 0 ], roots_0, 'x^3 - 6x^2 + 11x - 6 = 0  //  x=1 case' );
  approximateComplexEquals( assert, roots[ 1 ], roots_1, 'x^3 - 6x^2 + 11x - 6 = 0  //  x=3 case' );
  approximateComplexEquals( assert, roots[ 2 ], roots_2, 'x^3 - 6x^2 + 11x - 6 = 0  //  x=2 case' );
} );

QUnit.test( 'cubic roots 1', assert => {
  const roots = Complex.solveCubicRoots( Complex.real( 1 ), Complex.real( 0 ), Complex.real( 0 ), Complex.real( -8 ) );
  const roots_0 = new Complex( -1, -Math.sqrt( 3 ) );
  const roots_1 = Complex.real( 2 );
  const roots_2 = new Complex( -1, Math.sqrt( 3 ) );
  approximateComplexEquals( assert, roots[ 0 ], roots_0, 'x^3 - 8 = 0  //  x=-1-sqrt(3)i case' );
  approximateComplexEquals( assert, roots[ 1 ], roots_1, 'x^3 - 8 = 0  //  x=2 case' );
  approximateComplexEquals( assert, roots[ 2 ], roots_2, 'x^3 - 8 = 0  //  x=-1+sqrt(3)i case' );
} );

QUnit.test( 'cubic roots 2', assert => {
  const roots = Complex.solveCubicRoots( Complex.real( 2 ), Complex.real( 8 ), Complex.real( 8 ), Complex.real( 0 ) );
  const roots_0 = Complex.real( 0 );
  const roots_1 = Complex.real( -2 );
  const roots_2 = Complex.real( -2 );
  approximateComplexEquals( assert, roots[ 0 ], roots_0, '2x^3 + 8x^2 + 8x = 0  //  x=0' );
  approximateComplexEquals( assert, roots[ 1 ], roots_1, '2x^3 + 8x^2 + 8x = 0  //  x=-2 case' );
  approximateComplexEquals( assert, roots[ 2 ], roots_2, '2x^3 + 8x^2 + 8x = 0  //  x=-2 case' );
} );

QUnit.test( 'cubic roots 3', assert => {
  const roots = Complex.solveCubicRoots( Complex.real( 1 ), Complex.real( 1 ), Complex.real( 1 ), Complex.real( 1 ) );
  const roots_0 = Complex.real( -1 );
  const roots_1 = new Complex( 0, -1 );
  const roots_2 = new Complex( 0, 1 );
  approximateComplexEquals( assert, roots[ 0 ], roots_0, 'x^3 + x^2 + x + 1 = 0  //  x=-1' );
  approximateComplexEquals( assert, roots[ 1 ], roots_1, 'x^3 + x^2 + x + 1 = 0  //  x=-i case' );
  approximateComplexEquals( assert, roots[ 2 ], roots_2, 'x^3 + x^2 + x + 1 = 0  //  x=i case' );
} );