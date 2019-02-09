// Copyright 2017, University of Colorado Boulder

/**
 * Bounds2 tests
 *
 * @author Jonathan Olson (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var dot = require( 'DOT/dot' );
  var Util = require( 'DOT/Util' );
  var Vector2 = require( 'DOT/Vector2' );

  QUnit.module( 'Util' );

  function approximateEquals( assert, a, b, msg ) {
    assert.ok( Math.abs( a - b ) < 0.00000001, msg + ' expected: ' + b + ', result: ' + a );
  }

  function arrayApproximateEquals( assert, a, b, msg ) {
    const aSorted = a.slice().sort();
    const bSorted = b.slice().sort();

    assert.equal( a.length, b.length, msg + ' (length different)' );
    for ( var i = 0; i < a.length; i++ ) {
      approximateEquals( assert, aSorted[ i ], bSorted[ i ], msg + ' (index ' + i + ')' );
    }
  }

  QUnit.test( 'Modulus between up/down tests', function( assert ) {
    assert.equal( Util.moduloBetweenDown( 8, 0, 1 ), 0 );
    assert.equal( Util.moduloBetweenUp( 8, 0, 1 ), 1 );

    assert.equal( Util.moduloBetweenDown( 8, -1, 0 ), -1 );
    assert.equal( Util.moduloBetweenUp( 8, -1, 0 ), 0 );

    assert.equal( Util.moduloBetweenDown( 8, 0, 4 ), 0 );
    assert.equal( Util.moduloBetweenUp( 8, 0, 4 ), 4 );

    assert.equal( Util.moduloBetweenDown( 8, -2, 2 ), 0 );
    assert.equal( Util.moduloBetweenUp( 8, -2, 2 ), 0 );
  } );

  QUnit.test( 'roundSymmetric', function( assert ) {
    assert.equal( Util.roundSymmetric( 0.5 ), 1, '0.5 => 1' );
    assert.equal( Util.roundSymmetric( 0.3 ), 0, '0.3 => 0' );
    assert.equal( Util.roundSymmetric( 0.8 ), 1, '0.8 => 1' );
    assert.equal( Util.roundSymmetric( -0.5 ), -1, '-0.5 => -1' );
    for ( var i = 0; i < 20; i++ ) {
      assert.equal( Util.roundSymmetric( i ), i, i + ' integer' );
      assert.equal( Util.roundSymmetric( -i ), -i, -i + ' integer' );
      assert.equal( Util.roundSymmetric( i + 0.5 ), i + 1, ( i + 0.5 ) + ' => ' + ( i + 1 ) );
      assert.equal( Util.roundSymmetric( -i - 0.5 ), -i - 1, ( -i - 0.5 ) + ' => ' + ( -i - 1 ) );
    }

    var original = dot.v2( 1.5, -2.5 );
    var rounded = original.roundedSymmetric();
    assert.ok( original.equals( dot.v2( 1.5, -2.5 ) ), 'sanity' );
    assert.ok( rounded.equals( dot.v2( 2, -3 ) ), 'rounded' );
    var result = original.roundSymmetric();
    assert.equal( result, original, 'reflexive' );
    assert.ok( original.equals( rounded ), 'both rounded now' );
  } );

  QUnit.test( 'lineLineIntersection', function( assert ) {
    var f = Util.lineLineIntersection;

    var p1 = Vector2.ZERO;
    var p2 = new Vector2( 1, 1 );
    var p3 = new Vector2( -10, 10 );
    var p4 = new Vector2( -12, 8 );

    assert.equal( f( p1, p2, p3, p4 ), null );
    assert.equal( f( p1, p4, p4, p1 ), null );
    assert.equal( f( p1, p1, p3, p4 ), null );
    assert.equal( f( p1, p2, p2, p3 ).x, 1 );
    assert.equal( f( p1, p2, p2, p3 ).y, 1 );
  } );

  QUnit.test( 'lineSegmentIntersection', function( assert ) {
    var h = Util.lineSegmentIntersection;

    var p1 = dot.Vector2.ZERO;
    var p2 = new dot.Vector2( 1, 1 );
    var p3 = new dot.Vector2( -10, 8 );
    var p4 = new dot.Vector2( -3, -3 );
    var p5 = new dot.Vector2( 8, -10 );

    var f = function( p1, p2, p3, p4 ) {
      return h( p1.x, p1.y, p2.x, p2.y, p3.x, p3.y, p4.x, p4.y );
    };

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

  QUnit.test( 'distToSegmentSquared', function( assert ) {
    var f = Util.distToSegmentSquared;

    var p1 = Vector2.ZERO;
    var p2 = new Vector2( -6, 0 );
    var p3 = new Vector2( -5, 1 );

    approximateEquals( assert, f( p1, p2, p3 ), 26 );
    approximateEquals( assert, f( p2, p3, p1 ), 2 );
    approximateEquals( assert, f( p3, p1, p2 ), 1 );
    approximateEquals( assert, f( p1, p2, p2 ), 36 );
    approximateEquals( assert, f( p3, p2, p2 ), 2 );
  } );

  QUnit.test( 'linear map', function( assert ) {
    approximateEquals( assert, Util.linear( 4, 8, 8, 0, 4 ), 8 );
    approximateEquals( assert, Util.linear( 4, 8, 8, 0, 8 ), 0 );
    approximateEquals( assert, Util.linear( 4, 8, 8, 0, 6 ), 4 );
  } );

  QUnit.test( 'clamp', function( assert ) {
    assert.equal( Util.clamp( 5, 1, 4 ), 4 );
    assert.equal( Util.clamp( 3, 1, 4 ), 3 );
    assert.equal( Util.clamp( 0, 1, 4 ), 1 );
  } );

  QUnit.test( 'rangeInclusive', function( assert ) {
    var arr = Util.rangeInclusive( 2, 4 );
    assert.equal( arr.length, 3 );
    assert.equal( arr[ 0 ], 2 );
    assert.equal( arr[ 1 ], 3 );
    assert.equal( arr[ 2 ], 4 );

    arr = Util.rangeInclusive( 4, 2 );
    assert.equal( arr.length, 0 );
  } );

  QUnit.test( 'rangeExclusive', function( assert ) {
    var arr = Util.rangeExclusive( 2, 4 );
    assert.equal( arr.length, 1 );
    assert.equal( arr[ 0 ], 3 );

    arr = Util.rangeExclusive( 4, 2 );
    assert.equal( arr.length, 0 );
  } );

  QUnit.test( 'toRadians', function( assert ) {
    approximateEquals( assert, Util.toRadians( 90 ), Math.PI / 2 );
    approximateEquals( assert, Util.toRadians( 45 ), Math.PI / 4 );
    approximateEquals( assert, Util.toRadians( -45 ), -Math.PI / 4 );
  } );

  QUnit.test( 'toDegrees', function( assert ) {
    approximateEquals( assert, 90, Util.toDegrees( Math.PI / 2 ) );
    approximateEquals( assert, 45, Util.toDegrees( Math.PI / 4 ) );
    approximateEquals( assert, -45, Util.toDegrees( -Math.PI / 4 ) );
  } );

  QUnit.test( 'numberOfDecimalPlaces', function( assert ) {
    assert.equal( Util.numberOfDecimalPlaces( 10 ), 0 );
    assert.equal( Util.numberOfDecimalPlaces( -10 ), 0 );
    assert.equal( Util.numberOfDecimalPlaces( 10.1 ), 1 );
    assert.equal( Util.numberOfDecimalPlaces( -10.1 ), 1 );
    assert.equal( Util.numberOfDecimalPlaces( 10.10 ), 1 );
    assert.equal( Util.numberOfDecimalPlaces( -10.10 ), 1 );
    assert.equal( Util.numberOfDecimalPlaces( 0.567 ), 3 );
    assert.equal( Util.numberOfDecimalPlaces( -0.567 ), 3 );
    assert.equal( Util.numberOfDecimalPlaces( 0.001 ), 3 );
    assert.equal( Util.numberOfDecimalPlaces( -0.001 ), 3 );
  } );

  QUnit.test( 'roundToInterval', function( assert ) {
    assert.equal( Util.roundToInterval( 0.567, 0.01 ), 0.57 );
    assert.equal( Util.roundToInterval( -0.567, 0.01 ), -0.57 );
    assert.equal( Util.roundToInterval( 0.567, 0.02 ), 0.56 );
    assert.equal( Util.roundToInterval( -0.567, 0.02 ), -0.56 );
    assert.equal( Util.roundToInterval( 5.67, 0.5 ), 5.5 );
    assert.equal( Util.roundToInterval( -5.67, 0.5 ), -5.5 );
    assert.equal( Util.roundToInterval( 5.67, 2 ), 6 );
    assert.equal( Util.roundToInterval( -5.67, 2 ), -6 );
    assert.equal( Util.roundToInterval( 4.9, 2 ), 4 );
    assert.equal( Util.roundToInterval( -4.9, 2 ), -4 );
  } );

  QUnit.test( 'solveLinearRootsReal', function( assert ) {
    assert.equal( Util.solveLinearRootsReal( 0, 0 ), null, '0*x + 0 = 0 --- all values are solutions' );
    arrayApproximateEquals( assert, Util.solveLinearRootsReal( 1, 0 ), [ 0 ], '1*x + 0 = 0 --- 0 is a solution' );
    arrayApproximateEquals( assert, Util.solveLinearRootsReal( -1, 0 ), [ 0 ], '-1*x + 0 = 0 --- 0 is a solution' );
    arrayApproximateEquals( assert, Util.solveLinearRootsReal( 0, 1 ), [], '0*x + 1 = 0 --- no solutions' );
    arrayApproximateEquals( assert, Util.solveLinearRootsReal( 1, 1 ), [ -1 ], '1*x + 1 = 0 --- one solution' );
    arrayApproximateEquals( assert, Util.solveLinearRootsReal( -1, 1 ), [ 1 ], '-1*x + 1 = 0 --- one solution' );
    arrayApproximateEquals( assert, Util.solveLinearRootsReal( 3, 2 ), [ -2 / 3 ], '3*x + 2 = 0 --- one solution' );
    arrayApproximateEquals( assert, Util.solveLinearRootsReal( -3, 2 ), [ 2 / 3 ], '-3*x + 2 = 0 --- one solution' );
  } );

  QUnit.test( 'solveQuadraticRootsReal', function( assert ) {
    assert.equal( Util.solveQuadraticRootsReal( 0, 0, 0 ), null, '0*x + 0 = 0 --- all values are solutions' );
    arrayApproximateEquals( assert, Util.solveQuadraticRootsReal( 0, 1, 0 ), [ 0 ], '1*x + 0 = 0 --- 0 is a solution' );
    arrayApproximateEquals( assert, Util.solveQuadraticRootsReal( 0, -1, 0 ), [ 0 ], '-1*x + 0 = 0 --- 0 is a solution' );
    arrayApproximateEquals( assert, Util.solveQuadraticRootsReal( 0, 0, 1 ), [], '0*x + 1 = 0 --- no solutions' );
    arrayApproximateEquals( assert, Util.solveQuadraticRootsReal( 0, 1, 1 ), [ -1 ], '1*x + 1 = 0 --- one solution' );
    arrayApproximateEquals( assert, Util.solveQuadraticRootsReal( 0, -1, 1 ), [ 1 ], '-1*x + 1 = 0 --- one solution' );
    arrayApproximateEquals( assert, Util.solveQuadraticRootsReal( 0, 3, 2 ), [ -2 / 3 ], '3*x + 2 = 0 --- one solution' );
    arrayApproximateEquals( assert, Util.solveQuadraticRootsReal( 0, -3, 2 ), [ 2 / 3 ], '-3*x + 2 = 0 --- one solution' );

    arrayApproximateEquals( assert, Util.solveQuadraticRootsReal( 1, 0, 0 ), [ 0, 0 ], 'x^2 = 0 --- one solution with multiplicity 2' );
    arrayApproximateEquals( assert, Util.solveQuadraticRootsReal( 1, 0, -1 ), [ -1, 1 ], 'x^2 = 1 --- two solutions' );
    arrayApproximateEquals( assert, Util.solveQuadraticRootsReal( 1, 0, -2 ), [ -Math.sqrt( 2 ), Math.sqrt( 2 ) ], 'x^2 = 2 --- two solutions' );
    arrayApproximateEquals( assert, Util.solveQuadraticRootsReal( 2, -1, -3 ), [ -1, 3 / 2 ], '2x^2 - x = 3 --- two solutions' );
  } );

  QUnit.test( 'solveCubicRootsReal', function( assert ) {
    assert.equal( Util.solveCubicRootsReal( 0, 0, 0, 0 ), null, '0*x + 0 = 0 --- all values are solutions' );
    arrayApproximateEquals( assert, Util.solveCubicRootsReal( 0, 0, 1, 0 ), [ 0 ], '1*x + 0 = 0 --- 0 is a solution' );
    arrayApproximateEquals( assert, Util.solveCubicRootsReal( 0, 0, -1, 0 ), [ 0 ], '-1*x + 0 = 0 --- 0 is a solution' );
    arrayApproximateEquals( assert, Util.solveCubicRootsReal( 0, 0, 0, 1 ), [], '0*x + 1 = 0 --- no solutions' );
    arrayApproximateEquals( assert, Util.solveCubicRootsReal( 0, 0, 1, 1 ), [ -1 ], '1*x + 1 = 0 --- one solution' );
    arrayApproximateEquals( assert, Util.solveCubicRootsReal( 0, 0, -1, 1 ), [ 1 ], '-1*x + 1 = 0 --- one solution' );
    arrayApproximateEquals( assert, Util.solveCubicRootsReal( 0, 0, 3, 2 ), [ -2 / 3 ], '3*x + 2 = 0 --- one solution' );
    arrayApproximateEquals( assert, Util.solveCubicRootsReal( 0, 0, -3, 2 ), [ 2 / 3 ], '-3*x + 2 = 0 --- one solution' );

    arrayApproximateEquals( assert, Util.solveCubicRootsReal( 0, 1, 0, 0 ), [ 0, 0 ], 'x^2 = 0 --- one solution with multiplicity 2' );
    arrayApproximateEquals( assert, Util.solveCubicRootsReal( 0, 1, 0, -1 ), [ -1, 1 ], 'x^2 = 1 --- two solutions' );
    arrayApproximateEquals( assert, Util.solveCubicRootsReal( 0, 1, 0, -2 ), [ -Math.sqrt( 2 ), Math.sqrt( 2 ) ], 'x^2 = 2 --- two solutions' );
    arrayApproximateEquals( assert, Util.solveCubicRootsReal( 0, 2, -1, -3 ), [ -1, 3 / 2 ], '2x^2 - x = 3 --- two solutions' );

    arrayApproximateEquals( assert, Util.solveCubicRootsReal( 1, 0, 0, -8 ), [ 2 ], 'x^3 = 8 --- one solution' );
    arrayApproximateEquals( assert, Util.solveCubicRootsReal( 1, -6, 11, -6 ), [ 1, 2, 3 ], 'three solutions' );
    arrayApproximateEquals( assert, Util.solveCubicRootsReal( 1, -5, 8, -4 ), [ 1, 2, 2 ], 'two solutions, one with multiplicity 2' );
    arrayApproximateEquals( assert, Util.solveCubicRootsReal( 1, -3, 3, -1 ), [ 1, 1, 1 ], 'one solution with multiplicity 3' );
    arrayApproximateEquals( assert, Util.solveCubicRootsReal( 1, 1, 1, -3 ), [ 1 ], 'one solution' );
    arrayApproximateEquals( assert, Util.solveCubicRootsReal( 1, 1, -33, 63 ), [ -7, 3, 3 ], 'two solutions, one with multiplicity 2' );
    arrayApproximateEquals( assert, Util.solveCubicRootsReal( 1, -3, 0, 0 ), [ 0, 0, 3 ], 'two solutions, one with multiplicity 2' );
    arrayApproximateEquals( assert, Util.solveCubicRootsReal( 1, 0, 0, 0 ), [ 0, 0, 0 ], 'one solution, multiplicity 3' );
    arrayApproximateEquals( assert, Util.solveCubicRootsReal( 1, 10, 25, 0 ), [ -5, -5, 0 ], 'two solutions, one with multiplicity 2' );
    arrayApproximateEquals( assert, Util.solveCubicRootsReal( 1, 0, -25, 0 ), [ -5, 0, 5 ], 'three solutions' );
    arrayApproximateEquals( assert, Util.solveCubicRootsReal( 1, -18, 107, -210 ), [ 5, 6, 7 ], 'three solutions' );
  } );

} );