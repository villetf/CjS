// qualys.js
// Del av CjS version 5.3.0
//
//
//
// Denna kod är avsedd att köras tillsammans med pluginet Custom Javascript for Websites 2. I pluginet infogas en länk till basskript.js.
// Skriptet förvaras på serverx. Länken till skriptet är https://serverx.ltkalmar.se/cjs/qualys.js.
//
// Mer info finns på https://gitlab.ltkalmar.se/oc/cjs.



// Söker efter hostnamn och IP-adresser på sidan varje sekund
const hostnameRegex = /(lkl|cop|cot|col)(\d{2,4})|(pcx|pc)(\d{5,6})/gi;
const ipRegex = /^(?:\d{1,3}\.){3}\d{1,3}$/;
setInterval(() => {
   if (!document.getElementById('qualysSearchHostnameButton')) {
      searchForHostname();
   }
   if (!document.getElementById('qualysSearchIPButton')) {
      searchForIp();
   }
}, 1000);

// Asykron funktion för att leta igenom sidan efter hostnamn
async function searchForHostname() {
   const allElements = document.querySelectorAll('*');
   for (let i = 0; i < allElements.length; i++) {
      const currentElement = allElements[i];
      if (currentElement.childNodes.length === 1 && currentElement.firstChild.nodeType === Node.TEXT_NODE) {
         if (currentElement.innerText && currentElement.innerText.match(hostnameRegex)) {
            addHostnameButton(currentElement);
         }
      }
   }
}

// Asykron funktion för att leta igenom sidan efter IP-adresser
async function searchForIp() {
   const allElements = document.querySelectorAll('*');
   for (let i = 0; i < allElements.length; i++) {
      const currentElement = allElements[i];
      if (currentElement.childNodes.length === 1 && currentElement.firstChild.nodeType === Node.TEXT_NODE) {
         if (currentElement.innerText && currentElement.innerText.match(ipRegex)) {
            addIPButton(currentElement);
         }
      }
   }
}


// Funktion för att lägga till Sök CI-knapp
function addHostnameButton(currentElement) {
   const searchButton = document.createElement('button');
   searchButton.id = 'qualysSearchHostnameButton';
   searchButton.innerText = 'Sök CI';
   searchButton.onclick = () => {
      let hostname = currentElement.innerText;
      const matches = hostname.match(hostnameRegex);
      hostname = matches.join('');
      hostname = hostname.toUpperCase();
      const unreplacedHostname = hostname;
      if (hostname.startsWith('PCX')) {
         hostname = hostname.replace('PCX', 'NX');
      }
      if (hostname.startsWith('PC')) {
         hostname = hostname.replace('PC', '');
      }
      window.open(`https://servicedesk.ltkalmar.se/SearchN.do?searchText=${hostname}&subModSelText=&selectName=global_search`, '_blank', 'height=1000, width=2000');
      sendLog(27, unreplacedHostname);
   };
   const searchDiv = document.createElement('div');
   searchDiv.id = 'qualysSearchHostnameDiv';
   if (window.location.href.startsWith('https://qualysguard.qualys.mgmt.ltkalmar.se/vm/#/vulnerabilities')) {
      currentElement.parentElement.appendChild(searchDiv);
   } else {
      currentElement.appendChild(searchDiv);
   }

   searchDiv.appendChild(searchButton);
}

// Funktion för att lägga till Sök i Netbox-knapp
function addIPButton(currentElement) {
   const searchButton = document.createElement('button');
   searchButton.id = 'qualysSearchIPButton';
   searchButton.innerText = 'Sök i Netbox';
   searchButton.onclick = () => {
      const ip = currentElement.innerText.replace(searchButton.innerText, '');
      window.open(`https://netbox.ltkalmar.se/search/?q=${ip}`, '_blank', 'height=1000, width=2000');
      sendLog(28, ip);
   };
   const searchDiv = document.createElement('div');
   searchDiv.id = 'qualysSearchIPDiv';
   if (window.location.href.startsWith('https://qualysguard.qualys.mgmt.ltkalmar.se/vm/#/vulnerabilities')) {
      currentElement.parentElement.appendChild(searchDiv);
   } else {
      currentElement.appendChild(searchDiv);
   }
   searchDiv.appendChild(searchButton);
}



// Funktion för att skicka logg till Log4CjS
function sendLog(buttonID, currentObject) {
   if (getCookie('logsDisabled')) {
      return;
   }

   let username;
   if (getCookie('SDPUsername')) {
      username = getCookie('SDPUsername');
   } else {
      username = 'Okänd användare';
   }

   let data;
   if (currentObject) {
      data = { token: 'xxxxxxxxxxxxxxxxxxxxxxxx', user: username, button: buttonID, object: currentObject};
   } else {
      data = { token: 'xxxxxxxxxxxxxxxxxxxxxxxx', user: username, button: buttonID};
   }

   fetch('https://serverx.ltkalmar.se/api/log', {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
   })
      .catch(error => {
         // eslint-disable-next-line no-console -- Om ett loggningsfel skulle uppstå är det bra att kunna se det i loggen.
         console.error('Loggningsfel inträffade:', error);
      });
}

// Funktion för att hämta specifik cookie
function getCookie(cname) {
   const name = cname + '=';
   const decodedCookie = document.cookie;
   const ca = decodedCookie.split(';');
   for (let i = 0; i < ca.length; i++) {
      let cookie = ca[i];
      while (cookie.charAt(0) === ' ') {
         cookie = cookie.substring(1);
      }
      if (cookie.indexOf(name) === 0) {
         return cookie.substring(name.length, cookie.length);
      }
   }
   return '';
}