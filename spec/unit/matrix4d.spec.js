var requirejs = require("requirejs");
requirejs.config({nodeRequire: require});

requirejs(["../../src/matrix4d", "../../src/quaternion", "../../src/vector3d"], function(Matrix4D, Quaternion, Vector3D) {
	describe('Matrix4D', function() {
		beforeEach(function() {
			return this.mat = new Matrix4D();
		});

		it('should create a copy of the matrix', function() {
			for (var i = 0; i <= 15; i++) {
				this.mat.data[i] = i;
			}
			
			var mat2 = this.mat.clone();
			for (i = 0; i <= 15; i++) {
				expect(mat2.data[i]).toEqual(this.mat.data[i]);
			}

			for (i = 15; i >= 0; i--) {
				this.mat.data[i] = i;
			}
			this.mat.clone(mat2);
			
			for (i = 0; i <= 15; i++) {
				expect(mat2.data[i]).toEqual(this.mat.data[i]);
			}
		});

		it('should be identity when new', function() {
			expect(this.mat.data[0]).toEqual(1);
			expect(this.mat.data[1]).toEqual(0);
			expect(this.mat.data[2]).toEqual(0);
			expect(this.mat.data[3]).toEqual(0);
			expect(this.mat.data[4]).toEqual(0);
			expect(this.mat.data[5]).toEqual(1);
			expect(this.mat.data[6]).toEqual(0);
			expect(this.mat.data[7]).toEqual(0);
			expect(this.mat.data[8]).toEqual(0);
			expect(this.mat.data[9]).toEqual(0);
			expect(this.mat.data[10]).toEqual(1);
			expect(this.mat.data[11]).toEqual(0);
			expect(this.mat.data[12]).toEqual(0);
			expect(this.mat.data[13]).toEqual(0);
			expect(this.mat.data[14]).toEqual(0);
			expect(this.mat.data[15]).toEqual(1);
		});

		it("should make a translation matrix", function() {
			this.mat.makeTranslation(2, 3, 4);
			expect(this.mat.data[0]).toEqual(1);
			expect(this.mat.data[1]).toEqual(0);
			expect(this.mat.data[2]).toEqual(0);
			expect(this.mat.data[3]).toEqual(0);
			expect(this.mat.data[4]).toEqual(0);
			expect(this.mat.data[5]).toEqual(1);
			expect(this.mat.data[6]).toEqual(0);
			expect(this.mat.data[7]).toEqual(0);
			expect(this.mat.data[8]).toEqual(0);
			expect(this.mat.data[9]).toEqual(0);
			expect(this.mat.data[10]).toEqual(1);
			expect(this.mat.data[11]).toEqual(0);
			expect(this.mat.data[12]).toEqual(2);
			expect(this.mat.data[13]).toEqual(3);
			expect(this.mat.data[14]).toEqual(4);
			expect(this.mat.data[15]).toEqual(1);
		});

		it("should translate matrix and store it in itself", function() {
			this.mat.translate(2, 3, 4);
			expect(this.mat.data[0]).toEqual(1);
			expect(this.mat.data[1]).toEqual(0);
			expect(this.mat.data[2]).toEqual(0);
			expect(this.mat.data[3]).toEqual(0);
			expect(this.mat.data[4]).toEqual(0);
			expect(this.mat.data[5]).toEqual(1);
			expect(this.mat.data[6]).toEqual(0);
			expect(this.mat.data[7]).toEqual(0);
			expect(this.mat.data[8]).toEqual(0);
			expect(this.mat.data[9]).toEqual(0);
			expect(this.mat.data[10]).toEqual(1);
			expect(this.mat.data[11]).toEqual(0);
			expect(this.mat.data[12]).toEqual(2);
			expect(this.mat.data[13]).toEqual(3);
			expect(this.mat.data[14]).toEqual(4);
			expect(this.mat.data[15]).toEqual(1);
		});

		it("should translate matrix and store it in destination", function() {
			var mat2 = new Matrix4D();
			mat2.translate(2, 3, 4, this.mat);
			expect(this.mat.data[0]).toEqual(1);
			expect(this.mat.data[1]).toEqual(0);
			expect(this.mat.data[2]).toEqual(0);
			expect(this.mat.data[3]).toEqual(0);
			expect(this.mat.data[4]).toEqual(0);
			expect(this.mat.data[5]).toEqual(1);
			expect(this.mat.data[6]).toEqual(0);
			expect(this.mat.data[7]).toEqual(0);
			expect(this.mat.data[8]).toEqual(0);
			expect(this.mat.data[9]).toEqual(0);
			expect(this.mat.data[10]).toEqual(1);
			expect(this.mat.data[11]).toEqual(0);
			expect(this.mat.data[12]).toEqual(2);
			expect(this.mat.data[13]).toEqual(3);
			expect(this.mat.data[14]).toEqual(4);
			expect(this.mat.data[15]).toEqual(1);
		});

		it("should make a scale matrix", function() {
			this.mat.makeScale(2, 3, 5);
			expect(this.mat.data[0]).toEqual(2);
			expect(this.mat.data[1]).toEqual(0);
			expect(this.mat.data[2]).toEqual(0);
			expect(this.mat.data[3]).toEqual(0);
			expect(this.mat.data[4]).toEqual(0);
			expect(this.mat.data[5]).toEqual(3);
			expect(this.mat.data[6]).toEqual(0);
			expect(this.mat.data[7]).toEqual(0);
			expect(this.mat.data[8]).toEqual(0);
			expect(this.mat.data[9]).toEqual(0);
			expect(this.mat.data[10]).toEqual(5);
			expect(this.mat.data[11]).toEqual(0);
			expect(this.mat.data[12]).toEqual(0);
			expect(this.mat.data[13]).toEqual(0);
			expect(this.mat.data[14]).toEqual(0);
			expect(this.mat.data[15]).toEqual(1);
		});

		it("should scale matrix and store it in itself", function() {
			this.mat.scale(2, 3, 5);
			expect(this.mat.data[0]).toEqual(2);
			expect(this.mat.data[1]).toEqual(0);
			expect(this.mat.data[2]).toEqual(0);
			expect(this.mat.data[3]).toEqual(0);
			expect(this.mat.data[4]).toEqual(0);
			expect(this.mat.data[5]).toEqual(3);
			expect(this.mat.data[6]).toEqual(0);
			expect(this.mat.data[7]).toEqual(0);
			expect(this.mat.data[8]).toEqual(0);
			expect(this.mat.data[9]).toEqual(0);
			expect(this.mat.data[10]).toEqual(5);
			expect(this.mat.data[11]).toEqual(0);
			expect(this.mat.data[12]).toEqual(0);
			expect(this.mat.data[13]).toEqual(0);
			expect(this.mat.data[14]).toEqual(0);
			expect(this.mat.data[15]).toEqual(1);
		});

		it("should scale matrix and store it in destination matrix", function() {
			var mat2 = new Matrix4D();
			mat2.scale(2, 3, 5, this.mat);
			expect(this.mat.data[0]).toEqual(2);
			expect(this.mat.data[1]).toEqual(0);
			expect(this.mat.data[2]).toEqual(0);
			expect(this.mat.data[3]).toEqual(0);
			expect(this.mat.data[4]).toEqual(0);
			expect(this.mat.data[5]).toEqual(3);
			expect(this.mat.data[6]).toEqual(0);
			expect(this.mat.data[7]).toEqual(0);
			expect(this.mat.data[8]).toEqual(0);
			expect(this.mat.data[9]).toEqual(0);
			expect(this.mat.data[10]).toEqual(5);
			expect(this.mat.data[11]).toEqual(0);
			expect(this.mat.data[12]).toEqual(0);
			expect(this.mat.data[13]).toEqual(0);
			expect(this.mat.data[14]).toEqual(0);
			expect(this.mat.data[15]).toEqual(1);
		});

		it("should make a rotation matrix", function() {
			this.mat.makeRotation(Vector3D.Z_AXIS, Math.PI / 6);
			expect(Math.round(this.mat.data[0])).toEqual(Math.round(Math.sqrt(3)/2));
			expect(this.mat.data[1]).toEqual(1/2);
			expect(this.mat.data[2]).toEqual(0);
			expect(this.mat.data[3]).toEqual(0);

			expect(this.mat.data[4]).toEqual(-1/2);
			expect(Math.round(this.mat.data[5])).toEqual(Math.round(Math.sqrt(3)/2));
			expect(this.mat.data[6]).toEqual(0);
			expect(this.mat.data[7]).toEqual(0);

			expect(this.mat.data[8]).toEqual(0);
			expect(this.mat.data[9]).toEqual(0);
			expect(this.mat.data[10]).toEqual(1);
			expect(this.mat.data[11]).toEqual(0);

			expect(this.mat.data[12]).toEqual(0);
			expect(this.mat.data[13]).toEqual(0);
			expect(this.mat.data[14]).toEqual(0);
			expect(this.mat.data[15]).toEqual(1);

			this.mat.makeRotation(Vector3D.LEFT, Math.PI / 6);
			expect(this.mat.data[0]).toEqual(1);
			expect(this.mat.data[1]).toEqual(0);
			expect(this.mat.data[2]).toEqual(0);
			expect(this.mat.data[3]).toEqual(0);

			expect(this.mat.data[4]).toEqual(0);
			expect(Math.round(this.mat.data[5])).toEqual(Math.round(Math.sqrt(3)/2));
			expect(this.mat.data[6]).toEqual(1/2);
			expect(this.mat.data[7]).toEqual(0);

			expect(this.mat.data[8]).toEqual(0);
			expect(this.mat.data[9]).toEqual(-1/2);
			expect(Math.round(this.mat.data[10])).toEqual(Math.round(Math.sqrt(3)/2));
			expect(this.mat.data[11]).toEqual(0);

			expect(this.mat.data[12]).toEqual(0);
			expect(this.mat.data[13]).toEqual(0);
			expect(this.mat.data[14]).toEqual(0);
			expect(this.mat.data[15]).toEqual(1);

			this.mat.makeRotation(Vector3D.UP, Math.PI / 6);
			expect(Math.round(this.mat.data[0])).toEqual(Math.round(Math.sqrt(3)/2));
			expect(this.mat.data[1]).toEqual(0);
			expect(this.mat.data[2]).toEqual(-1/2);
			expect(this.mat.data[3]).toEqual(0);

			expect(this.mat.data[4]).toEqual(0);
			expect(this.mat.data[5]).toEqual(1);
			expect(this.mat.data[6]).toEqual(0);
			expect(this.mat.data[7]).toEqual(0);

			expect(this.mat.data[8]).toEqual(1/2);
			expect(this.mat.data[9]).toEqual(0);
			expect(Math.round(this.mat.data[10])).toEqual(Math.round(Math.sqrt(3)/2));
			expect(this.mat.data[11]).toEqual(0);

			expect(this.mat.data[12]).toEqual(0);
			expect(this.mat.data[13]).toEqual(0);
			expect(this.mat.data[14]).toEqual(0);
			expect(this.mat.data[15]).toEqual(1);
		});

		it("should transpose the matrix", function() {
			for (var i = 0; i <= 15; i++) {
				this.mat.data[i] = i;
			}

			this.mat.transpose();
			expect(this.mat.data[0]).toEqual(0);
			expect(this.mat.data[1]).toEqual(4);
			expect(this.mat.data[2]).toEqual(8);
			expect(this.mat.data[3]).toEqual(12);

			expect(this.mat.data[4]).toEqual(1);
			expect(this.mat.data[5]).toEqual(5);
			expect(this.mat.data[6]).toEqual(9);
			expect(this.mat.data[7]).toEqual(13);

			expect(this.mat.data[8]).toEqual(2);
			expect(this.mat.data[9]).toEqual(6);
			expect(this.mat.data[10]).toEqual(10);
			expect(this.mat.data[11]).toEqual(14);

			expect(this.mat.data[12]).toEqual(3);
			expect(this.mat.data[13]).toEqual(7);
			expect(this.mat.data[14]).toEqual(11);
			expect(this.mat.data[15]).toEqual(15);
		});

		it("should make this matrix a frustum matrix", function() {
			var bottom, far, left, near, right, top;
			left = -50;
			right = 50;
			top = 50;
			bottom = -50;
			near = 1;
			far = 100;
			this.mat.makeFrustum(left, right, bottom, top, near, far);
			//There is a tiny difference in the calculations, that's why some values are rounded, ideally they should not be rounded
			expect(Math.round(this.mat.data[0])).toEqual(Math.round(2 * near / (right - left)));
			expect(this.mat.data[1]).toEqual(0);
			expect(this.mat.data[2]).toEqual(0);
			expect(this.mat.data[3]).toEqual(0);
			expect(this.mat.data[4]).toEqual(0);
			expect(Math.round(this.mat.data[5])).toEqual(Math.round(2 * near / (top - bottom)));
			expect(this.mat.data[6]).toEqual(0);
			expect(this.mat.data[7]).toEqual(0);
			expect(this.mat.data[8]).toEqual((right + left) / (right - left));
			expect(this.mat.data[9]).toEqual((top + bottom) / (top - bottom));
			expect(Math.round(this.mat.data[10])).toEqual(Math.round(-(far + near) / (far - near)));
			expect(this.mat.data[11]).toEqual(-1);
			expect(this.mat.data[12]).toEqual(0);
			expect(this.mat.data[13]).toEqual(0);
			expect(Math.round(this.mat.data[14])).toEqual(Math.round(-2 * far * near / (far - near)));
			expect(this.mat.data[15]).toEqual(0);
		});


		it("should make this matrix a perspective projection matrix", function() {
			var bottom, far, left, near, right, top;
			left = -50;
			right = 50;
			top = 50;
			bottom = -50;
			near = 1;
			far = 100;
			var aspect_ratio = 3/4;
			var field_of_view = 30;
			var size = near * Math.tan((field_of_view / (180 * Math.PI)) / 2);
			var mat = new Matrix4D();

			mat.makeFrustum(-size, size, -size / aspect_ratio, size / aspect_ratio, near, far);
			this.mat.makePerspective(field_of_view, near, far, aspect_ratio);
			
			expect(this.mat.data[0]).toEqual(mat.data[0]);
			expect(this.mat.data[1]).toEqual(0);
			expect(this.mat.data[2]).toEqual(0);
			expect(this.mat.data[3]).toEqual(0);
			expect(this.mat.data[4]).toEqual(0);
			expect(this.mat.data[5]).toEqual(mat.data[5]);
			expect(this.mat.data[6]).toEqual(0);
			expect(this.mat.data[7]).toEqual(0);
			expect(this.mat.data[8]).toEqual(mat.data[8]);
			expect(this.mat.data[9]).toEqual(mat.data[9]);
			expect(this.mat.data[10]).toEqual(mat.data[10]);
			expect(this.mat.data[11]).toEqual(mat.data[11]);
			expect(this.mat.data[12]).toEqual(0);
			expect(this.mat.data[13]).toEqual(0);
			expect(this.mat.data[14]).toEqual(mat.data[14]);
			expect(this.mat.data[15]).toEqual(0);
		});

		it("should make this matrix a orthographic projection matrix", function() {
			this.mat.makeOrthographic(-2, 2, -2, 2, 0.1, 10);
			expect(this.mat.data[0]).toEqual(2/4);
			expect(this.mat.data[1]).toEqual(0);
			expect(this.mat.data[2]).toEqual(0);
			expect(this.mat.data[3]).toEqual(0);

			expect(this.mat.data[4]).toEqual(0);
			expect(this.mat.data[5]).toEqual(2/4);
			expect(this.mat.data[6]).toEqual(0);
			expect(this.mat.data[7]).toEqual(0);

			expect(this.mat.data[8]).toEqual(0);
			expect(this.mat.data[9]).toEqual(0);
			expect(Math.round(this.mat.data[10])).toEqual(Math.round(-2/9.9));
			expect(this.mat.data[11]).toEqual(0);

			expect(this.mat.data[12]).toEqual(0);
			expect(this.mat.data[13]).toEqual(0);
			expect(Math.round(this.mat.data[14])).toEqual(Math.round(-10.1/9.9));
			expect(this.mat.data[15]).toEqual(1);
		});

		it("should create a rotation matrix from a quaternion", function() {
			var q = new Quaternion(1, 1, 2, 3);
			this.mat.makeFromQuaternion(q);
			expect(this.mat.data[0]).toEqual(-25);
			expect(this.mat.data[1]).toEqual(-2);
			expect(this.mat.data[2]).toEqual(10);
			expect(this.mat.data[3]).toEqual(0);
			expect(this.mat.data[4]).toEqual(10);
			expect(this.mat.data[5]).toEqual(-19);
			expect(this.mat.data[6]).toEqual(10);
			expect(this.mat.data[7]).toEqual(0);
			expect(this.mat.data[8]).toEqual(2);
			expect(this.mat.data[9]).toEqual(14);
			expect(this.mat.data[10]).toEqual(-9);
			expect(this.mat.data[11]).toEqual(0);
			expect(this.mat.data[12]).toEqual(0);
			expect(this.mat.data[13]).toEqual(0);
			expect(this.mat.data[14]).toEqual(0);
			expect(this.mat.data[15]).toEqual(1);
		});

		it('should add two matrixes and store it on the first one', function() {
			for (var i = 0; i <= 15; i++) {
				this.mat.data[i] = i;
			}
			var mat2 = new Matrix4D();
			this.mat.add(mat2);
			expect(this.mat.data[0]).toEqual(1);
			expect(this.mat.data[1]).toEqual(1);
			expect(this.mat.data[2]).toEqual(2);
			expect(this.mat.data[3]).toEqual(3);
			expect(this.mat.data[4]).toEqual(4);
			expect(this.mat.data[5]).toEqual(6);
			expect(this.mat.data[6]).toEqual(6);
			expect(this.mat.data[7]).toEqual(7);
			expect(this.mat.data[8]).toEqual(8);
			expect(this.mat.data[9]).toEqual(9);
			expect(this.mat.data[10]).toEqual(11);
			expect(this.mat.data[11]).toEqual(11);
			expect(this.mat.data[12]).toEqual(12);
			expect(this.mat.data[13]).toEqual(13);
			expect(this.mat.data[14]).toEqual(14);
			expect(this.mat.data[15]).toEqual(16);
			expect(mat2.data[0]).toEqual(1);
			expect(mat2.data[1]).toEqual(0);
			expect(mat2.data[2]).toEqual(0);
			expect(mat2.data[3]).toEqual(0);
			expect(mat2.data[4]).toEqual(0);
			expect(mat2.data[5]).toEqual(1);
			expect(mat2.data[6]).toEqual(0);
			expect(mat2.data[7]).toEqual(0);
			expect(mat2.data[8]).toEqual(0);
			expect(mat2.data[9]).toEqual(0);
			expect(mat2.data[10]).toEqual(1);
			expect(mat2.data[11]).toEqual(0);
			expect(mat2.data[12]).toEqual(0);
			expect(mat2.data[13]).toEqual(0);
			expect(mat2.data[14]).toEqual(0);
			expect(mat2.data[15]).toEqual(1);
		});

		it('should add two matrixes and store it in a third one', function() {
			for (var i = 0; i <= 15; i++) {
				this.mat.data[i] = i;
			}
			var mat2 = new Matrix4D();
			var mat3 = new Matrix4D();
			this.mat.add(mat2, mat3);
			expect(this.mat.data[0]).toEqual(0);
			expect(this.mat.data[1]).toEqual(1);
			expect(this.mat.data[2]).toEqual(2);
			expect(this.mat.data[3]).toEqual(3);
			expect(this.mat.data[4]).toEqual(4);
			expect(this.mat.data[5]).toEqual(5);
			expect(this.mat.data[6]).toEqual(6);
			expect(this.mat.data[7]).toEqual(7);
			expect(this.mat.data[8]).toEqual(8);
			expect(this.mat.data[9]).toEqual(9);
			expect(this.mat.data[10]).toEqual(10);
			expect(this.mat.data[11]).toEqual(11);
			expect(this.mat.data[12]).toEqual(12);
			expect(this.mat.data[13]).toEqual(13);
			expect(this.mat.data[14]).toEqual(14);
			expect(this.mat.data[15]).toEqual(15);
			expect(mat2.data[0]).toEqual(1);
			expect(mat2.data[1]).toEqual(0);
			expect(mat2.data[2]).toEqual(0);
			expect(mat2.data[3]).toEqual(0);
			expect(mat2.data[4]).toEqual(0);
			expect(mat2.data[5]).toEqual(1);
			expect(mat2.data[6]).toEqual(0);
			expect(mat2.data[7]).toEqual(0);
			expect(mat2.data[8]).toEqual(0);
			expect(mat2.data[9]).toEqual(0);
			expect(mat2.data[10]).toEqual(1);
			expect(mat2.data[11]).toEqual(0);
			expect(mat2.data[12]).toEqual(0);
			expect(mat2.data[13]).toEqual(0);
			expect(mat2.data[14]).toEqual(0);
			expect(mat2.data[15]).toEqual(1);
			expect(mat3.data[0]).toEqual(1);
			expect(mat3.data[1]).toEqual(1);
			expect(mat3.data[2]).toEqual(2);
			expect(mat3.data[3]).toEqual(3);
			expect(mat3.data[4]).toEqual(4);
			expect(mat3.data[5]).toEqual(6);
			expect(mat3.data[6]).toEqual(6);
			expect(mat3.data[7]).toEqual(7);
			expect(mat3.data[8]).toEqual(8);
			expect(mat3.data[9]).toEqual(9);
			expect(mat3.data[10]).toEqual(11);
			expect(mat3.data[11]).toEqual(11);
			expect(mat3.data[12]).toEqual(12);
			expect(mat3.data[13]).toEqual(13);
			expect(mat3.data[14]).toEqual(14);
			expect(mat3.data[15]).toEqual(16);
		});

		it("should multiply two matrices and store it in the first one", function() {
			var mat2 = new Matrix4D();
			this.mat.data[1] = 2;
			this.mat.data[4] = 4;
			this.mat.data[7] = 3;
			this.mat.data[13] = 2;
			this.mat.data[15] = 5;
			mat2.data[0] = 4;
			mat2.data[2] = 2;
			mat2.data[9] = 4;
			mat2.data[11] = 2;
			mat2.data[15] = 3;
			this.mat.multiply(mat2);
			expect(mat2.data[0]).toEqual(4);
			expect(mat2.data[1]).toEqual(0);
			expect(mat2.data[2]).toEqual(2);
			expect(mat2.data[3]).toEqual(0);
			expect(mat2.data[4]).toEqual(0);
			expect(mat2.data[5]).toEqual(1);
			expect(mat2.data[6]).toEqual(0);
			expect(mat2.data[7]).toEqual(0);
			expect(mat2.data[8]).toEqual(0);
			expect(mat2.data[9]).toEqual(4);
			expect(mat2.data[10]).toEqual(1);
			expect(mat2.data[11]).toEqual(2);
			expect(mat2.data[12]).toEqual(0);
			expect(mat2.data[13]).toEqual(0);
			expect(mat2.data[14]).toEqual(0);
			expect(mat2.data[15]).toEqual(3);
			expect(this.mat.data[0]).toEqual(4);
			expect(this.mat.data[1]).toEqual(8);
			expect(this.mat.data[2]).toEqual(2);
			expect(this.mat.data[3]).toEqual(0);
			expect(this.mat.data[4]).toEqual(4);
			expect(this.mat.data[5]).toEqual(1);
			expect(this.mat.data[6]).toEqual(0);
			expect(this.mat.data[7]).toEqual(3);
			expect(this.mat.data[8]).toEqual(16);
			expect(this.mat.data[9]).toEqual(8);
			expect(this.mat.data[10]).toEqual(1);
			expect(this.mat.data[11]).toEqual(22);
			expect(this.mat.data[12]).toEqual(0);
			expect(this.mat.data[13]).toEqual(6);
			expect(this.mat.data[14]).toEqual(0);
			expect(this.mat.data[15]).toEqual(15);
		});

		it("should multiply two matrices and store it in the destination", function() {
			var mat2 = new Matrix4D();
			var mat3 = new Matrix4D();
			this.mat.data[1] = 2;
			this.mat.data[4] = 4;
			this.mat.data[7] = 3;
			this.mat.data[13] = 2;
			this.mat.data[15] = 5;
			mat2.data[0] = 4;
			mat2.data[2] = 2;
			mat2.data[9] = 4;
			mat2.data[11] = 2;
			mat2.data[15] = 3;
			this.mat.multiply(mat2, mat3);
			expect(mat2.data[0]).toEqual(4);
			expect(mat2.data[1]).toEqual(0);
			expect(mat2.data[2]).toEqual(2);
			expect(mat2.data[3]).toEqual(0);
			expect(mat2.data[4]).toEqual(0);
			expect(mat2.data[5]).toEqual(1);
			expect(mat2.data[6]).toEqual(0);
			expect(mat2.data[7]).toEqual(0);
			expect(mat2.data[8]).toEqual(0);
			expect(mat2.data[9]).toEqual(4);
			expect(mat2.data[10]).toEqual(1);
			expect(mat2.data[11]).toEqual(2);
			expect(mat2.data[12]).toEqual(0);
			expect(mat2.data[13]).toEqual(0);
			expect(mat2.data[14]).toEqual(0);
			expect(mat2.data[15]).toEqual(3);
			expect(mat3.data[0]).toEqual(4);
			expect(mat3.data[1]).toEqual(8);
			expect(mat3.data[2]).toEqual(2);
			expect(mat3.data[3]).toEqual(0);
			expect(mat3.data[4]).toEqual(4);
			expect(mat3.data[5]).toEqual(1);
			expect(mat3.data[6]).toEqual(0);
			expect(mat3.data[7]).toEqual(3);
			expect(mat3.data[8]).toEqual(16);
			expect(mat3.data[9]).toEqual(8);
			expect(mat3.data[10]).toEqual(1);
			expect(mat3.data[11]).toEqual(22);
			expect(mat3.data[12]).toEqual(0);
			expect(mat3.data[13]).toEqual(6);
			expect(mat3.data[14]).toEqual(0);
			expect(mat3.data[15]).toEqual(15);
			expect(this.mat.data[0]).toEqual(1);
			expect(this.mat.data[1]).toEqual(2);
			expect(this.mat.data[2]).toEqual(0);
			expect(this.mat.data[3]).toEqual(0);
			expect(this.mat.data[4]).toEqual(4);
			expect(this.mat.data[5]).toEqual(1);
			expect(this.mat.data[6]).toEqual(0);
			expect(this.mat.data[7]).toEqual(3);
			expect(this.mat.data[8]).toEqual(0);
			expect(this.mat.data[9]).toEqual(0);
			expect(this.mat.data[10]).toEqual(1);
			expect(this.mat.data[11]).toEqual(0);
			expect(this.mat.data[12]).toEqual(0);
			expect(this.mat.data[13]).toEqual(2);
			expect(this.mat.data[14]).toEqual(0);
			expect(this.mat.data[15]).toEqual(5);
		});

		it("should create a matrix from position and orientation", function() {
			var p = new Vector3D(1, 2, 3), q = new Quaternion(1, 1, 2, 3);
			this.mat.makeFromPositionAndOrientation(p, q);
			expect(this.mat.data[0]).toEqual(-25);
			expect(this.mat.data[1]).toEqual(-2);
			expect(this.mat.data[2]).toEqual(10);
			expect(this.mat.data[3]).toEqual(0);
			expect(this.mat.data[4]).toEqual(10);
			expect(this.mat.data[5]).toEqual(-19);
			expect(this.mat.data[6]).toEqual(10);
			expect(this.mat.data[7]).toEqual(0);
			expect(this.mat.data[8]).toEqual(2);
			expect(this.mat.data[9]).toEqual(14);
			expect(this.mat.data[10]).toEqual(-9);
			expect(this.mat.data[11]).toEqual(0);
			expect(this.mat.data[12]).toEqual(1);
			expect(this.mat.data[13]).toEqual(2);
			expect(this.mat.data[14]).toEqual(3);
			expect(this.mat.data[15]).toEqual(1);
		});

		it("should return the column vectors given an index", function() {
			this.mat.translate(1, 2, 3);
			var v = this.mat.axisVector(3);
			expect(v.x).toBe(1);
			expect(v.y).toBe(2);
			expect(v.z).toBe(3);
			this.mat.axisVector(0, v);
			expect(v.x).toBe(1);
			expect(v.y).toBe(0);
			expect(v.z).toBe(0);
			this.mat.axisVector(1, v);
			expect(v.x).toBe(0);
			expect(v.y).toBe(1);
			expect(v.z).toBe(0);
			this.mat.axisVector(2, v);
			expect(v.x).toBe(0);
			expect(v.y).toBe(0);
			expect(v.z).toBe(1);
		});

		it("should transform a vector by a matrix", function() {
			for (i = 0; i <= 15; i++) {
				this.mat.data[i] = i;
			}
			var v = new Vector3D(1, 2, 3);
			this.mat.transformVector(v);
			expect(v.x).toEqual(44);
			expect(v.y).toEqual(51);
			expect(v.z).toEqual(58);
			expect(this.mat.data[0]).toEqual(0);
			expect(this.mat.data[1]).toEqual(1);
			expect(this.mat.data[2]).toEqual(2);
			expect(this.mat.data[3]).toEqual(3);
			expect(this.mat.data[4]).toEqual(4);
			expect(this.mat.data[5]).toEqual(5);
			expect(this.mat.data[6]).toEqual(6);
			expect(this.mat.data[7]).toEqual(7);
			expect(this.mat.data[8]).toEqual(8);
		});

		it("should transform a vector by the inverse of this matrix", function() {
			for (i = 0; i <= 15; i++) {
				this.mat.data[i] = i;
			}
			var v = new Vector3D(1, 2, 3);
			this.mat.transformInverseVector(v);
			expect(v.x).toEqual(-33);
			expect(v.y).toEqual(-165);
			expect(v.z).toEqual(-297);
			expect(this.mat.data[0]).toEqual(0);
			expect(this.mat.data[1]).toEqual(1);
			expect(this.mat.data[2]).toEqual(2);
			expect(this.mat.data[3]).toEqual(3);
			expect(this.mat.data[4]).toEqual(4);
			expect(this.mat.data[5]).toEqual(5);
			expect(this.mat.data[6]).toEqual(6);
			expect(this.mat.data[7]).toEqual(7);
			expect(this.mat.data[8]).toEqual(8);
		});
	});
});