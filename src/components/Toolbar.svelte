<script lang="ts">
	import { shared } from "./shared";

	let drawMode = shared.drawMode.data;

	shared.drawMode.addObserver((data) => {
		drawMode = data;
	})
</script>

<div class="fixed left-2 top-2 bottom-2 p-0.5 flex flex-col gap-2 rounded-lg bg-gray-200 border border-gray-300">
	<button on:click={() => shared.drawMode.update("line")} data-selected={drawMode == "line"} class="group p-2 rounded-lg hover:bg-slate-100 transition-colors relative data-[selected='true']:bg-slate-100">
		<svg width="20" height="20" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.8536 1.14645C11.6583 0.951184 11.3417 0.951184 11.1465 1.14645L3.71455 8.57836C3.62459 8.66832 3.55263 8.77461 3.50251 8.89155L2.04044 12.303C1.9599 12.491 2.00189 12.709 2.14646 12.8536C2.29103 12.9981 2.50905 13.0401 2.69697 12.9596L6.10847 11.4975C6.2254 11.4474 6.3317 11.3754 6.42166 11.2855L13.8536 3.85355C14.0488 3.65829 14.0488 3.34171 13.8536 3.14645L11.8536 1.14645ZM4.42166 9.28547L11.5 2.20711L12.7929 3.5L5.71455 10.5784L4.21924 11.2192L3.78081 10.7808L4.42166 9.28547Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg>
		<div class="group-hover:visible invisible px-2 py-1 rounded-lg bg-slate-900 text-slate-50 absolute left-[calc(100%+10px)] top-[50%] translate-y-[-50%]">
			Line
		</div>
	</button>
	<button on:click={() => shared.drawMode.update("rectangle")} data-selected={drawMode == "rectangle"} class="group p-2 rounded-lg hover:bg-slate-100 transition-colors relative data-[selected='true']:bg-slate-100">
		<svg width="20" height="20" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.5 2H2.5C2.22386 2 2 2.22386 2 2.5V12.5C2 12.7761 2.22386 13 2.5 13H12.5C12.7761 13 13 12.7761 13 12.5V2.5C13 2.22386 12.7761 2 12.5 2ZM2.5 1C1.67157 1 1 1.67157 1 2.5V12.5C1 13.3284 1.67157 14 2.5 14H12.5C13.3284 14 14 13.3284 14 12.5V2.5C14 1.67157 13.3284 1 12.5 1H2.5Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg>
		<div class="group-hover:visible invisible px-2 py-1 rounded-lg bg-slate-900 text-slate-50 absolute left-[calc(100%+10px)] top-[50%] translate-y-[-50%]">
			Rectangle
		</div>
	</button>
</div>