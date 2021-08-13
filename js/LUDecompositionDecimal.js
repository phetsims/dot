// Copyright 2021, University of Colorado Boulder

/**
 * Arbitrary-precision LU Decomposition using decimal.js and copy-pasted from LUDecomposition.
 * This is a copy-paste implementation so that the performance characteristics of LUDecomposition are not disturbed.
 * This file should be maintained with LUDecomposition.js
 *
 * This module requires the presence of the preload Decimal.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 * @author Sam Reid (PhET Interactive Simulations)
 */

import dot from './dot.js';

class LUDecompositionDecimal {

  /**
   * @param matrix
   * @param {constructor} Decimal - from decimal library
   */
  constructor( matrix, Decimal ) {
    let i;
    let j;
    let k;

    this.matrix = matrix;

    // TODO: size!
    this.LU = [];
    matrix.entries.forEach( entry => {
      this.LU.push( new Decimal( entry ) );
    } );

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
    const LUcolj = new Array( m );

    // Outer loop.

    for ( j = 0; j < n; j++ ) {

      // Make a copy of the j-th column to localize references.
      for ( i = 0; i < m; i++ ) {
        LUcolj[ i ] = new Decimal( LU[ matrix.index( i, j ) ] );
      }

      // Apply previous transformations.

      for ( i = 0; i < m; i++ ) {
        // Most of the time is spent in the following dot product.
        const kmax = Math.min( i, j );
        let s = new Decimal( 0 );
        for ( k = 0; k < kmax; k++ ) {
          const ik = matrix.index( i, k );
          const a = new Decimal( LU[ ik ] );
          const b = LUcolj[ k ];
          s = s.plus( a.times( b ) );
        }

        LUcolj[ i ] = LUcolj[ i ].minus( s );
        LU[ matrix.index( i, j ) ] = LUcolj[ i ];
      }

      // Find pivot and exchange if necessary.

      let p = j;
      for ( i = j + 1; i < m; i++ ) {
        if ( LUcolj[ i ].abs() > LUcolj[ p ].abs() ) {
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

      if ( j < m && !LU[ this.matrix.index( j, j ) ].isZero() ) {
        for ( i = j + 1; i < m; i++ ) {
          LU[ matrix.index( i, j ) ] = LU[ matrix.index( i, j ) ].dividedBy( LU[ matrix.index( j, j ) ] );
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
      if ( this.LU[ index ].isZero() ) {
        return false;
      }
    }
    return true;
  }

  /**
   * @public
   *
   * @param {Matrix} matrix
   * @param {constructor} Decimal - from decimal library
   * @returns {Matrix}
   */
  solve( matrix, Decimal ) {
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
    const entries = [];
    Xmat.entries.forEach( e => entries.push( new Decimal( e ) ) );

    // Solve L*Y = B(piv,:)
    for ( k = 0; k < this.n; k++ ) {
      for ( i = k + 1; i < this.n; i++ ) {
        for ( j = 0; j < nx; j++ ) {
          entries[ Xmat.index( i, j ) ] = entries[ Xmat.index( i, j ) ].minus( entries[ Xmat.index( k, j ) ].times( this.LU[ this.matrix.index( i, k ) ] ) );
        }
      }
    }

    // Solve U*X = Y;
    for ( k = this.n - 1; k >= 0; k-- ) {
      for ( j = 0; j < nx; j++ ) {
        entries[ Xmat.index( k, j ) ] = entries[ Xmat.index( k, j ) ].dividedBy( this.LU[ this.matrix.index( k, k ) ] );
      }
      for ( i = 0; i < k; i++ ) {
        for ( j = 0; j < nx; j++ ) {
          entries[ Xmat.index( i, j ) ] = entries[ Xmat.index( i, j ) ].minus( entries[ Xmat.index( k, j ) ].times( this.LU[ this.matrix.index( i, k ) ] ) );
        }
      }
    }

    Xmat.entries = entries.map( e => e.toNumber() );
    return Xmat;
  }
}

dot.register( 'LUDecompositionDecimal', LUDecompositionDecimal );

export default LUDecompositionDecimal;