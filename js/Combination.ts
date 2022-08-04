// Copyright 2022, University of Colorado Boulder

/**
 * An immutable combination that represents a subset of a set
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import dot from './dot.js';

class Combination {

  public readonly inclusions: boolean[];

  /**
   * Creates a combination that will include elements where list[i] === true
   */
  public constructor( inclusions: boolean[] ) {
    this.inclusions = inclusions;
  }

  public size(): number {
    return this.inclusions.length;
  }

  public includes( index: number ): boolean {
    return this.inclusions[ index ];
  }

  /**
   * Applies the combination to an array, returning a new array with the used elements.
   */
  public apply<T>( array: T[] ): T[] {
    return array.filter( ( element, index ) => this.inclusions[ index ] );
  }

  /**
   * Creates a new combination that is the inverse of this (includes the opposite elements)
   */
  public inverted(): Combination {
    return new Combination( this.inclusions.map( inclusion => !inclusion ) );
  }

  public getIncludedIndices(): number[] {
    return _.range( 0, this.size() ).filter( i => this.inclusions[ i ] );
  }

  public toString(): string {
    return `C[${this.inclusions.map( i => i ? '1' : '0' ).join( '' )}]`;
  }

  public equals( combination: Combination ): boolean {
    return this.inclusions.length === combination.inclusions.length && _.isEqual( this.inclusions, combination.inclusions );
  }

  /**
   * Creates an empty combination of a given size.
   */
  public static empty( size: number ): Combination {
    return new Combination( _.range( 0, size ).map( () => false ) );
  }

  /**
   * Creates a full combination of a given size.
   */
  public static full( size: number ): Combination {
    return new Combination( _.range( 0, size ).map( () => true ) );
  }

  /**
   * Lists all combinations from a given size
   */
  public static combinations( size: number ): Combination[] {

    const combinations: Combination[] = [];
    const stack: boolean[] = [];

    ( function recurse( index: number ): void {
      if ( index === size ) {
        combinations.push( new Combination( stack.slice() ) );
      }
      else {
        stack.push( false );
        recurse( index + 1 );
        stack.pop();
        stack.push( true );
        recurse( index + 1 );
        stack.pop();
      }
    } )( 0 );

    return combinations;
  }

  /**
   * Calls a callback on every single possible permutation of the given Array
   *
   * @param array
   * @param callback - Called on each permuted version of the array possible
   */
  public static forEachCombination<T>( array: T[], callback: ( array: readonly T[] ) => void ): void {
    const stack: T[] = [];

    ( function recurse( index: number ): void {
      if ( index === array.length ) {
        callback( stack );
      }
      else {
        recurse( index + 1 );
        stack.push( array[ index ] );
        recurse( index + 1 );
        stack.pop();
      }
    } )( 0 );
  }

  public static combinationsOf<T>( array: T[] ): T[][] {
    const results: T[][] = [];
    Combination.forEachCombination( array, result => {
      results.push( result.slice() );
    } );
    return results;
  }
}

dot.register( 'Combination', Combination );

export default Combination;