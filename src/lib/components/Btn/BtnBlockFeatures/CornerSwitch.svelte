<script>
	import BtnText from '$lib/components/Btn/BtnText.svelte';
	import { appState } from '$lib/store/appState.svelte';
	import { addPi } from '$lib/services/math/basic';
	import { denominator } from '$lib/services/math/basic';

	// Список доступных режимов
	const modes = ['deg', 'rad', 'grad'];

	/**
	 * Функция переключения режима
	 * @param {string} newMode
	 */
	function setMode(newMode) {
		appState.corner = newMode;
	}
</script>

<div class="corner-switch">
	{#each modes as mode}
		<BtnText
			buttonText={mode}
			onclick={() => setMode(mode)}
			customClass="trigMode {appState.corner === mode ? 'action' : ''}"
		/>
	{/each}
	<BtnText customClass="op btn__func constanta trigMode" onclick={() => addPi()} buttonText="π" />
	<BtnText customClass="op btn__func trigMode" onclick={() => denominator()} buttonText="1/x" />
</div>

<style lang="scss">
	.corner-switch {
		padding: 0.25rem;
		padding-left: 0.75rem;
		margin-bottom: 0.5rem;
		display: flex;
		flex-flow: row nowrap;
		justify-content: flex-start;
		align-items: center;
		gap: 8px;
		@media (orientation: portrait) and (max-height: 638px) {
			gap: 4px;
			padding-bottom: 0;
		}
	}
</style>
