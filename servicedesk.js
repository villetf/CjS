// servicedesk.js
// Del av CjS version 5.3.0
//
//
//
// Denna kod är avsedd att köras tillsammans med pluginet Custom Javascript for Websites 2. I pluginet infogas en länk till basskript.js.
// Skriptet förvaras på serverx. Länken till skriptet är https://serverx.domain.se/cjs/servicedesk.js.
//
// Mer info finns på https://codeplatform.domain.se/team/cjs.

/* global $req Swal */



// Sätter cookie med ens namn för att använda i Log4CjS
setTimeout(() => {
   const searchDate = new Date();
   searchDate.setTime(searchDate.getTime() + (2592000000));
   const searchExpires = '; expires=' + searchDate.toUTCString();
   document.cookie = 'servicedeskUsername=' + parent.servicedesk_user.USERNAME + searchExpires + '; path=/; domain=.domain.se';
}, 1000);

// Kollar via cookie om loggning är avstängt, om det är det läggs varningsruta till i toppen av sidan
if (getCookie('logsDisabled')) {
   const logsWarning = document.createElement('div');
   logsWarning.id = 'logsWarning';
   logsWarning.innerText = 'Loggning för CjS är inaktiverat. Återaktivera detta så fort du testat klart.';
   if (window === window.top) {
      document.querySelector('body').prepend(logsWarning);
   }
}

if (getCookie('siemAutofill') && !(getCookie('servicedeskTicketNumber'))) {
   createSIEMTicket();
}

if (getCookie('monsysAutofill') && !(getCookie('servicedeskTicketNumber'))) {
   createÖvervakningssystemTicket();
}

// Sök CI
if (window.location.href === 'https://servicedesk.domain.se/CMDBAction?mode=listView&allCIs=true') {
   const searchString = getCookie('searchLink');
   if (searchString) {
      document.getElementsByClassName('tableSearchButton')[0].click();
      document.getElementById('AllCISView_CINAMEtxt').value = searchString;
      document.getElementsByName('searchSubmit')[0].click();
   }
}

// Lägga till kopiera-knapp på ärenden
if (window.location.href.startsWith('https://servicedesk.domain.se/WorkOrder?woMode=viewWO&woID') || window.location.href === ('https://servicedesk.domain.se/WOListView')) {
   const callback = () => {
      if (!document.getElementById('servicedeskCopyButton') && document.getElementById('actionsBar')) {
         const copyButton = document.createElement('button');
         copyButton.id = 'servicedeskCopyButton';
         copyButton.className = 'btn btn-default btn-xs dropdown-toggle';
         copyButton.innerHTML = 'Kopiera &#228;rendel&#228;nk';
         copyButton.onclick = function() {
            copyReqId();
         };
         document.getElementById('actionsBar').appendChild(copyButton);
      }
   };
   callback();
   const observer = new MutationObserver(callback);
   observer.observe(document.querySelector('title'), { subtree: true, characterData: true, childList: true });
}

// Lägga till Gå till Övervakningssystem-knapp
if (window.location.href.startsWith('https://servicedesk.domain.se/ViewCIDetails')) {
   setTimeout(function() {
      let cmdbHost = document.getElementsByName('name')[0].innerText;
      if (cmdbHost.includes('NX')) {
         cmdbHost = cmdbHost.replace('NX', 'PCX');
      }
      const compRegex = /[0-9]{6}/g;
      if (cmdbHost.match(compRegex)) {
         cmdbHost = 'PC' + cmdbHost;
      }
      const monsysBtn = document.createElement('button');
      monsysBtn.onclick = function() {
         window.open('https://monsys.domain.se/monitor/index/listview/?q=%5Bservices%5D%20host.name%20%3D~%20%22' + cmdbHost + '%22');
         sendLog(13, cmdbHost);
      };
      monsysBtn.className = 'btn btn-default btn-xs';
      monsysBtn.innerHTML = 'Visa i Övervakningssystem';
      const elementParts = document.getElementById('asset_actions').getElementsByClassName('btn-group')[0];
      elementParts.appendChild(monsysBtn, elementParts);
   }, 50);
}

