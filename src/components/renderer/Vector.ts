export class Vector {
	public components: number[];
  constructor(...components: number[]) {
    this.components = components;
  }

	public get(i: number) {
		return this.components[i];
	}

	public set(i: number, value: number) {
		this.components[i] = value;
		return this;
	}

  get dimension() {
    return this.components.length;
  }

  dot(other: Vector) {
    if (this.dimension !== other.dimension) {
      throw new Error("Vectors must be of the same dimension to perform dot product.");
    }

    let result = 0;
    for (let i = 0; i < this.dimension; i++) {
      result += this.components[i] * other.components[i];
    }
    return result;
  }

  add(other: Vector) {
    if (this.dimension !== other.dimension) {
      throw new Error("Vectors must be of the same dimension to perform addition.");
    }

    let components = [];
    for (let i = 0; i < this.dimension; i++) {
      components.push(this.components[i] + other.components[i]);
    }
    return new Vector(...components);
  }

  subtract(other: Vector) {
    if (this.dimension !== other.dimension) {
      throw new Error("Vectors must be of the same dimension to perform subtraction.");
    }

    let components = [];
    for (let i = 0; i < this.dimension; i++) {
      components.push(this.components[i] - other.components[i]);
    }
    return new Vector(...components);
  }

  scale(scalar: number) {
    let components = [];
    for (let i = 0; i < this.dimension; i++) {
      components.push(this.components[i] * scalar);
    }
    return new Vector(...components);
  }

  magnitude() {
    let squaresSum = 0;
    for (let i = 0; i < this.dimension; i++) {
      squaresSum += this.components[i] ** 2;
    }
    return Math.sqrt(squaresSum);
  }

  unit() {
    let mag = this.magnitude();
    if (mag === 0) {
      throw new Error("Cannot normalize a zero vector.");
    }
    return this.scale(1 / mag);
  }
}
