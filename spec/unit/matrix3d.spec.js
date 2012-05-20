var Matrix3D = require("../../src/matrix3d"), Vector3D = require("../../src/vector3d");

describe('Matrix3D', function() {
	beforeEach(function() {
		return this.mat = new Matrix3D();
	});

	it('should create a copy of the matrix', function() {
		var i, mat2;
		for (i = 0; i <= 8; i++) {
			this.mat.data[i] = i;
		}

		mat2 = this.mat.clone();
		for (i = 0; i <= 8; i++) {
			expect(mat2.data[i]).toEqual(this.mat.data[i]);
		}

		for (i = 8; i >= 0; i--) {
			this.mat.data[i] = i;
		}

		this.mat.clone(mat2);
		for (i = 8; i >= 0; i--) {
			expect(mat2.data[i]).toEqual(this.mat.data[i]);
		}
	});

	it('should be identity when new', function() {
		expect(this.mat.data[0]).toEqual(1);
		expect(this.mat.data[1]).toEqual(0);
		expect(this.mat.data[2]).toEqual(0);
		expect(this.mat.data[3]).toEqual(0);
		expect(this.mat.data[4]).toEqual(1);
		expect(this.mat.data[5]).toEqual(0);
		expect(this.mat.data[6]).toEqual(0);
		expect(this.mat.data[7]).toEqual(0);
		expect(this.mat.data[8]).toEqual(1);
	});

	it("should set a matrix's data to the given data", function() {
		this.mat.set([0, 1, 2, 3, 4, 5, 6, 7, 8]);
		for(var i = 8; i >= 0; i--) {
			expect(this.mat.data[i]).toEqual(i);
		}
	});

	it("should set the diagonal of the matrix to -1 2 3", function() {
		this.mat.setDiagonal(-1, 2, 3);
		expect(this.mat.data[0]).toEqual(-1);
		expect(this.mat.data[1]).toEqual(0);
		expect(this.mat.data[2]).toEqual(0);
		expect(this.mat.data[3]).toEqual(0);
		expect(this.mat.data[4]).toEqual(2);
		expect(this.mat.data[5]).toEqual(0);
		expect(this.mat.data[6]).toEqual(0);
		expect(this.mat.data[7]).toEqual(0);
		expect(this.mat.data[8]).toEqual(3);
	});

	it("should create a matrix from 3 vectors", function() {
		this.mat.makeFromVectors(new Vector3D(0, 1, 2), new Vector3D(3, 4, 5), new Vector3D(6, 7, 8));
		
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

	it("should make a skew symmetric matrix from a vector", function() {
		this.mat.makeSkewSymmetric(new Vector3D(1, 2, 3));
		
		expect(this.mat.data[0]).toEqual(0);
		expect(this.mat.data[1]).toEqual(3);
		expect(this.mat.data[2]).toEqual(-2);
		expect(this.mat.data[3]).toEqual(-3);
		expect(this.mat.data[4]).toEqual(0);
		expect(this.mat.data[5]).toEqual(1);
		expect(this.mat.data[6]).toEqual(2);
		expect(this.mat.data[7]).toEqual(-1);
		expect(this.mat.data[8]).toEqual(0);
	});

	it("should transpose the matrix and store it in itself", function() {
		this.mat.data[0] = 1;
		this.mat.data[1] = 2;
		this.mat.data[2] = 3;
		this.mat.data[3] = 3;
		this.mat.data[4] = 4;
		this.mat.data[5] = 5;
		this.mat.data[6] = 5;
		this.mat.data[7] = 6;
		this.mat.data[8] = 7;
		this.mat.transpose();
		expect(this.mat.data[0]).toEqual(1);
		expect(this.mat.data[1]).toEqual(3);
		expect(this.mat.data[2]).toEqual(5);
		expect(this.mat.data[3]).toEqual(2);
		expect(this.mat.data[4]).toEqual(4);
		expect(this.mat.data[5]).toEqual(6);
		expect(this.mat.data[6]).toEqual(3);
		expect(this.mat.data[7]).toEqual(5);
		expect(this.mat.data[8]).toEqual(7);
	});

	it("should transpose the matrix and store it in the destination matrix", function() {
		var dest = new Matrix3D();
		this.mat.data[0] = 1;
		this.mat.data[1] = 2;
		this.mat.data[2] = 3;
		this.mat.data[3] = 3;
		this.mat.data[4] = 4;
		this.mat.data[5] = 5;
		this.mat.data[6] = 5;
		this.mat.data[7] = 6;
		this.mat.data[8] = 7;
		this.mat.transpose(dest);

		expect(dest.data[0]).toEqual(1);
		expect(dest.data[1]).toEqual(3);
		expect(dest.data[2]).toEqual(5);
		expect(dest.data[3]).toEqual(2);
		expect(dest.data[4]).toEqual(4);
		expect(dest.data[5]).toEqual(6);
		expect(dest.data[6]).toEqual(3);
		expect(dest.data[7]).toEqual(5);
		expect(dest.data[8]).toEqual(7);

		expect(this.mat.data[0]).toEqual(1);
		expect(this.mat.data[1]).toEqual(2);
		expect(this.mat.data[2]).toEqual(3);
		expect(this.mat.data[3]).toEqual(3);
		expect(this.mat.data[4]).toEqual(4);
		expect(this.mat.data[5]).toEqual(5);
		expect(this.mat.data[6]).toEqual(5);
		expect(this.mat.data[7]).toEqual(6);
		expect(this.mat.data[8]).toEqual(7);
	});

	it('should inverse the matrix and store it in itself', function() {
		this.mat.data[0] = 1;
		this.mat.data[1] = 2;
		this.mat.data[2] = 3;
		this.mat.data[3] = 3;
		this.mat.data[4] = 4;
		this.mat.data[5] = 5;
		this.mat.data[6] = 5;
		this.mat.data[7] = 6;
		this.mat.data[8] = 7;
		this.mat.inverse();
		expect(this.mat.data[0]).toEqual(1);
		expect(this.mat.data[1]).toEqual(2);
		expect(this.mat.data[2]).toEqual(3);
		expect(this.mat.data[3]).toEqual(3);
		expect(this.mat.data[4]).toEqual(4);
		expect(this.mat.data[5]).toEqual(5);
		expect(this.mat.data[6]).toEqual(5);
		expect(this.mat.data[7]).toEqual(6);
		expect(this.mat.data[8]).toEqual(7);
		this.mat.data[6] = 6;
		this.mat.inverse();
		expect(this.mat.data[0]).toEqual(1);
		expect(this.mat.data[1]).toEqual(-2);
		expect(this.mat.data[2]).toEqual(1);
		expect(this.mat.data[3]).toEqual(-4.5);
		expect(this.mat.data[4]).toEqual(5.5);
		expect(this.mat.data[5]).toEqual(-2);
		expect(this.mat.data[6]).toEqual(3);
		expect(this.mat.data[7]).toEqual(-3);
		expect(this.mat.data[8]).toEqual(1);
	});

	it('should inverse the matrix and store it in the destination', function() {
		this.mat.data[0] = 1;
		this.mat.data[1] = 2;
		this.mat.data[2] = 3;
		this.mat.data[3] = 3;
		this.mat.data[4] = 4;
		this.mat.data[5] = 5;
		this.mat.data[6] = 5;
		this.mat.data[7] = 6;
		this.mat.data[8] = 7;
		var dest = new Matrix3D();
		this.mat.inverse(dest);
		expect(this.mat.data[0]).toEqual(1);
		expect(this.mat.data[1]).toEqual(2);
		expect(this.mat.data[2]).toEqual(3);
		expect(this.mat.data[3]).toEqual(3);
		expect(this.mat.data[4]).toEqual(4);
		expect(this.mat.data[5]).toEqual(5);
		expect(this.mat.data[6]).toEqual(5);
		expect(this.mat.data[7]).toEqual(6);
		expect(this.mat.data[8]).toEqual(7);
		expect(dest.data[0]).toEqual(1);
		expect(dest.data[1]).toEqual(2);
		expect(dest.data[2]).toEqual(3);
		expect(dest.data[3]).toEqual(3);
		expect(dest.data[4]).toEqual(4);
		expect(dest.data[5]).toEqual(5);
		expect(dest.data[6]).toEqual(5);
		expect(dest.data[7]).toEqual(6);
		expect(dest.data[8]).toEqual(7);
		this.mat.data[6] = 6;
		this.mat.inverse(dest);
		expect(dest.data[0]).toEqual(1);
		expect(dest.data[1]).toEqual(-2);
		expect(dest.data[2]).toEqual(1);
		expect(dest.data[3]).toEqual(-4.5);
		expect(dest.data[4]).toEqual(5.5);
		expect(dest.data[5]).toEqual(-2);
		expect(dest.data[6]).toEqual(3);
		expect(dest.data[7]).toEqual(-3);
		expect(dest.data[8]).toEqual(1);
		expect(this.mat.data[0]).toEqual(1);
		expect(this.mat.data[1]).toEqual(2);
		expect(this.mat.data[2]).toEqual(3);
		expect(this.mat.data[3]).toEqual(3);
		expect(this.mat.data[4]).toEqual(4);
		expect(this.mat.data[5]).toEqual(5);
		expect(this.mat.data[6]).toEqual(6);
		expect(this.mat.data[7]).toEqual(6);
		expect(this.mat.data[8]).toEqual(7);
	});

	it('should add two matrixes and store it on the first one', function() {
		var mat2 = new Matrix3D();
		for (i = 0; i <= 8; i++) {
			this.mat.data[i] = i;
		}

		this.mat.add(mat2);
		expect(this.mat.data[0]).toEqual(1);
		expect(this.mat.data[1]).toEqual(1);
		expect(this.mat.data[2]).toEqual(2);
		expect(this.mat.data[3]).toEqual(3);
		expect(this.mat.data[4]).toEqual(5);
		expect(this.mat.data[5]).toEqual(5);
		expect(this.mat.data[6]).toEqual(6);
		expect(this.mat.data[7]).toEqual(7);
		expect(this.mat.data[8]).toEqual(9);
		expect(mat2.data[0]).toEqual(1);
		expect(mat2.data[1]).toEqual(0);
		expect(mat2.data[2]).toEqual(0);
		expect(mat2.data[3]).toEqual(0);
		expect(mat2.data[4]).toEqual(1);
		expect(mat2.data[5]).toEqual(0);
		expect(mat2.data[6]).toEqual(0);
		expect(mat2.data[7]).toEqual(0);
		expect(mat2.data[8]).toEqual(1);
	});

	it('should add two matrixes and store it in a third one', function() {
		var mat2 = new Matrix3D();
		for (i = 0; i <= 8; i++) {
			mat2.data[i] = i;
		}

		var mat3 = new Matrix3D();
		this.mat.add(mat2, mat3);
		expect(this.mat.data[0]).toEqual(1);
		expect(this.mat.data[1]).toEqual(0);
		expect(this.mat.data[2]).toEqual(0);
		expect(this.mat.data[3]).toEqual(0);
		expect(this.mat.data[4]).toEqual(1);
		expect(this.mat.data[5]).toEqual(0);
		expect(this.mat.data[6]).toEqual(0);
		expect(this.mat.data[7]).toEqual(0);
		expect(this.mat.data[8]).toEqual(1);
		expect(mat2.data[0]).toEqual(0);
		expect(mat2.data[1]).toEqual(1);
		expect(mat2.data[2]).toEqual(2);
		expect(mat2.data[3]).toEqual(3);
		expect(mat2.data[4]).toEqual(4);
		expect(mat2.data[5]).toEqual(5);
		expect(mat2.data[6]).toEqual(6);
		expect(mat2.data[7]).toEqual(7);
		expect(mat2.data[8]).toEqual(8);
		expect(mat3.data[0]).toEqual(1);
		expect(mat3.data[1]).toEqual(1);
		expect(mat3.data[2]).toEqual(2);
		expect(mat3.data[3]).toEqual(3);
		expect(mat3.data[4]).toEqual(5);
		expect(mat3.data[5]).toEqual(5);
		expect(mat3.data[6]).toEqual(6);
		expect(mat3.data[7]).toEqual(7);
		expect(mat3.data[8]).toEqual(9);
	});

	it("should multiply two matrices and store it in the first one", function() {
		var mat2;
		mat2 = new Matrix3D();
		this.mat.data[0] = 1;
		this.mat.data[1] = 2;
		this.mat.data[2] = 3;
		this.mat.data[3] = 3;
		this.mat.data[4] = 4;
		this.mat.data[5] = 5;
		this.mat.data[6] = 5;
		this.mat.data[7] = 6;
		this.mat.data[8] = 7;
		mat2.data[0] = 7;
		mat2.data[1] = 6;
		mat2.data[2] = 5;
		mat2.data[3] = 5;
		mat2.data[4] = 4;
		mat2.data[5] = 3;
		mat2.data[6] = 3;
		mat2.data[7] = 2;
		mat2.data[8] = 1;
		this.mat.multiply(mat2);
		expect(mat2.data[0]).toEqual(7);
		expect(mat2.data[1]).toEqual(6);
		expect(mat2.data[2]).toEqual(5);
		expect(mat2.data[3]).toEqual(5);
		expect(mat2.data[4]).toEqual(4);
		expect(mat2.data[5]).toEqual(3);
		expect(mat2.data[6]).toEqual(3);
		expect(mat2.data[7]).toEqual(2);
		expect(mat2.data[8]).toEqual(1);
		expect(this.mat.data[0]).toEqual(50);
		expect(this.mat.data[1]).toEqual(68);
		expect(this.mat.data[2]).toEqual(86);
		expect(this.mat.data[3]).toEqual(32);
		expect(this.mat.data[4]).toEqual(44);
		expect(this.mat.data[5]).toEqual(56);
		expect(this.mat.data[6]).toEqual(14);
		expect(this.mat.data[7]).toEqual(20);
		expect(this.mat.data[8]).toEqual(26);
	});

	it("should multiply two matrices and store it in the destination", function() {
		var dest, mat2;
		mat2 = new Matrix3D();
		dest = new Matrix3D();
		this.mat.data[0] = 1;
		this.mat.data[1] = 2;
		this.mat.data[2] = 3;
		this.mat.data[3] = 3;
		this.mat.data[4] = 4;
		this.mat.data[5] = 5;
		this.mat.data[6] = 5;
		this.mat.data[7] = 6;
		this.mat.data[8] = 7;
		mat2.data[0] = 7;
		mat2.data[1] = 6;
		mat2.data[2] = 5;
		mat2.data[3] = 5;
		mat2.data[4] = 4;
		mat2.data[5] = 3;
		mat2.data[6] = 3;
		mat2.data[7] = 2;
		mat2.data[8] = 1;
		this.mat.multiply(mat2, dest);
		expect(this.mat.data[0]).toEqual(1);
		expect(this.mat.data[1]).toEqual(2);
		expect(this.mat.data[2]).toEqual(3);
		expect(this.mat.data[3]).toEqual(3);
		expect(this.mat.data[4]).toEqual(4);
		expect(this.mat.data[5]).toEqual(5);
		expect(this.mat.data[6]).toEqual(5);
		expect(this.mat.data[7]).toEqual(6);
		expect(this.mat.data[8]).toEqual(7);
		expect(mat2.data[0]).toEqual(7);
		expect(mat2.data[1]).toEqual(6);
		expect(mat2.data[2]).toEqual(5);
		expect(mat2.data[3]).toEqual(5);
		expect(mat2.data[4]).toEqual(4);
		expect(mat2.data[5]).toEqual(3);
		expect(mat2.data[6]).toEqual(3);
		expect(mat2.data[7]).toEqual(2);
		expect(mat2.data[8]).toEqual(1);
		expect(dest.data[0]).toEqual(50);
		expect(dest.data[1]).toEqual(68);
		expect(dest.data[2]).toEqual(86);
		expect(dest.data[3]).toEqual(32);
		expect(dest.data[4]).toEqual(44);
		expect(dest.data[5]).toEqual(56);
		expect(dest.data[6]).toEqual(14);
		expect(dest.data[7]).toEqual(20);
		expect(dest.data[8]).toEqual(26);
	});


	it("should scale a matrix by a given number and store it in itself", function() {
		this.mat.data[0] = 1;
		this.mat.data[1] = 2;
		this.mat.data[2] = 3;
		this.mat.data[3] = 3;
		this.mat.data[4] = 4;
		this.mat.data[5] = 5;
		this.mat.data[6] = 5;
		this.mat.data[7] = 6;
		this.mat.data[8] = 7;
		this.mat.scale(-2);
		expect(this.mat.data[0]).toEqual(-2);
		expect(this.mat.data[1]).toEqual(-4);
		expect(this.mat.data[2]).toEqual(-6);
		expect(this.mat.data[3]).toEqual(-6);
		expect(this.mat.data[4]).toEqual(-8);
		expect(this.mat.data[5]).toEqual(-10);
		expect(this.mat.data[6]).toEqual(-10);
		expect(this.mat.data[7]).toEqual(-12);
		expect(this.mat.data[8]).toEqual(-14);
	});

	it("should scale a matrix by a given number and store it in the destination matrix", function() {
		var dest = new Matrix3D();
		this.mat.data[0] = 1;
		this.mat.data[1] = 2;
		this.mat.data[2] = 3;
		this.mat.data[3] = 3;
		this.mat.data[4] = 4;
		this.mat.data[5] = 5;
		this.mat.data[6] = 5;
		this.mat.data[7] = 6;
		this.mat.data[8] = 7;
		this.mat.scale(-2, dest);
		expect(dest.data[0]).toEqual(-2);
		expect(dest.data[1]).toEqual(-4);
		expect(dest.data[2]).toEqual(-6);
		expect(dest.data[3]).toEqual(-6);
		expect(dest.data[4]).toEqual(-8);
		expect(dest.data[5]).toEqual(-10);
		expect(dest.data[6]).toEqual(-10);
		expect(dest.data[7]).toEqual(-12);
		expect(dest.data[8]).toEqual(-14);
		expect(this.mat.data[0]).toEqual(1);
		expect(this.mat.data[1]).toEqual(2);
		expect(this.mat.data[2]).toEqual(3);
		expect(this.mat.data[3]).toEqual(3);
		expect(this.mat.data[4]).toEqual(4);
		expect(this.mat.data[5]).toEqual(5);
		expect(this.mat.data[6]).toEqual(5);
		expect(this.mat.data[7]).toEqual(6);
		return expect(this.mat.data[8]).toEqual(7);
	});

	it("should transform a vector by a matrix", function() {
		for (i = 0; i <= 8; i++) {
			this.mat.data[i] = i;
		}
		var v = new Vector3D(1, 2, 3);
		this.mat.transformVector(v);
		expect(v.x).toEqual(24);
		expect(v.y).toEqual(30);
		expect(v.z).toEqual(36);
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

	it("should transform a vector by a matrix and store it in the destination", function() {
		var v2 = new Vector3D();
		for (i = 0; i <= 8; i++) {
			this.mat.data[i] = i;
		}
		var v = new Vector3D(1, 2, 3);
		this.mat.transformVector(v, v2);
		expect(v.x).toEqual(1);
		expect(v.y).toEqual(2);
		expect(v.z).toEqual(3);
		expect(v2.x).toEqual(24);
		expect(v2.y).toEqual(30);
		expect(v2.z).toEqual(36);
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

	it("should transform a vector by the transpose matrix", function() {
		for (i = 0; i <= 8; i++) {
			this.mat.data[i] = i;
		}
		var v = new Vector3D(1, 2, 3);
		this.mat.transformTransposeVector(v);
		expect(v.x).toEqual(8);
		expect(v.y).toEqual(26);
		expect(v.z).toEqual(44);
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

	it("should transform a vector by the transpose matrix and store it in itself", function() {
		var v2 = new Vector3D();
		for (i = 0; i <= 8; i++) {
			this.mat.data[i] = i;
		}
		var v = new Vector3D(1, 2, 3);
		this.mat.transformTransposeVector(v, v2);
		expect(v.x).toEqual(1);
		expect(v.y).toEqual(2);
		expect(v.z).toEqual(3);
		expect(v2.x).toEqual(8);
		expect(v2.y).toEqual(26);
		expect(v2.z).toEqual(44);
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