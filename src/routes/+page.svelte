<script>
	/**
	 * домашняя страница src/routes/+page.svelte
	 */

	import BtnBlockDigit from '$lib/components/Btn/BtnBlockBase/BtnBlockDigit.svelte';
	import BtnBlockOp from '$lib/components/Btn/BtnBlockBase/BtnBlockOp.svelte';

	import DisText from '$lib/components/Display/DisText.svelte';
</script>

<div class="app-wrapper">
	<aside class="field_left"></aside>
	<main class="field_calculator catalog">
		<a href="/basic" class="catalog__item">arithmetic</a>
	</main>
	<article class="instruction">
		<!-- текстовые блоки  и иллюстрации -->
		<p>
			Lorem ipsum, dolor sit amet consectetur adipisicing elit. Aliquid aliquam, nobis perferendis
			ipsum delectus corporis ad quos atque beatae quae nisi rerum id facere. Architecto molestias
			eos reprehenderit magni nam.
		</p>
	</article>
	<section class="history__old">
		<p>
			Lorem ipsum dolor sit amet, consectetur adipisicing elit. Qui libero harum incidunt saepe
			eaque totam dicta eum nam omnis! Perferendis commodi magni deserunt officiis nisi sapiente
			itaque corrupti ab ipsum?
		</p>
		<!-- текстовые блоки ОТДЕЛЬНОЙ СТРАНИЦЕЙ   ????-->
	</section>
	<aside class="field_right">
		<!-- advertisement картинки и банеры -->
	</aside>
</div>

<style lang="scss">
	:global(body) {
		background: #0f172a;
		color: #f8fafc;
		font-family: 'Segoe UI', system-ui, sans-serif;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100vh;
		margin: 0;
	}

	a.catalog__item {
		padding: 24px;
		border: 1px solid white;
		border-radius: 24px;
		background: grey;
		color: #0f172a;
		&:hover {
			background: #0f172a;
			color: grey;
			transition: all 0.35s;
		}
		&:active {
			background: grey;
			filter: blur(2px);
			transform: scaleY(80%);
			transition: all 0.35s;
		}
	}

	.field_calculator.catalog {
		// === -📝=TODO=📝- ===
		outline: 4px dotted red;

		background: #1e293b;
		padding: 2rem;
		border-radius: 1.5rem;
		box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);

		display: flex;
		flex-flow: column nowrap;
		justify-content: center;
		align-items: center;
	}
</style>
