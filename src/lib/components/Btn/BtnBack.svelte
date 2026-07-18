<script>
	// @ts-nocheck

	import { goto } from '$app/navigation'; // Импортируем нормально наверх

	let { customClass = '' } = $props();

	/**
	 * @param {MouseEvent} e
	 */
	function goBack(e) {
		e.preventDefault();

		if (typeof window !== 'undefined' && window.history.length > 1) {
			window.history.back();
		} else {
			// Больше никаких промисов, просто вызываем goto
			goto('/');
		}
	}
</script>

<button type="button" class="btn-back {customClass}" onclick={goBack} aria-label="Назад">
	<!-- Здесь может быть твоя иконка стрелочки -->
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="currentColor"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
	>
		<line x1="19" y1="12" x2="5" y2="12"></line>
		<polyline points="12 19 5 12 12 5"></polyline>
	</svg>
</button>

<style lang="scss">
	/* Базовые аскетичные стили, которые не ломают общую верстку */
	.btn-back {
		min-width: 40px;
		min-height: 40px;
		background-color: #0284c7;
		border: none;
		border-radius: 50%; // Идеальный крyг
		cursor: pointer;

		display: flex;
		align-items: center;
		justify-content: center;

		transition:
			opacity 0.3s,
			transform 0.3s,
			visibility 0.3s;
		opacity: 1;
		z-index: 1000;
		box-shadow:
			0 4px 12px rgba(100, 116, 139, 0.4),
			inset 0 2px 4px rgba(255, 255, 255, 0.3);
		svg {
			fill: $clr-white;
			stroke: $clr-white;
		}
		&:hover {
			background-color: transparent;

			transition:
				opacity 0.3s,
				transform 0.3s,
				visibility 0.3s;
			svg {
				stroke: $clr-coral;
				fill: transparent;
			}
		}
	}
</style>
