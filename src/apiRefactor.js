  
class ApiRefactor extends HTMLElement {
    static get observedAttributes() {
        return ['message'];
      }
    
      constructor() {
        super();
        this._message = 'Hello, World!';
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `<p>${this._message}</p>`;
      }
    
      get message() {
        return this._message;
      }
    
      set message(value) {
        this._message = value;
        this.shadowRoot.innerHTML = `<p>${this._message}</p>`;
      }
    
      attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'message' && oldValue !== newValue) {
          this.message = newValue;
        }
      }
    }
    
    customElements.define('api-refactor', ApiRefactor);
    
  
