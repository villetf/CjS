// op5.js
// Del av CjS version 5.3.0
//
//
//
// Denna kod är avsedd att köras tillsammans med pluginet Custom Javascript for Websites 2. I pluginet infogas en länk till basskript.js.
// Skriptet förvaras på serverx. Länken till skriptet är https://serverx.lkl.ltkalmar.se/cjs/op5.js.
//
// Mer info finns på https://gitlab.lkl.ltkalmar.se/oc/cjs.



// Gör ärendelänkar i kommentarer klickbara
setTimeout(createURLs, 200);
setInterval(createURLs, 31 * 200);
function createURLs() {
   const aComments = document.getElementsByClassName('restricted-output');
   for (let i = 0; i < aComments.length; i++) {
      let text = aComments[i].innerHTML;

      text = text.split(' ');
      if (!text[0].startsWith('http')) {
         continue;
      }
      aComments[i].innerHTML = '<a target="_blank" href="' + text[0] + '">' + text[0] + '</a> ' + text[1];
      aComments[i].onclick = () => {
         sendLog(19);
      };
   }
}

// Kollar via cookie om loggning är avstängt, om det är det läggs varningsruta till i toppen av sidan
if (getCookie('logsDisabled')) {
   const logsWarning = document.createElement('div');
   logsWarning.id = 'logsWarning';
   logsWarning.innerText = 'Loggning för CjS är inaktiverat. Återaktivera detta så fort du testat klart.';
   if (window === window.top) {
      document.querySelector('body').prepend(logsWarning);
      if (document.getElementById('filter-query-multi-action')) {
         // eslint-disable-next-line no-restricted-syntax -- Style-egenskapen är nödvändig eftersom det är ett värde som OP5 redan använder som vi vill ändra.
         document.getElementById('filter-query-multi-action').style.top = '135px';
      }
   }
}

// Kod för att lägga till knappar till checksidan i OP5
if (window.location.href.startsWith('https://op5.lkl.ltkalmar.se/monitor/index.php/extinfo') || window.location.href.startsWith('https://op5test.lkl.ltkalmar.se/monitor/index.php/extinfo')) {
   addServicepageButtons();
}

// Checka alla-knapp
if (window.location.href.startsWith('https://op5.lkl.ltkalmar.se/monitor/index.php/listview') || window.location.href.startsWith('https://op5test.lkl.ltkalmar.se/monitor/index.php/listview')) {
   const menuDiv = document.getElementsByClassName('main-toolbar')[0];
   const clearElement = menuDiv.getElementsByClassName('clear')[0];

   const checkAllBtn = document.createElement('button');
   checkAllBtn.href = '#';
   checkAllBtn.id = 'checkAllButton';
   checkAllBtn.className = 'multi-action-send-link';
   checkAllBtn.innerHTML = 'Checka alla';
   checkAllBtn.setAttribute('data-multi-action-command', 'check_now');
   checkAllBtn.onclick = () => {
      (document.getElementById('select_all')).click();
      sendLog(7);
   };
   menuDiv.appendChild(checkAllBtn);
   menuDiv.insertBefore(checkAllBtn, clearElement);
}

// Automatiskt klick på Done-knappen när man gör Check now
if (window.location.href === 'https://op5.lkl.ltkalmar.se/monitor/index.php/cmd/obj' || window.location.href === 'https://op5test.lkl.ltkalmar.se/monitor/index.php/cmd/obj') {
   if (document.getElementsByClassName('alert notice')[0]) {
      history.go(-2);
      sendLog(8);
   }
}

