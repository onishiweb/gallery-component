class oGallery {
	constructor(element) {
		this.gallery = element;
		this.galleryContent = this.gallery.querySelector('.o-gallery__content');
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
		this.wrapper.style.height = this.maxHeight + 'px';

		content.parentNode.insertBefore(this.wrapper, content);

		this.wrapper.appendChild(content);
	}

	initView() {
		this.wrapSlides();

		const viewBoxes = (this.totalItems / this.visible);

		if( viewBoxes > 1 ) {
			this.addControls();

			this.galleryContent.classList.add('o-gallery__content--active');
			this.galleryContent.style.width = (viewBoxes * 100) + '%';

			for (let slide of this.slides) {
				slide.style.float = 'left';
				slide.style.width = (100 / viewBoxes) + '%';
			}
		}
	}

	addControls() {

	}
}


const galleryElement = document.querySelector('[o-gallery]');
const gallery = new oGallery(galleryElement);
