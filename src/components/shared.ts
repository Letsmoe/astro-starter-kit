import { Observable } from "./renderer/Observable"

export let shared: {
	drawMode: Observable<"line" | "rectangle" | "circle">
} = {
	drawMode: new Observable<"line" | "rectangle" | "circle">("line")
}



