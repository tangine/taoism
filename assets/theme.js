//#region src/componets/base.ts
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
		this.observeAttr = {};
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
//#region ../../packages/shared/src/math.ts
/**
* 取模运算
* @param dividend 被取模数
* @param modulus 模数
*/
function mod(dividend, modulus) {
	return (dividend % modulus + modulus) % modulus;
}
//#endregion
//#region src/componets/slideshow.ts
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
			this.next();
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
		console.log(this.#loop, index, slideCount);
		if (slideCount <= 1 || !this.#loop && (index >= slideCount || index < 0)) {
			this.#stopAutoplay();
			return;
		}
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
		this.prev();
	}
	#onNextSlide(e) {
		e.preventDefault();
		this.next();
	}
	prev() {
		this.#jumpToSlide(this.#currentIndex - 1);
	}
	next() {
		this.#jumpToSlide(this.#currentIndex + 1);
	}
	#resetAutoplayTimer() {
		this.#stopAutoplay();
		this.#startAutoplay();
	}
};
//#endregion
//#region ../../packages/shared/src/emitter.ts
var EventEmitter = class {
	#events;
	constructor() {
		this.#events = /* @__PURE__ */ new Map();
	}
	on(eventName, listener) {
		if (!this.#events.has(eventName)) this.#events.set(eventName, /* @__PURE__ */ new Set());
		this.#events.get(eventName).add(listener);
		return this;
	}
	once(eventName, listener) {
		const wrapper = (...args) => {
			listener(...args);
			this.off(eventName, wrapper);
		};
		wrapper.originalListener = listener;
		this.on(eventName, wrapper);
		return this;
	}
	off(eventName, listenerToRemove) {
		if (this.#events.get(eventName).filter((listener) => listenerToRemove !== listener).length === 0) this.#events.delete(eventName);
		else this.#events.delete(eventName);
		return this;
	}
	emit(eventName, ...args) {
		const listeners = this.#events.get(eventName);
		if (!listeners || listeners.length === 0) return false;
		const listenersToCall = [...listeners];
		for (const listener of listenersToCall) listener(...args);
		return true;
	}
	removeAllListeners(eventName = null) {
		if (eventName) this.#events.delete(eventName);
		else this.#events.clear();
		return this;
	}
};
new EventEmitter();
//#endregion
//#region ../../packages/shared/src/index.ts
var registerWebComponent = (name, component) => {
	if (!customElements.get(name)) customElements.define(name, component);
};
//#endregion
//#region src/index.ts
registerWebComponent("slide-show", Slideshow);
//#endregion
