<script>
	/**
	 * страница арифметического калькулятора src/routes/(math)/basic/+page.svelte
	 */

	// ------------- ссылки с учётом локализации в будущем
	// @ts-ignore
	import { base } from '$app/paths';

	// -------------

	import { appState } from '$lib/store/appState.svelte';

	import BtnBlockDigit from '$lib/components/Btn/BtnBlockBase/BtnBlockDigit.svelte';
	import BtnBlockOp from '$lib/components/Btn/BtnBlockBase/BtnBlockOp.svelte';

	import DisText from '$lib/components/Display/DisText.svelte';

	import BtnBlockMemo from '$lib/components/Btn/BtnBlockBase/BtnBlockMemo.svelte';

	import LinkBlockNav from '$lib/components/Links/LinkBlockNav.svelte';
	import src from '$lib/assets/catalog.png';
</script>

<div class="app-wrapper">
	<aside class="field_left"></aside>
	<main class="field_calculator basic">
		<div class="field_displayPad">
			<DisText />
		</div>
		<div class="fieldBtn_page">
			<div class="fieldBtn_basic">
				<a href="{base}/" class="catalog__item">
					<p>catalog</p>
					<img {src} alt="logo catalog calculators" />
				</a>
			</div>
			<div class="fieldBtn_memory">
				<BtnBlockMemo />
			</div>
		</div>
		<div class="fieldBtn_digitPad">
			<BtnBlockDigit />
		</div>
		<div class="fieldBtn_basicOperators">
			<BtnBlockOp />
		</div>
		<div class="fieldBtn_nav">
			<LinkBlockNav />
		</div>
	</main>
	<article class="instruction" id="instruction">
		<!-- текстовые блоки  и иллюстрации -->
	</article>
	<section class="reviews__old">
		<!-- текстовые блоки ОТДЕЛЬНОЙ СТРАНИЦЕЙ   ????-->
	</section>
	<aside class="field_right">
		<!-- advertisement картинки и банеры -->
	</aside>
</div>

<style lang="scss">
	:global(.row > *) {
		flex: 1 1 0;
		min-width: 0;
	}
	// === -📝=TODO=📝- ===
	// это стили копия от a.catalog__item из src/routes/+page.svelte
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
			width: 10vmin;
			aspect-ratio: 1/1;
			border: 1px solid transparent;
			border-radius: 16px;
		}
	}
	.field_calculator.basic {
		// По умолчанию вертикальный (12 строк, 6 колонок)
		display: grid;
		grid-template-columns: repeat(6, calc(50vh / 6));
		grid-template-rows: repeat(12, calc(100vh / 12));
		grid-column-gap: 0px;
		grid-row-gap: 0px;

		// Распределение областей (Grid Areas)
		.field_displayPad {
			grid-area: 1 / 1 / 7 / 7;
		}

		.fieldBtn_page {
			grid-area: 7 / 1 / 11 / 4;
			display: flex;
			flex-flow: column nowrap;
			justify-content: space-around;
			align-items: center;
		}

		.fieldBtn_digitPad {
			grid-area: 7 / 4 / 12 / 7;
		}

		.fieldBtn_basicOperators {
			grid-area: 11 / 1 / 13 / 4;
		}

		.fieldBtn_nav {
			grid-area: 12 / 4 / 13 / 7;
			align-self: center;
			justify-content: center;
		}
	}
	// --- РЕЖИМ:  TABLET PORTRAIT ---
	@media (max-width: 1023px) and (orientation: portrait), (max-width: 767px) {
		.field_calculator.basic {
			grid-template-columns: repeat(6, minmax(1fr, calc(100vw / 6)));
			grid-template-rows: repeat(12, calc(100vh / 12));
			margin: 0 auto;
		}
	}

	// --- РЕЖИМ: MOBILE  PORTRAIT ---
	@media (orientation: portrait) and (max-width: 432px) {
		.field_calculator.basic {
			grid-template-columns: repeat(6, calc(100vw / 6));
			grid-template-rows: repeat(12, calc(100vh / 12));
			margin: 0 auto;
		}
	}

	// --- МОБИЛЬНЫЙ LANDSCAPE (6 строк, 12 колонок) ---
	@media (max-height: 500px) and (orientation: landscape) {
		.field_calculator.basic {
			grid-template-columns: repeat(12, calc(100vw / 12));
			grid-template-rows: repeat(6, calc(100vh / 6));
			width: 100%;
			// Распределение областей (Grid Areas)
			.field_displayPad {
				grid-area: 1 / 1 / 7 / 7;
			}

			.fieldBtn_page {
				grid-area: 1 / 7 / 5 / 10;
				display: flex;
				flex-flow: column nowrap;
				justify-content: space-around;
				align-items: center;
			}

			.fieldBtn_digitPad {
				grid-area: 1 / 10 / 6 / 13;
			}

			.fieldBtn_basicOperators {
				grid-area: 5 / 7 / 7 / 10;
			}

			.fieldBtn_nav {
				grid-area: 6 / 10 / 7 / 13;
				align-self: center;
				justify-content: center;
			}
		}
	}
</style>
