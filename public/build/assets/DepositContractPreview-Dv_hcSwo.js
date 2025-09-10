import{r as i,I as u,_ as b,j as t,Q as w,B as p}from"./app-C0Remzwy.js";import{E as y}from"./Editor-CaJZoriW.js";import{A as j,b as v}from"./AdminLayout-6aB_fSHs.js";import"./jspdf.es.min-A-vskxt_.js";import{C as m}from"./index-Cfi4PyFn.js";import{S as k}from"./index-D8QTW78o.js";import{T as z}from"./index-_bYnS0vO.js";import{S}from"./index-BC2OOC4T.js";import{R as K}from"./ArrowLeftOutlined-DRgoYYyr.js";import{R}from"./UserOutlined-9GEWtyEU.js";import{R as H}from"./EnvironmentOutlined-Dg-c_VSb.js";import{R as I}from"./DollarOutlined-DplF-jS5.js";import{R as _}from"./EyeOutlined-6voGcLSB.js";import{R as O}from"./FileOutlined-Db19IYhn.js";import"./index-DQID86bo.js";import"./index-BkeYX-_W.js";import"./EllipsisOutlined-BvAucnIs.js";import"./PurePanel-LERcE_NN.js";import"./InboxOutlined-C_72B7nY.js";import"./useVariants-WSvFAMWE.js";import"./CheckOutlined-CBgC1XT7.js";import"./progress-DpSHyWCv.js";import"./EditOutlined-Kmrbx6Vn.js";import"./getAllowClear-Ch9so_13.js";var $={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M820 436h-40c-4.4 0-8 3.6-8 8v40c0 4.4 3.6 8 8 8h40c4.4 0 8-3.6 8-8v-40c0-4.4-3.6-8-8-8zm32-104H732V120c0-4.4-3.6-8-8-8H300c-4.4 0-8 3.6-8 8v212H172c-44.2 0-80 35.8-80 80v328c0 17.7 14.3 32 32 32h168v132c0 4.4 3.6 8 8 8h424c4.4 0 8-3.6 8-8V772h168c17.7 0 32-14.3 32-32V412c0-44.2-35.8-80-80-80zM360 180h304v152H360V180zm304 664H360V568h304v276zm200-140H732V500H292v204H160V412c0-6.6 5.4-12 12-12h680c6.6 0 12 5.4 12 12v292z"}}]},name:"printer",theme:"outlined"},C=function(a,r){return i.createElement(u,b({},a,{ref:r,icon:$}))},V=i.forwardRef(C);const{Title:E}=z;function pt({document:e,populatedTemplate:a}){const[r,N]=i.useState(!1),[l,s]=i.useState(a),g=i.useRef(null),d=`
    @import url('https://fonts.googleapis.com/css2?family=Koh+Santepheap:wght@100;300;400;700;900&display=swap');

    body {
      font-family: 'Koh Santepheap', 'Khmer OS', 'Hanuman', serif !important;
      line-height: 1.6;
      margin: 0;
      padding: 40px 20px;
      background: white;
      color: #000;
      font-size: 14pt;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      text-rendering: optimizeLegibility;
    }
    .indent-text {
      text-indent: 50px;
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
    }

    .kingdom-title {
      font-size: 18pt;
      font-weight: 700;
      margin-bottom: 5px;
      text-align: center;
    }

    .nation-religion-king {
      font-size: 14pt;
      margin-bottom: 5px;
      text-align: center;
    }

    .contract-title {
      font-size: 16pt;
      font-weight: 700;
      margin: 15px 0;
      text-decoration: underline;
      text-underline-offset: 3px;
      text-align: center;
    }

    .party-info {
      margin: 15px 0;
      background: none;
      border: none;
      padding: 0;
    }

    .party-info p {
      margin: 0;
      text-align: justify;
      line-height: 1.6;
      text-indent: 50px;
      word-wrap: break-word;
    }

    .contract-intro {
      text-align: center;
      margin: 25px 0;
      font-weight: 600;
    }

    .contract-intro p {
     text-align: center;
      margin: 0;
    }

    .land-section {
      margin: 20px 0;
      text-align: justify;
    }

    .land-section p {
      text-indent: 40px;
      margin: 15px 0;
      line-height: 1.6;
    }

    .land-details, .conditions {
      list-style: none;
      padding-left: 0;
      margin: 15px 0;
    }

    .land-details li, .conditions li {
      margin: 10px 0;
      padding-left: 50px;
      text-indent: -30px;
      line-height: 1.6;
      text-align: justify;
    }

    .land-details li:before, .conditions li:before {
      content: "- ";
      font-weight: bold;
      margin-right: 10px;
    }

    strong {
      font-weight: 700;
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

    .fingerprint-section {
      margin-top: 40px;
      page-break-inside: avoid;
    }

    .fingerprint-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-top: 30px;
    }

    .fingerprint-group {
      flex: 1;
      text-align: center;
      margin: 0 10px;
    }

    .fingerprint-label {
      font-size: 12pt;
      margin-bottom: 10px;
      font-weight: 600;
    }

    .fingerprint-box {
      width: 120px;
      height: 120px;
      margin: 0 auto 10px auto;
      display: block;
    }

    .signature-line {
      width: 120px;
      height: 2px;
      border-bottom: 1px dotted #000;
      margin: 10px auto;
      display: block;
    }

    p {
      margin: 12px 0;
      text-align: justify;
      line-height: 1.6;
    }

    p, div, span, td, th, li, h1, h2, h3, h4, h5, h6 {
      font-family: 'Koh Santepheap', 'Khmer OS', 'Hanuman', serif !important;
      letter-spacing: 0.3px;
    }

    .document-container {
      max-width: 700px;
      margin: 0 auto;
      background: white;
      padding: 0;
      box-shadow: none;
    }

    @media print {
      @import url('https://fonts.googleapis.com/css2?family=Koh+Santepheap:wght@100;300;400;700;900&display=swap');
      
      * {
        -webkit-print-color-adjust: exact !important;
        color-adjust: exact !important;
      }
      
      body {
        font-family: 'Koh Santepheap', 'Khmer OS', 'Hanuman', serif !important;
        font-size: 14pt !important;
        line-height: 1.6 !important;
        padding: 40px 20px !important;
        margin: 0 !important;
        background: white !important;
        color: #000 !important;
        -webkit-font-smoothing: antialiased !important;
        -moz-osx-font-smoothing: grayscale !important;
        text-rendering: optimizeLegibility !important;
      }
      
      .document-container {
        box-shadow: none !important;
        max-width: none !important;
        padding: 0 !important;
        margin: 0 !important;
      }

      h1 {
        font-size: 18pt !important;
        font-weight: 700 !important;
        margin: 15px 0 10px 0 !important;
        letter-spacing: 0.5px !important;
        text-align: center !important;
      }

      h2 {
        font-size: 18pt !important;
        font-weight: 400 !important;
        margin: 8px 0 !important;
        text-align: center !important;
      }

      h3 {
        font-size: 16pt !important;
        font-weight: 700 !important;
        text-decoration: underline !important;
        margin: 20px 0 15px 0 !important;
        text-underline-offset: 3px !important;
        text-align: center !important;
      }

      p {
        margin: 12px 0 !important;
        text-align: justify !important;
        text-indent: 40px !important;
        line-height: 1.6 !important;
      }

      .contract-intro p {
        text-align: center !important;
        margin: 25px 0 !important;
        font-weight: 600 !important;
        text-indent: 0 !important;
      }

      .party-info p {
        margin: 0 !important;
        text-align: justify !important;
        line-height: 1.6 !important;
        text-indent: 50px !important;
      }

      ul {
        list-style: none !important;
        padding-left: 0 !important;
      }

      ul li {
        margin: 12px 0 !important;
        padding-left: 50px !important;
        text-indent: -30px !important;
        line-height: 1.6 !important;
      }

      ul li:before {
        content: "- " !important;
        font-weight: bold !important;
        margin-right: 10px !important;
      }

      table {
        width: 100% !important;
        border-collapse: collapse !important;
        margin: 20px 0 !important;
      }

      table td, table th {
        border: 1px solid #000 !important;
        padding: 8px 12px !important;
        text-align: left !important;
        font-size: 14pt !important;
      }

      table th {
        font-weight: 700 !important;
        background-color: #f5f5f5 !important;
      }

      .fingerprint-row {
        margin-top: 30px !important;
        display: flex !important;
        justify-content: space-between !important;
        align-items: flex-end !important;
        gap: 10px !important;
        page-break-inside: avoid !important;
      }

      .fingerprint-group {
        flex: 1 !important;
        text-align: center !important;
        font-size: 14pt !important;
        line-height: 1.6 !important;
      }

      .fingerprint-label {
        font-weight: 700 !important;
        margin-bottom: 20px !important;
        display: block !important;
        font-size: 14pt !important;
      }

      .fingerprint-box {
        width: 120px !important;
        height: 120px !important;
        margin: 0 auto 10px auto !important;
        display: block !important;
      }

      .signature-line {
        width: 120px !important;
        height: 2px !important;
        border-bottom: 1px dotted #000 !important;
        margin: 10px auto !important;
        display: block !important;
      }

      .date-location {
        text-align: center !important;
        margin: 20px 0 !important;
        font-weight: 600 !important;
      }

      .contract-date {
        text-align: center !important;
        margin: 20px 0 !important;
        font-weight: 600 !important;
      }

      /* Ensure all elements use proper Khmer typography */
      p, div, span, td, th, li, h1, h2, h3, h4, h5, h6 {
        font-family: 'Koh Santepheap', 'Khmer OS', 'Hanuman', serif !important;
        letter-spacing: 0.3px !important;
      }
      
      .header {
        text-align: center !important;
        margin-bottom: 30px !important;
      }
      
      .kingdom-title {
        font-size: 18pt !important;
        font-weight: 700 !important;
        margin-bottom: 5px !important;
        text-align: center !important;
      }
      
      .nation-religion-king {
        font-size: 18pt !important;
        margin-bottom: 5px !important;
        text-align: center !important;
      }
      
      .contract-title {
        font-size: 16pt !important;
        font-weight: 700 !important;
        margin: 15px 0 !important;
        text-decoration: underline !important;
        text-underline-offset: 3px !important;
        text-align: center !important;
      }
      
      .party-info {
        margin: 15px 0 !important;
        background: none !important;
        border: none !important;
        padding: 0 !important;
      }
      
      .party-info p {
        margin: 0 !important;
        text-align: justify !important;
        line-height: 1.6 !important;
        text-indent: 50px !important;
        word-wrap: break-word !important;
      }
      
      .contract-intro {
        text-align: center !important;
        margin: 25px 0 !important;
        font-weight: 600 !important;
      }
      
      .contract-intro p {
        text-indent: 0 !important;
        margin: 0 !important;
      }
      
      .land-section {
        margin: 20px 0 !important;
        text-align: justify !important;
      }
      
      .land-section p {
        text-indent: 40px !important;
        margin: 15px 0 !important;
        line-height: 1.6 !important;
      }
      
      .land-details, .conditions {
        list-style: none !important;
        padding-left: 0 !important;
        margin: 15px 0 !important;
      }
      
      .land-details li, .conditions li {
        margin: 10px 0 !important;
        padding-left: 50px !important;
        text-indent: -30px !important;
        line-height: 1.6 !important;
        text-align: justify !important;
      }
      
      .land-details li:before, .conditions li:before {
        content: "- " !important;
        font-weight: bold !important;
        margin-right: 10px !important;
      }
      
      .date-location {
        text-align: justify !important;
        margin: 20px 0 !important;
      }
      
      .date-location p {
        text-indent: 40px !important;
        line-height: 1.6 !important;
      }
      
      .additional-terms {
        margin: 20px 0 !important;
        text-align: justify !important;
      }
      
      .additional-terms p {
        text-indent: 40px !important;
        line-height: 1.6 !important;
      }
      
      .contract-date {
        margin: 30px 0 !important;
      }
      
      .contract-date p {
        text-align: center !important;
        font-weight: 600 !important;
        text-indent: 0 !important;
        margin: 0 !important;
      }
      
      .fingerprint-section {
        margin-top: 40px !important;
        page-break-inside: avoid !important;
      }
      
      .fingerprint-row {
        display: flex !important;
        justify-content: space-between !important;
        align-items: flex-end !important;
        margin-top: 30px !important;
      }
      
      .fingerprint-group {
        flex: 1 !important;
        text-align: center !important;
        margin: 0 10px !important;
      }
      
      .fingerprint-label {
        font-size: 12pt !important;
        margin-bottom: 10px !important;
        font-weight: 600 !important;
      }
      
      .fingerprint-box {
        width: 80px !important;
        height: 120px !important;
        margin: 10px auto !important;
        border: 1px solid #000 !important;
      }
      
      .signature-line {
        margin-top: 15px !important;
        padding-top: 5px !important;
        border-top: 1px dotted #333 !important;
        font-size: 11pt !important;
        min-height: 20px !important;
      }
      
      p, div, span, td, th, li, h1, h2, h3, h4, h5, h6 {
        font-family: 'Koh Santepheap', 'Khmer OS', 'Hanuman', serif !important;
        letter-spacing: 0.3px !important;
      }
      
      strong {
        font-weight: 700 !important;
      }
    }
  `,c=()=>{const n=`/api/deposit-contracts/${e.id}/print-pdf`;window.open(n,"_blank")},x=()=>{window.location.href=route("deposit-contracts.success",{id:e.id})},h=4,f=[{title:"ជ្រើសរើសអ្នកទិញ",icon:t.jsx(R,{})},{title:"ជ្រើសរើសអ្នកលក់",icon:t.jsx(v,{})},{title:"ជ្រើសរើសដី និងកំណត់តម្លៃ",icon:t.jsx(H,{})},{title:"កំណត់ការកក់ប្រាក់",icon:t.jsx(I,{})},{title:"ពិនិត្យ និងបោះពុម្ព",icon:t.jsx(_,{})},{title:"បង្កើតកិច្ចសន្យា",icon:t.jsx(O,{})}];return t.jsxs(j,{children:[t.jsx(w,{title:"ពិនិត្យ និងកែសម្រួលកិច្ចសន្យា"}),t.jsxs("div",{className:"container mx-auto py-6",children:[t.jsx(m,{className:"mb-6",children:t.jsx(k,{current:h,items:f,responsive:!0,className:"site-navigation-steps",size:"small"})}),t.jsxs(m,{children:[t.jsx("div",{className:"flex justify-between items-center mb-6",children:t.jsx(E,{level:3,children:"ពិនិត្យ និងកែសម្រួលកិច្ចសន្យា"})}),t.jsx("div",{className:"mb-4",children:t.jsx(y,{apiKey:"3a2oagj6jlidp87awx07wckpgh4jl3tyqo98cw8bed3rb3cf",onInit:(n,o)=>g.current=o,initialValue:l,init:{height:800,menubar:!1,plugins:["advlist","autolink","lists","link","image","charmap","preview","anchor","searchreplace","visualblocks","code","fullscreen","insertdatetime","media","table","help","wordcount"],toolbar:"undo redo | blocks | bold italic forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | table | preview | help",content_css:!1,content_style:d,font_formats:"Koh Santepheap=Koh Santepheap,serif;Hanuman=Hanuman,serif;Khmer OS=Khmer OS,serif;",extended_valid_elements:"span[class|style],div[class|style],p[class|style],table[class|style],td[class|style],th[class|style]",valid_children:"+body[style]",verify_html:!1,entity_encoding:"raw",directionality:"ltr",setup:n=>{n.on("change",()=>{const o=n.getContent();s(o)})}}})}),t.jsx("div",{className:"flex justify-between mt-6",children:t.jsxs(S,{size:"middle",children:[t.jsx(p,{type:"primary",icon:t.jsx(V,{}),onClick:c,size:"large",children:"បោះពុម្ព"}),t.jsx(p,{type:"default",icon:t.jsx(K,{}),onClick:x,size:"large",children:"ត្រឡប់ក្រោយ"})]})})]})]})]})}export{pt as default};
