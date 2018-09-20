// Copyright 2017, University of Colorado Boulder

/**
 * BinPacker tests
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var BinPacker = require( 'DOT/BinPacker' );
  var Bounds2 = require( 'DOT/Bounds2' );

  QUnit.module( 'BinPacker' );

  QUnit.test( 'Entire BinPacker allocation', function( assert ) {
    var p = new BinPacker( new Bounds2( 0, 0, 1, 1 ) );
    var bin = p.allocate( 1, 1 );
    assert.ok( bin, 'Should have a bin' );
    assert.ok( !p.allocate( 1, 1 ), 'Should not be able to fit another bin' );
  } );

  QUnit.test( 'Many bins', function( assert ) {
    function checkNoOverlappingBins( array, containingBounds ) {
      for ( var i = 0; i < array.length; i++ ) {
        if ( array[ i ] ) {
          assert.ok( array[ i ].bounds.intersection( containingBounds ).equals( array[ i ].bounds ), 'Bin containment in packer' );
          for ( var j = 0; j < array.length; j++ ) {
            if ( array[ i ] && array[ j ] ) {
              assert.ok( !array[ i ].bounds.intersection( array[ j ] ).hasNonzeroArea(), 'Bin intersection' );
            }
          }
        }
      }
    }

    var bounds = new Bounds2( 0, 0, 1, 1 );

    // manual selection
    var p = new BinPacker( bounds );
    var bins = [];
    bins.push( p.allocate( 0.5, 0.5 ) );
    bins.push( p.allocate( 0.7, 0.5 ) );
    bins.push( p.allocate( 0.25, 0.25 ) );
    bins.push( p.allocate( 0.25, 0.25 ) );
    bins.push( p.allocate( 0.25, 0.25 ) );
    bins.push( p.allocate( 0.5, 0.5 ) );
    bins.push( p.allocate( 0.25, 0.25 ) );
    bins.push( p.allocate( 0.125, 0.125 ) );
    checkNoOverlappingBins( bins, bounds );

    // random selection 1
    p = new BinPacker( bounds );
    bins = [];
    bins.push( p.allocate( 0.44616834132466465, 0.41642577887978405 ) );
    bins.push( p.allocate( 0.17503398610278964, 0.4698250909568742 ) );
    bins.push( p.allocate( 0.3687713402323425, 0.49438447563443333 ) );
    bins.push( p.allocate( 0.2212155022425577, 0.12973863759543747 ) );
    bins.push( p.allocate( 0.23436783626675606, 0.1793858843157068 ) );
    bins.push( p.allocate( 0.3277881086105481, 0.4529883404029533 ) );
    bins.push( p.allocate( 0.4578828973462805, 0.16699283372145146 ) );
    bins.push( p.allocate( 0.4951147836400196, 0.3712761078495532 ) );
    bins.push( p.allocate( 0.12035920866765082, 0.07933398941531777 ) );
    bins.push( p.allocate( 0.36102635774295777, 0.26559913356322795 ) );
    bins.push( p.allocate( 0.26784382725600153, 0.1836349458899349 ) );
    bins.push( p.allocate( 0.456789412884973, 0.42209713079500943 ) );
    bins.push( p.allocate( 0.02109772653784603, 0.4639585859840736 ) );
    bins.push( p.allocate( 0.044332472258247435, 0.33952464745379984 ) );
    bins.push( p.allocate( 0.11757566663436592, 0.36193573055788875 ) );
    bins.push( p.allocate( 0.14551889873109758, 0.24299477378372103 ) );
    bins.push( p.allocate( 0.12425019813235849, 0.19861565995961428 ) );
    bins.push( p.allocate( 0.44360995781607926, 0.22602709149941802 ) );
    bins.push( p.allocate( 0.2773028160445392, 0.244650712586008 ) );
    bins.push( p.allocate( 0.010583164519630373, 0.36023413320071995 ) );
    bins.push( p.allocate( 0.4406554071465507, 0.03555020003113896 ) );
    bins.push( p.allocate( 0.003882627352140844, 0.3892397922463715 ) );
    bins.push( p.allocate( 0.4342632673215121, 0.26994243171066046 ) );
    bins.push( p.allocate( 0.058485708897933364, 0.45621076493989676 ) );
    bins.push( p.allocate( 0.433261381695047, 0.2682658712146804 ) );
    checkNoOverlappingBins( bins, bounds );

    // random selection 2
    p = new BinPacker( bounds );
    bins = [];
    bins.push( p.allocate( 0.28867508897868294, 0.11809981148689985 ) );
    bins.push( p.allocate( 0.05196294980123639, 0.2273987023315082 ) );
    bins.push( p.allocate( 0.3091744827882697, 0.12894233805127442 ) );
    bins.push( p.allocate( 0.2400183773910006, 0.1845946432246516 ) );
    bins.push( p.allocate( 0.23558943594495454, 0.3245649382006377 ) );
    bins.push( p.allocate( 0.2981676709993432, 0.03869332140311599 ) );
    bins.push( p.allocate( 0.017755866593991716, 0.06222250103019178 ) );
    bins.push( p.allocate( 0.1694269891207417, 0.05473406030796468 ) );
    bins.push( p.allocate( 0.2209187406115234, 0.14402692733953396 ) );
    bins.push( p.allocate( 0.12201850721612573, 0.29193569083387655 ) );
    bins.push( p.allocate( 0.21890780849692723, 0.31901532093373436 ) );
    bins.push( p.allocate( 0.15136818083313605, 0.23815657361410558 ) );
    bins.push( p.allocate( 0.2932796392124146, 0.21944063684592643 ) );
    bins.push( p.allocate( 0.19007220507288972, 0.32989378677060205 ) );
    bins.push( p.allocate( 0.3011179862078279, 0.22924432515477142 ) );
    bins.push( p.allocate( 0.00008728060250480969, 0.2887297725925843 ) );
    bins.push( p.allocate( 0.07768157411677142, 0.2697811302108069 ) );
    bins.push( p.allocate( 0.16336605860851705, 0.22413462478046617 ) );
    bins.push( p.allocate( 0.1316782592330128, 0.12904599534037212 ) );
    bins.push( p.allocate( 0.025292747964461643, 0.3277013657304148 ) );
    bins.push( p.allocate( 0.06412563938647509, 0.21915481549998125 ) );
    bins.push( p.allocate( 0.32486365052560967, 0.2792208661946158 ) );
    bins.push( p.allocate( 0.10311868538459142, 0.2188195480654637 ) );
    bins.push( p.allocate( 0.28303924466793734, 0.1862659997617205 ) );
    bins.push( p.allocate( 0.08514244800123076, 0.10663530377981563 ) );
    bins.push( p.allocate( 0.29217134749827284, 0.19149748445488513 ) );
    bins.push( p.allocate( 0.027393308002501726, 0.21918218621673682 ) );
    bins.push( p.allocate( 0.10661425278522074, 0.29555924283340573 ) );
    bins.push( p.allocate( 0.2672333570662886, 0.27894352834361297 ) );
    bins.push( p.allocate( 0.04347166659620901, 0.1237633553488801 ) );
    bins.push( p.allocate( 0.05252628649274508, 0.07491425851670404 ) );
    bins.push( p.allocate( 0.3171079190603147, 0.05559094832278788 ) );
    bins.push( p.allocate( 0.0013751634396612644, 0.10906922242914636 ) );
    bins.push( p.allocate( 0.10426920272099476, 0.3224470660400887 ) );
    bins.push( p.allocate( 0.020921604009345174, 0.272700310839961 ) );
    checkNoOverlappingBins( bins, bounds );

    // remove some (every other one)
    for ( var i = 0; i < bins.length; i += 2 ) {
      if ( bins[ i ] ) {
        p.deallocate( bins[ i ] );
        bins[ i ] = null;
      }
    }

    // and try adding more
    bins.push( p.allocate( 0.07768157411677142, 0.2697811302108069 ) );
    bins.push( p.allocate( 0.16336605860851705, 0.22413462478046617 ) );
    bins.push( p.allocate( 0.1316782592330128, 0.12904599534037212 ) );
    bins.push( p.allocate( 0.025292747964461643, 0.3277013657304148 ) );
    bins.push( p.allocate( 0.06412563938647509, 0.21915481549998125 ) );
    bins.push( p.allocate( 0.32486365052560967, 0.2792208661946158 ) );
    bins.push( p.allocate( 0.10311868538459142, 0.2188195480654637 ) );
    bins.push( p.allocate( 0.28303924466793734, 0.1862659997617205 ) );
    bins.push( p.allocate( 0.08514244800123076, 0.10663530377981563 ) );
    bins.push( p.allocate( 0.29217134749827284, 0.19149748445488513 ) );
    bins.push( p.allocate( 0.027393308002501726, 0.21918218621673682 ) );
    bins.push( p.allocate( 0.10661425278522074, 0.29555924283340573 ) );
    bins.push( p.allocate( 0.2672333570662886, 0.27894352834361297 ) );
    bins.push( p.allocate( 0.04347166659620901, 0.1237633553488801 ) );
    bins.push( p.allocate( 0.05252628649274508, 0.07491425851670404 ) );
    bins.push( p.allocate( 0.3171079190603147, 0.05559094832278788 ) );
    bins.push( p.allocate( 0.0013751634396612644, 0.10906922242914636 ) );
    bins.push( p.allocate( 0.10426920272099476, 0.3224470660400887 ) );
    bins.push( p.allocate( 0.020921604009345174, 0.272700310839961 ) );

    checkNoOverlappingBins( bins, bounds );

    // remove all bins
    for ( i = 0; i < bins.length; i++ ) {
      if ( bins[ i ] ) {
        p.deallocate( bins[ i ] );
        bins[ i ] = null;
      }
    }

    // once empty, ensure we can allocate the full thing
    var fullBin = p.allocate( 1, 1 );
    assert.ok( fullBin, 'Allocation of full bin' );
  } );
} );