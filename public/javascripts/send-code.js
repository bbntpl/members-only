document.addEventListener('DOMContentLoaded', () => {
	const openVerificationModalBtn = document.getElementById('open-verification-modal-btn');

	function openVerificationModal(e) {
		document.getElementById('verification-modal').style.display = 'flex';
		document.getElementById('modal-dialog').classList.remove('opacity-0', 'scale-90');
		const submitButton = e.target.querySelector('button[type="button"]');
		if (element.classList.contains('bg-gray-400')) {
			submitButton.classList.remove('bg-gray-400');
		}
	}

	async function sendPasscode(e) {
		try {
			const response = await fetch('/public-posts/send-passcode', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
			});

			if (!response.ok) {
				const result = await response.json();
				throw new Error(result.message);
			}
			return openVerificationModal();
		} catch (error) {
			console.log(`Error sending passcode: ${error.message}`);
		}
	}

	if (openVerificationModalBtn) {
		openVerificationModalBtn.addEventListener('click', (e) => {
			e.preventDefault();
			sendPasscode(e);
		});
	}
});
