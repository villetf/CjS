// virusprot.js
// Del av CjS version 5.3.0
//
//
//
// Denna kod är avsedd att köras tillsammans med pluginet Custom Javascript for Websites 2. I pluginet infogas en länk till basskript.js.
// Skriptet förvaras på serverX. Länken till skriptet är https://serverx.domain.se/cjs/servicedesk.js.
//
// Mer info finns på https://codeplatform.domain.se/team/cjs.

// Kollar via cookie om loggning är avstängt, om det är det läggs varningsruta till i toppen av sidan
if (getCookie('logsDisabled')) {
   const logsWarning = document.createElement('div');
   logsWarning.id = 'logsWarning';
   logsWarning.innerText = 'Loggning för CjS är inaktiverat. Återaktivera detta så fort du testat klart.';
   if (window === window.top) {
      document.querySelector('body').prepend(logsWarning);
   }
}

// Kollar regelbundet ifall det finns några element där knapparna ska läggas till
setInterval(() => {
   if (!document.getElementById('pingBtn')) {
      const rowsNumber = document.getElementsByClassName('section hostname-and-group').length;
      if (rowsNumber > 0) {
         createButtons(rowsNumber);
      }
   }
}, 200);

// Skapar de olika knapparna
function createButtons(rowsNumber) {
   for (let i = 0; i < rowsNumber; i++) {
      const hostRow = document.getElementsByClassName('section hostname-and-group')[i];
      let hostname = hostRow.getElementsByClassName('hostname')[0].innerText;

      const buttonsDiv = document.createElement('div');
      buttonsDiv.id = 'buttonsDiv';
      hostRow.appendChild(buttonsDiv);

      // Skapar Ping-knapp
      const pingButton = document.createElement('a');
      pingButton.id = 'pingBtn';
      pingButton.href = 'https://siem.domain.se/plugins/23/entry2?ip=' + hostname;
      pingButton.setAttribute('target', '_blank');
      pingButton.innerText = 'Pinga host';
      pingButton.onclick = () => {
         if (hostname.includes('.domain.se')) {
            hostname = hostname.replace('.domain.se', '');
         }
         sendLog(17, hostname);
      };

      buttonsDiv.appendChild(pingButton);

      // Skapar Sök CI-knapp
      const cmdbButton = document.createElement('a');
      cmdbButton.id = 'cmdbBtn';
      cmdbButton.setAttribute('target', '_blank');
      cmdbButton.innerText = 'Sök CI';
      cmdbButton.onclick = () => {
         if (hostname.includes('.domain.se')) {
            hostname = hostname.replace('.domain.se', '');
         }
         const unreplacedHostname = hostname;
         if (hostname.includes('PCX')) {
            hostname = hostname.replace('PCX', 'NX');
         }
         if (hostname.includes('PC')) {
            hostname = hostname.replace('PC', '');
         }

         window.open(`https://servicedesk.domain.se/Search?searchText=${hostname}&selectName=global_search`, '_blank', 'height=1000, width=2000');
         sendLog(18, unreplacedHostname);
      };

      buttonsDiv.appendChild(cmdbButton);
   }
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

// Funktion för att skicka logg till Log4CjS
function sendLog(buttonID, currentObject) {
   if (getCookie('logsDisabled')) {
      return;
   }

   let username;
   if (getCookie('servicedeskUsername')) {
      username = getCookie('servicedeskUsername');
   } else {
      username = 'Okänd användare';
   }

   let data;
   if (currentObject) {
      data = { token: 'XXXXXXXXXXXXXXXX', user: username, button: buttonID, object: currentObject};
   } else {
      data = { token: 'XXXXXXXXXXXXXXXX', user: username, button: buttonID};
   }

   fetch('https://serverx.domain.se/api/log', {
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