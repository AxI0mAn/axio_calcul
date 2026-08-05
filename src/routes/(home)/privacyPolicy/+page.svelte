<script>
	import BtnBack from '$lib/components/Btn/BtnBack.svelte';

	// кнопка ВВЕРХ
	import { createScrollTopButton } from '$lib/utils/createScrollTopButton';

	$effect(() => {
		// Запускаем создание и сохраняем функцию удаления
		const destroyButton = createScrollTopButton('top-anchor');

		// Эта часть сработает, когда пользователь уйдет с этой страницы
		return () => {
			destroyButton();
		};
	});
</script>

<svelte:head>
	<meta name="robots" content="index,follow" />
	<title>amoca Privacy Policy</title>
</svelte:head>

<header class="header" id="top-anchor">
	<BtnBack />
	<h1 class="headerSlogan">Privacy Policy</h1>
	<h2 class="headerDate"><strong>Last updated:</strong> July 22, 2026</h2>
</header>

<main class="homeTextPage PriPol">
	<section class="card">
		<h2>1. Introduction Welcome to our Progressive</h2>
		<p>
			Web App ("Application"). Your privacy is important to us. This Privacy Policy explains what
			information the Application uses, how it is processed, and what choices you have regarding
			your data. The Application is designed to operate primarily on your device. It does not
			require registration, user accounts, or sign-in. By using the Application, you agree to the
			practices described in this Privacy Policy.
		</p>
	</section>

	<!--  -->

	<section class="card">
		<h2>2. Information Stored on Your Device</h2>
		<p>
			The Application stores certain information locally in your browser to provide its
			functionality and preserve your preferences between sessions. Depending on the features you
			use, this may include: * application settings and preferences; * recently entered values; *
			calculation history; * favorites or bookmarks; * custom user data created within the
			Application; * other information required for the normal operation of the Application. This
			information is stored using your browser's **localStorage**. All locally stored information
			remains on your device and is not transmitted to us. You may remove this data at any time by
			clearing your browser's site data or uninstalling the Application.
		</p>
	</section>

	<!--  -->

	<section class="card">
		<h2>3. Personal Information</h2>
		<p>
			The Application does not require you to create an account. The Application does not collect
			personal information during normal use. You can use all primary features without providing
			your name, email address, phone number, or any other personal information.
		</p>
	</section>

	<!--  -->

	<section class="card">
		<h2>4. Contact Form</h2>
		<p>
			The Application includes an optional contact form that allows you to send us questions,
			feedback, or bug reports. When you contact us, you may provide: * your email address; * the
			content of your message. Your email address is used **solely for responding to your inquiry**.
			We do not use your email address for: * marketing communications; * newsletters; *
			advertising; * user profiling. We do not sell or share your email address with third parties.
		</p>
	</section>

	<!--  -->

	<section class="card">
		<h2>5. Anonymous Analytics</h2>
		<p>
			To understand how the Application is used and to improve its quality, we may use
			privacy-friendly analytics services such as **Umami Analytics** or **PostHog** or analog.
			These services may collect anonymous and aggregated technical information, including: * page
			or screen views; * application version; * browser type; * operating system; * approximate
			country or region; * basic performance metrics; * general usage statistics. Analytics are used
			exclusively to: * understand how many people use the Application; * identify technical issues;
			* improve usability and performance. We do not intentionally use analytics to identify
			individual users or build personal user profiles. Analytics data is not used for advertising,
			behavioral tracking, or selling personal information.
		</p>
	</section>

	<!--  -->

	<section class="card">
		<h2>6. Cookies and Browser Storage</h2>
		<p>
			The Application does not use cookies for advertising or cross-site tracking. The Application
			may use browser storage technologies, including **localStorage**, solely to preserve your
			settings and application data between sessions.
		</p>
	</section>

	<!--  -->

	<section class="card">
		<h2>7. Offline Functionality</h2>
		<p>
			The Application is designed to work partially or completely offline. To improve performance
			and enable offline functionality, the Application may cache application resources on your
			device using standard browser technologies such as **Service Workers** and the **Cache Storage
			API**. These cached resources are used only to operate the Application and do not contain your
			personal information.
		</p>
	</section>

	<!--  -->

	<section class="card">
		<h2>8. Internet Connection</h2>
		<p>
			An internet connection may be required for: * downloading application updates; * loading
			static application resources; * sending messages through the contact form; * collecting
			anonymous analytics data, if analytics are enabled. Except for information you voluntarily
			submit through the contact form and anonymous analytics described above, the Application does
			not transmit your locally stored data.
		</p>
	</section>

	<!--  -->

	<section class="card">
		<h2>9. Sharing of Information</h2>
		<p>
			We do not sell, rent, or trade your personal information. We do not disclose your personal
			information to third parties except where necessary to: * process messages that you
			voluntarily send through the contact form; * provide anonymous analytics through our analytics
			provider.
		</p>
	</section>

	<!--  -->

	<section class="card">
		<h2>10. Data Security</h2>
		<p>
			Because the Application stores its data locally on your device, you remain in control of that
			information. Although we take reasonable measures to protect communications and the services
			we use, no method of electronic transmission or storage can be guaranteed to be completely
			secure.
		</p>
	</section>

	<!--  -->

	<section class="card">
		<h2>11. Children's Privacy</h2>
		<p>
			The Application is intended for a general audience. We do not knowingly collect personal
			information from children.
		</p>
	</section>

	<!--  -->

	<section class="card">
		<h2>12. Third-Party Services</h2>
		<p>
			The Application may use the following third-party services: * Umami Analytics; * PostHog.
			These services are used only for anonymous usage statistics and application improvement.
		</p>
	</section>

	<!--  -->

	<section class="card">
		<h2>13. Changes to This Privacy Policy</h2>
		<p>
			We may update this Privacy Policy from time to time. Any changes will be reflected by updating
			the "Last updated" date shown at the top of this document. We encourage you to review this
			Privacy Policy periodically.
		</p>
	</section>

	<!--  -->

	<section class="card">
		<h2>14. Your Rights</h2>
		<p>
			Depending on your location and applicable laws, you may have rights regarding your personal
			information. Because the Application stores most information locally on your own device, you
			can generally exercise control over your data by clearing your browser's site storage or
			uninstalling the Application. If you contact us by email and wish us to delete your
			correspondence, you may request this at any time. --- ## 15. Contact If you have any questions
			about this Privacy Policy or the Application, you may contact us using the contact form
			available within the Application.
		</p>
	</section>
</main>

<style lang="scss">
	// src/styles/_homePages.scss
	.PriPol {
		color: $clr-mint-soft;
	}
	.card {
		background: $clr-bg-darker;

		&:hover {
			box-shadow: $shadow-neon-coral;
		}
	}
</style>
