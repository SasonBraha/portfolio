const siteLoader = document.querySelector('.site-loader') as HTMLElement;
const content = document.querySelector('.content') as HTMLElement;
const loaderGroup = document.querySelector('.group') as HTMLElement;

window.onload = () => {
	// Animate { .site-loader } Closing
	requestAnimationFrame(() => {
		loaderGroup.style.opacity = '0';
		loaderGroup.addEventListener('transitionend', () => {
			siteLoader.classList.add('loaded');
			content.style.visibility = 'visible';
		});
	});

	// Lazy-Load Images
	const images = document.querySelectorAll<HTMLImageElement>('.lazy-load');
	images.forEach(image => {
		const imgEl = new Image();
		imgEl.onload = () => {
			image.src = image.getAttribute('data-src');
			image.style.filter = 'blur(0)';
		};
		imgEl.src = image.getAttribute('data-src');
	});

	console.log(
		`%cCheck out the source code: https://github.com/SasonBraha/Portfolio`,
		'font-size: 17px; font-weight: bold; color: #1976d2'
	);
	console.log(
		`%cCheck out my resume (Built with Node.js): https://github.com/SasonBraha/Resume`,
		'font-size: 17px; font-weight: bold; color: #1976d2'
	);
};
