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
  toStateObject: bounds2 => ( { minX: bounds2.minX, minY: bounds2.minY, maxX: bounds2.maxX, maxY: bounds2.maxY } ),
  fromStateObject: stateObject => new Bounds2( stateObject.minX, stateObject.minY, stateObject.maxX, stateObject.maxY )
} );

dot.register( 'Bounds2IO', Bounds2IO );
export default Bounds2IO;