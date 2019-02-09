// Copyright 2019, University of Colorado Boulder

/**
 * Statistics functions for Dot.
 *
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */

define( require => {
  'use strict';

  const dot = require( 'DOT/dot' );

  const Stats = {

    /**
     * Get the median from an unsorted array of numbers
     * @public
     *
     * @param {Array.<number>} numbers - (un)sorted array
     * @returns {number|null} - null if array is empty
     */
    median( numbers ) {
      assert && assert( Array.isArray( numbers ) );
      assert && numbers.forEach( n => assert && assert( typeof n === 'number' ) );

      numbers.sort( ( a, b ) => a - b );

      if ( numbers.length === 0 ) {
        return null;
      }

      const half = Math.floor( numbers.length / 2 );

      if ( numbers.length % 2 ) {
        return numbers[ half ];
      }
      else {

        // if there are an even number of entries, take the median of the center 2
        return ( numbers[ half - 1 ] + numbers[ half ] ) / 2;
      }
    }
  };

  dot.register( 'Stats', Stats );

  return Stats;
} );
