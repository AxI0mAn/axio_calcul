<script>
	import '../styles/app.scss';

	import favicon from '$lib/assets/favicon.png';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>axio_cl</title>
</svelte:head>

{@render children()}
