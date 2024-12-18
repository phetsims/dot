// Copyright 2013-2024, University of Colorado Boulder

/**
 * Arbitrary-dimensional matrix, based on Jama (http://math.nist.gov/javanumerics/jama/)
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import isArray from '../../phet-core/js/isArray.js';
import dot from './dot.js';
import Vector2 from './Vector2.js';
import Vector3 from './Vector3.js';
import Vector4 from './Vector4.js';

const ArrayType = window.Float64Array || Array;

export default class Matrix {
  /**
   * @param {number} m - number of rows
   * @param {number} n - number of columns
   * @param {number[] | number} [filler]
   * @param {boolean} [fast]
   */
  constructor( m, n, filler, fast ) {
    // @public {number}
    this.m = m;
    this.n = n;

    const size = m * n;
    // @public {number}
    this.size = size;
    let i;

    if ( fast ) {
      // @public {Array.<number>|Float64Array}
      this.entries = filler;
    }
    else {
      if ( !filler ) {
        filler = 0;
      }

      // entries stored in row-major format
      this.entries = new ArrayType( size );

      if ( isArray( filler ) ) {
        assert && assert( filler.length === size );

        for ( i = 0; i < size; i++ ) {
          this.entries[ i ] = filler[ i ];
        }
      }
      else {
        for ( i = 0; i < size; i++ ) {
          this.entries[ i ] = filler;
        }
      }
    }
  }

  /**
   * @public
   *
   * @returns {Matrix}
   */
  copy() {
    const result = new Matrix( this.m, this.n );
    for ( let i = 0; i < this.size; i++ ) {
      result.entries[ i ] = this.entries[ i ];
    }
    return result;
  }

  /**
   * @public
   *
   * @returns {Array.<number>}
   */
  getArray() {
    return this.entries;
  }

  /**
   * @public
   *
   * @returns {Array.<number>}
   */
  getArrayCopy() {
    return new ArrayType( this.entries );
  }

  /**
   * @public
   *
   * @returns {number}
   */
  getRowDimension() {
    return this.m;
  }

  /**
   * @public
   *
   * @returns {number}
   */
  getColumnDimension() {
    return this.n;
  }

  /**
   * TODO: inline this places if we aren't using an inlining compiler! (check performance) https://github.com/phetsims/dot/issues/96
   * @public
   *
   * @param {number} i
   * @param {number} j
   * @returns {number}
   */
  index( i, j ) {
    return i * this.n + j;
  }

  /**
   * Get the matrix element (i,j) with the convention that row and column indices start at zero
   * @public
   *
   * @param {number} i - row index
   * @param {number} j - column index
   * @returns {number}
   */
  get( i, j ) {
    return this.entries[ this.index( i, j ) ];
  }

  /**
   * Set the matrix element (i,j) to a value s with the convention that row and column indices start at zero
   * @public
   *
   * @param {number} i - row index
   * @param {number} j - column index
   * @param {number} s - value of the matrix element
   */
  set( i, j, s ) {
    this.entries[ this.index( i, j ) ] = s;
  }

  /**
   * @public
   *
   * @param {number} i0
   * @param {number} i1
   * @param {number} j0
   * @param {number} j1
   * @returns {Matrix}
   */
  getMatrix( i0, i1, j0, j1 ) {
    const result = new Matrix( i1 - i0 + 1, j1 - j0 + 1 );
    for ( let i = i0; i <= i1; i++ ) {
      for ( let j = j0; j <= j1; j++ ) {
        result.entries[ result.index( i - i0, j - j0 ) ] = this.entries[ this.index( i, j ) ];
      }
    }
    return result;
  }

  /**
   * @public
   *
   * @param {Array.<number>} r
   * @param {number} j0
   * @param {number} j1
   * @returns {Matrix}
   */
  getArrayRowMatrix( r, j0, j1 ) {
    const result = new Matrix( r.length, j1 - j0 + 1 );
    for ( let i = 0; i < r.length; i++ ) {
      for ( let j = j0; j <= j1; j++ ) {
        result.entries[ result.index( i, j - j0 ) ] = this.entries[ this.index( r[ i ], j ) ];
      }
    }
    return result;
  }

  /**
   * @public
   *
   * @param {Matrix} [result] - allow passing in a pre-constructed matrix
   * @returns {Matrix}
   */
  transpose( result ) {
    result = result || new Matrix( this.n, this.m );
    assert && assert( result.m === this.n );
    assert && assert( result.n === this.m );
    for ( let i = 0; i < this.m; i++ ) {
      for ( let j = 0; j < this.n; j++ ) {
        result.entries[ result.index( j, i ) ] = this.entries[ this.index( i, j ) ];
      }
    }
    return result;
  }

  /**
   * @public
   *
   * @returns {number}
   */
  norm1() {
    let f = 0;
    for ( let j = 0; j < this.n; j++ ) {
      let s = 0;
      for ( let i = 0; i < this.m; i++ ) {
        s += Math.abs( this.entries[ this.index( i, j ) ] );
      }
      f = Math.max( f, s );
    }
    return f;
  }

  /**
   * @public
   *
   * @returns {number}
   */
  norm2() {
    return ( new SingularValueDecomposition( this ).norm2() );
  }

  /**
   * @public
   *
   * @returns {number}
   */
  normInf() {
    let f = 0;
    for ( let i = 0; i < this.m; i++ ) {
      let s = 0;
      for ( let j = 0; j < this.n; j++ ) {
        s += Math.abs( this.entries[ this.index( i, j ) ] );
      }
      f = Math.max( f, s );
    }
    return f;
  }

  /**
   * @public
   *
   * @returns {number}
   */
  normF() {
    let f = 0;
    for ( let i = 0; i < this.m; i++ ) {
      for ( let j = 0; j < this.n; j++ ) {
        f = Matrix.hypot( f, this.entries[ this.index( i, j ) ] );
      }
    }
    return f;
  }

  /**
   * @public
   *
   * @returns {Matrix}
   */
  uminus() {
    const result = new Matrix( this.m, this.n );
    for ( let i = 0; i < this.m; i++ ) {
      for ( let j = 0; j < this.n; j++ ) {
        result.entries[ result.index( i, j ) ] = -this.entries[ this.index( i, j ) ];
      }
    }
    return result;
  }

  /**
   * @public
   *
   * @param {Matrix} matrix
   * @returns {Matrix}
   */
  plus( matrix ) {
    this.checkMatrixDimensions( matrix );
    const result = new Matrix( this.m, this.n );
    for ( let i = 0; i < this.m; i++ ) {
      for ( let j = 0; j < this.n; j++ ) {
        const index = result.index( i, j );
        result.entries[ index ] = this.entries[ index ] + matrix.entries[ index ];
      }
    }
    return result;
  }

  /**
   * @public
   *
   * @param {Matrix} matrix
   * @returns {Matrix}
   */
  plusEquals( matrix ) {
    this.checkMatrixDimensions( matrix );
    for ( let i = 0; i < this.m; i++ ) {
      for ( let j = 0; j < this.n; j++ ) {
        const index = this.index( i, j );
        this.entries[ index ] = this.entries[ index ] + matrix.entries[ index ];
      }
    }
    return this;
  }

  /**
   * A linear interpolation between this Matrix (ratio=0) and another Matrix (ratio=1).
   * @public
   *
   * @param {Matrix} matrix
   * @param {number} ratio - Not necessarily constrained in [0, 1]
   * @returns {Matrix}
   */
  blendEquals( matrix, ratio ) {
    this.checkMatrixDimensions( matrix );
    for ( let i = 0; i < this.m; i++ ) {
      for ( let j = 0; j < this.n; j++ ) {
        const index = this.index( i, j );
        const a = this.entries[ index ];
        const b = matrix.entries[ index ];
        this.entries[ index ] = a + ( b - a ) * ratio;
      }
    }
    return this;
  }

  /**
   * @public
   *
   * @param {Matrix} matrix
   * @returns {Matrix}
   */
  minus( matrix ) {
    this.checkMatrixDimensions( matrix );
    const result = new Matrix( this.m, this.n );
    for ( let i = 0; i < this.m; i++ ) {
      for ( let j = 0; j < this.n; j++ ) {
        const index = this.index( i, j );
        result.entries[ index ] = this.entries[ index ] - matrix.entries[ index ];
      }
    }
    return result;
  }

  /**
   * @public
   *
   * @param {Matrix} matrix
   * @returns {Matrix}
   */
  minusEquals( matrix ) {
    this.checkMatrixDimensions( matrix );
    for ( let i = 0; i < this.m; i++ ) {
      for ( let j = 0; j < this.n; j++ ) {
        const index = this.index( i, j );
        this.entries[ index ] = this.entries[ index ] - matrix.entries[ index ];
      }
    }
    return this;
  }

  /**
   * @public
   *
   * @param {Matrix} matrix
   * @returns {Matrix}
   */
  arrayTimes( matrix ) {
    this.checkMatrixDimensions( matrix );
    const result = new Matrix( this.m, this.n );
    for ( let i = 0; i < this.m; i++ ) {
      for ( let j = 0; j < this.n; j++ ) {
        const index = result.index( i, j );
        result.entries[ index ] = this.entries[ index ] * matrix.entries[ index ];
      }
    }
    return result;
  }

  /**
   * @public
   *
   * @param {Matrix} matrix
   * @returns {Matrix}
   */
  arrayTimesEquals( matrix ) {
    this.checkMatrixDimensions( matrix );
    for ( let i = 0; i < this.m; i++ ) {
      for ( let j = 0; j < this.n; j++ ) {
        const index = this.index( i, j );
        this.entries[ index ] = this.entries[ index ] * matrix.entries[ index ];
      }
    }
    return this;
  }

  /**
   * @public
   *
   * @param {Matrix} matrix
   * @returns {Matrix}
   */
  arrayRightDivide( matrix ) {
    this.checkMatrixDimensions( matrix );
    const result = new Matrix( this.m, this.n );
    for ( let i = 0; i < this.m; i++ ) {
      for ( let j = 0; j < this.n; j++ ) {
        const index = this.index( i, j );
        result.entries[ index ] = this.entries[ index ] / matrix.entries[ index ];
      }
    }
    return result;
  }

  /**
   * @public
   *
   * @param {Matrix} matrix
   * @returns {Matrix}
   */
  arrayRightDivideEquals( matrix ) {
    this.checkMatrixDimensions( matrix );
    for ( let i = 0; i < this.m; i++ ) {
      for ( let j = 0; j < this.n; j++ ) {
        const index = this.index( i, j );
        this.entries[ index ] = this.entries[ index ] / matrix.entries[ index ];
      }
    }
    return this;
  }

  /**
   * @public
   *
   * @param {Matrix} matrix
   * @returns {Matrix}
   */
  arrayLeftDivide( matrix ) {
    this.checkMatrixDimensions( matrix );
    const result = new Matrix( this.m, this.n );
    for ( let i = 0; i < this.m; i++ ) {
      for ( let j = 0; j < this.n; j++ ) {
        const index = this.index( i, j );
        result.entries[ index ] = matrix.entries[ index ] / this.entries[ index ];
      }
    }
    return result;
  }

  /**
   * @public
   *
   * @param {Matrix} matrix
   * @returns {Matrix}
   */
  arrayLeftDivideEquals( matrix ) {
    this.checkMatrixDimensions( matrix );
    for ( let i = 0; i < this.m; i++ ) {
      for ( let j = 0; j < this.n; j++ ) {
        const index = this.index( i, j );
        this.entries[ index ] = matrix.entries[ index ] / this.entries[ index ];
      }
    }
    return this;
  }

  /**
   * @public
   *
   * @param {Matrix|number} matrixOrScalar
   * @returns {Matrix}
   */
  times( matrixOrScalar ) {
    let result;
    let i;
    let j;
    let k;
    let s;
    let matrix;
    if ( matrixOrScalar.isMatrix ) {
      matrix = matrixOrScalar;
      if ( matrix.m !== this.n ) {
        throw new Error( 'Matrix inner dimensions must agree.' );
      }
      result = new Matrix( this.m, matrix.n );
      const matrixcolj = new ArrayType( this.n );
      for ( j = 0; j < matrix.n; j++ ) {
        for ( k = 0; k < this.n; k++ ) {
          matrixcolj[ k ] = matrix.entries[ matrix.index( k, j ) ];
        }
        for ( i = 0; i < this.m; i++ ) {
          s = 0;
          for ( k = 0; k < this.n; k++ ) {
            s += this.entries[ this.index( i, k ) ] * matrixcolj[ k ];
          }
          result.entries[ result.index( i, j ) ] = s;
        }
      }
      return result;
    }
    else {
      s = matrixOrScalar;
      result = new Matrix( this.m, this.n );
      for ( i = 0; i < this.m; i++ ) {
        for ( j = 0; j < this.n; j++ ) {
          result.entries[ result.index( i, j ) ] = s * this.entries[ this.index( i, j ) ];
        }
      }
      return result;
    }
  }

  /**
   * @public
   *
   * @param {number} s
   * @returns {Matrix}
   */
  timesEquals( s ) {
    for ( let i = 0; i < this.m; i++ ) {
      for ( let j = 0; j < this.n; j++ ) {
        const index = this.index( i, j );
        this.entries[ index ] = s * this.entries[ index ];
      }
    }
    return this;
  }

  /**
   * @public
   *
   * @param {Matrix} matrix
   * @returns {Matrix}
   */
  solve( matrix ) {
    return ( this.m === this.n ? ( new LUDecomposition( this ) ).solve( matrix ) :
             ( new QRDecomposition( this ) ).solve( matrix ) );
  }

  /**
   * @public
   *
   * @param {Matrix} matrix
   * @returns {Matrix}
   */
  solveTranspose( matrix ) {
    return this.transpose().solve( matrix.transpose() );
  }

  /**
   * @public
   *
   * @returns {Matrix}
   */
  inverse() {
    return this.solve( Matrix.identity( this.m, this.m ) );
  }

  /**
   * @public
   *
   * @returns {number}
   */
  det() {
    return new LUDecomposition( this ).det();
  }

  /**
   * @public
   *
   * @returns {number}
   */
  rank() {
    return new SingularValueDecomposition( this ).rank();
  }

  /**
   * @public
   *
   * @returns {number}
   */
  cond() {
    return new SingularValueDecomposition( this ).cond();
  }

  /**
   * @public
   *
   * @returns {number}
   */
  trace() {
    let t = 0;
    for ( let i = 0; i < Math.min( this.m, this.n ); i++ ) {
      t += this.entries[ this.index( i, i ) ];
    }
    return t;
  }

  /**
   * @public
   *
   * @param {Matrix} matrix
   */
  checkMatrixDimensions( matrix ) {
    if ( matrix.m !== this.m || matrix.n !== this.n ) {
      throw new Error( 'Matrix dimensions must agree.' );
    }
  }

  /**
   * Returns a string form of this object
   * @public
   *
   * @returns {string}
   */
  toString() {
    let result = '';
    result += `dim: ${this.getRowDimension()}x${this.getColumnDimension()}\n`;
    for ( let row = 0; row < this.getRowDimension(); row++ ) {
      for ( let col = 0; col < this.getColumnDimension(); col++ ) {
        result += `${this.get( row, col )} `;
      }
      result += '\n';
    }
    return result;
  }

  /**
   * Returns a vector that is contained in the specified column
   * @public
   *
   * @param {number} column
   * @returns {Vector2}
   */
  extractVector2( column ) {
    assert && assert( this.m === 2 ); // rows should match vector dimension
    return new Vector2( this.get( 0, column ), this.get( 1, column ) );
  }

  /**
   * Returns a vector that is contained in the specified column
   * @public
   *
   * @param {number} column
   * @returns {Vector3}
   */
  extractVector3( column ) {
    assert && assert( this.m === 3 ); // rows should match vector dimension
    return new Vector3( this.get( 0, column ), this.get( 1, column ), this.get( 2, column ) );
  }

  /**
   * Returns a vector that is contained in the specified column
   * @public
   *
   * @param {number} column
   * @returns {Vector4}
   */
  extractVector4( column ) {
    assert && assert( this.m === 4 ); // rows should match vector dimension
    return new Vector4( this.get( 0, column ), this.get( 1, column ), this.get( 2, column ), this.get( 3, column ) );
  }

  /**
   * Sets the current matrix to the values of the listed column vectors (Vector3).
   * @public
   *
   * @param {Array.<Vector3>} vectors
   * @returns {Matrix}
   */
  setVectors3( vectors ) {
    const m = 3;
    const n = vectors.length;

    assert && assert( this.m === m );
    assert && assert( this.n === n );

    for ( let i = 0; i < n; i++ ) {
      const vector = vectors[ i ];
      this.entries[ i ] = vector.x;
      this.entries[ i + n ] = vector.y;
      this.entries[ i + 2 * n ] = vector.z;
    }

    return this;
  }

  /**
   * sqrt(a^2 + b^2) without under/overflow.
   * @public
   *
   * @param {number} a
   * @param {number} b
   * @returns {number}
   */
  static hypot( a, b ) {
    let r;
    if ( Math.abs( a ) > Math.abs( b ) ) {
      r = b / a;
      r = Math.abs( a ) * Math.sqrt( 1 + r * r );
    }
    else if ( b !== 0 ) {
      r = a / b;
      r = Math.abs( b ) * Math.sqrt( 1 + r * r );
    }
    else {
      r = 0.0;
    }
    return r;
  }

  /**
   * Sets this matrix to the identity.
   * @public
   *
   * @param {number} m
   * @param {number} n
   * @returns {Matrix}
   */
  static identity( m, n ) {
    const result = new Matrix( m, n );
    for ( let i = 0; i < m; i++ ) {
      for ( let j = 0; j < n; j++ ) {
        result.entries[ result.index( i, j ) ] = ( i === j ? 1.0 : 0.0 );
      }
    }
    return result;
  }

  /**
   * Returns a square diagonal matrix, whose entries along the diagonal are specified by the passed-in array, and the
   * other entries are 0.
   * @public
   *
   * @param {Array.<number>} diagonalValues
   * @returns {Matrix}
   */
  static diagonalMatrix( diagonalValues ) {
    const n = diagonalValues.length;
    const result = new Matrix( n, n ); // Should fill in zeros
    for ( let i = 0; i < n; i++ ) {
      result.entries[ result.index( i, i ) ] = diagonalValues[ i ];
    }
    return result;
  }

  /**
   * @public
   *
   * @param {Vector2} vector
   * @returns {Matrix}
   */
  static rowVector2( vector ) {
    return new Matrix( 1, 2, [ vector.x, vector.y ] );
  }

  /**
   * @public
   *
   * @param {Vector3} vector
   * @returns {Matrix}
   */
  static rowVector3( vector ) {
    return new Matrix( 1, 3, [ vector.x, vector.y, vector.z ] );
  }

  /**
   * @public
   *
   * @param {Vector4} vector
   * @returns {Matrix}
   */
  static rowVector4( vector ) {
    return new Matrix( 1, 4, [ vector.x, vector.y, vector.z, vector.w ] );
  }

  /**
   * @public
   *
   * @param {Vector2|Vector3|Vector4} vector
   * @returns {Matrix}
   */
  static rowVector( vector ) {
    if ( vector.isVector2 ) {
      return Matrix.rowVector2( vector );
    }
    else if ( vector.isVector3 ) {
      return Matrix.rowVector3( vector );
    }
    else if ( vector.isVector4 ) {
      return Matrix.rowVector4( vector );
    }
    else {
      throw new Error( `undetected type of vector: ${vector.toString()}` );
    }
  }

  /**
   * @public
   *
   * @param {Vector2} vector
   * @returns {Matrix}
   */
  static columnVector2( vector ) {
    return new Matrix( 2, 1, [ vector.x, vector.y ] );
  }

  /**
   * @public
   *
   * @param {Vector3} vector
   * @returns {Matrix}
   */
  static columnVector3( vector ) {
    return new Matrix( 3, 1, [ vector.x, vector.y, vector.z ] );
  }

  /**
   * @public
   *
   * @param {Vector4} vector
   * @returns {Matrix}
   */
  static columnVector4( vector ) {
    return new Matrix( 4, 1, [ vector.x, vector.y, vector.z, vector.w ] );
  }

  /**
   * @public
   *
   * @param {Vector2|Vector3|Vector4} vector
   * @returns {Matrix}
   */
  static columnVector( vector ) {
    if ( vector.isVector2 ) {
      return Matrix.columnVector2( vector );
    }
    else if ( vector.isVector3 ) {
      return Matrix.columnVector3( vector );
    }
    else if ( vector.isVector4 ) {
      return Matrix.columnVector4( vector );
    }
    else {
      throw new Error( `undetected type of vector: ${vector.toString()}` );
    }
  }

  /**
   * Create a Matrix where each column is a vector
   * @public
   *
   * @param {Array.<Vector2>} vectors
   */
  static fromVectors2( vectors ) {
    const dimension = 2;
    const n = vectors.length;
    const data = new ArrayType( dimension * n );

    for ( let i = 0; i < n; i++ ) {
      const vector = vectors[ i ];
      data[ i ] = vector.x;
      data[ i + n ] = vector.y;
    }

    return new Matrix( dimension, n, data, true );
  }

  /**
   * Create a Matrix where each column is a vector
   * @public
   *
   * @param {Array.<Vector3>} vectors
   */
  static fromVectors3( vectors ) {
    const dimension = 3;
    const n = vectors.length;
    const data = new ArrayType( dimension * n );

    for ( let i = 0; i < n; i++ ) {
      const vector = vectors[ i ];
      data[ i ] = vector.x;
      data[ i + n ] = vector.y;
      data[ i + 2 * n ] = vector.z;
    }

    return new Matrix( dimension, n, data, true );
  }

  /**
   * Create a Matrix where each column is a vector
   * @public
   *
   * @param {Array.<Vector4>} vectors
   */
  static fromVectors4( vectors ) {
    const dimension = 4;
    const n = vectors.length;
    const data = new ArrayType( dimension * n );

    for ( let i = 0; i < n; i++ ) {
      const vector = vectors[ i ];
      data[ i ] = vector.x;
      data[ i + n ] = vector.y;
      data[ i + 2 * n ] = vector.z;
      data[ i + 3 * n ] = vector.w;
    }

    return new Matrix( dimension, n, data, true );
  }
}

