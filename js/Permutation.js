// Copyright 2013-2020, University of Colorado Boulder

/**
 * An immutable permutation that can permute an array
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import isArray from '../../phet-core/js/isArray.js';
import dot from './dot.js';
import './Utils.js'; // for rangeInclusive

// Creates a permutation that will rearrange a list so that newList[i] = oldList[permutation[i]]
function Permutation( indices ) {
  this.indices = indices;
}

dot.register( 'Permutation', Permutation );

// An identity permutation with a specific number of elements
Permutation.identity = function( size ) {
  assert && assert( size >= 0 );
  const indices = new Array( size );
  for ( let i = 0; i < size; i++ ) {
    indices[ i ] = i;
  }
  return new Permutation( indices );
};

// lists all permutations that have a given size
Permutation.permutations = function( size ) {
  const result = [];
  Permutation.forEachPermutation( dot.rangeInclusive( 0, size - 1 ), function( integers ) {
    result.push( new Permutation( integers ) );
  } );
  return result;
};

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

Permutation.forEachPermutation = function( array, callback ) {
  recursiveForEachPermutation( array, [], callback );
};

Permutation.prototype = {
  constructor: Permutation,

  size: function() {
    return this.indices.length;
  },

  apply: function( arrayOrInt ) {
    if ( isArray( arrayOrInt ) ) {
      if ( arrayOrInt.length !== this.size() ) {
        throw new Error( 'Permutation length ' + this.size() + ' not equal to list length ' + arrayOrInt.length );
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
  },

  // The inverse of this permutation
  inverted: function() {
    const newPermutation = new Array( this.size() );
    for ( let i = 0; i < this.size(); i++ ) {
      newPermutation[ this.indices[ i ] ] = i;
    }
    return new Permutation( newPermutation );
  },

  withIndicesPermuted: function( indices ) {
    const result = [];
    const self = this;
    Permutation.forEachPermutation( indices, function( integers ) {
      const oldIndices = self.indices;
      const newPermutation = oldIndices.slice( 0 );

      for ( let i = 0; i < indices.length; i++ ) {
        newPermutation[ indices[ i ] ] = oldIndices[ integers[ i ] ];
      }
      result.push( new Permutation( newPermutation ) );
    } );
    return result;
  },

  toString: function() {
    return 'P[' + this.indices.join( ', ' ) + ']';
  }
};

Permutation.testMe = function( console ) {
  const a = new Permutation( [ 1, 4, 3, 2, 0 ] );
  console.log( a.toString() );

  const b = a.inverted();
  console.log( b.toString() );

  console.log( b.withIndicesPermuted( [ 0, 3, 4 ] ).toString() );

  console.log( Permutation.permutations( 4 ).toString() );
};

export default Permutation;