// basskript.js
// Del av CjS version 5.3.0
//
//
//
// Denna kod är avsedd att köras tillsammans med pluginet Custom Javascript for Websites 2.
// Skripten förvaras på servern serverX. I pluginet anges regexet /*.domain.se*/, vilket gör
// att på alla sidor på den domänen kollar den i basskriptet ifall det finns något skript för den
// aktuella sidan. Länken till skriptet är https://serverx.domain.se/cjs/basskript.js.
//
// Mer info finns på https://codeplatform.domain.se/team/cjs.



const serverLink = 'https://serverx.domain.se/cjs';

const css = document.createElement('link');
css.rel = 'stylesheet';
css.href = `${serverLink}/styles.css`;

const script = document.createElement('script');
script.type = 'module';

const head = document.querySelector('head');

if (window.location.href.startsWith('https://monsys.domain.se/') || window.location.href.startsWith('https://monsystest.domain.se/')) {
   script.src = `${serverLink}/monsys.js`;
}

if (window.location.href.startsWith('https://servicedesk.domain.se/')) {
   script.src = `${serverLink}/servicedesk.js`;
   const sweetalert = document.createElement('script');
   sweetalert.src = 'https://cdn.jsdelivr.net/npm/sweetalert2@11.11.0/dist/sweetalert2.all.min.js';
   document.querySelector('head').insertBefore(sweetalert, document.querySelector('head').children[0]);
}

if (window.location.href.startsWith('https://siem.domain.se/')) {
   script.src = `${serverLink}/siem.js`;
}

if (window.location.href.startsWith('https://virusprotconsole.domain.se/')) {
   script.src = `${serverLink}/virusprot.js`;
}

if (window.location.href.startsWith('https://vulnscan.domain.se/')) {
   script.src = `${serverLink}/vulnscan.js`;
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