// @public {boolean}
Matrix.prototype.isMatrix = true;

dot.register( 'Matrix', Matrix );


/**
 * Eigensystem decomposition, based on Jama (http://math.nist.gov/javanumerics/jama/)
 *
 * Eigenvalues and eigenvectors of a real matrix.
 * <P>
 * If A is symmetric, then A = V*D*V' where the eigenvalue matrix D is
 * diagonal and the eigenvector matrix V is orthogonal.
 * I.e. A = V.times(D.times(V.transpose())) and
 * V.times(V.transpose()) equals the identity matrix.
 * <P>
 * If A is not symmetric, then the eigenvalue matrix D is block diagonal
 * with the real eigenvalues in 1-by-1 blocks and any complex eigenvalues,
 * lambda + i*mu, in 2-by-2 blocks, [lambda, mu; -mu, lambda].  The
 * columns of V represent the eigenvectors in the sense that A*V = V*D,
 * i.e. A.times(V) equals V.times(D).  The matrix V may be badly
 * conditioned, or even singular, so the validity of the equation
 * A = V*D*inverse(V) depends upon V.cond().
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

export class EigenvalueDecomposition {
  /**
   * @param {Matrix} matrix - must be a square matrix
   */
  constructor( matrix ) {
    let i;
    let j;

    const A = matrix.entries;
    this.n = matrix.getColumnDimension(); // @private  Row and column dimension (square matrix).
    const n = this.n;
    this.V = new ArrayType( n * n ); // @private Array for internal storage of eigenvectors.

    // Arrays for internal storage of eigenvalues.
    this.d = new ArrayType( n ); // @private
    this.e = new ArrayType( n ); // @private

    this.issymmetric = true;
    for ( j = 0; ( j < n ) && this.issymmetric; j++ ) {
      for ( i = 0; ( i < n ) && this.issymmetric; i++ ) {
        this.issymmetric = ( A[ i * this.n + j ] === A[ j * this.n + i ] );
      }
    }

    if ( this.issymmetric ) {
      for ( i = 0; i < n; i++ ) {
        for ( j = 0; j < n; j++ ) {
          this.V[ i * this.n + j ] = A[ i * this.n + j ];
        }
      }

      // Tridiagonalize.
      this.tred2();

      // Diagonalize.
      this.tql2();

    }
    else {
      this.H = new ArrayType( n * n ); // Array for internal storage of nonsymmetric Hessenberg form.
      this.ort = new ArrayType( n ); // // Working storage for nonsymmetric algorithm.

      for ( j = 0; j < n; j++ ) {
        for ( i = 0; i < n; i++ ) {
          this.H[ i * this.n + j ] = A[ i * this.n + j ];
        }
      }

      // Reduce to Hessenberg form.
      this.orthes();

      // Reduce Hessenberg to real Schur form.
      this.hqr2();
    }
  }


  /**
   * Returns a square array of all eigenvectors arranged in a columnar format
   * @public
   * @returns {ArrayType.<number>} - a n*n matrix
   */
  getV() {
    return this.V.copy();
  }

  /**
   * Returns an array that contains the real part of the eigenvalues
   * @public
   * @returns {ArrayType.<number>} - a one dimensional array
   */
  getRealEigenvalues() {
    return this.d;
  }

  /**
   * Returns an array that contains the imaginary parts of the eigenvalues
   * @public
   * @returns {ArrayType.<number>} - a one dimensional array
   */
  getImagEigenvalues() {
    return this.e;
  }

  /**
   * Return the block diagonal eigenvalue matrix
   * @public
   * @returns {Matrix} - a n * n matrix
   */
  getD() {
    const n = this.n;
    const d = this.d;
    const e = this.e;

    const X = new Matrix( n, n );
    const D = X.entries;
    for ( let i = 0; i < n; i++ ) {
      for ( let j = 0; j < n; j++ ) {
        D[ i * this.n + j ] = 0.0;
      }
      D[ i * this.n + i ] = d[ i ];
      if ( e[ i ] > 0 ) {
        D[ i * this.n + i + 1 ] = e[ i ];
      }
      else if ( e[ i ] < 0 ) {
        D[ i * this.n + i - 1 ] = e[ i ];
      }
    }
    return X;
  }

  /**
   * Symmetric Householder reduction to tridiagonal form.
   * @private
   */
  tred2() {
    const n = this.n;
    const V = this.V;
    const d = this.d;
    const e = this.e;
    let i;
    let j;
    let k;
    let f;
    let g;
    let h;

    //  This is derived from the Algol procedures tred2 by
    //  Bowdler, Martin, Reinsch, and Wilkinson, Handbook for
    //  Auto. Comp., Vol.ii-Linear Algebra, and the corresponding
    //  Fortran subroutine in EISPACK.

    for ( j = 0; j < n; j++ ) {
      d[ j ] = V[ ( n - 1 ) * n + j ];
    }

    // Householder reduction to tridiagonal form.

    for ( i = n - 1; i > 0; i-- ) {

      // Scale to avoid under/overflow.

      let scale = 0.0;
      h = 0.0;
      for ( k = 0; k < i; k++ ) {
        scale = scale + Math.abs( d[ k ] );
      }
      if ( scale === 0.0 ) {
        e[ i ] = d[ i - 1 ];
        for ( j = 0; j < i; j++ ) {
          d[ j ] = V[ ( i - 1 ) * n + j ];
          V[ i * this.n + j ] = 0.0;
          V[ j * this.n + i ] = 0.0;
        }
      }
      else {

        // Generate Householder vector.

        for ( k = 0; k < i; k++ ) {
          d[ k ] /= scale;
          h += d[ k ] * d[ k ];
        }
        f = d[ i - 1 ];
        g = Math.sqrt( h );
        if ( f > 0 ) {
          g = -g;
        }
        e[ i ] = scale * g;
        h = h - f * g;
        d[ i - 1 ] = f - g;
        for ( j = 0; j < i; j++ ) {
          e[ j ] = 0.0;
        }

        // Apply similarity transformation to remaining columns.

        for ( j = 0; j < i; j++ ) {
          f = d[ j ];
          V[ j * this.n + i ] = f;
          g = e[ j ] + V[ j * n + j ] * f;
          for ( k = j + 1; k <= i - 1; k++ ) {
            g += V[ k * n + j ] * d[ k ];
            e[ k ] += V[ k * n + j ] * f;
          }
          e[ j ] = g;
        }
        f = 0.0;
        for ( j = 0; j < i; j++ ) {
          e[ j ] /= h;
          f += e[ j ] * d[ j ];
        }
        const hh = f / ( h + h );
        for ( j = 0; j < i; j++ ) {
          e[ j ] -= hh * d[ j ];
        }
        for ( j = 0; j < i; j++ ) {
          f = d[ j ];
          g = e[ j ];
          for ( k = j; k <= i - 1; k++ ) {
            V[ k * n + j ] -= ( f * e[ k ] + g * d[ k ] );
          }
          d[ j ] = V[ ( i - 1 ) * n + j ];
          V[ i * this.n + j ] = 0.0;
        }
      }
      d[ i ] = h;
    }

    // Accumulate transformations.

    for ( i = 0; i < n - 1; i++ ) {
      V[ ( n - 1 ) * n + i ] = V[ i * n + i ];
      V[ i * n + i ] = 1.0;
      h = d[ i + 1 ];
      if ( h !== 0.0 ) {
        for ( k = 0; k <= i; k++ ) {
          d[ k ] = V[ k * n + ( i + 1 ) ] / h;
        }
        for ( j = 0; j <= i; j++ ) {
          g = 0.0;
          for ( k = 0; k <= i; k++ ) {
            g += V[ k * n + ( i + 1 ) ] * V[ k * n + j ];
          }
          for ( k = 0; k <= i; k++ ) {
            V[ k * n + j ] -= g * d[ k ];
          }
        }
      }
      for ( k = 0; k <= i; k++ ) {
        V[ k * n + ( i + 1 ) ] = 0.0;
      }
    }
    for ( j = 0; j < n; j++ ) {
      d[ j ] = V[ ( n - 1 ) * n + j ];
      V[ ( n - 1 ) * n + j ] = 0.0;
    }
    V[ ( n - 1 ) * n + ( n - 1 ) ] = 1.0;
    e[ 0 ] = 0.0;
  }

  /**
   * Symmetric tridiagonal QL algorithm.
   * @private
   */
  tql2() {
    const n = this.n;
    const V = this.V;
    const d = this.d;
    const e = this.e;
    let i;
    let j;
    let k;
    let l;
    let g;
    let p;
    let iter;

    //  This is derived from the Algol procedures tql2, by
    //  Bowdler, Martin, Reinsch, and Wilkinson, Handbook for
    //  Auto. Comp., Vol.ii-Linear Algebra, and the corresponding
    //  Fortran subroutine in EISPACK.

    for ( i = 1; i < n; i++ ) {
      e[ i - 1 ] = e[ i ];
    }
    e[ n - 1 ] = 0.0;

    let f = 0.0;
    let tst1 = 0.0;
    const eps = Math.pow( 2.0, -52.0 );
    for ( l = 0; l < n; l++ ) {

      // Find small subdiagonal element

      tst1 = Math.max( tst1, Math.abs( d[ l ] ) + Math.abs( e[ l ] ) );
      let m = l;
      while ( m < n ) {
        if ( Math.abs( e[ m ] ) <= eps * tst1 ) {
          break;
        }
        m++;
      }

      // If m === l, d[l] is an eigenvalue,
      // otherwise, iterate.

      if ( m > l ) {
        iter = 0;
        do {
          iter = iter + 1;  // (Could check iteration count here.)

          // Compute implicit shift

          g = d[ l ];
          p = ( d[ l + 1 ] - g ) / ( 2.0 * e[ l ] );
          let r = Matrix.hypot( p, 1.0 );
          if ( p < 0 ) {
            r = -r;
          }
          d[ l ] = e[ l ] / ( p + r );
          d[ l + 1 ] = e[ l ] * ( p + r );
          const dl1 = d[ l + 1 ];
          let h = g - d[ l ];
          for ( i = l + 2; i < n; i++ ) {
            d[ i ] -= h;
          }
          f = f + h;

          // Implicit QL transformation.

          p = d[ m ];
          let c = 1.0;
          let c2 = c;
          let c3 = c;
          const el1 = e[ l + 1 ];
          let s = 0.0;
          let s2 = 0.0;
          for ( i = m - 1; i >= l; i-- ) {
            c3 = c2;
            c2 = c;
            s2 = s;
            g = c * e[ i ];
            h = c * p;
            r = Matrix.hypot( p, e[ i ] );
            e[ i + 1 ] = s * r;
            s = e[ i ] / r;
            c = p / r;
            p = c * d[ i ] - s * g;
            d[ i + 1 ] = h + s * ( c * g + s * d[ i ] );

            // Accumulate transformation.

            for ( k = 0; k < n; k++ ) {
              h = V[ k * n + ( i + 1 ) ];
              V[ k * n + ( i + 1 ) ] = s * V[ k * n + i ] + c * h;
              V[ k * n + i ] = c * V[ k * n + i ] - s * h;
            }
          }
          p = -s * s2 * c3 * el1 * e[ l ] / dl1;
          e[ l ] = s * p;
          d[ l ] = c * p;

          // Check for convergence.

        } while ( Math.abs( e[ l ] ) > eps * tst1 );
      }
      d[ l ] = d[ l ] + f;
      e[ l ] = 0.0;
    }

    // Sort eigenvalues and corresponding vectors.

    for ( i = 0; i < n - 1; i++ ) {
      k = i;
      p = d[ i ];
      for ( j = i + 1; j < n; j++ ) {
        if ( d[ j ] < p ) {
          k = j;
          p = d[ j ];
        }
      }
      if ( k !== i ) {
        d[ k ] = d[ i ];
        d[ i ] = p;
        for ( j = 0; j < n; j++ ) {
          p = V[ j * this.n + i ];
          V[ j * this.n + i ] = V[ j * n + k ];
          V[ j * n + k ] = p;
        }
      }
    }
  }

  /**
   *  Nonsymmetric reduction to Hessenberg form.
   *  @private
   */
  orthes() {
    const n = this.n;
    const V = this.V;
    const H = this.H;
    const ort = this.ort;
    let i;
    let j;
    let m;
    let f;
    let g;

    //  This is derived from the Algol procedures orthes and ortran,
    //  by Martin and Wilkinson, Handbook for Auto. Comp.,
    //  Vol.ii-Linear Algebra, and the corresponding
    //  Fortran subroutines in EISPACK.

    const low = 0;
    const high = n - 1;

    for ( m = low + 1; m <= high - 1; m++ ) {

      // Scale column.

      let scale = 0.0;
      for ( i = m; i <= high; i++ ) {
        scale = scale + Math.abs( H[ i * n + ( m - 1 ) ] );
      }
      if ( scale !== 0.0 ) {

        // Compute Householder transformation.

        let h = 0.0;
        for ( i = high; i >= m; i-- ) {
          ort[ i ] = H[ i * n + ( m - 1 ) ] / scale;
          h += ort[ i ] * ort[ i ];
        }
        g = Math.sqrt( h );
        if ( ort[ m ] > 0 ) {
          g = -g;
        }
        h = h - ort[ m ] * g;
        ort[ m ] = ort[ m ] - g;

        // Apply Householder similarity transformation
        // H = (I-u*u'/h)*H*(I-u*u')/h)

        for ( j = m; j < n; j++ ) {
          f = 0.0;
          for ( i = high; i >= m; i-- ) {
            f += ort[ i ] * H[ i * this.n + j ];
          }
          f = f / h;
          for ( i = m; i <= high; i++ ) {
            H[ i * this.n + j ] -= f * ort[ i ];
          }
        }

        for ( i = 0; i <= high; i++ ) {
          f = 0.0;
          for ( j = high; j >= m; j-- ) {
            f += ort[ j ] * H[ i * this.n + j ];
          }
          f = f / h;
          for ( j = m; j <= high; j++ ) {
            H[ i * this.n + j ] -= f * ort[ j ];
          }
        }
        ort[ m ] = scale * ort[ m ];
        H[ m * n + ( m - 1 ) ] = scale * g;
      }
    }

    // Accumulate transformations (Algol's ortran).

    for ( i = 0; i < n; i++ ) {
      for ( j = 0; j < n; j++ ) {
        V[ i * this.n + j ] = ( i === j ? 1.0 : 0.0 );
      }
    }

    for ( m = high - 1; m >= low + 1; m-- ) {
      if ( H[ m * n + ( m - 1 ) ] !== 0.0 ) {
        for ( i = m + 1; i <= high; i++ ) {
          ort[ i ] = H[ i * n + ( m - 1 ) ];
        }
        for ( j = m; j <= high; j++ ) {
          g = 0.0;
          for ( i = m; i <= high; i++ ) {
            g += ort[ i ] * V[ i * this.n + j ];
          }
          // Double division avoids possible underflow
          g = ( g / ort[ m ] ) / H[ m * n + ( m - 1 ) ];
          for ( i = m; i <= high; i++ ) {
            V[ i * this.n + j ] += g * ort[ i ];
          }
        }
      }
    }
  }

  /**
   * Complex scalar division.
   * @private
   *
   * @param {*} xr
   * @param {*} xi
   * @param {*} yr
   * @param {*} yi
   */
  cdiv( xr, xi, yr, yi ) {
    let r;
    let d;
    if ( Math.abs( yr ) > Math.abs( yi ) ) {
      r = yi / yr;
      d = yr + r * yi;
      this.cdivr = ( xr + r * xi ) / d;
      this.cdivi = ( xi - r * xr ) / d;
    }
    else {
      r = yr / yi;
      d = yi + r * yr;
      this.cdivr = ( r * xr + xi ) / d;
      this.cdivi = ( r * xi - xr ) / d;
    }
  }

  /**
   * This methods finds the eigenvalues and eigenvectors
   * of a real upper hessenberg matrix by the QR algorithm
   *
   * Nonsymmetric reduction from Hessenberg to real Schur form.
   * https://en.wikipedia.org/wiki/QR_algorithm
   *
   * @private
   */
  hqr2() {
    let n;
    const V = this.V;
    const d = this.d;
    const e = this.e;
    const H = this.H;
    let i;
    let j;
    let k;
    let l;
    let m;
    let iter;

    //  This is derived from the Algol procedure hqr2,
    //  by Martin and Wilkinson, Handbook for Auto. Comp.,
    //  Vol.ii-Linear Algebra, and the corresponding
    //  Fortran subroutine in EISPACK.

    // Initialize

    const nn = this.n;
    n = nn - 1;
    const low = 0;
    const high = nn - 1;
    const eps = Math.pow( 2.0, -52.0 );
    let exshift = 0.0;
    let p = 0;
    let q = 0;
    let r = 0;
    let s = 0;
    let z = 0;
    let t;
    let w;
    let x;
    let y;

    // Store roots isolated by balanc and compute matrix norm

    let norm = 0.0;
    for ( i = 0; i < nn; i++ ) {
      if ( i < low || i > high ) {
        d[ i ] = H[ i * n + i ];
        e[ i ] = 0.0;
      }
      for ( j = Math.max( i - 1, 0 ); j < nn; j++ ) {
        norm = norm + Math.abs( H[ i * this.n + j ] );
      }
    }

    // Outer loop over eigenvalue index

    iter = 0;
    while ( n >= low ) {

      // Look for single small sub-diagonal element

      l = n;
      while ( l > low ) {
        s = Math.abs( H[ ( l - 1 ) * n + ( l - 1 ) ] ) + Math.abs( H[ l * n + l ] );
        if ( s === 0.0 ) {
          s = norm;
        }
        if ( Math.abs( H[ l * n + ( l - 1 ) ] ) < eps * s ) {
          break;
        }
        l--;
      }

      // Check for convergence
      // One root found

      if ( l === n ) {
        H[ n * n + n ] = H[ n * n + n ] + exshift;
        d[ n ] = H[ n * n + n ];
        e[ n ] = 0.0;
        n--;
        iter = 0;

        // Two roots found

      }
      else if ( l === n - 1 ) {
        w = H[ n * n + n - 1 ] * H[ ( n - 1 ) * n + n ];
        p = ( H[ ( n - 1 ) * n + ( n - 1 ) ] - H[ n * n + n ] ) / 2.0;
        q = p * p + w;
        z = Math.sqrt( Math.abs( q ) );
        H[ n * n + n ] = H[ n * n + n ] + exshift;
        H[ ( n - 1 ) * n + ( n - 1 ) ] = H[ ( n - 1 ) * n + ( n - 1 ) ] + exshift;
        x = H[ n * n + n ];

        // Real pair

        if ( q >= 0 ) {
          if ( p >= 0 ) {
            z = p + z;
          }
          else {
            z = p - z;
          }
          d[ n - 1 ] = x + z;
          d[ n ] = d[ n - 1 ];
          if ( z !== 0.0 ) {
            d[ n ] = x - w / z;
          }
          e[ n - 1 ] = 0.0;
          e[ n ] = 0.0;
          x = H[ n * n + n - 1 ];
          s = Math.abs( x ) + Math.abs( z );
          p = x / s;
          q = z / s;
          r = Math.sqrt( p * p + q * q );
          p = p / r;
          q = q / r;

          // Row modification

          for ( j = n - 1; j < nn; j++ ) {
            z = H[ ( n - 1 ) * n + j ];
            H[ ( n - 1 ) * n + j ] = q * z + p * H[ n * n + j ];
            H[ n * n + j ] = q * H[ n * n + j ] - p * z;
          }

          // Column modification

          for ( i = 0; i <= n; i++ ) {
            z = H[ i * n + n - 1 ];
            H[ i * n + n - 1 ] = q * z + p * H[ i * n + n ];
            H[ i * n + n ] = q * H[ i * n + n ] - p * z;
          }

          // Accumulate transformations

          for ( i = low; i <= high; i++ ) {
            z = V[ i * n + n - 1 ];
            V[ i * n + n - 1 ] = q * z + p * V[ i * n + n ];
            V[ i * n + n ] = q * V[ i * n + n ] - p * z;
          }

          // Complex pair

        }
        else {
          d[ n - 1 ] = x + p;
          d[ n ] = x + p;
          e[ n - 1 ] = z;
          e[ n ] = -z;
        }
        n = n - 2;
        iter = 0;

        // No convergence yet

      }
      else {

        // Form shift

        x = H[ n * n + n ];
        y = 0.0;
        w = 0.0;
        if ( l < n ) {
          y = H[ ( n - 1 ) * n + ( n - 1 ) ];
          w = H[ n * n + n - 1 ] * H[ ( n - 1 ) * n + n ];
        }

        // Wilkinson's original ad hoc shift

        if ( iter === 10 ) {
          exshift += x;
          for ( i = low; i <= n; i++ ) {
            H[ i * n + i ] -= x;
          }
          s = Math.abs( H[ n * n + n - 1 ] ) + Math.abs( H[ ( n - 1 ) * n + n - 2 ] );
          x = y = 0.75 * s;
          w = -0.4375 * s * s;
        }

        // MATLAB's new ad hoc shift

        if ( iter === 30 ) {
          s = ( y - x ) / 2.0;
          s = s * s + w;
          if ( s > 0 ) {
            s = Math.sqrt( s );
            if ( y < x ) {
              s = -s;
            }
            s = x - w / ( ( y - x ) / 2.0 + s );
            for ( i = low; i <= n; i++ ) {
              H[ i * n + i ] -= s;
            }
            exshift += s;
            x = y = w = 0.964;
          }
        }

        iter = iter + 1;   // (Could check iteration count here.)

        // Look for two consecutive small sub-diagonal elements

        m = n - 2;
        while ( m >= l ) {
          z = H[ m * n + m ];
          r = x - z;
          s = y - z;
          p = ( r * s - w ) / H[ ( m + 1 ) * n + m ] + H[ m * n + m + 1 ];
          q = H[ ( m + 1 ) * n + m + 1 ] - z - r - s;
          r = H[ ( m + 2 ) * n + m + 1 ];
          s = Math.abs( p ) + Math.abs( q ) + Math.abs( r );
          p = p / s;
          q = q / s;
          r = r / s;
          if ( m === l ) {
            break;
          }
          if ( Math.abs( H[ m * n + ( m - 1 ) ] ) * ( Math.abs( q ) + Math.abs( r ) ) <
               eps * ( Math.abs( p ) * ( Math.abs( H[ ( m - 1 ) * n + m - 1 ] ) + Math.abs( z ) +
                                         Math.abs( H[ ( m + 1 ) * n + m + 1 ] ) ) ) ) {
            break;
          }
          m--;
        }

        for ( i = m + 2; i <= n; i++ ) {
          H[ i * n + i - 2 ] = 0.0;
          if ( i > m + 2 ) {
            H[ i * n + i - 3 ] = 0.0;
          }
        }

        // Double QR step involving rows l:n and columns m:n

        for ( k = m; k <= n - 1; k++ ) {
          const notlast = ( k !== n - 1 );
          if ( k !== m ) {
            p = H[ k * n + k - 1 ];
            q = H[ ( k + 1 ) * n + k - 1 ];
            r = ( notlast ? H[ ( k + 2 ) * n + k - 1 ] : 0.0 );
            x = Math.abs( p ) + Math.abs( q ) + Math.abs( r );
            if ( x !== 0.0 ) {
              p = p / x;
              q = q / x;
              r = r / x;
            }
          }
          if ( x === 0.0 ) {
            break;
          }
          s = Math.sqrt( p * p + q * q + r * r );
          if ( p < 0 ) {
            s = -s;
          }
          if ( s !== 0 ) {
            if ( k !== m ) {
              H[ k * n + k - 1 ] = -s * x;
            }
            else if ( l !== m ) {
              H[ k * n + k - 1 ] = -H[ k * n + k - 1 ];
            }
            p = p + s;
            x = p / s;
            y = q / s;
            z = r / s;
            q = q / p;
            r = r / p;

            // Row modification

            for ( j = k; j < nn; j++ ) {
              p = H[ k * n + j ] + q * H[ ( k + 1 ) * n + j ];
              if ( notlast ) {
                p = p + r * H[ ( k + 2 ) * n + j ];
                H[ ( k + 2 ) * n + j ] = H[ ( k + 2 ) * n + j ] - p * z;
              }
              H[ k * n + j ] = H[ k * n + j ] - p * x;
              H[ ( k + 1 ) * n + j ] = H[ ( k + 1 ) * n + j ] - p * y;
            }

            // Column modification

            for ( i = 0; i <= Math.min( n, k + 3 ); i++ ) {
              p = x * H[ i * n + k ] + y * H[ i * n + k + 1 ];
              if ( notlast ) {
                p = p + z * H[ i * n + k + 2 ];
                H[ i * n + k + 2 ] = H[ i * n + k + 2 ] - p * r;
              }
              H[ i * n + k ] = H[ i * n + k ] - p;
              H[ i * n + k + 1 ] = H[ i * n + k + 1 ] - p * q;
            }

            // Accumulate transformations

            for ( i = low; i <= high; i++ ) {
              p = x * V[ i * n + k ] + y * V[ i * n + k + 1 ];
              if ( notlast ) {
                p = p + z * V[ i * n + k + 2 ];
                V[ i * n + k + 2 ] = V[ i * n + k + 2 ] - p * r;
              }
              V[ i * n + k ] = V[ i * n + k ] - p;
              V[ i * n + k + 1 ] = V[ i * n + k + 1 ] - p * q;
            }
          }  // (s !== 0)
        }  // k loop
      }  // check convergence
    }  // while (n >= low)

    // Backsubstitute to find vectors of upper triangular form

    if ( norm === 0.0 ) {
      return;
    }

    for ( n = nn - 1; n >= 0; n-- ) {
      p = d[ n ];
      q = e[ n ];

      // Real vector

      if ( q === 0 ) {
        l = n;
        H[ n * n + n ] = 1.0;
        for ( i = n - 1; i >= 0; i-- ) {
          w = H[ i * n + i ] - p;
          r = 0.0;
          for ( j = l; j <= n; j++ ) {
            r = r + H[ i * this.n + j ] * H[ j * n + n ];
          }
          if ( e[ i ] < 0.0 ) {
            z = w;
            s = r;
          }
          else {
            l = i;
            if ( e[ i ] === 0.0 ) {
              if ( w !== 0.0 ) {
                H[ i * n + n ] = -r / w;
              }
              else {
                H[ i * n + n ] = -r / ( eps * norm );
              }

              // Solve real equations

            }
            else {
              x = H[ i * n + i + 1 ];
              y = H[ ( i + 1 ) * n + i ];
              q = ( d[ i ] - p ) * ( d[ i ] - p ) + e[ i ] * e[ i ];
              t = ( x * s - z * r ) / q;
              H[ i * n + n ] = t;
              if ( Math.abs( x ) > Math.abs( z ) ) {
                H[ ( i + 1 ) * n + n ] = ( -r - w * t ) / x;
              }
              else {
                H[ ( i + 1 ) * n + n ] = ( -s - y * t ) / z;
              }
            }

            // Overflow control

            t = Math.abs( H[ i * n + n ] );
            if ( ( eps * t ) * t > 1 ) {
              for ( j = i; j <= n; j++ ) {
                H[ j * n + n ] = H[ j * n + n ] / t;
              }
            }
          }
        }

        // Complex vector

      }
      else if ( q < 0 ) {
        l = n - 1;

        // Last vector component imaginary so matrix is triangular

        if ( Math.abs( H[ n * n + n - 1 ] ) > Math.abs( H[ ( n - 1 ) * n + n ] ) ) {
          H[ ( n - 1 ) * n + ( n - 1 ) ] = q / H[ n * n + n - 1 ];
          H[ ( n - 1 ) * n + n ] = -( H[ n * n + n ] - p ) / H[ n * n + n - 1 ];
        }
        else {
          this.cdiv( 0.0, -H[ ( n - 1 ) * n + n ], H[ ( n - 1 ) * n + ( n - 1 ) ] - p, q );
          H[ ( n - 1 ) * n + ( n - 1 ) ] = this.cdivr;
          H[ ( n - 1 ) * n + n ] = this.cdivi;
        }
        H[ n * n + n - 1 ] = 0.0;
        H[ n * n + n ] = 1.0;
        for ( i = n - 2; i >= 0; i-- ) {
          let ra;
          let sa;
          let vr;
          let vi;
          ra = 0.0;
          sa = 0.0;
          for ( j = l; j <= n; j++ ) {
            ra = ra + H[ i * this.n + j ] * H[ j * n + n - 1 ];
            sa = sa + H[ i * this.n + j ] * H[ j * n + n ];
          }
          w = H[ i * n + i ] - p;

          if ( e[ i ] < 0.0 ) {
            z = w;
            r = ra;
            s = sa;
          }
          else {
            l = i;
            if ( e[ i ] === 0 ) {
              this.cdiv( -ra, -sa, w, q );
              H[ i * n + n - 1 ] = this.cdivr;
              H[ i * n + n ] = this.cdivi;
            }
            else {

              // Solve complex equations

              x = H[ i * n + i + 1 ];
              y = H[ ( i + 1 ) * n + i ];
              vr = ( d[ i ] - p ) * ( d[ i ] - p ) + e[ i ] * e[ i ] - q * q;
              vi = ( d[ i ] - p ) * 2.0 * q;
              if ( vr === 0.0 && vi === 0.0 ) {
                vr = eps * norm * ( Math.abs( w ) + Math.abs( q ) +
                                    Math.abs( x ) + Math.abs( y ) + Math.abs( z ) );
              }
              this.cdiv( x * r - z * ra + q * sa, x * s - z * sa - q * ra, vr, vi );
              H[ i * n + n - 1 ] = this.cdivr;
              H[ i * n + n ] = this.cdivi;
              if ( Math.abs( x ) > ( Math.abs( z ) + Math.abs( q ) ) ) {
                H[ ( i + 1 ) * n + n - 1 ] = ( -ra - w * H[ i * n + n - 1 ] + q * H[ i * n + n ] ) / x;
                H[ ( i + 1 ) * n + n ] = ( -sa - w * H[ i * n + n ] - q * H[ i * n + n - 1 ] ) / x;
              }
              else {
                this.cdiv( -r - y * H[ i * n + n - 1 ], -s - y * H[ i * n + n ], z, q );
                H[ ( i + 1 ) * n + n - 1 ] = this.cdivr;
                H[ ( i + 1 ) * n + n ] = this.cdivi;
              }
            }

            // Overflow control
            t = Math.max( Math.abs( H[ i * n + n - 1 ] ), Math.abs( H[ i * n + n ] ) );
            if ( ( eps * t ) * t > 1 ) {
              for ( j = i; j <= n; j++ ) {
                H[ j * n + n - 1 ] = H[ j * n + n - 1 ] / t;
                H[ j * n + n ] = H[ j * n + n ] / t;
              }
            }
          }
        }
      }
    }

    // Vectors of isolated roots
    for ( i = 0; i < nn; i++ ) {
      if ( i < low || i > high ) {
        for ( j = i; j < nn; j++ ) {
          V[ i * this.n + j ] = H[ i * this.n + j ];
        }
      }
    }

    // Back transformation to get eigenvectors of original matrix
    for ( j = nn - 1; j >= low; j-- ) {
      for ( i = low; i <= high; i++ ) {
        z = 0.0;
        for ( k = low; k <= Math.min( j, high ); k++ ) {
          z = z + V[ i * n + k ] * H[ k * n + j ];
        }
        V[ i * this.n + j ] = z;
      }
    }
  }
}

