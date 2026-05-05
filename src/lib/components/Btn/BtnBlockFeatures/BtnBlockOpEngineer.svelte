<script>
	/**
* btnBlockOpBasic.svelte

*/
	import BtnText from '../BtnText.svelte';
	import {
		modul,
		denominator,
		addSqrt,
		bigFactorial,
		percentage,
		toPower,
		toPower2,
		tenPowerX,
		roundUp,
		addE,
		addPi
	} from '$lib/services/math/basic.js';
	import {
		toPower3,
		ePowerX,
		addGold,
		addSqrt2,
		addLN10,
		addLN2,
		funcLogYX,
		funcLgX,
		funcLnX,
		funcLog2X,
		funcRandom,
		multipliers,
		allDivisors
	} from '$lib/services/math/engineer.js';
	import { addSqrtY } from '$lib/services/math/basic.js';
	import { addOperator } from '$lib/services/calculatorActions.svelte.js';
</script>

<div class="digBlock">
	<div class="opBlock">
		<div class="row">
			<BtnText customClass="op btn__func constanta" onclick={() => addPi()} buttonText="π" />
			<BtnText customClass="op btn__func constanta" onclick={() => addE()} buttonText="e" />
			<BtnText customClass="op btn__func constanta" onclick={() => addGold()} buttonText="ф" />
		</div>
		<div class="row">
			<BtnText customClass="op btn__func constanta" onclick={() => addSqrt2()} buttonText="√2" />
			<BtnText customClass="op btn__func constanta" onclick={() => addLN10()} buttonText="ln10" />
			<BtnText customClass="op btn__func constanta" onclick={() => addLN2()} buttonText="ln2" />
		</div>
		<div class="row">
			<BtnText
				customClass="op btn__func constanta"
				onclick={() => addOperator('(')}
				buttonText="("
			/>
			<BtnText
				customClass="op btn__func constanta"
				onclick={() => addOperator(')')}
				buttonText=")"
			/>
		</div>
		<div class="row">
			<BtnText
				customClass="op btn__func constanta"
				onclick={() => funcRandom()}
				buttonText="RAND"
			/>
			<BtnText customClass="op btn__func" onclick={() => percentage()} buttonText="%" />
		</div>
	</div>
	<div class="opBlock">
		<div class="row">
			<BtnText customClass="op btn__func" onclick={() => bigFactorial()} buttonText="x!" />
			<BtnText customClass="op btn__func" onclick={() => modul()} buttonText="|x|" />
			<BtnText customClass="op btn__func" onclick={() => roundUp()} buttonText="x,y" />
		</div>
		<div class="row">
			<BtnText customClass="op btn__func" onclick={() => toPower2()} buttonText="x^2" />
			<BtnText customClass="op btn__func" onclick={() => toPower3()} buttonText="x^3" />
			<BtnText customClass="op btn__func" onclick={() => ePowerX()} buttonText="e^x" />
		</div>
		<div class="row">
			<BtnText customClass="op btn__func" onclick={() => toPower()} buttonText="x^y" />
			<BtnText customClass="op btn__func" onclick={() => tenPowerX()} buttonText="*10^y" />
		</div>
		<div class="row">
			<BtnText customClass="op btn__func" onclick={() => addSqrtY()} buttonText="y&Sqrt;x" />
			<BtnText customClass="op btn__func" onclick={() => addSqrt()} buttonText="&Sqrt;x" />
			<BtnText customClass="op btn__func" onclick={() => denominator()} buttonText="1/x" />
		</div>
	</div>
	<div class="opBlock">
		<div class="row">
			<BtnText customClass="op btn__func" onclick={() => funcLogYX()} buttonText="logY(x)" />
			<BtnText customClass="op btn__func" onclick={() => funcLgX()} buttonText="lg(x)" />
		</div>
		<div class="row">
			<BtnText customClass="op btn__func" onclick={() => funcLnX()} buttonText="ln(x)" />
			<BtnText customClass="op btn__func" onclick={() => funcLog2X()} buttonText="log2(x)" />
		</div>
		<div class="row">
			<BtnText customClass="op btn__func" onclick={() => multipliers()} buttonText="A*B" />
			<BtnText customClass="op btn__func" onclick={() => allDivisors()} buttonText="X*Y" />
		</div>
	</div>
</div>

<style lang="scss">
	.digBlock {
		min-width: 0;
		width: 200%;
		display: flex;
		flex-flow: row nowrap;
		justify-content: flex-start;
		align-items: flex-start;
		gap: 0px;
	}
	.opBlock {
		padding: 4px;
		border: 1px solid transparent;
		border-top-left-radius: 8px;
		background-color: transparent;
		// height: 100%;
		min-width: 40%;
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
