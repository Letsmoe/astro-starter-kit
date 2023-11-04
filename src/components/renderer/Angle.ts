import type { Vector2D } from "./Vector2D";

export class Angle {
	public static betweenPoints(p1: Vector2D, p2: Vector2D) {
		return Math.atan2(p1.y - p2.y, p1.x - p2.x);
	}
}