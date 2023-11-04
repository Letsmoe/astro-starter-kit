import { Vector } from "./Vector";

export class Vector2D extends Vector {
	constructor(x = 0, y = 0) {
		super(x, y);
		this.set(0, x);
		this.set(1, y);
	}

	get x() {
		return this.get(0);
	}

	set x(value) {
		this.set(0, value);
	}

	get y() {
		return this.get(1);
	}

	set y(value) {
		this.set(1, value);
	}

	get length() {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}

	normalize() {
		let length = this.length;
		if (length !== 0) {
			this.x /= length;
			this.y /= length;
		}
		return this;
	}

	dot(other: Vector2D) {
		if (!(other instanceof Vector2D)) {
			throw new Error("Other vector must be a Vector2D.");
		}
		return this.x * other.x + this.y * other.y;
	}

	cross(other: Vector2D) {
		if (!(other instanceof Vector2D)) {
			throw new Error("Other vector must be a Vector2D.");
		}
		return this.x * other.y - this.y * other.x;
	}

	angle(other: Vector2D) {
		if (!(other instanceof Vector2D)) {
			throw new Error("Other vector must be a Vector2D.");
		}
		let dotProduct = this.dot(other);
		let angle = Math.acos(dotProduct / (this.length * other.length));
		return angle;
	}
}