// Lägger till listvy-element
if (window.location.href.startsWith('https://op5.lkl.ltkalmar.se/monitor/index.php/listview') || window.location.href.startsWith('https://op5test.lkl.ltkalmar.se/monitor/index.php/listview')) {

   // Lägger till knapp för att stänga av loggning
   const choiceList = document.getElementById('filter-query-multi-action');
   if (choiceList.querySelector('ul')) {
      const choiceColumn = choiceList.querySelector('ul');

      const choiceItem = document.createElement('li');
      choiceItem.id = 'turnoffLogsItem';
      const choiceButton = document.createElement('btn');
      choiceButton.id = 'turnoffLogsButton';
      if (getCookie('logsDisabled')) {
         choiceButton.innerText = 'Återaktivera loggning';
      } else {
         choiceButton.innerText = 'Stäng av loggning';
      }
      choiceButton.onclick = () => {
         if (getCookie('logsDisabled')) {
            document.cookie = 'logsDisabled=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.ltkalmar.se';
            alert('Loggning är nu återaktiverat.');
            location.reload();
            return;
         }
         if (!confirm('Du kommer nu stänga av loggning av CjS-knappar. Detta ska endast användas i testsyfte och om du vet vad du håller på med. Vill du fortsätta?')) {
            return;
         }
         setCookie('logsDisabled', true, 86400);
         location.reload();
      };
      const choiceSpan = document.createElement('span');
      choiceSpan.className = 'icon-16 x16-disable-active-checks';
      choiceColumn.appendChild(choiceItem);
      choiceItem.appendChild(choiceButton);
      choiceButton.prepend(choiceSpan);
   }

   // Lägger till eller tar bort fyrverkerier och listvy-knappar beroende på om det finns larm eller inte
   const callback = () => {
      const blueElement = document.getElementsByClassName('alert notice')[0];
      if (blueElement) {
         addFireworks(blueElement);
         return;
      }
      const checkElement = document.getElementsByClassName('even listview_row')[0];
      if (checkElement) {
         removeFireworks();
         addListviewButtons();
      }
   };

   callback();

   // Skapa en MutationObserver-instans, som lyssnar efter att HTML-sidan ändras
   const observer = new MutationObserver(callback);
   observer.observe(document, { childList: true, subtree: true });
}

// Öppna automatiskt alla ändringar i pending changes
if (window.location.href === ('https://op5.lkl.ltkalmar.se/monitor/op5/nacoma/export.php') || window.location.href === ('https://op5test.lkl.ltkalmar.se/monitor/op5/nacoma/export.php')) {
   const open = document.getElementsByClassName('changelisting')[0];
   // eslint-disable-next-line no-restricted-syntax -- Style-egenskapen är nödvändig eftersom OP5 använder den för att avgöra vad som ska vara utfällt.
   open.style = 'nothing';
   const cl = document.getElementsByClassName('has-children');
   for (let i = 0; i < cl.length; i++) {
      const elements = open.getElementsByClassName('has-children')[i];
      elements.classList.add('expanded');
      const change = elements.querySelector('ul');
      // eslint-disable-next-line no-restricted-syntax -- Style-egenskapen är nödvändig eftersom OP5 använder den för att avgöra vad som ska vara utfällt.
      change.style = '';
   }
}

