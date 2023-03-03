<script lang="ts">
	import Post from "./Post.svelte";
	export let posts: any[];
</script>

<ul>
	{#each posts as post}
		<Post post={post}></Post>
	{/each}
</ul>