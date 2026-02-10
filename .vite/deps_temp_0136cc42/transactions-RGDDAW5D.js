import "./chunk-TGAUDPUU.js";
import "./chunk-XCVLADUT.js";
import "./chunk-LNK2NIUR.js";
import "./chunk-CGXHVTOC.js";
import "./chunk-7ZTJ3MMT.js";
import "./chunk-F3IWM2WU.js";
import "./chunk-M63K5LDJ.js";
import "./chunk-KGO4IOS7.js";
import {
  LitElement,
  css,
  customElement,
  html
} from "./chunk-P6RFBBTT.js";
import "./chunk-DFIX4QQZ.js";
import "./chunk-NU7X6Z6O.js";
import "./chunk-2XRBVNCQ.js";
import "./chunk-5LNC5VWT.js";
import "./chunk-TJXUK3MO.js";
import "./chunk-W57XQINX.js";
import "./chunk-256EKJAK.js";

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
//# sourceMappingURL=transactions-RGDDAW5D.js.map