// Funktion för att lägga till knappar för checksidor
function addServicepageButtons() {

   // Skapar en div-container för knapparna på larmet
   const newDiv = document.createElement('div');
   newDiv.id = 'buttonDiv';
   let element = document.getElementsByClassName('information-state-box-block')[0];
   element.insertBefore(newDiv, element.lastChild);
   element = document.getElementById('buttonDiv');

   // Skapar en div-container för de övre knapparna
   const topDivBlock = document.createElement('div');
   topDivBlock.id = 'upperDivBlock';
   const toolbarElement = document.getElementsByClassName('main-toolbar')[0];
   toolbarElement.insertBefore(topDivBlock, toolbarElement.childNodes[2]);

   // Sätter variabeln checkstatus som värdet på checkens status
   const checkstatus = document.getElementsByClassName('information-state-box-state')[0].innerText;

   // Sök-knapp
   const searchBtn = document.createElement('button');
   searchBtn.id = 'searchButton';
   searchBtn.className = 'servicepage-buttons';
   searchBtn.innerHTML = 'SÖK I CMDB';
   searchBtn.onclick = () => {
      searchCI();
   };
   element.appendChild(searchBtn);

   // Skapa ärende-knapp
   const createAckButton = document.createElement('button');
   createAckButton.id = 'createAckButton';
   createAckButton.className = 'servicepage-buttons';
   createAckButton.innerHTML = 'SKAPA ÄRENDE';
   createAckButton.onclick = () => {
      createRequestAck();
   };
   element.appendChild(createAckButton);

   // Skapa ärende-knapp
   const createAutogenButton = document.createElement('button');
   createAutogenButton.id = 'autogenButton';
   createAutogenButton.className = 'servicepage-buttons';
   createAutogenButton.innerHTML = 'AUTOGENERERA ÄRENDE';
   createAutogenButton.onclick = () => {
      autogenerateRequest();
   };
   element.appendChild(createAutogenButton);

   // Visa i Grafana-knapp
   const createGrafButton = document.createElement('button');
   createGrafButton.id = 'createGrafButton';
   createGrafButton.className = 'servicepage-buttons';
   createGrafButton.innerHTML = 'VISA I GRAFANA';
   createGrafButton.onclick = () => {
      showGrafana();
   };
   element.appendChild(createGrafButton);


   // Visa i Netbox-knapp
   const createNetboxButton = document.createElement('button');
   createNetboxButton.id = 'createNetboxButton';
   createNetboxButton.className = 'servicepage-buttons';
   createNetboxButton.innerHTML = 'VISA I NETBOX';
   createNetboxButton.onclick = () => {
      showNetbox();
   };
   element.appendChild(createNetboxButton);


   // Visa i Changelog-knapp
   const createChangelogButton = document.createElement('button');
   createChangelogButton.id = 'changelogButton';
   createChangelogButton.className = 'upper-servicepage-buttons';
   createChangelogButton.innerHTML = 'VISA I CHANGELOG';
   createChangelogButton.onclick = () => {
      showChangelog();
   };
   topDivBlock.appendChild(createChangelogButton);
   const optionsElement = document.getElementsByClassName('menu main-toolbar-menu menu menu-right')[0];
   topDivBlock.appendChild(optionsElement);


   // Visa i Eventlog-knapp
   const createEventlogButton = document.createElement('button');
   createEventlogButton.id = 'createEventlogButton';
   createEventlogButton.className = 'upper-servicepage-buttons';
   createEventlogButton.innerHTML = 'VISA EVENTLOG';
   createEventlogButton.onclick = () => {
      showEventlog();
      sendLog(6, getParameterByName('host'));
   };
   topDivBlock.appendChild(createEventlogButton);


   // Avgör vilken färg knapparna får beroende på checkstatus
   switch (checkstatus) {
   case 'OK':
   case 'UP':
      searchBtn.classList.add('servicepage-buttons-ok');
      createAckButton.classList.add('servicepage-buttons-ok');
      createAutogenButton.classList.add('servicepage-buttons-ok');
      createGrafButton.classList.add('servicepage-buttons-ok');
      createNetboxButton.classList.add('servicepage-buttons-ok');
      break;
   case 'CRITICAL':
   case 'DOWN':
      searchBtn.classList.add('servicepage-buttons-crit');
      createAckButton.classList.add('servicepage-buttons-crit');
      createAutogenButton.classList.add('servicepage-buttons-crit');
      createGrafButton.classList.add('servicepage-buttons-crit');
      createNetboxButton.classList.add('servicepage-buttons-crit');
      break;
   case 'WARNING':
   case 'UNREACHABLE':
      searchBtn.classList.add('servicepage-buttons-warn');
      createAckButton.classList.add('servicepage-buttons-warn');
      createAutogenButton.classList.add('servicepage-buttons-warn');
      createGrafButton.classList.add('servicepage-buttons-warn');
      createNetboxButton.classList.add('servicepage-buttons-warn');
      break;
   case 'UNKNOWN':
      searchBtn.classList.add('servicepage-buttons-unknown');
      createAckButton.classList.add('servicepage-buttons-unknown');
      createAutogenButton.classList.add('servicepage-buttons-unknown');
      createGrafButton.classList.add('servicepage-buttons-unknown');
      createNetboxButton.classList.add('servicepage-buttons-unknown');
      break;
   case 'PENDING':
      searchBtn.classList.add('servicepage-buttons-pending');
      createAckButton.classList.add('servicepage-buttons-pending');
      createAutogenButton.classList.add('servicepage-buttons-pending');
      createGrafButton.classList.add('servicepage-buttons-pending');
      createNetboxButton.classList.add('servicepage-buttons-pending');
      break;
   }
}

