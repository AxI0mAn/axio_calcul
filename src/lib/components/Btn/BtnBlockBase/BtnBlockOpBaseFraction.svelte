<script>
	/**
	 * src/lib/components/Btn/BtnBlockBase/BtnBlockOpBaseFraction.svelte
	 * Блок основных математических операций для калькулятора дробей
	 */
	import BtnText from '../BtnText.svelte';
	import { calculateFractionResult, enterFractionOperator } from '$lib/services/fractionActions';
</script>

<div class="operBlock">
	<div class="col">
		<BtnText customClass="op" onclick={() => enterFractionOperator('-')} buttonText="-" />
		<BtnText customClass="op" onclick={() => enterFractionOperator('+')} buttonText="+" />
		<BtnText customClass="op" onclick={() => enterFractionOperator('/')} buttonText="/" />
		<BtnText customClass="op" onclick={() => enterFractionOperator('*')} buttonText="*" />
	</div>
	<BtnText
		customClass="equal-btn btn__op"
		onclick={() => calculateFractionResult()}
		buttonText="="
	/>
</div>

<style lang="scss">
	.operBlock {
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
