// qradar.js
// Del av CjS version 5.3.0
//
//
//
// Denna kod är avsedd att köras tillsammans med pluginet Custom Javascript for Websites 2. I pluginet infogas en länk till basskript.js.
// Skriptet förvaras på serverx. Länken till skriptet är https://serverx.lkl.ltkalmar.se/cjs/sdp.js.
//
// Mer info finns på https://gitlab.lkl.ltkalmar.se/oc/cjs.



// Kollar via cookie om loggning är avstängt, om det är det läggs varningsruta till i toppen av sidan
setInterval(() => {
   if (getCookie('logsDisabled') && !(document.getElementById('logsWarning'))) {
      const logsWarning = document.createElement('div');
      logsWarning.id = 'logsWarning';
      logsWarning.innerText = 'Loggning för CjS är inaktiverat. Återaktivera detta så fort du testat klart.';
      if (window === window.top) {
         document.getElementById('topNavLayout').prepend(logsWarning);
      }
   }
}, 500);

// Söker efter hostnamn på sidan
const hostnameRegex = /(lkl|cop|cot|col)(\d{2,4})|(pcx|pc)(\d{5,6})/gi;
searchForHostname();
setInterval(() => {
   if (!document.getElementById('searchHostnameButton')) {
      searchForHostname();
   }
}, 1000);


// Lägger till knappar
if (document.getElementsByClassName('heading')[0]) {
   const tableBlock = document.getElementById('summaryToolbarSection');

   // Lägger till Skapa ärende-knapp
   const ticketButton = document.createElement('button');
   ticketButton.id = 'offenseLink';
   ticketButton.className = 'DA_COMPONENT DA_SPEEDBUTTON';
   ticketButton.onmouseover = () => {
      ticketButton.classList.add('DA_HIGHLIGHT');
   };
   ticketButton.onmouseout = () => {
      ticketButton.classList.remove('DA_HIGHLIGHT');
   };
   ticketButton.onclick = () => {
      createTicket();
      sendLog(14);
   };
   tableBlock.insertBefore(ticketButton, tableBlock.firstChild);

   const ticketImage = document.createElement('img');
   ticketImage.id = 'ticketImage';
   ticketImage.className = 'DA_IMAGELISTLITE';
   ticketImage.src = 'https://siem.lkl.ltkalmar.se/console/core/js/themes/shim.gif';
   ticketButton.appendChild(ticketImage);

   const ticketText = document.createElement('span');
   ticketText.id = 'ticketTextSpan';
   ticketText.innerHTML = 'Skapa ärende med länk';
   ticketButton.appendChild(ticketText);

   // Lägger till Kopiera länk-knapp
   const linkButton = document.createElement('button');
   linkButton.id = 'offenseLink';
   linkButton.className = 'DA_COMPONENT DA_SPEEDBUTTON';
   linkButton.onmouseover = () => {
      linkButton.classList.add('DA_HIGHLIGHT');
   };
   linkButton.onmouseout = () => {
      linkButton.classList.remove('DA_HIGHLIGHT');
   };
   linkButton.onclick = () => {
      copyOffenseLink(() => {
         document.getElementById('textSpan').innerHTML = 'Länk kopierad!';
         sendLog(15);
      });
   };
   tableBlock.insertBefore(linkButton, tableBlock.firstChild);

   const linkImage = document.createElement('img');
   linkImage.class = 'DA_IMAGELISTLITE';
   linkImage.id = 'linkImage';
   linkImage.src = 'https://siem.lkl.ltkalmar.se/console/core/js/themes/shim.gif';
   linkButton.appendChild(linkImage);

   const linkText = document.createElement('span');
   linkText.id = 'textSpan';
   linkButton.appendChild(linkText);
   linkText.innerHTML = 'Kopiera offenselänk';



   // Lägger till Autogenerera ärende-knapp
   const autoTicketButton = document.createElement('button');
   autoTicketButton.id = 'autoTicket';
   autoTicketButton.className = 'DA_COMPONENT DA_SPEEDBUTTON';
   autoTicketButton.onmouseover = () => {
      autoTicketButton.classList.add('DA_HIGHLIGHT');
   };
   autoTicketButton.onmouseout = () => {
      autoTicketButton.classList.remove('DA_HIGHLIGHT');
   };
   autoTicketButton.onclick = () => {
      autoGenerateTicket();
   };
   tableBlock.insertBefore(autoTicketButton, tableBlock.firstChild);

   const autoTicketImage = document.createElement('img');
   autoTicketImage.id = 'autoTicketImage';
   autoTicketImage.className = 'DA_IMAGELISTLITE';
   autoTicketImage.src = 'https://siem.lkl.ltkalmar.se/console/core/js/themes/shim.gif';
   autoTicketButton.appendChild(autoTicketImage);

   const autoTicketText = document.createElement('span');
   autoTicketText.id = 'autoTicketTextSpan';
   autoTicketText.innerHTML = 'Autogenerera ärende';
   autoTicketButton.appendChild(autoTicketText);
}

