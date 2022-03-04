// Copyright 2013-2022, University of Colorado Boulder


import Namespace from '../../phet-core/js/Namespace.js';

const dot = new Namespace( 'dot' );

// TODO: performance: check browser speed to compare how fast this is. We may need to add a 32 option for GL ES.
dot.register( 'FastArray', window.Float64Array ? window.Float64Array : window.Array );

// will be filled in by other modules
export default dot;