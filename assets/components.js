

class ProductInfo extends HTMLElement {
  constructor() {
    super();
  }
}

if (!customElements.get('product-info')) {
  customElements.define('product-info', ProductInfo);
}

class ProductCard extends HTMLElement {
  constructor() {
    super();
  }
}

if (!customElements.get('product-card')) {
  customElements.define('product-card', ProductCard);
}

class VariantPicker extends HTMLElement {
  constructor() {
    super();
    this.addEventListener("click", this.#onChange.bind(this));
  }

  #onChange() {
    this.dispatchEvent(new CustomEvent('variant:change', {
      bubbles: true,
      cancelable: true,
      composed: true,
      detail: {}
    }));
  }
}

if (!customElements.get("variant-picker")) {
  customElements.define("variant-picker", VariantPicker);
}

class SlideShow extends HTMLElement {
  #slides;
  #interval;
  #currentIndex;
  #autoplay;
  #loop;
  #timer;
  static get observedAttributes() {
    return ['interval', 'autoplay', 'loop'];
  }
  constructor() {
    super();

    this.#currentIndex = 0
    this.#slides = []
    this.#timer = null
  }

  connectedCallback() {
    this.#collectSlides()
    this.#interval = this.getAttribute('interval') || 3000;
    this.#renderSlideshow()
    this.#bindEvents()

    if(this.#autoplay) {
      this.#startPlay()
    }
  }

  disconnectedCallback() {
    this.#stopPlay()
    this.#timer = null
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) {
      return;
    }

    switch (name) {
      case 'interval':
        this.#interval = parseInt(newValue, 10) || 3000 ;
        break
      case 'autoplay':
        this.#autoplay = newValue !== null && newValue !== 'false';
        break
      case 'loop':
        this.#loop = newValue !== null && newValue !== 'false';
        break
    }
  }

  #bindEvents() {
    const pagination = this.querySelector('.slideshow-pagination');
    pagination.addEventListener('click', this.#onDotClick.bind(this));
  }

  #collectSlides() {
    this.#slides = Array.from(this.querySelectorAll('.slide-item'));
  }

  #renderSlideshow() {
    const pagination = this.querySelector('.slideshow-pagination');
    if (pagination) {
      this.#slides.forEach((_, index) => {
        const dot = document.createElement('i');
        dot.classList.add('slideshow-pagination__item');
        dot.classList.toggle('active', index === this.#currentIndex);
        dot.setAttribute("data-index", index);
        pagination.appendChild(dot);
      })
    }
  }

  #onPrevClick(e) {
    e.preventDefault();
  }

  #onNextClick(e) {
    e.preventDefault();
  }

  #onDotClick(e) {
    e.preventDefault();
    const dataset = e.target.dataset
    if(dataset.hasOwnProperty("index")) {
      this.#jumpToSlide(dataset.index);
    }
  }

  #jumpToSlide(index) {
    const count = this.#slides.length;
    if (count === 0) {
      return;
    }

    if (index < 0) {
      index = this.#loop ? count - 1 : 0;
    } else if (index >= count) {
      index = 0;
    }

    if(index === this.#currentIndex) {
      return;
    }

    this.#currentIndex = index;
    this.#updateTrackPosition()
  }

  #prevSlide() {
    this.#jumpToSlide(this.#currentIndex - 1);
  }

  #nextSlide() {
    this.#jumpToSlide(this.#currentIndex + 1);
  }

  #startPlay() {
    this.#stopPlay()

    if(!this.#autoplay) return;
    if(this.#slides.length <= 0) return;

    this.#timer = setInterval(() => {
      this.#nextSlide();
    }, this.#interval)
  }
  #stopPlay() {
    if(this.#timer) {
      clearInterval(this.#timer);
      this.#timer = null;
    }
  }

  #resetAutoplayTimer() {
    if(this.#autoplay) return;

    this.#stopPlay()
    this.#startPlay();
  }

  #updateTrackPosition() {
    const wrapper = this.querySelector(".slide-wrapper");
    if(wrapper) {
      const offset = -100 * this.#currentIndex;
      wrapper.style.transform = `translateX(${offset}%)`;
    }

    const dots = this.querySelectorAll('.slideshow-pagination .slideshow-pagination__item');
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === this.#currentIndex);
    })
  }
}

if (!customElements.get('slide-show')) {
  customElements.define('slide-show', SlideShow);
}

class QuantityEditor extends HTMLElement {
  constructor() {
    super();
  }
}
if (!customElements.get('quantity-editor')) {
  customElements.define('quantity-editor', QuantityEditor);
}