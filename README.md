# Matrix

General purpose, low garbage affine matrix library.

## Why?

I needed separate (no dependencies), minimal matrix library that is garbage friendly and can be called extensively (as in Javascript animations). 

## Install

	$ npm install @atirip/matrix

Or clone this repo. 

## Usage

	import {Matrix} from './matrix.js';

	
## API

##### Create matrix:

	var matrix = new Matrix(); // creates identity matrix
	var matrix = new Matrix(1, 2, 3, 4, 5, 6);
	var matrix = new Matrix(5, 6); // equals new Matrix(1, 0, 0, 1, 5, 6)
	var matrix = new Matrix( new Matrix() ); // clone

You may omit `new`.
	
##### Do some simple stuff with it:  
As a general principle - `this` Matrix is always changed!
	
	matrix.rotate(45); // in degrees
	matrix.scale(2); // in unoform
	matrix.scale(2, 3);
	matrix.translate(100, 50);

Complex transform:
	
	matrix.transform(originX, originY, angle, sx, sy, x, y);

Scale, rotate matrix over specified origin, then translate. This is how one implements gesture based zoom/rotate/translate in iOS webapp for example.

##### Static utility functions:

	Matrix.transformPoint(matrix, x, y /*, result*/);
	Matrix.transformPointReverse(matrix, x, y /*, result*/);
	Matrix.decompose(decomposed);
	Matrix.compose(matrix /*, result*);
	Matrix.copy(from, to);

If you pass `result` object, it is used, if not, new is created. That avoids creating garbage in loops. 

## Test

	$ npm test

## License

Copyright &copy; 2015 Priit Pirita, released under the MIT license.

