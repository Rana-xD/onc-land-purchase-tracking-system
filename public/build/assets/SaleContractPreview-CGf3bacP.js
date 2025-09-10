import{r as s,j as t,Q as z,B as o,a as b,s as l}from"./app-C0Remzwy.js";import{E as P}from"./Editor-CaJZoriW.js";import{A as I,b as K}from"./AdminLayout-6aB_fSHs.js";import"./jspdf.es.min-A-vskxt_.js";import{C as w}from"./index-Cfi4PyFn.js";import{S as D}from"./index-D8QTW78o.js";import{T as F}from"./index-_bYnS0vO.js";import{M as L}from"./index-D4i_TDIH.js";import{R as T}from"./UserOutlined-9GEWtyEU.js";import{R as N}from"./EnvironmentOutlined-Dg-c_VSb.js";import{R as O}from"./DollarOutlined-DplF-jS5.js";import{R as E}from"./FileOutlined-Db19IYhn.js";import{R as H}from"./CheckCircleOutlined-CWvD94-R.js";import"./index-DQID86bo.js";import"./index-BkeYX-_W.js";import"./EllipsisOutlined-BvAucnIs.js";import"./PurePanel-LERcE_NN.js";import"./index-BC2OOC4T.js";import"./InboxOutlined-C_72B7nY.js";import"./useVariants-WSvFAMWE.js";import"./CheckOutlined-CBgC1XT7.js";import"./progress-DpSHyWCv.js";import"./EditOutlined-Kmrbx6Vn.js";import"./getAllowClear-Ch9so_13.js";const{Title:U}=F;function mt({document:a,populatedTemplate:j}){const[p,c]=s.useState(!1),[v,d]=s.useState(!1),[m,x]=s.useState(j),[k,f]=s.useState(!1),i=s.useRef(null),g=`
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
  `,S=4,C=[{title:"ជ្រើសរើសអ្នកទិញ",status:"finish",icon:t.jsx(T,{})},{title:"ជ្រើសរើសអ្នកលក់",status:"finish",icon:t.jsx(K,{})},{title:"ជ្រើសរើសដី",status:"finish",icon:t.jsx(N,{})},{title:"ការបង់ប្រាក់",status:"finish",icon:t.jsx(O,{})},{title:"ពិនិត្យកិច្ចសន្យា",status:"process",icon:t.jsx(E,{})},{title:"បញ្ចប់",status:"wait",icon:t.jsx(H,{})}],R=async()=>{if(i.current){d(!0);try{const e=i.current.getContent();(await b.post(`/documents/${a.id}/save`,{content:e})).status===200&&(l.success("កិច្ចសន្យាត្រូវបានរក្សាទុកដោយជោគជ័យ"),x(e))}catch(e){console.error("Save error:",e),l.error("មានបញ្ហាក្នុងការរក្សាទុក")}finally{d(!1)}}},h=()=>{if(!i.current)return;const e=i.current.getContent(),n=window.open("","_blank");n.document.write(`
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
    `),n.document.close(),n.focus(),setTimeout(()=>{n.print(),n.close()},500)},u=async()=>{if(i.current){c(!0);try{const e=i.current.getContent(),n=await b.post(`/documents/${a.id}/generate-pdf`,{content:e},{responseType:"blob"});if(n.status===200){const $=new Blob([n.data],{type:"application/pdf"}),y=window.URL.createObjectURL($),r=a.createElement("a");r.style.display="none",r.href=y,r.download=`sale_contract_${a.id}_${new Date().toISOString().slice(0,10)}.pdf`,a.body.appendChild(r),r.click(),window.URL.revokeObjectURL(y),a.body.removeChild(r),l.success("បានបង្កើត PDF ដោយជោគជ័យ")}}catch(e){console.error("PDF generation error:",e),l.error("មានបញ្ហាក្នុងការបង្កើត PDF")}finally{c(!1)}}},_=()=>{window.history.back()};return t.jsxs(I,{children:[t.jsx(z,{title:"ពិនិត្យ និងកែសម្រួលកិច្ចសន្យាលក់ដី"}),t.jsxs("div",{className:"container mx-auto py-6",children:[t.jsx(w,{className:"mb-6",children:t.jsx(D,{current:S,items:C,responsive:!0,className:"site-navigation-steps",size:"small"})}),t.jsxs(w,{children:[t.jsx("div",{className:"flex justify-between items-center mb-6",children:t.jsx(U,{level:3,children:"ពិនិត្យ និងកែសម្រួលកិច្ចសន្យាលក់ដី"})}),t.jsx("div",{className:"mb-4",children:t.jsx(P,{apiKey:"3a2oagj6jlidp87awx07wckpgh4jl3tyqo98cw8bed3rb3cf",onInit:(e,n)=>i.current=n,initialValue:m,init:{height:800,menubar:!1,plugins:["advlist","autolink","lists","link","image","charmap","preview","anchor","searchreplace","visualblocks","code","fullscreen","insertdatetime","media","table","help","wordcount"],toolbar:"undo redo | blocks | bold italic forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | table | preview | help",content_css:!1,content_style:g,font_formats:"Koh Santepheap=Koh Santepheap,serif;Hanuman=Hanuman,serif;Khmer OS=Khmer OS,serif;",extended_valid_elements:"span[class|style],div[class|style],p[class|style],table[class|style],td[class|style],th[class|style]",valid_children:"+body[style]",verify_html:!1,entity_encoding:"raw",directionality:"ltr",setup:e=>{e.on("change",()=>{const n=e.getContent();x(n)})}}})}),t.jsxs("div",{className:"flex justify-between mt-6",children:[t.jsx(o,{onClick:_,children:"ត្រឡប់ក្រោយ"}),t.jsxs("div",{className:"space-x-2",children:[t.jsx(o,{onClick:R,loading:v,children:"រក្សាទុកព្រាង"}),t.jsx(o,{onClick:h,disabled:p,children:"បោះពុម្ព"}),t.jsx(o,{type:"primary",onClick:u,loading:p,children:"បង្កើត PDF"})]})]})]}),t.jsx(L,{title:"មើលជាមុនកិច្ចសន្យាលក់ដី",open:k,onCancel:()=>f(!1),footer:[t.jsx(o,{onClick:()=>f(!1),children:"បិទ"},"close"),t.jsx(o,{onClick:h,children:"បោះពុម្ព"},"print"),t.jsx(o,{type:"primary",onClick:u,loading:p,children:"បង្កើត PDF"},"pdf")],width:"90%",style:{top:20},bodyStyle:{maxHeight:"70vh",overflow:"auto"},children:t.jsx("div",{dangerouslySetInnerHTML:{__html:m},style:{fontFamily:"Koh Santepheap, serif",lineHeight:1.6,fontSize:"14px"}})})]})]})}export{mt as default};
