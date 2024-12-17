// Copyright 2023-2024, University of Colorado Boulder

/**
 * Handles a univariate polynomial (a polynomial with one variable), like 2x^2 + 6x + 4.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import Complex from './Complex.js';
import dot from './dot.js';
import Matrix, { EigenvalueDecomposition, QRDecomposition } from './Matrix.js';

class UnivariatePolynomial {

  public readonly coefficients: number[];

  // coefficients indexed by degree, so e.g. 2x^2 + 6x + 4 would be input as [ 4, 6, 2 ], because
  // coefficients[ 2 ] would be the coefficient of x^2, etc.
  public constructor( coefficients: number[] ) {

    // Get rid of "leading" zero coefficients
    const nontrivialCoefficients = coefficients.slice();
    while ( nontrivialCoefficients.length && nontrivialCoefficients[ nontrivialCoefficients.length - 1 ] === 0 ) {
      nontrivialCoefficients.pop();
    }

    this.coefficients = nontrivialCoefficients;
  }

  public plus( polynomial: UnivariatePolynomial ): UnivariatePolynomial {
    const coefficients = [];
    for ( let i = 0; i < Math.max( this.coefficients.length, polynomial.coefficients.length ); i++ ) {
      coefficients.push( this.getCoefficient( i ) + polynomial.getCoefficient( i ) );
    }
    return new UnivariatePolynomial( coefficients );
  }

  public minus( polynomial: UnivariatePolynomial ): UnivariatePolynomial {
    const coefficients = [];
    for ( let i = 0; i < Math.max( this.coefficients.length, polynomial.coefficients.length ); i++ ) {
      coefficients.push( this.getCoefficient( i ) - polynomial.getCoefficient( i ) );
    }
    return new UnivariatePolynomial( coefficients );
  }

  public times( polynomial: UnivariatePolynomial ): UnivariatePolynomial {
    const coefficients = [];
    while ( coefficients.length < this.coefficients.length + polynomial.coefficients.length - 1 ) {
      coefficients.push( 0 );
    }
    for ( let i = 0; i < this.coefficients.length; i++ ) {
      for ( let j = 0; j < polynomial.coefficients.length; j++ ) {
        coefficients[ i + j ] += this.getCoefficient( i ) * polynomial.getCoefficient( j );
      }
    }
    return new UnivariatePolynomial( coefficients );
  }

  public dividedBy( polynomial: UnivariatePolynomial ): { quotient: UnivariatePolynomial; remainder: UnivariatePolynomial } {
    let q = new UnivariatePolynomial( [] );
    let r: UnivariatePolynomial = this; // eslint-disable-line consistent-this, @typescript-eslint/no-this-alias
    const d = polynomial.degree;
    const c = polynomial.coefficients[ polynomial.coefficients.length - 1 ];
    while ( r.degree >= d ) {
      const s = UnivariatePolynomial.singleCoefficient( r.getCoefficient( r.degree ) / c, r.degree - d );
      q = q.plus( s );
      r = r.minus( s.times( polynomial ) );
    }
    return {
      quotient: q,
      remainder: r
    };
  }

  public gcd( polynomial: UnivariatePolynomial ): UnivariatePolynomial {
    let a: UnivariatePolynomial = this; // eslint-disable-line consistent-this, @typescript-eslint/no-this-alias
    let b = polynomial;
    while ( !b.isZero() ) {
      const t = b;
      b = a.dividedBy( b ).remainder;
      a = t;
    }
    return a;
  }

  public equals( polynomial: UnivariatePolynomial ): boolean {
    return this.coefficients.length === polynomial.coefficients.length && this.coefficients.every( ( coefficient, i ) => coefficient === polynomial.coefficients[ i ] );
  }

  public getCoefficient( degree: number ): number {
    return degree < this.coefficients.length ? this.coefficients[ degree ] : 0;
  }

  public get degree(): number {
    return this.coefficients.length - 1;
  }

  public isZero(): boolean {
    return this.coefficients.length === 0;
  }

  public getMonicPolynomial(): UnivariatePolynomial {
    if ( this.isZero() ) {
      return this;
    }
    else {
      const leadingCoefficient = this.coefficients[ this.coefficients.length - 1 ];
      return new UnivariatePolynomial( this.coefficients.map( coefficient => coefficient / leadingCoefficient ) );
    }
  }

  public evaluate( x: number ): number {
    // https://en.wikipedia.org/wiki/Horner%27s_method
    let result = this.coefficients[ this.coefficients.length - 1 ];
    for ( let i = this.coefficients.length - 2; i >= 0; i-- ) {
      result = result * x + this.coefficients[ i ];
    }
    return result;
  }

  public evaluateComplex( x: Complex ): Complex {
    // https://en.wikipedia.org/wiki/Horner%27s_method
    let result = Complex.real( this.coefficients[ this.coefficients.length - 1 ] );
    for ( let i = this.coefficients.length - 2; i >= 0; i-- ) {
      result = result.times( x ).plus( Complex.real( this.coefficients[ i ] ) );
    }
    return result;
  }

  public getRoots(): Complex[] {
    if ( this.isZero() || this.degree === 0 ) {
      // TODO: how to handle? https://github.com/phetsims/kite/issues/97
      return [];
    }
    else if ( this.degree === 1 ) {
      return [ Complex.real( -this.coefficients[ 0 ] / this.coefficients[ 1 ] ) ];
    }
    else if ( this.coefficients[ 0 ] === 0 ) {
      // x=0 is a root!
      const roots = new UnivariatePolynomial( this.coefficients.slice( 1 ) ).getRoots();
      if ( !roots.some( root => root.equalsEpsilon( Complex.real( 0 ), 1e-10 ) ) ) {
        roots.push( Complex.real( 0 ) );
      }
      return roots;
    }
    else if ( this.degree === 2 ) {
      return Complex.solveQuadraticRoots(
        Complex.real( this.coefficients[ 2 ] ),
        Complex.real( this.coefficients[ 1 ] ),
        Complex.real( this.coefficients[ 0 ] )
      )!;
    }
    else if ( this.degree === 3 ) {
      return Complex.solveCubicRoots(
        Complex.real( this.coefficients[ 3 ] ),
        Complex.real( this.coefficients[ 2 ] ),
        Complex.real( this.coefficients[ 1 ] ),
        Complex.real( this.coefficients[ 0 ] )
      )!;
    }
    else {
      // Use the eigenvalues of the companion matrix, since it is the zeros of the characteristic polynomial

      // https://en.wikipedia.org/wiki/Companion_matrix
      const companionMatrix = new Matrix( this.degree, this.degree );
      for ( let i = 0; i < this.degree; i++ ) {
        if ( i < this.degree - 1 ) {
          companionMatrix.set( i + 1, i, 1 );
        }
        companionMatrix.set( i, this.degree - 1, -this.coefficients[ i ] / this.coefficients[ this.degree ] );
      }
      console.log( companionMatrix.toString() );

      let matrix = companionMatrix;
      const epsilon = 1e-13;

      // TODO: custom number of steps? https://github.com/phetsims/kite/issues/97
      for ( let i = 0; i < 500; i++ ) {
        const qr = new QRDecomposition( matrix );
        matrix = qr.getR().times( qr.getQ() );

        if ( i % 10 === 0 ) {
          let maxLowerTriangular = 0;
          for ( let i = 0; i < this.degree; i++ ) {
            for ( let j = 0; j < i; j++ ) {
              maxLowerTriangular = Math.max( maxLowerTriangular, Math.abs( matrix.get( i, j ) ) );
            }
          }
          // TODO: 1000 seems excessive OR not enough, depending on the polynomial? https://github.com/phetsims/kite/issues/97
          if ( maxLowerTriangular < epsilon || i > 1000 ) {
            break;
          }
        }
      }
      const qrValues = _.range( 0, this.degree ).map( i => Complex.real( matrix.get( i, i ) ) );

      const decomp = new EigenvalueDecomposition( companionMatrix );

      // @ts-expect-error
      const realValues: Float64Array = decomp.getRealEigenvalues();
      // @ts-expect-error
      const imaginaryValues: Float64Array = decomp.getImagEigenvalues();
      const decompValues = _.range( 0, this.degree ).map( i => new Complex( realValues[ i ], imaginaryValues[ i ] ) );

      // TODO: complex values! We seem to be failing here https://github.com/phetsims/kite/issues/97
      return qrValues ? qrValues : decompValues;
    }
  }

  public static singleCoefficient( coefficient: number, degree: number ): UnivariatePolynomial {
    const coefficients = [];
    while ( coefficients.length < degree ) {
      coefficients.push( 0 );
    }
    coefficients.push( coefficient );
    return new UnivariatePolynomial( coefficients );
  }

  public static readonly ZERO = new UnivariatePolynomial( [] );
}

dot.register( 'UnivariatePolynomial', UnivariatePolynomial );
export default UnivariatePolynomial;