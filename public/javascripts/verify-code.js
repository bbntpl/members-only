document.addEventListener('DOMContentLoaded', () => {
	const verificationForm = document.getElementById('verification-form');

	async function submitVerificationForm() {
		const code = document.getElementById('code').value;
		console.log(`Code after submitting form: ${code}`);
		try {
			const response = await fetch('/public-posts/verify-passcode', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ code }),
			});

			const result = await response.json();

			if (response.status === 200 && result.message === 'Passcode sent to email') {
				const submitButton = document.getElementById('verify-membership-btn');
				submitButton.classList.add('bg-opacity-50', 'cursor-not-allowed', 'hover:bg-accent');;
				submitButton.disabled = true;
				setTimeout(() => {
					location.reload();
				}, 1500)
			} else if (response.status === 400) {
				const errorContainer = document.getElementById('verification-errors');

				// clear existing errors
				errorContainer.textContent = '';

				// create and append error messages
				result.errors.forEach((error) => {
					const errorMessage = document.createElement('p');
					errorMessage.textContent = error.msg;
					errorMessage.classList.add('mb-2'); // Add some margin between messages
					errorContainer.appendChild(errorMessage);
				});
			} else {
				// handle other error messages
				console.log(`Error: ${result.message}`);
			}
		} catch (error) {
			// handle network error
			console.log(`Network Error: ${error.message}`);
		}
	}

	if (verificationForm) {
		verificationForm.addEventListener('submit', (e) => {
			e.preventDefault();
			submitVerificationForm();
		});
	}
});