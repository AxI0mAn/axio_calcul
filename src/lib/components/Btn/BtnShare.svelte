<script>
	// Принимаем кастомные классы и кастомный текст для шеринга
	let { customClass = '', shareTitle = 'Посмотрите эту страницу' } = $props();

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
					console.error('Ошибка шеринга:', err);
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
				console.error('Не удалось скопировать ссылку:', err);
			}
		}
	}
</script>

<div class="share-wrapper">
	<button
		type="button"
		class="btn-share {customClass}"
		onclick={handleShare}
		aria-label="Поделиться страницей"
	>
		<!-- Иконка шеринга (универсальный узел) -->
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="20"
			height="20"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
		>
			<circle cx="18" cy="5" r="3"></circle>
			<circle cx="6" cy="12" r="3"></circle>
			<circle cx="18" cy="19" r="3"></circle>
			<line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
			<line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
		</svg>
		<span>Поделиться</span>
	</button>

	<!-- Всплывающее уведомление для десктопов -->
	{#if showTooltip}
		<div class="share-tooltip" role="status">Ссылка на страницу сохранена в памяти</div>
	{/if}
</div>

<style>
	.share-wrapper {
		position: relative;
		display: inline-block;
	}

	.btn-share {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		background: none;
		border: none;
		cursor: pointer;
		padding: 0.5rem;
		font-family: inherit;
		color: inherit;
	}

	/* Стили всплывающей подсказки */
	.share-tooltip {
		position: absolute;
		bottom: 120%;
		left: 50%;
		transform: translateX(-50%);
		background-color: var(--tooltip-bg, #333);
		color: var(--tooltip-color, #fff);
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
</style>