// Funktion för att söka efter CI
function searchCI() {
   let hostname = getParameterByName('host');
   if (hostname.includes('.lkl.ltkalmar.se')) {
      hostname = hostname.replace('.lkl.ltkalmar.se', '');
   }
   if (hostname.includes('PCX')) {
      hostname = hostname.replace('PCX', 'NX');
   }
   if (hostname.includes('PC')) {
      hostname = hostname.replace('PC', '');
   }
   setCookie('searchLink', hostname, 5);
   window.open('https://servicedesk.lkl.ltkalmar.se/CMDBAction.do?mode=listView&allCIs=true', '_blank');
   sendLog(1, hostname);
}

// Funktion för att skapa ärende
function createRequestAck() {
   const eventInfo = getEventInfo();
   setCookie('OP5link', eventInfo.location, 25);
   setCookie('OP5hostname', eventInfo.hostname, 25);
   setCookie('OP5output', eventInfo.output, 25);
   setCookie('OP5lastChange', eventInfo.lastChange, 25);
   window.open('https://servicedesk.lkl.ltkalmar.se/WorkOrder.do?woMode=newWO&reqTemplate=20101');
   sendLog(2, eventInfo.hostname);
   window.open(eventInfo.ackLink, '_self');
}

// Funktion för att autogenerera ärende
function autogenerateRequest() {
   setCookie('op5Autofill', 'true', 5);
   const eventInfo = getEventInfo();
   setCookie('op5Location', eventInfo.location, 10);
   setCookie('op5EventTitle', eventInfo.eventTitle, 10);
   setCookie('op5Hostname', eventInfo.hostname, 10);
   setCookie('op5output', eventInfo.output, 10);
   setCookie('op5LastChange', eventInfo.lastChange, 10);
   window.open('https://servicedesk.lkl.ltkalmar.se', '_blank');

   const ticketNumInterval = setInterval(() => {
      if (!getCookie('SDPTicketNumber')) {
         return;
      }
      clearInterval(ticketNumInterval);

      const ackDetails = {
         // eslint-disable-next-line camelcase -- Disablas eftersom egenskapen är OP5-specifik.
         host_name: eventInfo.hostname,
         // eslint-disable-next-line camelcase -- Disablas eftersom egenskapen är OP5-specifik.
         service_description: eventInfo.eventTitle,
         sticky: 1,
         notify: true,
         persistent: true,
         comment: `https://servicedesk.lkl.ltkalmar.se/WorkOrder.do?woMode=viewWO&woID=${getCookie('SDPTicketNumber')} //${getCookie('SDPUsername')}`
      };

      fetch('https://op5.lkl.ltkalmar.se/api/command/ACKNOWLEDGE_SVC_PROBLEM', {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json'
         },
         body: JSON.stringify(ackDetails)
      })
         .then(response => {
            if (!response.ok) {
               alert('Kunde inte skapa ackning, du behöver acka manuellt.');
            }
         });

      sendLog(30, eventInfo.hostname);
   }, 100);
}

// Funktion för att öppna i Grafana
function showGrafana() {
   const hostname = getParameterByName('host');
   const hostRegex = /.*-.*-.*/g;
   sendLog(3, hostname);
   if (hostRegex.test(hostname)) {
      window.open('https://servery.lkl.ltkalmar.se/grafana/d/tLcwDxnVz/health-switchar?orgId=1&var-host=' + hostname + '&kiosk');
      return;
   }
   window.open('https://servery.lkl.ltkalmar.se/grafana/d/JQ6p8uM4k/health?orgId=1&refresh=1m&var-host=' + hostname);
}

// Funktion för att öppna i Netbox
function showNetbox() {
   const hostname = getParameterByName('host');
   window.open('https://netbox.lkl.ltkalmar.se/search/?q=' + hostname);
   sendLog(4, hostname);
}

