<script>
	/**
	 * src/lib/components/Btn/BtnBlockMath/CornerSwitchTrigon.svelte
	 * строка кнопок с переключателем едениц вычисления 'deg', 'rad', 'grad', 'П' и '1/x'
	 * */
	import BtnText from '$lib/components/Btn/BtnText.svelte';
	import { appState } from '$lib/store/appState.svelte';
	import { addPi } from '$lib/services/math/opBtnBasic';
	import { denominator } from '$lib/services/math/opBtnBasic';

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
	<div class="rowConst">
		<BtnText
			customClass="op btn__func constanta trigMode trigModeConst"
			onclick={() => addPi()}
			buttonText="π"
		/>
		<BtnText
			customClass="op btn__func trigMode trigModeConst"
			onclick={() => denominator()}
			buttonText="1/x"
		/>
	</div>
</div>

<style lang="scss">
	.corner-switch {
		padding: 0.25rem;
		padding-left: 0.75rem;
		margin-bottom: 0.25rem;
		width: fit-content;
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

	.rowConst {
		display: flex;
		flex-flow: row nowrap;
		justify-content: space-around;
		padding: 0.25rem 0.5rem;
		gap: 0.5rem;
	}
</style>
