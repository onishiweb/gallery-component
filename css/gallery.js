class oGallery {
	constructor(element) {
		this.gallery = element;

		this.slides = this.gallery.querySelectorAll('.o-gallery__slide');

		this.totalItems = this.slides.length;
		this.visible = this.gallery.getAttribute('data-o-gallery-visible') || 1;

		this.maxWidth = this.slides[0].offsetWidth;
		this.maxHeight = 0;

		Promise.all(this.imagesReady()).then( values => {
			this.maxHeight = Math.max(...values);
			this.initView();
		});
	}

	imagesReady() {
		let maxHeight = 0;
		let images = [];

		for (let slide of this.slides) {
			const loadedPromise = new Promise((resolve, reject) => {
						const img = slide.querySelector('.o-gallery__image');

						img.onload = function() {
							resolve(slide.offsetHeight);
						}
					});

			images.push(loadedPromise);
		}

		return images;
	}

	wrapSlides() {
		const content = this.gallery.querySelector('.o-gallery__content');

		this.wrapper = document.createElement('div');
		this.wrapper.className = 'o-gallery__wrapper';

		content.parentNode.insertBefore(this.wrapper, content);

		this.wrapper.appendChild(content);
	}

	initView() {
		this.wrapSlides();

		console.log('width', this.maxWidth);
		console.log('max height', this.maxHeight);
	}
}


const galleryElement = document.querySelector('[o-gallery]');
const gallery = new oGallery(galleryElement);
