// Copyright 2019-2025, University of Colorado Boulder

/**
 * Bounds2 tests
 *
 * @author Jonathan Olson (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import dot from './dot.js';
import { clamp } from './util/clamp.js';
import { distToSegmentSquared } from './util/distToSegmentSquared.js';
import { linear } from './util/linear.js';
import { lineLineIntersection } from './util/lineLineIntersection.js';
import { lineSegmentIntersection } from './util/lineSegmentIntersection.js';
import { moduloBetweenDown } from './util/moduloBetweenDown.js';
import { moduloBetweenUp } from './util/moduloBetweenUp.js';
import { numberOfDecimalPlaces } from './util/numberOfDecimalPlaces.js';
import { rangeExclusive } from './util/rangeExclusive.js';
import { rangeInclusive } from './util/rangeInclusive.js';
import { roundSymmetric } from './util/roundSymmetric.js';
import { roundToInterval } from './util/roundToInterval.js';
import { solveCubicRootsReal } from './util/solveCubicRootsReal.js';
import { solveLinearRootsReal } from './util/solveLinearRootsReal.js';
import { solveQuadraticRootsReal } from './util/solveQuadraticRootsReal.js';
import { toDegrees } from './util/toDegrees.js';
import { toFixed } from './util/toFixed.js';
import { toFixedNumber } from './util/toFixedNumber.js';
import { toRadians } from './util/toRadians.js';
import Vector2 from './Vector2.js';

QUnit.module( 'Utils' );

function approximateEquals( assert, a, b, msg ) {
  assert.ok( Math.abs( a - b ) < 0.00000001, `${msg} expected: ${b}, result: ${a}` );
}

function arrayApproximateEquals( assert, a, b, msg ) {
  const aSorted = a.slice().sort();
  const bSorted = b.slice().sort();

  assert.equal( a.length, b.length, `${msg} (length different)` );
  for ( let i = 0; i < a.length; i++ ) {
    approximateEquals( assert, aSorted[ i ], bSorted[ i ], `${msg} (index ${i})` );
  }
}

QUnit.test( 'Modulus between up/down tests', assert => {
  assert.equal( moduloBetweenDown( 8, 0, 1 ), 0 );
  assert.equal( moduloBetweenUp( 8, 0, 1 ), 1 );

  assert.equal( moduloBetweenDown( 8, -1, 0 ), -1 );
  assert.equal( moduloBetweenUp( 8, -1, 0 ), 0 );

  assert.equal( moduloBetweenDown( 8, 0, 4 ), 0 );
  assert.equal( moduloBetweenUp( 8, 0, 4 ), 4 );

  assert.equal( moduloBetweenDown( 8, -2, 2 ), 0 );
  assert.equal( moduloBetweenUp( 8, -2, 2 ), 0 );
} );

QUnit.test( 'roundSymmetric', assert => {
  assert.equal( roundSymmetric( 0.5 ), 1, '0.5 => 1' );
  assert.equal( roundSymmetric( 0.3 ), 0, '0.3 => 0' );
  assert.equal( roundSymmetric( 0.8 ), 1, '0.8 => 1' );
  assert.equal( roundSymmetric( -0.5 ), -1, '-0.5 => -1' );
  for ( let i = 0; i < 20; i++ ) {
    assert.equal( roundSymmetric( i ), i, `${i} integer` );
    assert.equal( roundSymmetric( -i ), -i, `${-i} integer` );
    assert.equal( roundSymmetric( i + 0.5 ), i + 1, `${i + 0.5} => ${i + 1}` );
    assert.equal( roundSymmetric( -i - 0.5 ), -i - 1, `${-i - 0.5} => ${-i - 1}` );
  }

  const original = dot.v2( 1.5, -2.5 );
  const rounded = original.roundedSymmetric();
  assert.ok( original.equals( dot.v2( 1.5, -2.5 ) ), 'sanity' );
  assert.ok( rounded.equals( dot.v2( 2, -3 ) ), 'rounded' );
  const result = original.roundSymmetric();
  assert.equal( result, original, 'reflexive' );
  assert.ok( original.equals( rounded ), 'both rounded now' );

  assert.equal( roundSymmetric( Number.POSITIVE_INFINITY ), Number.POSITIVE_INFINITY, 'infinity' );
  assert.equal( roundSymmetric( Number.NEGATIVE_INFINITY ), Number.NEGATIVE_INFINITY, 'negative infinity' );
} );

QUnit.test( 'lineLineIntersection', assert => {
  const f = lineLineIntersection;

  const p1 = Vector2.ZERO;
  const p2 = new Vector2( 1, 1 );
  const p3 = new Vector2( -10, 10 );
  const p4 = new Vector2( -12, 8 );

  assert.equal( f( p1, p2, p3, p4 ), null );
  assert.equal( f( p1, p4, p4, p1 ), null );
  assert.equal( f( p1, p1, p3, p4 ), null );
  assert.equal( f( p1, p2, p2, p3 ).x, 1 );
  assert.equal( f( p1, p2, p2, p3 ).y, 1 );
} );

QUnit.test( 'lineSegmentIntersection', assert => {
  const h = lineSegmentIntersection;

  const p1 = Vector2.ZERO;
  const p2 = new Vector2( 1, 1 );
  const p3 = new Vector2( -10, 8 );
  const p4 = new Vector2( -3, -3 );
  const p5 = new Vector2( 8, -10 );

  const f = ( p1, p2, p3, p4 ) => h( p1.x, p1.y, p2.x, p2.y, p3.x, p3.y, p4.x, p4.y );

  assert.equal( f( p4, p1, p1, p2 ), null );
  assert.equal( f( p3, p2, p4, p1 ), null );
  assert.equal( f( p4, p3, p5, p2 ), null );
  assert.equal( f( p4, p1, p3, p2 ), null );
  assert.equal( f( p3, p1, p4, p2 ).x, 0 );
  assert.equal( f( p3, p1, p4, p2 ).y, 0 );
  assert.equal( f( p3, p4, p4, p1 ).x, p4.x );
  assert.equal( f( p3, p4, p4, p1 ).y, p4.y );
  assert.equal( f( p4, p2, p3, p5 ).x, -1 );
  assert.equal( f( p4, p2, p3, p5 ).y, -1 );
  assert.equal( f( p3, p4, p3, p2 ).x, -10 );
  assert.equal( f( p3, p4, p3, p2 ).y, 8 );
} );

QUnit.test( 'distToSegmentSquared', assert => {
  const f = distToSegmentSquared;

  const p1 = Vector2.ZERO;
  const p2 = new Vector2( -6, 0 );
  const p3 = new Vector2( -5, 1 );

  approximateEquals( assert, f( p1, p2, p3 ), 26 );
  approximateEquals( assert, f( p2, p3, p1 ), 2 );
  approximateEquals( assert, f( p3, p1, p2 ), 1 );
  approximateEquals( assert, f( p1, p2, p2 ), 36 );
  approximateEquals( assert, f( p3, p2, p2 ), 2 );
} );

QUnit.test( 'linear map', assert => {
  approximateEquals( assert, linear( 4, 8, 8, 0, 4 ), 8 );
  approximateEquals( assert, linear( 4, 8, 8, 0, 8 ), 0 );
  approximateEquals( assert, linear( 4, 8, 8, 0, 6 ), 4 );
} );

QUnit.test( 'clamp', assert => {
  assert.equal( clamp( 5, 1, 4 ), 4 );
  assert.equal( clamp( 3, 1, 4 ), 3 );
  assert.equal( clamp( 0, 1, 4 ), 1 );
} );

QUnit.test( 'rangeInclusive', assert => {
  let arr = rangeInclusive( 2, 4 );
  assert.equal( arr.length, 3 );
  assert.equal( arr[ 0 ], 2 );
  assert.equal( arr[ 1 ], 3 );
  assert.equal( arr[ 2 ], 4 );

  arr = rangeInclusive( 4, 2 );
  assert.equal( arr.length, 0 );
} );

QUnit.test( 'rangeExclusive', assert => {
  let arr = rangeExclusive( 2, 4 );
  assert.equal( arr.length, 1 );
  assert.equal( arr[ 0 ], 3 );

  arr = rangeExclusive( 4, 2 );
  assert.equal( arr.length, 0 );
} );

QUnit.test( 'toRadians', assert => {
  approximateEquals( assert, toRadians( 90 ), Math.PI / 2 );
  approximateEquals( assert, toRadians( 45 ), Math.PI / 4 );
  approximateEquals( assert, toRadians( -45 ), -Math.PI / 4 );
} );

QUnit.test( 'toDegrees', assert => {
  approximateEquals( assert, 90, toDegrees( Math.PI / 2 ) );
  approximateEquals( assert, 45, toDegrees( Math.PI / 4 ) );
  approximateEquals( assert, -45, toDegrees( -Math.PI / 4 ) );
} );

QUnit.test( 'numberOfDecimalPlaces', assert => {

  // Tests that should succeed.
  assert.equal( numberOfDecimalPlaces( 10 ), 0 );
  assert.equal( numberOfDecimalPlaces( -10 ), 0 );
  assert.equal( numberOfDecimalPlaces( 10.1 ), 1 );
  assert.equal( numberOfDecimalPlaces( -10.1 ), 1 );
  assert.equal( numberOfDecimalPlaces( 10.10 ), 1 );
  assert.equal( numberOfDecimalPlaces( -10.10 ), 1 );
  assert.equal( numberOfDecimalPlaces( 0.567 ), 3 );
  assert.equal( numberOfDecimalPlaces( -0.567 ), 3 );
  assert.equal( numberOfDecimalPlaces( 0.001 ), 3 );
  assert.equal( numberOfDecimalPlaces( -0.001 ), 3 );
  assert.equal( numberOfDecimalPlaces( 0.56 ), 2 );
  assert.equal( numberOfDecimalPlaces( 1e50 ), 0 );
  assert.equal( numberOfDecimalPlaces( 1e-50 ), 50 );
  assert.equal( numberOfDecimalPlaces( 1.5e-50 ), 51 );
  assert.equal( numberOfDecimalPlaces( 1.5e1 ), 0 );
  assert.equal( numberOfDecimalPlaces( 1.5e-2 ), 3 );
  assert.equal( numberOfDecimalPlaces( 2.345e-17 ), 20 );

  // Tests that should fail.
  if ( window.assert ) {
    assert.throws( () => numberOfDecimalPlaces( 'foo' ), 'value must be a number' );
    assert.throws( () => numberOfDecimalPlaces( Infinity ), 'value must be a finite number' );
  }
} );

QUnit.test( 'roundToInterval', assert => {
  assert.equal( roundToInterval( 0.567, 0.01 ), 0.57 );
  assert.equal( roundToInterval( -0.567, 0.01 ), -0.57 );
  assert.equal( roundToInterval( 0.567, 0.02 ), 0.56 );
  assert.equal( roundToInterval( -0.567, 0.02 ), -0.56 );
  assert.equal( roundToInterval( 5.67, 0.5 ), 5.5 );
  assert.equal( roundToInterval( -5.67, 0.5 ), -5.5 );
  assert.equal( roundToInterval( 5.67, 2 ), 6 );
  assert.equal( roundToInterval( -5.67, 2 ), -6 );
  assert.equal( roundToInterval( 4.9, 2 ), 4 );
  assert.equal( roundToInterval( -4.9, 2 ), -4 );
} );

QUnit.test( 'solveLinearRootsReal', assert => {
  assert.equal( solveLinearRootsReal( 0, 0 ), null, '0*x + 0 = 0 --- all values are solutions' );
  arrayApproximateEquals( assert, solveLinearRootsReal( 1, 0 ), [ 0 ], '1*x + 0 = 0 --- 0 is a solution' );
  arrayApproximateEquals( assert, solveLinearRootsReal( -1, 0 ), [ 0 ], '-1*x + 0 = 0 --- 0 is a solution' );
  arrayApproximateEquals( assert, solveLinearRootsReal( 0, 1 ), [], '0*x + 1 = 0 --- no solutions' );
  arrayApproximateEquals( assert, solveLinearRootsReal( 1, 1 ), [ -1 ], '1*x + 1 = 0 --- one solution' );
  arrayApproximateEquals( assert, solveLinearRootsReal( -1, 1 ), [ 1 ], '-1*x + 1 = 0 --- one solution' );
  arrayApproximateEquals( assert, solveLinearRootsReal( 3, 2 ), [ -2 / 3 ], '3*x + 2 = 0 --- one solution' );
  arrayApproximateEquals( assert, solveLinearRootsReal( -3, 2 ), [ 2 / 3 ], '-3*x + 2 = 0 --- one solution' );
} );

QUnit.test( 'solveQuadraticRootsReal', assert => {
  assert.equal( solveQuadraticRootsReal( 0, 0, 0 ), null, '0*x + 0 = 0 --- all values are solutions' );
  arrayApproximateEquals( assert, solveQuadraticRootsReal( 0, 1, 0 ), [ 0 ], '1*x + 0 = 0 --- 0 is a solution' );
  arrayApproximateEquals( assert, solveQuadraticRootsReal( 0, -1, 0 ), [ 0 ], '-1*x + 0 = 0 --- 0 is a solution' );
  arrayApproximateEquals( assert, solveQuadraticRootsReal( 0, 0, 1 ), [], '0*x + 1 = 0 --- no solutions' );
  arrayApproximateEquals( assert, solveQuadraticRootsReal( 0, 1, 1 ), [ -1 ], '1*x + 1 = 0 --- one solution' );
  arrayApproximateEquals( assert, solveQuadraticRootsReal( 0, -1, 1 ), [ 1 ], '-1*x + 1 = 0 --- one solution' );
  arrayApproximateEquals( assert, solveQuadraticRootsReal( 0, 3, 2 ), [ -2 / 3 ], '3*x + 2 = 0 --- one solution' );
  arrayApproximateEquals( assert, solveQuadraticRootsReal( 0, -3, 2 ), [ 2 / 3 ], '-3*x + 2 = 0 --- one solution' );

  arrayApproximateEquals( assert, solveQuadraticRootsReal( 1, 0, 0 ), [ 0, 0 ], 'x^2 = 0 --- one solution with multiplicity 2' );
  arrayApproximateEquals( assert, solveQuadraticRootsReal( 1, 0, -1 ), [ -1, 1 ], 'x^2 = 1 --- two solutions' );
  arrayApproximateEquals( assert, solveQuadraticRootsReal( 1, 0, -2 ), [ -Math.sqrt( 2 ), Math.sqrt( 2 ) ], 'x^2 = 2 --- two solutions' );
  arrayApproximateEquals( assert, solveQuadraticRootsReal( 2, -1, -3 ), [ -1, 3 / 2 ], '2x^2 - x = 3 --- two solutions' );
} );

QUnit.test( 'solveCubicRootsReal', assert => {
  assert.equal( solveCubicRootsReal( 0, 0, 0, 0 ), null, '0*x + 0 = 0 --- all values are solutions' );
  arrayApproximateEquals( assert, solveCubicRootsReal( 0, 0, 1, 0 ), [ 0 ], '1*x + 0 = 0 --- 0 is a solution' );
  arrayApproximateEquals( assert, solveCubicRootsReal( 0, 0, -1, 0 ), [ 0 ], '-1*x + 0 = 0 --- 0 is a solution' );
  arrayApproximateEquals( assert, solveCubicRootsReal( 0, 0, 0, 1 ), [], '0*x + 1 = 0 --- no solutions' );
  arrayApproximateEquals( assert, solveCubicRootsReal( 0, 0, 1, 1 ), [ -1 ], '1*x + 1 = 0 --- one solution' );
  arrayApproximateEquals( assert, solveCubicRootsReal( 0, 0, -1, 1 ), [ 1 ], '-1*x + 1 = 0 --- one solution' );
  arrayApproximateEquals( assert, solveCubicRootsReal( 0, 0, 3, 2 ), [ -2 / 3 ], '3*x + 2 = 0 --- one solution' );
  arrayApproximateEquals( assert, solveCubicRootsReal( 0, 0, -3, 2 ), [ 2 / 3 ], '-3*x + 2 = 0 --- one solution' );

  arrayApproximateEquals( assert, solveCubicRootsReal( 0, 1, 0, 0 ), [ 0, 0 ], 'x^2 = 0 --- one solution with multiplicity 2' );
  arrayApproximateEquals( assert, solveCubicRootsReal( 0, 1, 0, -1 ), [ -1, 1 ], 'x^2 = 1 --- two solutions' );
  arrayApproximateEquals( assert, solveCubicRootsReal( 0, 1, 0, -2 ), [ -Math.sqrt( 2 ), Math.sqrt( 2 ) ], 'x^2 = 2 --- two solutions' );
  arrayApproximateEquals( assert, solveCubicRootsReal( 0, 2, -1, -3 ), [ -1, 3 / 2 ], '2x^2 - x = 3 --- two solutions' );

  arrayApproximateEquals( assert, solveCubicRootsReal( 1, 0, 0, -8 ), [ 2 ], 'x^3 = 8 --- one solution' );
  arrayApproximateEquals( assert, solveCubicRootsReal( 1, -6, 11, -6 ), [ 1, 2, 3 ], 'three solutions' );
  arrayApproximateEquals( assert, solveCubicRootsReal( 1, -5, 8, -4 ), [ 1, 2, 2 ], 'two solutions, one with multiplicity 2' );
  arrayApproximateEquals( assert, solveCubicRootsReal( 1, -3, 3, -1 ), [ 1, 1, 1 ], 'one solution with multiplicity 3' );
  arrayApproximateEquals( assert, solveCubicRootsReal( 1, 1, 1, -3 ), [ 1 ], 'one solution' );
  arrayApproximateEquals( assert, solveCubicRootsReal( 1, 1, -33, 63 ), [ -7, 3, 3 ], 'two solutions, one with multiplicity 2' );
  arrayApproximateEquals( assert, solveCubicRootsReal( 1, -3, 0, 0 ), [ 0, 0, 3 ], 'two solutions, one with multiplicity 2' );
  arrayApproximateEquals( assert, solveCubicRootsReal( 1, 0, 0, 0 ), [ 0, 0, 0 ], 'one solution, multiplicity 3' );
  arrayApproximateEquals( assert, solveCubicRootsReal( 1, 10, 25, 0 ), [ -5, -5, 0 ], 'two solutions, one with multiplicity 2' );
  arrayApproximateEquals( assert, solveCubicRootsReal( 1, 0, -25, 0 ), [ -5, 0, 5 ], 'three solutions' );
  arrayApproximateEquals( assert, solveCubicRootsReal( 1, -18, 107, -210 ), [ 5, 6, 7 ], 'three solutions' );
} );


QUnit.test( 'toFixed', assert => {

  assert.equal( toFixed( Number.POSITIVE_INFINITY, 0 ), 'Infinity' );
  assert.equal( toFixed( Number.POSITIVE_INFINITY, 1 ), 'Infinity' );
  assert.equal( toFixed( Number.POSITIVE_INFINITY, 5 ), 'Infinity' );
  assert.equal( toFixed( Number.NEGATIVE_INFINITY, 0 ), '-Infinity' );
  assert.equal( toFixed( Number.NEGATIVE_INFINITY, 1 ), '-Infinity' );
  assert.equal( toFixed( Number.NEGATIVE_INFINITY, 5 ), '-Infinity' );
  assert.equal( toFixed( NaN, 0 ), 'NaN' );
  assert.equal( toFixed( NaN, 1 ), 'NaN' );

  assert.equal( toFixed( 35.855, 0 ), '36' );
  assert.equal( toFixed( 35.855, 3 ), '35.855' );

  assert.equal( toFixed( 35.855, 2 ), '35.86' );
  assert.equal( toFixed( 35.854, 2 ), '35.85' );
  assert.equal( toFixed( -35.855, 2 ), '-35.86' );
  assert.equal( toFixed( -35.854, 2 ), '-35.85' );

  assert.equal( toFixed( 0.005, 2 ), '0.01' );
  assert.equal( toFixed( 0.004, 2 ), '0.00' );
  assert.equal( toFixed( -0.005, 2 ), '-0.01' );
  assert.equal( toFixed( -0.004, 2 ), '0.00' );

  assert.equal( toFixed( -0.005, 2 ), '-0.01' );

  assert.equal( toFixed( 1.5, 0 ), '2' );
  assert.equal( toFixed( 1.56, 0 ), '2' );
  assert.equal( toFixed( 1.56, 1 ), '1.6' );
  assert.equal( toFixed( 1.54, 1 ), '1.5' );

  assert.equal( toFixed( 1.4, 0 ), '1' );
  assert.equal( toFixed( 1.46, 0 ), '1' );
  assert.equal( toFixed( 1.46, 1 ), '1.5' );
  assert.equal( toFixed( 1.44, 1 ), '1.4' );

  assert.equal( toFixed( 4.577999999999999, 7 ), '4.5780000' );
  assert.equal( toFixed( 0.07957747154594767, 3 ), '0.080' );
  assert.equal( toFixed( 1e-7, 10 ), '0.0000001000' );
  assert.equal( toFixed( 2.7439999999999998, 7 ), '2.7440000' );
  assert.equal( toFixed( 0.396704, 2 ), '0.40' );
  assert.equal( toFixed( 1.0002929999999999, 7 ), '1.0002930' );
  assert.equal( toFixed( 0.4996160344827586, 3 ), '0.500' );
  assert.equal( toFixed( 99.99999999999999, 2 ), '100.00' );
  assert.equal( toFixed( 2.169880191815152, 3 ), '2.170' );
  assert.equal( toFixed( 1.0999999999999999e-7, 1 ), '0.0' );
  assert.equal( toFixed( 3.2303029999999997, 7 ), '3.2303030' );
  assert.equal( toFixed( 0.497625, 2 ), '0.50' );
  assert.equal( toFixed( 2e-12, 12 ), '0.000000000002' );
  assert.equal( toFixed( 6.98910467173495, 1 ), '7.0' );
  assert.equal( toFixed( 8.976212933741225, 1 ), '9.0' );
  assert.equal( toFixed( 2.9985632338511543, 1 ), '3.0' );
  assert.equal( toFixed( -8.951633986928105, 1 ), -'9.0' );
  assert.equal( toFixed( 99.99999999999999, 2 ), '100.00' );
  assert.equal( toFixed( -4.547473508864641e-13, 10 ), '0.0000000000' );
  assert.equal( toFixed( 0.98, 1 ), '1.0' );
  assert.equal( toFixed( 0.2953388796149264, 2 ), '0.30' );
  assert.equal( toFixed( 1.1119839827800002, 4 ), '1.1120' );
  assert.equal( toFixed( 1.0099982756502124, 4 ), '1.0100' );
  assert.equal( toFixed( -1.5, 2 ), '-1.50' );

  assert.equal( toFixed( 1.113774420948007e+25, 9 ), '11137744209480070000000000.000000000' );

  assert.equal( toFixed( 29495969594939.1, 3 ), '29495969594939.100' );
  assert.equal( toFixed( 29495969594939.0, 3 ), '29495969594939.000' );

  // eslint-disable-next-line no-floating-decimal
  assert.equal( toFixed( 29495969594939., 3 ), '29495969594939.000' );
  assert.equal( toFixed( 29495969594939, 3 ), '29495969594939.000' );
  assert.equal( toFixed( 29495969594939, 0 ), '29495969594939' );
  assert.equal( toFixed( 294959695949390000000, 3 ), '294959695949390000000.000' );
  assert.equal( toFixed( 294959695949390000000, 0 ), '294959695949390000000' );

  window.assert && assert.throws( () => {
    toFixed( 0, 1.3010299956639813 );
  }, 'integer for decimalPlaces' );

  assert.equal( toFixed( 0, 0 ), '0' );
  assert.equal( toFixed( 0, 1 ), '0.0' );
  assert.equal( toFixed( -0, 0 ), '0' );
  assert.equal( toFixed( -0, 1 ), '0.0' );
  assert.equal( toFixed( -0, 4 ), '0.0000' );
} );

QUnit.test( 'toFixedNumber', assert => {
  assert.equal( toFixedNumber( Number.POSITIVE_INFINITY, 0 ), Number.POSITIVE_INFINITY );
  assert.equal( toFixedNumber( Number.POSITIVE_INFINITY, 1 ), Number.POSITIVE_INFINITY );
  assert.equal( toFixedNumber( Number.POSITIVE_INFINITY, 5 ), Number.POSITIVE_INFINITY );
  assert.equal( toFixedNumber( Number.NEGATIVE_INFINITY, 0 ), Number.NEGATIVE_INFINITY );
  assert.equal( toFixedNumber( Number.NEGATIVE_INFINITY, 1 ), Number.NEGATIVE_INFINITY );
  assert.equal( toFixedNumber( Number.NEGATIVE_INFINITY, 5 ), Number.NEGATIVE_INFINITY );
  assert.equal( toFixedNumber( 1000.100, 0 ).toString(), '1000' );
  assert.equal( toFixedNumber( 1000.100, 0 ), 1000 );
  assert.equal( toFixedNumber( 1000.100, 1 ).toString(), '1000.1' );
  assert.equal( toFixedNumber( 1000.100, 1 ), 1000.1 );
  assert.equal( toFixedNumber( -0, 1 ).toString(), '0' );
} );