import{r as e,j as t,Q as f,B as o}from"./app-mk9C7I_N.js";import{E as u,R as b}from"./Editor-D8mkaawh.js";import{A as y,b as w}from"./AdminLayout-CSpn-5iP.js";import"./jspdf.es.min-z82NCby0.js";import{C as r}from"./index-DZTYDYFc.js";import{S as j}from"./index-Bt0eMnk-.js";import{T as k}from"./index-DDFZ7dy0.js";import{S as z}from"./index-pKRxIKW4.js";import{R as v}from"./ArrowLeftOutlined-cOBH5Dj-.js";import{R as S}from"./UserOutlined-Do6ZzMFA.js";import{R as K}from"./EnvironmentOutlined-BBKlLrzd.js";import{R}from"./DollarOutlined-Db7zyGBC.js";import{R as C}from"./EyeOutlined-CQ17cMyg.js";import{R as I}from"./FileOutlined-BPRx6OYG.js";import"./index-D66KGu5D.js";import"./index-phC_QXgK.js";import"./EllipsisOutlined-DwAdn_jY.js";import"./PurePanel-Bwrv9FGC.js";import"./InboxOutlined-CDGQXwno.js";import"./useVariants-BUy45nvZ.js";import"./CheckOutlined-CeCjh9xi.js";import"./progress-DvkafPop.js";import"./EditOutlined-CkdCVUZ6.js";import"./getAllowClear-BGHWSs2V.js";const{Title:_}=k;function et({document:a,populatedTemplate:p}){const[$,H]=e.useState(!1),[m,l]=e.useState(p),s=e.useRef(null),g=`
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

    .party-title {
      font-weight: 700;
      font-size: 13pt;
      flex: 0 0 auto;
      min-width: 100px
    }

    .party-info {
      margin: 15px 0;
      line-height: 1.6;
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

    /* Two-column section layout */
    .two-column-section {
      margin: 15px 0;
      padding: 0;
      border: none;
      background: none;
      line-height: 1.4;
      display: flex;
      align-items: baseline;
      gap: 5px;
    }

    .section-label {
      font-weight: 700;
      font-size: 13pt;
      flex: 0 0 auto;
      min-width: 100px;
    }

    .section-content {
      flex: 1;
    }

    .content-line {
      margin: 1px 0;
      line-height: 1.4;
      display: inline;
      white-space: wrap;
    }

    /* Sale contract party sections - continuous text format */
    .party-section {
      margin: 15px 0;
      padding: 0;
      border: none;
      background: none;
      line-height: 1.4;
      display: flex;
      align-items: baseline;
      gap: 5px;
    }

    .party-content {
      flex: 1;
      text-align: justify;
    }

    .party-form-line {
      display: inline;
      line-height: 1.4;
    }

    /* Land terms section with numbered subsections */
    .land-terms-section {
      margin: 15px 0;
      line-height: 1.5;
    }

    .term-subsection {
      margin: 10px 0;
      display: flex;
      align-items: flex-start;
      gap: 8px;
    }

    .term-number {
      font-weight: 700;
      font-size: 13pt;
      flex: 0 0 auto;
      min-width: 35px;
    }

    .term-content {
      flex: 1;
      text-align: justify;
      line-height: 1.5;
    }

    .land-detail-item {
      margin: 6px 0;
      padding-left: 15px;
      text-indent: -15px;
      line-height: 1.5;
    }

    .sub-item {
      margin: 4px 0;
      padding-left: 15px;
      text-indent: -15px;
      line-height: 1.5;
    }

    /* Payment schedule section styling */
    .payment-schedule-section {
      margin: 15px 0;
    }

    .payment-schedule-section .two-column-section {
      margin: 8px 0;
    }

    .payment-schedule-section .section-label {
      font-weight: 700;
      font-size: 13pt;
      min-width: 120px;
    }

    .payment-schedule-section .content-line {
      text-align: justify;
      line-height: 1.5;
    }

    /* Agreement sections */
    .third-agreement-section,
    .fourth-agreement-section,
    .fifth-agreement-section,
    .sixth-agreement-section {
      margin: 8px 0;
    }

    .obligation-item,
    .fault-item,
    .provision-item {
      margin: 6px 0;
      text-align: justify;
      line-height: 1.4;
    }

    /* Center paragraph spacing fix */
    p[style*="text-align: center"] {
      margin: 10px 0 10px 0;
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
      font-size: 13pt;
      margin-bottom: 15px;
      font-weight: 700;
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
        font-size: 13pt !important;
        line-height: 1.4 !important;
        padding: 15px 5px !important;
        margin: 0 !important;
        background: white !important;
        color: #000 !important;
        -webkit-font-smoothing: antialiased !important;
        -moz-osx-font-smoothing: grayscale !important;
        text-rendering: optimizeLegibility !important;
      }
      
      .document-container {
        box-shadow: none !important;
        max-width: 100% !important;
        width: 100% !important;
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
        display: inline-block !important;
        width: 24% !important;
        text-align: center !important;
        vertical-align: bottom !important;
        font-size: 11pt !important;
        margin-right: 1% !important;
      }

      .fingerprint-label {
        font-weight: 700 !important;
        margin-bottom: 15px !important;
        display: block !important;
        font-size: 13pt !important;
      }

      .fingerprint-box {
        width: 120px !important;
        height: 120px !important;
        margin: 0 auto 10px auto !important;
        display: block !important;
      }

      .signature-line {
        width: 90px !important;
        height: 2px !important;
        border-bottom: 1px dotted #000 !important;
        margin: 8px auto !important;
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
        line-height: 1.6 !important;
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
      
      /* Two-column section layout */
      .two-column-section {
        margin: 15px 0 !important;
        padding: 0 !important;
        border: none !important;
        background: none !important;
        line-height: 1.4 !important;
        display: flex !important;
        align-items: baseline !important;
        gap: 5px !important;
      }
      
      .section-label {
        font-weight: 700 !important;
        font-size: 13pt !important;
        flex: 0 0 auto !important;
        min-width: 100px !important;
      }
      
      .section-content {
        flex: 1 !important;
      }
      
      .content-line {
        margin: 1px 0 !important;
        line-height: 1.4 !important;
        display: inline !important;
        white-space: wrap !important;
      }
      
      /* Sale contract party sections - continuous text format */
      .party-section {
        margin: 15px 0 !important;
        padding: 0 !important;
        border: none !important;
        background: none !important;
        line-height: 1.4 !important;
        display: flex !important;
        align-items: baseline !important;
        gap: 5px !important;
      }
      
      .party-content {
        flex: 1 !important;
        text-align: justify !important;
      }
      
      .party-form-line {
        display: inline !important;
        line-height: 1.4 !important;
      }
      
      /* Land terms section with numbered subsections */
      .land-terms-section {
        margin: 15px 0 !important;
        line-height: 1.5 !important;
      }
      
      .term-subsection {
        margin: 10px 0 !important;
        display: flex !important;
        align-items: flex-start !important;
        gap: 8px !important;
      }
      
      .term-number {
        font-weight: 700 !important;
        font-size: 13pt !important;
        flex: 0 0 auto !important;
        min-width: 35px !important;
      }
      
      .term-content {
        flex: 1 !important;
        text-align: justify !important;
        line-height: 1.5 !important;
      }
      
      .land-detail-item {
        margin: 6px 0 !important;
        padding-left: 15px !important;
        text-indent: -15px !important;
        line-height: 1.5 !important;
      }
      
      .sub-item {
        margin: 4px 0 !important;
        padding-left: 15px !important;
        text-indent: -15px !important;
        line-height: 1.5 !important;
      }
      
      /* Payment schedule section styling */
      .payment-schedule-section {
        margin: 15px 0 !important;
      }
      
      .payment-schedule-section .two-column-section {
        margin: 8px 0 !important;
      }
      
      .payment-schedule-section .section-label {
        font-weight: 700 !important;
        font-size: 13pt !important;
        min-width: 120px !important;
      }
      
      .payment-schedule-section .content-line {
        text-align: justify !important;
        line-height: 1.5 !important;
      }
      
      /* Agreement sections */
      .third-agreement-section,
      .fourth-agreement-section,
      .fifth-agreement-section,
      .sixth-agreement-section {
        margin: 8px 0 !important;
      }
      
      .obligation-item,
      .fault-item,
      .provision-item {
        margin: 6px 0 !important;
        text-align: justify !important;
        line-height: 1.4 !important;
      }
      
      /* Center paragraph spacing fix */
      p[style*="text-align: center"] {
        margin: 10px 0 10px 0 !important;
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
      
      .signatures,
      .fingerprint-section {
        page-break-inside: avoid !important;
      }
      
      .fingerprint-row {
        margin-top: 20px !important;
        font-size: 0 !important;
        white-space: nowrap !important;
      }
      
      .fingerprint-group {
        flex: 1 !important;
        text-align: center !important;
        margin: 0 10px !important;
      }
      
      .fingerprint-label {
        font-size: 13pt !important;
        margin-bottom: 15px !important;
        font-weight: 700 !important;
      }
      
      .fingerprint-box {
        width: 70px !important;
        height: 120px !important;
        margin: 0 auto 8px auto !important;
        display: block !important;
        border: 1px solid transparent !important;
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
  `,x=()=>{const n=`/api/deposit-contracts/${a.id}/print-pdf`;window.open(n,"_blank")},d=()=>{window.location.href=route("deposit-contracts.success",{id:a.id})},c=4,h=[{title:"ជ្រើសរើសអ្នកទិញ",icon:t.jsx(S,{})},{title:"ជ្រើសរើសអ្នកលក់",icon:t.jsx(w,{})},{title:"ជ្រើសរើសដី និងកំណត់តម្លៃ",icon:t.jsx(K,{})},{title:"កំណត់ការកក់ប្រាក់",icon:t.jsx(R,{})},{title:"ពិនិត្យ និងបោះពុម្ព",icon:t.jsx(C,{})},{title:"បង្កើតកិច្ចសន្យា",icon:t.jsx(I,{})}];return t.jsxs(y,{children:[t.jsx(f,{title:"ពិនិត្យ និងកែសម្រួលកិច្ចសន្យា"}),t.jsxs("div",{className:"container mx-auto py-6",children:[t.jsx(r,{className:"mb-6",children:t.jsx(j,{current:c,items:h,responsive:!0,className:"site-navigation-steps",size:"small"})}),t.jsxs(r,{children:[t.jsx("div",{className:"flex justify-between items-center mb-6",children:t.jsx(_,{level:3,children:"ពិនិត្យ និងកែសម្រួលកិច្ចសន្យា"})}),t.jsx("div",{className:"mb-4",children:t.jsx(u,{apiKey:"3a2oagj6jlidp87awx07wckpgh4jl3tyqo98cw8bed3rb3cf",onInit:(n,i)=>s.current=i,initialValue:m,init:{height:800,menubar:!1,plugins:["advlist","autolink","lists","link","image","charmap","preview","anchor","searchreplace","visualblocks","code","fullscreen","insertdatetime","media","table","help","wordcount"],toolbar:"undo redo | blocks | bold italic forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | table | preview | help",content_css:!1,content_style:g,font_formats:"Koh Santepheap=Koh Santepheap,serif;Hanuman=Hanuman,serif;Khmer OS=Khmer OS,serif;",extended_valid_elements:"span[class|style],div[class|style],p[class|style],table[class|style],td[class|style],th[class|style]",valid_children:"+body[style]",verify_html:!1,entity_encoding:"raw",directionality:"ltr",setup:n=>{n.on("change",()=>{const i=n.getContent();l(i)})}}})}),t.jsx("div",{className:"flex justify-between mt-6",children:t.jsxs(z,{size:"middle",children:[t.jsx(o,{type:"primary",icon:t.jsx(b,{}),onClick:x,size:"large",children:"បោះពុម្ព"}),t.jsx(o,{type:"default",icon:t.jsx(v,{}),onClick:d,size:"large",children:"ត្រឡប់ក្រោយ"})]})})]})]})]})}export{et as default};
