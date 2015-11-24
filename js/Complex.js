// Copyright 2013-2015, University of Colorado Boulder

/**
 * A complex number fhat is immutable. Extends Vector2 for many common operations that need to treat the complex number
 * as a vector $\begin{bmatrix} a \\ b \end{bmatrix}$ for the real number $a+bi$.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 * @author Chris Malley
 */

define( function( require ) {
  'use strict';

  var dot = require( 'DOT/dot' );

  var inherit = require( 'PHET_CORE/inherit' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * Creates a complex number, that has both a real and imaginary part.
   * @constructor
   * @public
   *
   * @param {number} real - The real part. For a complex number $a+bi$, this should be $a$.
   * @param {number} imaginary - The imaginary part. For a complex number $a+bi$, this should be $b$.
   */
  function Complex( real, imaginary ) {
    Vector2.call( this, real, imaginary );

    // @public {number} - The real part. For a complex number $a+bi$, this is $a$.
    this.real = real;

    // @public {number} - The imaginary part. For a complex number $a+bi$, this is $b$.
    this.imaginary = imaginary;
  }

  dot.register( 'Complex', Complex );

  // Inheriting Vector2 for now since many times we may want to treat the complex number as a vector
  // ideally, we should have Vector2-likeness be a mixin?
  // we also inherit the immutable form since we add 'real' and 'imaginary' properties,
  // without adding extra logic to mutators in Vector2
  inherit( Vector2.Immutable, Complex, {
    /**
     * The phase / argument of the complex number.
     * @public
     *
     * @returns {number}
     */
    phase: Vector2.prototype.angle,

    /**
     * Complex multiplication.
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
     * @public
     *
     * @param {Complex} c
     * @returns {Complex}
     */
    dividedBy: function( c ) {
      var cMag = c.magnitudeSquared();
      return new Complex(
        ( this.real * c.real + this.imaginary * c.imaginary ) / cMag,
        ( this.imaginary * c.real - this.real * c.imaginary ) / cMag
      );
    },

    /**
     * Square root.
     * @public
     *
     * @returns {Complex}
     */
    sqrt: function() {
      var mag = this.magnitude();
      return new Complex( Math.sqrt( ( mag + this.real ) / 2 ),
        ( this.imaginary >= 0 ? 1 : -1 ) * Math.sqrt( ( mag - this.real ) / 2 ) );
    },

    /**
     * Complex conjugate.
     * @public
     *
     * @returns {Complex}
     */
    conjugate: function() {
      return new Complex( this.real, -this.imaginary );
    },

    /**
     * Takes e to the power of this complex number. $e^{a+bi}=e^a\cos b + i\sin b$.
     * @public
     *
     * @returns {Complex}
     */
    exponentiated: function() {
      return Complex.createPolar( Math.exp( this.real ), this.imaginary );
    },

    /**
     * Debugging string for the complex number (provides real and imaginary parts).
     * @public
     *
     * @returns {string}
     */
    toString: function() {
      return 'Complex(' + this.x + ', ' + this.y + ')';
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
   * @constant {Complex} ONE
   */
  Complex.I = new Complex( 0, 1 );

  return Complex;
} );