dot.register( 'EigenvalueDecomposition', EigenvalueDecomposition );


/**
 * LU decomposition, based on Jama (http://math.nist.gov/javanumerics/jama/).  Please note the arbitrary-precision
 * copy LUDecompositionDecimal which should be maintained with this file.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

export class LUDecomposition {
  constructor( matrix ) {
    let i;
    let j;
    let k;

    this.matrix = matrix;

    // TODO: size! https://github.com/phetsims/dot/issues/96
    this.LU = matrix.getArrayCopy();
    const LU = this.LU;
    this.m = matrix.getRowDimension();
    const m = this.m;
    this.n = matrix.getColumnDimension();
    const n = this.n;
    this.piv = new Uint32Array( m );
    for ( i = 0; i < m; i++ ) {
      this.piv[ i ] = i;
    }
    this.pivsign = 1;
    const LUcolj = new ArrayType( m );

    // Outer loop.

    for ( j = 0; j < n; j++ ) {

      // Make a copy of the j-th column to localize references.
      for ( i = 0; i < m; i++ ) {
        LUcolj[ i ] = LU[ matrix.index( i, j ) ];
      }

      // Apply previous transformations.

      for ( i = 0; i < m; i++ ) {
        // Most of the time is spent in the following dot product.
        const kmax = Math.min( i, j );
        let s = 0.0;
        for ( k = 0; k < kmax; k++ ) {
          const ik = matrix.index( i, k );
          s += LU[ ik ] * LUcolj[ k ];
        }

        LUcolj[ i ] -= s;
        LU[ matrix.index( i, j ) ] = LUcolj[ i ];
      }

      // Find pivot and exchange if necessary.

      let p = j;
      for ( i = j + 1; i < m; i++ ) {
        if ( Math.abs( LUcolj[ i ] ) > Math.abs( LUcolj[ p ] ) ) {
          p = i;
        }
      }
      if ( p !== j ) {
        for ( k = 0; k < n; k++ ) {
          const pk = matrix.index( p, k );
          const jk = matrix.index( j, k );
          const t = LU[ pk ];
          LU[ pk ] = LU[ jk ];
          LU[ jk ] = t;
        }
        k = this.piv[ p ];
        this.piv[ p ] = this.piv[ j ];
        this.piv[ j ] = k;
        this.pivsign = -this.pivsign;
      }

      // Compute multipliers.

      if ( j < m && LU[ this.matrix.index( j, j ) ] !== 0.0 ) {
        for ( i = j + 1; i < m; i++ ) {
          LU[ matrix.index( i, j ) ] /= LU[ matrix.index( j, j ) ];
        }
      }
    }
  }

  /**
   * @public
   *
   * @returns {boolean}
   */
  isNonsingular() {
    for ( let j = 0; j < this.n; j++ ) {
      const index = this.matrix.index( j, j );
      if ( this.LU[ index ] === 0 ) {
        return false;
      }
    }
    return true;
  }

  /**
   * @public
   *
   * @returns {Matrix}
   */
  getL() {
    const result = new Matrix( this.m, this.n );
    for ( let i = 0; i < this.m; i++ ) {
      for ( let j = 0; j < this.n; j++ ) {
        if ( i > j ) {
          result.entries[ result.index( i, j ) ] = this.LU[ this.matrix.index( i, j ) ];
        }
        else if ( i === j ) {
          result.entries[ result.index( i, j ) ] = 1.0;
        }
        else {
          result.entries[ result.index( i, j ) ] = 0.0;
        }
      }
    }
    return result;
  }

  /**
   * @public
   *
   * @returns {Matrix}
   */
  getU() {
    const result = new Matrix( this.n, this.n );
    for ( let i = 0; i < this.n; i++ ) {
      for ( let j = 0; j < this.n; j++ ) {
        if ( i <= j ) {
          result.entries[ result.index( i, j ) ] = this.LU[ this.matrix.index( i, j ) ];
        }
        else {
          result.entries[ result.index( i, j ) ] = 0.0;
        }
      }
    }
    return result;
  }

  /**
   * @public
   *
   * @returns {Uint32Array}
   */
  getPivot() {
    const p = new Uint32Array( this.m );
    for ( let i = 0; i < this.m; i++ ) {
      p[ i ] = this.piv[ i ];
    }
    return p;
  }

  /**
   * @public
   *
   * @returns {Float64Array}
   */
  getDoublePivot() {
    const vals = new ArrayType( this.m );
    for ( let i = 0; i < this.m; i++ ) {
      vals[ i ] = this.piv[ i ];
    }
    return vals;
  }

  /**
   * @public
   *
   * @returns {number}
   */
  det() {
    if ( this.m !== this.n ) {
      throw new Error( 'Matrix must be square.' );
    }
    let d = this.pivsign;
    for ( let j = 0; j < this.n; j++ ) {
      d *= this.LU[ this.matrix.index( j, j ) ];
    }
    return d;
  }

  /**
   * @public
   *
   * @param {Matrix} matrix
   * @returns {Matrix}
   */
  solve( matrix ) {
    let i;
    let j;
    let k;
    if ( matrix.getRowDimension() !== this.m ) {
      throw new Error( 'Matrix row dimensions must agree.' );
    }
    if ( !this.isNonsingular() ) {
      throw new Error( 'Matrix is singular.' );
    }

    // Copy right hand side with pivoting
    const nx = matrix.getColumnDimension();
    const Xmat = matrix.getArrayRowMatrix( this.piv, 0, nx - 1 );

    // Solve L*Y = B(piv,:)
    for ( k = 0; k < this.n; k++ ) {
      for ( i = k + 1; i < this.n; i++ ) {
        for ( j = 0; j < nx; j++ ) {
          Xmat.entries[ Xmat.index( i, j ) ] -= Xmat.entries[ Xmat.index( k, j ) ] * this.LU[ this.matrix.index( i, k ) ];
        }
      }
    }

    // Solve U*X = Y;
    for ( k = this.n - 1; k >= 0; k-- ) {
      for ( j = 0; j < nx; j++ ) {
        Xmat.entries[ Xmat.index( k, j ) ] /= this.LU[ this.matrix.index( k, k ) ];
      }
      for ( i = 0; i < k; i++ ) {
        for ( j = 0; j < nx; j++ ) {
          Xmat.entries[ Xmat.index( i, j ) ] -= Xmat.entries[ Xmat.index( k, j ) ] * this.LU[ this.matrix.index( i, k ) ];
        }
      }
    }
    return Xmat;
  }
}

