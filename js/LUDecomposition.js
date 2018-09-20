// Copyright 2013-2015, University of Colorado Boulder

/**
 * LU decomposition, based on Jama (http://math.nist.gov/javanumerics/jama/)
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

define( function( require ) {
  'use strict';

  var dot = require( 'DOT/dot' );

  var ArrayType = window.Float64Array || Array;

  // require( 'DOT/Matrix' ); // commented out so Require.js doesn't complain about the circular dependency

  function LUDecomposition( matrix ) {
    var i;
    var j;
    var k;

    this.matrix = matrix;

    // TODO: size!
    this.LU = matrix.getArrayCopy();
    var LU = this.LU;
    this.m = matrix.getRowDimension();
    var m = this.m;
    this.n = matrix.getColumnDimension();
    var n = this.n;
    this.piv = new Uint32Array( m );
    for ( i = 0; i < m; i++ ) {
      this.piv[ i ] = i;
    }
    this.pivsign = 1;
    var LUcolj = new ArrayType( m );

    // Outer loop.

    for ( j = 0; j < n; j++ ) {

      // Make a copy of the j-th column to localize references.
      for ( i = 0; i < m; i++ ) {
        LUcolj[ i ] = LU[ matrix.index( i, j ) ];
      }

      // Apply previous transformations.

      for ( i = 0; i < m; i++ ) {
        // Most of the time is spent in the following dot product.
        var kmax = Math.min( i, j );
        var s = 0.0;
        for ( k = 0; k < kmax; k++ ) {
          var ik = matrix.index( i, k );
          s += LU[ ik ] * LUcolj[ k ];
        }

        LUcolj[ i ] -= s;
        LU[ matrix.index( i, j ) ] = LUcolj[ i ];
      }

      // Find pivot and exchange if necessary.

      var p = j;
      for ( i = j + 1; i < m; i++ ) {
        if ( Math.abs( LUcolj[ i ] ) > Math.abs( LUcolj[ p ] ) ) {
          p = i;
        }
      }
      if ( p !== j ) {
        for ( k = 0; k < n; k++ ) {
          var pk = matrix.index( p, k );
          var jk = matrix.index( j, k );
          var t = LU[ pk ];
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

  dot.register( 'LUDecomposition', LUDecomposition );

  LUDecomposition.prototype = {
    constructor: LUDecomposition,

    isNonsingular: function() {
      for ( var j = 0; j < this.n; j++ ) {
        var index = this.matrix.index( j, j );
        if ( this.LU[ index ] === 0 ) {
          return false;
        }
      }
      return true;
    },

    getL: function() {
      var result = new dot.Matrix( this.m, this.n );
      for ( var i = 0; i < this.m; i++ ) {
        for ( var j = 0; j < this.n; j++ ) {
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
    },

    getU: function() {
      var result = new dot.Matrix( this.n, this.n );
      for ( var i = 0; i < this.n; i++ ) {
        for ( var j = 0; j < this.n; j++ ) {
          if ( i <= j ) {
            result.entries[ result.index( i, j ) ] = this.LU[ this.matrix.index( i, j ) ];
          }
          else {
            result.entries[ result.index( i, j ) ] = 0.0;
          }
        }
      }
      return result;
    },

    getPivot: function() {
      var p = new Uint32Array( this.m );
      for ( var i = 0; i < this.m; i++ ) {
        p[ i ] = this.piv[ i ];
      }
      return p;
    },

    getDoublePivot: function() {
      var vals = new ArrayType( this.m );
      for ( var i = 0; i < this.m; i++ ) {
        vals[ i ] = this.piv[ i ];
      }
      return vals;
    },

    det: function() {
      if ( this.m !== this.n ) {
        throw new Error( 'Matrix must be square.' );
      }
      var d = this.pivsign;
      for ( var j = 0; j < this.n; j++ ) {
        d *= this.LU[ this.matrix.index( j, j ) ];
      }
      return d;
    },

    solve: function( matrix ) {
      var i;
      var j;
      var k;
      if ( matrix.getRowDimension() !== this.m ) {
        throw new Error( 'Matrix row dimensions must agree.' );
      }
      if ( !this.isNonsingular() ) {
        throw new Error( 'Matrix is singular.' );
      }

      // Copy right hand side with pivoting
      var nx = matrix.getColumnDimension();
      var Xmat = matrix.getArrayRowMatrix( this.piv, 0, nx - 1 );

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
  };

  return LUDecomposition;
} );