// Funktion för att öppna i Changelog
function showChangelog() {
   const hostname = getParameterByName('host');
   if (window.location.href.startsWith('https://op5test.lkl.ltkalmar.se')) {
      window.open('https://op5test.lkl.ltkalmar.se/monitor/index.php/configuration/configure?page=changelog_history.php%3Fmatch_username%3D%26match_object%3D' + hostname + '%26match_time_start%3D%26match_time_stop%3D', '_self');
   } else {
      window.open('https://op5.lkl.ltkalmar.se/monitor/index.php/configuration/configure?page=changelog_history.php%3Fmatch_username%3D%26match_object%3D' + hostname + '%26match_time_start%3D%26match_time_stop%3D', '_self');
   }
   sendLog(5, hostname);
}

// Funktion för att öppna i Eventlog
function showEventlog() {
   const eventLogLink = document.querySelectorAll('[data-menu-id="event_log"]')[1].href;
   window.open(eventLogLink);
}

function getEventInfo() {
   const hostname = getParameterByName('host');
   let output = document.getElementsByClassName('output')[0].innerText;
   if ((/\n+$/).test(output)) {
      output = output.replace(/\n+$/, '');
   }
   const location = document.location.href;
   const identifiedClass = document.getElementsByClassName('information-cell');
   let found;
   for (let i = 0; i < identifiedClass.length; i++) {
      if (identifiedClass[i].textContent.includes('Last change')) {
         found = identifiedClass[i];
         break;
      }
   }
   const lastChange = 'Last change: ' + found.childNodes[3].innerText + ' ago' + ' (' + found.childNodes[5].innerText + ')';
   const ackLink = document.getElementsByClassName('information-state-box-more')[0].childNodes[1].childNodes[1].childNodes[1].href;
   const eventTitle = getParameterByName('service');
   return {
      hostname,
      output,
      location,
      lastChange,
      ackLink,
      eventTitle
   };
}

// Funktion för att lägga till fyrverkerier när det inte finns några larm
function addFireworks(blueElement) {
   blueElement.remove();
   if (!document.getElementById('fireworksElement')) {
      let mainelement = document.getElementById('content');
      if (!mainelement) {
         mainelement = document.getElementById('mainelement');
      }
      mainelement.id = 'mainelement';
      const parentElement = document.createElement('div');
      parentElement.id = 'parentElement';
      const divElement = document.createElement('div');
      divElement.id = 'divElement';
      mainelement.appendChild(parentElement);
      parentElement.appendChild(divElement);

      const imageelement = document.createElement('img');
      imageelement.id = 'fireworksElement';
      const currentDate = new Date();
      const monthIndex = currentDate.getMonth();
      if (monthIndex === 11) {
         imageelement.src = 'https://serverx.lkl.ltkalmar.se/cjs/resources/santa-dance.gif';
      } else {
         imageelement.src = 'https://serverx.lkl.ltkalmar.se/cjs/resources/fireworks.gif';
      }
      divElement.appendChild(imageelement);

      const textElement = document.createElement('p');
      textElement.id = 'textElement';
      textElement.innerText = 'INGA LARM';
      divElement.appendChild(textElement);
   }
}

// Funktion för att ta bort fyrverkerier om det kommer ett larm när fyrverkerierna visas
function removeFireworks() {
   const newParentElement = document.getElementById('parentElement');
   const newdivElement = document.getElementById('divElement');
   const newFireworksElement = document.getElementById('fireworksElement');
   const newTextElement = document.getElementById('textElement');
   if (newParentElement || newdivElement || newFireworksElement || newTextElement) {
      newParentElement.remove();
      newdivElement.remove();
      newFireworksElement.remove();
      newTextElement.remove();
   }
}