dot.register( 'LUDecomposition', LUDecomposition );


/**
 * QR decomposition, based on Jama (http://math.nist.gov/javanumerics/jama/)
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

export class QRDecomposition {
  /**
   * @param {Matrix} matrix
   */
  constructor( matrix ) {
    this.matrix = matrix;

    // TODO: size! https://github.com/phetsims/dot/issues/96
    this.QR = matrix.getArrayCopy();
    const QR = this.QR;
    this.m = matrix.getRowDimension();
    const m = this.m;
    this.n = matrix.getColumnDimension();
    const n = this.n;

    this.Rdiag = new ArrayType( n );

    let i;
    let j;
    let k;

    // Main loop.
    for ( k = 0; k < n; k++ ) {
      // Compute 2-norm of k-th column without under/overflow.
      let nrm = 0;
      for ( i = k; i < m; i++ ) {
        nrm = Matrix.hypot( nrm, QR[ this.matrix.index( i, k ) ] );
      }

      if ( nrm !== 0.0 ) {
        // Form k-th Householder vector.
        if ( QR[ this.matrix.index( k, k ) ] < 0 ) {
          nrm = -nrm;
        }
        for ( i = k; i < m; i++ ) {
          QR[ this.matrix.index( i, k ) ] /= nrm;
        }
        QR[ this.matrix.index( k, k ) ] += 1.0;

        // Apply transformation to remaining columns.
        for ( j = k + 1; j < n; j++ ) {
          let s = 0.0;
          for ( i = k; i < m; i++ ) {
            s += QR[ this.matrix.index( i, k ) ] * QR[ this.matrix.index( i, j ) ];
          }
          s = -s / QR[ this.matrix.index( k, k ) ];
          for ( i = k; i < m; i++ ) {
            QR[ this.matrix.index( i, j ) ] += s * QR[ this.matrix.index( i, k ) ];
          }
        }
      }
      this.Rdiag[ k ] = -nrm;
    }
  }

  /**
   * @public
   *
   * @returns {boolean}
   */
  isFullRank() {
    for ( let j = 0; j < this.n; j++ ) {
      if ( this.Rdiag[ j ] === 0 ) {
        return false;
      }
    }
    return true;
  }

  /**
   * @public
   *
   * @returns {Matrix}
   */
  getH() {
    const result = new Matrix( this.m, this.n );
    for ( let i = 0; i < this.m; i++ ) {
      for ( let j = 0; j < this.n; j++ ) {
        if ( i >= j ) {
          result.entries[ result.index( i, j ) ] = this.QR[ this.matrix.index( i, j ) ];
        }
        else {
          result.entries[ result.index( i, j ) ] = 0.0;
        }
      }
    }
    return result;
  }

  /**
   * @public
   *
   * @returns {Matrix}
   */
  getR() {
    const result = new Matrix( this.n, this.n );
    for ( let i = 0; i < this.n; i++ ) {
      for ( let j = 0; j < this.n; j++ ) {
        if ( i < j ) {
          result.entries[ result.index( i, j ) ] = this.QR[ this.matrix.index( i, j ) ];
        }
        else if ( i === j ) {
          result.entries[ result.index( i, j ) ] = this.Rdiag[ i ];
        }
        else {
          result.entries[ result.index( i, j ) ] = 0.0;
        }
      }
    }
    return result;
  }

  /**
   * @public
   *
   * @returns {Matrix}
   */
  getQ() {
    let i;
    let j;
    let k;
    const result = new Matrix( this.m, this.n );
    for ( k = this.n - 1; k >= 0; k-- ) {
      for ( i = 0; i < this.m; i++ ) {
        result.entries[ result.index( i, k ) ] = 0.0;
      }
      result.entries[ result.index( k, k ) ] = 1.0;
      for ( j = k; j < this.n; j++ ) {
        if ( this.QR[ this.matrix.index( k, k ) ] !== 0 ) {
          let s = 0.0;
          for ( i = k; i < this.m; i++ ) {
            s += this.QR[ this.matrix.index( i, k ) ] * result.entries[ result.index( i, j ) ];
          }
          s = -s / this.QR[ this.matrix.index( k, k ) ];
          for ( i = k; i < this.m; i++ ) {
            result.entries[ result.index( i, j ) ] += s * this.QR[ this.matrix.index( i, k ) ];
          }
        }
      }
    }
    return result;
  }

  /**
   * @public
   *
   * @param {Matrix} matrix
   * @returns {Matrix}
   */
  solve( matrix ) {
    if ( matrix.getRowDimension() !== this.m ) {
      throw new Error( 'Matrix row dimensions must agree.' );
    }
    if ( !this.isFullRank() ) {
      throw new Error( 'Matrix is rank deficient.' );
    }

    let i;
    let j;
    let k;

    // Copy right hand side
    const nx = matrix.getColumnDimension();
    const X = matrix.getArrayCopy();

    // Compute Y = transpose(Q)*matrix
    for ( k = 0; k < this.n; k++ ) {
      for ( j = 0; j < nx; j++ ) {
        let s = 0.0;
        for ( i = k; i < this.m; i++ ) {
          s += this.QR[ this.matrix.index( i, k ) ] * X[ matrix.index( i, j ) ];
        }
        s = -s / this.QR[ this.matrix.index( k, k ) ];
        for ( i = k; i < this.m; i++ ) {
          X[ matrix.index( i, j ) ] += s * this.QR[ this.matrix.index( i, k ) ];
        }
      }
    }

    // Solve R*X = Y;
    for ( k = this.n - 1; k >= 0; k-- ) {
      for ( j = 0; j < nx; j++ ) {
        X[ matrix.index( k, j ) ] /= this.Rdiag[ k ];
      }
      for ( i = 0; i < k; i++ ) {
        for ( j = 0; j < nx; j++ ) {
          X[ matrix.index( i, j ) ] -= X[ matrix.index( k, j ) ] * this.QR[ this.matrix.index( i, k ) ];
        }
      }
    }
    return new Matrix( this.n, nx, X, true ).getMatrix( 0, this.n - 1, 0, nx - 1 );
  }
}

