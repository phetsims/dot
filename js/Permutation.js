// Copyright 2013-2021, University of Colorado Boulder

/**
 * An immutable permutation that can permute an array
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import isArray from '../../phet-core/js/isArray.js';
import './Utils.js';
import dot from './dot.js';

class Permutation {
  /**
   * Creates a permutation that will rearrange a list so that newList[i] = oldList[permutation[i]]
   *
   * @param {Array.<number>} indices
   */
  constructor( indices ) {
    // @public {Array.<number>}
    this.indices = indices;
  }

  /**
   * @public
   *
   * @returns {number}
   */
  size() {
    return this.indices.length;
  }

  /**
   * Applies the permutation, returning either a new array or number (whatever was provided).
   * @public
   *
   * @param {Array.<number>|number} arrayOrInt
   * @returns {Array.<number>|number}
   */
  apply( arrayOrInt ) {
    if ( isArray( arrayOrInt ) ) {
      if ( arrayOrInt.length !== this.size() ) {
        throw new Error( `Permutation length ${this.size()} not equal to list length ${arrayOrInt.length}` );
      }

      // permute it as an array
      const result = new Array( arrayOrInt.length );
      for ( let i = 0; i < arrayOrInt.length; i++ ) {
        result[ i ] = arrayOrInt[ this.indices[ i ] ];
      }
      return result;
    }
    else {
      // permute a single index
      return this.indices[ arrayOrInt ];
    }
  }

  /**
   * Creates a new permutation that is the inverse of this.
   * @public
   *
   * @returns {Permutation}
   */
  inverted() {
    const newPermutation = new Array( this.size() );
    for ( let i = 0; i < this.size(); i++ ) {
      newPermutation[ this.indices[ i ] ] = i;
    }
    return new Permutation( newPermutation );
  }

  /**
   * @public
   *
   * @param {Array.<number>} indices
   * @returns {Array.<Permutation>}
   */
  withIndicesPermuted( indices ) {
    const result = [];
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

  /**
   * @public
   *
   * @returns {string}
   */
  toString() {
    return `P[${this.indices.join( ', ' )}]`;
  }

  /**
   * Creates an identity permutation of a given size.
   * @public
   *
   * @param {number} size
   * @returns {Permutation}
   */
  static identity( size ) {
    assert && assert( size >= 0 );
    const indices = new Array( size );
    for ( let i = 0; i < size; i++ ) {
      indices[ i ] = i;
    }
    return new Permutation( indices );
  }

  /**
   * Lists all permutations that have a given size
   * @public
   *
   * @param {number} size
   * @returns {Array.<Permutation>}
   */
  static permutations( size ) {
    const result = [];
    Permutation.forEachPermutation( dot.rangeInclusive( 0, size - 1 ), integers => {
      result.push( new Permutation( integers ) );
    } );
    return result;
  }

  /**
   * Calls a callback on every single possible permutation of the given Array
   * @public
   *
   * @param {Array.<*>} array
   * @param {function(Array.<*>)} callback - Called on each permuted version of the array possible
   */
  static forEachPermutation( array, callback ) {
    recursiveForEachPermutation( array, [], callback );
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
function recursiveForEachPermutation( array, prefix, callback ) {
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