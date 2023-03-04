<script lang="ts">
	export let show: (message: string) => void;
	let visible = false, content = "";
	show = (message: string) => {
		content = message;
		visible = true;

		setTimeout(() => {
			visible = false
		}, 5000)
	}
</script>

<div class="fixed bg-white rounded-lg px-6 py-4 bottom-8 left-8 shadow-md border border-slate-300 {visible ? "visible" : "not-visible"}">
	<p>{content}</p>
</div>

<style lang="scss">
	div {
		&.visible {
			animation: from-left 0.6s forwards;
		}

		&.not-visible {
			animation: to-left 0.6s forwards;
		}

		&.light {
			background-color: #fafafa;
			border: 1px solid #eee;
			& p {
				color: #333;
			}
		}
	}

	@keyframes to-left {
		0% {
			visibility: visible;
			left: 30px;
		}

		100% {
			left: -100%;
			visibility: hidden;
		}
	}

	@keyframes from-left {
		0% {
			left: -100%;
		}

		100% {
			left: 30px;
		}
	}
</style>