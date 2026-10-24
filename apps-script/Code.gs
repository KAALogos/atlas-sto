/**
 * Atlas współpracy STO: odbiornik zgłoszeń.
 * Przyjmuje tekst zgłoszenia z formularza (POST) i wysyła go e-mailem na adres właściciela skryptu.
 * Niczego nie zapisuje (ani w arkuszu, ani w pliku). Nie zbiera danych osobowych: odrzuca tekst z telefonem, e-mailem lub PESEL.
 *
 * Wdrożenie: patrz README.md (Rozszerzenia > Apps Script > Wdróż > Nowe wdrożenie > Aplikacja internetowa;
 * Wykonuj jako: Ja; Kto ma dostęp: Wszyscy).
 */
const MAX_RAW = 12000;
const MAX_BODY = 6000;
const MIN_FILL_MS = 4000;   // wypełnienie szybsze niż 4 s to prawdopodobnie bot
const MAX_PER_HOUR = 30;    // ochrona skrzynki przed zalewem

function doPost(e) {
  try {
    const raw = (e && e.postData && e.postData.contents) || '';
    if (!raw || raw.length > MAX_RAW) return out_('odrzucono');
    const d = JSON.parse(raw);
    const subject = String(d.subject || '').replace(/[\r\n]+/g, ' ').slice(0, 200);
    const body = String(d.body || '').slice(0, MAX_BODY);
    if (subject.indexOf('[Atlas STO]') !== 0) return out_('odrzucono');
    if (body.indexOf('ATLAS STO: ZGŁOSZENIE WSPÓŁPRACY') !== 0) return out_('odrzucono');
    if ((Number(d.t) || 0) < MIN_FILL_MS) return out_('odrzucono');
    if (hasPersonalData_(body)) return out_('odrzucono');

    const cache = CacheService.getScriptCache();
    const n = Number(cache.get('licznik') || 0);
    if (n >= MAX_PER_HOUR) return out_('limit');
    cache.put('licznik', String(n + 1), 3600);

    MailApp.sendEmail({
      to: Session.getEffectiveUser().getEmail(),
      subject: subject,
      body: body + '\n\n--\nWysłano automatycznie przez formularz Atlasu współpracy STO.'
    });
    return out_('ok');
  } catch (err) {
    return out_('błąd');
  }
}

function doGet() {
  return out_('Odbiornik zgłoszeń Atlasu STO działa. Zgłoszenia wysyła formularz (POST).');
}

function out_(text) {
  return ContentService.createTextOutput(text);
}

function hasPersonalData_(t) {
  const email = /[\w.+-]+@[\w-]+\.[\w.-]+/;
  const phone = /(?:\+48[\s-]?)?(?:\d{3}[\s-]\d{3}[\s-]\d{3}|\b\d{9}\b)/;
  const pesel = /\b\d{11}\b/;
  // adresy URL źródeł mogą zawierać @ lub cyfry, więc sprawdzamy tekst bez adresów internetowych
  const noUrls = t.replace(/https?:\/\/\S+/g, ' ');
  return email.test(noUrls) || phone.test(noUrls) || pesel.test(noUrls);
}
