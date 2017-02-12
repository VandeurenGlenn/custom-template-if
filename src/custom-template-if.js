'use strict';
export default class CustomTemplateIf extends HTMLElement {
  static get observedAttributes() {
    return ['if'];
  }
  constructor() {
    super();
    this.root = this.attachShadow({mode: 'open'}) ;
  }

  set if(value) {
    if (this._needsRender(this._booleanIf(value)))
      if (!this.pubsub) {
        this._if = value;
        this.render();
      } else {
        if (!this._if) {
          this._if = false;
        }
        PubSub.subscribe(value, function() {
            this._if = true
            this.render();
        }.bind(this));
      }
  }

  get if() {
    return this._if || false;
  }

  get pubsub() {
    return this._pubsub || this.hasAttribute('pubsub');
  }

  set pubsub(value) {
    this._pubsub = value;
  }

  get template() {
    const template = this.children[0];
    if (template === null ||
        template === undefined ||
        template.tagName !== 'TEMPLATE')
      return console.warn('template not found');
    else
      return this.children[0];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) this[name] = newValue;
  }

  _booleanIf(value) {
    let boolean;
    if (value === 'null' || value === 'false' || value === '0' || value === 'undefined') {
       boolean = Boolean(false);
    } else {
      boolean = Boolean(true);
    }
    return boolean;
  }

  /**
   * Checks if value has changed
   * @param {string|boolean|number|object|array} value
   */
  _needsRender(value) {
    if (value === this._booleanIf(this.if) && this.renderedOnce) return false;
    return true;
  }

  render() {
    let f = this._booleanIf(this.if);
    if (f === true)
      this._updateDom('append', this.template.innerHTML);
    else
      for (let child of this.root.children)
        this._updateDom('remove', this.child);

    this._fireEvent(f);

    if (!this.renderedOnce) this.renderedOnce = true;
  }

  /**
   * Performs appendChild or removeChild
   * @param {string} method 'append' or 'remove'
   * @param {HTMLElement} template
   */
  _updateDom(method, template) {
    if (method === 'append')
      this.root.innerHTML += template;
    else
      this.root.innerHTML -= template;
  }

  _fireEvent(detail) {
    this.dispatchEvent(new CustomEvent('change', {detail: detail}));
  }

}
customElements.define('custom-template-if', CustomTemplateIf);
