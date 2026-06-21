<script>
	// src/lib/components/Btn/BtnBlockMath/BtnBlockFraction/BtnBlockBaseFraction.svelte

	import BtnText from '../../BtnText.svelte';
	import { addOperatorFraction, evaluateFraction } from '$lib/services/math/fractionActions.js';
</script>

<div class="operBlock">
	<div class="col">
		<BtnText customClass="op__btn" onclick={() => addOperatorFraction('+')} buttonText="+" />
		<BtnText customClass="op__btn" onclick={() => addOperatorFraction('-')} buttonText="-" />
		<BtnText customClass="op__btn" onclick={() => addOperatorFraction('*')} buttonText="×" />
		<BtnText customClass="op__btn" onclick={() => addOperatorFraction('/')} buttonText="/" />
	</div>
	<BtnText customClass="op__btn equal" onclick={evaluateFraction} buttonText="=" />
</div>

<style lang="scss">
	.operBlock {
		// width: 100%;
		height: 100%;
		display: grid;
		grid-template-columns: 2fr 1fr;
		grid-template-rows: 1fr;
		padding: 8px;
		border: 1px solid transparent;
		background: $clr-mint-soft;
		gap: 8px;
		.col {
			display: grid;
			grid-template-columns: repeat(2, 1fr);
			grid-template-rows: repeat(2, 1fr);
			gap: 8px;
			height: 100%;
		}
		@media screen and (max-width: 480px) and (orientation: portrait),
			screen and (max-height: 480px) and (orientation: landscape) {
			gap: 4px;
			.col {
				gap: 4px;
			}
		}
	}
</style>
