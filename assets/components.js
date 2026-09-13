

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

class slide extends HTMLElement {
  #timer;
  #currentIndex;
  #slides;
  #autoplay;
  #loop;
  #interval;
  #defaultInterval = 3000
  #minInterval = 1000

  static get observedAttributes() {
    return ['autoplay', 'interval', 'loop'];
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    if(newVal === oldVal) return;

    if (attrName === 'autoplay') {
      this.#autoplay = newVal !== null && newVal !== 'false';
    }

    if (attrName === 'loop') {
      this.#loop = newVal !== null && newVal !== 'false';
    }

    if (attrName === 'interval') {
      this.#interval = Math.max(parseInt(newVal, 10) || this.#defaultInterval, this.#minInterval)
    }

    this.#resetAutoplayTimer()
  }

  constructor() {
    super();
    this.#slides = []
    this.#currentIndex = 0;
  }

  connectedCallback() {
    console.log("connected");
    this.#slides = Array.from(this.querySelectorAll('.slide-item'));
    this.#render()
    this.#bindEvents()
    this.#startAutoplay()
  }

  disconnectedCallback() {
    this.#stopAutoplay()
  }

  #bindEvents() {
    const prevBtn = this.querySelector('.slide-prev');
    if (prevBtn) {
      prevBtn.addEventListener("click", this.#onPrevSlide.bind(this));
    }

    const nextBtn = this.querySelector('.slide-next');
    if (nextBtn) {
      nextBtn.addEventListener("click", this.#onNextSlide.bind(this));
    }

    const pagination = this.querySelector('.slide-pagination');
    if (pagination) {
      pagination.addEventListener("click", this.#onDotClick.bind(this));
    }
  }

  #collectSlide() {

  }

  #render() {
    const pagination = this.querySelector('.slide-pagination');
    this.#slides.forEach((_, index) => {
      const dot = document.createElement("i");
      dot.classList.add("slide-pagination__item")
      dot.classList.toggle('active', index === this.#currentIndex);
      dot.setAttribute("data-index", index);
      pagination.appendChild(dot);
    })
  }

  #updateSlidePosition() {
    const slideWrapper = this.querySelector('.slide-wrapper');
    const offset = -100 * this.#currentIndex;
    slideWrapper.style.transform = `translateX(${offset}%)`;

    const paginationItems = this.querySelectorAll('.slide-pagination__item');
    paginationItems.forEach((item) => {
      const index = parseInt(item.dataset?.index, 10);
      if (!isNaN(index)) {
        item.classList.toggle('active', index === this.#currentIndex);
      }
    })
  }

  #startAutoplay() {
    if(!this.#timer) {
      this.#timer = setInterval(() => {
        this.#nextSlide()
      }, this.#interval)
    }
  }

  #stopAutoplay() {
    if(this.#timer) {
      clearInterval(this.#timer);
      this.#timer = null;
    }
  }

  #jumpToSlide(index) {
    const slideCount = this.#slides.length
    this.#currentIndex = index;
    if (slideCount <= 1) return;


    this.#currentIndex = index % slideCount;

    this.#updateSlidePosition()
  }

  #onDotClick(e) {
    const index = parseInt(e?.target?.dataset?.index, 10)
    if (!isNaN(index)) {
      this.#jumpToSlide(index);
      this.#resetAutoplayTimer()
    }
  }

  #onPrevSlide(e) {
    e.preventDefault();
    this.#prevSlide()
  }

  #onNextSlide(e) {
    e.preventDefault();
    this.#nextSlide()
  }

  #prevSlide() {
    this.#jumpToSlide(this.#currentIndex - 1);
  }

  #nextSlide() {
    this.#jumpToSlide(this.#currentIndex + 1);
  }

  #resetAutoplayTimer() {
    this.#stopAutoplay()
    this.#startAutoplay()
  }
}

if (!customElements.get('slide-show')) {
  customElements.define('slide-show', slide);
}

class QuantityEditor extends HTMLElement {
  constructor() {
    super();
  }
}
if (!customElements.get('quantity-editor')) {
  customElements.define('quantity-editor', QuantityEditor);
}