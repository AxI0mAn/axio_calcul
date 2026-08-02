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

<header class="header" id="top-anchor">
	<BtnBack />
	<h1 class="headerSlogan">disclaimer</h1>
	<h2 class="headerDate"><strong>Last updated:</strong> July 22, 2026</h2>
	<p></p>
</header>

<main class="homeTextPage disclaimer">
	<section class="card">
		<h2>1. General Information</h2>
		<p>
			The calculators, converters, generators, and other tools available in this Application
			("Application") are provided for general informational, educational, and convenience purposes
			only. While we make reasonable efforts to ensure that the formulas, algorithms, conversion
			factors, and calculation methods are accurate and up to date, we do not guarantee that every
			result will be complete, accurate, current, error-free, or suitable for your specific purpose.
			All tools and results are provided <strong>"as is"</strong> and
			<strong>"as available"</strong>, without warranties of any kind, whether express or implied.
		</p>
	</section>

	<!--  -->

	<section class="card">
		<h2>2. User Responsibility</h2>
		<p>
			You are solely responsible for: <strong> verifying all input values; </strong> selecting
			appropriate calculation parameters; <strong> interpreting calculation results; </strong> determining
			whether a particular calculator or converter is suitable for your intended use. Before relying on
			any result, you should independently verify both the input data and the calculated output using
			reliable sources whenever accuracy is important.
		</p>
	</section>

	<!--  -->

	<section class="card">
		<h2>3. Accuracy of Calculations</h2>
		<p>
			Many tools perform calculations exclusively on the basis of the values entered by the user.
			Incorrect, incomplete, outdated, or inappropriate input data will naturally produce incorrect
			results. The Application cannot determine whether the information provided by the user is
			correct or appropriate. The correctness of any result depends on the correctness of the
			information supplied by the user.
		</p>
	</section>

	<!--  -->

	<section class="card">
		<h2>4. Precision and Rounding</h2>
		<p>
			The Application allows users to configure numerical precision and rounding behavior through
			its settings. Depending on the selected precision, displayed values may differ slightly due to
			rounding or numerical representation. For calculations where high precision is required, users
			are responsible for selecting an appropriate precision level and verifying that the displayed
			results are suitable for their intended purpose.
		</p>
	</section>

	<!--  -->

	<section class="card">
		<h2>5. Estimates and Approximations</h2>
		<p>
			Some calculators may provide estimates or simplified mathematical models rather than exact
			real-world results. Actual outcomes may vary due to factors not considered by the calculation,
			including assumptions, tolerances, environmental conditions, contractual terms, local
			regulations, or other variables. Unless explicitly stated otherwise, calculation results
			should be regarded as estimates.
		</p>
	</section>

	<!--  -->

	<section class="card">
		<h2>6. Reference Data</h2>
		<p>
			Certain tools may rely on publicly available formulas, coefficients, conversion factors,
			constants, standards, or other reference information. Although we strive to keep such
			information reasonably current, standards, regulations, laws, tax rules, engineering
			practices, scientific knowledge, and other reference data may change over time. Users are
			responsible for confirming that any reference data used is appropriate and up to date for
			their particular situation.
		</p>
	</section>

	<!--  -->

	<section class="card">
		<h2>7. Converters</h2>
		<p>
			Unit converters perform mathematical conversions between measurement units. A successful
			conversion does not imply compliance with any legal, technical, engineering, medical,
			scientific, or industry-specific requirements. Users remain responsible for determining
			whether converted values satisfy the standards applicable to their use.
		</p>
	</section>

	<!--  -->

	<section class="card">
		<h2>8. Business and Financial</h2>
		<p>
			Calculations Business, accounting, tax, budgeting, pricing, financial, and commercial
			calculators are intended to assist with calculations only. They do not constitute financial,
			accounting, investment, legal, or tax advice. Actual results may differ because of
			legislation, taxation rules, accounting standards, contractual conditions, market
			fluctuations, exchange rates, fees, rounding rules, or other circumstances.
		</p>
	</section>

	<!--  -->

	<section class="card">
		<h2>9. No Professional</h2>
		<p>
			Advice Nothing contained in the Application constitutes professional advice of any kind. The
			Application is not a substitute for consultation with qualified professionals, including but
			not limited to:
		</p>
		<ul>
			<li>lawyers;</li>
			<li>accountants;</li>
			<li>financial advisors;</li>
			<li>tax professionals;</li>
			<li>engineers;</li>

			<li>architects;</li>
			<li>medical professionals;</li>
			<li>safety specialists.</li>
		</ul>
		<p>
			Where professional judgment is required, appropriate professional advice should always be
			obtained.
		</p>
	</section>

	<!--  -->

	<section class="card">
		<h2>10. Critical Decisions</h2>
		<p>The Application should not be relied upon as the sole basis for decisions involving:</p>
		<ul>
			<li>health or medical treatment;</li>
			<li>public or personal safety;</li>
			<li>engineering or construction;</li>
			<li>legal matters;</li>

			<li>financial investments;</li>
			<li>taxation;</li>
			<li>business operations;</li>
			<li>regulatory compliance;</li>
			<li>education, examinations, or certification;</li>
			<li>
				any activity where an incorrect calculation could result in injury, loss of life, legal
				liability, or significant financial loss.
			</li>
		</ul>
		<p>
			Important decisions should always be supported by independent verification and, where
			appropriate, professional advice.
		</p>
	</section>

	<!--  -->

	<section class="card">
		<h2>11. Limitation of Liability</h2>
		<p>
			To the fullest extent permitted by applicable law, we shall not be liable for any direct,
			indirect, incidental, consequential, exemplary, special, or punitive damages arising out of or
			related to:
		</p>
		<ul>
			<li>the use of the Application;</li>
			<li>inability to use the Application;</li>
			<li>incorrect calculations;</li>
			<li>inaccurate conversions;</li>
			<li>incorrect user input;</li>
			<li>software defects;</li>
			<li>outdated reference information;</li>
			<li>interrupted availability;</li>
			<li>data loss;</li>
			<li>business interruption;</li>
			<li>financial loss;</li>
			<li>loss of profits;</li>
		</ul>
		<p>
			decisions made based on information provided by the Application. Users assume full
			responsibility for the use of any calculation, conversion, estimate, or other result produced
			by the Application.
		</p>
	</section>

	<!--  -->

	<section class="card">
		<h2>12. Availability and Updates</h2>
		<p>
			The Application and its tools may be modified, updated, improved, replaced, or removed at any
			time without prior notice. Calculation methods, formulas, coefficients, reference values,
			available features, and user interfaces may change as the Application evolves.
		</p>
	</section>

	<!--  -->

	<section class="card">
		<h2>13. Acceptance of This Disclaimer</h2>
		<p>
			By using the Application, you acknowledge that you have read and understood this Disclaimer.
			You agree that you are solely responsible for verifying all inputs, outputs, assumptions, and
			calculation results before relying on them for any personal, educational, professional,
			commercial, financial, legal, engineering, medical, or other purpose.
		</p>
	</section>
</main>

<style lang="scss">
	// src/styles/_homePages.scss
	.disclaimer {
		color: $clr-mint-soft;
	}
	.card {
		background: $clr-bg-darker;

		&:hover {
			box-shadow: $shadow-neon-coral;
		}
	}
</style>
