<script>
	import BtnBack from '$lib/components/Btn/BtnBack.svelte';
</script>

<svelte:head>
	<title>About – Calculator & Converter Collection | Math Tools PWA</title>

	<meta
		name="description"
		content="Learn about this growing collection of calculators, converters and mathematical tools. Fast calculations, shared workspace, offline support and privacy-first design."
	/>

	<meta name="robots" content="index,follow,max-image-preview:large" />

	<meta property="og:type" content="website" />

	<meta property="og:title" content="About amoca" />

	<meta
		property="og:description"
		content="A growing collection of calculators, converters and practical math tools with a unified interface, offline support and privacy-first design."
	/>

	<!-- 
	<link rel="canonical" href="https://example.com/about" />
	<meta property="og:image" content="https://example.com/images/about-share.png" />
	<meta property="og:url" content="https://example.com/about" />
	<meta name="twitter:image" content="https://example.com/images/about-share.png" />

	<meta name="twitter:card" content="summary_large_image" />
 -->

	<meta name="twitter:title" content="About the Calculator Collection" />

	<meta
		name="twitter:description"
		content="Fast calculators, converters and mathematical tools in one Progressive Web App."
	/>
</svelte:head>

<header class="header">
	<BtnBack />
	<h1 class="headerSlogan">about</h1>
</header>

<main class="homeTextPage about">
	<!-- Hero -->

	<section class="hero">
		<h2>One Familiar Interface</h2>

		<p class="lead">
			A growing collection of calculators, converters and practical mathematical tools designed for
			everyday life, education, engineering and business.
		</p>
	</section>

	<!-- Workspace -->

	<section class="card">
		<h2>One Workspace. Many Possibilities.</h2>

		<p>Most online calculators solve only one task at a time.</p>

		<p>This Application provides a unified calculation workspace.</p>

		<p>
			Compatible calculators share the same interface and can work together, allowing you to
			continue calculations without starting over.
		</p>
	</section>

	<!-- Connected -->

	<section class="card">
		<h2>Connected Calculators</h2>

		<ul>
			<li>Start with basic arithmetic.</li>

			<li>Continue with engineering functions.</li>

			<li>Switch to trigonometry.</li>

			<li>Work with fractions.</li>

			<li>Reuse previous calculations.</li>

			<li>Save important values into memory.</li>

			<li>Keep calculating without retyping expressions.</li>
		</ul>
	</section>

	<!-- History -->

	<section class="card">
		<h2>History & Memory</h2>

		<p>Your work doesn't disappear after pressing "=".</p>

		<p>Previous calculations remain available in the calculation history.</p>

		<p>
			Save frequently used values into one of four memory slots and reuse them whenever you need
			them.
		</p>
	</section>

	<!-- Features -->

	<section class="card">
		<h2>Current Features</h2>

		<ul>
			<li>Basic Calculator</li>

			<li>Engineering Calculator</li>

			<li>Trigonometry Calculator</li>

			<li>Fraction Calculator</li>

			<li>Percentage Calculator</li>
		</ul>
	</section>

	<!-- Future -->

	<section class="card">
		<h2>Growing Every Month</h2>

		<p>New calculators and utilities are continuously being added.</p>

		<ul>
			<li>Date & Time</li>

			<li>Finance</li>

			<li>Construction</li>

			<li>Geometry</li>

			<li>Electrical Engineering</li>

			<li>Unit Conversion</li>

			<li>Transportation</li>

			<li>Home Helpers</li>

			<li>...and many more.</li>
		</ul>
	</section>

	<!-- PWA -->

	<section class="card">
		<h2>Progressive Web App</h2>

		<p>Install the Application directly from your browser.</p>

		<p>Launch it from your Home Screen or Desktop.</p>

		<p>Many features continue working even without an Internet connection.</p>

		<p>Your settings and calculation history stay on your own device.</p>
	</section>

	<!-- Privacy -->

	<section class="card">
		<h2>Privacy First</h2>

		<p>No registration.</p>

		<p>No user accounts.</p>

		<p>Your calculations remain on your own device.</p>

		<p>Anonymous analytics may be used only to improve the Application.</p>
	</section>

	<!-- Audience -->

	<section class="card">
		<h2>Built for Everyone</h2>

		<p>
			Students, teachers, engineers, developers, architects, builders, business professionals, DIY
			enthusiasts, homeowners and anyone who works with numbers.
		</p>
	</section>

	<!-- Feedback -->

	<section class="card">
		<h2>Help Shape the Project</h2>

		<p>This is an actively growing project.</p>

		<p>
			Feature requests, calculator ideas and bug reports are always welcome through the built-in
			feedback form.
		</p>

		<p>Many new tools are inspired directly by user suggestions.</p>
	</section>
</main>

<style lang="scss">
	// src/styles/_homePages.scss

	// Hero

	.hero {
		text-align: center;

		padding: 1.5rem;

		line-height: 2.25rem;
		font-size: 1.75rem;
		letter-spacing: 0.25rem;

		// Lead

		.lead {
			padding-top: 1.5rem;
			text-align: justify;
			font-size: 1.5rem;

			color: $clr-mint-soft;

			@media screen and (max-width: 767px) {
				text-align: left;
			}
		}
	}
</style>