// Infoga information i ärende automatiskt
if (window.location.href === 'https://servicedesk.domain.se/WorkOrder?woMode=newWO&reqTemplate=20101') {
   (() => {
      const link = getCookie('Övervakningssystemlink');
      const hostname = getCookie('Övervakningssystemhostname');
      const output = getCookie('Övervakningssystemoutput');

      if (!hostname) {
         return;
      }

      // Kollar ifall cookien för system finns, om den gör det kolla vilka som förvaltar
      const cookieInterval = setInterval(async() => {
         const system = getCookie('systemCookie');
         if (system) {
            clearInterval(cookieInterval);
            const ownerxhr = await getSupportgroup(system);
            const ownerJSON = JSON.parse(ownerxhr);
            const ownerName = ownerJSON.API.response.operation.Details.relationships.relationship.ci.name;
            const infoText = document.createElement('p');
            infoText.innerText = 'På ' + hostname + ' körs systemet ' + system + ' som driftas av ' + ownerName + '.';
            infoText.id = 'servicedeskInfoText';
            const parentList = document.getElementsByClassName('form-group  ')[4];
            const childList = parentList.getElementsByClassName('col-group ')[0];
            const veryChildList = childList.getElementsByClassName('fafr-row col-fields')[0];
            childList.insertBefore(infoText, veryChildList);
         }
      }, 200);

      // Kollar ifall textrutan genererats, om ja börja autofylla
      const elementInterval = setInterval(() => {
         if (document.getElementsByClassName('ze_area')[0]) {
            autofillRequestInfo(link, hostname, output);
            clearInterval(elementInterval);
         }
      }, 10);
   })();
}

// Ange att rätt host ska sökas på och väljas om CI-sökrutan är öppen
if (window.location.href === 'https://servicedesk.domain.se/asset/AssetPopup?forwardTo=list&from=request') {
   selectCIs();
}

// Ange att användaren ska väljas om användarsökrutan är öppen med Team som sökning
if (window.location.href === 'https://servicedesk.domain.se/setup/UsersPopup?popupfor=searchuser&module=Request&isUser=true&searchText=Team') {
   selectUserFromSearch('93489', 'TeamUser');
}



// Funktion för att autofylla formuläret, välja beställare och öppna CI-sökrutan
function autofillRequestInfo(link, hostname, output) {
   const lastChange = getCookie('ÖvervakningssystemlastChange');
   if (!lastChange) {
      return;
   }
   const userText = document.getElementsByClassName('ze_area')[0].contentWindow.document.querySelector('body');
   const replacedLink = link.replace(/^[^]*service=/, '');
   const decodedLink = decodeURIComponent(replacedLink);

   const linkTag = document.createElement('a');
   linkTag.setAttribute('target', '_blank');
   linkTag.href = link;
   linkTag.innerHTML = decodedLink;

   userText.childNodes[2].appendChild(linkTag);
   const breakTag = userText.childNodes[2].querySelector('br');
   linkTag.parentNode.insertBefore(breakTag, linkTag.nextSibling);

   const div4 = document.createElement('div');
   const br4 = document.createElement('br');
   userText.appendChild(div4);
   div4.appendChild(br4);

   const div5 = document.createElement('div');
   const br5 = document.createElement('br');
   userText.appendChild(div5);
   div5.appendChild(br5);

   const div6 = document.createElement('div');
   const br6 = document.createElement('br');
   userText.appendChild(div6);
   div6.appendChild(br6);

   const div7 = document.createElement('div');
   const br7 = document.createElement('br');
   userText.appendChild(div7);
   div7.appendChild(br7);

   const div8 = document.createElement('div');
   const br8 = document.createElement('br');
   userText.appendChild(div8);
   div8.appendChild(br8);

   div5.innerText = hostname;
   div6.innerText = output;
   div8.innerText = lastChange;

   if (hostname) {
      openAssociateCI();
   }

   showUserSearchPopup('Request', true, 'Teamet', 'requests', 'null', 'requester');
}

