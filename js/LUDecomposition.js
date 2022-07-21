// Copyright 2013-2022, University of Colorado Boulder

/**
 * LU decomposition, based on Jama (http://math.nist.gov/javanumerics/jama/).  Please note the arbitrary-precision
 * copy LUDecompositionDecimal which should be maintained with this file.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import dot from './dot.js';
import Matrix from './Matrix.js';

const ArrayType = window.Float64Array || Array;

class LUDecomposition {
  constructor( matrix ) {
    let i;
    let j;
    let k;

    this.matrix = matrix;

    // TODO: size!
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

export default LUDecomposition;