// Copyright 2017-2020, University of Colorado Boulder

/**
 * IO type for Range.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import validate from '../../axon/js/validate.js';
import ObjectIO from '../../tandem/js/types/ObjectIO.js';
import dot from './dot.js';
import Range from './Range.js';

class RangeIO extends ObjectIO {

  /**
   * Encodes a Range instance to a state.
   * @param {Range} range
   * @returns {Object}
   */
  static toStateObject( range ) {
    validate( range, this.validator );
    return { min: range.min, max: range.max };
  }

  /**
   * Decodes a state into a Range.
   * @param {Object} stateObject
   * @returns {Range}
   */
  static fromStateObject( stateObject ) {
    return new Range( stateObject.min, stateObject.max );
  }
}

RangeIO.documentation = 'A range with "min" and a "max" members.';
RangeIO.validator = { valueType: Range };
RangeIO.typeName = 'RangeIO';
ObjectIO.validateSubtype( RangeIO );

dot.register( 'RangeIO', RangeIO );
export default RangeIO;