// Asynkron funktion för att öppna sidan för att söka efter CI
async function openAssociateCI() {
   $req.form.openAssetModuleList();
}

// Funktion som körs om CI-sökrutan är öppen
async function selectCIs() {
   let hostname = getCookie('Övervakningssystemhostname');
   if (!hostname) {
      return;
   }
   if (hostname.includes('PCX')) {
      hostname = hostname.replace('PCX', 'NX');
   }
   if (hostname.includes('PC')) {
      hostname = hostname.replace('PC', '');
   }
   let hostnameSelected = false;
   let hostCheckboxJustClicked = false;

   // Sätter intervall för att börja söka efter hostnamn när sidan laddat
   const waitForElement = setInterval(() => {
      if (!document.querySelector('[data-id="name"]')) {
         return;
      }
      clearTimeout(waitForElement);
      const inputField = document.querySelector('input[data-id="name"]');
      inputField.value = hostname;
      const pressEnterText = document.createTextNode('Tryck enter');
      inputField.parentElement.parentElement.appendChild(pressEnterText);

      document.getElementById('assets_list_listSearch').click();
      inputField.addEventListener('keydown', function(event) {
         if (!event.key === 'Enter') {
            return;
         }
         hostCheckboxJustClicked = true;
      });
   }, 10);

   // Sätter intervall fär att kolla när hostnamnsökningen är klar och checka i den
   const checkLoadInterval = setInterval(() => {
      if (!document.getElementsByName('checkbox')[0]) {
         return;
      }
      if (document.getElementsByName('checkbox')[0].value != '19201' && hostCheckboxJustClicked) {
         clearInterval(checkLoadInterval);
         hostCheckboxJustClicked = false;
         document.getElementsByName('checkbox')[0].click();
         hostnameSelected = true;
      }
   }, 10);

   // Gör API-anrop för att ta reda på system
   const xhr = await getSystem(hostname);

   // När API-anrop är klart, sök på system och välj rätt i listan
   const checkboxCheck = setInterval(() => {
      if (!hostnameSelected) {
         return;
      }
      clearInterval(checkboxCheck);
      let systemName;
      const parsedJSON = JSON.parse(xhr);
      systemName = parsedJSON.API.response.operation.Details.relationships?.relationship?.ci?.name;
      if (!systemName) {
         systemName = parsedJSON.API.response.operation.Details.relationships?.relationship?.ci[0]?.name;
      }
      if (!systemName) {
         document.getElementById('attach_cmp_asst').click();
         return;
      }

      setCookie('systemCookie', systemName, 3);
      document.querySelector('input[data-id="name"]').value = systemName;
      autoSelectSystem(systemName);
   }, 10);
}

// Funktion för att automatiskt välja rätt system bland sökresultaten
function autoSelectSystem(systemName) {
   const checkboxInterval = setInterval(() => {
      const checkboxRows = document.getElementById('assets_list_body');
      if (!(checkboxRows.innerText.toLowerCase()).includes(systemName.toLowerCase())) {
         return;
      }
      clearInterval(checkboxInterval);
      if (checkboxRows.childElementCount < 2) {
         checkboxRows.querySelectorAll('[name="checkbox"]')[0].click();
         document.getElementById('attach_cmp_asst').click();
      } else {
         for (let i = 0; i < checkboxRows.childElementCount; i++) {
            const currentCheckBoxText = checkboxRows.childNodes[i].childNodes[1].innerText;
            if (currentCheckBoxText === systemName) {
               checkboxRows.querySelectorAll('[name="checkbox"]')[i].click();
               document.getElementById('attach_cmp_asst').click();
               return;
            }
         }
      }
   }, 10);
}

// Funktion för att kopiera ärendelänk
function copyReqId() {
   const username = parent.servicedesk_user.USERNAME;
   const reqLink = location.href + ' //' + username;
   navigator.clipboard.writeText(reqLink);
   document.getElementById('servicedeskCopyButton').innerHTML = '&#196;rendel&#228;nk kopierad!';
   sendLog(12);
}

