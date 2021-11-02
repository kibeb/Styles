// ==UserScript==
// @name        Gmail: Show full sender email addresses
// @description Based on https://openuserjs.org/install/gauda/Gmail_always_show_full_email_address.user.js
// @version     3.0.1
// @licence     MIT
// @namespace   https://github.com/kibeb/Styles
// @include     https://mail.google.com/mail/*
// @run-at      document-end
// ==/UserScript==

/* *** When is sender's name replaced with his/hers email address?
(=> means replaced; !=> means not replaced)

Rule 1: Name with spaces !=> ...@...
Rule 2: BigCompany !=> noreply@example.net
Rule 3: NoReply !=> noreply@example.net
Rule 4: noreply => noreply@example.net

Rule 2 notes:
  e.g. BigCompany -- not replaced with: noreply@example.net -- because "BigCompany" doesn't match "noreply" (the part before @ sign)
  To disabled this rule, go to Settings, scroll down to User excludes, enter "rule2=false" there and hit Save. Reload Gmail.
*/

function revealEmails4Class(classname) {
  Array.from(document.getElementsByClassName(classname)).forEach(function(element, index, array) {
    if(/ /.test(element.innerHTML)) return;
    var email = element.attributes.email;
    if(email && email.value) {
        if(rule2 && email.value.replace(/@.*/,'').toLowerCase() !== element.innerHTML.toLowerCase()) return;
        if(rule3 && email.value.replace(/@.*/,'') !== element.innerHTML) return;
        element.innerHTML = email.value;
    }
  });
}

function updateEmails() {
  revealEmails4Class('yP');
  revealEmails4Class('zF');
  //console.log('TampMonk/GmailEmails: updated');
}

var rule2 = true, rule3 = true;
//rule2 = !(/rule2=false/.test(GM_info.script.options.comment));
if(GM_info.script && GM_info.script.options && GM_info.script.options.override && GM_info.script.options.override.use_excludes) {
    rule2 = !(/rule2=false/.test(GM_info.script.options.override.use_excludes));
    rule3 = !(/rule3=false/.test(GM_info.script.options.override.use_excludes));
    console.log(GM_info.script.options.override.use_excludes + ' => ' + rule2 + ', ' + rule3);
}

//window.addEventListener ("hashchange", updateEmails, false);
window.setInterval(updateEmails, 2000);

window.GM_info = GM_info;
console.log('TampMonk/GmailEmails: initiated');


