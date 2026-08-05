<script>
	import BtnBack from '$lib/components/Btn/BtnBack.svelte';

	// Твои ключи, полученные в панели EmailJS
	const SERVICE_ID = 'service_t7nkwgd';
	const TEMPLATE_ID = 'template_d8d4uaj';
	const PUBLIC_KEY = 'u5SQ2j6gVISX-zXMS';

	// Состояние формы через руны Svelte 5
	let userName = $state('');
	let userEmail = $state('');
	let message = $state('');

	let isSending = $state(false);
	let statusMessage = $state('');
	let statusType = $state(''); // 'success' или 'error'

	// Функция проверки валидности email без сторонних библиотек
	function isValidEmail(email) {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	}

	// Вычисляемое состояние валидности всей формы
	let isFormValid = $derived(
		userName.trim().length >= 2 && isValidEmail(userEmail.trim()) && message.trim().length >= 5
	);

	/**
	 * Обработчик отправки формы
	 * @param {SubmitEvent} e
	 */
	async function sendEmail(e) {
		e.preventDefault();

		if (!isFormValid) return;

		isSending = true;
		statusMessage = 'Sending...';
		statusType = '';

		// Структура данных, которую требует API EmailJS
		const payload = {
			service_id: SERVICE_ID,
			template_id: TEMPLATE_ID,
			user_id: PUBLIC_KEY,
			template_params: {
				user_name: userName,
				user_email: userEmail,
				message: message
			}
		};

		try {
			const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload)
			});

			if (response.ok) {
				statusMessage = 'Message sent successfully!';
				statusType = 'success';
				// Очищаем форму
				userName = '';
				userEmail = '';
				message = '';
			} else {
				throw new Error('Error server EmailJS');
			}
		} catch (err) {
			console.error(err);
			statusMessage = 'Failed to send the message. Please try again later.';
			statusType = 'error';
		} finally {
			isSending = false;
		}
	}
</script>

<svelte:head>
	<meta name="robots" content="index,follow" />
	<title>amoca contact us</title>
</svelte:head>

<header class="header">
	<BtnBack />
	<h1 class="headerSlogan">contact us</h1>
</header>

<div class="contact-page">
	<form onsubmit={sendEmail} class="feedback-form">
		<div class="form-group">
			<label class="label" for="name">Your Name *</label>
			<input
				type="text"
				id="name"
				bind:value={userName}
				required
				placeholder="Your name"
				class="custom-input"
			/>
			{#if userName.length > 0 && userName.trim().length < 2}
				<span class="error-hint">Name must be at least 2 characters long.</span>
			{/if}
		</div>

		<div class="form-group">
			<label class="label" for="email">Your Email Address *</label>
			<input
				type="email"
				id="email"
				bind:value={userEmail}
				required
				placeholder="example@mail.com"
				class="custom-input"
			/>
			{#if userEmail.length > 0 && !isValidEmail(userEmail.trim())}
				<span class="error-hint">Please enter a valid email address.</span>
			{/if}
		</div>

		<div class="form-group">
			<label class="label" for="msg">Message (minimum 5 characters) *</label>
			<textarea
				id="msg"
				bind:value={message}
				required
				minlength="5"
				rows="5"
				placeholder="Enter your message..."
				class="custom-textarea"
			></textarea>
			{#if message.length > 0 && message.trim().length < 5}
				<span class="error-hint">Message must be at least 5 characters long.</span>
			{/if}
		</div>

		<button type="submit" class="btn-submit" disabled={!isFormValid || isSending}>
			{isSending ? 'Sending...' : 'Send'}
		</button>

		{#if statusMessage}
			<p class="status-info {statusType}" role="status">
				{statusMessage}
			</p>
		{/if}
	</form>
</div>

<style lang="scss">
	.contact-page {
		color: $clr-sky;
		padding: 20px;
		font-family: sans-serif;
		min-height: 100vh;
	}

	.header {
		display: flex;
		flex-flow: row wrap;
		justify-content: flex-start;
		align-items: center;
		padding: 2rem;
		gap: 2rem;

		.headerSlogan {
			color: $clr-coral;
			font-size: 3rem;
			display: inline-block;
			margin: 0;
		}
	}

	.feedback-form {
		margin: 0 auto;
		max-width: 50vmin;
		display: flex;
		flex-direction: column;
		gap: 20px;
	}

	.form-group {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.label {
		color: $clr-slate;
		font-size: 0.85rem;
		text-transform: uppercase;
	}

	.custom-input,
	.custom-textarea {
		width: 100%;
		background: $clr-blue-mid;
		color: $clr-text-main;
		border: 1px solid $clr-blue-hover;
		padding: 10px;
		border-radius: 6px;
		outline: none;
		font-family: inherit;
		box-sizing: border-box;

		&:focus {
			border-color: $clr-sky;
			box-shadow: 0 0 10px rgba($clr-sky-rgb, 0.3);
		}
	}

	.custom-textarea {
		resize: vertical;
	}

	.error-hint {
		color: $clr-coral;
		font-size: 0.75rem;
		margin-top: -5px;
	}

	.btn-submit {
		display: block;
		width: 100%;
		padding: 12px 20px;
		background: linear-gradient(180deg, $clr-blue-mid 0%, $clr-bg-darker 100%);
		border: 1px solid $clr-blue-hover;
		border-radius: 6px;
		color: $clr-text-main;
		cursor: pointer;
		text-align: center;
		font-weight: bold;
		transition: 0.2s;
		opacity: 1;

		&:disabled {
			opacity: 0.3;
			cursor: not-allowed;
			box-shadow: none;
		}

		&:not(:disabled):hover {
			border-color: $clr-sky;
			box-shadow: inset 0 0 10px rgba($clr-sky-rgb, 0.5);
			color: $clr-sky;
		}
	}

	.status-info {
		text-align: center;
		padding: 10px;
		border-radius: 6px;
		font-size: 0.9rem;

		&.success {
			color: $clr-mint;
			background: rgba($clr-mint-rgb, 0.1);
			border: 1px solid $clr-mint;
		}

		&.error {
			color: $clr-coral;
			background: rgba($clr-coral-rgb, 0.1);
			border: 1px solid $clr-coral;
		}
	}

	@media (max-height: 500px) and (orientation: landscape),
		(max-width: 500px) and (orientation: portrait) {
		.headerSlogan {
			font-size: 2rem;
		}
		.feedback-form {
			max-width: 100%;
		}
	}
</style>
