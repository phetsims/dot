// Copyright 2013-2023, University of Colorado Boulder

/**
 * An immutable permutation that can permute an array
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import dot from './dot.js';
import Utils from './Utils.js';

class Permutation {

  public readonly indices: number[];

  /**
   * Creates a permutation that will rearrange a list so that newList[i] = oldList[permutation[i]]
   */
  public constructor( indices: number[] ) {
    this.indices = indices;
  }

  public size(): number {
    return this.indices.length;
  }

  /**
   * Applies the permutation, returning either a new array or number (whatever was provided).
   */
  public apply<E, T extends E[] | number>( arrayOrInt: T ): T extends E[] ? number[] : number {
    if ( typeof arrayOrInt === 'number' ) {
      // @ts-expect-error
      return this.indices[ arrayOrInt ];
    }
    else {
      if ( arrayOrInt.length !== this.size() ) {
        throw new Error( `Permutation length ${this.size()} not equal to list length ${arrayOrInt.length}` );
      }

      // permute it as an array
      const result: E[] = new Array( arrayOrInt.length );
      for ( let i = 0; i < arrayOrInt.length; i++ ) {
        result[ i ] = arrayOrInt[ this.indices[ i ] ];
      }
      // @ts-expect-error
      return result;
    }
  }

  /**
   * Creates a new permutation that is the inverse of this.
   */
  public inverted(): Permutation {
    const newPermutation = new Array( this.size() );
    for ( let i = 0; i < this.size(); i++ ) {
      newPermutation[ this.indices[ i ] ] = i;
    }
    return new Permutation( newPermutation );
  }

  public withIndicesPermuted( indices: number[] ): Permutation[] {
    const result: Permutation[] = [];
    Permutation.forEachPermutation( indices, integers => {
      const oldIndices = this.indices;
      const newPermutation = oldIndices.slice( 0 );

      for ( let i = 0; i < indices.length; i++ ) {
        newPermutation[ indices[ i ] ] = oldIndices[ integers[ i ] ];
      }
      result.push( new Permutation( newPermutation ) );
    } );
    return result;
  }

  public toString(): string {
    return `P[${this.indices.join( ', ' )}]`;
  }

  public equals( permutation: Permutation ): boolean {
    return this.indices.length === permutation.indices.length && _.isEqual( this.indices, permutation.indices );
  }

  /**
   * Creates an identity permutation of a given size.
   */
  public static identity( size: number ): Permutation {
    assert && assert( size >= 0 );
    const indices = new Array( size );
    for ( let i = 0; i < size; i++ ) {
      indices[ i ] = i;
    }
    return new Permutation( indices );
  }

  /**
   * Lists all permutations that have a given size
   */
  public static permutations( size: number ): Permutation[] {
    const result: Permutation[] = [];
    Permutation.forEachPermutation( Utils.rangeInclusive( 0, size - 1 ), integers => {
      result.push( new Permutation( integers.slice() ) );
    } );
    return result;
  }

  /**
   * Calls a callback on every single possible permutation of the given Array
   *
   * @param array
   * @param callback - Called on each permuted version of the array possible
   */
  public static forEachPermutation<T>( array: T[], callback: ( array: readonly T[] ) => void ): void {
    recursiveForEachPermutation( array, [], callback );
  }

  public static permutationsOf<T>( array: T[] ): T[][] {
    const results: T[][] = [];
    Permutation.forEachPermutation( array, result => {
      results.push( result.slice() );
    } );
    return results;
  }
}

dot.register( 'Permutation', Permutation );

/**
 * Call our function with each permutation of the provided list PREFIXED by prefix, in lexicographic order
 *
 * @param array   List to generate permutations of
 * @param prefix   Elements that should be inserted at the front of each list before each call
 * @param callback Function to call
 */
function recursiveForEachPermutation<T>( array: T[], prefix: T[], callback: ( array: readonly T[] ) => void ): void {
  if ( array.length === 0 ) {
    callback( prefix );
  }
  else {
    for ( let i = 0; i < array.length; i++ ) {
      const element = array[ i ];

      // remove the element from the array
      const nextArray = array.slice( 0 );
      nextArray.splice( i, 1 );

      // add it into the prefix
      const nextPrefix = prefix.slice( 0 );
      nextPrefix.push( element );

      recursiveForEachPermutation( nextArray, nextPrefix, callback );
    }
  }
}

export default Permutation;