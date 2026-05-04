<script>
	/**
	 * домашняя страница src/routes/+page.svelte
	 */

	// ------------- ссылки с учётом локализации в будущем
	// @ts-ignore
	import { base } from '$app/paths';

	// -------------

	import src1 from '$lib/assets/basic.png';
	import src2 from '$lib/assets/catalog.png';
</script>

<div class="app-wrapper">
	<aside class="field_left"></aside>
	<main class="field_calculator catalog">
		<p>текстовая навигация с бысрым переходом на страницу калькулятора</p>
		<a href="{base}/basic" class="catalog__item">
			<p>basic</p>
			<img src={src1} alt="logo basic calculator" />
		</a>
		<a href="{base}/engineer" class="catalog__item">
			<p>engineer</p>
			<img src={src2} alt="logo engineer calculator" />
		</a>
	</main>
	<article class="instruction" id="instruction">
		<!-- текстовые блоки  и иллюстрации -->
		<p>
			Lorem ipsum, dolor sit amet consectetur adipisicing elit. Aliquid aliquam, nobis perferendis
			ipsum delectus corporis ad quos atque beatae quae nisi rerum id facere. Architecto molestias
			eos reprehenderit magni nam.
		</p>
	</article>
	<section class="reviews__old">
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
	a.catalog__item {
		padding: 24px;
		padding-top: 12px;
		border: 1px solid white;
		border-radius: 24px;
		background: grey;
		color: #0f172a;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 12px;
		transition: all 0.5s;

		&:hover {
			background: #0f172a;
			color: grey;
			transition: all 0.35s;
			p {
				text-transform: uppercase;
				font-weight: 800;
			}
		}
		&:active {
			color: #0f172a;
			filter: blur(0.2px);
			transform: scaleY(96%);
			transition: all 0.05s;
		}
		img {
			width: 20vmin;
			aspect-ratio: 1/1;
			border: 1px solid transparent;
			border-radius: 16px;
		}
	}

	.field_calculator.catalog {
		background: #1e293b;
		padding: 2rem;
		box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);

		display: flex;
		flex-flow: column nowrap;
		justify-content: center;
		align-items: center;
	}
</style>
