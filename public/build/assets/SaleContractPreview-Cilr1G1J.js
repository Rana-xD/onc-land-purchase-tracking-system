import{r as i,j as t,Q as h,B as o}from"./app-Cq9T9vxM.js";import{E as u,R as y}from"./Editor-DKvwFTQL.js";import{A as w,b}from"./AdminLayout-CqQNNgQt.js";import"./jspdf.es.min-Bwzmto3P.js";import{C as r}from"./index-0lybEGve.js";import{S as j}from"./index-DplbXNQy.js";import{T as k}from"./index-B236O7Xl.js";import{S as v}from"./index-B5_NNnDd.js";import{R as z}from"./ArrowLeftOutlined-y-0HxkNq.js";import{R}from"./UserOutlined-BJz0bsFe.js";import{R as S}from"./EnvironmentOutlined-CY7V_ekf.js";import{R as I}from"./DollarOutlined-CBIm1o3u.js";import{R as _}from"./FileOutlined-azBO8rMn.js";import{R as C}from"./CheckCircleOutlined-BaeYi2tI.js";import"./index-DL0uTJIv.js";import"./index-DPFVXnL-.js";import"./EllipsisOutlined-BDh9HHBq.js";import"./PurePanel-Ce8hDmce.js";import"./InboxOutlined-ZSWvT0kT.js";import"./useVariants-Ea3XEG1D.js";import"./CheckOutlined-_L7buK6x.js";import"./progress-CdXVhW7a.js";import"./EditOutlined-BcDUZ6EU.js";import"./getAllowClear-nqy4kNbo.js";const{Title:K}=k;function it({document:a,populatedTemplate:s}){const[$,N]=i.useState(!1),[p,l]=i.useState(s),m=i.useRef(null),c=`
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
      font-size: 18pt;
      font-weight: 700;
      margin-bottom: 15px;
      letter-spacing: 2px;
      text-align: center;
    }

    .contract-title {
      font-size: 16pt !important;
      font-weight: 700 !important;
      margin: 15px 0 !important;
      text-decoration: underline !important;
      text-underline-offset: 3px !important;
      text-align: center !important;
    }

    .document-container {
      max-width: 700px;
      margin: 0 auto;
      background: white;
      padding: 0;
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
      text-indent: 0;
      word-wrap: break-word;
    }

    /* Two-column flex party section structure */
    .party-section {
      margin: 20px 0;
      padding: 0;
      border: none;
      background: none;
      line-height: 1.6;
      display: flex;
      align-items: flex-start;
      gap: 5px;
    }

    .party-title {
      font-weight: 700;
      font-size: 14pt;
      flex: 0 0 auto;
      min-width: 120px;
    }

    .party-content {
      flex: 1;
    }

    .party-details {
      flex: 1;
      line-height: 1.6;
    }

    .party-form-line {
      margin: 2px 0;
      line-height: 1.6;
      display: inline;
      white-space: wrap;
    }

    .form-label {
      font-weight: 400;
      display: inline;
      margin-right: 5px;
    }

    .form-value {
      display: inline;
      border: none;
      padding: 0;
      margin: 0 3px;
      font-weight: 400;
    }

    .party-separator {
      font-weight: 600;
      margin: 15px 0;
      text-align: center;
      font-size: 14pt;
    }

    .party-designation {
      margin-top: 15px;
      font-weight: 600;
      text-align: right;
      font-style: italic;
    }

    .contract-form-field {
      display: inline;
      border: none;
      padding: 0;
      margin: 0 3px;
      font-weight: 400;
    }

    /* Reusable two-column section layout */
    .two-column-section {
      margin: 20px 0;
      padding: 0;
      border: none;
      background: none;
      line-height: 1.6;
      display: flex;
      align-items: flex-start;
      gap: 5px;
    }

    .section-label {
      font-weight: 700;
      font-size: 14pt;
      flex: 0 0 auto;
      min-width: 120px;
    }

    .section-content {
      flex: 1;
    }

    .content-line {
      margin: 2px 0;
      line-height: 1.6;
      display: inline;
      white-space: wrap;
    }

    /* Land terms section with numbered subsections */
    .land-terms-section {
      margin: 20px 0;
      line-height: 1.8;
    }

    .term-subsection {
      margin: 15px 0;
      display: flex;
      align-items: flex-start;
      gap: 10px;
    }

    .term-number {
      font-weight: 700;
      font-size: 14pt;
      flex: 0 0 auto;
      min-width: 40px;
    }

    .term-content {
      flex: 1;
      text-align: justify;
      line-height: 1.8;
    }

    .land-detail-item {
      margin: 8px 0;
      padding-left: 20px;
      text-indent: -20px;
      line-height: 1.8;
    }

    .sub-item {
      margin: 5px 0;
      padding-left: 20px;
      text-indent: -20px;
      line-height: 1.8;
    }

    /* Payment schedule section styling */
    .payment-schedule-section {
      margin: 20px 0;
    }

    .payment-schedule-section .two-column-section {
      margin: 10px 0;
    }

    .payment-schedule-section .section-label {
      font-weight: 700;
      font-size: 14pt;
      min-width: 140px;
    }

    .payment-schedule-section .content-line {
      text-align: justify;
      line-height: 1.8;
    }

    .contract-intro {
      text-align: center;
      margin: 25px 0;
      font-weight: 600;
    }

    .contract-intro p {
      text-indent: 0;
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
    }

    .land-section {
      margin: 20px 0;
    }

    .land-section p {
      text-align: justify;
      text-indent: 40px;
      line-height: 1.6;
    }

    .payment-section {
      margin: 20px 0;
    }

    .payment-section p {
      text-align: justify;
      text-indent: 40px;
      line-height: 1.6;
    }

    .payment-table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
      font-size: 12pt;
    }

    .payment-table th,
    .payment-table td {
      border: 1px solid #000;
      padding: 8px;
      text-align: center;
    }

    .payment-table th {
      background-color: #f0f0f0;
      font-weight: bold;
    }

    .witnesses {
      margin: 30px 0;
    }

    .witnesses p {
      text-align: justify;
      text-indent: 40px;
      line-height: 1.6;
    }

    .signatures {
      margin-top: 40px;
      display: flex;
      justify-content: space-between;
      flex-wrap: nowrap;
      gap: 10px;
    }

    .signature-block {
      flex: 1;
      text-align: center;
      margin-bottom: 30px;
      min-width: 0;
    }

    .signature-title {
      font-weight: bold;
      margin-bottom: 60px;
    }

    .signature-line {
      border-bottom: 1px solid #000;
      margin: 60px 0 10px 0;
    }

    /* Fingerprint section styles */
    .fingerprint-section {
      margin-top: 30px !important;
      width: 100% !important;
    }

    .fingerprint-row {
      margin-top: 30px !important;
      display: flex !important;
      justify-content: space-between !important;
      align-items: flex-start !important;
      gap: 20px !important;
      width: 100% !important;
      flex-wrap: nowrap !important;
    }

    .fingerprint-group {
      flex: 1 !important;
      text-align: center !important;
      font-size: 14pt !important;
      line-height: 1.6 !important;
      min-width: 0 !important;
      max-width: 25% !important;
    }

    .fingerprint-label {
      font-weight: 700 !important;
      margin-bottom: 20px !important;
      display: block !important;
      font-size: 14pt !important;
    }

    .fingerprint-box {
      width: 80px !important;
      height: 80px !important;
      margin: 0 auto 10px auto !important;
      display: block !important;
      border: 1px solid transparent !important;
    }

    .signature-line {
      width: 100px !important;
      height: 2px !important;
      border-bottom: 1px dotted #000 !important;
      margin: 10px auto !important;
      display: block !important;
    }

    @media print {
      body {
        padding: 20mm !important;
        font-size: 12pt !important;
      }
      
      .document-container {
        max-width: none !important;
        margin: 0 !important;
        padding: 0 !important;
      }
      
      .party-info p {
        text-indent: 50px !important;
      }
      
      .additional-terms p {
        text-indent: 40px !important;
      }
      
      .land-section p {
        text-indent: 40px !important;
      }
      
      .payment-section p {
        text-indent: 40px !important;
      }
      
      .witnesses p {
        text-indent: 40px !important;
      }
    }
  `,d=4,g=[{title:"ជ្រើសរើសអ្នកទិញ",status:"finish",icon:t.jsx(R,{})},{title:"ជ្រើសរើសអ្នកលក់",status:"finish",icon:t.jsx(b,{})},{title:"ជ្រើសរើសដី",status:"finish",icon:t.jsx(S,{})},{title:"ការបង់ប្រាក់",status:"finish",icon:t.jsx(I,{})},{title:"ពិនិត្យកិច្ចសន្យា",status:"process",icon:t.jsx(_,{})},{title:"បញ្ចប់",status:"wait",icon:t.jsx(C,{})}],x=()=>{const e=`/api/sale-contracts/${a.id}/print-pdf`;window.open(e,"_blank")},f=()=>{window.location.href=route("sale-contracts.success",{id:a.id})};return t.jsxs(w,{children:[t.jsx(h,{title:"ពិនិត្យ និងកែសម្រួលកិច្ចសន្យាលក់ដី"}),t.jsxs("div",{className:"container mx-auto py-6",children:[t.jsx(r,{className:"mb-6",children:t.jsx(j,{current:d,items:g,responsive:!0,className:"site-navigation-steps",size:"small"})}),t.jsxs(r,{children:[t.jsx("div",{className:"flex justify-between items-center mb-6",children:t.jsx(K,{level:3,children:"ពិនិត្យ និងកែសម្រួលកិច្ចសន្យាលក់ដី"})}),t.jsx("div",{className:"mb-4",children:t.jsx(u,{apiKey:"3a2oagj6jlidp87awx07wckpgh4jl3tyqo98cw8bed3rb3cf",onInit:(e,n)=>m.current=n,initialValue:p,init:{height:800,menubar:!1,plugins:["advlist","autolink","lists","link","image","charmap","preview","anchor","searchreplace","visualblocks","code","fullscreen","insertdatetime","media","table","help","wordcount"],toolbar:"undo redo | blocks | bold italic forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | table | preview | help",content_css:!1,content_style:c,font_formats:"Koh Santepheap=Koh Santepheap,serif;Hanuman=Hanuman,serif;Khmer OS=Khmer OS,serif;",extended_valid_elements:"span[class|style],div[class|style],p[class|style],table[class|style],td[class|style],th[class|style]",valid_children:"+body[style]",verify_html:!1,entity_encoding:"raw",directionality:"ltr",setup:e=>{e.on("change",()=>{const n=e.getContent();l(n)})}}})}),t.jsx("div",{className:"flex justify-between mt-6",children:t.jsxs(v,{size:"middle",children:[t.jsx(o,{type:"primary",icon:t.jsx(y,{}),onClick:x,size:"large",children:"បោះពុម្ព"}),t.jsx(o,{type:"default",icon:t.jsx(z,{}),onClick:f,size:"large",children:"ត្រឡប់ក្រោយ"})]})})]})]})]})}export{it as default};
