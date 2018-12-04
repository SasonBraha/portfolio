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
    }
    imgEl.src = image.getAttribute('data-src');
  });
}