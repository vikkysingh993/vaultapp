import "./chunk-HNDOXZVY.js";
import "./chunk-7S4WWYYJ.js";
import "./chunk-6SGY26QN.js";
import "./chunk-EVS7TBFE.js";
import "./chunk-CGXHVTOC.js";
import "./chunk-PDGTLJDS.js";
import "./chunk-5VASF4MU.js";
import "./chunk-NLKUGHV7.js";
import {
  LitElement,
  css,
  customElement,
  html
} from "./chunk-HTESJ4GB.js";
import "./chunk-6S4CJ3EG.js";
import "./chunk-3D2UJM57.js";
import "./chunk-KXWSMVTS.js";
import "./chunk-V5F6BRPH.js";
import "./chunk-F2Y5DB6I.js";
import "./chunk-Y5BD77IA.js";
import "./chunk-5LNC5VWT.js";
import "./chunk-VFXVZLDY.js";
import "./chunk-W57XQINX.js";
import "./chunk-OS7ZSSJM.js";

// node_modules/@reown/appkit-scaffold-ui/dist/esm/src/views/w3m-transactions-view/styles.js
var styles_default = css`
  :host > wui-flex:first-child {
    height: 500px;
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-width: none;
  }

  :host > wui-flex:first-child::-webkit-scrollbar {
    display: none;
  }
`;

// node_modules/@reown/appkit-scaffold-ui/dist/esm/src/views/w3m-transactions-view/index.js
var __decorate = function(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var W3mTransactionsView = class W3mTransactionsView2 extends LitElement {
  render() {
    return html`
      <wui-flex flexDirection="column" .padding=${["0", "3", "3", "3"]} gap="3">
        <w3m-activity-list page="activity"></w3m-activity-list>
      </wui-flex>
    `;
  }
};
W3mTransactionsView.styles = styles_default;
W3mTransactionsView = __decorate([
  customElement("w3m-transactions-view")
], W3mTransactionsView);
export {
  W3mTransactionsView
};
//# sourceMappingURL=transactions-GYYRR73U.js.map
