// ==UserScript==
// @name        Gmail: Show full sender email addresses
// @description Better senders in messages list. No more 'noreply' lines which say you nothing. Based on https://openuserjs.org/install/gauda/Gmail_always_show_full_email_address.user.js
// @version     3.0.3
// @namespace   https://github.com/kibeb/Styles
// @homepageURL https://github.com/kibeb/Styles
// @downloadURL https://kibeb.github.io/Styles/GmailShowFullSender.user.js
// @updateURL   https://kibeb.github.io/Styles/GmailShowFullSender.user.js
// @include     https://mail.google.com/mail/*
// @run-at      document-end
// ==/UserScript==
// @licence     MIT

/* *** When is sender's name replaced with his/hers email address?
(=> means replaced; !=> means not replaced)

Rule 1: Name with spaces !=> never replaced
Rule 1.5: root => noreply@example.net
Rule 2: CamelCo !=> noreply@example.net
Rule 3: NoReply !=> noreply@example.net
Rule 4: noreply => noreply@example.net

Rule 2 notes:
  e.g. CamelCo -- not replaced with: noreply@example.net -- because "CamelCo" doesn't match "noreply" (the part before @ sign)

Rule 1.5, 2, 3 override:
  Go to Settings, scroll down to User excludes, enter e.g. "rule2=false" or "rule1.5=root,admin" there and hit Save. Reload Gmail.
*/

function revealEmails4Class(classname) {
  Array.from(document.getElementsByClassName(classname)).forEach(function(element, index, array) {
    if(/ /.test(element.innerHTML)) return;
    var email = element.attributes.email;
    if(email && email.value) {
        if(!rule1_5.includes(element.innerHTML.toLowerCase())) {
          if(rule2 && email.value.replace(/@.*/,'').toLowerCase() !== element.innerHTML.toLowerCase()) return;
          if(rule3 && email.value.replace(/@.*/,'') !== element.innerHTML) return;
        }
        console.log('TampMonk/GmailEmails: replacing ' + element.innerHTML + ' with ' + email.value);
        //element.innerHTML = email.value; // cannot use assign to .innerHTML, coz of err: This document requires 'TrustedHTML' assignment.
        element.firstChild.replaceWith(document.createTextNode(email.value))
    }
  });
}

function updateEmails() {
  revealEmails4Class('yP');
  revealEmails4Class('zF');
  //console.log('TampMonk/GmailEmails: updated');
}

var rule2 = true, rule3 = true, rule1_5 = 'root', excl, rule;
if(GM_info.script && GM_info.script.options && GM_info.script.options.override && (excl = GM_info.script.options.override.use_excludes)) {
// Or should we use (GM_info.script.options.comment)? Nah.
    for(var i=0; i<excl.length; i++) {
        rule = excl[i].replace(/=/g, ',').split(',');
        switch(rule[0]) {
            case 'rule2':
                rule2 = (rule[1] !== 'false')
                break;
            case 'rule3':
                rule3 = (rule[1] !== 'false')
                break;
            case 'rule1.5':
                rule1_5 = rule.slice(1)
                break;
        }
    }
    console.log('TampMonk/GmailEmails: rules found: ' + excl + ' (' + excl.length + ') => evaluated as: rule2 = ' +
                rule2 + ', rule3 = ' + rule3 + ', rule1.5 = ' + rule1_5);
}

//window.addEventListener ("hashchange", updateEmails, false);
window.setInterval(updateEmails, 2000);

window.GM_info = GM_info;
console.log('TampMonk/GmailEmails: initiated');
