	var pi = Math.PI;
	var RAD2DEG = 180 / pi;
	var DEG2RAD = pi / 180;
	var cos = Math.cos;
	var sin = Math.sin;
	var abs = Math.abs;
	var sqrt = Math.sqrt;
	var atan2 = Math.atan2;

	function copy(from, to) {
		to.a = from.a;
		to.b = from.b;
		to.c = from.c;
		to.d = from.d;
		to.e = from.e;
		to.f = from.f;
		return to;
	}

	function set(to, a, b, c, d, e, f) {
		to.a = a === undefined ? 1 : a;
		to.b = b||0;
		to.c = c||0;
		to.d = d == undefined ? 1 : d;
		to.e = e||0;
		to.f = f||0;
		return to;
	}

	// for toCSS
	var arr = new Array(6);
	var arr3D = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];

	function decompose(matrix, result) {
		result || ( result = {} );
		// leave matrix intact
		var m = copy(matrix, tmpD);

		var sx = sqrt(m.a * m.a + m.b * m.b);
		var sy = sqrt(m.c * m.c + m.d * m.d);
		var	angle;

		if (m.a * m.d - m.c * m.b < 0) {
			if (m.a < m.d) {
				sx = -sx;
			} else {
				sy = -sy;
			}
		}

		m.scale(1 / sx, 1 / sy);
		angle = atan2(m.b, m.a) * RAD2DEG;
		m.rotate(-angle);

		result.sx = sx;
		result.sy = sy;
		result.angle = angle; // degrees
		result.a = m.a;
		result.b = m.b;
		result.c = m.c;
		result.d = m.d;
		result.e = m.e;
		result.f = m.f;
		return result;
	}

	function compose(decomposed, matrix) {
		return copy(decomposed, matrix || new Matrix()).rotate(decomposed.angle).scale(decomposed.sx, decomposed.sy);
	}

	function identityOrTranslation(matrix) {
		return matrix.a == 1 && matrix.b == 0 && matrix.c == 0 && matrix.d == 1;
	}

	function transformPoint(matrix, x, y, res) {
		res || ( res = {} );
		res.x = x * matrix.a + y * matrix.c + matrix.e;
		res.y = x * matrix.b + y * matrix.d + matrix.f;
		return res;
	}

	function transformPointReverse(matrix, px, py, res, modifySelf) {
		return transformPoint(matrix.inverse(modifySelf), px, py, res);
	}

	function transformMatrix(matrix, originX, originY, angle, sx, sy, x, y) {
		var inverse = matrix.inverse();
		var tx = originX * inverse.a + originY * inverse.c + inverse.e;
		var ty = originX * inverse.b + originY * inverse.d + inverse.f;

		matrix.e = originX;
		matrix.f = originY;

		angle && matrix.rotate(angle);
		(sx == 1 && sy == 1) || matrix.scale(sx, sy);
		(tx || ty) && matrix.translate(-tx, -ty);

		matrix.e += x||0;
		matrix.f += y||0;

		return matrix;
	}

	function Matrix(a, b, c, d, e, f) {
		if ( !(this instanceof Matrix) ) {
			return new Matrix(a, b, c, d, e, f);
		}
		this.set(a, b, c, d, e, f);
	}

	Matrix.transformPoint = transformPoint;
	Matrix.transformPointReverse = transformPointReverse;
	Matrix.transform = transformMatrix;
	Matrix.compose = compose;
	Matrix.decompose = decompose;
	Matrix.copy = copy;

	Matrix.prototype = {

		inverse: function(modify) {
			var source;
			var result;
			if ( modify ) {
				if ( modify instanceof Matrix && modify != this ) {
					// modify is matrix - we change that matrix
					source = this;
					result = modify;
				} else {
					// modify == true - we change THIS instance
					source = copy(this, tmpI);
					result = this;
				}
			} else {
				// as default - new instance is returned
				source = this;
				result = new Matrix();
			}

			var det = source.a * source.d - source.b * source.c;
			if (det) {
				if ( identityOrTranslation(source) ) {
					result.e = -source.e;
					result.f = -source.f;
				} else {
					det = 1 / det;
					result.a = source.d * det;
					result.b = -source.b * det;
					result.c = -source.c * det;
					result.d = source.a * det;
					result.e = (source.c * source.f - source.e * source.d) * det;
					result.f = -(source.a * source.f - source.e * source.b) * det;
				}
			}
			return result;
		},

		// this = this * other
		multiply: function(other) {
			var source = copy(this, tmpM);
			this.a = other.a * source.a + other.b * source.c;
			this.b = other.a * source.b + other.b * source.d;
			this.c = other.c * source.a + other.d * source.c;
			this.d = other.c * source.b + other.d * source.d;
			this.e = other.e * source.a + other.f * source.c + source.e;
			this.f = other.e * source.b + other.f * source.d + source.f;
			return this;
		},

		// this = this * angle
		rotate: function(angle) {
			angle *= DEG2RAD;
			var cosAngle = cos(angle);
			var sinAngle = sin(angle);
			return this.multiply( set(tmpR, cosAngle, sinAngle, -sinAngle, cosAngle, 0, 0) );
		},

		// this = this * scale
		scale: function(sx, sy) {
			if ( sy === undefined ) {
				sy = sx;
			}
			this.a *= sx;
			this.b *= sx;
			this.c *= sy;
			this.d *= sy;
			return this;
		},

		// this = this * translation
		translate: function(tx, ty) {
			if (identityOrTranslation(this)) {
				this.e += tx;
				this.f += ty;
			} else {
				this.e += tx * this.a + ty * this.c;
				this.f += tx * this.b + ty * this.d;
			}
			return this;
		},

		// this = translation * this
		translateRight: function(tx, ty) {
			this.e += tx||0;
			this.f += ty||0;
			return this;
		},

		equal: function(m, p) {
			p || (p = 1E-6);
			if ( this == m ) { return true; }
			return abs(this.a-m.a)<=p && abs(this.b-m.b)<=p && abs(this.c-m.c)<=p &&
					abs(this.d-m.d)<=p && abs(this.e-m.e)<=p && abs(this.f-m.f)<=p;
		},

		set: function(a, b, c, d, e, f) {
			if ( a !== undefined && b === undefined && 'a' in a ) {
				// allow object
				set(this, a.a, a.b, a.c, a.d, a.e, a.f);
			} else {
				if ( b !== undefined && c === undefined ) {
					// allow 2 arguments
					e = a;
					f = b;
					a = this.a;
					b = this.b;
					c = this.c;
					d = this.d;
				}
				set(this, a, b, c, d, e, f);
			}
			return this;
		},

		toString: function(d) {
			if ( d == 3 ) {
				arr3D[0] = this.a;
				arr3D[1] = this.b;
				arr3D[4] = this.c;
				arr3D[5] = this.d;
				arr3D[12] = this.e;
				arr3D[13] = this.f;
				return 'matrix3d(' + arr3D.join() + ')';
			}
			arr.splice(0, 6, this.a, this.b, this.c, this.d, this.e, this.f);
			return 'matrix(' + arr.join() + ')';
		},

		transform: function(originX, originY, angle, sx, sy, x, y) {
			return transformMatrix(this, originX, originY, angle, sx, sy, x, y);
		}

	};

	var tmpI = new Matrix(); // inverse
	var tmpD = new Matrix(); // decompose
	var tmpM = new Matrix(); // multiply
	var tmpR = new Matrix(); // rotate


	export { Matrix };

