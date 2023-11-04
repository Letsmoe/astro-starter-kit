import type { RenderElement } from "./RenderElement";
import type { Renderer2D } from "./Renderer2D";
import type {  RenderElementOptions } from "./types";
import { Vector2D } from "./Vector2D";

type RectangleOptions = RenderElementOptions & {
	z?: number,
	borderColor?: string,
	borderWidth?: number,
	fillColor?: string
}

type Callback<T> = () => T;

export class Rectangle implements RenderElement {
	public position: Vector2D;
	public width: number;
	public height: number;
	public id: number = Math.random();
	public data: Record<any, any>
	public options: RenderElementOptions & {
		z: number,
		borderColor: string,
		borderWidth: number,
		fillColor: string
	};

	public onBeforeRender = () => {};

	public constructor(x: number, y: number, width: number, height: number, options?: RectangleOptions, data: Record<any, any> = {}) {
		const defaults = {
			z: 0,
			borderColor: "#000000",
			borderWidth: 0,
			fillColor: "#000000"
		}

		this.options = Object.assign(defaults, options)
		this.position = new Vector2D(x, y);
		this.width = width;
		this.data = data;
		this.height = height;
	}

	public set reactive(callbacks: Callback<any>[]) {
		this.onBeforeRender = () => {
			if (callbacks.length > 0) {
				let values = callbacks[0]();
				if (values) {
					this.position = new Vector2D(values[0], values[1]);
					this.width = values[2];
					this.height = values[3];
				}
				callbacks.slice(1).map(x => x())
			}
		}
	}

	public _batch(rectangles: Rectangle[], r: Renderer2D) {
		r.whileSaved((ctx) => {
			ctx.beginPath()
			for (const rectangle of rectangles) {
				let borderWidth = rectangle.options.borderWidth;
				// When the width or height are negative the rectangle is still being drawn but in the opposite direction
				// we need to check whether that's the case so we can align the border properly.
				let multiplierX = rectangle.width > 0 ? 1 : -1;
				let multiplierY = rectangle.height > 0 ? 1 : -1;
				if (borderWidth > 0) {
					ctx.fillStyle = rectangle.options.borderColor;
					ctx.fillRect(rectangle.position.x, rectangle.position.y, rectangle.width + (2 * borderWidth * multiplierX), rectangle.height + (2 * borderWidth * multiplierY));
					ctx.stroke();
				}

				if (rectangle.options.fillColor) {
					ctx.fillStyle = rectangle.options.fillColor;
					ctx.fillRect(rectangle.position.x + (borderWidth * multiplierX), rectangle.position.y + (borderWidth * multiplierY), rectangle.width, rectangle.height);
					continue;
				}
			}
			ctx.closePath();
		})
	}

	public _draw(r: Renderer2D) {
		this._batch([this], r);
	}
}