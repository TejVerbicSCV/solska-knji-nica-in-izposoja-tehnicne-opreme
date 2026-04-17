# Solška knjižnica in izposoja tehnične opreme

Spletna aplikacija za digitalizacijo in avtomatizacijo procesov v šolski knjižnici. Omogoča enostaven pregled inventarja, upravljanje z izposojami ter rezervacijo knjig in tehnične opreme (prenosniki, projektorji) za dijake in učitelje.

---

## 🛠️ Tehnološki sklad

### Frontend
- **React 19 & Vite:** Sodobno in hitro uporabniško okolje.
- **TypeScript:** Tipiziran JavaScript za varnejšo kodo.
- **Tailwind CSS:** Prilagodljiva oblika in moderna estetika.
- **Lucide React:** Knjižnica ikon za boljšo UX izkušnjo.
- **Axios:** Za komunikacijo z zalednim sistemom.

### Backend
- **ASP.NET Core 9.0 (C#):** Zmogljivo in varno zaledje.
- **Entity Framework Core:** Upravljanje s podatkovno bazo preko ORM.
- **PostgreSQL:** Relacijska baza podatkov (gostovana na Supabase).
- **Swashbuckle/Scalar:** Avtomatsko generiranje dokumentacije OpenAPI.
- **BCrypt.Net:** Varno šifriranje gesel.

---

## 🚀 Navodila za zagon

### 1. Zagon zaledja (Backend)
Potrebujete nameščen .NET 9 SDK.
```powershell
cd src/Backend/API
dotnet restore
dotnet run
```
Zaledje bo na voljo na: `http://localhost:5123`

### 2. Zagon čelnega dela (Frontend)
Potrebujete nameščen Node.js.
```powershell
cd src/Frontend
npm install
npm run dev
```
Čelni del bo na voljo na: `http://localhost:5173`

---

## 📸 Zaslonske slike ključnih delov
Spodaj so vizualni prikazi delujoče aplikacije:

### Nadzorna plošča knjižničarja
![Nadzorna plošča knjižničarja](/C:/Users/TejWork/.gemini/antigravity/brain/d8135d1a-f5b0-461f-b9a7-9dae72d7d8de/librarian_dashboard_exact_1776447052825.png)

### Prijava v sistem
![Prijava](/C:/Users/TejWork/.gemini/antigravity/brain/d8135d1a-f5b0-461f-b9a7-9dae72d7d8de/login_page_exact_1776447080825.png)

---

## 📄 Dokumentacija projekta
Celotna tehnična dokumentacija v formatu PDF je na voljo na spodnji povezavi:
- [Povezava do PDF dokumentacije](./Dokumentacija_Projekta.pdf) *(Opomba: Predloži PDF v koren repozitorija)*

---

## 📋 Projektno vodenje
Za načrtovanje in spremljanje razvoja sva uporabila orodje Trello.
- **Trello tabla:** [Tukaj vstavi povezavo do tvoje Trello table]
