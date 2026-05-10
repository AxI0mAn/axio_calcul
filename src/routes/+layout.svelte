<script>
	// src/routes/+layout.svelte
	import '../styles/app.scss';
	import '../styles/_modal.scss';

	import favicon from '$lib/assets/favicon.png';

	// ===========  Для плавного появления модалки с ячейками памяти
	import { fade } from 'svelte/transition';

	import { appState } from '$lib/store/appState.svelte';
	import BtnBlockMemo from '$lib/components/Btn/BtnBlockBase/BtnBlockMemo.svelte';

	let { children } = $props();

	export const prerender = true;
	export const trailingSlash = 'always';

	// ===========  установка приложения
	import { appStore } from '$lib/store/appStore.svelte';
	import { initPwaLogic } from '$lib/utils/initPwaLogic';

	// Этот код сработает ОДИН РАЗ при инициализации приложения
	$effect(() => {
		// Нам не нужно вешать слушатели на каждой странице. т.к. Окно (window) у нас одно на весь сеанс.
		if (!appStore.installed) {
			console.log('Проверяем возможность установки приложения src/routes/+layout.svelte');
			initPwaLogic();
		}
	});

	// =========== настраиваем глобальный «слушатель» для мобильных устройств. Применяется для работы historyStore
	import { onMount } from 'svelte';
	/**
	 * Настраиваем отслеживание состояния видимости страницы.
	 * Это самый надежный способ сохранить данные на мобильных устройствах.
	 */
	onMount(() => {
		const handleVisibilityChange = () => {
			// Когда пользователь сворачивает браузер, переключает вкладку
			// или закрывает приложение — состояние становится 'hidden'.
			if (document.visibilityState === 'hidden') {
				appState.saveAllActiveSessions();
			}
		};

		document.addEventListener('visibilitychange', handleVisibilityChange);

		// Чистим за собой при уничтожении макета
		return () => {
			document.removeEventListener('visibilitychange', handleVisibilityChange);
		};
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>axio_cl</title>
</svelte:head>

{@render children()}

<!--  модалка, которая откроется при наведении и удержании на строке истории, если все ячейки памяти заняты  -->
{#if appState.isMemoModalOpen}
	<div class="modal-backdrop" transition:fade={{ duration: 150 }}>
		<div class="modal-content">
			<h3>Select slot to overwrite</h3>

			<div class="modal-grid">
				<BtnBlockMemo />
			</div>

			<div class="modal-actions">
				<button class="btn btn__op btn__clear-all" onclick={() => appState.clearAllMemory()}>
					CLEAR ALL
				</button>

				<button class="btn btn__cancel" onclick={() => (appState.isMemoModalOpen = false)}>
					Cancel
				</button>
			</div>
		</div>
	</div>
{/if}
