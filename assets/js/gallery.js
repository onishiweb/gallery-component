class oGallery {
	constructor(element) {
		this.gallery = element;
		this.galleryContent = this.gallery.querySelector('.o-gallery__content');
		this.slides = this.gallery.querySelectorAll('.o-gallery__slide');

		this.totalItems = this.slides.length;
		this.visible = this.gallery.getAttribute('data-o-gallery-visible') || 1;
		this.currentPos = 0;

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
		this.wrapper = document.createElement('div');
		this.wrapper.className = 'o-gallery__wrapper';
		this.wrapper.style.height = this.maxHeight + 'px';

		this.galleryContent.parentNode.insertBefore(this.wrapper, this.galleryContent);

		this.wrapper.appendChild(this.galleryContent);
	}

	initView() {
		this.wrapSlides();

		const viewBoxes = (this.totalItems / this.visible);

		if( viewBoxes > 1 ) {
			this.addControls();

			this.galleryContent.classList.add('o-gallery__content--active');
			this.galleryContent.style.width = (viewBoxes * 100) + '%';
			this.galleryContent.style.left = 0;

			for (let slide of this.slides) {
				slide.style.float = 'left';
				slide.style.width = (100 / viewBoxes) + '%';
			}
		}
	}

	addControls() {
		this.controlLeft = document.createElement('button');
		this.controlLeft.className = 'o-gallery__control o-gallery__control--left';

		this.controlRight = document.createElement('button');
		this.controlRight.className = 'o-gallery__control o-gallery__control--right';

		this.wrapper.appendChild(this.controlLeft);
		this.wrapper.appendChild(this.controlRight);

		this.controlRight.addEventListener('click', evt => this.scrollRight(evt));
		this.controlLeft.addEventListener('click', evt => this.scrollLeft(evt));
	}

	updateScrollPos() {
		this.galleryContent.style.left = (this.currentPos * -100) + '%';
	}

	scrollLeft() {
		if (this.currentPos > 0) {
			this.currentPos = this.currentPos - 1;
			this.updateScrollPos();
		}
	}

	scrollRight() {
		if (this.currentPos < (this.totalItems - 1)) {
			this.currentPos = this.currentPos + 1;
			this.updateScrollPos();
		}
	}
}


const galleryElement = document.querySelector('[o-gallery]');
const gallery = new oGallery(galleryElement);
