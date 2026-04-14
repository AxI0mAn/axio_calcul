<script>
	// src/routes/+layout.svelte
	import '../styles/app.scss';
	import '../styles/_modal.scss';

	import { fade } from 'svelte/transition'; // Для плавного появления модалки с ячейками памяти

	import favicon from '$lib/assets/favicon.png';

	import { appState } from '$lib/store/appState.svelte';
	import BtnBlockMemo from '$lib/components/Btn/BtnBlockBase/BtnBlockMemo.svelte';

	let { children } = $props();

	export const prerender = true;
export const trailingSlash = 'always';
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
