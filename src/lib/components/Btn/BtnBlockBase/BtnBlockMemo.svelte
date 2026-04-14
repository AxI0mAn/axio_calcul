<script>
	/**
* src/lib/components/Btn/BtnBlockBase/BtnBlockMemo.svelte

*/
	import BtnText from '../BtnText.svelte';

	import { btnMemo } from '$lib/utils/btnMemo';
	import { createClickManager } from '$lib/utils/clickManager.js';

	import { appState } from '$lib/store/appState.svelte';

	// Создаем изолированные обработчики для каждой кнопки
	const handleM1 = createClickManager(
		() => btnMemo('M1'), // Обычный клик
		() => btnMemo('M1', true) // Двойной клик
	);

	const handleM2 = createClickManager(
		() => btnMemo('M2'),
		() => btnMemo('M2', true)
	);

	const handleM3 = createClickManager(
		() => btnMemo('M3'),
		() => btnMemo('M3', true)
	);

	const handleM4 = createClickManager(
		() => btnMemo('M4'),
		() => btnMemo('M4', true)
	);
</script>

<div class="row">
	<BtnText
		buttonText="M1"
		customClass="btn btn__op btn__memo {appState.M1 ? 'btn__memo--full' : ''}"
		onclick={handleM1}
	/>
	<BtnText
		buttonText="M2"
		customClass="btn btn__op btn__memo {appState.M2 ? 'btn__memo--full' : ''}"
		onclick={handleM2}
	/>
	<BtnText
		buttonText="M3"
		customClass="btn btn__op  btn__memo {appState.M3 ? 'btn__memo--full' : ''}"
		onclick={handleM3}
	/>
	<BtnText
		buttonText="M4"
		customClass="btn btn__op  btn__memo {appState.M4 ? 'btn__memo--full' : ''}"
		onclick={handleM4}
	/>
</div>

<style lang="scss">
	.row {
		padding: 8px;
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		grid-template-rows: 1fr;
		gap: 4px;
		height: 100%;
	}
</style>