// Funktion för att lägga till småknappar i listvyn
function addListviewButtons() {
   const filterlist = document.getElementById('filter_result');
   const filterTbody = filterlist.querySelector('tbody');
   const filterRows = filterTbody.querySelectorAll('tr');
   for (let i = 0; i < filterRows.length; i++) {
      const tempRow = filterRows[i];
      let buttonRow;
      if (window.location.href.startsWith('https://op5.lkl.ltkalmar.se/monitor/index.php/listview?q=%5Bhosts') || window.location.href.startsWith('https://op5.lkl.ltkalmar.se/monitor/index.php/listview?q=%5Bhosts')) {
         if (!(tempRow.querySelector('td a[href^=\'/monitor/index.php/configuration/configure/?type=\']'))) {
            continue;
         }
         buttonRow = (tempRow.querySelector('td a[href^=\'/monitor/index.php/configuration/configure/?type=\']')).parentElement;
      } else if (tempRow.querySelector('td a[href^=\'/monitor/index.php/configuration/configure/?type=service\']')) {
         buttonRow = (tempRow.querySelector('td a[href^=\'/monitor/index.php/configuration/configure/?type=service\']')).parentElement;
      }

      // Lägg till kopiera larminfo-knapp i listvyn
      const copyImg = document.createElement('img');
      copyImg.classList.add('customButtons', 'customCopyButton');
      copyImg.src = 'https://serverx.lkl.ltkalmar.se/cjs/resources/copyicon.png';
      copyImg.title = 'Kopiera larminfo';
      copyImg.onclick = function() {
         copyAlertInfo(tempRow);
         copyImg.src = 'https://serverx.lkl.ltkalmar.se/cjs/resources/checkicon.png';
         copyImg.title = 'Länk kopierad';
      };

      const op5Regex = /https:\/\/op5\.lkl\.ltkalmar\.se\/monitor\/index\.php\/listview.*services.*/;
      if (buttonRow && op5Regex.test(window.location.href) && (!buttonRow.getElementsByClassName('customCopyButton')[0])) {
         buttonRow.appendChild(copyImg);
      }

      // Lägg till sökknapp i listvyn
      const smallSearch = document.createElement('span');
      smallSearch.classList.add('icon-16', 'x16-use_search', 'customButtons', 'customSearchButton');
      smallSearch.title = 'Sök i CMDB';
      smallSearch.onclick = function() {
         searchCIFromList(tempRow);
      };
      if (buttonRow && !buttonRow.getElementsByClassName('customSearchButton')[0]) {
         buttonRow.appendChild(smallSearch);
      }

      // Lägg till Skapa ärende-knapp i listvyn
      const smallTicket = document.createElement('span');
      smallTicket.classList.add('icon-16', 'x16-edit', 'customButtons', 'customReqButton');
      smallTicket.title = 'Skapa ärende';

      const smallTicketLink = document.createElement('span');
      smallTicketLink.setAttribute('data-multi-action-command', 'acknowledge_problem');
      smallTicketLink.className = 'multi-action-send-link';

      if (op5Regex.test(window.location.href) && (!buttonRow.getElementsByClassName('icon-16 x16-edit')[0])) {
         buttonRow.appendChild(smallTicketLink);
         smallTicketLink.appendChild(smallTicket);
      }
      smallTicket.onclick = function() {
         createReqFromList(tempRow);
      };
   }
}

// Funktion för att kopiera larminfo från listvyn
function copyAlertInfo(tempRow) {
   const alertInfo = getListviewServiceInfo(tempRow);
   navigator.clipboard.writeText(alertInfo.copyLink + '\r\n' + '\r\n' + alertInfo.buttonHostname + '\r\n' + alertInfo.buttonOutput + '\r\n' + '\r\n' + alertInfo.buttonLastChange);
   sendLog(9, alertInfo.buttonHostname);
}

// Funktion för att söka CI från listvyn
function searchCIFromList(tempRow) {
   let buttonCheckName;
   if (tempRow.querySelectorAll('td[data-table=\'services\']')[0]) {
      buttonCheckName = (tempRow.querySelectorAll('td[data-table=\'services\']')[0]).getAttribute('data-object');
   } else {
      buttonCheckName = (tempRow.querySelectorAll('td[data-table=\'hosts\']')[0]).getAttribute('data-object');
   }
   let buttonHostname = buttonCheckName.replace(/;.*$/, '');
   if (buttonHostname.includes('PCX')) {
      buttonHostname = buttonHostname.replace('PCX', 'NX');
   }
   if (buttonHostname.includes('PC')) {
      buttonHostname = buttonHostname.replace('PC', '');
   }
   setCookie('searchLink', buttonHostname, 5);
   window.open('https://servicedesk.lkl.ltkalmar.se/CMDBAction.do?mode=listView&allCIs=true', '_blank');
   sendLog(10, buttonHostname);
}

