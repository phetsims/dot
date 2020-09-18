// Copyright 2017-2020, University of Colorado Boulder

/**
 * IO Type for Range.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import IOType from '../../tandem/js/types/IOType.js';
import dot from './dot.js';
import Range from './Range.js';

const RangeIO = new IOType( 'RangeIO', {
  valueType: Range,
  documentation: 'A range with "min" and a "max" members.',
  toStateObject( range ) {
    return { min: range.min, max: range.max };
  },
  fromStateObject( stateObject ) {
    return new Range( stateObject.min, stateObject.max );
  }
} );

dot.register( 'RangeIO', RangeIO );
export default RangeIO;