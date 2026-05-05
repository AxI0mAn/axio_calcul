<script>
	/**
* BtnBlockOpTrigon.svelte

*/
	import BtnText from '../BtnText.svelte';
	import {
		sinFunc,
		sinhFunc,
		asinFunc,
		asinhFunc,
		cosFunc,
		coshFunc,
		acosFunc,
		acoshFunc,
		tanFunc,
		tanhFunc,
		atanFunc,
		atanhFunc,
		cotFunc,
		cothFunc,
		acotFunc,
		acothFunc
	} from '$lib/services/math/trigon.js';
</script>

<div class="digBlock">
	<div class="row">
		<BtnText customClass="op btn__trig active" onclick={() => trigCheck()} buttonText="deg" />
		<BtnText customClass="op btn__trig" onclick={() => trigCheck()} buttonText="rad" />
		<BtnText customClass="op btn__trig" onclick={() => trigCheck()} buttonText="grad" />
	</div>
	<div class="row">
		<BtnText customClass="op btn__func" onclick={() => sinFunc()} buttonText="sin" />
		<BtnText customClass="op btn__func" onclick={() => sinhFunc()} buttonText="sinh" />
		<BtnText customClass="op btn__func" onclick={() => asinFunc()} buttonText="asin" />
		<BtnText customClass="op btn__func" onclick={() => asinhFunc()} buttonText="asinh" />
	</div>
	<div class="row">
		<BtnText customClass="op btn__func" onclick={() => cosFunc()} buttonText="cos" />
		<BtnText customClass="op btn__func" onclick={() => coshFunc()} buttonText="cosh" />
		<BtnText customClass="op btn__func" onclick={() => acosFunc()} buttonText="acos" />
		<BtnText customClass="op btn__func" onclick={() => acoshFunc()} buttonText="acosh" />
	</div>
	<div class="row">
		<BtnText customClass="op btn__func" onclick={() => tanFunc()} buttonText="tan" />
		<BtnText customClass="op btn__func" onclick={() => tanhFunc()} buttonText="tanh" />
		<BtnText customClass="op btn__func" onclick={() => atanFunc()} buttonText="atan" />
		<BtnText customClass="op btn__func" onclick={() => atanhFunc()} buttonText="atanh" />
	</div>
	<div class="row">
		<BtnText customClass="op btn__func" onclick={() => cotFunc()} buttonText="cot" />
		<BtnText customClass="op btn__func" onclick={() => cothFunc()} buttonText="coth" />
		<BtnText customClass="op btn__func" onclick={() => acotFunc()} buttonText="acot" />
		<BtnText customClass="op btn__func" onclick={() => acothFunc()} buttonText="acoth" />
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
