import type { RenderElement } from "./RenderElement";
import type { Renderer2D } from "./Renderer2D";
import type {  RenderElementOptions } from "./types";
import { Vector2D } from "./Vector2D";

type RectangleOptions = RenderElementOptions & {
	z?: number,
	color?: string,
	font?: string
}

type Callback<T> = () => T;

export class TextElement implements RenderElement {
	public position: Vector2D;
	public id: number = Math.random();
	public data: Record<any, any>
	public content: string;
	public options: RenderElementOptions & {
		z: number,
		color: string,
		font: string
	};

	public onBeforeRender = () => {};

	public constructor(x: number, y: number, content: string, options?: RectangleOptions, data: Record<any, any> = {}) {
		const defaults = {
			z: 0,
			color: "#000",
			font: "16px Arial"
		}

		this.options = Object.assign(defaults, options)
		this.position = new Vector2D(x, y);
		this.data = data;
		this.content = content;
	}

	public set reactive(callbacks: Callback<any>[]) {
		this.onBeforeRender = () => {
			if (callbacks.length > 0) {
				let values = callbacks[0]();
				if (values) {
					this.position = new Vector2D(values[0], values[1]);
					this.content = values[2];
				}
				callbacks.slice(1).map(x => x())
			}
		}
	}

	public _batch(elements: TextElement[], r: Renderer2D) {
		r.whileSaved((ctx) => {
			ctx.beginPath()
			for (const text of elements) {
				ctx.font = text.options.font;
				ctx.fillStyle = text.options.color;
				ctx.fillText(text.content, text.position.x, text.position.y);
			}
			ctx.closePath();
		})
	}

	public _draw(r: Renderer2D) {
		this._batch([this], r);
	}
}