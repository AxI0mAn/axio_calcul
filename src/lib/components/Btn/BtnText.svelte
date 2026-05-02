<script>
	// src/lib/components/Btn/BtnText.svelte
	let {
		buttonText = '',
		onclick,
		customClass = '',
		svgContent = '', // Для svg как ?raw
		Icon = null // Для svg как ?svelte
	} = $props();
</script>

<button class="btn font-digits {customClass}" {onclick}>
	{#if Icon}
		<Icon />
	{:else if svgContent}
		{@html svgContent}
	{/if}

	{#if buttonText}
		<span>{buttonText}</span>
	{/if}
</button>

<style lang="scss">
	// --- SCSS Переменные ---
	$main-color: rgb(1, 217, 195); // Цвет текста
	$bg-color: rgb(15, 23, 42); // Фоновый цвет
	$bg-gradient: linear-gradient(45deg, #02427e 0%, #000d37 50%, #02273e 100%);
	$bg-gradient__op: linear-gradient(45deg, #64748b 0%, #252c35 50%, #4b5768 100%);
	$bg-gradient__op--memo: linear-gradient(45deg, #64748b 0%, $main-color 50%, #4b5768 100%);
	$border-color: rgba(120, 180, 255, 0.8); // Цвет основной рамки
	$shadow-color-light: rgba(100, 170, 255, 0.8); // Цвет тени (яркий)
	$shadow-color-dark: rgba(100, 170, 255, 0.5); // Цвет тени (тусклый)

	// --- Hover Переменные ---
	$hover-color-dark: rgb(52, 78, 102);
	$hover-shadow-color-light: rgba(140, 200, 255, 1);
	$hover-shadow-color-dark: #0f172a;
	$hover-shift: -0.5px;

	// --- Active Переменные ---
	$hover-color-light: rgb(182, 217, 255);
	$active-scale: 0.96;
	$active-shadow-color-light: rgba(100, 170, 255, 0.7);
	$active-shadow-color-dark: $main-color;

	.btn {
		display: flex;
		justify-content: center;
		align-items: center;
		// Базовые стили
		padding: 4px 8px;
		font-size: 2rem;
		color: $main-color;
		cursor: pointer;
		transition: 0.25s ease;

		// Фон
		background-color: $bg-color;
		background: $bg-gradient;
		/* Если нужно использовать фоновое изображение: */
		/* background-image: url("./bg_button2.png"); */
		background-size: cover;
		background-position: center;

		// Рамка и углы
		border: 2px solid $bg-gradient;
		border-radius: 8px;

		// Основная тень (Glow Effect)
		box-shadow:
			1px 1px 4px 0px rgba(0, 13, 55, 0.5),
			inset 0px 0px 2px rgb(160, 196, 244);

		// --- РЕЖИМ: MOBILE  PORTRAIT ---
		@media (orientation: portrait) and (max-width: 432px) {
			padding: 8px;
			font-size: 1.5rem;
		}

		// --- Hover ---
		@media (hover: hover) and (pointer: fine) {
			&:hover {
				background-color: $hover-color-dark;
				box-shadow:
					0 0 4px $hover-shadow-color-light,
					0 0 8px $hover-shadow-color-dark;
				transform: translateY($hover-shift);
			}
		}
		// --- Active ---
		&:active {
			// Убираем стандартную синюю/серую рамку при тапе
			-webkit-tap-highlight-color: transparent;
			// Для некоторых старых Android-браузеров может понадобиться:
			outline: none;

			opacity: 0.8;
			background-color: $hover-color-light;
			transform: scale($active-scale) translateY(calc(-1 * $hover-shift));
			box-shadow:
				0 0 2px $active-shadow-color-light,
				0 0 8px $active-shadow-color-dark;
		}
	}

	.btn.btn__op {
		// символы не цифры основного комплекта кнопок
		background: $bg-gradient__op;
		color: whitesmoke;
		.backspace {
			aspect-ratio: 1/1;
		}
		.clear-btn {
			aspect-ratio: 2/1;
		}
		.equal-btn {
			height: 100%;
		}
	}

	.btn.btn__func {
		font-size: 1.5rem;
		color: whitesmoke;
		border: transparent;
		background: transparent;
		background-color: transparent;
	}

	.btn.constanta {
		color: $main-color;
	}

	.btn.btn__memo.btn__memo--full {
		background: $bg-gradient__op--memo;
		color: $hover-shadow-color-dark;
	}

	@media screen and (max-width: 480px) and (orientation: portrait),
		screen and (max-height: 480px) and (orientation: landscape),
		screen and (pointer: coarse) and (max-width: 1024px) {
		.btn.btn__func,
		.btn.btn__memo {
			font-size: 1.25rem;
			padding: 1vh 2vw; // 4px 6px;
		}
	}
</style>
