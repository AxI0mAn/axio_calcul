<script>
	/**
* src/lib/components/Btn/BtnBlockMath/BtnBlockOpTrigon.svelte

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
	} from '$lib/services/math/opBtnTrigon.js';
</script>

<div class="digBlockT">
	<div class="row">
		<BtnText customClass="op btn__func trigonom" onclick={() => sinFunc()} buttonText="sin" />
		<BtnText customClass="op btn__func trigonom" onclick={() => sinhFunc()} buttonText="sinh" />
		<BtnText customClass="op btn__func trigonom" onclick={() => asinFunc()} buttonText="asin" />
		<BtnText customClass="op btn__func trigonom" onclick={() => asinhFunc()} buttonText="asinh" />
	</div>
	<div class="row">
		<BtnText customClass="op btn__func trigonom" onclick={() => cosFunc()} buttonText="cos" />
		<BtnText customClass="op btn__func trigonom" onclick={() => coshFunc()} buttonText="cosh" />
		<BtnText customClass="op btn__func trigonom" onclick={() => acosFunc()} buttonText="acos" />
		<BtnText customClass="op btn__func trigonom" onclick={() => acoshFunc()} buttonText="acosh" />
	</div>
	<div class="row">
		<BtnText customClass="op btn__func trigonom" onclick={() => tanFunc()} buttonText="tan" />
		<BtnText customClass="op btn__func trigonom" onclick={() => tanhFunc()} buttonText="tanh" />
		<BtnText customClass="op btn__func trigonom" onclick={() => atanFunc()} buttonText="atan" />
		<BtnText customClass="op btn__func trigonom" onclick={() => atanhFunc()} buttonText="atanh" />
	</div>
	<div class="row">
		<BtnText customClass="op btn__func trigonom" onclick={() => cotFunc()} buttonText="cot" />
		<BtnText customClass="op btn__func trigonom" onclick={() => cothFunc()} buttonText="coth" />
		<BtnText customClass="op btn__func trigonom" onclick={() => acotFunc()} buttonText="acot" />
		<BtnText customClass="op btn__func trigonom" onclick={() => acothFunc()} buttonText="acoth" />
	</div>
</div>

<style lang="scss">
	.digBlockT {
		padding-left: 0.75rem;
		padding-right: 0.75rem;
		min-width: 0;
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
			justify-content: center;
			align-items: center;
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
