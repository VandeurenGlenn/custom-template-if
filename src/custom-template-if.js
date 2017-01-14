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
    let boolean;
    if (value === 'null' || value === 'false' || value === '0' || value === 'undefined') {
       boolean = Boolean(false);
    } else {
      boolean = Boolean(true);
    }

    if (this._needsRender(boolean))
      this._if = boolean;
      this.render();
  }

  get if() {
    return this._if || false;
  }

  get _child() {
    return this.querySelector('template').children[0];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) this[name] = newValue;
  }

  /**
   * Checks if value has changed
   * @param {string|boolean|number|object|array} value
   */
  _needsRender(value) {
    if (value === this.if) return false;
    return true;
  }

  render() {
    let f = this.if;
    let child = this.child;
    if (child === null || child === undefined)
      return console.warn('template not found');
    if (f !== false || f !== null || f !== undefined || f !== 0)
      this._updateDom('append', child);
    else this._updateDom('remove', child);
    this._fireEvent(f);
  }

  /**
   * Performs appendChild or removeChild
   * @param {string} method 'append' or 'remove'
   * @param {HTMLElement} template
   */
  _updateDom(method, child) {
    this.root[method + 'Child'](child);
  }

  _fireEvent(detail) {
    this.dispatchEvent(new CustomEvent('change', {detail: detail}));
  }

}
customElements.define('custom-template-if', CustomTemplateIf);
