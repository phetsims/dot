// Copyright 2017-2020, University of Colorado Boulder

/**
 * IO Type for Bounds2
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */

import IOType from '../../tandem/js/types/IOType.js';
import Bounds2 from './Bounds2.js';
import dot from './dot.js';

const Bounds2IO = new IOType( 'Bounds2IO', {
  valueType: Bounds2,
  documentation: 'a 2-dimensional bounds rectangle',
  /**
   * Encodes a Bounds2 instance to a state.
   * @param {Bounds2} bounds2
   * @returns {Object}
   * @override
   * @public
   */
  toStateObject( bounds2 ) {
    return {
      minX: bounds2.minX,
      minY: bounds2.minY,

      maxX: bounds2.maxX,
      maxY: bounds2.maxY
    };
  },

  /**
   * Decodes a state into a Bounds2.
   * @param {Object} stateObject
   * @returns {Bounds2}
   * @override
   * @public
   */
  fromStateObject( stateObject ) {
    return new Bounds2(
      stateObject.minX, stateObject.minY,
      stateObject.maxX, stateObject.maxY
    );
  }
} );

dot.register( 'Bounds2IO', Bounds2IO );
export default Bounds2IO;