<script>
	/**
* src/lib/components/Btn/BtnBlockBase/BtnBlockNav.svelte

*/
	import BtnText from '../BtnText.svelte';
</script>

<div class="navBlock">
	<div class="row">
		<!-- <LinkGo
			customClass="nav"
			onclick={() => {
				addOperator('+');
			}}
			buttonText="+"
		/> -->
	</div>
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
		background: transparent;
		gap: 8px;
		.row {
			display: grid;
			grid-template-columns: 1fr;
			grid-template-rows: repeat(4, 1fr);
			gap: 8px;
			height: 100%;
		}
	}
</style>
