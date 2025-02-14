// Copyright 2013-2025, University of Colorado Boulder

/**
 * A complex number with mutable and immutable methods.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Matt Pennington (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import dot from './dot.js';
import { cosh } from './util/cosh.js';
import { sinh } from './util/sinh.js';

export default class Complex {

  // The real part. For a complex number $a+bi$, this is $a$.
  public real: number;

  // The imaginary part. For a complex number $a+bi$, this is $b$.
  public imaginary: number;

  /**
   * Creates a complex number, that has both a real and imaginary part.
   *
   * @param real - The real part. For a complex number $a+bi$, this should be $a$.
   * @param imaginary - The imaginary part. For a complex number $a+bi$, this should be $b$.
   */
  public constructor( real: number, imaginary: number ) {
    this.real = real;
    this.imaginary = imaginary;
  }

  /**
   * Creates a copy of this complex, or if a complex is passed in, set that complex's values to ours.
   *
   * This is the immutable form of the function set(), if a complex is provided. This will return a new complex, and
   * will not modify this complex.
   *
   * @param [complex] - If not provided, creates a new Complex with filled in values. Otherwise, fills
   *                              in the values of the provided complex so that it equals this complex.
   */
  public copy( complex?: Complex ): Complex {
    if ( complex ) {
      return complex.set( this );
    }
    else {
      return new Complex( this.real, this.imaginary );
    }
  }

  /**
   * The phase / argument of the complex number.
   */
  public phase(): number {
    return Math.atan2( this.imaginary, this.real );
  }

  /**
   * The magnitude (Euclidean/L2 Norm) of this complex number, i.e. $\sqrt{a^2+b^2}$.
   */
  public getMagnitude(): number {
    return Math.sqrt( this.magnitudeSquared );
  }

  public get magnitude(): number {
    return this.getMagnitude();
  }

  /**
   * The squared magnitude (square of the Euclidean/L2 Norm) of this complex, i.e. $a^2+b^2$.
   */
  public getMagnitudeSquared(): number {
    return this.real * this.real + this.imaginary * this.imaginary;
  }

  public get magnitudeSquared(): number {
    return this.getMagnitudeSquared();
  }

  /**
   * Returns the argument of this complex number (immutable)
   */
  public getArgument(): number {
    return Math.atan2( this.imaginary, this.real );
  }

  public get argument(): number {
    return this.getArgument();
  }

  /**
   * Exact equality comparison between this Complex and another Complex.
   *
   * @returns Whether the two complex numbers have equal components
   */
  public equals( other: Complex ): boolean {
    return this.real === other.real && this.imaginary === other.imaginary;
  }

  /**
   * Approximate equality comparison between this Complex and another Complex.
   *
   * @returns - Whether difference between the two complex numbers has no component with an absolute value
   *            greater than epsilon.
   */
  public equalsEpsilon( other: Complex, epsilon = 0 ): boolean {
    return Math.max( Math.abs( this.real - other.real ), Math.abs( this.imaginary - other.imaginary ) ) <= epsilon;
  }

  /**
   * Addition of this Complex and another Complex, returning a copy.
   *
   * This is the immutable form of the function add(). This will return a new Complex, and will not modify
   * this Complex.
   */
  public plus( c: Complex ): Complex {
    return new Complex( this.real + c.real, this.imaginary + c.imaginary );
  }

  /**
   * Subtraction of this Complex by another Complex c, returning a copy.
   *
   * This is the immutable form of the function subtract(). This will return a new Complex, and will not modify
   * this Complex.
   */
  public minus( c: Complex ): Complex {
    return new Complex( this.real - c.real, this.imaginary - c.imaginary );
  }

  /**
   * Complex multiplication.
   * Immutable version of multiply
   */
  public times( c: Complex ): Complex {
    return new Complex( this.real * c.real - this.imaginary * c.imaginary, this.real * c.imaginary + this.imaginary * c.real );
  }

  /**
   * Complex division.
   * Immutable version of divide
   */
  public dividedBy( c: Complex ): Complex {
    const cMag = c.magnitudeSquared;
    return new Complex(
      ( this.real * c.real + this.imaginary * c.imaginary ) / cMag,
      ( this.imaginary * c.real - this.real * c.imaginary ) / cMag
    );
  }

  /**
   * Complex negation
   * Immutable version of negate
   */
  public negated(): Complex {
    return new Complex( -this.real, -this.imaginary );
  }

  /**
   * Square root.
   * Immutable form of sqrt.
   *
   */
  public sqrtOf(): Complex {
    const mag = this.magnitude;
    return new Complex( Math.sqrt( ( mag + this.real ) / 2 ),
      ( this.imaginary >= 0 ? 1 : -1 ) * Math.sqrt( ( mag - this.real ) / 2 ) );
  }

  /**
   * Returns the power of this complex number by a real number.
   */
  public powerByReal( realPower: number ): Complex {
    const magTimes = Math.pow( this.magnitude, realPower );
    const angle = realPower * this.phase();
    return new Complex(
      magTimes * Math.cos( angle ),
      magTimes * Math.sin( angle )
    );
  }

  /**
   * Sine.
   * Immutable form of sin.
   *
   */
  public sinOf(): Complex {
    return new Complex(
      Math.sin( this.real ) * cosh( this.imaginary ),
      Math.cos( this.real ) * sinh( this.imaginary )
    );
  }

  /**
   * Cosine.
   * Immutable form of cos.
   *
   */
  public cosOf(): Complex {
    return new Complex(
      Math.cos( this.real ) * cosh( this.imaginary ),
      -Math.sin( this.real ) * sinh( this.imaginary )
    );
  }

  /**
   * Returns the square of this complex number and does not modify it.
   * This is the immutable version of square.
   *
   */
  public squared(): Complex {
    return this.times( this );
  }


  /**
   * Complex conjugate.
   * Immutable form of conjugate
   *
   */
  public conjugated(): Complex {
    return new Complex( this.real, -this.imaginary );
  }

  /**
   * Takes e to the power of this complex number. $e^{a+bi}=e^a\cos b + i\sin b$.
   * This is the immutable form of exponentiate.
   *
   */
  public exponentiated(): Complex {
    return Complex.createPolar( Math.exp( this.real ), this.imaginary );
  }

  /*** Mutable functions ***/

  /**
   * Sets all components of this complex, returning this
   *
   */
  public setRealImaginary( real: number, imaginary: number ): Complex {
    this.real = real;
    this.imaginary = imaginary;
    return this;
  }

  /**
   * Sets the real component of this complex, returning this
   */
  public setReal( real: number ): Complex {
    this.real = real;
    return this;
  }

  /**
   * Sets the imaginary component of this complex, returning this
   */
  public setImaginary( imaginary: number ): Complex {
    this.imaginary = imaginary;
    return this;
  }

  /**
   * Sets the components of this complex to be a copy of the parameter
   *
   * This is the mutable form of the function copy(). This will mutate (change) this complex, in addition to returning
   * this complex itself.
   */
  public set( c: Complex ): Complex {
    return this.setRealImaginary( c.real, c.imaginary );
  }

  /**
   * Sets this Complex's value to be the a,b values matching the given magnitude and phase (in radians), changing
   * this Complex, and returning itself.
   *
   * @param magnitude
   * @param phase - In radians
   */
  public setPolar( magnitude: number, phase: number ): Complex {
    return this.setRealImaginary( magnitude * Math.cos( phase ), magnitude * Math.sin( phase ) );
  }

  /**
   * Addition of this Complex and another Complex, returning a copy.
   *
   * This is the mutable form of the function plus(). This will modify and return this.
   */
  public add( c: Complex ): Complex {
    return this.setRealImaginary( this.real + c.real, this.imaginary + c.imaginary );
  }

  /**
   * Subtraction of another Complex from this Complex, returning a copy.
   *
   * This is the mutable form of the function minus(). This will modify and return this.
   */
  public subtract( c: Complex ): Complex {
    return this.setRealImaginary( this.real - c.real, this.imaginary - c.imaginary );
  }

  /**
   * Mutable Complex multiplication.
   */
  public multiply( c: Complex ): Complex {
    return this.setRealImaginary(
      this.real * c.real - this.imaginary * c.imaginary,
      this.real * c.imaginary + this.imaginary * c.real );
  }

  /**
   * Mutable Complex division. The immutable form is dividedBy.
   */
  public divide( c: Complex ): Complex {
    const cMag = c.magnitudeSquared;
    return this.setRealImaginary(
      ( this.real * c.real + this.imaginary * c.imaginary ) / cMag,
      ( this.imaginary * c.real - this.real * c.imaginary ) / cMag
    );
  }

  /**
   * Mutable Complex negation
   *
   */
  public negate(): Complex {
    return this.setRealImaginary( -this.real, -this.imaginary );
  }

  /**
   * Sets this Complex to e to the power of this complex number. $e^{a+bi}=e^a\cos b + i\sin b$.
   * This is the mutable version of exponentiated
   *
   */
  public exponentiate(): Complex {
    return this.setPolar( Math.exp( this.real ), this.imaginary );
  }

  /**
   * Squares this complex number.
   * This is the mutable version of squared.
   *
   */
  public square(): Complex {
    return this.multiply( this );
  }

  /**
   * Square root.
   * Mutable form of sqrtOf.
   *
   */
  public sqrt(): Complex {
    const mag = this.magnitude;
    return this.setRealImaginary( Math.sqrt( ( mag + this.real ) / 2 ),
      ( this.imaginary >= 0 ? 1 : -1 ) * Math.sqrt( ( mag - this.real ) / 2 ) );
  }

  /**
   * Sine.
   * Mutable form of sinOf.
   *
   */
  public sin(): Complex {
    return this.setRealImaginary(
      Math.sin( this.real ) * cosh( this.imaginary ),
      Math.cos( this.real ) * sinh( this.imaginary )
    );
  }

  /**
   * Cosine.
   * Mutable form of cosOf.
   *
   */
  public cos(): Complex {
    return this.setRealImaginary(
      Math.cos( this.real ) * cosh( this.imaginary ),
      -Math.sin( this.real ) * sinh( this.imaginary )
    );
  }


  /**
   * Complex conjugate.
   * Mutable form of conjugated
   *
   */
  public conjugate(): Complex {
    return this.setRealImaginary( this.real, -this.imaginary );
  }

  /**
   * Returns the cube roots of this complex number.
   */
  public getCubeRoots(): Complex[] {
    const arg3 = this.argument / 3;
    const abs = this.magnitude;

    const really = Complex.real( Math.cbrt( abs ) );

    const principal = really.times( Complex.imaginary( arg3 ).exponentiate() );

    return [
      principal,
      really.times( Complex.imaginary( arg3 + Math.PI * 2 / 3 ).exponentiate() ),
      really.times( Complex.imaginary( arg3 - Math.PI * 2 / 3 ).exponentiate() )
    ];
  }

  /**
   * Debugging string for the complex number (provides real and imaginary parts).
   */
  public toString(): string {
    return `Complex(${this.real}, ${this.imaginary})`;
  }

  /**
   * Constructs a complex number from just the real part (assuming the imaginary part is 0).
   */
  public static real( real: number ): Complex {
    return new Complex( real, 0 );
  }

  /**
   * Constructs a complex number from just the imaginary part (assuming the real part is 0).
   */
  public static imaginary( imaginary: number ): Complex {
    return new Complex( 0, imaginary );
  }

  /**
   * Constructs a complex number from the polar form. For a magnitude $r$ and phase $\varphi$, this will be
   * $\cos\varphi+i r\sin\varphi$.
   */
  public static createPolar( magnitude: number, phase: number ): Complex {
    return new Complex( magnitude * Math.cos( phase ), magnitude * Math.sin( phase ) );
  }

  /**
   * Returns an array of the roots of the quadratic equation $ax + b=0$, or null if every value is a solution.
   *
   * @returns The roots of the equation, or null if all values are roots.
   */
  public static solveLinearRoots( a: Complex, b: Complex ): Complex[] | null {
    if ( a.equals( Complex.ZERO ) ) {
      return b.equals( Complex.ZERO ) ? null : [];
    }

    return [ b.dividedBy( a ).negate() ];
  }

  /**
   * Returns an array of the roots of the quadratic equation $ax^2 + bx + c=0$, or null if every value is a
   * solution.
   *
   * @returns The roots of the equation, or null if all values are roots (if multiplicity>1, returns multiple copies)
   */
  public static solveQuadraticRoots( a: Complex, b: Complex, c: Complex ): Complex[] | null {
    if ( a.equals( Complex.ZERO ) ) {
      return Complex.solveLinearRoots( b, c );
    }

    const denom = Complex.real( 2 ).multiply( a );
    const d1 = b.times( b );
    const d2 = Complex.real( 4 ).multiply( a ).multiply( c );
    const discriminant = d1.subtract( d2 ).sqrt();
    return [
      discriminant.minus( b ).divide( denom ),
      discriminant.negated().subtract( b ).divide( denom )
    ];
  }

  /**
   * Returns an array of the roots of the cubic equation $ax^3 + bx^2 + cx + d=0$, or null if every value is a
   * solution.
   *
   * @returns The roots of the equation, or null if all values are roots (if multiplicity>1, returns multiple copies)
   */
  public static solveCubicRoots( a: Complex, b: Complex, c: Complex, d: Complex ): Complex[] | null {
    if ( a.equals( Complex.ZERO ) ) {
      return Complex.solveQuadraticRoots( b, c, d );
    }

    const denom = a.times( Complex.real( 3 ) ).negate();
    const a2 = a.times( a );
    const b2 = b.times( b );
    const b3 = b2.times( b );
    const c2 = c.times( c );
    const c3 = c2.times( c );
    const abc = a.times( b ).times( c );

    // TODO: factor out constant numeric values https://github.com/phetsims/dot/issues/96

    const D0_1 = b2;
    const D0_2 = a.times( c ).times( Complex.real( 3 ) );
    const D1_1 = b3.times( Complex.real( 2 ) ).add( a2.times( d ).multiply( Complex.real( 27 ) ) );
    const D1_2 = abc.times( Complex.real( 9 ) );

    if ( D0_1.equals( D0_2 ) && D1_1.equals( D1_2 ) ) {
      const tripleRoot = b.divide( denom );
      return [ tripleRoot, tripleRoot, tripleRoot ];
    }

    const Delta0 = D0_1.minus( D0_2 );
    const Delta1 = D1_1.minus( D1_2 );

    const discriminant1 = abc.times( d ).multiply( Complex.real( 18 ) ).add( b2.times( c2 ) );
    const discriminant2 = b3.times( d ).multiply( Complex.real( 4 ) )
      .add( c3.times( a ).multiply( Complex.real( 4 ) ) )
      .add( a2.times( d ).multiply( d ).multiply( Complex.real( 27 ) ) );

    if ( discriminant1.equals( discriminant2 ) ) {
      const simpleRoot = (
        abc.times( Complex.real( 4 ) ).subtract( b3.plus( a2.times( d ).multiply( Complex.real( 9 ) ) ) )
      ).divide( a.times( Delta0 ) );
      const doubleRoot = ( a.times( d ).multiply( Complex.real( 9 ) ).subtract( b.times( c ) ) ).divide( Delta0.times( Complex.real( 2 ) ) );
      return [ simpleRoot, doubleRoot, doubleRoot ];
    }
    let Ccubed;
    if ( D0_1.equals( D0_2 ) ) {
      Ccubed = Delta1;
    }
    else {
      Ccubed = Delta1.plus( ( Delta1.times( Delta1 ).subtract( Delta0.times( Delta0 ).multiply( Delta0 ).multiply( Complex.real( 4 ) ) ) ).sqrt() ).divide( Complex.real( 2 ) );
    }
    return Ccubed.getCubeRoots().map( root => {
      return b.plus( root ).add( Delta0.dividedBy( root ) ).divide( denom );
    } );
  }

  /**
   * Immutable constant $0$.
   * @constant
   */
  public static readonly ZERO = new Complex( 0, 0 );

  /**
   * Immutable constant $1$.
   * @constant
   */
  public static readonly ONE = new Complex( 1, 0 );

  /**
   * Immutable constant $i$, the imaginary unit.
   * @constant
   */
  public static readonly I = new Complex( 0, 1 );
}

dot.register( 'Complex', Complex );