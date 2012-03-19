var requirejs = require("requirejs");
requirejs.config({nodeRequire: require});

requirejs(["../../src/vector3d"], function(Vector3D) {
	describe("Mathematics.Vector3D", function(){
		beforeEach(function() {
			this.vec = new Vector3D(1, 2, 3);
		});

		it("should create a copy of the vector", function() {
			var vec2 = this.vec.clone();
			expect(this.vec.x).toEqual(1);
			expect(this.vec.y).toEqual(2);
			expect(this.vec.z).toEqual(3);
			expect(vec2.x).toEqual(1);
			expect(vec2.y).toEqual(2);
			expect(vec2.z).toEqual(3);
			this.vec.x = 3;
			expect(this.vec.x).toEqual(3);
			expect(vec2.x).toEqual(1);
			vec2.y = 4;
			expect(this.vec.y).toEqual(2);
			expect(vec2.y).toEqual(4);
		});

		it("should add two vectors and store it in the first one", function() {
			vec2 = new Vector3D(3, 2, 1);
			this.vec.add(vec2);
			expect(this.vec.x).toEqual(4);
			expect(this.vec.y).toEqual(4);
			expect(this.vec.z).toEqual(4);
			expect(vec2.x).toEqual(3);
			expect(vec2.y).toEqual(2);
			expect(vec2.z).toEqual(1);
		});

		it("should add two vectors and store it in the destination vector", function() {
			vec2 = new Vector3D(3, 2, 1);
			vec3 = new Vector3D();
			this.vec.add(vec2, vec3);
			expect(this.vec.x).toEqual(1);
			expect(this.vec.y).toEqual(2);
			expect(this.vec.z).toEqual(3);
			expect(vec2.x).toEqual(3);
			expect(vec2.y).toEqual(2);
			expect(vec2.z).toEqual(1);
			expect(vec3.x).toEqual(4);
			expect(vec3.y).toEqual(4);
			expect(vec3.z).toEqual(4);
		});

		it("should calculate the component product and store it in itself", function() {
			this.vec.componentProduct(new Vector3D(3, 2, 1));
			expect(this.vec.x).toBe(3);
			expect(this.vec.y).toBe(4);
			expect(this.vec.z).toBe(3);
		});


		it("should calculate the component product and store it on the destination vector", function() {
			dest = new Vector3D();
			this.vec.componentProduct(new Vector3D(3, 2, 1), dest);
			expect(dest.x).toBe(3);
			expect(dest.y).toBe(4);
			expect(dest.z).toBe(3);
			expect(this.vec.x).toBe(1);
			expect(this.vec.y).toBe(2);
			expect(this.vec.z).toBe(3);
		});

		it("should substract two vectors and store it in the first one", function() {
			vec2 = new Vector3D(4, 4, 4);
			vec2.substract(this.vec);
			expect(this.vec.x).toEqual(1);
			expect(this.vec.y).toEqual(2);
			expect(this.vec.z).toEqual(3);
			expect(vec2.x).toEqual(3);
			expect(vec2.y).toEqual(2);
			expect(vec2.z).toEqual(1);
		});

		it("should substract two vectors and store it in the destination vector", function() {
			vec2 = new Vector3D(4, 4, 4);
			vec3 = new Vector3D();
			vec2.substract(this.vec, vec3);
			expect(this.vec.x).toEqual(1);
			expect(this.vec.y).toEqual(2);
			expect(this.vec.z).toEqual(3);
			expect(vec2.x).toEqual(4);
			expect(vec2.y).toEqual(4);
			expect(vec2.z).toEqual(4);
			expect(vec3.x).toEqual(3);
			expect(vec3.y).toEqual(2);
			expect(vec3.z).toEqual(1);
		});

		it("should return the length of the vector", function() {
			expect(this.vec.length()).toEqual(Math.sqrt(14));
			expect(this.vec.magnitude()).toEqual(Math.sqrt(14));
		});

		it("should return the vectors cross product and stores it in the first one", function() {
			vec2 = new Vector3D(3, 2, 1);
			this.vec.crossProduct(vec2);
			expect(this.vec.x).toEqual(-4);
			expect(this.vec.y).toEqual(8);
			expect(this.vec.z).toEqual(-4);
			expect(vec2.x).toEqual(3);
			expect(vec2.y).toEqual(2);
			expect(vec2.z).toEqual(1);
		});

		it("should return the vectors cross product and stores it in the destination", function() {
			vec2 = new Vector3D(3, 2, 1);
			vec3 = new Vector3D();
			this.vec.crossProduct(vec2, vec3);
			expect(vec3.x).toEqual(-4);
			expect(vec3.y).toEqual(8);
			expect(vec3.z).toEqual(-4);
			expect(vec2.x).toEqual(3);
			expect(vec2.y).toEqual(2);
			expect(vec2.z).toEqual(1);
			expect(this.vec.x).toEqual(1);
			expect(this.vec.y).toEqual(2);
			expect(this.vec.z).toEqual(3);
			vec2.crossProduct(this.vec, vec3);
			expect(vec3.x).toEqual(4);
			expect(vec3.y).toEqual(-8);
			expect(vec3.z).toEqual(4);
			expect(vec2.x).toEqual(3);
			expect(vec2.y).toEqual(2);
			expect(vec2.z).toEqual(1);
			expect(this.vec.x).toEqual(1);
			expect(this.vec.y).toEqual(2);
			expect(this.vec.z).toEqual(3);
		});

		it("should return the dot product of the vectors", function() {
			vec2 = new Vector3D(3, 2, 1);
			expect(this.vec.dotProduct(vec2)).toEqual(10);
		});

		it("should normalize the vector and store it in itself", function() {
			this.vec.normalize();
			expect(this.vec.x).toEqual(1 / Math.sqrt(14));
			expect(this.vec.y).toEqual(2 / Math.sqrt(14));
			expect(this.vec.z).toEqual(3 / Math.sqrt(14));
		});

		it("should normalize the vector and store it in the destination", function() {
			vec1 = new Vector3D();
			this.vec.normalize(vec1);
			expect(vec1.x).toEqual(1 / Math.sqrt(14));
			expect(vec1.y).toEqual(2 / Math.sqrt(14));
			expect(vec1.z).toEqual(3 / Math.sqrt(14));
			expect(this.vec.x).toEqual(1);
			expect(this.vec.y).toEqual(2);
			expect(this.vec.z).toEqual(3);
		});

		it("should make the vector (0,0,0)", function() {
			this.vec.zero();
			expect(this.vec.x).toBe(0);
			expect(this.vec.y).toBe(0);
			expect(this.vec.z).toBe(0);
		});


		it("should do scalar multiplication correctly", function() {
			this.vec.scale(2.5);
			expect(this.vec.x).toBe(2.5);
			expect(this.vec.y).toBe(5);
			expect(this.vec.z).toBe(7.5);
		});

		it("should do scalar multiplication correctly and store it in other vector", function() {
			v = this.vec.scale(2.5, new Vector3D());
			expect(v.x).toBe(2.5);
			expect(v.y).toBe(5);
			expect(v.z).toBe(7.5);
			expect(this.vec.x).toEqual(1);
			expect(this.vec.y).toEqual(2);
			expect(this.vec.z).toEqual(3);
		});
	});
});