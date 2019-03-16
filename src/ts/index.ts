import '../scss/main.scss';
import './global.ts';
import './canvas.ts';
import {
	areClipPathShapesSupported,
	isBackgroundClipTextSupported,
	copyToClipboard
	//@ts-ignore
} from './utils.ts';

// Handle Contact Form Submission
const contactForm = document.forms['contact-form'];
const submitBtn = document.querySelector('.contact__submit-btn');
contactForm.onsubmit = e => {
	e.preventDefault();
	const formData = {
		fullName: contactForm['fullName'].value.trim(),
		email: contactForm['email'].value.trim(),
		message: contactForm['message'].value.trim()
	};

	// Clear Previous Errors (If Any)
	document
		.querySelectorAll('.contact__validation-error')
		.forEach(el => el.remove());
	document
		.querySelectorAll('.contact__contentEditable')
		.forEach(el => el.classList.remove('invalid'));

	// Show HTTP Loader
	const httpStatus = document.querySelector('.contact__http-status');
	httpStatus.classList.remove('success', 'error');
	httpStatus.classList.add('in-progress');

	// Disable Button
	submitBtn.classList.add('disabled');
	submitBtn.setAttribute('disabled', 'disabled');

	// Init Fetch
	const fetchUri =
		process.env.NODE_ENV === 'development'
			? 'http://localhost:3000'
			: 'https://personal-portfolio-inquiries.herokuapp.com/';
	fetch(fetchUri, {
		method: 'post',
		headers: {
			Accept: 'application/json',
			'Content-type': 'application/json'
		},
		body: JSON.stringify(formData)
	}).then(res => {
		// Check For Too Many Requests
		if (res.status === 429) {
			httpStatus.classList.remove('success');
			httpStatus.classList.add('error');

			// Activate Button
			submitBtn.classList.remove('disabled');
			submitBtn.removeAttribute('disabled');

			// Create Error Div
			const errorDiv = document.createElement('div');
			errorDiv.className = 'contact__validation-error u-center-text';
			errorDiv.innerText = 'Too many resubmissions, please try again later.';
			errorDiv.style.fontSize = '1.6rem';
			submitBtn.parentNode.insertBefore(errorDiv, submitBtn.nextSibling);

			return;
		}

		res.json().then(data => {
			const { success, errors } = data;
			if (!success) {
				// Show Error Status Icon
				httpStatus.classList.remove('success');
				httpStatus.classList.add('error');

				// Activate Button
				submitBtn.classList.remove('disabled');
				submitBtn.removeAttribute('disabled');

				// Handle Errors
				//@ts-ignore
				Object.entries(errors).map(([id, { message }]) => {
					// Select Invalid Input
					const invalidInput = document.getElementById(id) as HTMLInputElement;

					// Create Error Message
					const errorSpan = document.createElement('span') as HTMLElement;
					errorSpan.className = 'contact__validation-error';
					errorSpan.innerText = message;

					// Append Error Message
					invalidInput.parentNode.insertBefore(
						errorSpan,
						invalidInput.nextSibling
					);

					// Add { 'invalid' } Class To Invalid Input
					invalidInput.classList.add('invalid');
				});
			} else {
				// Show Success Status Icon
				httpStatus.classList.remove('error');
				httpStatus.classList.add('success');

				// Activate Button
				submitBtn.classList.remove('disabled');
				submitBtn.removeAttribute('disabled');

				// Remove Http Status Icon
				const hideHttpStatus = () => {
					clearTimeout(timeout);
					timeout = setTimeout(() => {
						httpStatus.classList.remove('success', 'error', 'in-progress');
						httpStatus.removeEventListener('transitionend', hideHttpStatus);
					}, 2500);
				};
				httpStatus.addEventListener('transitionend', hideHttpStatus);
				let timeout;

				// Reset Form
				e.target.reset();
			}
		});
	});
};

// Check For { clip-path: polygon } Support
const myProfleImage = document.querySelector('.about-me__image') as HTMLElement;
if (!areClipPathShapesSupported()) {
	myProfleImage.style.borderRadius = '50%';
}

// Check For { background-clip: text } Support
const allClippedTextElements = document.querySelectorAll<HTMLElement>(
	'.clip-text'
);
if (!isBackgroundClipTextSupported()) {
	allClippedTextElements.forEach(el => {
		el.style.color = 'black';
		el.style.background = 'transparent';
	});
}

// Copy Email To Clipboard
const toastEl = document.querySelector('.contact__with-toast') as HTMLElement;
const toastText = document.querySelector('.contact__toast') as HTMLElement;
const emailAddress = 'sasonbraha@gmail.com';
let timeout;
toastEl.onclick = () => {
	clearTimeout(timeout);
	copyToClipboard(emailAddress, () => {
		toastText.innerText = 'Email copied';
	});
	timeout = setTimeout(() => (toastText.innerText = emailAddress), 1000);
};

// Add Full Year To Footer
const fullYear = document.querySelector('.full-year') as HTMLElement;
fullYear.innerText = `${new Date().getFullYear()}`;
