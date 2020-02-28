// Copyright 2017-2020, University of Colorado Boulder

/**
 * IO Type for Bounds2
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */

import validate from '../../axon/js/validate.js';
import ObjectIO from '../../tandem/js/types/ObjectIO.js';
import Bounds2 from './Bounds2.js';
import dot from './dot.js';

class Bounds2IO extends ObjectIO {

  /**
   * Encodes a Bounds2 instance to a state.
   * @param {Bounds2} bounds2
   * @returns {Object}
   * @override
   */
  static toStateObject( bounds2 ) {
    validate( bounds2, this.validator );
    return {
      minX: bounds2.minX,
      minY: bounds2.minY,

      maxX: bounds2.maxX,
      maxY: bounds2.maxY
    };
  }

  /**
   * Decodes a state into a Bounds2.
   * @param {Object} stateObject
   * @returns {Bounds2}
   * @override
   */
  static fromStateObject( stateObject ) {
    return new Bounds2(
      stateObject.minX, stateObject.minY,
      stateObject.maxX, stateObject.maxY
    );
  }
}

Bounds2IO.documentation = 'a 2-dimensional bounds rectangle';
Bounds2IO.validator = { valueType: Bounds2 };
Bounds2IO.typeName = 'Bounds2IO';
ObjectIO.validateSubtype( Bounds2IO );

dot.register( 'Bounds2IO', Bounds2IO );
export default Bounds2IO;