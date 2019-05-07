
customElements.define('custom-template-if', class CustomTemplateIf extends HTMLElement {
  static get observedAttributes() {
    return ['if'];
  }

  set if(value) {
    if (this._if !== value) {
      this._if = value;
      if (this.boolify(value)) {
        for (const child of this.children) {
          this.shadowRoot.appendChild(child.cloneNode(true))
        }
      } else {
        for (const child of this.shadowRoot.children) {
          this.shadowRoot.removeChild(child)
        }
      }
    }
  }

  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    // this.shadowRoot.i
    this.if = false;
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) this[name] = newValue;
  }

  boolify(value) {
    switch (value) {
      case 'false':
      case 'null':
      case 'undefined':
      case '0':
      case '':
      case 0:
      case null:
      case undefined:
      case false:
        return false;
        break;
      default:
        return true;
    }
  }
  });