// Asykron funktion för att leta igenom sidan efter hostnamn
async function searchForHostname() {
   const allElements = document.querySelectorAll('*');
   for (let i = 0; i < allElements.length; i++) {
      const currentElement = allElements[i];
      currentElement.childNodes.forEach((item) => {
         if (item.nodeType === Node.TEXT_NODE && item.textContent.match(hostnameRegex)) {
            addHostnameButton(item.parentElement);
         }
      });
   }
}

// Funktion för att kopiera offenselänk och skapa ärende
function createTicket() {
   copyOffenseLink(eventNumber => {
      window.open('https://siem.lkl.ltkalmar.se/console/do/sem/properties?appName=Sem&dispatch=editNotes&attribute=notes&daoName=offense&id=' + eventNumber);
      window.open('https://servicedesk.lkl.ltkalmar.se/WorkOrder.do?woMode=newWO&reqTemplate=20101');
   });
}

// Funktion för att kopiera offenselänk
function copyOffenseLink(callback) {
   const title = (document.getElementsByClassName('heading')[0]).innerText;
   const eventNumber = title.replace('Offense ', '');
   navigator.clipboard.writeText('https://siem.lkl.ltkalmar.se/console/qradar/jsp/QRadar.jsp?appName=Sem&pageId=OffenseSummary&summaryId=' + eventNumber)
      .then(() => {
         callback(eventNumber);
      });
}

async function autoGenerateTicket() {
   setCookie('qradarAutofill', 'true', 5);

   const rows = Array.from(document.querySelectorAll('[scope="row"]'));
   const elementIndex = rows.findIndex(element => element.innerText.includes('Description')) + 1;
   const title = (document.getElementsByClassName('heading')[0]).innerText;
   const eventNumber = title.replace('Offense ', '');
   setCookie('qradarEventnumber', eventNumber, 5);
   setCookie('qradarSubject', `Qradar - ${rows[elementIndex].textContent}`, 5);
   setCookie('qradarDescription', encodeURIComponent(`<div>${rows[elementIndex].textContent}<br /></div><div><br /></div><div>Offense: ${eventNumber}<br /></div><div><br /></div><div style="text-align: left" dir="ltr"><a href="https://siem.lkl.ltkalmar.se/console/qradar/jsp/QRadar.jsp?appName=Sem&amp;pageId=OffenseSummary&amp;summaryId=${eventNumber}" target="_blank">https://siem.lkl.ltkalmar.se/console/qradar/jsp/QRadar.jsp?appName=Sem&amp;pageId=OffenseSummary&amp;summaryId=${eventNumber}</a><br /></div>`), 5);

   window.open('https://servicedesk.lkl.ltkalmar.se', '_blank');

   const findCookieInterval = setInterval(async() => {
      if (!getCookie('SDPTicketNumber')) {
         return;
      }

      const SDPTicketNumber = getCookie('SDPTicketNumber');
      const headers = {
         'Version': '20.0',
         'Accept': 'application/json',
         'Qradarcsrf': (getCookie('QRadarCSRF'))
      };
      const commentText = `https://servicedesk.lkl.ltkalmar.se/WorkOrder.do?woMode=viewWO&woID=${SDPTicketNumber} //${getCookie('SDPUsername')}`;
      const qradarCommentCall = await fetch(`https://siem.lkl.ltkalmar.se/api/siem/offenses/${eventNumber}/notes?note_text=${encodeURIComponent(commentText)}`, {
         method: 'POST',
         headers: headers
      });

      if (!qradarCommentCall.ok) {
         alert('Lyckades inte skapa Qradar-kommentar.');
      }
      sendLog(29, `#${SDPTicketNumber}`);

      location.reload();
      clearInterval(findCookieInterval);

   }, 500);
}


// Funktion för att lägga till Sök CI-knapp
function addHostnameButton(currentElement) {
   const searchButton = document.createElement('button');
   searchButton.id = 'searchHostnameButton';
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
      window.open(`https://servicedesk.lkl.ltkalmar.se/SearchN.do?searchText=${hostname}&subModSelText=&selectName=global_search`, '_blank', 'height=1000, width=2000');
      sendLog(16, unreplacedHostname);
   };
   const searchDiv = document.createElement('div');
   searchDiv.id = 'searchHostnameDiv';
   currentElement.appendChild(searchDiv);
   searchDiv.appendChild(searchButton);
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

// Funktion för att definiera cookie
function setCookie(cookieName, cookieValue, cookieLifeSeconds) {
   const searchDate = new Date();
   searchDate.setTime(searchDate.getTime() + (cookieLifeSeconds * 1000));
   const searchExpires = '; expires=' + searchDate.toUTCString();
   document.cookie = cookieName + '=' + cookieValue + searchExpires + '; path=/; domain=.ltkalmar.se';
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
      data = { token: 'xxxxxxxxxxxxxxxxxx', user: username, button: buttonID, object: currentObject};
   } else {
      data = { token: 'xxxxxxxxxxxxxxxxxx', user: username, button: buttonID};
   }

   fetch('https://serverx.lkl.ltkalmar.se/api/log', {
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