async function createSIEMTicket() {
   if (window.location.href === 'https://servicedesk.domain.se/framework/html/blank.html') {
      return;
   }

   const response = await fetch('https://serverx.domain.se/cjs/resources/ticketTemplate.json');
   if (!response.ok) {
      alert('Lyckades inte hämta ärendemall från serverx. Inget ärende har skapats.');
      return;
   }
   const ticketJson = await response.json();

   ticketJson.request.subject = getCookie('siemSubject');
   ticketJson.request.description = decodeURIComponent(getCookie('siemDescription'));

   const xhr = new XMLHttpRequest();
   xhr.withCredentials = false;
   xhr.open('POST', 'https://servicedesk.domain.se/api/v3/requests', false);
   xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

   xhr.onload = function() {
      const requestId = (JSON.parse(xhr.responseText)).request.id;
      setCookie('servicedeskTicketNumber', requestId, 5);
      window.location.href = `https://servicedesk.domain.se/WorkOrder?woID=${requestId}`;
   };
   xhr.onerror = function() {
      alert('Lyckades inte göra API-anrop mot servicedesk för att skapa ärende. Inget ärende har skapats.');
      console.error(xhr.response);
   };

   xhr.send('input_data=' + encodeURIComponent(JSON.stringify(ticketJson)));
}

async function createÖvervakningssystemTicket() {
   if (window.location.href === 'https://servicedesk.domain.se/framework/html/blank.html') {
      return;
   }

   const response = await fetch('https://serverx.domain.se/cjs/resources/monsysTicketTemplate.json');
   if (!response.ok) {
      alert('Lyckades inte hämta ärendemall från serverx. Inget ärende har skapats.');
      return;
   }
   const hostname = getCookie('monsysHostname');
   const ticketJson = await response.json();

   ticketJson.request.subject = `Övervakningssystem Larm - ${getCookie('monsysEventTitle')} (${hostname})`;
   ticketJson.request.description = `<div>Se information om larmet:<br></div><div><br></div><div><a target="_blank" href="${getCookie('monsysLocation')}">${getCookie('monsysEventTitle')}</a><br></div><div><br></div><div>${hostname}</div><div>${getCookie('monsysoutput')}</div><div><br></div><div>${getCookie('monsysLastChange')}</div>`;
   ticketJson.request.assets.push({name: hostname});

   const systemCall = await getSystem(hostname);
   if (JSON.parse(systemCall).API.response.operation.result.statuscode === 3021) {
      alert('Ärende kunde inte skapas eftersom hosten inte finns i CMDB.');
      window.close();
      return;
   }

   if (!JSON.parse(systemCall).API.response.operation.Details.relationships.relationship) {
      alert('Ärende kunde inte skapas eftersom något system inte finns associerat till hosten.');
      window.close();
      return;
   }

   const parsedSystem = JSON.parse(systemCall).API.response.operation.Details.relationships.relationship.ci;

   let associatedSystem;
   if (Array.isArray(parsedSystem)) {
      for (const i of parsedSystem) {
         if (i.type.match('Servermjukvara')) {
            associatedSystem = i.name;
         }
      }
   } else if (parsedSystem.type.match('Servermjukvara')) {
      associatedSystem = parsedSystem.name;
   }

   if (!associatedSystem) {
      alert('Ärende kunde inte skapas eftersom något system inte finns associerat till hosten.');
      window.close();
      return;
   }
   ticketJson.request.assets.push({name: associatedSystem});



   const systemGroup = await getSupportgroup(associatedSystem);
   if (!JSON.parse(systemGroup).API.response.operation.Details.relationships.relationship) {
      alert('Ärende kunde inte skapas eftersom någon supportgrupp inte finns på systemet.');
      window.close();
      return;
   }
   const parsedSupportGroup = JSON.parse(systemGroup).API.response.operation.Details.relationships.relationship.ci;

   let associatedSupportgroup;
   if (Array.isArray(parsedSupportGroup)) {
      alert('Ärende kunde inte skapas eftersom det finns flera supportgrupper associerade till systemet.');
   } else if (parsedSupportGroup.type === 'Supportgrupp') {
      associatedSupportgroup = parsedSupportGroup.name;
   }

   if (!associatedSystem) {
      alert('Ärende kunde inte skapas eftersom något system inte finns associerat till hosten.');
      window.close();
      return;
   }

   ticketJson.request.group.name = associatedSupportgroup;


   await Swal.fire({
      title: 'Välj prioritet på ärendet:',
      showDenyButton: true,
      showCancelButton: true,
      cancelButtonText: 'Hög',
      denyButtonText: 'Medium',
      confirmButtonText: 'Låg',
      showCloseButton: true,
      inputValidator: (value) => {
         if (!value) {
            return 'Du måste välja ett alternativ!';
         }
      }
   }).then((result) => {
      if (result.isConfirmed) {
         ticketJson.request.impact.name = '2. Grupp';
         ticketJson.request.urgency.name = '1. Kan vänta';
      } else if (result.isDenied) {
         ticketJson.request.impact.name = '2. Grupp';
         ticketJson.request.urgency.name = '2. Normal';
      } else if (result.dismiss === Swal.DismissReason.cancel) {
         ticketJson.request.impact.name = '3. Flera grupper';
         ticketJson.request.urgency.name = '3. Hög';
      }
   });

   // Gör anrop för att lägga ärende
   const xhr = new XMLHttpRequest();
   xhr.withCredentials = false;
   xhr.open('POST', 'https://servicedesk.domain.se/api/v3/requests', false);
   xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

   xhr.onload = function() {
      const requestId = (JSON.parse(xhr.responseText)).request.id;
      setCookie('servicedeskTicketNumber', requestId, 5);
      window.location.href = `https://servicedesk.domain.se/WorkOrder?woID=${requestId}`;
   };
   xhr.onerror = function() {
      alert('Lyckades inte göra API-anrop mot servicedesk för att skapa ärende. Inget ärende har skapats.');
      console.error(xhr.response);
   };

   xhr.send('input_data=' + encodeURIComponent(JSON.stringify(ticketJson)));
}

