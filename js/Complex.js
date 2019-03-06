// Copyright 2013-2016, University of Colorado Boulder

/**
 * A complex number with mutable and immutable methods.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Matt Pennington
 */

define( function( require ) {
  'use strict';

  var dot = require( 'DOT/dot' );
  require( 'DOT/Util' );
  var inherit = require( 'PHET_CORE/inherit' );

  /**
   * Creates a complex number, that has both a real and imaginary part.
   * @constructor
   * @public
   *
   * @param {number} real - The real part. For a complex number $a+bi$, this should be $a$.
   * @param {number} imaginary - The imaginary part. For a complex number $a+bi$, this should be $b$.
   */
  function Complex( real, imaginary ) {
    // @public {number} - The real part. For a complex number $a+bi$, this is $a$.
    this.real = real;

    // @public {number} - The imaginary part. For a complex number $a+bi$, this is $b$.
    this.imaginary = imaginary;
  }

  dot.register( 'Complex', Complex );

  inherit( Object, Complex, {

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
    copy: function( complex ) {
      if ( complex ) {
        return complex.set( this );
      }
      else {
        return new Complex( this.real, this.imaginary );
      }
    },

    /**
     * The phase / argument of the complex number.
     * @public
     *
     * @returns {number}
     */
    phase: function() {
      return Math.atan2( this.imaginary, this.real );
    },

    /**
     * The magnitude (Euclidean/L2 Norm) of this complex number, i.e. $\sqrt{a^2+b^2}$.
     * @public
     *
     * @returns {number}
     */
    getMagnitude: function() {
      return Math.sqrt( this.magnitudeSquared );
    },
    get magnitude() {
      return this.getMagnitude();
    },

    /**
     * The squared magnitude (square of the Euclidean/L2 Norm) of this complex, i.e. $a^2+b^2$.
     * @public
     *
     * @returns {number}
     */
    getMagnitudeSquared: function() {
      return this.real * this.real + this.imaginary * this.imaginary;
    },
    get magnitudeSquared() {
      return this.getMagnitudeSquared();
    },

    /**
     * Exact equality comparison between this Complex and another Complex.
     * @public
     *
     * @param {Complex} other
     * @returns {boolean} - Whether the two complex numbers have equal components
     */
    equals: function( other ) {
      return this.real === other.real && this.imaginary === other.imaginary;
    },

    /**
     * Approximate equality comparison between this Complex and another Complex.
     * @public
     *
     * @param {Complex} other
     * @param {number} epsilon
     * @returns {boolean} - Whether difference between the two complex numbers has no component with an absolute value
     *                      greater than epsilon.
     */
    equalsEpsilon: function( other, epsilon ) {
      if ( !epsilon ) {
        epsilon = 0;
      }
      return Math.max( Math.abs( this.real - other.real ), Math.abs( this.imaginary - other.imaginary ) ) <= epsilon;
    },

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
    plus: function( c ) {
      return new Complex( this.real + c.real, this.imaginary + c.imaginary );
    },

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
    minus: function( c ) {
      return new Complex( this.real - c.real, this.imaginary - c.imaginary );
    },

    /**
     * Complex multiplication.
     * Immutable version of multiply
     * @public
     *
     * @param {Complex} c
     * @returns {Complex}
     */
    times: function( c ) {
      return new Complex( this.real * c.real - this.imaginary * c.imaginary, this.real * c.imaginary + this.imaginary * c.real );
    },

    /**
     * Complex division.
     * Immutable version of divide
     * @public
     *
     * @param {Complex} c
     * @returns {Complex}
     */
    dividedBy: function( c ) {
      var cMag = c.magnitudeSquared;
      return new Complex(
        ( this.real * c.real + this.imaginary * c.imaginary ) / cMag,
        ( this.imaginary * c.real - this.real * c.imaginary ) / cMag
      );
    },

    /**
     * Square root.
     * Immutable form of sqrt.
     * @public
     *
     * @returns {Complex}
     */
    sqrtOf: function() {
      var mag = this.magnitude;
      return new Complex( Math.sqrt( ( mag + this.real ) / 2 ),
        ( this.imaginary >= 0 ? 1 : -1 ) * Math.sqrt( ( mag - this.real ) / 2 ) );
    },

    /**
     * Sine.
     * Immutable form of sin.
     * @public
     *
     * @returns {Complex}
     */
    sinOf: function() {
      return new Complex(
        Math.sin( this.real ) * dot.Util.cosh( this.imaginary ),
        Math.cos( this.real ) * dot.Util.sinh( this.imaginary )
      );
    },

    /**
     * Cosine.
     * Immutable form of cos.
     * @public
     *
     * @returns {Complex}
     */
    cosOf: function() {
      return new Complex(
        Math.cos( this.real ) * dot.Util.cosh( this.imaginary ),
        - Math.sin( this.real ) * dot.Util.sinh( this.imaginary )
      );
    },

    /**
     * Returns the square of this complex number and does not modify it.
     * This is the immutable version of square.
     * @public
     *
     * @returns {Complex}
     */
    squared: function() {
      return this.times( this );
    },


    /**
     * Complex conjugate.
     * Immutable form of conjugate
     * @public
     *
     * @returns {Complex}
     */
    conjugated: function() {
      return new Complex( this.real, -this.imaginary );
    },

    /**
     * Takes e to the power of this complex number. $e^{a+bi}=e^a\cos b + i\sin b$.
     * This is the immutable form of exponentiate.
     * @public
     *
     * @returns {Complex}
     */
    exponentiated: function() {
      return Complex.createPolar( Math.exp( this.real ), this.imaginary );
    },

    /*** Mutable functions ***/

    /**
     * Sets all of the components of this complex, returning this
     * @public
     *
     * @param {number} real
     * @param {number} imaginary
     * @returns {Complex}
     */
    setRealImaginary: function( real, imaginary ) {
      this.real = real;
      this.imaginary = imaginary;
      return this;
    },

    /**
     * Sets the real component of this complex, returning this
     * @public
     *
     * @param {number} real
     * @returns {Complex}
     */
    setReal: function( real ) {
      this.real = real;
      return this;
    },

    /**
     * Sets the imaginary component of this complex, returning this
     * @public
     *
     * @param {number} imaginary
     * @returns {Complex}
     */
    setImaginary: function( imaginary ) {
      this.imaginary = imaginary;
      return this;
    },

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
    set: function( c ) {
      return this.setRealImaginary( c.real, c.imaginary );
    },

    /**
     * Sets this Complex's value to be the a,b values matching the given magnitude and phase (in radians), changing
     * this Complex, and returning itself.
     * @public
     *
     * @param {number} magnitude
     * @param {number} phase - In radians
     * @returns {Complex}
     */
    setPolar: function( magnitude, phase ) {
      return this.setRealImaginary( magnitude * Math.cos( phase ), magnitude * Math.sin( phase ) );
    },

    /**
     * Addition of this Complex and another Complex, returning a copy.
     * @public
     *
     * This is the mutable form of the function plus(). This will modify and return this.
     *
     * @param {Complex} c
     * @returns {Complex}
     */
    add: function( c ) {
      return this.setRealImaginary( this.real + c.real, this.imaginary + c.imaginary );
    },

    /**
     * Subtraction of another Complex from this Complex, returning a copy.
     * @public
     *
     * This is the mutable form of the function minus(). This will modify and return this.
     *
     * @param {Complex} c
     * @returns {Complex}
     */
    subtract: function( c ) {
      return this.setRealImaginary( this.real - c.real, this.imaginary - c.imaginary );
    },

    /**
     * Mutable Complex multiplication.
     * @public
     *
     * @param {Complex} c
     * @returns {Complex}
     */
    multiply: function( c ) {
      return this.setRealImaginary(
        this.real * c.real - this.imaginary * c.imaginary,
        this.real * c.imaginary + this.imaginary * c.real );
    },

    /**
     * Mutable Complex division. The immutable form is dividedBy.
     * @public
     *
     * @param {Complex} c
     * @returns {Complex}
     */
    divide: function( c ) {
      var cMag = c.magnitudeSquared;
      return this.setRealImaginary(
        ( this.real * c.real + this.imaginary * c.imaginary ) / cMag,
        ( this.imaginary * c.real - this.real * c.imaginary ) / cMag
      );
    },

    /**
     * Sets this Complex to e to the power of this complex number. $e^{a+bi}=e^a\cos b + i\sin b$.
     * This is the mutable version of exponentiated
     * @public
     *
     * @returns {Complex}
     */
    exponentiate: function() {
      return this.setPolar( Math.exp( this.real ), this.imaginary );
    },

    /**
     * Squares this complex number.
     * This is the mutable version of squared.
     * @public
     *
     * @returns {Complex}
     */
    square: function() {
      return this.multiply( this );
    },

    /**
     * Square root.
     * Mutable form of sqrtOf.
     * @public
     *
     * @returns {Complex}
     */
    sqrt: function() {
      var mag = this.magnitude;
      return this.setRealImaginary( Math.sqrt( ( mag + this.real ) / 2 ),
        ( this.imaginary >= 0 ? 1 : -1 ) * Math.sqrt( ( mag - this.real ) / 2 ) );
    },

    /**
     * Sine.
     * Mutable form of sinOf.
     * @public
     *
     * @returns {Complex}
     */
    sin: function() {
      return this.setRealImaginary(
        Math.sin( this.real ) * dot.Util.cosh( this.imaginary ),
        Math.cos( this.real ) * dot.Util.sinh( this.imaginary )
      );
    },

    /**
     * Cosine.
     * Mutable form of cosOf.
     * @public
     *
     * @returns {Complex}
     */
    cos: function() {
      return this.setRealImaginary(
        Math.cos( this.real ) * dot.Util.cosh( this.imaginary ),
        - Math.sin( this.real ) * dot.Util.sinh( this.imaginary )
      );
    },


    /**
     * Complex conjugate.
     * Mutable form of conjugated
     * @public
     *
     * @returns {Complex}
     */
    conjugate: function() {
      return this.setRealImaginary( this.real, -this.imaginary );
    },

    /**
     * Debugging string for the complex number (provides real and imaginary parts).
     * @public
     *
     * @returns {string}
     */
    toString: function() {
      return 'Complex(' + this.real + ', ' + this.imaginary + ')';
    }


  }, {
    /**
     * Constructs a complex number from just the real part (assuming the imaginary part is 0).
     * @public
     *
     * @param {number} real
     * @returns {Complex}
     */
    real: function( real ) {
      return new Complex( real, 0 );
    },

    /**
     * Constructs a complex number from just the imaginary part (assuming the real part is 0).
     * @public
     *
     * @param {number} imaginary
     * @returns {Complex}
     */
    imaginary: function( imaginary ) {
      return new Complex( 0, imaginary );
    },

    /**
     * Constructs a complex number from the polar form. For a magnitude $r$ and phase $\varphi$, this will be
     * $\cos\varphi+i r\sin\varphi$.
     * @public
     *
     * @param {number} magnitude
     * @param {number} phase
     * @returns {Complex}
     */
    createPolar: function( magnitude, phase ) {
      return new Complex( magnitude * Math.cos( phase ), magnitude * Math.sin( phase ) );
    }
  } );

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

  return Complex;
} );
