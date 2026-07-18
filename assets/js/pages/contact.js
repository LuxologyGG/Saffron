/* =============================================================
   Saffron & Rice, Contact page module (contact.js)
   Loads LAST, after data.js and app.js. Owns only the note form:
   validation (aria-invalid + role=alert nodes) and the honest
   no-backend submit path. Hero parallax, reveals, floats, and the
   map draw-on are all handled by app.js hooks in the markup.

   SUBMIT PATH (skill 05 A6, adapted honestly): there is no backend
   and, as of the 2026-07 research pass (research/business/facts.md),
   no VERIFIED public inbox for the business, so no address may be
   invented. The mailto: machinery below is fully wired and turns on
   the moment window.SITE.company.email is set in data.js; until
   then a valid submit gets an honest phone-first success panel plus
   a copy-your-note helper, and never claims anything was sent.
   Functional, non-motion code: runs under reduced motion too.
   House rules: no em dashes anywhere; relative URLs only.
   ============================================================= */
(function () {
  "use strict";

  var SITE = window.SITE || {};
  var company = SITE.company || {};
  var phone = company.phone || "(310) 504-0310";
  var phoneHref = company.phoneHref || "tel:+13105040310";
  /* Set company.email in data.js (verified inbox only) to activate mailto. */
  var inbox = typeof company.email === "string" ? company.email : "";

  var form = document.querySelector("[data-contact]");
  if (!form) return;
  var okPanel = form.querySelector(".form__ok");
  var fields = Array.prototype.slice.call(form.querySelectorAll("[required]"));

  function isValid(field) {
    var v = field.value.trim();
    if (!v) return false;
    if (field.name === "name") return v.length >= 2;
    if (field.name === "phone") return v.replace(/\D/g, "").length >= 7;
    return true;
  }

  function setState(field, bad) {
    field.setAttribute("aria-invalid", String(bad));
    var msg = document.getElementById(field.getAttribute("aria-describedby"));
    if (msg) msg.textContent = bad ? (field.getAttribute("data-err") || "Please fill this in") : "";
  }

  /* clear an error live once the field becomes valid again */
  fields.forEach(function (f) {
    f.addEventListener("input", function () {
      if (f.getAttribute("aria-invalid") === "true" && isValid(f)) setState(f, false);
    });
  });

  function telLink() {
    var a = document.createElement("a");
    a.href = phoneHref;
    a.setAttribute("data-no-transition", "");
    a.textContent = phone;
    return a;
  }

  function showOk(build) {
    okPanel.textContent = "";
    build(okPanel);
    okPanel.hidden = false;
    okPanel.focus();
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var firstBad = null;
    fields.forEach(function (f) {
      var bad = !isValid(f);
      setState(f, bad);
      if (bad && !firstBad) firstBad = f;
    });
    if (firstBad) {
      okPanel.hidden = true;
      firstBad.focus();
      return;
    }

    var data = {};
    fields.forEach(function (f) { data[f.name] = f.value.trim(); });
    var note = "Name: " + data.name + "\nPhone: " + data.phone + "\n\n" + data.message;

    if (inbox) {
      window.location.href = "mailto:" + inbox +
        "?subject=" + encodeURIComponent("Website note, Saffron & Rice") +
        "&body=" + encodeURIComponent(note);
      showOk(function (panel) {
        var p = document.createElement("p");
        p.append("Your email app should have opened with the note prefilled. If nothing opened, call us at ");
        p.appendChild(telLink());
        p.append(".");
        panel.appendChild(p);
      });
      return;
    }

    /* No verified inbox yet: be honest, keep the lead, point at the phone. */
    showOk(function (panel) {
      var p1 = document.createElement("p");
      p1.append("Thanks, " + data.name + ". This page does not send email yet, so your note stayed right here on your device.");
      panel.appendChild(p1);
      var p2 = document.createElement("p");
      p2.append("The fastest way to reach us is a call: ");
      p2.appendChild(telLink());
      p2.append(".");
      panel.appendChild(p2);
      if (navigator.clipboard && navigator.clipboard.writeText) {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "btn btn--ghost tap-44";
        btn.textContent = "Copy your note";
        btn.addEventListener("click", function () {
          navigator.clipboard.writeText(note).then(function () {
            btn.textContent = "Copied, paste it into a text or email";
          }, function () {
            btn.textContent = "Copy failed, select it from the form above";
          });
        });
        panel.appendChild(btn);
      }
    });
  });
})();