// Funktion för att hämta system på host
function getSystem(hostname) {
   return new Promise((resolve, reject) => {
      const data = new FormData();
      data.append('OPERATION_NAME', 'read');
      const xhr = new XMLHttpRequest();
      xhr.withCredentials = true;
      xhr.open('POST', 'https://servicedesk.domain.se/api/cmdb/cirelationships/' + hostname + '/v%C3%A4rd%20f%C3%B6r');
      xhr.send(data);
      xhr.addEventListener('readystatechange', () => {
         if (xhr.readyState !== 4) {
            return;
         }
         resolve(xhr.responseText);
      });
      xhr.onerror = () => {
         throw reject;
      };
   });
}

// Funktion för att hämta supportande team på system
function getSupportgroup(system) {
   return new Promise((resolve) => {
      const ownerdata = new FormData();
      ownerdata.append('OPERATION_NAME', 'read');

      const ownerxhr = new XMLHttpRequest();
      ownerxhr.withCredentials = true;
      ownerxhr.open('POST', 'https://servicedesk.domain.se/api/cmdb/cirelationships/' + system + '/Supportas%20av');
      ownerxhr.send(ownerdata);
      ownerxhr.onreadystatechange = () => {
         if (ownerxhr.readyState !== 4) {
            return;
         }
         resolve(ownerxhr.response);
      };
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

// Funktion för att definiera cookie
function setCookie(cookieName, cookieValue, cookieLifeSeconds) {
   const searchDate = new Date();
   searchDate.setTime(searchDate.getTime() + (cookieLifeSeconds * 1000));
   const searchExpires = '; expires=' + searchDate.toUTCString();
   document.cookie = cookieName + '=' + cookieValue + searchExpires + '; path=/; domain=.domain.se';
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
      data = { token: 'xxxxxxxxxxxxxxxxx', user: username, button: buttonID, object: currentObject};
   } else {
      data = { token: 'xxxxxxxxxxxxxxxxx', user: username, button: buttonID};
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