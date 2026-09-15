//#region src/utils/index.ts
var registerComponent = (name, component) => {
	if (!customElements.get(name)) customElements.define(name, component);
};
/**
* 取模运算
* @param dividend 被取模数
* @param modulus 模数
*/
function mod(dividend, modulus) {
	return (dividend % modulus + modulus) % modulus;
}
//#endregion
//#region src/components/component.ts
var DeclarativeShadowElement = class extends HTMLElement {
	connectedCallback() {
		if (!this.shadowRoot) {
			const template = this.querySelector(":scope > template[shadowrootmode=\"open\"]");
			if (!(template instanceof HTMLTemplateElement)) return;
			this.attachShadow({ mode: "open" }).append(template.content.cloneNode(true));
		}
	}
};
var BaseComponent = class extends DeclarativeShadowElement {
	constructor() {
		super();
	}
	connectedCallback() {
		this.#updateRefs();
	}
	attributeChangedCallback(attributeName, oldValue, newValue) {
		if (oldValue !== newValue) this.observeAttr[attributeName] = newValue;
	}
	#updateRefs() {
		this.querySelectorAll("[ref]");
	}
};
//#endregion
//#region src/components/slideshow.ts
var Slideshow = class extends BaseComponent {
	#timer = null;
	#currentIndex = 0;
	#slides;
	#autoplay = true;
	#loop = false;
	#defaultInterval = 3e3;
	#minInterval = 1e3;
	#interval = this.#defaultInterval;
	static get observedAttributes() {
		return [
			"autoplay",
			"interval",
			"loop"
		];
	}
	attributeChangedCallback(attrName, oldVal, newVal) {
		console.log("attributeChangedCallback", attrName, oldVal, newVal);
		super.attributeChangedCallback(attrName, oldVal, newVal);
		console.log(this.observeAttr);
		if (attrName === "autoplay") this.#autoplay = newVal !== null && newVal !== "false";
		if (attrName === "loop") this.#loop = newVal !== null && newVal !== "false";
		if (attrName === "interval") this.#interval = Math.max(parseInt(newVal, 10) || this.#defaultInterval, this.#minInterval);
		this.#resetAutoplayTimer();
	}
	constructor() {
		super();
		this.#slides = [];
		this.#currentIndex = 0;
	}
	connectedCallback() {
		this.#collectSlides();
		this.#renderSlides();
		this.#bindEvents();
		this.#startAutoplay();
	}
	disconnectedCallback() {
		this.#stopAutoplay();
	}
	#bindEvents() {
		const prevBtn = this.querySelector(".slide-prev");
		if (prevBtn) prevBtn.addEventListener("click", this.#onPrevSlide.bind(this));
		const nextBtn = this.querySelector(".slide-next");
		if (nextBtn) nextBtn.addEventListener("click", this.#onNextSlide.bind(this));
		const indicator = this.querySelector(".slide-indicator");
		if (indicator) indicator.addEventListener("click", this.#onDotClick.bind(this));
	}
	#collectSlides() {
		this.#slides = Array.from(this.querySelectorAll(".slide-item"));
	}
	#renderSlides() {
		const indicator = this.querySelector(".slide-indicator");
		if (indicator) this.#slides.forEach((_, index) => {
			const dot = document.createElement("i");
			dot.classList.add("slide-indicator__item");
			dot.classList.toggle("active", index === this.#currentIndex);
			dot.setAttribute("data-index", String(index));
			indicator.appendChild(dot);
		});
	}
	#updateSlidePosition() {
		const slideWrapper = this.querySelector(".slide-wrapper");
		const offset = -100 * this.#currentIndex;
		if (slideWrapper) slideWrapper.style.transform = `translateX(${offset}%)`;
		this.querySelectorAll(".slide-indicator__item").forEach((item) => {
			const index = parseInt(item.dataset.index ?? "", 10);
			if (!isNaN(index)) item.classList.toggle("active", index === this.#currentIndex);
		});
	}
	#startAutoplay() {
		if (!this.#timer) this.#timer = setInterval(() => {
			this.#nextSlide();
		}, this.#interval);
	}
	#stopAutoplay() {
		if (this.#timer) {
			clearInterval(this.#timer);
			this.#timer = null;
		}
	}
	#jumpToSlide(index) {
		const slideCount = this.#slides.length;
		this.#currentIndex = index;
		if (slideCount <= 1) return;
		this.#currentIndex = mod(index, slideCount);
		this.#updateSlidePosition();
	}
	#onDotClick(e) {
		const target = e.target;
		const index = parseInt(target.dataset.index ?? "", 10);
		if (!isNaN(index)) {
			this.#jumpToSlide(index);
			this.#resetAutoplayTimer();
		}
	}
	#onPrevSlide(e) {
		e.preventDefault();
		this.#prevSlide();
	}
	#onNextSlide(e) {
		e.preventDefault();
		this.#nextSlide();
	}
	#prevSlide() {
		this.#jumpToSlide(this.#currentIndex - 1);
	}
	#nextSlide() {
		this.#jumpToSlide(this.#currentIndex + 1);
	}
	#resetAutoplayTimer() {
		this.#stopAutoplay();
		this.#startAutoplay();
	}
};
//#endregion
//#region src/components/quantity-editor.ts
var QuantityEditor = class extends HTMLElement {
	constructor() {
		super();
	}
};
//#endregion
//#region src/components/cart-item.ts
var CartItem = class extends BaseComponent {
	static get observedAttributes() {
		return [
			"id",
			"line",
			"variant"
		];
	}
};
//#endregion
//#region src/components/variant-picker.ts
var VariantPicker = class extends BaseComponent {
	constructor() {
		super();
	}
	connectedCallback() {
		super.connectedCallback();
		this.addEventListener("change", this.#onChange);
	}
	#onChange() {}
	#dispatch() {
		this.dispatchEvent(new CustomEvent("variant:change", {
			bubbles: true,
			cancelable: true,
			composed: true,
			detail: {}
		}));
	}
};
//#endregion
//#region src/index.ts
registerComponent("slide-show", Slideshow);
registerComponent("quantity-editor", QuantityEditor);
registerComponent("cart-item", CartItem);
registerComponent("variant-picker", VariantPicker);
window.eventEmitter = {};
//#endregion
