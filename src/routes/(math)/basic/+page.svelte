<script>
	/**
	 * страница арифметического калькулятора src/routes/(math)/basic/+page.svelte
	 */

	import BtnBlockDigit from '$lib/components/Btn/BtnBlockBase/BtnBlockDigit.svelte';
	import BtnBlockOp from '$lib/components/Btn/BtnBlockBase/BtnBlockOp.svelte';

	import DisText from '$lib/components/Display/DisText.svelte';
</script>

<div class="app-wrapper">
	<aside class="field_left">
		<a href="/">catalog</a>
	</aside>
	<main class="field_calculator basic">
		<div class="field_displayPad">
			<DisText />
		</div>
		<div class="fieldBtn_page">
			<div class="fieldBtn_memory">
				<button class="btn btn__func">M1</button>
				<button class="btn btn__func">M2</button>
				<button class="btn btn__func">M3</button>
				<button class="btn btn__func">M4</button>
			</div>
			<div class="fieldBtn_basic">
				<button class="btn btn__interface">learn more</button>
				<button class="btn btn__interface">see all features</button>
				<button class="btn btn__interface">share</button>
				<button class="btn btn__interface">install app now</button>
			</div>
		</div>
		<div class="fieldBtn_digitPad">
			<BtnBlockDigit />
		</div>
		<div class="fieldBtn_basicOperators">
			<BtnBlockOp />
		</div>
		<div class="fieldBtn_nav">
			<div class="rowBtn">
				<button class="btn btn__interface">C</button>
				<button class="btn btn__interface">i</button>
				<button class="btn btn__interface">H</button>
				<button class="btn btn__interface">S</button>
			</div>
		</div>
	</main>
	<article class="instruction">
		<!-- текстовые блоки  и иллюстрации -->
	</article>
	<section class="history__old">
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
	.field_calculator {
		// По умолчанию вертикальный (12 строк, 6 колонок)
		display: grid;
		grid-template-columns: repeat(6, calc(50vh / 6));
		grid-template-rows: repeat(12, calc(100vh / 12));
		grid-column-gap: 0px;
		grid-row-gap: 0px;

		// Распределение областей (Grid Areas)
		.field_displayPad {
			// === -📝=TODO=📝- ===
			outline: 2px dotted coral;
			grid-area: 1 / 1 / 7 / 7;
		}

		.fieldBtn_page {
			// === -📝=TODO=📝- ===
			outline: 2px dotted coral;
			grid-area: 7 / 1 / 11 / 4;
		}

		.fieldBtn_digitPad {
			// === -📝=TODO=📝- ===
			outline: 2px dotted coral;
			grid-area: 7 / 4 / 12 / 7;
		}

		.fieldBtn_basicOperators {
			grid-area: 11 / 1 / 13 / 4;
		}

		.fieldBtn_nav {
			// === -📝=TODO=📝- ===
			outline: 2px dotted coral;
			grid-area: 12 / 4 / 13 / 7;
		}

		// --- МОБИЛЬНЫЙ LANDSCAPE (6 строк, 12 колонок) ---
		@media (max-height: 500px) and (orientation: landscape) {
			grid-template-rows: repeat(6, 1fr);
			grid-template-columns: repeat(12, 1fr);
			// Здесь можно переопределить grid-row/grid-column для горизонтального вида
		}
	}
</style>
