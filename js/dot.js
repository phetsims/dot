// Copyright 2013-2020, University of Colorado Boulder


import Namespace from '../../phet-core/js/Namespace.js';

const dot = new Namespace( 'dot' );

dot.register( 'v2', ( x, y ) => new dot.Vector2( x, y ) );
dot.register( 'v3', ( x, y, z ) => new dot.Vector3( x, y, z ) );
dot.register( 'v4', ( x, y, z, w ) => new dot.Vector4( x, y, z, w ) );

// TODO: performance: check browser speed to compare how fast this is. We may need to add a 32 option for GL ES.
dot.register( 'FastArray', window.Float64Array ? window.Float64Array : window.Array );

// will be filled in by other modules
export default dot;