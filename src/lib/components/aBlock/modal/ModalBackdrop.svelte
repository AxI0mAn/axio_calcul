<script>
	import { fade } from 'svelte/transition';

	// Принимаем состояние открытия и кастомные классы/содержимое через пропсы Svelte 5
	let {
		isOpen = false,
		children,
		maxWidth = '500px' // Опционально для разной ширины окон
	} = $props();
</script>

{#if isOpen}
	<div class="modal-backdrop" transition:fade={{ duration: 150 }}>
		<div class="modal-content" style="max-width: {maxWidth};">
			{@render children?.()}
		</div>
	</div>
{/if}

<style lang="scss">
	.modal-backdrop {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		// Используем чистый черный с прозрачностью для максимального фокуса на окне
		background-color: rgba(0, 0, 0, 0.85);
		backdrop-filter: blur(4px);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 9999;
		padding: 1.25rem;
	}

	.modal-content {
		// Вместо #1a1a1a используем наш глубокий синий фон
		background-color: $clr-bg-card;

		// Добавляем мятную рамку для связи с дизайном калькулятора
		border: 1px solid rgba($clr-mint-rgb, 0.3);
		border-radius: 1rem;
		padding: 1.5rem;
		max-width: 50vh;
		width: 100%;

		// Используем готовую глубокую тень
		box-shadow: $shadow-deep;
		text-align: center;

		h3 {
			margin-bottom: 1.25rem;
			font-size: 1.1rem;
			// Используем чистый белый для заголовков
			color: $clr-text-main;
			font-weight: 400;
		}

		.modal-grid {
			width: 100%;
			display: flex;
			flex-flow: row;
			justify-content: space-around;
			align-items: center;
			margin-bottom: 1.25rem;
		}

		.modal-actions {
			display: flex;
			flex-direction: column;
			gap: 0.75rem;

			.btn__clear-all {
				// Опасное действие — используем коралловый акцент
				background-color: $clr-coral;
				color: $clr-text-main;
				border: none;
				padding: 0.75rem;
				border-radius: 0.5rem;
				transition: all 0.2s;

				&:hover {
					// Инверсия при наведении
					background-color: $clr-text-main;
					color: $clr-coral;
					box-shadow: $shadow-neon-coral;
				}
			}

			.btn__cancel {
				background: transparent;
				// Вместо #444 используем синий оттенок из палитры
				border: 1px solid $clr-blue-light;
				color: $clr-slate;
				margin-top: 0.25rem;
				padding: 0.75rem;
				border-radius: 0.5rem;
				transition: all 0.2s;

				&:hover {
					color: $clr-text-main;
					border-color: $clr-mint;
					background-color: rgba($clr-mint-rgb, 0.1);
				}
			}
		}
	}
</style>
