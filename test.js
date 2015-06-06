var expect = require('chai').expect;
var lint = require('mocha-eslint');

var file = './matrix.js';

var Matrix = require(file);

describe('Matrix', function() {

	lint([file]);

	function equal(a, b) {
		return Math.abs(a - b) <= 0.2;
	}

	it('should be a function', function () {
		expect(Matrix).to.be.a('function');
	});


	it('should compare matrices', function() {
		var one = Matrix(1,2,3,4,5,6);
		expect( one.equal( Matrix(1,2,3,4,5,6) ) ).to.be.ok;
		expect( one.equal( Matrix(1.1,2.1,3.1,4.1,5.1,6.1), 0.11) ).to.be.ok;
		expect( one.equal( Matrix(1.2,2.1,3.1,4.1,5.1,6.1), 0.11) ).to.be.not.ok;
		expect( one.equal( Matrix(1.1,2.2,3.1,4.1,5.1,6.1), 0.11) ).to.be.not.ok;
		expect( one.equal( Matrix(1.1,2.1,3.2,4.1,5.1,6.1), 0.11) ).to.be.not.ok;
		expect( one.equal( Matrix(1.1,2.1,3.1,4.2,5.1,6.1), 0.11) ).to.be.not.ok;
		expect( one.equal( Matrix(1.1,2.1,3.1,4.1,5.2,6.1), 0.11) ).to.be.not.ok;
		expect( one.equal( Matrix(1.1,2.1,3.1,4.1,5.1,6.2), 0.11) ).to.be.not.ok;
	});

	it('should copy values', function () {
		var one = Matrix(1,2,3,4,5,6);
		var two = Matrix(2,3,4,5,6,7);
		Matrix.copy(two, one)
		expect( one.equal(two) ).to.be.ok;
	});

	it('should create matrices', function() {
		var one = Matrix(1,2,3,4,5,6);
		expect( one.equal( Matrix(1,2,3,4,5,6) ) ).to.be.ok;
		var two = Matrix(5,6);
		expect( two.equal( Matrix(1,0,0,1,5,6) ) ).to.be.ok;
		var three = Matrix();
		expect( three.equal( Matrix(1,0,0,1,0,0) ) ).to.be.ok;
		var four = Matrix(one);
		expect( four.equal( Matrix(1,2,3,4,5,6) ) ).to.be.ok;

		var five = Matrix(0,0,0,0,0,0);
		expect( five.toString() ).to.equal('matrix(0,0,0,0,0,0)');
		var six = Matrix(five);
		expect( six.equal( five ) ).to.be.ok;

	});

	it('should return CSS value', function() {
		var one = Matrix(1,2,3,4,5,6);
		expect( one.toString() ).to.equal('matrix(1,2,3,4,5,6)');
		expect( one.toString(3) ).to.equal('matrix3d(1,2,0,0,3,4,0,0,0,0,1,0,5,6,0,1)');
		expect( one.toString(4) ).to.equal('matrix(1,2,3,4,5,6)');
	});

	it('should rotate', function() {
		var one = Matrix();
		expect( one.rotate(3).equal(Matrix(0.998630, 0.052336, -0.052336, 0.998630, 0.000000, 0.000000), 0.00001) ).to.be.ok;
	});

	it('should scale', function() {
		var one = Matrix();
		expect( one.rotate(3).scale(3,5).
			equal(Matrix(2.995889, 0.157008, -0.261680, 4.993148, 0.000000, 0.000000), 0.00001) ).to.be.ok;
	});

	it('should translate', function() {
		var one = Matrix();
		expect( one.rotate(3).translate(-3,5).
			equal(Matrix(0.998630, 0.052336, -0.052336, 0.998630, -3.257568, 4.836140), 0.00001) ).to.be.ok;
		var two = Matrix();
		expect( two.translate(-3,5).rotate(3).
			equal(Matrix(0.998630, 0.052336, -0.052336, 0.998630, -3.000000, 5.000000), 0.00001) ).to.be.ok;
		var three = Matrix();
		expect( three.translateRight(-3,5).rotate(3).
			equal(Matrix(0.998630, 0.052336, -0.052336, 0.998630, -3.000000, 5.000000), 0.00001) ).to.be.ok;
	});

	it('should inverse', function() {
		var one;
		var two;
		var three;

		one = Matrix();
		two = one.scale(3).inverse()
		expect( two.equal(Matrix(0.333333, -0.000000, -0.000000, 0.333333, -0.000000, 0.000000), 0.00001) ).to.be.ok;
		expect( two == one ).to.be.not.ok;

		one = Matrix();
		two = Matrix();
		three = one.scale(3).inverse(two)
		expect( three.equal(Matrix(0.333333, -0.000000, -0.000000, 0.333333, -0.000000, 0.000000), 0.00001) ).to.be.ok;
		expect( two == three ).to.be.ok;

		one = Matrix();
		three = one.scale(3).inverse(true)
		expect( three.equal(Matrix(0.333333, -0.000000, -0.000000, 0.333333, -0.000000, 0.000000), 0.00001) ).to.be.ok;
		expect( three == one ).to.be.ok;


	});

	it('should decompose and compose', function() {
		var one = Matrix();
		var dec = Matrix.decompose( one.translate(-30,50).rotate(45).scale(2) );
		expect( equal(dec.sx, 2) ).to.be.ok;
		expect( equal(dec.sy, 2) ).to.be.ok;
		expect( equal(dec.angle, 45) ).to.be.ok;
		expect( equal(dec.e, -30) ).to.be.ok;
		expect( equal(dec.f, 50) ).to.be.ok;

		var two = Matrix.compose(dec);
		expect( two.equal( Matrix().translate(-30,50).rotate(45).scale(2), 0.2 ) ).to.be.ok;

	});

	it('should transform matrix', function() {
		var one = Matrix();
		expect( one.transform(100, 100, 45, 2, 3, 50 -50).
			equal(Matrix(1.4142135623730951, 1.414213562373095,-2.1213203435596424,2.121320343559643,
				170.71067811865473,-253.55339059327378), 0.00001) ).to.be.ok;
	});

	it('should transform point', function() {
		var one = Matrix().transform(100, 100, 45, 2, 3, 50 -50);
		var point = Matrix.transformPoint(one, 70, 80);
		expect( equal(point.x, 100) ).to.be.ok;
		expect( equal(point.y, 15.147186257614294) ).to.be.ok;

		var point2 = Matrix.transformPointReverse(one, 100, 15.147186257614294);
		expect( equal(point2.x, 70) ).to.be.ok;
		expect( equal(point2.y, 80) ).to.be.ok;
	});


});
