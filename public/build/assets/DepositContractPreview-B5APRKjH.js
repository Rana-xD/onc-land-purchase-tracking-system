import{r as w,j as f,Q as Z,B as S,s as C,a as B}from"./app-BRuw9EN3.js";import{A as ee,b as ne}from"./AdminLayout-BQR47gOS.js";import"./jspdf.es.min-CU8NuCx6.js";import{C as N}from"./index-D2zmwFIy.js";import{S as te}from"./index-8il4p3hw.js";import{T as re}from"./index-DK7c9CS7.js";import{R as K}from"./EyeOutlined-TX0XAQgo.js";import{M as ie}from"./index-CnESk_LV.js";import{R as oe}from"./UserOutlined-qdJtpBqh.js";import{R as ae}from"./EnvironmentOutlined-7EJqH89h.js";import{R as se}from"./DollarOutlined-BrwFTWzR.js";import{R as ce}from"./FileOutlined-B_lud-B5.js";import"./index-DjUyA9od.js";import"./index-E_hMYPT7.js";import"./EllipsisOutlined-CdogJ6km.js";import"./PurePanel-eBpBMAv8.js";import"./index-Bf8sDkQb.js";import"./InboxOutlined-CgVO651u.js";import"./useVariants-CDpFdPYi.js";import"./CheckOutlined-Du9YJw9D.js";import"./progress-DsA-Ejbg.js";import"./EditOutlined-LzavAjS2.js";import"./getAllowClear-3Rav48C8.js";var j={exports:{}},T,M;function le(){if(M)return T;M=1;var t="SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED";return T=t,T}var O,H;function pe(){if(H)return O;H=1;var t=le();function r(){}function o(){}return o.resetWarningCache=r,O=function(){function i(e,s,l,p,u,d){if(d!==t){var h=new Error("Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types");throw h.name="Invariant Violation",h}}i.isRequired=i;function a(){return i}var c={array:i,bigint:i,bool:i,func:i,number:i,object:i,string:i,symbol:i,any:i,arrayOf:a,element:i,elementType:i,instanceOf:a,node:i,objectOf:a,oneOf:a,oneOfType:a,shape:a,exact:a,checkPropTypes:o,resetWarningCache:r};return c.PropTypes=c,c},O}var z;function de(){return z||(z=1,j.exports=pe()()),j.exports}var n=de(),P=function(){return P=Object.assign||function(t){for(var r,o=1,i=arguments.length;o<i;o++){r=arguments[o];for(var a in r)Object.prototype.hasOwnProperty.call(r,a)&&(t[a]=r[a])}return t},P.apply(this,arguments)},G={onActivate:n.func,onAddUndo:n.func,onBeforeAddUndo:n.func,onBeforeExecCommand:n.func,onBeforeGetContent:n.func,onBeforeRenderUI:n.func,onBeforeSetContent:n.func,onBeforePaste:n.func,onBlur:n.func,onChange:n.func,onClearUndos:n.func,onClick:n.func,onContextMenu:n.func,onCommentChange:n.func,onCompositionEnd:n.func,onCompositionStart:n.func,onCompositionUpdate:n.func,onCopy:n.func,onCut:n.func,onDblclick:n.func,onDeactivate:n.func,onDirty:n.func,onDrag:n.func,onDragDrop:n.func,onDragEnd:n.func,onDragGesture:n.func,onDragOver:n.func,onDrop:n.func,onExecCommand:n.func,onFocus:n.func,onFocusIn:n.func,onFocusOut:n.func,onGetContent:n.func,onHide:n.func,onInit:n.func,onInput:n.func,onKeyDown:n.func,onKeyPress:n.func,onKeyUp:n.func,onLoadContent:n.func,onMouseDown:n.func,onMouseEnter:n.func,onMouseLeave:n.func,onMouseMove:n.func,onMouseOut:n.func,onMouseOver:n.func,onMouseUp:n.func,onNodeChange:n.func,onObjectResizeStart:n.func,onObjectResized:n.func,onObjectSelected:n.func,onPaste:n.func,onPostProcess:n.func,onPostRender:n.func,onPreProcess:n.func,onProgressState:n.func,onRedo:n.func,onRemove:n.func,onReset:n.func,onSaveContent:n.func,onSelectionChange:n.func,onSetAttrib:n.func,onSetContent:n.func,onShow:n.func,onSubmit:n.func,onUndo:n.func,onVisualAid:n.func,onSkinLoadError:n.func,onThemeLoadError:n.func,onModelLoadError:n.func,onPluginLoadError:n.func,onIconsLoadError:n.func,onLanguageLoadError:n.func,onScriptsLoad:n.func,onScriptsLoadError:n.func},ue=P({apiKey:n.string,licenseKey:n.string,id:n.string,inline:n.bool,init:n.object,initialValue:n.string,onEditorChange:n.func,value:n.string,tagName:n.string,tabIndex:n.number,cloudChannel:n.string,plugins:n.oneOfType([n.string,n.array]),toolbar:n.oneOfType([n.string,n.array]),disabled:n.bool,readonly:n.bool,textareaName:n.string,tinymceScriptSrc:n.oneOfType([n.string,n.arrayOf(n.string),n.arrayOf(n.shape({src:n.string,async:n.bool,defer:n.bool}))]),rollback:n.oneOfType([n.number,n.oneOf([!1])]),scriptLoading:n.shape({async:n.bool,defer:n.bool,delay:n.number})},G),Q=function(t){var r=t;return r&&r.tinymce?r.tinymce:null},I=function(t){return typeof t=="function"},F=function(t){return t in G},$=function(t){return t.substr(2)},fe=function(t,r,o,i,a,c,e){var s=Object.keys(a).filter(F),l=Object.keys(c).filter(F),p=s.filter(function(d){return c[d]===void 0}),u=l.filter(function(d){return a[d]===void 0});p.forEach(function(d){var h=$(d),m=e[h];o(h,m),delete e[h]}),u.forEach(function(d){var h=i(t,d),m=$(d);e[m]=h,r(m,h)})},he=function(t,r,o,i,a){return fe(a,t.on.bind(t),t.off.bind(t),function(c,e){return function(s){var l;return(l=c(e))===null||l===void 0?void 0:l(s,t)}},r,o,i)},A=0,Y=function(t){var r=Date.now(),o=Math.floor(Math.random()*1e9);return A++,t+"_"+o+A+String(r)},V=function(t){return t!==null&&(t.tagName.toLowerCase()==="textarea"||t.tagName.toLowerCase()==="input")},U=function(t){return typeof t>"u"||t===""?[]:Array.isArray(t)?t:t.split(" ")},ge=function(t,r){return U(t).concat(U(r))},ve=function(){return window.InputEvent&&typeof InputEvent.prototype.getTargetRanges=="function"},me=function(t){if(!("isConnected"in Node.prototype)){for(var r=t,o=t.parentNode;o!=null;)r=o,o=r.parentNode;return r===t.ownerDocument}return t.isConnected},q=function(t,r){t!==void 0&&(t.mode!=null&&typeof t.mode=="object"&&typeof t.mode.set=="function"?t.mode.set(r):t.setMode(r))},ye=function(t){var r=Q(t);if(!r)throw new Error("tinymce should have been loaded into global scope");return r},W=function(t){return t.options&&t.options.isRegistered("disabled")},L=function(){return L=Object.assign||function(t){for(var r,o=1,i=arguments.length;o<i;o++){r=arguments[o];for(var a in r)Object.prototype.hasOwnProperty.call(r,a)&&(t[a]=r[a])}return t},L.apply(this,arguments)},be=function(t,r,o){var i,a,c=t.createElement("script");c.referrerPolicy="origin",c.type="application/javascript",c.id=r.id,c.src=r.src,c.async=(i=r.async)!==null&&i!==void 0?i:!1,c.defer=(a=r.defer)!==null&&a!==void 0?a:!1;var e=function(){c.removeEventListener("load",e),c.removeEventListener("error",s),o(r.src)},s=function(l){c.removeEventListener("load",e),c.removeEventListener("error",s),o(r.src,l)};c.addEventListener("load",e),c.addEventListener("error",s),t.head&&t.head.appendChild(c)},xe=function(t){var r={},o=function(e,s){var l=r[e];l.done=!0,l.error=s;for(var p=0,u=l.handlers;p<u.length;p++){var d=u[p];d(e,s)}l.handlers=[]},i=function(e,s,l){var p=function(k){return l!==void 0?l(k):console.error(k)};if(e.length===0){p(new Error("At least one script must be provided"));return}for(var u=0,d=!1,h=function(k,v){d||(v?(d=!0,p(v)):++u===e.length&&s())},m=0,g=e;m<g.length;m++){var y=g[m],x=r[y.src];if(x)x.done?h(y.src,x.error):x.handlers.push(h);else{var E=Y("tiny-");r[y.src]={id:E,src:y.src,done:!1,error:null,handlers:[h]},be(t,L({id:E},y),o)}}},a=function(){for(var e,s=0,l=Object.values(r);s<l.length;s++){var p=l[s],u=t.getElementById(p.id);u!=null&&u.tagName==="SCRIPT"&&((e=u.parentNode)===null||e===void 0||e.removeChild(u))}r={}},c=function(){return t};return{loadScripts:i,deleteScripts:a,getDocument:c}},we=function(){var t=[],r=function(a){var c=t.find(function(e){return e.getDocument()===a});return c===void 0&&(c=xe(a),t.push(c)),c},o=function(a,c,e,s,l){var p=function(){return r(a).loadScripts(c,s,l)};e>0?setTimeout(p,e):p()},i=function(){for(var a=t.pop();a!=null;a=t.pop())a.deleteScripts()};return{loadList:o,reinitialize:i}},Se=we(),Ce=function(){var t=function(r,o){return t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(i,a){i.__proto__=a}||function(i,a){for(var c in a)Object.prototype.hasOwnProperty.call(a,c)&&(i[c]=a[c])},t(r,o)};return function(r,o){if(typeof o!="function"&&o!==null)throw new TypeError("Class extends value "+String(o)+" is not a constructor or null");t(r,o);function i(){this.constructor=r}r.prototype=o===null?Object.create(o):(i.prototype=o.prototype,new i)}}(),_=function(){return _=Object.assign||function(t){for(var r,o=1,i=arguments.length;o<i;o++){r=arguments[o];for(var a in r)Object.prototype.hasOwnProperty.call(r,a)&&(t[a]=r[a])}return t},_.apply(this,arguments)},R="change keyup compositionend setcontent CommentChange",_e=function(t){Ce(r,t);function r(o){var i,a,c,e=t.call(this,o)||this;return e.rollbackTimer=void 0,e.valueCursor=void 0,e.rollbackChange=function(){var s=e.editor,l=e.props.value;s&&l&&l!==e.currentContent&&s.undoManager.ignore(function(){if(s.setContent(l),e.valueCursor&&(!e.inline||s.hasFocus()))try{s.selection.moveToBookmark(e.valueCursor)}catch{}}),e.rollbackTimer=void 0},e.handleBeforeInput=function(s){if(e.props.value!==void 0&&e.props.value===e.currentContent&&e.editor&&(!e.inline||e.editor.hasFocus()))try{e.valueCursor=e.editor.selection.getBookmark(3)}catch{}},e.handleBeforeInputSpecial=function(s){(s.key==="Enter"||s.key==="Backspace"||s.key==="Delete")&&e.handleBeforeInput(s)},e.handleEditorChange=function(s){var l=e.editor;if(l&&l.initialized){var p=l.getContent();e.props.value!==void 0&&e.props.value!==p&&e.props.rollback!==!1&&(e.rollbackTimer||(e.rollbackTimer=window.setTimeout(e.rollbackChange,typeof e.props.rollback=="number"?e.props.rollback:200))),p!==e.currentContent&&(e.currentContent=p,I(e.props.onEditorChange)&&e.props.onEditorChange(p,l))}},e.handleEditorChangeSpecial=function(s){(s.key==="Backspace"||s.key==="Delete")&&e.handleEditorChange(s)},e.initialise=function(s){var l,p,u;s===void 0&&(s=0);var d=e.elementRef.current;if(d){if(!me(d)){if(s===0)setTimeout(function(){return e.initialise(1)},1);else if(s<100)setTimeout(function(){return e.initialise(s+1)},100);else throw new Error("tinymce can only be initialised when in a document");return}var h=ye(e.view),m=_(_(_(_({},e.props.init),{selector:void 0,target:d,disabled:e.props.disabled,readonly:e.props.readonly,inline:e.inline,plugins:ge((l=e.props.init)===null||l===void 0?void 0:l.plugins,e.props.plugins),toolbar:(p=e.props.toolbar)!==null&&p!==void 0?p:(u=e.props.init)===null||u===void 0?void 0:u.toolbar}),e.props.licenseKey?{license_key:e.props.licenseKey}:{}),{setup:function(g){e.editor=g,e.bindHandlers({}),e.inline&&!V(d)&&g.once("PostRender",function(y){g.setContent(e.getInitialValue(),{no_events:!0})}),e.props.init&&I(e.props.init.setup)&&e.props.init.setup(g),e.props.disabled&&(W(e.editor)?e.editor.options.set("disabled",e.props.disabled):e.editor.mode.set("readonly"))},init_instance_callback:function(g){var y,x=e.getInitialValue();e.currentContent=(y=e.currentContent)!==null&&y!==void 0?y:g.getContent(),e.currentContent!==x&&(e.currentContent=x,g.setContent(x),g.undoManager.clear(),g.undoManager.add(),g.setDirty(!1)),e.props.init&&I(e.props.init.init_instance_callback)&&e.props.init.init_instance_callback(g)}});e.inline||(d.style.visibility=""),V(d)&&(d.value=e.getInitialValue()),h.init(m)}},e.id=e.props.id||Y("tiny-react"),e.elementRef=w.createRef(),e.inline=(c=(i=e.props.inline)!==null&&i!==void 0?i:(a=e.props.init)===null||a===void 0?void 0:a.inline)!==null&&c!==void 0?c:!1,e.boundHandlers={},e}return Object.defineProperty(r.prototype,"view",{get:function(){var o,i;return(i=(o=this.elementRef.current)===null||o===void 0?void 0:o.ownerDocument.defaultView)!==null&&i!==void 0?i:window},enumerable:!1,configurable:!0}),r.prototype.componentDidUpdate=function(o){var i=this,a,c;if(this.rollbackTimer&&(clearTimeout(this.rollbackTimer),this.rollbackTimer=void 0),this.editor&&(this.bindHandlers(o),this.editor.initialized)){if(this.currentContent=(a=this.currentContent)!==null&&a!==void 0?a:this.editor.getContent(),typeof this.props.initialValue=="string"&&this.props.initialValue!==o.initialValue)this.editor.setContent(this.props.initialValue),this.editor.undoManager.clear(),this.editor.undoManager.add(),this.editor.setDirty(!1);else if(typeof this.props.value=="string"&&this.props.value!==this.currentContent){var e=this.editor;e.undoManager.transact(function(){var l;if(!i.inline||e.hasFocus())try{l=e.selection.getBookmark(3)}catch{}var p=i.valueCursor;if(e.setContent(i.props.value),!i.inline||e.hasFocus())for(var u=0,d=[l,p];u<d.length;u++){var h=d[u];if(h)try{e.selection.moveToBookmark(h),i.valueCursor=h;break}catch{}}})}if(this.props.readonly!==o.readonly){var s=(c=this.props.readonly)!==null&&c!==void 0?c:!1;q(this.editor,s?"readonly":"design")}this.props.disabled!==o.disabled&&(W(this.editor)?this.editor.options.set("disabled",this.props.disabled):q(this.editor,this.props.disabled?"readonly":"design"))}},r.prototype.componentDidMount=function(){var o=this,i,a,c,e,s;if(Q(this.view)!==null)this.initialise();else if(Array.isArray(this.props.tinymceScriptSrc)&&this.props.tinymceScriptSrc.length===0)(a=(i=this.props).onScriptsLoadError)===null||a===void 0||a.call(i,new Error("No `tinymce` global is present but the `tinymceScriptSrc` prop was an empty array."));else if(!((c=this.elementRef.current)===null||c===void 0)&&c.ownerDocument){var l=function(){var u,d;(d=(u=o.props).onScriptsLoad)===null||d===void 0||d.call(u),o.initialise()},p=function(u){var d,h;(h=(d=o.props).onScriptsLoadError)===null||h===void 0||h.call(d,u)};Se.loadList(this.elementRef.current.ownerDocument,this.getScriptSources(),(s=(e=this.props.scriptLoading)===null||e===void 0?void 0:e.delay)!==null&&s!==void 0?s:0,l,p)}},r.prototype.componentWillUnmount=function(){var o=this,i=this.editor;i&&(i.off(R,this.handleEditorChange),i.off(this.beforeInputEvent(),this.handleBeforeInput),i.off("keypress",this.handleEditorChangeSpecial),i.off("keydown",this.handleBeforeInputSpecial),i.off("NewBlock",this.handleEditorChange),Object.keys(this.boundHandlers).forEach(function(a){i.off(a,o.boundHandlers[a])}),this.boundHandlers={},i.remove(),this.editor=void 0)},r.prototype.render=function(){return this.inline?this.renderInline():this.renderIframe()},r.prototype.beforeInputEvent=function(){return ve()?"beforeinput SelectionChange":"SelectionChange"},r.prototype.renderInline=function(){var o=this.props.tagName,i=o===void 0?"div":o;return w.createElement(i,{ref:this.elementRef,id:this.id,tabIndex:this.props.tabIndex})},r.prototype.renderIframe=function(){return w.createElement("textarea",{ref:this.elementRef,style:{visibility:"hidden"},name:this.props.textareaName,id:this.id,tabIndex:this.props.tabIndex})},r.prototype.getScriptSources=function(){var o,i,a=(o=this.props.scriptLoading)===null||o===void 0?void 0:o.async,c=(i=this.props.scriptLoading)===null||i===void 0?void 0:i.defer;if(this.props.tinymceScriptSrc!==void 0)return typeof this.props.tinymceScriptSrc=="string"?[{src:this.props.tinymceScriptSrc,async:a,defer:c}]:this.props.tinymceScriptSrc.map(function(p){return typeof p=="string"?{src:p,async:a,defer:c}:p});var e=this.props.cloudChannel,s=this.props.apiKey?this.props.apiKey:"no-api-key",l="https://cdn.tiny.cloud/1/".concat(s,"/tinymce/").concat(e,"/tinymce.min.js");return[{src:l,async:a,defer:c}]},r.prototype.getInitialValue=function(){return typeof this.props.initialValue=="string"?this.props.initialValue:typeof this.props.value=="string"?this.props.value:""},r.prototype.bindHandlers=function(o){var i=this;if(this.editor!==void 0){he(this.editor,o,this.props,this.boundHandlers,function(s){return i.props[s]});var a=function(s){return s.onEditorChange!==void 0||s.value!==void 0},c=a(o),e=a(this.props);!c&&e?(this.editor.on(R,this.handleEditorChange),this.editor.on(this.beforeInputEvent(),this.handleBeforeInput),this.editor.on("keydown",this.handleBeforeInputSpecial),this.editor.on("keyup",this.handleEditorChangeSpecial),this.editor.on("NewBlock",this.handleEditorChange)):c&&!e&&(this.editor.off(R,this.handleEditorChange),this.editor.off(this.beforeInputEvent(),this.handleBeforeInput),this.editor.off("keydown",this.handleBeforeInputSpecial),this.editor.off("keyup",this.handleEditorChangeSpecial),this.editor.off("NewBlock",this.handleEditorChange))}},r.propTypes=ue,r.defaultProps={cloudChannel:"8"},r}(w.Component);const{Title:ke}=re;function Qe({document:t,populatedTemplate:r}){const[o,i]=w.useState(!1),[a,c]=w.useState(!1),[e,s]=w.useState(r),[l,p]=w.useState(!1),u=w.useRef(null),d=`
    @import url('https://fonts.googleapis.com/css2?family=Koh+Santepheap:wght@100;300;400;700;900&display=swap');

    body {
      font-family: 'Koh Santepheap', 'Khmer OS', 'Hanuman', serif !important;
      line-height: 2.2;
      margin: 0;
      padding: 40px 60px;
      background: white;
      color: #000;
      font-size: 13pt;
      max-width: 210mm;
      margin: 0 auto;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      text-rendering: optimizeLegibility;
    }

    h1, h2, h3 {
      text-align: center;
      font-family: 'Koh Santepheap', serif !important;
    }

    h1 {
      font-size: 18pt;
      font-weight: 700;
      margin: 15px 0 10px 0;
      letter-spacing: 0.5px;
    }

    h2 {
      font-size: 14pt;
      font-weight: 400;
      margin: 8px 0;
    }

    h3 {
      font-size: 16pt;
      font-weight: 700;
      text-decoration: underline;
      margin: 20px 0 15px 0;
      text-underline-offset: 3px;
    }

    p {
      margin: 12px 0;
      text-align: justify;
      text-indent: 40px;
      line-height: 2.2;
    }

    .contract-intro {
      text-align: center;
      margin: 25px 0;
      font-weight: 600;
    }

    .content-section {
      margin: 20px 0;
      text-align: justify;
    }

    .party-info {
      margin: 15px 0;
      line-height: 2.2;
      background: none;
      border: none;
      padding: 0;
    }

    .fill-text {
      display: inline-block;
      border-bottom: 1px dotted #333;
      padding: 0 5px;
      min-width: 80px;
    }

    strong {
      font-weight: 700;
    }

    .section-title {
      font-weight: 700;
      margin: 30px 0 15px 0;
      text-decoration: underline;
      text-underline-offset: 3px;
      font-size: 14pt;
    }

    .contract-item {
      margin: 15px 0;
      padding-left: 50px;
      text-indent: -30px;
      text-align: justify;
      line-height: 2.2;
    }

    ul {
      list-style: none;
      padding-left: 0;
    }

    ul li {
      margin: 12px 0;
      padding-left: 50px;
      text-indent: -30px;
      line-height: 2.2;
    }

    ul li:before {
      content: "- ";
      font-weight: bold;
      margin-right: 10px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
    }

    table td, table th {
      border: 1px solid #000;
      padding: 8px 12px;
      text-align: left;
      font-size: 13pt;
    }

    table th {
      font-weight: 700;
      background-color: #f5f5f5;
    }

    .signature-section {
      margin-top: 60px;
      display: flex;
      justify-content: space-between;
    }

    .signature-block {
      width: 45%;
      text-align: center;
    }

    .signature-line {
      margin: 60px 0 10px 0;
      border-bottom: 1px solid #000;
    }

    .page-break {
      page-break-after: always;
      margin-top: 30px;
    }

    .khmer-text {
      letter-spacing: 0.3px;
      word-spacing: 2px;
    }

    .indent-1 {
      padding-left: 40px;
    }

    .indent-2 {
      padding-left: 60px;
    }

    .term-number {
      font-weight: 700;
      margin-right: 10px;
    }

    .date-location {
      text-align: center;
      margin: 20px 0;
      font-weight: 600;
    }

    .kingdom-title {
      font-size: 18pt;
      font-weight: 700;
      margin-bottom: 10px;
      text-align: center;
    }

    .nation-religion-king {
      font-size: 14pt;
      margin-bottom: 8px;
      text-align: center;
    }

    .contract-title {
      font-size: 16pt;
      font-weight: 700;
      margin: 20px 0 15px 0;
      text-decoration: underline;
      text-underline-offset: 3px;
      text-align: center;
    }

    .header {
      text-align: center;
      margin-bottom: 25px;
    }

    .party-title,
    .terms-title {
      font-weight: 700;
      margin: 30px 0 15px 0;
      text-decoration: underline;
      text-underline-offset: 3px;
      font-size: 14pt;
    }

    .info-row {
      margin-bottom: 12px;
      line-height: 2.2;
    }

    .info-label {
      font-weight: 600;
      display: inline;
    }

    .info-value {
      display: inline-block;
      border-bottom: 1px dotted #333;
      padding: 0 5px;
      min-width: 80px;
    }

    .term-item {
      margin: 15px 0;
      padding-left: 50px;
      text-indent: -30px;
      text-align: justify;
      line-height: 2.2;
    }

    .signatures {
      margin-top: 60px;
    }

    .signature-title {
      font-weight: 700;
      margin-bottom: 10px;
    }

    p, div, span, td, th, li, h1, h2, h3, h4, h5, h6 {
      font-family: 'Koh Santepheap', 'Khmer OS', 'Hanuman', serif !important;
      letter-spacing: 0.3px;
    }

    .document-container {
      max-width: 100%;
      margin: 0 auto;
      background: white;
      padding: 0;
      box-shadow: none;
    }

    @media print {
      body {
        padding: 0;
        margin: 0;
      }
      
      .document-container {
        box-shadow: none;
        max-width: none;
      }
      
      .signatures {
        page-break-inside: avoid;
      }
    }
  `,h=async()=>{if(!u.current){C.error("Editor not ready");return}c(!0);try{const v=u.current.getContent();await B.post(`/api/deposit-contracts/${t.id}/save-document`,{content:v}),s(v),C.success("ព្រាងកិច្ចសន្យាត្រូវបានរក្សាទុកដោយជោគជ័យ")}catch(v){console.error("Error saving document:",v),C.error("មានបញ្ហាក្នុងការរក្សាទុកព្រាង")}finally{c(!1)}},m=async()=>{if(!u.current){C.error("Editor not ready");return}i(!0);try{const v=u.current.getContent(),b=t.document_type||"deposit_contract",J=b==="sale_contract"?`/api/sale-contracts/${t.id}/save-document`:`/api/deposit-contracts/${t.id}/save-document`;await B.post(J,{content:v});const D=`${b}_${t.id}_${new Date().toISOString().slice(0,10)}.pdf`,X=b==="sale_contract"?`/api/sale-contracts/${t.id}/generate-pdf?download=${D}`:`/api/deposit-contracts/${t.id}/generate-pdf?download=${D}`;window.location.href=X,C.success("PDF ត្រូវបានបង្កើតដោយជោគជ័យ")}catch(v){console.error("Error generating PDF:",v),C.error("មានបញ្ហាក្នុងការបង្កើត PDF")}finally{i(!1)}},g=()=>{if(!u.current){C.error("Editor not ready");return}const v=u.current.getContent(),b=window.open("","_blank");b.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>កិច្ចសន្យាកក់ប្រាក់ទិញដី</title>
        <link href="https://fonts.googleapis.com/css2?family=Koh+Santepheap:wght@100;300;400;700;900&display=swap" rel="stylesheet">
        <style>
          body { 
            font-family: 'Koh Santepheap', serif; 
            margin: 0; 
            padding: 20px; 
            line-height: 1.6;
          }
          @media print {
            body { padding: 0; }
          }
        </style>
      </head>
      <body>
        ${v}
      </body>
      </html>
    `),b.document.close(),b.focus(),b.print()},y=()=>{p(!0)},x=()=>{window.location.href=route("deposit-contracts.success",{id:t.id})},E=4,k=[{title:"ជ្រើសរើសអ្នកទិញ",icon:f.jsx(oe,{})},{title:"ជ្រើសរើសអ្នកលក់",icon:f.jsx(ne,{})},{title:"ជ្រើសរើសដី និងកំណត់តម្លៃ",icon:f.jsx(ae,{})},{title:"កំណត់ការកក់ប្រាក់",icon:f.jsx(se,{})},{title:"ពិនិត្យ និងបោះពុម្ព",icon:f.jsx(K,{})},{title:"បង្កើតកិច្ចសន្យា",icon:f.jsx(ce,{})}];return f.jsxs(ee,{children:[f.jsx(Z,{title:"ពិនិត្យ និងកែសម្រួលកិច្ចសន្យា"}),f.jsxs("div",{className:"container mx-auto py-6",children:[f.jsx(N,{className:"mb-6",children:f.jsx(te,{current:E,items:k,responsive:!0,className:"site-navigation-steps",size:"small"})}),f.jsxs(N,{children:[f.jsxs("div",{className:"flex justify-between items-center mb-6",children:[f.jsx(ke,{level:3,children:"ពិនិត្យ និងកែសម្រួលកិច្ចសន្យា"}),f.jsx("div",{className:"space-x-2",children:f.jsx(S,{icon:f.jsx(K,{}),onClick:y,children:"មើលជាមុន"})})]}),f.jsx("div",{className:"mb-4",children:f.jsx(_e,{apiKey:"3a2oagj6jlidp87awx07wckpgh4jl3tyqo98cw8bed3rb3cf",onInit:(v,b)=>u.current=b,initialValue:e,init:{height:800,menubar:!1,plugins:["advlist","autolink","lists","link","image","charmap","preview","anchor","searchreplace","visualblocks","code","fullscreen","insertdatetime","media","table","help","wordcount"],toolbar:"undo redo | blocks | bold italic forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | table | preview | help",content_css:!1,content_style:d,font_formats:"Koh Santepheap=Koh Santepheap,serif;Hanuman=Hanuman,serif;Khmer OS=Khmer OS,serif;",extended_valid_elements:"span[class|style],div[class|style],p[class|style],table[class|style],td[class|style],th[class|style]",valid_children:"+body[style]",verify_html:!1,entity_encoding:"raw",directionality:"ltr",setup:v=>{v.on("change",()=>{const b=v.getContent();s(b)})}}})}),f.jsxs("div",{className:"flex justify-between mt-6",children:[f.jsx(S,{onClick:x,children:"ត្រឡប់ក្រោយ"}),f.jsxs("div",{className:"space-x-2",children:[f.jsx(S,{onClick:h,loading:a,children:"រក្សាទុកព្រាង"}),f.jsx(S,{onClick:g,disabled:o,children:"បោះពុម្ព"}),f.jsx(S,{type:"primary",onClick:m,loading:o,children:"បង្កើត PDF"})]})]})]}),f.jsx(ie,{title:"មើលជាមុនកិច្ចសន្យា",open:l,onCancel:()=>p(!1),footer:[f.jsx(S,{onClick:()=>p(!1),children:"បិទ"},"close"),f.jsx(S,{onClick:g,children:"បោះពុម្ព"},"print"),f.jsx(S,{type:"primary",onClick:m,loading:o,children:"បង្កើត PDF"},"pdf")],width:"90%",style:{top:20},bodyStyle:{maxHeight:"70vh",overflow:"auto"},children:f.jsx("div",{dangerouslySetInnerHTML:{__html:e},style:{fontFamily:"Koh Santepheap, serif",lineHeight:1.6,fontSize:"14px"}})})]})]})}export{Qe as default};
