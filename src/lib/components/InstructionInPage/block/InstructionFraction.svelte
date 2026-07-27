<script>
	import FineFraction from '../element/FineFraction.svelte';
</script>

<h1>InstructionFraction</h1>
<h2 style="color:red">
	в зависимости от appState.setMode подставляем один из svelte:head компонентов из папки
	src/lib/components/Instruction/block
</h2>
<p>
	Выражение <FineFraction expr="3⥑4÷(5-2)⥏" /> интерпритируется, как
	<strong>Смешанная дробь:</strong>
	<FineFraction whole="3" num="4" den="(5-2)" />
	= 3 + <FineFraction num="4" den="(5-2)" />, где между целой и дробной частью знак сложения. Просто
	дробь <FineFraction expr="4÷5" />
</p>
