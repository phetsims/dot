// Copyright 2023-2024, University of Colorado Boulder

/**
 * UnivariatePolynomial tests
 *
 * @author Jonathan Olson (PhET Interactive Simulations)
 */

import Complex from './Complex.js';
import UnivariatePolynomial from './UnivariatePolynomial.js';

QUnit.module( 'UnivariatePolynomial' );

const numberEqualsEpsilon = ( assert: Assert, a: number, b: number, message: string ) => {
  assert.ok( Math.abs( a - b ) < 1e-8, `actual: ${a}, expected: ${b}, ${message}` );
};

QUnit.test( '2x^2 + 6x + 4', assert => {

  // 2x^2 + 6x + 4
  const polynomial = new UnivariatePolynomial( [ 4, 6, 2 ] );

  numberEqualsEpsilon( assert, polynomial.getCoefficient( 0 ), 4, 'getCoefficient 0' );
  numberEqualsEpsilon( assert, polynomial.getCoefficient( 1 ), 6, 'getCoefficient 1' );
  numberEqualsEpsilon( assert, polynomial.getCoefficient( 2 ), 2, 'getCoefficient 2' );

  numberEqualsEpsilon( assert, polynomial.degree, 2, 'degree' );

  numberEqualsEpsilon( assert, polynomial.evaluate( 0 ), 4, 'evaluate 0' );
  numberEqualsEpsilon( assert, polynomial.evaluate( 1 ), 12, 'evaluate 1' );
  numberEqualsEpsilon( assert, polynomial.evaluate( 2 ), 24, 'evaluate 2' );
  numberEqualsEpsilon( assert, polynomial.evaluate( -1 ), 0, 'evaluate -1' );
  numberEqualsEpsilon( assert, polynomial.evaluate( -2 ), 0, 'evaluate -2' );

  const roots = polynomial.getRoots();
  assert.ok( roots.some( root => root.equals( Complex.real( -1 ) ) ), 'first root' );
  assert.ok( roots.some( root => root.equals( Complex.real( -2 ) ) ), 'second root' );
} );

QUnit.test( 'x^3 + 10x^2 + 169x', assert => {

  // 2x^2 + 6x + 4
  const polynomial = new UnivariatePolynomial( [ 0, 169, 10, 1 ] );

  const roots = polynomial.getRoots();
  assert.ok( roots.length === 3, 'There should be 3 roots' );
  assert.ok( roots.some( root => root.equals( new Complex( -5, 12 ) ) ), 'first root' );
  assert.ok( roots.some( root => root.equals( new Complex( -5, -12 ) ) ), 'second root' );
  assert.ok( roots.some( root => root.equals( new Complex( 0, 0 ) ) ), 'third root' );
} );