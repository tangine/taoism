

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
    console.log("slides", this.#slides)

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

  #collectSlides() {
    this.#slides = Array.from(this.querySelectorAll('.slide-item'));
  }

  #onPrevClick(e) {
    e.preventDefault();
  }

  #onNextClick(e) {
    e.preventDefault();
  }

  #onDotClick(e) {
    e.preventDefault();
  }

  #goToSlide(index) {
    const count = this.#slides.length;
    if (count === 0) {
      return;
    }

    if (index < 0) {
      index = this.#loop ? count - 1 : 0;
    } else {
      index = this.#loop ? 0 : count - 1;
    }

    if(index === this.#currentIndex) {
      return;
    }

    this.#currentIndex = index;
  }

  #prevSlide() {
    this.#goToSlide(this.#currentIndex - 1);
  }

  #nextSlide() {
    this.#goToSlide(this.#currentIndex + 1);
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