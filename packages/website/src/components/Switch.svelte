<script lang="ts">
	export let active: boolean = false;
	export let text: string;
	export let onChange: (active: boolean) => any = () => {};
</script>

<div>
	<input
		type="checkbox"
		role="switch"
		id="flexSwitchCheckDefault"
		checked={active}
		on:change={() => {
			active = !active;
			onChange(active)
		}} />
	<label
		class="inline-block pl-[0.8rem] hover:cursor-pointer"
		for="flexSwitchCheckDefault"
		>{text}</label
	>
</div>

<style>
	input {
		@apply mt-[0.3rem] mr-2 h-3.5 w-8 appearance-none rounded-[0.4375rem] bg-[rgba(0,0,0,0.25)] outline-none;
	}

	input:hover {
		@apply cursor-pointer;
	}

	input:checked:focus::before {
		@apply ml-[1.0625rem] scale-100 shadow-[3px_-1px_0px_8px_#3b71ca] transition-[box-shadow_0.2s,transform_0.2s];
	}

	input:checked:focus {
		@apply border-blue-400 bg-blue-400;
	}

	input:checked {
		@apply bg-blue-400;
	}

	input:focus::before {
		@apply scale-100 opacity-[0.12] shadow-[3px_-1px_0px_8px_rgba(0,0,0,0.6)] transition-[box-shadow_0.2s,transform_0.2s];
	}

	input:focus::after {
		@apply absolute z-[1] block h-5 w-5 rounded-full content-[''];
	}

	input:checked::after {
		@apply absolute z-[2] -mt-[3px] ml-[1.0625rem] h-5 w-5 rounded-full border-none bg-blue-400 shadow-lg transition-[background-color_0.2s,transform_0.2s] content-[''];
	}

	input::before {
		@apply pointer-events-none absolute h-3.5 w-3.5 rounded-full bg-transparent content-[''];
	}

	input::after {
		@apply absolute z-[2] -mt-[0.1875rem] h-5 w-5 rounded-full border-none bg-white shadow-lg transition-[background-color_0.2s,transform_0.2s] content-[''];
	}
</style>