<script>
	/**
* btnBlockOpFraction.svelte

*/
	import BtnText from '../BtnText.svelte';
	import {
		denominator,
		addSqrt,
		toPower,
		toPower2,
		addE,
		addPi
	} from '$lib/services/math/basic.js';
	import { addSqrtY } from '$lib/services/math/basic.js';
	import { addSqrt2 } from '$lib/services/math/engineer';
	import { addOperator } from '$lib/services/calculatorActions.svelte.js';
</script>

<div class="digBlock">
	<div class="row">
		<BtnText customClass="op btn__func constanta" onclick={() => addOperator('≡')} buttonText="≡" />
		<BtnText
			customClass="op btn__func constanta"
			onclick={() => addOperator(':.')}
			buttonText=":."
		/>
		<BtnText
			customClass="op btn__func constanta"
			onclick={() => addOperator('.:')}
			buttonText=".:"
		/>
	</div>
	<div class="row">
		<BtnText customClass="op btn__func constanta" onclick={() => addOperator('(')} buttonText="(" />
		<BtnText customClass="op btn__func constanta" onclick={() => addOperator('÷')} buttonText="÷" />
		<BtnText customClass="op btn__func constanta" onclick={() => addOperator(')')} buttonText=")" />
	</div>
	<div class="row">
		<BtnText customClass="op btn__func constanta" onclick={() => addPi()} buttonText="π" />
		<BtnText customClass="op btn__func constanta" onclick={() => addE()} buttonText="e" />
		<BtnText customClass="op btn__func constanta" onclick={() => addSqrt2()} buttonText="√2" />
	</div>
	<div class="row">
		<BtnText customClass="op btn__func" onclick={() => toPower()} buttonText="x^y" />
		<BtnText customClass="op btn__func" onclick={() => toPower2()} buttonText="x^2" />
		<BtnText customClass="op btn__func" onclick={() => addSqrt()} buttonText="&Sqrt;x" />
		<BtnText customClass="op btn__func" onclick={() => denominator()} buttonText="1/x" />
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
