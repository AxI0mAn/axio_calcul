<script>
	/**
	 * шаблон страница математического калькулятора
	 */

	let { buttons, ads, nowMode = 'amoca' } = $props();

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

	// appState.now_mode = `${nowMode}`;
	appState.setMode(`${nowMode}`);

	// обрабатываем ввод с клавиатуры ПК - только для desktop

	import { onMount } from 'svelte';
	import { handleCalculatorKey } from '$lib/utils/keyboardHandler.js';
	import {
		addDigit,
		addOperator,
		performCalculation
	} from '$lib/services/calculatorActions.svelte';
	import { addDecimal, backspace, clear } from '$lib/services/base';
	import { percentage, toPower, bigFactorial } from '$lib/services/math/basic';

	// поддержка ввода с клавиатуры на ПК
	onMount(() => {
		// 1. Проверка на десктоп
		if (window.matchMedia('(pointer: coarse)').matches) return;

		// 2. Создаем замыкание обработчика
		const onKeyDown = (e) =>
			handleCalculatorKey(e, {
				addDigit,
				addOperator,
				addDecimal,
				backspace,
				clear,
				performCalculation,
				percentage,
				toPower,
				bigFactorial
			});

		window.addEventListener('keydown', onKeyDown);
		return () => window.removeEventListener('keydown', onKeyDown);
	});
</script>

<div class="app-wrapper">
	<aside class="field_left"></aside>
	<main class="field_main basic">
		<div class="field_displayPad">
			<DisText />
		</div>
		<div class="fieldBtn_page withScroll">
			<div class="fieldBtn_basic">
				{@render buttons()}
			</div>
		</div>
		<div class="fieldBtn_memory">
			<BtnBlockMemo />
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
		<div class="advertisementLine">
			{@render ads()}
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

	.field_main.basic {
		// По умолчанию вертикальный (12 строк, 6 колонок)
		display: grid;
		grid-template-columns: repeat(6, calc(50vh / 6));
		grid-template-rows: repeat(12, calc(100vh / 12));
		grid-column-gap: 0px;
		grid-row-gap: 0px;

		// Распределение областей (Grid Areas)
		.field_displayPad {
			grid-area: 1 / 1 / 6 / 7;
		}

		.fieldBtn_page {
			grid-area: 6 / 1 / 9 / 4;
			display: flex;
			flex-flow: row nowrap;
			justify-content: flex-start;
			align-items: center;
			overflow-x: scroll;
		}

		.fieldBtn_memory {
			grid-area: 9 / 1 / 10 / 4;
		}

		.fieldBtn_digitPad {
			grid-area: 6 / 4 / 11 / 7;
		}

		.fieldBtn_basicOperators {
			grid-area: 10 / 1 / 12 / 4;
		}

		.fieldBtn_nav {
			grid-area: 11 / 4 / 12 / 7;
			align-self: center;
			justify-content: center;
		}

		.advertisementLine {
			grid-area: 12 / 1 / 13 / 7;

			overflow: hidden;
			position: relative; // База для абсолютных потомков
		}
	}
	// --- РЕЖИМ:  TABLET PORTRAIT ---
	@media (max-width: 1023px) and (orientation: portrait), (max-width: 767px) {
		.field_main.basic {
			grid-template-columns: repeat(6, minmax(1fr, calc(100vw / 6)));
			grid-template-rows: repeat(12, calc(100vh / 12));
			margin: 0 auto;
		}
	}

	// --- РЕЖИМ: MOBILE  PORTRAIT ---
	@media (orientation: portrait) and (max-width: 432px) {
		.field_main.basic {
			grid-template-columns: repeat(6, calc(100vw / 6));
			grid-template-rows: repeat(12, calc(100vh / 12));
			margin: 0 auto;
		}
	}

	// --- МОБИЛЬНЫЙ LANDSCAPE (6 строк, 12 колонок) ---
	@media (max-height: 500px) and (orientation: landscape) {
		.field_main.basic {
			grid-template-columns: repeat(12, calc(100vw / 12));
			grid-template-rows: repeat(6, calc(100vh / 6));
			width: 100%;
			// Распределение областей (Grid Areas)
			.field_displayPad {
				grid-area: 1 / 1 / 7 / 7;
			}

			.fieldBtn_page {
				grid-area: 1 / 7 / 4 / 10;
				display: flex;
				flex-flow: column nowrap;
				justify-content: space-evenly;
				align-items: flex-start;
			}

			.fieldBtn_memory {
				grid-area: 4 / 7 / 5 / 10;
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
