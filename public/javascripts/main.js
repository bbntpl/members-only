document.addEventListener('DOMContentLoaded', () => {
	const signInBtn = document.getElementById('sign-in-btn');
	const signUpBtn = document.getElementById('sign-up-btn');
	const accessBtn = document.getElementById('access-btn');
	const logoutBtn = document.getElementById('logout-btn');
	const stickyWrapper = document.getElementById('sticky-wrapper');
	const createPostBtn = document.getElementById('create-post-btn');

	if (signInBtn) {
		signInBtn.addEventListener('click', () => {
			window.location.href = '/login';
		});
	}

	if (signUpBtn) {
		signUpBtn.addEventListener('click', () => {
			window.location.href = '/register';
		});
	}

	if (accessBtn) {
		accessBtn.addEventListener('click', () => {
			window.location.href = '/public-posts';
		});
	}

	if (logoutBtn) {
		logoutBtn.addEventListener('click', () => {
			window.location.href = '/logout';
		});
	}

	if (createPostBtn) {
		const createPostForm = document.getElementById('create-post-form');

		createPostBtn.addEventListener('click', () => {
			createPostForm.classList.toggle('hidden');
		});
	}

	if (stickyWrapper) {
		const stickyObserver = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (!entry.isIntersecting) {
						stickyWrapper.classList.add('sticky');
					} else {
						stickyWrapper.classList.remove('sticky');
					}
				});
			},
			{ threshold: 0 }
		);

		stickyObserver.observe(document.querySelector('#sticky-anchor'));
	}
});