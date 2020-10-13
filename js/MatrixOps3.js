// Copyright 2015-2020, University of Colorado Boulder

/**
 * Fast 3x3 matrix computations at the lower level, including an SVD implementation that is fully stable.
 * Overall, it uses a heavily mutable style, passing in the object where the result(s) will be stored.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import dot from './dot.js';

/*
 * Matrices are stored as flat typed arrays with row-major indices. For example, for a 3x3:
 * [0] [1] [2]
 * [3] [4] [5]
 * [6] [7] [8]
 *
 * NOTE: We assume the typed arrays are AT LEAST as long as necessary (but could be longer). This allows us to use
 * an array as big as the largest one we'll need.
 */

// constants
const SQRT_HALF = Math.sqrt( 0.5 );

const MatrixOps3 = {
  // use typed arrays if possible
  Array: dot.FastArray,

  /*---------------------------------------------------------------------------*
   * 3x3 matrix math
   *----------------------------------------------------------------------------*/

  /*
   * From 0-indexed row and column indices, returns the index into the flat array
   *
   * @param {number} row
   * @param {number} col
   */
  index3( row, col ) {
    assert && assert( row >= 0 && row < 3 );
    assert && assert( col >= 0 && col < 3 );
    return 3 * row + col;
  },

  /*
   * Copies one matrix into another
   *
   * @param {FastMath.Array} matrix - [input] 3x3 Matrix
   * @param {FastMath.Array} result - [output] 3x3 Matrix
   */
  set3( matrix, result ) {
    assert && assert( matrix.length >= 9 );
    assert && assert( result.length >= 9 );
    result[ 0 ] = matrix[ 0 ];
    result[ 1 ] = matrix[ 1 ];
    result[ 2 ] = matrix[ 2 ];
    result[ 3 ] = matrix[ 3 ];
    result[ 4 ] = matrix[ 4 ];
    result[ 5 ] = matrix[ 5 ];
    result[ 6 ] = matrix[ 6 ];
    result[ 7 ] = matrix[ 7 ];
    result[ 8 ] = matrix[ 8 ];
  },

  /*
   * Writes the transpose of the input matrix into the result matrix (in-place modification is OK)
   *
   * @param {FastMath.Array} matrix - [input] 3x3 Matrix
   * @param {FastMath.Array} result - [output] 3x3 Matrix
   */
  transpose3( matrix, result ) {
    assert && assert( matrix.length >= 9 );
    assert && assert( result.length >= 9 );
    const m1 = matrix[ 3 ];
    const m2 = matrix[ 6 ];
    const m3 = matrix[ 1 ];
    const m5 = matrix[ 7 ];
    const m6 = matrix[ 2 ];
    const m7 = matrix[ 5 ];
    result[ 0 ] = matrix[ 0 ];
    result[ 1 ] = m1;
    result[ 2 ] = m2;
    result[ 3 ] = m3;
    result[ 4 ] = matrix[ 4 ];
    result[ 5 ] = m5;
    result[ 6 ] = m6;
    result[ 7 ] = m7;
    result[ 8 ] = matrix[ 8 ];
  },

  /*
   * The determinant of a 3x3 matrix
   *
   * @param {FastMath.Array} matrix - [input] 3x3 Matrix
   * @returns {number} - The determinant. 0 indicates a singular (non-invertible) matrix.
   */
  det3( matrix ) {
    assert && assert( matrix.length >= 9 );
    return matrix[ 0 ] * matrix[ 4 ] * matrix[ 8 ] + matrix[ 1 ] * matrix[ 5 ] * matrix[ 6 ] +
           matrix[ 2 ] * matrix[ 3 ] * matrix[ 7 ] - matrix[ 2 ] * matrix[ 4 ] * matrix[ 6 ] -
           matrix[ 1 ] * matrix[ 3 ] * matrix[ 8 ] - matrix[ 0 ] * matrix[ 5 ] * matrix[ 7 ];
  },

  /*
   * Writes the matrix multiplication ( left * right ) into result. (in-place modification is OK)
   *
   * @param {FastMath.Array} left - [input] 3x3 Matrix
   * @param {FastMath.Array} right - [input] 3x3 Matrix
   * @param {FastMath.Array} result - [output] 3x3 Matrix
   */
  mult3( left, right, result ) {
    assert && assert( left.length >= 9 );
    assert && assert( right.length >= 9 );
    assert && assert( result.length >= 9 );
    const m0 = left[ 0 ] * right[ 0 ] + left[ 1 ] * right[ 3 ] + left[ 2 ] * right[ 6 ];
    const m1 = left[ 0 ] * right[ 1 ] + left[ 1 ] * right[ 4 ] + left[ 2 ] * right[ 7 ];
    const m2 = left[ 0 ] * right[ 2 ] + left[ 1 ] * right[ 5 ] + left[ 2 ] * right[ 8 ];
    const m3 = left[ 3 ] * right[ 0 ] + left[ 4 ] * right[ 3 ] + left[ 5 ] * right[ 6 ];
    const m4 = left[ 3 ] * right[ 1 ] + left[ 4 ] * right[ 4 ] + left[ 5 ] * right[ 7 ];
    const m5 = left[ 3 ] * right[ 2 ] + left[ 4 ] * right[ 5 ] + left[ 5 ] * right[ 8 ];
    const m6 = left[ 6 ] * right[ 0 ] + left[ 7 ] * right[ 3 ] + left[ 8 ] * right[ 6 ];
    const m7 = left[ 6 ] * right[ 1 ] + left[ 7 ] * right[ 4 ] + left[ 8 ] * right[ 7 ];
    const m8 = left[ 6 ] * right[ 2 ] + left[ 7 ] * right[ 5 ] + left[ 8 ] * right[ 8 ];
    result[ 0 ] = m0;
    result[ 1 ] = m1;
    result[ 2 ] = m2;
    result[ 3 ] = m3;
    result[ 4 ] = m4;
    result[ 5 ] = m5;
    result[ 6 ] = m6;
    result[ 7 ] = m7;
    result[ 8 ] = m8;
  },

  /*
   * Writes the matrix multiplication ( transpose( left ) * right ) into result. (in-place modification is OK)
   *
   * @param {FastMath.Array} left - [input] 3x3 Matrix
   * @param {FastMath.Array} right - [input] 3x3 Matrix
   * @param {FastMath.Array} result - [output] 3x3 Matrix
   */
  mult3LeftTranspose( left, right, result ) {
    assert && assert( left.length >= 9 );
    assert && assert( right.length >= 9 );
    assert && assert( result.length >= 9 );
    const m0 = left[ 0 ] * right[ 0 ] + left[ 3 ] * right[ 3 ] + left[ 6 ] * right[ 6 ];
    const m1 = left[ 0 ] * right[ 1 ] + left[ 3 ] * right[ 4 ] + left[ 6 ] * right[ 7 ];
    const m2 = left[ 0 ] * right[ 2 ] + left[ 3 ] * right[ 5 ] + left[ 6 ] * right[ 8 ];
    const m3 = left[ 1 ] * right[ 0 ] + left[ 4 ] * right[ 3 ] + left[ 7 ] * right[ 6 ];
    const m4 = left[ 1 ] * right[ 1 ] + left[ 4 ] * right[ 4 ] + left[ 7 ] * right[ 7 ];
    const m5 = left[ 1 ] * right[ 2 ] + left[ 4 ] * right[ 5 ] + left[ 7 ] * right[ 8 ];
    const m6 = left[ 2 ] * right[ 0 ] + left[ 5 ] * right[ 3 ] + left[ 8 ] * right[ 6 ];
    const m7 = left[ 2 ] * right[ 1 ] + left[ 5 ] * right[ 4 ] + left[ 8 ] * right[ 7 ];
    const m8 = left[ 2 ] * right[ 2 ] + left[ 5 ] * right[ 5 ] + left[ 8 ] * right[ 8 ];
    result[ 0 ] = m0;
    result[ 1 ] = m1;
    result[ 2 ] = m2;
    result[ 3 ] = m3;
    result[ 4 ] = m4;
    result[ 5 ] = m5;
    result[ 6 ] = m6;
    result[ 7 ] = m7;
    result[ 8 ] = m8;
  },

  /*
   * Writes the matrix multiplication ( left * transpose( right ) ) into result. (in-place modification is OK)
   *
   * @param {FastMath.Array} left - [input] 3x3 Matrix
   * @param {FastMath.Array} right - [input] 3x3 Matrix
   * @param {FastMath.Array} result - [output] 3x3 Matrix
   */
  mult3RightTranspose( left, right, result ) {
    assert && assert( left.length >= 9 );
    assert && assert( right.length >= 9 );
    assert && assert( result.length >= 9 );
    const m0 = left[ 0 ] * right[ 0 ] + left[ 1 ] * right[ 1 ] + left[ 2 ] * right[ 2 ];
    const m1 = left[ 0 ] * right[ 3 ] + left[ 1 ] * right[ 4 ] + left[ 2 ] * right[ 5 ];
    const m2 = left[ 0 ] * right[ 6 ] + left[ 1 ] * right[ 7 ] + left[ 2 ] * right[ 8 ];
    const m3 = left[ 3 ] * right[ 0 ] + left[ 4 ] * right[ 1 ] + left[ 5 ] * right[ 2 ];
    const m4 = left[ 3 ] * right[ 3 ] + left[ 4 ] * right[ 4 ] + left[ 5 ] * right[ 5 ];
    const m5 = left[ 3 ] * right[ 6 ] + left[ 4 ] * right[ 7 ] + left[ 5 ] * right[ 8 ];
    const m6 = left[ 6 ] * right[ 0 ] + left[ 7 ] * right[ 1 ] + left[ 8 ] * right[ 2 ];
    const m7 = left[ 6 ] * right[ 3 ] + left[ 7 ] * right[ 4 ] + left[ 8 ] * right[ 5 ];
    const m8 = left[ 6 ] * right[ 6 ] + left[ 7 ] * right[ 7 ] + left[ 8 ] * right[ 8 ];
    result[ 0 ] = m0;
    result[ 1 ] = m1;
    result[ 2 ] = m2;
    result[ 3 ] = m3;
    result[ 4 ] = m4;
    result[ 5 ] = m5;
    result[ 6 ] = m6;
    result[ 7 ] = m7;
    result[ 8 ] = m8;
  },

  /*
   * Writes the matrix multiplication ( transpose( left ) * transpose( right ) ) into result.
   * (in-place modification is OK)
   * NOTE: This is equivalent to transpose( right * left ).
   *
   * @param {FastMath.Array} left - [input] 3x3 Matrix
   * @param {FastMath.Array} right - [input] 3x3 Matrix
   * @param {FastMath.Array} result - [output] 3x3 Matrix
   */
  mult3BothTranspose( left, right, result ) {
    assert && assert( left.length >= 9 );
    assert && assert( right.length >= 9 );
    assert && assert( result.length >= 9 );
    const m0 = left[ 0 ] * right[ 0 ] + left[ 3 ] * right[ 1 ] + left[ 6 ] * right[ 2 ];
    const m1 = left[ 0 ] * right[ 3 ] + left[ 3 ] * right[ 4 ] + left[ 6 ] * right[ 5 ];
    const m2 = left[ 0 ] * right[ 6 ] + left[ 3 ] * right[ 7 ] + left[ 6 ] * right[ 8 ];
    const m3 = left[ 1 ] * right[ 0 ] + left[ 4 ] * right[ 1 ] + left[ 7 ] * right[ 2 ];
    const m4 = left[ 1 ] * right[ 3 ] + left[ 4 ] * right[ 4 ] + left[ 7 ] * right[ 5 ];
    const m5 = left[ 1 ] * right[ 6 ] + left[ 4 ] * right[ 7 ] + left[ 7 ] * right[ 8 ];
    const m6 = left[ 2 ] * right[ 0 ] + left[ 5 ] * right[ 1 ] + left[ 8 ] * right[ 2 ];
    const m7 = left[ 2 ] * right[ 3 ] + left[ 5 ] * right[ 4 ] + left[ 8 ] * right[ 5 ];
    const m8 = left[ 2 ] * right[ 6 ] + left[ 5 ] * right[ 7 ] + left[ 8 ] * right[ 8 ];
    result[ 0 ] = m0;
    result[ 1 ] = m1;
    result[ 2 ] = m2;
    result[ 3 ] = m3;
    result[ 4 ] = m4;
    result[ 5 ] = m5;
    result[ 6 ] = m6;
    result[ 7 ] = m7;
    result[ 8 ] = m8;
  },

  /*
   * Writes the product ( matrix * vector ) into result. (in-place modification is OK)
   *
   * @param {FastMath.Array} matrix - [input] 3x3 Matrix
   * @param {Vector3} vector - [input]
   * @param {Vector3} result - [output]
   */
  mult3Vector3( matrix, vector, result ) {
    assert && assert( matrix.length >= 9 );
    const x = matrix[ 0 ] * vector.x + matrix[ 1 ] * vector.y + matrix[ 2 ] * vector.z;
    const y = matrix[ 3 ] * vector.x + matrix[ 4 ] * vector.y + matrix[ 5 ] * vector.z;
    const z = matrix[ 6 ] * vector.x + matrix[ 7 ] * vector.y + matrix[ 8 ] * vector.z;
    result.x = x;
    result.y = y;
    result.z = z;
  },

  /*
   * Swaps two columns in a matrix, negating one of them to maintain the sign of the determinant.
   *
   * @param {FastMath.Array} matrix - [input] 3x3 Matrix
   * @param {number} idx0 - In the range [0,2]
   * @param {number} idx1 - In the range [0,2]
   */
  swapNegateColumn( matrix, idx0, idx1 ) {
    assert && assert( matrix.length >= 9 );
    const tmp0 = matrix[ idx0 ];
    const tmp1 = matrix[ idx0 + 3 ];
    const tmp2 = matrix[ idx0 + 6 ];

    matrix[ idx0 ] = matrix[ idx1 ];
    matrix[ idx0 + 3 ] = matrix[ idx1 + 3 ];
    matrix[ idx0 + 6 ] = matrix[ idx1 + 6 ];

    matrix[ idx1 ] = -tmp0;
    matrix[ idx1 + 3 ] = -tmp1;
    matrix[ idx1 + 6 ] = -tmp2;
  },

  /*
   * Sets the result matrix to the identity.
   *
   * @param {FastMath.Array} result - [output] 3x3 Matrix
   */
  setIdentity3( result ) {
    result[ 0 ] = result[ 4 ] = result[ 8 ] = 1; // diagonal
    result[ 1 ] = result[ 2 ] = result[ 3 ] = result[ 5 ] = result[ 6 ] = result[ 7 ] = 0; // non-diagonal
  },

  /*
   * Sets the result matrix to the Givens rotation (performs a rotation between two components). Instead of an angle,
   * the 'cos' and 'sin' values are passed in directly since we skip the trigonometry almost everywhere we can.
   *
   * See http://en.wikipedia.org/wiki/Givens_rotation (note that we use the other sign convention for the sin)
   *
   * @param {FastMath.Array} result - [output] 3x3 Matrix
   * @param {number} cos - [input] The cosine of the Givens rotation angle
   * @param {number} sin - [input] The sine of the Givens rotation angle
   * @param {number} idx0 - [input] The smaller row/column index
   * @param {number} idx1 - [input] The larger row/column index
   */
  setGivens3( result, cos, sin, idx0, idx1 ) {
    assert && assert( idx0 < idx1 );
    this.setIdentity3( result );
    result[ this.index3( idx0, idx0 ) ] = cos;
    result[ this.index3( idx1, idx1 ) ] = cos;
    result[ this.index3( idx0, idx1 ) ] = sin;
    result[ this.index3( idx1, idx0 ) ] = -sin;
  },

  /*
   * Efficiently pre-multiples the matrix in-place by the specified Givens rotation (matrix <= rotation * matrix).
   * Equivalent to using setGivens3 and mult3.
   *
   * @param {FastMath.Array} result - [input AND output] 3x3 Matrix
   * @param {number} cos - [input] The cosine of the Givens rotation angle
   * @param {number} sin - [input] The sine of the Givens rotation angle
   * @param {number} idx0 - [input] The smaller row/column index
   * @param {number} idx1 - [input] The larger row/column index
   */
  preMult3Givens( matrix, cos, sin, idx0, idx1 ) {
    const baseA = idx0 * 3;
    const baseB = idx1 * 3;
    // lexicographically in column-major order for "affine" section
    const a = cos * matrix[ baseA + 0 ] + sin * matrix[ baseB + 0 ];
    const b = cos * matrix[ baseB + 0 ] - sin * matrix[ baseA + 0 ];
    const c = cos * matrix[ baseA + 1 ] + sin * matrix[ baseB + 1 ];
    const d = cos * matrix[ baseB + 1 ] - sin * matrix[ baseA + 1 ];
    const e = cos * matrix[ baseA + 2 ] + sin * matrix[ baseB + 2 ];
    const f = cos * matrix[ baseB + 2 ] - sin * matrix[ baseA + 2 ];
    matrix[ baseA + 0 ] = a;
    matrix[ baseB + 0 ] = b;
    matrix[ baseA + 1 ] = c;
    matrix[ baseB + 1 ] = d;
    matrix[ baseA + 2 ] = e;
    matrix[ baseB + 2 ] = f;
  },

  /*
   * Efficiently post-multiples the matrix in-place by the transpose of the specified Givens rotation
   * (matrix <= matrix * rotation^T).
   * Equivalent to using setGivens3 and mult3RightTranspose.
   *
   * @param {FastMath.Array} result - [input AND output] 3x3 Matrix
   * @param {number} cos - [input] The cosine of the Givens rotation angle
   * @param {number} sin - [input] The sine of the Givens rotation angle
   * @param {number} idx0 - [input] The smaller row/column index
   * @param {number} idx1 - [input] The larger row/column index
   */
  postMult3Givens( matrix, cos, sin, idx0, idx1 ) {
    // lexicographically in row-major order for the "transposed affine" section
    const a = cos * matrix[ idx0 + 0 ] + sin * matrix[ idx1 + 0 ];
    const b = cos * matrix[ idx1 + 0 ] - sin * matrix[ idx0 + 0 ];
    const c = cos * matrix[ idx0 + 3 ] + sin * matrix[ idx1 + 3 ];
    const d = cos * matrix[ idx1 + 3 ] - sin * matrix[ idx0 + 3 ];
    const e = cos * matrix[ idx0 + 6 ] + sin * matrix[ idx1 + 6 ];
    const f = cos * matrix[ idx1 + 6 ] - sin * matrix[ idx0 + 6 ];
    matrix[ idx0 + 0 ] = a;
    matrix[ idx1 + 0 ] = b;
    matrix[ idx0 + 3 ] = c;
    matrix[ idx1 + 3 ] = d;
    matrix[ idx0 + 6 ] = e;
    matrix[ idx1 + 6 ] = f;
  },

  /*
   * Zeros out the [idx0,idx1] and [idx1,idx0] entries of the matrix mS by applying a Givens rotation as part of the
   * Jacobi iteration. In addition, the Givens rotation is prepended to mQ so we can track the accumulated rotations
   * applied (this is how we get V in the SVD).
   *
   * @param {FastMath.Array} mS - [input AND output] Symmetric 3x3 Matrix
   * @param {FastMath.Array} mQ - [input AND output] Unitary 3x3 Matrix
   * @param {number} idx0 - [input] The smaller row/column index
   * @param {number} idx1 - [input] The larger row/column index
   */
  applyJacobi3( mS, mQ, idx0, idx1 ) {
    // submatrix entries for idx0,idx1
    const a11 = mS[ 3 * idx0 + idx0 ];
    const a12 = mS[ 3 * idx0 + idx1 ]; // we assume mS is symmetric, so we don't need a21
    const a22 = mS[ 3 * idx1 + idx1 ];

    // Approximate givens angle, see https://graphics.cs.wisc.edu/Papers/2011/MSTTS11/SVD_TR1690.pdf (section 2.3)
    // "Computing the Singular Value Decomposition of 3x3 matrices with minimal branching and elementary floating point operations"
    // Aleka McAdams, Andrew Selle, Rasmus Tamstorf, Joseph Teran, Eftychios Sifakis
    const lhs = a12 * a12;
    let rhs = a11 - a22;
    rhs = rhs * rhs;
    const useAngle = lhs < rhs;
    const w = 1 / Math.sqrt( lhs + rhs );
    // NOTE: exact Givens angle is 0.5 * Math.atan( 2 * a12 / ( a11 - a22 ) ), but clamped to withing +-Math.PI / 4
    const cos = useAngle ? ( w * ( a11 - a22 ) ) : SQRT_HALF;
    const sin = useAngle ? ( w * a12 ) : SQRT_HALF;

    // S' = Q * S * transpose( Q )
    this.preMult3Givens( mS, cos, sin, idx0, idx1 );
    this.postMult3Givens( mS, cos, sin, idx0, idx1 );

    // Q' = Q * mQ
    this.preMult3Givens( mQ, cos, sin, idx0, idx1 );
  },

  /*
   * The Jacobi method, which in turn zeros out all the non-diagonal entries repeatedly until mS converges into
   * a diagonal matrix. We track the applied Givens rotations in mQ, so that when given mS and mQ=identity, we will
   * maintain the value mQ * mS * mQ^T
   *
   * @param {FastMath.Array} mS - [input AND output] Symmetric 3x3 Matrix
   * @param {FastMath.Array} mQ - [input AND output] Unitary 3x3 Matrix
   * @param {number} n - [input] The number of iterations to run
   */
  jacobiIteration3( mS, mQ, n ) {
    // for 3x3, we eliminate non-diagonal entries iteratively
    for ( let i = 0; i < n; i++ ) {
      this.applyJacobi3( mS, mQ, 0, 1 );
      this.applyJacobi3( mS, mQ, 0, 2 );
      this.applyJacobi3( mS, mQ, 1, 2 );
    }
  },

  /*
   * One step in computing the QR decomposition. Zeros out the (row,col) entry in 'r', while maintaining the
   * value of (q * r). We will end up with an orthogonal Q and upper-triangular R (or in the SVD case,
   * R will be diagonal)
   *
   * @param {FastMath.Array} q - [input AND ouput] 3x3 Matrix
   * @param {FastMath.Array} r - [input AND ouput] 3x3 Matrix
   * @param {number} row - [input] The row of the entry to zero out
   * @param {number} col - [input] The column of the entry to zero out
   */
  qrAnnihilate3( q, r, row, col ) {
    assert && assert( row > col ); // only in the lower-triangular area

    const epsilon = 0.0000000001;
    let cos;
    let sin;

    const diagonalValue = r[ this.index3( col, col ) ];
    const targetValue = r[ this.index3( row, col ) ];
    const diagonalSquared = diagonalValue * diagonalValue;
    const targetSquared = targetValue * targetValue;

    // handle the case where both (row,col) and (col,col) are very small (would cause instabilities)
    if ( diagonalSquared + targetSquared < epsilon ) {
      cos = diagonalValue > 0 ? 1 : 0;
      sin = 0;
    }
    else {
      const rsqr = 1 / Math.sqrt( diagonalSquared + targetSquared );
      cos = rsqr * diagonalValue;
      sin = rsqr * targetValue;
    }

    this.preMult3Givens( r, cos, sin, col, row );
    this.postMult3Givens( q, cos, sin, col, row );
  },

  /*
   * 3x3 Singular Value Decomposition, handling singular cases.
   * Based on https://graphics.cs.wisc.edu/Papers/2011/MSTTS11/SVD_TR1690.pdf
   * "Computing the Singular Value Decomposition of 3x3 matrices with minimal branching and elementary floating point operations"
   * Aleka McAdams, Andrew Selle, Rasmus Tamstorf, Joseph Teran, Eftychios Sifakis
   *
   * @param {FastMath.Array} a - [input] 3x3 Matrix that we want the SVD of.
   * @param {number} jacobiIterationCount - [input] How many Jacobi iterations to run (larger is more accurate to a point)
   * @param {FastMath.Array} resultU - [output] 3x3 U matrix (unitary)
   * @param {FastMath.Array} resultSigma - [output] 3x3 diagonal matrix of singular values
   * @param {FastMath.Array} resultV - [output] 3x3 V matrix (unitary)
   */
  svd3( a, jacobiIterationCount, resultU, resultSigma, resultV ) {
    // shorthands
    const q = resultU;
    const v = resultV;
    const r = resultSigma;

    // for now, use 'r' as our S == transpose( A ) * A, so we don't have to use scratch matrices
    this.mult3LeftTranspose( a, a, r );
    // we'll accumulate into 'q' == transpose( V ) during the Jacobi iteration
    this.setIdentity3( q );

    // Jacobi iteration turns Q into V^T and R into Sigma^2 (we'll ditch R since the QR decomposition will be beter)
    this.jacobiIteration3( r, q, jacobiIterationCount );
    // final determination of V
    this.transpose3( q, v ); // done with this 'q' until we reuse the scratch matrix later below for the QR decomposition

    this.mult3( a, v, r ); // R = AV

    // Sort columns of R and V based on singular values (needed for the QR step, and useful anyways).
    // Their product will remain unchanged.
    let mag0 = r[ 0 ] * r[ 0 ] + r[ 3 ] * r[ 3 ] + r[ 6 ] * r[ 6 ]; // column vector magnitudes
    let mag1 = r[ 1 ] * r[ 1 ] + r[ 4 ] * r[ 4 ] + r[ 7 ] * r[ 7 ];
    let mag2 = r[ 2 ] * r[ 2 ] + r[ 5 ] * r[ 5 ] + r[ 8 ] * r[ 8 ];
    let tmpMag;
    if ( mag0 < mag1 ) {
      // swap magnitudes
      tmpMag = mag0;
      mag0 = mag1;
      mag1 = tmpMag;
      this.swapNegateColumn( r, 0, 1 );
      this.swapNegateColumn( v, 0, 1 );
    }
    if ( mag0 < mag2 ) {
      // swap magnitudes
      tmpMag = mag0;
      mag0 = mag2;
      mag2 = tmpMag;
      this.swapNegateColumn( r, 0, 2 );
      this.swapNegateColumn( v, 0, 2 );
    }
    if ( mag1 < mag2 ) {
      this.swapNegateColumn( r, 1, 2 );
      this.swapNegateColumn( v, 1, 2 );
    }

    // QR decomposition
    this.setIdentity3( q ); // reusing Q now for the QR
    // Zero out all three strictly lower-triangular values. Should turn the matrix diagonal
    this.qrAnnihilate3( q, r, 1, 0 );
    this.qrAnnihilate3( q, r, 2, 0 );
    this.qrAnnihilate3( q, r, 2, 1 );

    // checks for a singular U value, we'll add in the needed 1 entries to make sure our U is orthogonal
    const bigEpsilon = 0.001; // they really should be around 1
    if ( q[ 0 ] * q[ 0 ] + q[ 1 ] * q[ 1 ] + q[ 2 ] * q[ 2 ] < bigEpsilon ) {
      q[ 0 ] = 1;
    }
    if ( q[ 3 ] * q[ 3 ] + q[ 4 ] * q[ 4 ] + q[ 5 ] * q[ 5 ] < bigEpsilon ) {
      q[ 4 ] = 1;
    }
    if ( q[ 6 ] * q[ 6 ] + q[ 7 ] * q[ 7 ] + q[ 8 ] * q[ 8 ] < bigEpsilon ) {
      q[ 8 ] = 1;
    }
  },

  /*---------------------------------------------------------------------------*
   * 3xN matrix math
   *----------------------------------------------------------------------------*/

  /*
   * Sets the 3xN result matrix to be made out of column vectors
   *
   * @param {Array.<Vector3>} columnVectors - [input] List of 3D column vectors
   * @param {FastMath.Array} result - [output] 3xN Matrix, where N is the number of column vectors
   */
  setVectors3( columnVectors, result ) {
    const m = 3;
    const n = columnVectors.length;

    assert && assert( result.length >= m * n, 'Array length check' );

    for ( let i = 0; i < n; i++ ) {
      const vector = columnVectors[ i ];
      result[ i ] = vector.x;
      result[ i + n ] = vector.y;
      result[ i + 2 * n ] = vector.z;
    }
  },

  /*
   * Retrieves column vector values from a 3xN matrix.
   *
   * @param {number} m - [input] The number of rows in the matrix (sanity check, should always be 3)
   * @param {number} n - [input] The number of columns in the matrix
   * @param {FastMath.Array} matrix - [input] 3xN Matrix
   * @param {number} columnIndex - [input] 3xN Matrix
   * @param {Vector3} result - [output] Vector to store the x,y,z
   */
  getColumnVector3( m, n, matrix, columnIndex, result ) {
    assert && assert( m === 3 && columnIndex < n );

    result.x = matrix[ columnIndex ];
    result.y = matrix[ columnIndex + n ];
    result.z = matrix[ columnIndex + 2 * n ];
  },

  /*---------------------------------------------------------------------------*
   * Arbitrary dimension matrix math
   *----------------------------------------------------------------------------*/

  /*
   * From 0-indexed row and column indices, returns the index into the flat array
   *
   * @param {number} m - Number of rows in the matrix
   * @param {number} n - Number of columns in the matrix
   * @param {number} row
   * @param {number} col
   */
  index( m, n, row, col ) {
    return n * row + col;
  },

  /*
   * Writes the transpose of the matrix into the result.
   *
   * @param {number} m - Number of rows in the original matrix
   * @param {number} n - Number of columns in the original matrix
   * @param {FastMath.Array} matrix - [input] MxN Matrix
   * @param {FastMath.Array} result - [output] NxM Matrix
   */
  transpose( m, n, matrix, result ) {
    assert && assert( matrix.length >= m * n );
    assert && assert( result.length >= n * m );
    assert && assert( matrix !== result, 'In-place modification not implemented yet' );

    for ( let row = 0; row < m; row++ ) {
      for ( let col = 0; col < n; col++ ) {
        result[ m * col + row ] = matrix[ n * row + col ];
      }
    }
  },

  /*
   * Writes the matrix multiplication of ( left * right ) into result
   *
   * @param {number} m - Number of rows in the left matrix
   * @param {number} n - Number of columns in the left matrix, number of rows in the right matrix
   * @param {number} p - Number of columns in the right matrix
   * @param {FastMath.Array} left - [input] MxN Matrix
   * @param {FastMath.Array} right - [input] NxP Matrix
   * @param {FastMath.Array} result - [output] MxP Matrix
   */
  mult( m, n, p, left, right, result ) {
    assert && assert( left.length >= m * n );
    assert && assert( right.length >= n * p );
    assert && assert( result.length >= m * p );
    assert && assert( left !== result && right !== result, 'In-place modification not implemented yet' );

    for ( let row = 0; row < m; row++ ) {
      for ( let col = 0; col < p; col++ ) {
        let x = 0;
        for ( let k = 0; k < n; k++ ) {
          x += left[ this.index( m, n, row, k ) ] * right[ this.index( n, p, k, col ) ];
        }
        result[ this.index( m, p, row, col ) ] = x;
      }
    }
  },

  /*
   * Writes the matrix multiplication of ( left * transpose( right ) ) into result
   *
   * @param {number} m - Number of rows in the left matrix
   * @param {number} n - Number of columns in the left matrix, number of columns in the right matrix
   * @param {number} p - Number of rows in the right matrix
   * @param {FastMath.Array} left - [input] MxN Matrix
   * @param {FastMath.Array} right - [input] PxN Matrix
   * @param {FastMath.Array} result - [output] MxP Matrix
   */
  multRightTranspose( m, n, p, left, right, result ) {
    assert && assert( left.length >= m * n );
    assert && assert( right.length >= n * p );
    assert && assert( result.length >= m * p );
    assert && assert( left !== result && right !== result, 'In-place modification not implemented yet' );

    for ( let row = 0; row < m; row++ ) {
      for ( let col = 0; col < p; col++ ) {
        let x = 0;
        for ( let k = 0; k < n; k++ ) {
          x += left[ this.index( m, n, row, k ) ] * right[ this.index( p, n, col, k ) ];
        }
        result[ this.index( m, p, row, col ) ] = x;
      }
    }
  },

  /*
   * Writes the matrix into the result, permuting the columns.
   *
   * @param {number} m - Number of rows in the original matrix
   * @param {number} n - Number of columns in the original matrix
   * @param {FastMath.Array} matrix - [input] MxN Matrix
   * @param {Permutation} permutation - [input] Permutation
   * @param {FastMath.Array} result - [output] MxN Matrix
   */
  permuteColumns( m, n, matrix, permutation, result ) {
    assert && assert( matrix !== result, 'In-place modification not implemented yet' );
    assert && assert( matrix.length >= m * n );
    assert && assert( result.length >= m * n );

    for ( let col = 0; col < n; col++ ) {
      const permutedColumnIndex = permutation.indices[ col ];
      for ( let row = 0; row < m; row++ ) {
        result[ this.index( m, n, row, col ) ] = matrix[ this.index( m, n, row, permutedColumnIndex ) ];
      }
    }
  }
};
dot.register( 'MatrixOps3', MatrixOps3 );

export default MatrixOps3;