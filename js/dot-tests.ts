// Copyright 2017-2025, University of Colorado Boulder

/**
 * Unit tests for dot. Please run once in phet brand and once in brand=phet-io to cover all functionality.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import qunitStart from '../../chipper/js/browser/sim-tests/qunitStart.js';
import './BinPackerTests.js';
import './Bounds2Tests.js';
import './ComplexTests.js';
import './DampedHarmonicTests.js';
import './LinearFunctionTests.js';
import './Matrix3Tests.js';
import './MatrixOps3Tests.js';
import './OpenRangeTests.js';
import './PiecewiseLinearFunctionTests.js';
import './RandomTests.js';
import './RangeTests.js';
import './RangeWithValueTests.js';
import './RunningAverageTests.js';
import './StatsTests.js';
import './Transform3Tests.js';
import './UnivariatePolynomialTests.js';
import './UtilsTests.js';
import './Vector2PropertyTests.js';
import './Vector2Tests.js';
import './Vector3Tests.js';
import './Vector4Tests.js';

// Since our tests are loaded asynchronously, we must direct QUnit to begin the tests
qunitStart();