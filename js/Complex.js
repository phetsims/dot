// Copyright 2013-2023, University of Colorado Boulder

/**
 * A complex number with mutable and immutable methods.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Matt Pennington
 */

import dot from './dot.js';
import Utils from './Utils.js';

class Complex {
  /**
   * Creates a complex number, that has both a real and imaginary part.
   * @public
   *
   * @param {number} real - The real part. For a complex number $a+bi$, this should be $a$.
   * @param {number} imaginary - The imaginary part. For a complex number $a+bi$, this should be $b$.
   */
  constructor( real, imaginary ) {
    // @public {number} - The real part. For a complex number $a+bi$, this is $a$.
    this.real = real;

    // @public {number} - The imaginary part. For a complex number $a+bi$, this is $b$.
    this.imaginary = imaginary;
  }

  /**
   * Creates a copy of this complex, or if a complex is passed in, set that complex's values to ours.
   * @public
   *
   * This is the immutable form of the function set(), if a complex is provided. This will return a new complex, and
   * will not modify this complex.
   *
   * @param {Complex} [complex] - If not provided, creates a new Complex with filled in values. Otherwise, fills
   *                              in the values of the provided complex so that it equals this complex.
   * @returns {Complex}
   */
  copy( complex ) {
    if ( complex ) {
      return complex.set( this );
    }
    else {
      return new Complex( this.real, this.imaginary );
    }
  }

  /**
   * The phase / argument of the complex number.
   * @public
   *
   * @returns {number}
   */
  phase() {
    return Math.atan2( this.imaginary, this.real );
  }

  /**
   * The magnitude (Euclidean/L2 Norm) of this complex number, i.e. $\sqrt{a^2+b^2}$.
   * @public
   *
   * @returns {number}
   */
  getMagnitude() {
    return Math.sqrt( this.magnitudeSquared );
  }

  get magnitude() {
    return this.getMagnitude();
  }

  /**
   * The squared magnitude (square of the Euclidean/L2 Norm) of this complex, i.e. $a^2+b^2$.
   * @public
   *
   * @returns {number}
   */
  getMagnitudeSquared() {
    return this.real * this.real + this.imaginary * this.imaginary;
  }

  get magnitudeSquared() {
    return this.getMagnitudeSquared();
  }

  /**
   * Returns the argument of this complex number (immutable)
   * @public
   *
   * @returns {number}
   */
  getArgument() {
    return Math.atan2( this.imaginary, this.real );
  }

  get argument() {
    return this.getArgument();
  }

  /**
   * Exact equality comparison between this Complex and another Complex.
   * @public
   *
   * @param {Complex} other
   * @returns {boolean} - Whether the two complex numbers have equal components
   */
  equals( other ) {
    return this.real === other.real && this.imaginary === other.imaginary;
  }

  /**
   * Approximate equality comparison between this Complex and another Complex.
   * @public
   *
   * @param {Complex} other
   * @param {number} epsilon
   * @returns {boolean} - Whether difference between the two complex numbers has no component with an absolute value
   *                      greater than epsilon.
   */
  equalsEpsilon( other, epsilon ) {
    if ( !epsilon ) {
      epsilon = 0;
    }
    return Math.max( Math.abs( this.real - other.real ), Math.abs( this.imaginary - other.imaginary ) ) <= epsilon;
  }

  /**
   * Addition of this Complex and another Complex, returning a copy.
   * @public
   *
   * This is the immutable form of the function add(). This will return a new Complex, and will not modify
   * this Complex.
   *
   * @param {Complex} c
   * @returns {Complex}
   */
  plus( c ) {
    return new Complex( this.real + c.real, this.imaginary + c.imaginary );
  }

  /**
   * Subtraction of this Complex by another Complex c, returning a copy.
   * @public
   *
   * This is the immutable form of the function subtract(). This will return a new Complex, and will not modify
   * this Complex.
   *
   * @param {Complex} c
   * @returns {Complex}
   */
  minus( c ) {
    return new Complex( this.real - c.real, this.imaginary - c.imaginary );
  }

  /**
   * Complex multiplication.
   * Immutable version of multiply
   * @public
   *
   * @param {Complex} c
   * @returns {Complex}
   */
  times( c ) {
    return new Complex( this.real * c.real - this.imaginary * c.imaginary, this.real * c.imaginary + this.imaginary * c.real );
  }

  /**
   * Complex division.
   * Immutable version of divide
   * @public
   *
   * @param {Complex} c
   * @returns {Complex}
   */
  dividedBy( c ) {
    const cMag = c.magnitudeSquared;
    return new Complex(
      ( this.real * c.real + this.imaginary * c.imaginary ) / cMag,
      ( this.imaginary * c.real - this.real * c.imaginary ) / cMag
    );
  }

  /**
   * Complex negation
   * Immutable version of negate
   * @public
   *
   * @returns {Complex}
   */
  negated() {
    return new Complex( -this.real, -this.imaginary );
  }

