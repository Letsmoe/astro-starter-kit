import type { Circle } from "./Circle";
import type { Rectangle } from "./Rectangle";

export class Collision {
	public static twoRectangles(rect1: Rectangle, rect2: Rectangle) {
		if (
			rect1.position.x < rect2.position.x + rect2.width &&
			rect1.position.x + rect1.width > rect2.position.x &&
			rect1.position.y < rect2.position.y + rect2.height &&
			rect1.height + rect1.position.y > rect2.position.y
		) {
			return true;
		}

		return false;
	}

	public static circleRectangle(circle: Circle, rect: Rectangle) {

	}

	public twoCircles(c1: Circle, c2: Circle) {

	}
}
