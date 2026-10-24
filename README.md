# Atlas współpracy kół i szkół STO

Interaktywny atlas: które koła i szkoły STO współpracowały od września 2021 (graf, mapa, tabela „kto z kim”, wydarzenia), z wbudowanym formularzem zgłaszania brakującej współpracy. Dane pochodzą z publicznych źródeł; atlas nie zawiera danych osobowych.

**Strona (GitHub Pages):** https://kaalogos.github.io/atlas-sto/

## Co jest w repozytorium
| Plik | Opis |
|---|---|
| `index.html` | Atlas z formularzem zgłoszeń (jeden plik, działa bez internetu i bez serwera) |
| `apps-script/Code.gs` | Odbiornik zgłoszeń (Google Apps Script): wysyła zgłoszenie e-mailem właścicielowi skryptu, niczego nie zapisuje |
| `.nojekyll` | Wyłącza przetwarzanie przez Jekyll |

## Formularz: jak działa
- Zgłoszenie zawiera tylko identyfikację koła lub szkoły (z listy 67 kół z numerem SKT), opis współpracy, termin i adresy publicznych relacji. Formularz nie pyta o dane osobowe i ostrzega, gdy w tekście są imiona, nazwiska, telefony, e-maile lub PESEL.
- Dopóki w `index.html` stała `ENDPOINT` jest pusta, formularz przygotowuje gotową wiadomość e-mail (przyciski „Otwórz w Gmailu” i „Otwórz w programie pocztowym”) na adres koordynatora.
- Po wdrożeniu odbiornika (poniżej) pojawia się przycisk **„Wyślij zgłoszenie”**, który wysyła zgłoszenie od razu, bez programu pocztowego. Zgłoszenie trafia na skrzynkę właściciela skryptu.

## Jak uruchomić wysyłkę (jednorazowo, ok. 5 minut)
1. Zaloguj się na konto Google, na którego skrzynkę mają przychodzić zgłoszenia, i wejdź na https://script.google.com → **Nowy projekt**.
2. Wklej zawartość `apps-script/Code.gs` (zastąp domyślny kod) i zapisz.
3. **Wdróż → Nowe wdrożenie → Aplikacja internetowa**. Ustaw: *Wykonuj jako*: **Ja**; *Kto ma dostęp*: **Wszyscy**. Zatwierdź uprawnienia (wysyłanie e-maili). Skopiuj **adres aplikacji internetowej** (kończy się na `/exec`).
4. W `index.html` znajdź linię `const ENDPOINT="";` i wpisz w cudzysłów skopiowany adres. Zapisz (commit) zmianę. Po minucie strona na GitHub Pages pokazuje przycisk „Wyślij zgłoszenie”.
5. Test: wypełnij formularz na stronie i wyślij. W skrzynce pojawi się wiadomość z tematem „[Atlas STO] Zgłoszenie współpracy: …”.

Zabezpieczenia odbiornika: odrzuca wiadomości zawierające telefon, e-mail lub PESEL, wypełnione szybciej niż w 4 sekundy, dłuższe niż 6000 znaków oraz powyżej 30 zgłoszeń na godzinę. Nie zapisuje niczego poza chwilowym licznikiem w pamięci podręcznej skryptu.

## Prywatność
- Strona nie ustawia ciasteczek, nie używa zewnętrznych czcionek ani skryptów, nie zapisuje niczego w przeglądarce.
- Bez `ENDPOINT` strona w ogóle nie łączy się z żadnym serwerem. Z `ENDPOINT` łączy się wyłącznie z Google Apps Script w chwili kliknięcia „Wyślij zgłoszenie”.
- Zgłoszenia przetwarza koordynator Atlasu; adres nadawcy poczty (jeśli zgłoszenie wysłano pocztą) usuwa po zakończeniu sprawy.

## Aktualizacja danych
Atlas jest generowany z bazy projektów i źródeł. Nowa wersja to nowy `index.html`; zachowaj w nim swoją wartość `ENDPOINT`.
