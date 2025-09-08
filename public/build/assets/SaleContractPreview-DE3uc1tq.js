import{r,j as t,Q as z,B as i,a as b,s as l}from"./app-BB1ZxGmZ.js";import{E as I}from"./Editor-DzAQuFDD.js";import{A as K,b as D}from"./AdminLayout-BuxP0tGi.js";import"./jspdf.es.min-CJB1dIXq.js";import{C as w}from"./index-CFcJuZ_P.js";import{S as F}from"./index-CQIrajnk.js";import{T as L}from"./index-4sotxCPT.js";import{R as N}from"./EyeOutlined-Mb1FRF2d.js";import{M as T}from"./index-Yxxb-zBk.js";import{R as O}from"./UserOutlined-DbziX9m8.js";import{R as E}from"./EnvironmentOutlined-DqZQt_HU.js";import{R as H}from"./DollarOutlined-zLsc4o38.js";import{R as U}from"./FileOutlined-BQmENh8X.js";import{R as B}from"./CheckCircleOutlined-CSRirMR9.js";import"./index-BAJJZILe.js";import"./index-Dh1oKUG_.js";import"./EllipsisOutlined-BovgqE1k.js";import"./PurePanel-C84SwQv1.js";import"./index-19zJLVvd.js";import"./InboxOutlined-DQe2Aezk.js";import"./useVariants-CY_Kcp5K.js";import"./CheckOutlined-bJGhASa0.js";import"./progress-D37wmuzZ.js";import"./EditOutlined-DBTY11ET.js";import"./getAllowClear-DfqxFJiv.js";const{Title:M}=L;function gt({document:a,populatedTemplate:j}){const[c,d]=r.useState(!1),[v,m]=r.useState(!1),[x,f]=r.useState(j),[k,p]=r.useState(!1),o=r.useRef(null),g=`
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
      font-size: 20pt;
      font-weight: 700;
      margin-bottom: 15px;
      letter-spacing: 2px;
      text-align: center;
    }

    .contract-title {
      font-size: 20pt;
      font-weight: 700;
      color: #000;
      text-align: center;
      margin-bottom: 20px;
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
      flex-wrap: wrap;
    }

    .signature-section {
      width: 45%;
      text-align: center;
      margin-bottom: 30px;
    }

    .signature-title {
      font-weight: bold;
      margin-bottom: 60px;
    }

    .signature-line {
      border-bottom: 1px solid #000;
      margin: 60px 0 10px 0;
    }

    .fingerprint-section {
      margin-top: 40px;
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
    }

    .fingerprint-box {
      width: 45%;
      text-align: center;
      margin-bottom: 20px;
    }

    .fingerprint-title {
      font-weight: bold;
      margin-bottom: 10px;
    }

    .fingerprint-area {
      border: 1px solid #000;
      height: 80px;
      margin: 10px 0;
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
  `,S=4,C=[{title:"ជ្រើសរើសអ្នកទិញ",status:"finish",icon:t.jsx(O,{})},{title:"ជ្រើសរើសអ្នកលក់",status:"finish",icon:t.jsx(D,{})},{title:"ជ្រើសរើសដី",status:"finish",icon:t.jsx(E,{})},{title:"ការបង់ប្រាក់",status:"finish",icon:t.jsx(H,{})},{title:"ពិនិត្យកិច្ចសន្យា",status:"process",icon:t.jsx(U,{})},{title:"បញ្ចប់",status:"wait",icon:t.jsx(B,{})}],R=async()=>{if(o.current){m(!0);try{const e=o.current.getContent();(await b.post(`/documents/${a.id}/save`,{content:e})).status===200&&(l.success("កិច្ចសន្យាត្រូវបានរក្សាទុកដោយជោគជ័យ"),f(e))}catch(e){console.error("Save error:",e),l.error("មានបញ្ហាក្នុងការរក្សាទុក")}finally{m(!1)}}},h=()=>{if(!o.current)return;const e=o.current.getContent(),n=window.open("","_blank");n.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>កិច្ចសន្យាលក់ដី</title>
        <style>${g}</style>
      </head>
      <body>
        ${e}
      </body>
      </html>
    `),n.document.close(),n.focus(),setTimeout(()=>{n.print(),n.close()},500)},u=async()=>{if(o.current){d(!0);try{const e=o.current.getContent(),n=await b.post(`/documents/${a.id}/generate-pdf`,{content:e},{responseType:"blob"});if(n.status===200){const P=new Blob([n.data],{type:"application/pdf"}),y=window.URL.createObjectURL(P),s=a.createElement("a");s.style.display="none",s.href=y,s.download=`sale_contract_${a.id}_${new Date().toISOString().slice(0,10)}.pdf`,a.body.appendChild(s),s.click(),window.URL.revokeObjectURL(y),a.body.removeChild(s),l.success("បានបង្កើត PDF ដោយជោគជ័យ")}}catch(e){console.error("PDF generation error:",e),l.error("មានបញ្ហាក្នុងការបង្កើត PDF")}finally{d(!1)}}},_=()=>{p(!0)},$=()=>{window.history.back()};return t.jsxs(K,{children:[t.jsx(z,{title:"ពិនិត្យ និងកែសម្រួលកិច្ចសន្យាលក់ដី"}),t.jsxs("div",{className:"container mx-auto py-6",children:[t.jsx(w,{className:"mb-6",children:t.jsx(F,{current:S,items:C,responsive:!0,className:"site-navigation-steps",size:"small"})}),t.jsxs(w,{children:[t.jsxs("div",{className:"flex justify-between items-center mb-6",children:[t.jsx(M,{level:3,children:"ពិនិត្យ និងកែសម្រួលកិច្ចសន្យាលក់ដី"}),t.jsx("div",{className:"space-x-2",children:t.jsx(i,{icon:t.jsx(N,{}),onClick:_,children:"មើលជាមុន"})})]}),t.jsx("div",{className:"mb-4",children:t.jsx(I,{apiKey:"3a2oagj6jlidp87awx07wckpgh4jl3tyqo98cw8bed3rb3cf",onInit:(e,n)=>o.current=n,initialValue:x,init:{height:800,menubar:!1,plugins:["advlist","autolink","lists","link","image","charmap","preview","anchor","searchreplace","visualblocks","code","fullscreen","insertdatetime","media","table","help","wordcount"],toolbar:"undo redo | blocks | bold italic forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | table | preview | help",content_css:!1,content_style:g,font_formats:"Koh Santepheap=Koh Santepheap,serif;Hanuman=Hanuman,serif;Khmer OS=Khmer OS,serif;",extended_valid_elements:"span[class|style],div[class|style],p[class|style],table[class|style],td[class|style],th[class|style]",valid_children:"+body[style]",verify_html:!1,entity_encoding:"raw",directionality:"ltr",setup:e=>{e.on("change",()=>{const n=e.getContent();f(n)})}}})}),t.jsxs("div",{className:"flex justify-between mt-6",children:[t.jsx(i,{onClick:$,children:"ត្រឡប់ក្រោយ"}),t.jsxs("div",{className:"space-x-2",children:[t.jsx(i,{onClick:R,loading:v,children:"រក្សាទុកព្រាង"}),t.jsx(i,{onClick:h,disabled:c,children:"បោះពុម្ព"}),t.jsx(i,{type:"primary",onClick:u,loading:c,children:"បង្កើត PDF"})]})]})]}),t.jsx(T,{title:"មើលជាមុនកិច្ចសន្យាលក់ដី",open:k,onCancel:()=>p(!1),footer:[t.jsx(i,{onClick:()=>p(!1),children:"បិទ"},"close"),t.jsx(i,{onClick:h,children:"បោះពុម្ព"},"print"),t.jsx(i,{type:"primary",onClick:u,loading:c,children:"បង្កើត PDF"},"pdf")],width:"90%",style:{top:20},bodyStyle:{maxHeight:"70vh",overflow:"auto"},children:t.jsx("div",{dangerouslySetInnerHTML:{__html:x},style:{fontFamily:"Koh Santepheap, serif",lineHeight:1.6,fontSize:"14px"}})})]})]})}export{gt as default};
