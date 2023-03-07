<script lang="ts">
	export let post: any;
</script>

<li class="shadow-sm px-4 py-4 mb-4 rounded-lg border border-slate-300 hover:bg-slate-200 cursor-pointer">
	<a href={"/post/" + post.id}>
		<div class="flex flex-row">
			<span class="mr-2 font-bold">{post.viewcount}</span>
			<h2>{post.title}</h2>
		</div>
	</a>
</li>