// Copyright 2013-2015, University of Colorado Boulder

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

define( function( require ) {
  'use strict';

  var dot = require( 'DOT/dot' );

  var ArrayType = window.Float64Array || Array;

  // require( 'DOT/Matrix' ); // commented out so Require.js doesn't complain about the circular dependency

  /**
   *
   * @param {Matrix} matrix - must be a square matrix
   * @constructor
   */
  function EigenvalueDecomposition( matrix ) {
    var i;
    var j;

    var A = matrix.entries;
    this.n = matrix.getColumnDimension(); // @private  Row and column dimension (square matrix).
    var n = this.n;
    this.V = new ArrayType( n * n ); // @private Array for internal storage of eigenvectors.

    // Arrays for internal storage of eigenvalues.
    this.d = new ArrayType( n ); // @private
    this.e = new ArrayType( n ); // @private

    this.issymmetric = true;
    for ( j = 0; (j < n) && this.issymmetric; j++ ) {
      for ( i = 0; (i < n) && this.issymmetric; i++ ) {
        this.issymmetric = (A[ i * this.n + j ] === A[ j * this.n + i ]);
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

  dot.register( 'EigenvalueDecomposition', EigenvalueDecomposition );

  EigenvalueDecomposition.prototype = {
    constructor: EigenvalueDecomposition,

    /**
     * Returns a square array of all eigenvectors arranged in a columnar format
     * @public
     * @returns {ArrayType.<number>} - a n*n matrix
     */
    getV: function() {
      return this.V.copy();
    },

    /**
     * Returns an array that contains the real part of the eigenvalues
     * @public
     * @returns {ArrayType.<number>} - a one dimensional array
     */
    getRealEigenvalues: function() {
      return this.d;
    },

    /**
     * Returns an array that contains the imaginary parts of the eigenvalues
     * @public
     * @returns {ArrayType.<number>} - a one dimensional array
     */
    getImagEigenvalues: function() {
      return this.e;
    },

    /**
     * Return the block diagonal eigenvalue matrix
     * @public
     * @returns {Matrix} - a n * n matrix
     */
    getD: function() {
      var n = this.n;
      var d = this.d;
      var e = this.e;

      var X = new dot.Matrix( n, n );
      var D = X.entries;
      for ( var i = 0; i < n; i++ ) {
        for ( var j = 0; j < n; j++ ) {
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
    },

    /**
     * Symmetric Householder reduction to tridiagonal form.
     * @private
     */
    tred2: function() {
      var n = this.n;
      var V = this.V;
      var d = this.d;
      var e = this.e;
      var i;
      var j;
      var k;
      var f;
      var g;
      var h;

      //  This is derived from the Algol procedures tred2 by
      //  Bowdler, Martin, Reinsch, and Wilkinson, Handbook for
      //  Auto. Comp., Vol.ii-Linear Algebra, and the corresponding
      //  Fortran subroutine in EISPACK.

      for ( j = 0; j < n; j++ ) {
        d[ j ] = V[ (n - 1) * n + j ];
      }

      // Householder reduction to tridiagonal form.

      for ( i = n - 1; i > 0; i-- ) {

        // Scale to avoid under/overflow.

        var scale = 0.0;
        h = 0.0;
        for ( k = 0; k < i; k++ ) {
          scale = scale + Math.abs( d[ k ] );
        }
        if ( scale === 0.0 ) {
          e[ i ] = d[ i - 1 ];
          for ( j = 0; j < i; j++ ) {
            d[ j ] = V[ (i - 1) * n + j ];
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
          var hh = f / (h + h);
          for ( j = 0; j < i; j++ ) {
            e[ j ] -= hh * d[ j ];
          }
          for ( j = 0; j < i; j++ ) {
            f = d[ j ];
            g = e[ j ];
            for ( k = j; k <= i - 1; k++ ) {
              V[ k * n + j ] -= (f * e[ k ] + g * d[ k ]);
            }
            d[ j ] = V[ (i - 1) * n + j ];
            V[ i * this.n + j ] = 0.0;
          }
        }
        d[ i ] = h;
      }

      // Accumulate transformations.

      for ( i = 0; i < n - 1; i++ ) {
        V[ (n - 1) * n + i ] = V[ i * n + i ];
        V[ i * n + i ] = 1.0;
        h = d[ i + 1 ];
        if ( h !== 0.0 ) {
          for ( k = 0; k <= i; k++ ) {
            d[ k ] = V[ k * n + (i + 1) ] / h;
          }
          for ( j = 0; j <= i; j++ ) {
            g = 0.0;
            for ( k = 0; k <= i; k++ ) {
              g += V[ k * n + (i + 1) ] * V[ k * n + j ];
            }
            for ( k = 0; k <= i; k++ ) {
              V[ k * n + j ] -= g * d[ k ];
            }
          }
        }
        for ( k = 0; k <= i; k++ ) {
          V[ k * n + (i + 1) ] = 0.0;
        }
      }
      for ( j = 0; j < n; j++ ) {
        d[ j ] = V[ (n - 1) * n + j ];
        V[ (n - 1) * n + j ] = 0.0;
      }
      V[ (n - 1) * n + (n - 1) ] = 1.0;
      e[ 0 ] = 0.0;
    },

    /**
     * Symmetric tridiagonal QL algorithm.
     * @private
     */
    tql2: function() {
      var n = this.n;
      var V = this.V;
      var d = this.d;
      var e = this.e;
      var i;
      var j;
      var k;
      var l;
      var g;
      var p;
      var iter;

      //  This is derived from the Algol procedures tql2, by
      //  Bowdler, Martin, Reinsch, and Wilkinson, Handbook for
      //  Auto. Comp., Vol.ii-Linear Algebra, and the corresponding
      //  Fortran subroutine in EISPACK.

      for ( i = 1; i < n; i++ ) {
        e[ i - 1 ] = e[ i ];
      }
      e[ n - 1 ] = 0.0;

      var f = 0.0;
      var tst1 = 0.0;
      var eps = Math.pow( 2.0, -52.0 );
      for ( l = 0; l < n; l++ ) {

        // Find small subdiagonal element

        tst1 = Math.max( tst1, Math.abs( d[ l ] ) + Math.abs( e[ l ] ) );
        var m = l;
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
            p = (d[ l + 1 ] - g) / (2.0 * e[ l ]);
            var r = dot.Matrix.hypot( p, 1.0 );
            if ( p < 0 ) {
              r = -r;
            }
            d[ l ] = e[ l ] / (p + r);
            d[ l + 1 ] = e[ l ] * (p + r);
            var dl1 = d[ l + 1 ];
            var h = g - d[ l ];
            for ( i = l + 2; i < n; i++ ) {
              d[ i ] -= h;
            }
            f = f + h;

            // Implicit QL transformation.

            p = d[ m ];
            var c = 1.0;
            var c2 = c;
            var c3 = c;
            var el1 = e[ l + 1 ];
            var s = 0.0;
            var s2 = 0.0;
            for ( i = m - 1; i >= l; i-- ) {
              c3 = c2;
              c2 = c;
              s2 = s;
              g = c * e[ i ];
              h = c * p;
              r = dot.Matrix.hypot( p, e[ i ] );
              e[ i + 1 ] = s * r;
              s = e[ i ] / r;
              c = p / r;
              p = c * d[ i ] - s * g;
              d[ i + 1 ] = h + s * (c * g + s * d[ i ]);

              // Accumulate transformation.

              for ( k = 0; k < n; k++ ) {
                h = V[ k * n + (i + 1) ];
                V[ k * n + (i + 1) ] = s * V[ k * n + i ] + c * h;
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
    },

    /**
     *  Nonsymmetric reduction to Hessenberg form.
     *  @private
     */
    orthes: function() {
      var n = this.n;
      var V = this.V;
      var H = this.H;
      var ort = this.ort;
      var i;
      var j;
      var m;
      var f;
      var g;

      //  This is derived from the Algol procedures orthes and ortran,
      //  by Martin and Wilkinson, Handbook for Auto. Comp.,
      //  Vol.ii-Linear Algebra, and the corresponding
      //  Fortran subroutines in EISPACK.

      var low = 0;
      var high = n - 1;

      for ( m = low + 1; m <= high - 1; m++ ) {

        // Scale column.

        var scale = 0.0;
        for ( i = m; i <= high; i++ ) {
          scale = scale + Math.abs( H[ i * n + (m - 1) ] );
        }
        if ( scale !== 0.0 ) {

          // Compute Householder transformation.

          var h = 0.0;
          for ( i = high; i >= m; i-- ) {
            ort[ i ] = H[ i * n + (m - 1) ] / scale;
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
          H[ m * n + (m - 1) ] = scale * g;
        }
      }

      // Accumulate transformations (Algol's ortran).

      for ( i = 0; i < n; i++ ) {
        for ( j = 0; j < n; j++ ) {
          V[ i * this.n + j ] = (i === j ? 1.0 : 0.0);
        }
      }

      for ( m = high - 1; m >= low + 1; m-- ) {
        if ( H[ m * n + (m - 1) ] !== 0.0 ) {
          for ( i = m + 1; i <= high; i++ ) {
            ort[ i ] = H[ i * n + (m - 1) ];
          }
          for ( j = m; j <= high; j++ ) {
            g = 0.0;
            for ( i = m; i <= high; i++ ) {
              g += ort[ i ] * V[ i * this.n + j ];
            }
            // Double division avoids possible underflow
            g = (g / ort[ m ]) / H[ m * n + (m - 1) ];
            for ( i = m; i <= high; i++ ) {
              V[ i * this.n + j ] += g * ort[ i ];
            }
          }
        }
      }
    },

    // Complex scalar division.
    cdiv: function( xr, xi, yr, yi ) {
      var r;
      var d;
      if ( Math.abs( yr ) > Math.abs( yi ) ) {
        r = yi / yr;
        d = yr + r * yi;
        this.cdivr = (xr + r * xi) / d;
        this.cdivi = (xi - r * xr) / d;
      }
      else {
        r = yr / yi;
        d = yi + r * yr;
        this.cdivr = (r * xr + xi) / d;
        this.cdivi = (r * xi - xr) / d;
      }
    },

    /**
     * This methods finds the eigenvalues and eigenvectors
     * of a real upper hessenberg matrix by the QR algorithm
     *
     * Nonsymmetric reduction from Hessenberg to real Schur form.
     * https://en.wikipedia.org/wiki/QR_algorithm
     *
     * @private
     */
    hqr2: function() {
      var n;
      var V = this.V;
      var d = this.d;
      var e = this.e;
      var H = this.H;
      var i;
      var j;
      var k;
      var l;
      var m;
      var iter;

      //  This is derived from the Algol procedure hqr2,
      //  by Martin and Wilkinson, Handbook for Auto. Comp.,
      //  Vol.ii-Linear Algebra, and the corresponding
      //  Fortran subroutine in EISPACK.

      // Initialize

      var nn = this.n;
      n = nn - 1;
      var low = 0;
      var high = nn - 1;
      var eps = Math.pow( 2.0, -52.0 );
      var exshift = 0.0;
      var p = 0;
      var q = 0;
      var r = 0;
      var s = 0;
      var z = 0;
      var t;
      var w;
      var x;
      var y;

      // Store roots isolated by balanc and compute matrix norm

      var norm = 0.0;
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
          s = Math.abs( H[ (l - 1) * n + (l - 1) ] ) + Math.abs( H[ l * n + l ] );
          if ( s === 0.0 ) {
            s = norm;
          }
          if ( Math.abs( H[ l * n + (l - 1) ] ) < eps * s ) {
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
          w = H[ n * n + n - 1 ] * H[ (n - 1) * n + n ];
          p = (H[ (n - 1) * n + (n - 1) ] - H[ n * n + n ]) / 2.0;
          q = p * p + w;
          z = Math.sqrt( Math.abs( q ) );
          H[ n * n + n ] = H[ n * n + n ] + exshift;
          H[ (n - 1) * n + (n - 1) ] = H[ (n - 1) * n + (n - 1) ] + exshift;
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
              z = H[ (n - 1) * n + j ];
              H[ (n - 1) * n + j ] = q * z + p * H[ n * n + j ];
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
            y = H[ (n - 1) * n + (n - 1) ];
            w = H[ n * n + n - 1 ] * H[ (n - 1) * n + n ];
          }

          // Wilkinson's original ad hoc shift

          if ( iter === 10 ) {
            exshift += x;
            for ( i = low; i <= n; i++ ) {
              H[ i * n + i ] -= x;
            }
            s = Math.abs( H[ n * n + n - 1 ] ) + Math.abs( H[ (n - 1) * n + n - 2 ] );
            x = y = 0.75 * s;
            w = -0.4375 * s * s;
          }

          // MATLAB's new ad hoc shift

          if ( iter === 30 ) {
            s = (y - x) / 2.0;
            s = s * s + w;
            if ( s > 0 ) {
              s = Math.sqrt( s );
              if ( y < x ) {
                s = -s;
              }
              s = x - w / ((y - x) / 2.0 + s);
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
            p = (r * s - w) / H[ (m + 1) * n + m ] + H[ m * n + m + 1 ];
            q = H[ (m + 1) * n + m + 1 ] - z - r - s;
            r = H[ (m + 2) * n + m + 1 ];
            s = Math.abs( p ) + Math.abs( q ) + Math.abs( r );
            p = p / s;
            q = q / s;
            r = r / s;
            if ( m === l ) {
              break;
            }
            if ( Math.abs( H[ m * n + (m - 1) ] ) * (Math.abs( q ) + Math.abs( r )) <
                 eps * (Math.abs( p ) * (Math.abs( H[ (m - 1) * n + m - 1 ] ) + Math.abs( z ) +
                                         Math.abs( H[ (m + 1) * n + m + 1 ] ))) ) {
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
            var notlast = (k !== n - 1);
            if ( k !== m ) {
              p = H[ k * n + k - 1 ];
              q = H[ (k + 1) * n + k - 1 ];
              r = (notlast ? H[ (k + 2) * n + k - 1 ] : 0.0);
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
                p = H[ k * n + j ] + q * H[ (k + 1) * n + j ];
                if ( notlast ) {
                  p = p + r * H[ (k + 2) * n + j ];
                  H[ (k + 2) * n + j ] = H[ (k + 2) * n + j ] - p * z;
                }
                H[ k * n + j ] = H[ k * n + j ] - p * x;
                H[ (k + 1) * n + j ] = H[ (k + 1) * n + j ] - p * y;
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
                  H[ i * n + n ] = -r / (eps * norm);
                }

                // Solve real equations

              }
              else {
                x = H[ i * n + i + 1 ];
                y = H[ (i + 1) * n + i ];
                q = (d[ i ] - p) * (d[ i ] - p) + e[ i ] * e[ i ];
                t = (x * s - z * r) / q;
                H[ i * n + n ] = t;
                if ( Math.abs( x ) > Math.abs( z ) ) {
                  H[ (i + 1) * n + n ] = (-r - w * t) / x;
                }
                else {
                  H[ (i + 1) * n + n ] = (-s - y * t) / z;
                }
              }

              // Overflow control

              t = Math.abs( H[ i * n + n ] );
              if ( (eps * t) * t > 1 ) {
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

          if ( Math.abs( H[ n * n + n - 1 ] ) > Math.abs( H[ (n - 1) * n + n ] ) ) {
            H[ (n - 1) * n + (n - 1) ] = q / H[ n * n + n - 1 ];
            H[ (n - 1) * n + n ] = -(H[ n * n + n ] - p) / H[ n * n + n - 1 ];
          }
          else {
            this.cdiv( 0.0, -H[ (n - 1) * n + n ], H[ (n - 1) * n + (n - 1) ] - p, q );
            H[ (n - 1) * n + (n - 1) ] = this.cdivr;
            H[ (n - 1) * n + n ] = this.cdivi;
          }
          H[ n * n + n - 1 ] = 0.0;
          H[ n * n + n ] = 1.0;
          for ( i = n - 2; i >= 0; i-- ) {
            var ra;
            var sa;
            var vr;
            var vi;
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
                y = H[ (i + 1) * n + i ];
                vr = (d[ i ] - p) * (d[ i ] - p) + e[ i ] * e[ i ] - q * q;
                vi = (d[ i ] - p) * 2.0 * q;
                if ( vr === 0.0 && vi === 0.0 ) {
                  vr = eps * norm * (Math.abs( w ) + Math.abs( q ) +
                                     Math.abs( x ) + Math.abs( y ) + Math.abs( z ));
                }
                this.cdiv( x * r - z * ra + q * sa, x * s - z * sa - q * ra, vr, vi );
                H[ i * n + n - 1 ] = this.cdivr;
                H[ i * n + n ] = this.cdivi;
                if ( Math.abs( x ) > (Math.abs( z ) + Math.abs( q )) ) {
                  H[ (i + 1) * n + n - 1 ] = (-ra - w * H[ i * n + n - 1 ] + q * H[ i * n + n ]) / x;
                  H[ (i + 1) * n + n ] = (-sa - w * H[ i * n + n ] - q * H[ i * n + n - 1 ]) / x;
                }
                else {
                  this.cdiv( -r - y * H[ i * n + n - 1 ], -s - y * H[ i * n + n ], z, q );
                  H[ (i + 1) * n + n - 1 ] = this.cdivr;
                  H[ (i + 1) * n + n ] = this.cdivi;
                }
              }

              // Overflow control
              t = Math.max( Math.abs( H[ i * n + n - 1 ] ), Math.abs( H[ i * n + n ] ) );
              if ( (eps * t) * t > 1 ) {
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
  };

  return EigenvalueDecomposition;
} );
