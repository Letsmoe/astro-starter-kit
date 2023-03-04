<script lang="ts">
	export let link: string | undefined = undefined;
	export let onClick: () => any = () => {};
</script>

<a href={link} on:click={onClick} class="rounded-lg bg-slate-50 hover:bg-slate-200 px-2 py-2 cursor-pointer transition-colors">
	<slot></slot>
</a>