// Funktion för att skapa ärende från listvyn
function createReqFromList(tempRow) {
   const alertInfo = getListviewServiceInfo(tempRow);
   setCookie('OP5link', alertInfo.copyLink, 25);
   setCookie('OP5hostname', alertInfo.buttonHostname, 25);
   setCookie('OP5output', alertInfo.buttonOutput, 25);
   setCookie('OP5lastChange', alertInfo.buttonLastChange, 25);
   window.open('https://servicedesk.lkl.ltkalmar.se/WorkOrder.do?woMode=newWO&reqTemplate=20101');
   sendLog(11, alertInfo.buttonHostname);
   tempRow.querySelector('input').click();
}

// Funktion för att hämta info om larm (används av copyAlertInfo och createReqFromList)
function getListviewServiceInfo(tempRow) {
   let buttonCheckName;
   let buttonHostname;
   let copyLink;
   let buttonOutput;
   let buttonLastChange;
   if (window.location.href.startsWith('https://op5.lkl.ltkalmar.se/monitor/index.php/listview?q=%5Bservices') || window.location.href.startsWith('https://op5.lkl.ltkalmar.se/monitor/index.php/listview/?q=%5Bservices')) {
      if (!tempRow.querySelectorAll('td[data-table=\'services\']')[0]) {
         return;
      }
      buttonCheckName = (tempRow.querySelectorAll('td[data-table=\'services\']')[0]).getAttribute('data-object');
      buttonHostname = buttonCheckName.replace(/;.*$/, '');
      const buttonServiceName = buttonCheckName.replace(/^.*;/, '');
      const tdElements = tempRow.querySelectorAll('td');
      for (let i = 0; i < tdElements.length; i++) {
         const content = tdElements[i].textContent;
         if (content === buttonServiceName) {
            copyLink = tdElements[i].querySelector('a').href;
            break;
         }
      }
      buttonOutput = (tempRow.getElementsByClassName('restricted-output')[0]).innerHTML;
      const buttonElements = tempRow.querySelectorAll('td');
      const buttonRegex = /.*\d[smhd]\s$/;
      for (let i = 0; i < buttonElements.length; i++) {
         const inner = buttonElements[i].innerHTML;
         if (buttonRegex.test(inner)) {
            buttonLastChange = 'Last change: ' + buttonElements[i].innerHTML + 'ago';
            break;
         }
      }
      return {
         copyLink,
         buttonHostname,
         buttonOutput,
         buttonLastChange
      };
   }
}



// Funktion för att definiera cookie
function setCookie(cookieName, cookieValue, cookieLifeSeconds) {
   const searchDate = new Date();
   searchDate.setTime(searchDate.getTime() + (cookieLifeSeconds * 1000));
   const searchExpires = '; expires=' + searchDate.toUTCString();
   document.cookie = cookieName + '=' + cookieValue + searchExpires + '; path=/; domain=.ltkalmar.se';
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

// Funktion för att hämta url-parametrar
function getParameterByName(name, url) {
   if (!url) {
      url = window.location.href;
   }
   name = name.replace(/[[\]]/g, '\\$&');
   const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
   const results = regex.exec(url);
   if (!results) {
      return null;
   }
   if (!results[2]) {
      return '';
   }
   return decodeURIComponent(results[2].replace(/\+/g, ' '));
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
      data = { token: 'XXXXXXXXXXXXXXXX', user: username, button: buttonID, object: currentObject};
   } else {
      data = { token: 'XXXXXXXXXXXXXXXX', user: username, button: buttonID};
   }

   fetch('https://serverx.lkl.ltkalmar.se/api/log', {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
   })
      .then(response => {
         if (!response.ok) {
            // eslint-disable-next-line no-console -- Om ett loggningsfel skulle uppstå är det bra att kunna se det i loggen.
            console.error('Loggningsfel i Log4CjS inträffade:', response.status);
         }
      })
      .catch(error => {
         console.error('Anslutningsfel till Log4CjS inträffade:', error);
      });
}