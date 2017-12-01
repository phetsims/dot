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
  var MatrixOps3 = require( 'DOT/MatrixOps3' );

  QUnit.module( 'MatrixOps3' );

  function approxEqual( assert, a, b, msg ) {
    assert.ok( Math.abs( a - b ) < 0.0001, msg );
  }

  function approxEqualArray( assert, arr, barr, msg ) {
    for ( var i = 0; i < arr.length; i++ ) {
      approxEqual( assert, arr[ i ], barr[ i ], msg + ': index ' + i );
    }
  }

  /* eslint-disable no-undef */
  QUnit.test( '3x3 mults', function( assert ) {
    var a = new MatrixOps3.Array( [ 1, 2, 7, 5, 2, 6, -1, -5, 4 ] ); // a:= {{1, 2, 7}, {5, 2, 6}, {-1, -5, 4}}
    var b = new MatrixOps3.Array( [ 4, 3, 1, -7, 2, -1, -1, 0, -2 ] ); // b:= {{4, 3, 1}, {-7, 2, -1}, {-1, 0, -2}}
    var c = new MatrixOps3.Array( 9 );

    MatrixOps3.mult3( a, b, c );
    approxEqualArray( assert, c, [ -17, 7, -15, 0, 19, -9, 27, -13, -4 ], 'mult3' );

    MatrixOps3.mult3LeftTranspose( a, b, c );
    approxEqualArray( assert, c, [ -30, 13, -2, -1, 10, 10, -18, 33, -7 ], 'mult3LeftTranspose' );
    MatrixOps3.mult3RightTranspose( a, b, c );
    approxEqualArray( assert, c, [ 17, -10, -15, 32, -37, -17, -15, -7, -7 ], 'mult3RightTranspose' );
    MatrixOps3.mult3BothTranspose( a, b, c );
    approxEqualArray( assert, c, [ 18, 4, 1, 9, -5, 8, 50, -41, -15 ], 'mult3BothTranspose' );
  } );

  QUnit.test( 'optimized Givens rotation equivalence', function( assert ) {
    var a = new MatrixOps3.Array( [ 1, 2, 7, 5, 2, 6, -1, -5, 4 ] );
    var normal = new MatrixOps3.Array( 9 );
    var accel = new MatrixOps3.Array( 9 );
    var givens = new MatrixOps3.Array( 9 );

    var cos = Math.cos( Math.PI / 6 );
    var sin = Math.sin( Math.PI / 6 );

    MatrixOps3.set3( a, normal );
    MatrixOps3.set3( a, accel );
    approxEqualArray( assert, normal, accel, 'sanity check 1' );
    approxEqualArray( assert, a, accel, 'sanity check 2' );

    // left mult 0,1
    MatrixOps3.setGivens3( givens, cos, sin, 0, 1 );
    MatrixOps3.mult3( givens, normal, normal );
    MatrixOps3.preMult3Givens( accel, cos, sin, 0, 1 );
    approxEqualArray( assert, normal, accel, 'left mult 0,1' );

    // left mult 0,2
    MatrixOps3.setGivens3( givens, cos, sin, 0, 2 );
    MatrixOps3.mult3( givens, normal, normal );
    MatrixOps3.preMult3Givens( accel, cos, sin, 0, 2 );
    approxEqualArray( assert, normal, accel, 'left mult 0,2' );

    // left mult 1,2
    MatrixOps3.setGivens3( givens, cos, sin, 1, 2 );
    MatrixOps3.mult3( givens, normal, normal );
    MatrixOps3.preMult3Givens( accel, cos, sin, 1, 2 );
    approxEqualArray( assert, normal, accel, 'left mult 1,2' );

    // right mult 0,1
    MatrixOps3.setGivens3( givens, cos, sin, 0, 1 );
    MatrixOps3.mult3RightTranspose( normal, givens, normal );
    MatrixOps3.postMult3Givens( accel, cos, sin, 0, 1 );
    approxEqualArray( assert, normal, accel, 'right mult 0,1' );

    // right mult 0,2
    MatrixOps3.setGivens3( givens, cos, sin, 0, 2 );
    MatrixOps3.mult3RightTranspose( normal, givens, normal );
    MatrixOps3.postMult3Givens( accel, cos, sin, 0, 2 );
    approxEqualArray( assert, normal, accel, 'right mult 0,2' );

    // right mult 1,2
    MatrixOps3.setGivens3( givens, cos, sin, 1, 2 );
    MatrixOps3.mult3RightTranspose( normal, givens, normal );
    MatrixOps3.postMult3Givens( accel, cos, sin, 1, 2 );
    approxEqualArray( assert, normal, accel, 'right mult 1,2' );
  } );

  QUnit.test( 'SVD', function( assert ) {
    var a = new MatrixOps3.Array( [ 1, 2, 7, 5, 2, 6, -1, -5, 4 ] );
    var u = new MatrixOps3.Array( 9 );
    var sigma = new MatrixOps3.Array( 9 );
    var v = new MatrixOps3.Array( 9 );

    MatrixOps3.svd3( a, 20, u, sigma, v );

    var c = new MatrixOps3.Array( 9 );

    // c = U * Sigma * V^T
    MatrixOps3.mult3( u, sigma, c );
    MatrixOps3.mult3RightTranspose( c, v, c );

    approxEqualArray( assert, a, c, 'SVD composes' );

    approxEqualArray( assert, sigma, [ sigma[ 0 ], 0, 0, 0, sigma[ 4 ], 0, 0, 0, sigma[ 8 ] ], 'Diagonal matrix should be diagonal' );

    MatrixOps3.mult3RightTranspose( u, u, c );
    approxEqualArray( assert, c, [ 1, 0, 0, 0, 1, 0, 0, 0, 1 ], 'U should be unitary' );

    MatrixOps3.mult3RightTranspose( v, v, c );
    approxEqualArray( assert, c, [ 1, 0, 0, 0, 1, 0, 0, 0, 1 ], 'V should be unitary' );

    approxEqual( assert, MatrixOps3.det3( u ), 1, 'U should be a rotation matrix with the current customs' );
    approxEqual( assert, MatrixOps3.det3( v ), 1, 'V should be a rotation matrix with the current customs' );
  } );
} );