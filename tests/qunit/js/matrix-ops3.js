// Copyright 2002-2014, University of Colorado Boulder

/**
 * Tests for the dot.MatrixOps3 type.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

(function() {
  'use strict';

  module( 'Dot: MatrixOps3' );

  function approxEqual( a, b, msg ) {
    ok( Math.abs( a - b ) < 0.0001, msg );
  }

  function approxEqualArray( arr, barr, msg ) {
    for ( var i = 0; i < arr.length; i++ ) {
      approxEqual( arr[ i ], barr[ i ], msg + ': index ' + i );
    }
  }

  /* eslint-disable no-undef */
  test( '3x3 mults', function() {
    var a = new dot.MatrixOps3.Array( [ 1, 2, 7, 5, 2, 6, -1, -5, 4 ] ); // a:= {{1, 2, 7}, {5, 2, 6}, {-1, -5, 4}}
    var b = new dot.MatrixOps3.Array( [ 4, 3, 1, -7, 2, -1, -1, 0, -2 ] ); // b:= {{4, 3, 1}, {-7, 2, -1}, {-1, 0, -2}}
    var c = new dot.MatrixOps3.Array( 9 );

    dot.MatrixOps3.mult3( a, b, c );
    approxEqualArray( c, [ -17, 7, -15, 0, 19, -9, 27, -13, -4 ], 'mult3' );

    dot.MatrixOps3.mult3LeftTranspose( a, b, c );
    approxEqualArray( c, [ -30, 13, -2, -1, 10, 10, -18, 33, -7 ], 'mult3LeftTranspose' );
    dot.MatrixOps3.mult3RightTranspose( a, b, c );
    approxEqualArray( c, [ 17, -10, -15, 32, -37, -17, -15, -7, -7 ], 'mult3RightTranspose' );
    dot.MatrixOps3.mult3BothTranspose( a, b, c );
    approxEqualArray( c, [ 18, 4, 1, 9, -5, 8, 50, -41, -15 ], 'mult3BothTranspose' );
  } );

  test( 'optimized Givens rotation equivalence', function() {
    var a = new dot.MatrixOps3.Array( [ 1, 2, 7, 5, 2, 6, -1, -5, 4 ] );
    var normal = new dot.MatrixOps3.Array( 9 );
    var accel = new dot.MatrixOps3.Array( 9 );
    var givens = new dot.MatrixOps3.Array( 9 );

    var cos = Math.cos( Math.PI / 6 );
    var sin = Math.sin( Math.PI / 6 );

    dot.MatrixOps3.set3( a, normal );
    dot.MatrixOps3.set3( a, accel );
    approxEqualArray( normal, accel, 'sanity check 1' );
    approxEqualArray( a, accel, 'sanity check 2' );

    // left mult 0,1
    dot.MatrixOps3.setGivens3( givens, cos, sin, 0, 1 );
    dot.MatrixOps3.mult3( givens, normal, normal );
    dot.MatrixOps3.preMult3Givens( accel, cos, sin, 0, 1 );
    approxEqualArray( normal, accel, 'left mult 0,1' );

    // left mult 0,2
    dot.MatrixOps3.setGivens3( givens, cos, sin, 0, 2 );
    dot.MatrixOps3.mult3( givens, normal, normal );
    dot.MatrixOps3.preMult3Givens( accel, cos, sin, 0, 2 );
    approxEqualArray( normal, accel, 'left mult 0,2' );

    // left mult 1,2
    dot.MatrixOps3.setGivens3( givens, cos, sin, 1, 2 );
    dot.MatrixOps3.mult3( givens, normal, normal );
    dot.MatrixOps3.preMult3Givens( accel, cos, sin, 1, 2 );
    approxEqualArray( normal, accel, 'left mult 1,2' );

    // right mult 0,1
    dot.MatrixOps3.setGivens3( givens, cos, sin, 0, 1 );
    dot.MatrixOps3.mult3RightTranspose( normal, givens, normal );
    dot.MatrixOps3.postMult3Givens( accel, cos, sin, 0, 1 );
    approxEqualArray( normal, accel, 'right mult 0,1' );

    // right mult 0,2
    dot.MatrixOps3.setGivens3( givens, cos, sin, 0, 2 );
    dot.MatrixOps3.mult3RightTranspose( normal, givens, normal );
    dot.MatrixOps3.postMult3Givens( accel, cos, sin, 0, 2 );
    approxEqualArray( normal, accel, 'right mult 0,2' );

    // right mult 1,2
    dot.MatrixOps3.setGivens3( givens, cos, sin, 1, 2 );
    dot.MatrixOps3.mult3RightTranspose( normal, givens, normal );
    dot.MatrixOps3.postMult3Givens( accel, cos, sin, 1, 2 );
    approxEqualArray( normal, accel, 'right mult 1,2' );
  } );

  test( 'SVD', function() {
    var a = new dot.MatrixOps3.Array( [ 1, 2, 7, 5, 2, 6, -1, -5, 4 ] );
    var u = new dot.MatrixOps3.Array( 9 );
    var sigma = new dot.MatrixOps3.Array( 9 );
    var v = new dot.MatrixOps3.Array( 9 );

    dot.MatrixOps3.svd3( a, 20, u, sigma, v );

    var c = new dot.MatrixOps3.Array( 9 );

    // c = U * Sigma * V^T
    dot.MatrixOps3.mult3( u, sigma, c );
    dot.MatrixOps3.mult3RightTranspose( c, v, c );

    approxEqualArray( a, c, 'SVD composes' );

    approxEqualArray( sigma, [ sigma[ 0 ], 0, 0, 0, sigma[ 4 ], 0, 0, 0, sigma[ 8 ] ], 'Diagonal matrix should be diagonal' );

    dot.MatrixOps3.mult3RightTranspose( u, u, c );
    approxEqualArray( c, [ 1, 0, 0, 0, 1, 0, 0, 0, 1 ], 'U should be unitary' );

    dot.MatrixOps3.mult3RightTranspose( v, v, c );
    approxEqualArray( c, [ 1, 0, 0, 0, 1, 0, 0, 0, 1 ], 'V should be unitary' );

    approxEqual( dot.MatrixOps3.det3( u ), 1, 'U should be a rotation matrix with the current customs' );
    approxEqual( dot.MatrixOps3.det3( v ), 1, 'V should be a rotation matrix with the current customs' );
  } );

  /* eslint-enable */
})();
