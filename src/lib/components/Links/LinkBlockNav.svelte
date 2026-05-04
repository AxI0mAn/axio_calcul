<script>
	// @ts-ignore
	import { base } from '$app/paths';
	import { handleScroll } from '$lib/utils/handleScroll';

	import Catalog from '$lib/assets/svgIcon/catalog.svg?raw';
	import History from '$lib/assets/svgIcon/history.svg?raw';
	import Info from '$lib/assets/svgIcon/info.svg?raw';
	import Settings from '$lib/assets/svgIcon/settings.svg?raw';
</script>

<div class="rowLinks">
	<a href="{base}/#catalogAllFeatures" class="btn btn__interface" aria-label="Catalog"
		>{@html Catalog}</a
	>

	<a
		href="#instruction"
		onclick={(e) => handleScroll(e, '.instruction')}
		class="btn btn__interface"
		aria-label="Info"
	>
		{@html Info}
	</a>

	<a href="/history" class="btn btn__interface" aria-label="History">{@html History}</a>

	<a href="/settings" class="btn btn__interface" aria-label="Settings">{@html Settings}</a>
</div>

<style lang="scss">
	// --- SCSS Переменные ---
	$main-color: rgb(1, 217, 195); // Цвет текста
	$bg-color: rgb(15, 23, 42); // Фоновый цвет
	$bg-gradient: linear-gradient(45deg, #02427e 0%, #000d37 50%, #02273e 100%);
	$bg-gradient__op: linear-gradient(45deg, #64748b 0%, #252c35 50%, #4b5768 100%);
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

	.rowLinks {
		padding: 8px;
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 4px;
	}

	.btn__interface {
		// Сброс стилей ссылки
		text-decoration: none;
		color: whitesmoke;

		// Центрирование контента
		display: flex;
		align-items: center;
		justify-content: center;

		// Оформление
		background-color: transparent;
		border-radius: 8px;
		border: 1px solid $main-color;

		aspect-ratio: 1 / 1;
		transition:
			transform 0.1s,
			background-color 0.2s;

		@media screen and (max-width: 480px) and (orientation: portrait),
			screen and (max-height: 480px) and (orientation: landscape),
			screen and (pointer: coarse) and (max-width: 1024px) {
			svg {
				transform: scale(50%);
			}
		}

		@media (hover: hover) and (pointer: fine) {
			&:hover {
				// background-color: $hover-color-light;
				transition: all 0.15s;
				color: $main-color; //$hover-shadow-color-dark;
			}
		}

		// --- Active ---
		&:active {
			// Убираем стандартную синюю/серую рамку при тапе
			-webkit-tap-highlight-color: transparent;
			// Для некоторых старых Android-браузеров может понадобиться:
			outline: none;

			opacity: 0.8;
			color: $hover-shadow-color-dark;
			background-color: $hover-color-dark;
			transform: scale($active-scale) translateY(calc(-1 * $hover-shift));
			box-shadow:
				0 0 2px $active-shadow-color-light,
				0 0 8px $active-shadow-color-dark;
		}
	}
</style>
