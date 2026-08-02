class ProductInfo extends HTMLElement {
  #abortController = undefined
  constructor() {
    super();
  }

  connectedCallback() {
    this.addEventListener("variant:change", this.#onVariantChange.bind(this));
  }

  disconnectedCallback() {
    this.#abortController?.abort();
  }

  #onVariantChange(event) {
    event.preventDefault();
    event.stopPropagation();

    const {data} = event.detail;

    const optionIds = data.map(item => item.id);

    this.#updateSection(optionIds);
  }

  #updateSection(optionIds = []) {
    this.classList.toggle("loading");
    const {sectionId, productUrl} = this.dataset;

    const url = new URL(`${location.origin}${productUrl}`);
    sectionId ? url.searchParams.set("sectionId", sectionId) : "";
    sectionId ? url.searchParams.set("option_values", optionIds.join(",")) : "";

    this.#abortController?.abort()
    this.#abortController = new AbortController();
    const {signal} = this.#abortController;

    fetch(url.toString(), {
      signal
    }).then(response => response.text())
      .then(text => {
        const html = new DOMParser().parseFromString(text, 'text/html');
        const section = html.getElementById(sectionId);
        if(section) {
          const productInfo = section.querySelector("product-info");
          const {selectedVariantId} = productInfo.dataset;
          if(selectedVariantId) {
            this.#replaceState(productUrl, selectedVariantId);
          }

          document.getElementById(sectionId).innerHTML = section.innerHTML;
        }
      }).catch(error => {
        console.log(error);
    }).finally(() => {
      this.classList.toggle("loading");
    })
  }

  #replaceState(productUrl, variantId) {
    const url = new URL(`${location.origin}${productUrl}`);

    if(variantId) {
      url.searchParams.set('variant', variantId)
    }

    history.replaceState({}, "", url.toString())
  }

  #addToCart() {
    console.log("addToCart");
  }
}

if(!customElements.get("product-info")){
  customElements.define("product-info", ProductInfo);
}