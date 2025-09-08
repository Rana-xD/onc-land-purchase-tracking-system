import{r as p,j as t,Q as E,B as o,s as r,a as u}from"./app-BB1ZxGmZ.js";import{E as P}from"./Editor-DzAQuFDD.js";import{A as D,b as H}from"./AdminLayout-BuxP0tGi.js";import"./jspdf.es.min-CJB1dIXq.js";import{C as y}from"./index-CFcJuZ_P.js";import{S as I}from"./index-CQIrajnk.js";import{T as N}from"./index-4sotxCPT.js";import{R as b}from"./EyeOutlined-Mb1FRF2d.js";import{M as O}from"./index-Yxxb-zBk.js";import{R as F}from"./UserOutlined-DbziX9m8.js";import{R as T}from"./EnvironmentOutlined-DqZQt_HU.js";import{R as L}from"./DollarOutlined-zLsc4o38.js";import{R as M}from"./FileOutlined-BQmENh8X.js";import"./index-BAJJZILe.js";import"./index-Dh1oKUG_.js";import"./EllipsisOutlined-BovgqE1k.js";import"./PurePanel-C84SwQv1.js";import"./index-19zJLVvd.js";import"./InboxOutlined-DQe2Aezk.js";import"./useVariants-CY_Kcp5K.js";import"./CheckOutlined-bJGhASa0.js";import"./progress-D37wmuzZ.js";import"./EditOutlined-DBTY11ET.js";import"./getAllowClear-DfqxFJiv.js";const{Title:B}=N;function gt({document:e,populatedTemplate:w}){const[s,m]=p.useState(!1),[j,d]=p.useState(!1),[c,g]=p.useState(w),[k,l]=p.useState(!1),a=p.useRef(null),v=`
    @import url('https://fonts.googleapis.com/css2?family=Koh+Santepheap:wght@100;300;400;700;900&display=swap');

    body {
      font-family: 'Koh Santepheap', 'Khmer OS', 'Hanuman', serif !important;
      line-height: 1.6;
      margin: 0;
      padding: 40px 60px;
      background: white;
      color: #000;
      font-size: 14pt;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      text-rendering: optimizeLegibility;
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
      text-indent: 0;
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

    .date-location {
      text-align: justify;
      margin: 20px 0;
    }

    .date-location p {
      text-indent: 40px;
      line-height: 1.6;
    }

    .additional-terms {
      margin: 20px 0;
      text-align: justify;
    }

    .additional-terms p {
      text-indent: 40px;
      line-height: 1.6;
    }

    .contract-date {
      margin: 30px 0;
    }

    .contract-date p {
      text-align: center;
      font-weight: 600;
      text-indent: 0;
      margin: 0;
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
      width: 80px;
      height: 120px;
      margin: 10px auto;
    }

    .signature-line {
      margin-top: 15px;
      padding-top: 5px;
      border-top: 1px dotted #333;
      font-size: 11pt;
      min-height: 20px;
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
      text-align: center;
    }

    .nation-religion-king {
      font-size: 20pt;
      font-weight: 700;
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

    strong {
      font-weight: 700;
    }

    @media print {
      * {
        -webkit-print-color-adjust: exact !important;
        color-adjust: exact !important;
      }
      
      body {
        font-family: 'Koh Santepheap', 'Khmer OS', 'Hanuman', serif !important;
        font-size: 14pt !important;
        line-height: 1.6 !important;
        padding: 20mm !important;
        margin: 0 !important;
        background: white !important;
        color: #000 !important;
      }
      
      .document-container {
        box-shadow: none !important;
        max-width: 700px !important;
        padding: 0 !important;
        margin: 0 auto !important;
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
        font-size: 14pt !important;
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
  `,S=async()=>{if(!a.current){r.error("Editor not ready");return}d(!0);try{const n=a.current.getContent();await u.post(`/api/deposit-contracts/${e.id}/save-document`,{content:n}),g(n),r.success("ព្រាងកិច្ចសន្យាត្រូវបានរក្សាទុកដោយជោគជ័យ")}catch(n){console.error("Error saving document:",n),r.error("មានបញ្ហាក្នុងការរក្សាទុកព្រាង")}finally{d(!1)}},x=async()=>{if(!a.current){r.error("Editor not ready");return}m(!0);try{const n=a.current.getContent(),i=e.document_type||"deposit_contract",$=i==="sale_contract"?`/api/sale-contracts/${e.id}/save-document`:`/api/deposit-contracts/${e.id}/save-document`;await u.post($,{content:n});const h=`${i}_${e.id}_${new Date().toISOString().slice(0,10)}.pdf`,R=i==="sale_contract"?`/api/sale-contracts/${e.id}/generate-pdf?download=${h}`:`/api/deposit-contracts/${e.id}/generate-pdf?download=${h}`;window.location.href=R,r.success("PDF ត្រូវបានបង្កើតដោយជោគជ័យ")}catch(n){console.error("Error generating PDF:",n),r.error("មានបញ្ហាក្នុងការបង្កើត PDF")}finally{m(!1)}},f=()=>{if(!a.current){r.error("Editor not ready");return}const n=a.current.getContent(),i=window.open("","_blank");i.document.write(`
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
        ${n}
      </body>
      </html>
    `),i.document.close(),i.focus(),i.print()},C=()=>{l(!0)},z=()=>{window.location.href=route("deposit-contracts.success",{id:e.id})},K=4,_=[{title:"ជ្រើសរើសអ្នកទិញ",icon:t.jsx(F,{})},{title:"ជ្រើសរើសអ្នកលក់",icon:t.jsx(H,{})},{title:"ជ្រើសរើសដី និងកំណត់តម្លៃ",icon:t.jsx(T,{})},{title:"កំណត់ការកក់ប្រាក់",icon:t.jsx(L,{})},{title:"ពិនិត្យ និងបោះពុម្ព",icon:t.jsx(b,{})},{title:"បង្កើតកិច្ចសន្យា",icon:t.jsx(M,{})}];return t.jsxs(D,{children:[t.jsx(E,{title:"ពិនិត្យ និងកែសម្រួលកិច្ចសន្យា"}),t.jsxs("div",{className:"container mx-auto py-6",children:[t.jsx(y,{className:"mb-6",children:t.jsx(I,{current:K,items:_,responsive:!0,className:"site-navigation-steps",size:"small"})}),t.jsxs(y,{children:[t.jsxs("div",{className:"flex justify-between items-center mb-6",children:[t.jsx(B,{level:3,children:"ពិនិត្យ និងកែសម្រួលកិច្ចសន្យា"}),t.jsx("div",{className:"space-x-2",children:t.jsx(o,{icon:t.jsx(b,{}),onClick:C,children:"មើលជាមុន"})})]}),t.jsx("div",{className:"mb-4",children:t.jsx(P,{apiKey:"3a2oagj6jlidp87awx07wckpgh4jl3tyqo98cw8bed3rb3cf",onInit:(n,i)=>a.current=i,initialValue:c,init:{height:800,menubar:!1,plugins:["advlist","autolink","lists","link","image","charmap","preview","anchor","searchreplace","visualblocks","code","fullscreen","insertdatetime","media","table","help","wordcount"],toolbar:"undo redo | blocks | bold italic forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | table | preview | help",content_css:!1,content_style:v,font_formats:"Koh Santepheap=Koh Santepheap,serif;Hanuman=Hanuman,serif;Khmer OS=Khmer OS,serif;",extended_valid_elements:"span[class|style],div[class|style],p[class|style],table[class|style],td[class|style],th[class|style]",valid_children:"+body[style]",verify_html:!1,entity_encoding:"raw",directionality:"ltr",setup:n=>{n.on("change",()=>{const i=n.getContent();g(i)})}}})}),t.jsxs("div",{className:"flex justify-between mt-6",children:[t.jsx(o,{onClick:z,children:"ត្រឡប់ក្រោយ"}),t.jsxs("div",{className:"space-x-2",children:[t.jsx(o,{onClick:S,loading:j,children:"រក្សាទុកព្រាង"}),t.jsx(o,{onClick:f,disabled:s,children:"បោះពុម្ព"}),t.jsx(o,{type:"primary",onClick:x,loading:s,children:"បង្កើត PDF"})]})]})]}),t.jsx(O,{title:"មើលជាមុនកិច្ចសន្យា",open:k,onCancel:()=>l(!1),footer:[t.jsx(o,{onClick:()=>l(!1),children:"បិទ"},"close"),t.jsx(o,{onClick:f,children:"បោះពុម្ព"},"print"),t.jsx(o,{type:"primary",onClick:x,loading:s,children:"បង្កើត PDF"},"pdf")],width:"90%",style:{top:20},bodyStyle:{maxHeight:"70vh",overflow:"auto"},children:t.jsx("div",{dangerouslySetInnerHTML:{__html:c},style:{fontFamily:"Koh Santepheap, serif",lineHeight:1.6,fontSize:"14px"}})})]})]})}export{gt as default};
