
/*  -----     linear_algebra.js     -----  */

// This file contains all the classes and functions that I have written describing manipulations of vectors and matrices in three dimensions. I use this essential linear algebra throughout the project, but is most prominent in the three following files: reflection.js, camera.js and scene_elements.js.


class Vector3 {
	// 3D Vector - (x, y, z) coordinates  --  These are used to describe points in the three dimensional scene
	constructor (x,y,z) {
		this.x = x;
	    this.y = y;
		this.z = z;
    }
    
/*
    printVector3(){
	    // Used for debugging
	    print(this.x);
	    print(this.y);
	    print(this.z);
	    print('\n');
	}
*/
		
	magn(){
		// this.magn() returns the magnitude of the vector
		return sqrt(this.x*this.x + this.y*this.y + this.z*this.z);
	}
	
	unit(){
		// this.unit() returns a new vector of the same direction but lies on the unit sphere
		var magn = this.magn();
		if (magn){
			return new Vector3(this.x/magn,this.y/magn,this.z/magn);
		} else {
			return new Vector3(0,0,0);
		}
	}

}
 
class Vector2 {
	// 2D Vector - (x, y) coordinates  --  These are used to describe the projection of a 3D point onto your 2D screen
	constructor(x,y) {
		// Check the point lies close to the screen (allow for some off the screen, eg: if this is one vertex of a face)
		if (renderAllFront || (x>-3*W/4 && x<3*W/4 && y>-3*H/4 && y<3*H/4)){
			this.x = x;
			this.y = y;
		}
	}
	
	plotVector2 (){
		// Plotting the 2D Vector
	    point(this.x,this.y);
	}
}

class Matrix3{
	// 3x3 Matrix used for describing linear transformations of space, primarily used for rotation
	constructor(a,b,c,d,e,f,g,h,i){
	    this.a = a;
	    this.b = b;
	    this.c = c;
	    this.d = d;
	    this.e = e;
	    this.f = f;
	    this.g = g;
	    this.h = h;
	    this.i = i;
    }
/*
    printMatrix3 (){
	    // Used for debugging
	    print((this.a)+'  '+(this.b)+'  '+(this.c));
	    print((this.d)+'  '+(this.e)+'  '+(this.f));
	    print((this.g)+'  '+(this.h)+'  '+(this.i));
	    print('\n');
	}
*/

}

class Matrix2 {
	// 2x2 Matrix used for describing linear transformations of the plane
	constructor(a,b,c,d){
	    this.a = a;
	    this.b = b;
	    this.c = c;
	    this.d = d;
    }
};

function multScalarVector(lambda,V){
	// Scalar Vector multiplication
	return new Vector3(lambda*V.x,lambda*V.y,lambda*V.z);
}

function addVector3(V1,V2){
	// Adding two vectors
	return new Vector3(V1.x+V2.x,V1.y+V2.y,V1.z+V2.z);
}

function subVector3(V1,V2){
	// Subtracting two vectors
	return new Vector3(V1.x-V2.x,V1.y-V2.y,V1.z-V2.z);
}

function matrixVectorProduct(M,V){
	// Matrix Vector Multiplication
    return new Vector3(
        M.a*V.x + M.b*V.y + M.c*V.z,
        M.d*V.x + M.e*V.y + M.f*V.z,
        M.g*V.x + M.h*V.y + M.i*V.z);
}

function detMatrix2 (M){
	// The determinant of a 2x2 matrix
    return M.a*M.d - M.b*M.c;
}

function detMatrix3(M){
	// The determinant of a 3x3 matrix
    var cofactorA = new Matrix2(M.e,M.f,M.h,M.i);
    var cofactorB = new Matrix2(M.d,M.f,M.g,M.i);
    var cofactorC = new Matrix2(M.d,M.e,M.g,M.h);
    return M.a*detMatrix2(cofactorA) - M.b*detMatrix2(cofactorB) + M.c*detMatrix2(cofactorC);
}

function invMatrix(M){
	// The inverse of a 3x3 matrix, used in reflection.js

    return new Matrix3(
        1/detMatrix3(M) * detMatrix2(new Matrix2(M.e,M.f,M.h,M.i)),   // Cofactor A
        1/detMatrix3(M) * -detMatrix2(new Matrix2(M.b,M.c,M.h,M.i)),  // Cofactor D
        1/detMatrix3(M) * detMatrix2(new Matrix2(M.b,M.c,M.e,M.f)),   // Cofactor G
        1/detMatrix3(M) * -detMatrix2(new Matrix2(M.d,M.f,M.g,M.i)),  // Cofactor B
        1/detMatrix3(M) * detMatrix2(new Matrix2(M.a,M.c,M.g,M.i)),   // Cofactor E
        1/detMatrix3(M) * -detMatrix2(new Matrix2(M.a,M.c,M.d,M.f)),  // Cofactor H
        1/detMatrix3(M) * detMatrix2(new Matrix2(M.d,M.e,M.g,M.h)),   // Cofactor C
        1/detMatrix3(M) * -detMatrix2(new Matrix2(M.a,M.g,M.b,M.h)),  // Cofactor F
        1/detMatrix3(M) * detMatrix2(new Matrix2(M.a,M.b,M.d,M.e)));  // Cofactor I
}



function scalarProduct3(V1,V2){
	// Scalar Product of two 3x1 vectors
    return V1.x*V2.x + V1.y*V2.y + V1.z*V2.z;    
}

function crossProduct3(V1,V2){
	// Cross Product of two 3x1 vectors
    return new Vector3(V1.y*V2.z-V1.z*V2.y,V1.z*V2.x-V1.x*V2.z,V1.x*V2.y-V1.y*V2.x);    
}

function distanceSQ3(V1,V2){
	// The square of the distance between two position vectors (to save the computation of taking a square root)
	// Used for ordering faces in terms of the distance to the camera (x^2 is an increasing function for domain x>0)
	// Let x be actual distances, if we order the distances normally by comparing x, x^2 will also be arranged in the same order
	return (V1.x-V2.x)*(V1.x-V2.x)+(V1.y-V2.y)*(V1.y-V2.y)+(V1.z-V2.z)*(V1.z-V2.z);
}

function distance3(V1,V2){
	// Actual distance between to position vectors
	return sqrt((V1.x-V2.x)*(V1.x-V2.x)+(V1.y-V2.y)*(V1.y-V2.y)+(V1.z-V2.z)*(V1.z-V2.z));
}

function lerpV(V1,V2,scalar){
	// Returns a position vector that is some scalar between two other position vectors V1 and V2
	return new Vector3(V1.x + scalar*(V2.x-V1.x), V1.y + scalar*(V2.y-V1.y), V1.z + scalar*(V2.z-V1.z));
}

function angleBetween(V1,V2){
	// Finding the angle between two vectors using the scalar product
	return acos(scalarProduct3(V1,V2)/(V1.magn() * V2.magn()));
}
