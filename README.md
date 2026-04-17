# 📚 Šolska knjižnica in izposoja tehnične opreme

Spletna aplikacija za digitalno upravljanje šolske knjižnice in izposojo tehnične opreme (prenosniki, projektorji, tablice). Razvito kot zaključni projekt (matura).

## 🚀 Tehnologije
- **Frontend:** React 19, TypeScript, Tailwind CSS, Vite
- **Backend:** .NET 9 Web API
- **Podatkovna baza:** PostgreSQL (gostovano na Supabase)
- **Gostovanje:** Render
- **Dokumentacija:** Swagger/OpenAPI (Scalar)

---

## 🛠️ Lokalna namestitev in zagon

### 1. Sistemske zahteve
- .NET 9 SDK
- Node.js (priporočena verzija 20+)
- Git

### 2. Namestitev
```powershell
# Kloniranje projekta
git clone https://github.com/TejVerbicSCV/solska-knji-nica-in-izposoja-tehnicne-opreme.git
cd solska-knji-nica-in-izposoja-tehnicne-opreme
```

### 3. Zagon Backenda
```powershell
cd src/Backend/API
dotnet restore
dotnet run
```
Backend bo tekel na `http://localhost:5123`. Interaktivna dokumentacija je na voljo na `/swagger`.

### 4. Zagon Frontenda
```powershell
cd src/Frontend
npm install
npm run dev
```
Frontend bo tekel na `http://localhost:5173`.

---

## 📖 Navodila za uporabo

### 👨‍🏫 Za knjižničarje (Administratorje)
Knjižničar ima dostop do celotnega upravljanja knjižnice preko svoje nadzorne plošče:
- **Upravljanje inventarja:** Dodajanje novih knjig in opreme preko gumba "Dodaj predmet". Vsakemu predmetu lahko določite naslov, opis, količino in naložite sliko.
- **Izposoje:** Pregled vseh aktivnih izposoj. Ko dijak vrne predmet, knjižničar klikne gumb "Vrni" in vpiše morebitne poškodbe.
- **Rezervacije:** Upravljanje s prihajajočimi rezervacijami. Knjižničar lahko rezervacijo potrdi (ko pripravi predmet) ali zavrne.
- **Urejanje:** Možnost posodabljanja podatkov ali brisanja neustreznih predmetov.

### 👨‍🎓 Za dijake
Dijaki lahko po prijavi:
- Pregledujejo celoten katalog razpoložljivih knjig in tehnične opreme.
- Oddajo zahtevek za rezervacijo želenega predmeta.
- Pregledujejo status svojih izposoj in datum potrebe po vračilu.

---

## 🌐 Gostovanje (Produkcija)
Aplikacija je nastavljena za avtomatsko objavo preko Render Blueprinta (`render.yaml`).

- **Frontend:** [https://knjiznica-frontend.onrender.com](https://knjiznica-frontend.onrender.com)
- **Backend:** [https://knjiznica-backend.onrender.com](https://knjiznica-backend.onrender.com)
- **API Dokumentacija:** [https://knjiznica-backend.onrender.com/swagger](https://knjiznica-backend.onrender.com/swagger)

---

## 📂 Struktura projekta
```text
├── src/
│   ├── Backend/      # .NET 9 API, Core in Infrastructure
│   └── Frontend/     # React aplikacija s TypeScriptom
├── render.yaml       # Konfiguracija za Render
├── Dockerfile        # Pakiranje backenda za produkcijo
└── README.md         # Ta datoteka
```
