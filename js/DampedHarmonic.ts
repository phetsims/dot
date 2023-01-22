// Copyright 2023, University of Colorado Boulder

/**
 * Solves for a specific solution of a damped harmonic oscillator
 * (https://en.wikipedia.org/wiki/Harmonic_oscillator#Damped_harmonic_oscillator), given the initial value and
 * derivative.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import Enumeration from '../../phet-core/js/Enumeration.js';
import EnumerationValue from '../../phet-core/js/EnumerationValue.js';
import dot from './dot.js';

class SolutionType extends EnumerationValue {
  public static readonly OVER_DAMPED = new SolutionType();
  public static readonly UNDER_DAMPED = new SolutionType();
  public static readonly CRITICALLY_DAMPED = new SolutionType();
  public static readonly UNKNOWN = new SolutionType();

  public static readonly enumeration = new Enumeration( SolutionType );
}

class DampedHarmonic {

  private readonly dampingConstant: number;
  private readonly angularFrequencySquared: number;
  private readonly discriminant: number;
  private readonly solutionType: SolutionType;
  private readonly c1: number;
  private readonly c2: number;
  private readonly angularFrequency?: number; // if critically damped
  private readonly frequency?: number; // if under-damped
  private readonly positiveRoot?: number; // if over-damped
  private readonly negativeRoot?: number; // if over-damped

  /**
   * For solving ax'' + bx' + cx = 0 with initial conditions x(0) and x'(0).
   *
   * @param a - Coefficient in front of the second derivative.
   * @param b - Coefficient in front of the first derivative, responsible for the amount of damping applied.
   * @param c - Coefficient in front of the current value, responsible for the amount of force towards equilibrium.
   * @param initialValue - The value of x(0), i.e. the initial position at t=0.
   * @param initialDerivative - The value of x'(0), i.e. the initial velocity at t=0;
   */
  public constructor( a: number, b: number, c: number, initialValue: number, initialDerivative: number ) {
    assert && assert( isFinite( a ) && a !== 0 );
    assert && assert( isFinite( b ) );
    assert && assert( isFinite( c ) && c !== 0 );
    assert && assert( isFinite( initialValue ) );
    assert && assert( isFinite( initialDerivative ) );

    // We'll transform into the simpler: x'' + dampingConstant x' + angularFrequencySquared x = 0
    this.dampingConstant = b / a;
    this.angularFrequencySquared = c / a;

    assert && assert( this.dampingConstant >= 0, 'a and b should share the same sign' );
    assert && assert( this.angularFrequencySquared > 0, 'a and c should share the same sign' );

    // Determines what type of solution is required.
    this.discriminant = this.dampingConstant * this.dampingConstant - 4 * this.angularFrequencySquared;

    this.solutionType = SolutionType.UNKNOWN; // will be filled in below

    // Constants that determine what linear combination of solutions satisfies the initial conditions
    this.c1 = 0;
    this.c2 = 0;

    if ( Math.abs( this.discriminant ) < 1e-5 ) {
      this.solutionType = SolutionType.CRITICALLY_DAMPED;

      this.angularFrequency = Math.sqrt( this.angularFrequencySquared );

      this.c1 = initialValue;
      this.c2 = initialDerivative + this.angularFrequency * initialValue;
    }
    else if ( this.discriminant < 0 ) {
      this.solutionType = SolutionType.UNDER_DAMPED;

      this.frequency = 0.5 * Math.sqrt( -this.discriminant );

      this.c1 = initialValue;
      this.c2 = ( this.dampingConstant * initialValue ) / ( 2 * this.frequency ) + initialDerivative / this.frequency;
    }
    else {
      this.solutionType = SolutionType.OVER_DAMPED;

      this.positiveRoot = 0.5 * ( -this.dampingConstant + Math.sqrt( this.discriminant ) );
      this.negativeRoot = 0.5 * ( -this.dampingConstant - Math.sqrt( this.discriminant ) );

      this.c2 = ( this.negativeRoot * initialValue - initialDerivative ) / ( this.negativeRoot - this.positiveRoot );
      this.c1 = initialValue - this.c2;
    }
  }

  /**
   * Returns the value of x(t) determined by the differential equation and initial conditions.
   */
  public getValue( t: number ): number {
    if ( this.solutionType === SolutionType.CRITICALLY_DAMPED ) {
      assert && assert( this.angularFrequency !== undefined );

      return ( this.c1 + this.c2 * t ) * Math.exp( -this.angularFrequency! * t );
    }
    else if ( this.solutionType === SolutionType.UNDER_DAMPED ) {
      assert && assert( this.frequency !== undefined );

      const theta = this.frequency! * t;
      return Math.exp( -( this.dampingConstant / 2 ) * t ) * ( this.c1 * Math.cos( theta ) + this.c2 * Math.sin( theta ) );
    }
    else if ( this.solutionType === SolutionType.OVER_DAMPED ) {
      assert && assert( this.positiveRoot !== undefined );
      assert && assert( this.negativeRoot !== undefined );

      return this.c1 * Math.exp( this.negativeRoot! * t ) + this.c2 * Math.exp( this.positiveRoot! * t );
    }
    else {
      throw new Error( 'Unknown solution type?' );
    }
  }

  /**
   * Returns the value of x'(t) determined by the differential equation and initial conditions.
   */
  public getDerivative( t: number ): number {
    if ( this.solutionType === SolutionType.CRITICALLY_DAMPED ) {
      assert && assert( this.angularFrequency !== undefined );

      return Math.exp( -this.angularFrequency! * t ) * ( this.c2 - this.angularFrequency! * ( this.c1 + this.c2 * t ) );
    }
    else if ( this.solutionType === SolutionType.UNDER_DAMPED ) {
      assert && assert( this.frequency !== undefined );

      const theta = this.frequency! * t;
      const cos = Math.cos( theta );
      const sin = Math.sin( theta );
      const term1 = this.frequency! * ( this.c2 * cos - this.c1 * sin );
      const term2 = 0.5 * this.dampingConstant * ( this.c1 * cos + this.c2 * sin );
      return Math.exp( -0.5 * this.dampingConstant * t ) * ( term1 - term2 );
    }
    else if ( this.solutionType === SolutionType.OVER_DAMPED ) {
      assert && assert( this.positiveRoot !== undefined );
      assert && assert( this.negativeRoot !== undefined );

      return this.c1 * this.negativeRoot! * Math.exp( this.negativeRoot! * t ) + this.c2 * this.positiveRoot! * Math.exp( this.positiveRoot! * t );
    }
    else {
      throw new Error( 'Unknown solution type?' );
    }
  }
}

dot.register( 'DampedHarmonic', DampedHarmonic );

export default DampedHarmonic;