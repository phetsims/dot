// Copyright 2013-2022, University of Colorado Boulder

/**
 * QR decomposition, based on Jama (http://math.nist.gov/javanumerics/jama/)
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import dot from './dot.js';
import Matrix from './Matrix.js';

const ArrayType = window.Float64Array || Array;

class QRDecomposition {
  /**
   * @param {Matrix} matrix
   */
  constructor( matrix ) {
    this.matrix = matrix;

    // TODO: size!
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

export default QRDecomposition;