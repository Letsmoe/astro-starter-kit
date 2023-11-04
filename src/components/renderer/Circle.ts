import type { Renderer2D } from "./Renderer2D";
import type { RenderElement, RenderElementOptions } from "./types";

export class Circle implements RenderElement {
	onBeforeRender: () => void = () => {};
	reactive!: (callback: () => any) => void;
	public options: RenderElementOptions = { z: 0 };

	public _draw(r: Renderer2D) {}
}