dot.register( 'QRDecomposition', QRDecomposition );


/**
 * SVD decomposition, based on Jama (http://math.nist.gov/javanumerics/jama/)
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

export class SingularValueDecomposition {
  /**
   * @param {Matrix} matrix
   */
  constructor( matrix ) {
    this.matrix = matrix;

    const Arg = matrix;

    // Derived from LINPACK code.
    // Initialize.
    const A = Arg.getArrayCopy();
    this.m = Arg.getRowDimension();
    this.n = Arg.getColumnDimension();
    const m = this.m;
    const n = this.n;

    const min = Math.min;
    const max = Math.max;
    const pow = Math.pow;
    const abs = Math.abs;

    /* Apparently the failing cases are only a proper subset of (m<n),
     so let's not throw error.  Correct fix to come later?
     if (m<n) {
     throw new IllegalArgumentException("Jama SVD only works for m >= n"); }
     */
    const nu = min( m, n );
    this.s = new ArrayType( min( m + 1, n ) );
    const s = this.s;
    this.U = new ArrayType( m * nu );
    const U = this.U;
    this.V = new ArrayType( n * n );
    const V = this.V;
    const e = new ArrayType( n );
    const work = new ArrayType( m );
    const wantu = true;
    const wantv = true;

    let i;
    let j;
    let k;
    let t;
    let f;

    let cs;
    let sn;

    const hypot = Matrix.hypot;

    // Reduce A to bidiagonal form, storing the diagonal elements
    // in s and the super-diagonal elements in e.

    const nct = min( m - 1, n );
    const nrt = max( 0, min( n - 2, m ) );
    for ( k = 0; k < max( nct, nrt ); k++ ) {
      if ( k < nct ) {

        // Compute the transformation for the k-th column and
        // place the k-th diagonal in s[k].
        // Compute 2-norm of k-th column without under/overflow.
        s[ k ] = 0;
        for ( i = k; i < m; i++ ) {
          s[ k ] = hypot( s[ k ], A[ i * n + k ] );
        }
        if ( s[ k ] !== 0.0 ) {
          if ( A[ k * n + k ] < 0.0 ) {
            s[ k ] = -s[ k ];
          }
          for ( i = k; i < m; i++ ) {
            A[ i * n + k ] /= s[ k ];
          }
          A[ k * n + k ] += 1.0;
        }
        s[ k ] = -s[ k ];
      }
      for ( j = k + 1; j < n; j++ ) {
        if ( ( k < nct ) && ( s[ k ] !== 0.0 ) ) {

          // Apply the transformation.

          t = 0;
          for ( i = k; i < m; i++ ) {
            t += A[ i * n + k ] * A[ i * n + j ];
          }
          t = -t / A[ k * n + k ];
          for ( i = k; i < m; i++ ) {
            A[ i * n + j ] += t * A[ i * n + k ];
          }
        }

        // Place the k-th row of A into e for the
        // subsequent calculation of the row transformation.

        e[ j ] = A[ k * n + j ];
      }
      if ( wantu && ( k < nct ) ) {

        // Place the transformation in U for subsequent back
        // multiplication.

        for ( i = k; i < m; i++ ) {
          U[ i * nu + k ] = A[ i * n + k ];
        }
      }
      if ( k < nrt ) {

        // Compute the k-th row transformation and place the
        // k-th super-diagonal in e[k].
        // Compute 2-norm without under/overflow.
        e[ k ] = 0;
        for ( i = k + 1; i < n; i++ ) {
          e[ k ] = hypot( e[ k ], e[ i ] );
        }
        if ( e[ k ] !== 0.0 ) {
          if ( e[ k + 1 ] < 0.0 ) {
            e[ k ] = -e[ k ];
          }
          for ( i = k + 1; i < n; i++ ) {
            e[ i ] /= e[ k ];
          }
          e[ k + 1 ] += 1.0;
        }
        e[ k ] = -e[ k ];
        if ( ( k + 1 < m ) && ( e[ k ] !== 0.0 ) ) {

          // Apply the transformation.

          for ( i = k + 1; i < m; i++ ) {
            work[ i ] = 0.0;
          }
          for ( j = k + 1; j < n; j++ ) {
            for ( i = k + 1; i < m; i++ ) {
              work[ i ] += e[ j ] * A[ i * n + j ];
            }
          }
          for ( j = k + 1; j < n; j++ ) {
            t = -e[ j ] / e[ k + 1 ];
            for ( i = k + 1; i < m; i++ ) {
              A[ i * n + j ] += t * work[ i ];
            }
          }
        }
        if ( wantv ) {

          // Place the transformation in V for subsequent
          // back multiplication.

          for ( i = k + 1; i < n; i++ ) {
            V[ i * n + k ] = e[ i ];
          }
        }
      }
    }

    // Set up the final bidiagonal matrix or order p.

    let p = min( n, m + 1 );
    if ( nct < n ) {
      s[ nct ] = A[ nct * n + nct ];
    }
    if ( m < p ) {
      s[ p - 1 ] = 0.0;
    }
    if ( nrt + 1 < p ) {
      e[ nrt ] = A[ nrt * n + p - 1 ];
    }
    e[ p - 1 ] = 0.0;

    // If required, generate U.

    if ( wantu ) {
      for ( j = nct; j < nu; j++ ) {
        for ( i = 0; i < m; i++ ) {
          U[ i * nu + j ] = 0.0;
        }
        U[ j * nu + j ] = 1.0;
      }
      for ( k = nct - 1; k >= 0; k-- ) {
        if ( s[ k ] !== 0.0 ) {
          for ( j = k + 1; j < nu; j++ ) {
            t = 0;
            for ( i = k; i < m; i++ ) {
              t += U[ i * nu + k ] * U[ i * nu + j ];
            }
            t = -t / U[ k * nu + k ];
            for ( i = k; i < m; i++ ) {
              U[ i * nu + j ] += t * U[ i * nu + k ];
            }
          }
          for ( i = k; i < m; i++ ) {
            U[ i * nu + k ] = -U[ i * nu + k ];
          }
          U[ k * nu + k ] = 1.0 + U[ k * nu + k ];
          for ( i = 0; i < k - 1; i++ ) {
            U[ i * nu + k ] = 0.0;
          }
        }
        else {
          for ( i = 0; i < m; i++ ) {
            U[ i * nu + k ] = 0.0;
          }
          U[ k * nu + k ] = 1.0;
        }
      }
    }

    // If required, generate V.

    if ( wantv ) {
      for ( k = n - 1; k >= 0; k-- ) {
        if ( ( k < nrt ) && ( e[ k ] !== 0.0 ) ) {
          for ( j = k + 1; j < nu; j++ ) {
            t = 0;
            for ( i = k + 1; i < n; i++ ) {
              t += V[ i * n + k ] * V[ i * n + j ];
            }
            t = -t / V[ ( k + 1 ) * n + k ];
            for ( i = k + 1; i < n; i++ ) {
              V[ i * n + j ] += t * V[ i * n + k ];
            }
          }
        }
        for ( i = 0; i < n; i++ ) {
          V[ i * n + k ] = 0.0;
        }
        V[ k * n + k ] = 1.0;
      }
    }

    // Main iteration loop for the singular values.

    const pp = p - 1;
    let iter = 0;
    const eps = pow( 2.0, -52.0 );
    const tiny = pow( 2.0, -966.0 );
    while ( p > 0 ) {
      let kase;

      // Here is where a test for too many iterations would go.
      if ( iter > 500 ) {
        break;
      }

      // This section of the program inspects for
      // negligible elements in the s and e arrays.  On
      // completion the variables kase and k are set as follows.

      // kase = 1   if s(p) and e[k-1] are negligible and k<p
      // kase = 2   if s(k) is negligible and k<p
      // kase = 3   if e[k-1] is negligible, k<p, and
      //        s(k), ..., s(p) are not negligible (qr step).
      // kase = 4   if e(p-1) is negligible (convergence).

      for ( k = p - 2; k >= -1; k-- ) {
        if ( k === -1 ) {
          break;
        }
        if ( abs( e[ k ] ) <=
             tiny + eps * ( abs( s[ k ] ) + abs( s[ k + 1 ] ) ) ) {
          e[ k ] = 0.0;
          break;
        }
      }
      if ( k === p - 2 ) {
        kase = 4;
      }
      else {
        let ks;
        for ( ks = p - 1; ks >= k; ks-- ) {
          if ( ks === k ) {
            break;
          }
          t = ( ks !== p ? abs( e[ ks ] ) : 0 ) +
              ( ks !== k + 1 ? abs( e[ ks - 1 ] ) : 0 );
          if ( abs( s[ ks ] ) <= tiny + eps * t ) {
            s[ ks ] = 0.0;
            break;
          }
        }
        if ( ks === k ) {
          kase = 3;
        }
        else if ( ks === p - 1 ) {
          kase = 1;
        }
        else {
          kase = 2;
          k = ks;
        }
      }
      k++;

      // Perform the task indicated by kase.

      switch( kase ) {

        // Deflate negligible s(p).

        case 1: {
          f = e[ p - 2 ];
          e[ p - 2 ] = 0.0;
          for ( j = p - 2; j >= k; j-- ) {
            t = hypot( s[ j ], f );
            cs = s[ j ] / t;
            sn = f / t;
            s[ j ] = t;
            if ( j !== k ) {
              f = -sn * e[ j - 1 ];
              e[ j - 1 ] = cs * e[ j - 1 ];
            }
            if ( wantv ) {
              for ( i = 0; i < n; i++ ) {
                t = cs * V[ i * n + j ] + sn * V[ i * n + p - 1 ];
                V[ i * n + p - 1 ] = -sn * V[ i * n + j ] + cs * V[ i * n + p - 1 ];
                V[ i * n + j ] = t;
              }
            }
          }
        }
          break;

        // Split at negligible s(k).

        case 2: {
          f = e[ k - 1 ];
          e[ k - 1 ] = 0.0;
          for ( j = k; j < p; j++ ) {
            t = hypot( s[ j ], f );
            cs = s[ j ] / t;
            sn = f / t;
            s[ j ] = t;
            f = -sn * e[ j ];
            e[ j ] = cs * e[ j ];
            if ( wantu ) {
              for ( i = 0; i < m; i++ ) {
                t = cs * U[ i * nu + j ] + sn * U[ i * nu + k - 1 ];
                U[ i * nu + k - 1 ] = -sn * U[ i * nu + j ] + cs * U[ i * nu + k - 1 ];
                U[ i * nu + j ] = t;
              }
            }
          }
        }
          break;

        // Perform one qr step.

        case 3: {

          // Calculate the shift.

          const scale = max( max( max( max( abs( s[ p - 1 ] ), abs( s[ p - 2 ] ) ), abs( e[ p - 2 ] ) ), abs( s[ k ] ) ), abs( e[ k ] ) );
          const sp = s[ p - 1 ] / scale;
          const spm1 = s[ p - 2 ] / scale;
          const epm1 = e[ p - 2 ] / scale;
          const sk = s[ k ] / scale;
          const ek = e[ k ] / scale;
          const b = ( ( spm1 + sp ) * ( spm1 - sp ) + epm1 * epm1 ) / 2.0;
          const c = ( sp * epm1 ) * ( sp * epm1 );
          let shift = 0.0;
          if ( ( b !== 0.0 ) || ( c !== 0.0 ) ) {
            shift = Math.sqrt( b * b + c );
            if ( b < 0.0 ) {
              shift = -shift;
            }
            shift = c / ( b + shift );
          }
          f = ( sk + sp ) * ( sk - sp ) + shift;
          let g = sk * ek;

          // Chase zeros.

          for ( j = k; j < p - 1; j++ ) {
            t = hypot( f, g );
            cs = f / t;
            sn = g / t;
            if ( j !== k ) {
              e[ j - 1 ] = t;
            }
            f = cs * s[ j ] + sn * e[ j ];
            e[ j ] = cs * e[ j ] - sn * s[ j ];
            g = sn * s[ j + 1 ];
            s[ j + 1 ] = cs * s[ j + 1 ];
            if ( wantv ) {
              for ( i = 0; i < n; i++ ) {
                t = cs * V[ i * n + j ] + sn * V[ i * n + j + 1 ];
                V[ i * n + j + 1 ] = -sn * V[ i * n + j ] + cs * V[ i * n + j + 1 ];
                V[ i * n + j ] = t;
              }
            }
            t = hypot( f, g );
            cs = f / t;
            sn = g / t;
            s[ j ] = t;
            f = cs * e[ j ] + sn * s[ j + 1 ];
            s[ j + 1 ] = -sn * e[ j ] + cs * s[ j + 1 ];
            g = sn * e[ j + 1 ];
            e[ j + 1 ] = cs * e[ j + 1 ];
            if ( wantu && ( j < m - 1 ) ) {
              for ( i = 0; i < m; i++ ) {
                t = cs * U[ i * nu + j ] + sn * U[ i * nu + j + 1 ];
                U[ i * nu + j + 1 ] = -sn * U[ i * nu + j ] + cs * U[ i * nu + j + 1 ];
                U[ i * nu + j ] = t;
              }
            }
          }
          e[ p - 2 ] = f;
          iter = iter + 1;
        }
          break;

        // Convergence.

        case 4: {

          // Make the singular values positive.

          if ( s[ k ] <= 0.0 ) {
            s[ k ] = ( s[ k ] < 0.0 ? -s[ k ] : 0.0 );
            if ( wantv ) {
              for ( i = 0; i <= pp; i++ ) {
                V[ i * n + k ] = -V[ i * n + k ];
              }
            }
          }

          // Order the singular values.

          while ( k < pp ) {
            if ( s[ k ] >= s[ k + 1 ] ) {
              break;
            }
            t = s[ k ];
            s[ k ] = s[ k + 1 ];
            s[ k + 1 ] = t;
            if ( wantv && ( k < n - 1 ) ) {
              for ( i = 0; i < n; i++ ) {
                t = V[ i * n + k + 1 ];
                V[ i * n + k + 1 ] = V[ i * n + k ];
                V[ i * n + k ] = t;
              }
            }
            if ( wantu && ( k < m - 1 ) ) {
              for ( i = 0; i < m; i++ ) {
                t = U[ i * nu + k + 1 ];
                U[ i * nu + k + 1 ] = U[ i * nu + k ];
                U[ i * nu + k ] = t;
              }
            }
            k++;
          }
          iter = 0;
          p--;
        }
          break;

        default:
          throw new Error( `invalid kase: ${kase}` );
      }
    }
  }

  /**
   * @public
   *
   * @returns {Matrix}
   */
  getU() {
    return new Matrix( this.m, Math.min( this.m + 1, this.n ), this.U, true ); // the "fast" flag added, since U is ArrayType
  }

  /**
   * @public
   *
   * @returns {Matrix}
   */
  getV() {
    return new Matrix( this.n, this.n, this.V, true );
  }

  /**
   * @public
   *
   * @returns {Array.<number>}
   */
  getSingularValues() {
    return this.s;
  }

  /**
   * @public
   *
   * @returns {Matrix}
   */
  getS() {
    const result = new Matrix( this.n, this.n );
    for ( let i = 0; i < this.n; i++ ) {
      for ( let j = 0; j < this.n; j++ ) {
        result.entries[ result.index( i, j ) ] = 0.0;
      }
      result.entries[ result.index( i, i ) ] = this.s[ i ];
    }
    return result;
  }

  /**
   * @public
   *
   * @returns {number}
   */
  norm2() {
    return this.s[ 0 ];
  }

  /**
   * @public
   *
   * @returns {number}
   */
  cond() {
    return this.s[ 0 ] / this.s[ Math.min( this.m, this.n ) - 1 ];
  }

  /**
   * @public
   *
   * @returns {number}
   */
  rank() {
    // changed to 23 from 52 (bits of mantissa), since we are using floats here!
    const eps = Math.pow( 2.0, -23.0 );
    const tol = Math.max( this.m, this.n ) * this.s[ 0 ] * eps;
    let r = 0;
    for ( let i = 0; i < this.s.length; i++ ) {
      if ( this.s[ i ] > tol ) {
        r++;
      }
    }
    return r;
  }

  /**
   * Constructs the Moore-Penrose pseudoinverse of the specified matrix, using the SVD construction.
   * @public
   *
   * See https://en.wikipedia.org/wiki/Moore%E2%80%93Penrose_pseudoinverse for details. Helpful for
   * linear least-squares regression.
   *
   * @param {Matrix} matrix, m x n
   * @returns {Matrix} - n x m
   */
  static pseudoinverse( matrix ) {
    const svd = new SingularValueDecomposition( matrix );
    const sigmaPseudoinverse = Matrix.diagonalMatrix( svd.getSingularValues().map( value => {
      if ( Math.abs( value ) < 1e-300 ) {
        return 0;
      }
      else {
        return 1 / value;
      }
    } ) );
    return svd.getV().times( sigmaPseudoinverse ).times( svd.getU().transpose() );
  }
}

dot.register( 'SingularValueDecomposition', SingularValueDecomposition );