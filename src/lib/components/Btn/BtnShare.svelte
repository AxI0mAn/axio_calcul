<script>
	import Share from '$lib/assets/svgIcon/share.svg?raw';
	// Принимаем кастомные классы и кастомный текст для шеринга
	let { customClass = '', shareTitle = 'Check out this page' } = $props();

	// Локальное состояние для отображения тултипа "Ссылка скопирована"
	let showTooltip = $state(false);
	let timeoutId;

	/**
	 * Основной обработчик клика по кнопке
	 * @param {MouseEvent} e
	 */
	async function handleShare(e) {
		e.preventDefault();

		// Защита: на сервере (SSR) ничего не делаем
		if (typeof window === 'undefined') return;

		const shareData = {
			title: shareTitle,
			url: window.location.href // Берём текущий URL из адресной строки
		};

		// 1. Проверяем, поддерживает ли устройство нативный мобильный шеринг
		if (navigator.share && navigator.canShare?.(shareData)) {
			try {
				await navigator.share(shareData);
			} catch (err) {
				// Если пользователь сам отменил шеринг (закрыл шторку),
				// ловим ошибку AbortError, чтобы билд и консоль не спамили ошибками
				if (err.name !== 'AbortError') {
					console.error('Error share:', err);
				}
			}
		} else {
			// 2. Фолбек для десктопов: копируем ссылку в буфер обмена
			try {
				await navigator.clipboard.writeText(shareData.url);

				// Включаем тултип с сообщением
				showTooltip = true;

				// Сбрасываем старый таймер, если пользователь кликнул несколько раз
				clearTimeout(timeoutId);

				// Прячем уведомление через 2.5 секунды
				timeoutId = setTimeout(() => {
					showTooltip = false;
				}, 2500);
			} catch (err) {
				console.error('Failed to copy the page link:', err);
			}
		}
	}
</script>

<button
	type="button"
	class="btn-share {customClass}"
	onclick={handleShare}
	aria-label="Share this page"
>
	{@html Share}
</button>

<!-- Всплывающее уведомление для десктопов -->
{#if showTooltip}
	<div class="share-tooltip" role="status">Page link copied to clipboard.</div>
{/if}

<style lang="scss">
	.btn-share {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0rem;
		cursor: pointer;
		padding: 0.2rem;
		font-family: inherit;

		background: none;
		border: none;
		color: $clr-bg-card;
		box-shadow: none;

		&:hover {
			color: $clr-text-main;
		}
		&:active {
			background-color: transparent;
		}
	}

	/* Стили всплывающей подсказки */
	.share-tooltip {
		position: absolute;
		bottom: 5%;
		right: 5%;
		transform: translateX(-50%);
		background-color: $clr-text-main;
		color: inherit;
		padding: 0.5rem 0.75rem;
		border-radius: 4px;
		font-size: 0.85rem;
		white-space: nowrap;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
		z-index: 10;
		animation: fadeIn 0.2s ease;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translate(-50%, 5px);
		}
		to {
			opacity: 1;
			transform: translate(-50%, 0);
		}
	}

	.btn__interface {
		color: $clr-coral;

		&:hover {
			color: $clr-mint;
		}
		&:active {
			background-color: transparent; // Сохраняем твою логику прозрачности
		}
	}
</style>
