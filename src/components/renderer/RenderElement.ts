import type { Renderer2D } from "./Renderer2D";
import type { RenderElementOptions } from "./types";

export abstract class RenderElement {
	public id: number = Math.random();
	public options: RenderElementOptions;
	public data: Record<any, any>;
	public constructor() {
		throw new Error("Abstract classes should not be instantiated.");
	}

	public _draw(r: Renderer2D) {

	}

	public _batch(bucket: RenderElement[], r: Renderer2D) {

	}

	public onBeforeRender() {

	}
}