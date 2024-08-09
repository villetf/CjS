// basskript.js
// Del av CjS version 5.3.0
//
//
//
// Denna kod är avsedd att köras tillsammans med pluginet Custom Javascript for Websites 2.
// Skripten förvaras på servern serverX. I pluginet anges regexet /*.lkl.ltkalmar.se*/, vilket gör
// att på alla sidor på den domänen kollar den i basskriptet ifall det finns något skript för den
// aktuella sidan. Länken till skriptet är https://serverx.lkl.ltkalmar.se/cjs/basskript.js.
//
// Mer info finns på https://gitlab.lkl.ltkalmar.se/oc/cjs.



const serverLink = 'https://serverx.lkl.ltkalmar.se/cjs';

const css = document.createElement('link');
css.rel = 'stylesheet';
css.href = `${serverLink}/styles.css`;

const script = document.createElement('script');
script.type = 'module';

const head = document.querySelector('head');

if (window.location.href.startsWith('https://op5.lkl.ltkalmar.se/') || window.location.href.startsWith('https://op5test.lkl.ltkalmar.se/')) {
   script.src = `${serverLink}/op5.js`;
}

if (window.location.href.startsWith('https://servicedesk.lkl.ltkalmar.se/')) {
   script.src = `${serverLink}/sdp.js`;
   const sweetalert = document.createElement('script');
   sweetalert.src = 'https://cdn.jsdelivr.net/npm/sweetalert2@11.11.0/dist/sweetalert2.all.min.js';
   document.querySelector('head').insertBefore(sweetalert, document.querySelector('head').children[0]);
}

if (window.location.href.startsWith('https://siem.lkl.ltkalmar.se/')) {
   script.src = `${serverLink}/qradar.js`;
}

if (window.location.href.startsWith('https://ampconsole.lkl.ltkalmar.se/')) {
   script.src = `${serverLink}/amp.js`;
}

if (window.location.href.startsWith('https://qualysguard.qualys.mgmt.ltkalmar.se/')) {
   script.src = `${serverLink}/qualys.js`;
}

let body;
const bodyinterval = setInterval(() => {
   if (document.querySelector('body')) {
      clearInterval(bodyinterval);
      body = document.querySelector('body');
      body.appendChild(script);
   }
}, 10);

head.appendChild(css);
