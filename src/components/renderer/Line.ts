import type { RenderElement } from "./RenderElement";
import type { Renderer2D } from "./Renderer2D";
import type {  RenderElementOptions } from "./types";
import { Vector2D } from "./Vector2D";

type LineOptions = RenderElementOptions & {
	color?: string,
	width?: number,
	dashStyle?: [number, number]
}

type Callback<T> = () => T;

export class Line implements RenderElement {
	public start: Vector2D;
	public end: Vector2D;
	public data;
	public id: number = 0;
	public options: RenderElementOptions & {
		color: string,
		width: number,
		dashStyle: [number, number]
	};

	public onBeforeRender = () => {};

	public constructor(startX: number, startY: number, endX: number, endY: number, options?: LineOptions, data: Record<any, any> = {}) {
		const defaults = {
			z: 0,
			color: "#000000",
			width: 1,
			dashStyle: [0,0]
		}

		this.options = Object.assign(defaults, options)
		this.start = new Vector2D(startX, startY);
		this.end = new Vector2D(endX, endY);
		this.data = data;
	}

	public set reactive(callbacks: Callback<any>[]) {
		this.onBeforeRender = () => {
			if (callbacks.length > 0) {
				let values = callbacks[0]();
				if (values) {
					this.start = new Vector2D(values[0], values[1])
					this.end = new Vector2D(values[2], values[3])
				}
				callbacks.slice(1).map(x => x())
			}
		}
	}

	public _batch(lines: Line[], r: Renderer2D) {
		r.whileSaved((ctx) => {
			ctx.beginPath()
			for (const line of lines) {
				ctx.setLineDash(line.options.dashStyle)
				ctx.strokeStyle = line.options.color;
				ctx.lineWidth = line.options.width;
				ctx.moveTo(line.start.get(0), line.start.get(1));
				ctx.lineTo(line.end.get(0), line.end.get(1));
			}
			ctx.closePath()
			ctx.stroke();
		})
	}

	public _draw(r: Renderer2D) {
		r.whileSaved((ctx) => {
			ctx.beginPath()
			ctx.setLineDash(this.options.dashStyle)
			ctx.strokeStyle = this.options.color;
			ctx.lineWidth = this.options.width;
			ctx.moveTo(this.start.get(0), this.start.get(1));
			ctx.lineTo(this.end.get(0), this.end.get(1));
			ctx.closePath();
			ctx.stroke();
		})
	}

	public rotate(pivot: Vector2D | [number, number], angle: number) {
		if (pivot instanceof Vector2D) {
			pivot = [pivot.get(0), pivot.get(1)];
		}
		// Calculate the angles beforehand for better execution speeds
		let angSin = Math.sin(angle);
		let angCos = Math.cos(angle);

		// Rotate each point (start, end) around the pivot
		let tx1 = this.start.get(0) - pivot[0], ty1 = this.start.get(1) - pivot[1]
		let p1x = ( tx1*angCos + ty1*angSin) + pivot[0]
		let p1y = (-tx1*angSin + ty1*angCos) + pivot[1]
		let tx2 = this.end.get(0) - pivot[0], ty2 = this.end.get(1) - pivot[1]
		let p2x = ( tx2*angCos + ty2*angSin) + pivot[0]
		let p2y = (-tx2*angSin + ty2*angCos) + pivot[1]

		this.start = new Vector2D(p1x, p1y);
		this.end = new Vector2D(p2x, p2y);
	}
}