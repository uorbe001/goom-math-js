var requirejs = require("requirejs");
requirejs.config({nodeRequire: require});

requirejs(["../../src/quaternion", "../../src/vector3d"], function() {
	describe("Math.Quaternion", function() {
		beforeEach(function() {
			this.q = new Math.Quaternion();
		});

		it("creates a identity quaternion", function() {
			this.q.r = 31;
			this.q.i = 3;
			this.q.j = 4;
			this.q.k = 4;
			this.q.makeIdentity();
			expect(this.q.r).toBe(1);
			expect(this.q.i).toBe(0);
			expect(this.q.j).toBe(0);
			expect(this.q.k).toBe(0);
		});

		it("normalizes a quaternion", function() {
			this.q.r = 1;
			this.q.i = 2;
			this.q.j = 3;
			this.q.k = 4;
			this.q.normalize();
			expect(this.q.r).toBe(1 * 1/Math.sqrt(30));
			expect(this.q.i).toBe(2 * 1/Math.sqrt(30));
			expect(this.q.j).toBe(3 * 1/Math.sqrt(30));
			expect(this.q.k).toBe(4 * 1/Math.sqrt(30));
		});

		it("multiplies two quaternions and stores the new values on the first one", function() {
			this.q.r = 1;
			this.q.i = 2;
			this.q.j = 0;
			this.q.k = 1;
			var q2 = new Math.Quaternion(2, 3, 0, 1);

			this.q.multiply(q2);

			expect(this.q.r).toBe(-5);
			expect(this.q.i).toBe(7);
			expect(this.q.j).toBe(1);
			expect(this.q.k).toBe(3);
			expect(q2.r).toBe(2);
			expect(q2.i).toBe(3);
			expect(q2.j).toBe(0);
			expect(q2.k).toBe(1);
		});
		
		it("multiplies two quaternions and stores values on third one", function() {
			this.q.r = 1;
			this.q.i = 2;
			this.q.j = 0;
			this.q.k = 1;
			var q2 = new Math.Quaternion(2, 3, 0, 1);

			destination = new Math.Quaternion();
			this.q.multiply(q2, destination);
			expect(this.q.r).toBe(1);
			expect(this.q.i).toBe(2);
			expect(this.q.j).toBe(0);
			expect(this.q.k).toBe(1);
			expect(q2.r).toBe(2);
			expect(q2.i).toBe(3);
			expect(q2.j).toBe(0);
			expect(q2.k).toBe(1);
			expect(destination.r).toBe(-5);
			expect(destination.i).toBe(7);
			expect(destination.j).toBe(1);
			expect(destination.k).toBe(3);
		});

		it("rotates the quaternion by a vector and stores it in itself", function() {
			this.q.r = 1;
			this.q.i = 2;
			this.q.j = 3;
			this.q.k = 4;
			var q1 = new Math.Quaternion(1, 2, 3, 4);
			var q2 = new Math.Quaternion(0, 1, 2, 3);
			var v = new Math.Vector3D(1, 2, 3);
			this.q.rotateByVector(v);
			q1.multiply(q2);
			expect(this.q.r).toBe(q1.r);
			expect(this.q.i).toBe(q1.i);
			expect(this.q.j).toBe(q1.j);
			expect(this.q.k).toBe(q1.k);
			expect(v.x).toBe(1);
			expect(v.y).toBe(2);
			expect(v.z).toBe(3);
		});

		it("rotates the quaternion by a vector and stores it the destination", function() {
			this.q.r = 1;
			this.q.i = 2;
			this.q.j = 3;
			this.q.k = 4;
			var q1 = new Math.Quaternion(1, 2, 3, 4);
			var dest = new Math.Quaternion();
			var q2 = new Math.Quaternion(0, 1, 2, 3);
			var v = new Math.Vector3D(1, 2, 3);
			this.q.rotateByVector(v, dest);
			q1.multiply(q2);
			expect(dest.r).toBe(q1.r);
			expect(dest.i).toBe(q1.i);
			expect(dest.j).toBe(q1.j);
			expect(dest.k).toBe(q1.k);
			expect(this.q.r).toBe(1);
			expect(this.q.i).toBe(2);
			expect(this.q.j).toBe(3);
			expect(this.q.k).toBe(4);
			expect(v.x).toBe(1);
			expect(v.y).toBe(2);
			expect(v.z).toBe(3);
		});

		it("adds a vector to the quaternion by a vector and stores it in itself", function() {
			this.q.r = 1;
			this.q.i = 2;
			this.q.j = 3;
			this.q.k = 4;
			var q1 = new Math.Quaternion(1, 2, 3, 4);
			var q2 = new Math.Quaternion(0, 1, 2, 3);
			var v = new Math.Vector3D(1, 2, 3);
			this.q.addVector(v);
			q2.multiply(q1);
			expect(this.q.r).toBe(1 + q2.r * 0.5);
			expect(this.q.i).toBe(2 + q2.i * 0.5);
			expect(this.q.j).toBe(3 + q2.j * 0.5);
			expect(this.q.k).toBe(4 + q2.k * 0.5);
			expect(v.x).toBe(1);
			expect(v.y).toBe(2);
			expect(v.z).toBe(3);
		});

		it("adds a vector to the quaternion by a vector and stores it the destination", function() {
			this.q.r = 1;
			this.q.i = 2;
			this.q.j = 3;
			this.q.k = 4;
			var q1 = new Math.Quaternion(1, 2, 3, 4);
			var dest = new Math.Quaternion();
			var q2 = new Math.Quaternion(0, 1, 2, 3);
			var v = new Math.Vector3D(1, 2, 3);
			this.q.addVector(v, dest);
			q2.multiply(q1);
			expect(dest.r).toBe(1 + q2.r * 0.5);
			expect(dest.i).toBe(2 + q2.i * 0.5);
			expect(dest.j).toBe(3 + q2.j * 0.5);
			expect(dest.k).toBe(4 + q2.k * 0.5);
			expect(this.q.r).toBe(1);
			expect(this.q.i).toBe(2);
			expect(this.q.j).toBe(3);
			expect(this.q.k).toBe(4);
			expect(v.x).toBe(1);
			expect(v.y).toBe(2);
			expect(v.z).toBe(3);
		});
	});
});