  /**
   * Square root.
   * Immutable form of sqrt.
   * @public
   *
   * @returns {Complex}
   */
  sqrtOf() {
    const mag = this.magnitude;
    return new Complex( Math.sqrt( ( mag + this.real ) / 2 ),
      ( this.imaginary >= 0 ? 1 : -1 ) * Math.sqrt( ( mag - this.real ) / 2 ) );
  }

  /**
   * Returns the power of this complex number by a real number.
   * @public
   *
   * @param {number} realPower
   * @returns {Complex}
   */
  powerByReal( realPower ) {
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
   * @public
   *
   * @returns {Complex}
   */
  sinOf() {
    return new Complex(
      Math.sin( this.real ) * Utils.cosh( this.imaginary ),
      Math.cos( this.real ) * Utils.sinh( this.imaginary )
    );
  }

  /**
   * Cosine.
   * Immutable form of cos.
   * @public
   *
   * @returns {Complex}
   */
  cosOf() {
    return new Complex(
      Math.cos( this.real ) * Utils.cosh( this.imaginary ),
      -Math.sin( this.real ) * Utils.sinh( this.imaginary )
    );
  }

  /**
   * Returns the square of this complex number and does not modify it.
   * This is the immutable version of square.
   * @public
   *
   * @returns {Complex}
   */
  squared() {
    return this.times( this );
  }


  /**
   * Complex conjugate.
   * Immutable form of conjugate
   * @public
   *
   * @returns {Complex}
   */
  conjugated() {
    return new Complex( this.real, -this.imaginary );
  }

  /**
   * Takes e to the power of this complex number. $e^{a+bi}=e^a\cos b + i\sin b$.
   * This is the immutable form of exponentiate.
   * @public
   *
   * @returns {Complex}
   */
  exponentiated() {
    return Complex.createPolar( Math.exp( this.real ), this.imaginary );
  }

  /*** Mutable functions ***/

  /**
   * Sets all of the components of this complex, returning this
   * @public
   *
   * @param {number} real
   * @param {number} imaginary
   * @returns {Complex}
   */
  setRealImaginary( real, imaginary ) {
    this.real = real;
    this.imaginary = imaginary;
    return this;
  }

  /**
   * Sets the real component of this complex, returning this
   * @public
   *
   * @param {number} real
   * @returns {Complex}
   */
  setReal( real ) {
    this.real = real;
    return this;
  }

  /**
   * Sets the imaginary component of this complex, returning this
   * @public
   *
   * @param {number} imaginary
   * @returns {Complex}
   */
  setImaginary( imaginary ) {
    this.imaginary = imaginary;
    return this;
  }

  /**
   * Sets the components of this complex to be a copy of the parameter
   * @public
   *
   * This is the mutable form of the function copy(). This will mutate (change) this complex, in addition to returning
   * this complex itself.
   *
   * @param {Complex} c
   * @returns {Complex}
   */
  set( c ) {
    return this.setRealImaginary( c.real, c.imaginary );
  }

  /**
   * Sets this Complex's value to be the a,b values matching the given magnitude and phase (in radians), changing
   * this Complex, and returning itself.
   * @public
   *
   * @param {number} magnitude
   * @param {number} phase - In radians
   * @returns {Complex}
   */
  setPolar( magnitude, phase ) {
    return this.setRealImaginary( magnitude * Math.cos( phase ), magnitude * Math.sin( phase ) );
  }

  /**
   * Addition of this Complex and another Complex, returning a copy.
   * @public
   *
   * This is the mutable form of the function plus(). This will modify and return this.
   *
   * @param {Complex} c
   * @returns {Complex}
   */
  add( c ) {
    return this.setRealImaginary( this.real + c.real, this.imaginary + c.imaginary );
  }

  /**
   * Subtraction of another Complex from this Complex, returning a copy.
   * @public
   *
   * This is the mutable form of the function minus(). This will modify and return this.
   *
   * @param {Complex} c
   * @returns {Complex}
   */
  subtract( c ) {
    return this.setRealImaginary( this.real - c.real, this.imaginary - c.imaginary );
  }

  /**
   * Mutable Complex multiplication.
   * @public
   *
   * @param {Complex} c
   * @returns {Complex}
   */
  multiply( c ) {
    return this.setRealImaginary(
      this.real * c.real - this.imaginary * c.imaginary,
      this.real * c.imaginary + this.imaginary * c.real );
  }

  /**
   * Mutable Complex division. The immutable form is dividedBy.
   * @public
   *
   * @param {Complex} c
   * @returns {Complex}
   */
  divide( c ) {
    const cMag = c.magnitudeSquared;
    return this.setRealImaginary(
      ( this.real * c.real + this.imaginary * c.imaginary ) / cMag,
      ( this.imaginary * c.real - this.real * c.imaginary ) / cMag
    );
  }

  /**
   * Mutable Complex negation
   * @public
   *
   * @returns {Complex}
   */
  negate() {
    return this.setRealImaginary( -this.real, -this.imaginary );
  }

  /**
   * Sets this Complex to e to the power of this complex number. $e^{a+bi}=e^a\cos b + i\sin b$.
   * This is the mutable version of exponentiated
   * @public
   *
   * @returns {Complex}
   */
  exponentiate() {
    return this.setPolar( Math.exp( this.real ), this.imaginary );
  }

  /**
   * Squares this complex number.
   * This is the mutable version of squared.
   * @public
   *
   * @returns {Complex}
   */
  square() {
    return this.multiply( this );
  }

  /**
   * Square root.
   * Mutable form of sqrtOf.
   * @public
   *
   * @returns {Complex}
   */
  sqrt() {
    const mag = this.magnitude;
    return this.setRealImaginary( Math.sqrt( ( mag + this.real ) / 2 ),
      ( this.imaginary >= 0 ? 1 : -1 ) * Math.sqrt( ( mag - this.real ) / 2 ) );
  }

  /**
   * Sine.
   * Mutable form of sinOf.
   * @public
   *
   * @returns {Complex}
   */
  sin() {
    return this.setRealImaginary(
      Math.sin( this.real ) * Utils.cosh( this.imaginary ),
      Math.cos( this.real ) * Utils.sinh( this.imaginary )
    );
  }

  /**
   * Cosine.
   * Mutable form of cosOf.
   * @public
   *
   * @returns {Complex}
   */
  cos() {
    return this.setRealImaginary(
      Math.cos( this.real ) * Utils.cosh( this.imaginary ),
      -Math.sin( this.real ) * Utils.sinh( this.imaginary )
    );
  }


  /**
   * Complex conjugate.
   * Mutable form of conjugated
   * @public
   *
   * @returns {Complex}
   */
  conjugate() {
    return this.setRealImaginary( this.real, -this.imaginary );
  }

  /**
   * Returns the cube roots of this complex number.
   * @public
   *
   * @returns {Complex[]}
   */
  getCubeRoots() {
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
   * @public
   *
   * @returns {string}
   */
  toString() {
    return `Complex(${this.real}, ${this.imaginary})`;
  }

  /**
   * Constructs a complex number from just the real part (assuming the imaginary part is 0).
   * @public
   *
   * @param {number} real
   * @returns {Complex}
   */
  static real( real ) {
    return new Complex( real, 0 );
  }

  /**
   * Constructs a complex number from just the imaginary part (assuming the real part is 0).
   * @public
   *
   * @param {number} imaginary
   * @returns {Complex}
   */
  static imaginary( imaginary ) {
    return new Complex( 0, imaginary );
  }

  /**
   * Constructs a complex number from the polar form. For a magnitude $r$ and phase $\varphi$, this will be
   * $\cos\varphi+i r\sin\varphi$.
   * @public
   *
   * @param {number} magnitude
   * @param {number} phase
   * @returns {Complex}
   */
  static createPolar( magnitude, phase ) {
    return new Complex( magnitude * Math.cos( phase ), magnitude * Math.sin( phase ) );
  }

  /**
   * Returns an array of the roots of the quadratic equation $ax + b=0$, or null if every value is a solution.
   * @public
   *
   * @param {Complex} a
   * @param {Complex} b
   * @returns {Array.<Complex>|null} - The roots of the equation, or null if all values are roots.
   */
  static solveLinearRoots( a, b ) {
    if ( a.equals( Complex.ZERO ) ) {
      return b.equals( Complex.ZERO ) ? null : [];
    }

    return [ b.dividedBy( a ).negate() ];
  }

  /**
   * Returns an array of the roots of the quadratic equation $ax^2 + bx + c=0$, or null if every value is a
   * solution.
   * @public
   *
   * @param {Complex} a
   * @param {Complex} b
   * @param {Complex} c
   * @returns {Array.<Complex>|null} - The roots of the equation, or null if all values are roots (if multiplicity>1,
   * returns multiple copies)
   */
  static solveQuadraticRoots( a, b, c ) {
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
   * @public
   *
   * @param {Complex} a
   * @param {Complex} b
   * @param {Complex} c
   * @param {Complex} d
   * @returns {Array.<Complex>|null} - The roots of the equation, or null if all values are roots (if multiplicity>1,
   * returns multiple copies)
   */
  static solveCubicRoots( a, b, c, d ) {
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

    // TODO: factor out constant numeric values

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
}

dot.register( 'Complex', Complex );

/**
 * Immutable constant $0$.
 * @public
 *
 * @constant {Complex} ZERO
 */
Complex.ZERO = new Complex( 0, 0 );

/**
 * Immutable constant $1$.
 * @public
 *
 * @constant {Complex} ONE
 */
Complex.ONE = new Complex( 1, 0 );

/**
 * Immutable constant $i$, the imaginary unit.
 * @public
 *
 * @constant {Complex} I
 */
Complex.I = Complex.imaginary( 1 );

export default Complex;