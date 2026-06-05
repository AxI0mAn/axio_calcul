<script>
	/**
* src/lib/components/Btn/BtnBlockMath/BtnBlockFraction/BtnBlockOpFraction.svelte

*/
	import BtnText from '../../BtnText.svelte';
	import { addE, addPi } from '$lib/services/math/opBtnBasic.js';
	import { addSqrt2 } from '$lib/services/math/opBtnEngineer';
	import { addOperator } from '$lib/services/math/mathActions.js';
	import {
		addBracketFraction,
		addOperatorFraction,
		fractionToPower2,
		decimalToFraction,
		fractionToDecimal
	} from '$lib/services/math/fractionActions.js';
</script>

<div class="digBlock">
	<div class="row">
		<BtnText customClass="op btn__func constanta" onclick={fractionToDecimal} buttonText=":." />
		<BtnText customClass="op btn__func constanta" onclick={decimalToFraction} buttonText=".:" />
	</div>
	<div class="row">
		<BtnText
			customClass="op btn__func constanta"
			onclick={() => addBracketFraction('(')}
			buttonText="("
		/>
		<BtnText
			customClass="op-style btn__op "
			onclick={() => addOperatorFraction('÷')}
			buttonText="÷"
		/>
		<BtnText
			customClass="op btn__func constanta"
			onclick={() => addBracketFraction(')')}
			buttonText=")"
		/>
	</div>
	<div class="row">
		<BtnText customClass="op btn__func constanta" onclick={() => addPi()} buttonText="π" />
		<BtnText customClass="op btn__func constanta" onclick={() => addE()} buttonText="e" />
		<BtnText customClass="op btn__func constanta" onclick={() => addSqrt2()} buttonText="√2" />
	</div>
	<div class="row">
		<BtnText
			customClass="op btn__func"
			onclick={() => {
				addOperatorFraction('√');
				addBracketFraction('(');
			}}
			buttonText="√x"
		/>
		<BtnText customClass="op btn__func" onclick={() => addOperatorFraction('^')} buttonText="xʸ" />
		<BtnText customClass="op btn__func" onclick={() => fractionToPower2()} buttonText="x²" />
	</div>
</div>

<style lang="scss">
	.digBlock {
		padding: 8px;
		border: 1px solid transparent;
		border-top-left-radius: 8px;
		background-color: transparent;
		// height: 100%;
		display: grid;
		grid-template-columns: 1fr;
		grid-template-rows: repeat(auto, 1fr);
		gap: 8px;
		.row {
			display: flex;
			flex-flow: row wrap;
			width: 100%;
			height: 100%;
			gap: 4px;
		}

		@media screen and (max-width: 480px) and (orientation: portrait),
			screen and (max-height: 480px) and (orientation: landscape) {
			gap: 4px;
			.row {
				gap: 4px;
			}
		}
	}
</style>
