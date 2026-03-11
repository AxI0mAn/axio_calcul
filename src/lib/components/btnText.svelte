<script>
	let { buttonText = '?', onclick, customClass = '' } = $props();
</script>

<button class="space-btn {customClass}" {onclick}>
	{buttonText}
</button>

<style lang="scss">
	// --- SCSS Переменные ---
	$main-color: rgb(182, 217, 255); // Цвет текста
	$bg-color: #0f172a; // Фоновый цвет
	$border-color: rgba(120, 180, 255, 0.8); // Цвет основной рамки
	$shadow-color-light: rgba(100, 170, 255, 0.8); // Цвет тени (яркий)
	$shadow-color-dark: rgba(100, 170, 255, 0.5); // Цвет тени (тусклый)

	// --- Hover Переменные ---
	$hover-color-dark: rgb(52, 78, 102);
	$hover-shadow-color-light: rgba(140, 200, 255, 1);
	$hover-shadow-color-dark: #0f172a;
	$hover-shift: -2px;

	// --- Active Переменные ---
	$hover-color-light: rgb(182, 217, 255);
	$active-scale: 0.96;
	$active-shadow-color-light: rgba(100, 170, 255, 0.7);
	$active-shadow-color-dark: rgba(100, 170, 255, 0.5);

	.space-btn {
		display: flex;
		justify-content: center;
		align-items: center;
		// Базовые стили
		padding: 12px 24px;
		font-size: 18px;
		color: $main-color;
		font-family: Arial, sans-serif;
		cursor: pointer;
		transition: 0.25s ease;

		// Фон
		background-color: $bg-color;
		/* Если нужно использовать фоновое изображение: */
		/* background-image: url("./bg_button2.png"); */
		background-size: cover;
		background-position: center;

		// Рамка и углы
		border: 2px solid $border-color;
		border-radius: 18px;

		// Основная тень (Glow Effect)
		box-shadow:
			0 0 1px $shadow-color-light,
			0 0 2px $shadow-color-dark;

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
			background-color: $hover-color-light;
			// filter: blur(1rem);
			transform: scale($active-scale);
			box-shadow:
				0 0 2px $active-shadow-color-light,
				0 0 8px $active-shadow-color-dark;
		}
	}
</style>
