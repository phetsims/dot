// Copyright 2013-2022, University of Colorado Boulder

/**
 * Arbitrary-dimensional matrix, based on Jama (http://math.nist.gov/javanumerics/jama/)
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import isArray from '../../phet-core/js/isArray.js';
import dot from './dot.js';
import './EigenvalueDecomposition.js';
import LUDecomposition from './LUDecomposition.js';
import QRDecomposition from './QRDecomposition.js';
import SingularValueDecomposition from './SingularValueDecomposition.js';
import Vector2 from './Vector2.js';
import Vector3 from './Vector3.js';
import Vector4 from './Vector4.js';

const ArrayType = window.Float64Array || Array;

class Matrix {
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
   * TODO: inline this places if we aren't using an inlining compiler! (check performance)
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
export default Matrix;