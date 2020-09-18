// Copyright 2017-2020, University of Colorado Boulder

/**
 * IO Type for Bounds3
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */

import IOType from '../../tandem/js/types/IOType.js';
import Bounds3 from './Bounds3.js';
import dot from './dot.js';

const Bounds3IO = new IOType( 'Bounds3IO', {
  valueType: Bounds3,
  documentation: 'a 3-dimensional bounds (bounding box)',
  toStateObject( bounds3 ) {
    return {
      minX: bounds3.minX,
      minY: bounds3.minY,
      minZ: bounds3.minZ,

      maxX: bounds3.maxX,
      maxY: bounds3.maxY,
      maxZ: bounds3.maxZ
    };
  },
  fromStateObject( stateObject ) {
    return new Bounds3(
      stateObject.minX, stateObject.minY, stateObject.minZ,
      stateObject.maxX, stateObject.maxY, stateObject.maxZ
    );
  }
} );

dot.register( 'Bounds3IO', Bounds3IO );
export default Bounds3IO;