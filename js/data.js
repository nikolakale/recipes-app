/* ====================================================================
   PODACI O RECEPTIMA
   Svaki recept prati isti oblik kao tvoj .md template. Da dodaš novi
   recept: kopiraj jedan objekat iz niza `recipes`, izmeni polja i
   dodaj mu na kraj niza.
==================================================================== */

const CATEGORIES = ["Doručak", "Užina", "Dezert", "Glavni obrok"];

const recipes = [
  {
    id: "palacinke-banana-jaje-cokolino",
    image: null, // npr. "/img/recepti/palacinke-banana-jaje-cokolino.jpg"
    category: "Doručak",
    title: "Palačinke od banane i jaja sa čoko-kikiriki puterom",
    description: "Palačinke bez brašna, sa dosta proteina - savršene kad želiš nešto slatko što stvarno zasiti kao obrok.",
    servings: "2 porcije",
    ingredientGroups: [{ name: null, items: [
      { name: "Zrele banane", amount: "2 kom" },
      { name: "Velika jaja", amount: "2 kom" },
      { name: "Cimet", amount: "1/2 kašičice" },
      { name: "Puter (za pečenje)", amount: "1 kašičica" },
      { name: "Čoko-kikiriki puter", amount: "2 kašike" },
      { name: "Mleko (da razblažiš puter)", amount: "1 kašika" },
    ]}],
    steps: [
      { title: "Izgnječi banane", text: "Viljuškom u posudi dok ne dobiješ glatku, ali malo grudvastu smesu." },
      { title: "Umutaj jaja", text: "Dodaj jaja i cimet bananama, pa dobro umutaj viljuškom ili žicom dok se sve ne sjedini u tečnu smesu." },
      { title: "Zagrej tiganj", text: "Zagrej puter na srednjoj vatri dok se ne rastopi i prekrije dno.", timer: "~1 min" },
      { title: "Ispeci palačinke", text: "Sipaj po 2-3 kašike smese za svaku palačinku. Peci dok ne počnu da se pojavljuju mehurići i ivice se ne stegnu, pa okreni.", timer: "~1,5 min" },
      { title: "Dopeci drugu stranu", text: "Peci još malo dok ne porumeni. Ove palačinke su nežnije od klasičnih, pa okreći pažljivo.", timer: "~1 min" },
      { title: "Napravi preliv", text: "Blago zagrej čoko-kikiriki puter sa mlekom u mikrotalasnoj ili na šporetu, da dobiješ gušći, ali topiv preliv.", timer: "~15 sek" },
      { title: "Posluži", text: "Slaži palačinke jednu na drugu i prelij čoko-kikiriki smesom. Po želji dodaj parče banane ili šaku oraha za dodatnu sitost." },
    ],
    notes: [
      "Smesa je nežnija od klasičnog testa jer nema brašna - koristi manji tiganj i palačinke manjeg prečnika da lakše okrećeš.",
      "Za više proteina možeš dodati kašiku putera od kikirikija direktno u smesu za testo.",
    ],
    nutrition: {
      hasProtein: false,
      rows: [
        { name: "2 banane", kcal: "210" },
        { name: "2 jaja", kcal: "140" },
        { name: "Cimet", kcal: "—" },
        { name: "Puter za pečenje (1 tsp)", kcal: "35" },
        { name: "Čoko-kikiriki puter (2 tbsp)", kcal: "190" },
        { name: "Mleko (1 tbsp)", kcal: "9" },
      ],
      totals: [
        { name: "Ukupno (2 porcije)", kcal: "580" },
        { name: "Po porciji", kcal: "290", perServing: true },
      ]
    },
    source: null
  },

  {
    id: "chia-puding-voce-bademi",
    image: null, // npr. "/img/recepti/chia-puding-voce-bademi.jpg"
    category: "Doručak",
    title: "Chia puding sa voćem i bademima",
    description: "Lako se priprema uveče, gotovo ujutru. Sit i hranljiv zahvaljujući vlaknima iz chia semenki i proteinima.",
    servings: "2 porcije",
    ingredientGroups: [{ name: null, items: [
      { name: "Chia semenke", amount: "6 kašika" },
      { name: "Mleko (po izboru)", amount: "1,5 šolje" },
      { name: "Med ili javorov sirup", amount: "1 kašika" },
      { name: "Vanila ekstrakt", amount: "1/2 kašičice" },
      { name: "Mešano voće (jagode, borovnice, banana)", amount: "1 šolja" },
      { name: "Badem listići ili seckani bademi", amount: "2 kašike" },
    ]}],
    steps: [
      { title: "Pomešaj smesu", text: "U posudi ili tegli pomešaj chia semenke, mleko, med i vanilu. Dobro promešaj da nema grudvica." },
      { title: "Kratko odstajanje", text: "Ostavi da odstoji 5 minuta, pa ponovo promešaj (chia semenke imaju tendenciju da se slepe na dnu).", timer: "5 min" },
      { title: "Ohladi preko noći", text: "Pokrij i ostavi u frižideru preko noći da chia semenke upiju tečnost i puding zgusne.", timer: "min. 4h" },
      { title: "Proveri teksturu", text: "Izvadi puding iz frižidera. Treba da ima gustu, puding teksturu - ako je previše gust, dodaj malo mleka." },
      { title: "Dodaj voće i badem", text: "Posluži sa mešanim voćem i pospi bademima preko za hrskavost." },
    ],
    notes: [
      "Umesto badema možeš koristiti lešnike, seme bundeve ili suncokreta, ili potpuno izostaviti orašaste plodove i dodati malo više chia semenki (7-8 kašika) za gušću, sitiju teksturu.",
    ],
    nutrition: {
      hasProtein: false,
      rows: [
        { name: "Chia semenke (6 tbsp)", kcal: "290" },
        { name: "Mleko (1,5 cup, punomasno)", kcal: "220" },
        { name: "Med ili javorov sirup (1 tbsp)", kcal: "60" },
        { name: "Vanila ekstrakt", kcal: "—" },
        { name: "Mešano voće (1 cup)", kcal: "60" },
        { name: "Bademi (2 tbsp)", kcal: "110" },
      ],
      totals: [
        { name: "Ukupno (2 porcije)", kcal: "740" },
        { name: "Po porciji", kcal: "370", perServing: true },
      ]
    },
    source: null
  },

  {
    id: "proteinski-brownie-solja",
    image: null, // npr. "/img/recepti/proteinski-brownie-solja.jpg"
    category: "Dezert",
    title: "Proteinski brownie u šolji",
    description: "Topao, čokoladan brownie gotov za 5 minuta u mikrotalasnoj. Banana i jaje daju strukturu i proteine, pa stvarno može da zameni obrok.",
    servings: "1 porcija",
    ingredientGroups: [{ name: null, items: [
      { name: "Zrela banana", amount: "1/2 kom" },
      { name: "Jaje", amount: "1 kom" },
      { name: "Kakao prah", amount: "2 kašike" },
      { name: "Ovseno brašno (ili obično)", amount: "3 kašike" },
      { name: "Med ili javorov sirup", amount: "1 kašika" },
      { name: "Prašak za pecivo", amount: "1/4 kašičice" },
      { name: "Čoko-kikiriki puter (ili obični)", amount: "1 kašika" },
    ]}],
    steps: [
      { title: "Izgnječi bananu", text: "U većoj šolji izgnječi bananu viljuškom dok ne dobiješ glatku smesu." },
      { title: "Dodaj jaje i puter od kikirikija", text: "Dodaj jaje, med i puter od kikirikija banani, pa dobro promućkaj viljuškom." },
      { title: "Dodaj suve sastojke", text: "Umutaj kakao, brašno i prašak za pecivo u smesu dok ne dobiješ glatko testo bez grudvica." },
      { title: "Peci u mikrotalasnoj", text: "Stavi šolju u mikrotalasnu na punoj snazi. Provera na 60 sekundi - ako je još vlažno u sredini, dodaj još 15-20 sekundi.", timer: "~60-80 sek" },
      { title: "Ostavi da se stegne", text: "Ostavi šolju da odstoji pre jela - brownie se dodatno stegne i lakše se jede kada nije vreo.", timer: "1-2 min" },
    ],
    notes: [
      "Koristi veću šolju (najmanje 300 ml) jer smesa naraste u mikrotalasnoj. Ne peci duže od preporučenog vremena - brownie u šolji brzo pređe iz \"vlažnog\" u \"gumeno-suvog\" stanja.",
      "Za dodatne proteine, zameni 1 kašiku brašna sa 1 kašikom čokoladnog whey proteina.",
    ],
    nutrition: {
      hasProtein: false,
      rows: [
        { name: "1/2 banane", kcal: "53" },
        { name: "1 jaje", kcal: "70" },
        { name: "Kakao prah (2 tbsp)", kcal: "25" },
        { name: "Ovseno brašno (3 tbsp)", kcal: "60" },
        { name: "Med (1 tbsp)", kcal: "60" },
        { name: "Prašak za pecivo", kcal: "—" },
        { name: "Čoko-kikiriki puter (1 tbsp)", kcal: "95" },
      ],
      totals: [
        { name: "Ukupno (1 porcija)", kcal: "365", perServing: true },
      ]
    },
    source: null
  },

  {
    id: "no-bake-energy-bites",
    image: null, // npr. "/img/recepti/no-bake-energy-bites.jpg"
    category: "Užina",
    title: "No-Bake kuglice energije (oatmeal, kikiriki puter, čokolada)",
    description: "Kuglice bez pečenja - samo izmešaš, ohladiš i uvaljaš. Odličan grickalica za poneti, pun vlakana i zdravih masti.",
    servings: "~20-24 kuglice",
    ingredientGroups: [{ name: null, items: [
      { name: "Ovsene pahuljice (rolled oats)", amount: "240 ml (1 šolja)" },
      { name: "Mini polu-slatke čoko-mrvice", amount: "120 ml (1/2 šolje)" },
      { name: "Mleveno laneno seme", amount: "120 ml (1/2 šolje)" },
      { name: "Kikiriki puter sa komadićima (crunchy)", amount: "120 ml (1/2 šolje)" },
      { name: "Med", amount: "80 ml (1/3 šolje)" },
      { name: "Ekstrakt vanile", amount: "1 kašičica" },
    ]}],
    steps: [
      { title: "Pomešaj sve sastojke", text: "U većoj posudi sjedini ovsene pahuljice, čoko-mrvice, laneno seme, kikiriki puter, med i vanilu. Mešaj dok se sve dobro ne poveže u lepljivu smesu." },
      { title: "Ohladi smesu", text: "Pokrij posudu i stavi u frižider da se smesa stegne i lakše oblikuje.", timer: "30 min" },
      { title: "Oblikuj kuglice", text: "Kad se ohladi, uzimaj po kašiku smese i rukama uvaljaj u kuglice prečnika oko 2,5 cm." },
      { title: "Čuvaj u frižideru", text: "Poređaj kuglice u posudu sa poklopcem i drži u frižideru (traju do nedelju dana) ili zamrzivaču za duže čuvanje." },
    ],
    notes: [
      "Ako ti smesa deluje previše suva i teško se lepi u kuglice, dodaj još malo meda ili kikiriki putera.",
      "Slobodno variraj - umesto lanenog semena može chia seme, a umesto kikiriki putera bademov puter. Za dodatne proteine može se dodati kašika proteinskog praha.",
    ],
    nutrition: {
      hasProtein: false,
      rows: [
        { name: "Ovsene pahuljice (1 šolja)", kcal: "305" },
        { name: "Čoko-mrvice (1/2 šolje)", kcal: "410" },
        { name: "Mleveno laneno seme (1/2 šolje)", kcal: "300" },
        { name: "Kikiriki puter (1/2 šolje)", kcal: "750" },
        { name: "Med (1/3 šolje)", kcal: "345" },
        { name: "Vanila ekstrakt", kcal: "—" },
      ],
      totals: [
        { name: "Ukupno (~24 kuglice)", kcal: "2110" },
        { name: "Po kuglici", kcal: "88", perServing: true },
      ]
    },
    source: { label: "allrecipes.com", url: "https://www.allrecipes.com/recipe/239969/no-bake-energy-bites/" }
  },

  {
    id: "bananin-kolac-jaja-jogurt-kakao",
    image: null, // npr. "/img/recepti/bananin-kolac-jaja-jogurt-kakao.jpg"
    category: "Dezert",
    title: "Bananin kolač sa jajima, grčkim jogurtom i kakaom",
    description: "Kolač bez brašna - samo izmešaš i ubaciš u rernu. Vlažan, čokoladan i sit zahvaljujući jajima i jogurtu.",
    servings: "8 kriški",
    ingredientGroups: [{ name: null, items: [
      { name: "Zrele banane", amount: "3 kom" },
      { name: "Jaja", amount: "5 kom" },
      { name: "Grčki jogurt, punomasni", amount: "180 g (1 tegla)" },
      { name: "Kakao prah", amount: "4 kašike" },
      { name: "Med", amount: "3 kašike" },
    ]}],
    steps: [
      { title: "Izgnječi banane", text: "U većoj posudi izgnječi banane viljuškom ili mikserom dok ne dobiješ glatku smesu." },
      { title: "Dodaj ostale sastojke", text: "Dodaj jaja, grčki jogurt, kakao i med, pa sve dobro promešaj dok ne dobiješ glatko, ujednačeno testo bez grudvica." },
      { title: "Sipaj u kalup", text: "Prebaci smesu u podmazan kalup (okrugli, prečnika ~20-22 cm, ili pravougaoni slične zapremine)." },
      { title: "Peci", text: "Peci u rerni na 180°C, dok čačkalica ubodena u sredinu ne izađe suva.", timer: "32-35 min" },
      { title: "Ohladi pre sečenja", text: "Ostavi kolač da se prohladi u kalupu pre nego što ga isečeš na kriške - lakše se seče i bolje drži oblik.", timer: "10 min" },
    ],
    notes: [
      "Recept je iz Instagram rila i originalno nema tačne količine za jogurt, kakao i med - navedene količine su procena za skladan odnos slatkoće i teksture.",
      "Ako ti testo deluje pretečno ili presuvo, prilagodi količinu jogurta. Za slađi kolač dodaj još kašiku meda.",
    ],
    nutrition: {
      hasProtein: false,
      rows: [
        { name: "3 banane", kcal: "315" },
        { name: "5 jaja", kcal: "350" },
        { name: "Grčki jogurt (180 g, punomasni)", kcal: "110" },
        { name: "Kakao prah (4 tbsp)", kcal: "50" },
        { name: "Med (3 tbsp)", kcal: "180" },
      ],
      totals: [
        { name: "Ukupno (8 kriški)", kcal: "1005" },
        { name: "Po krišci", kcal: "126", perServing: true },
      ]
    },
    source: { label: "Instagram reel", url: "https://www.instagram.com/reel/DcElyBlor08/" }
  },

  {
    id: "grcki-jogurt-voce-badem-whey",
    image: null, // npr. "/img/recepti/grcki-jogurt-voce-badem-whey.jpg"
    category: "Užina",
    title: "Grčki jogurt sa voćem, medom, bademima i čokoladnim whey proteinom",
    description: "Najbrža opcija od svih - gotovo za 5 minuta. Dosta proteina iz jogurta i whey-a čini ga sitim obrokom koji lako zameni večeru.",
    servings: "1 porcija",
    ingredientGroups: [{ name: null, items: [
      { name: "Grčki tip jogurta, punomasni", amount: "200 g" },
      { name: "Med", amount: "18 g (~2,5 kašičice)" },
      { name: "Mešano voće (jagode, borovnice, breskva)", amount: "63 g" },
      { name: "Badem listići ili seckan badem", amount: "15 g (~1,5 kašika)" },
      { name: "Cimet", amount: "0,5 g (1/4 kašičice)" },
      { name: "Čokoladni whey protein", amount: "20 g (~4 kašičice)" },
    ]}],
    steps: [
      { title: "Sipaj jogurt", text: "Sipaj grčki tip jogurta u posudu ili čašu." },
      { title: "Umešaj whey protein", text: "Dodaj čokoladni whey protein u jogurt i dobro promešaj dok se potpuno ne rastvori. Ako je previše gusto, dodaj malo mleka ili vode." },
      { title: "Dodaj med", text: "Prelij medom preko jogurta (možeš smanjiti količinu jer whey već ima slatkoću)." },
      { title: "Dodaj cimet", text: "Pospi cimetom preko za dodatnu aromu." },
      { title: "Dodaj voće", text: "Dodaj mešano voće preko jogurta." },
      { title: "Dodaj badem i posluži", text: "Pospi bademima preko za hrskavost i posluži odmah." },
    ],
    notes: [
      "Umesto badema možeš koristiti lešnike, pistaće ili seme bundeve/suncokreta.",
      "\"Grčki tip jogurta\" koji se prodaje u Srbiji je sasvim ok zamena za pravi grčki jogurt - bira punomasni za bolju sitost.",
      "Whey protein dodaj postepeno da izbegneš previše gustu smesu koja se teško meša.",
    ],
    nutrition: {
      hasProtein: true,
      rows: [
        { name: "Grčki tip jogurta (200 g)", kcal: "121", protein: "18 g" },
        { name: "Med (18 g)", kcal: "52", protein: "0 g" },
        { name: "Mešano voće (63 g)", kcal: "25", protein: "0,5 g" },
        { name: "Bademi (15 g)", kcal: "86", protein: "3,1 g" },
        { name: "Cimet", kcal: "—", protein: "0 g" },
        { name: "Čokoladni whey protein (~20 g)", kcal: "77", protein: "16 g" },
      ],
      totals: [
        { name: "Ukupno (1 porcija)", kcal: "361", protein: "38 g", perServing: true },
      ]
    },
    source: null
  },

  {
    id: "grcki-jogurt-whey-kikiriki-puter-cokolada-voce",
    image: null, // npr. "/img/recepti/grcki-jogurt-whey-kikiriki-puter-cokolada-voce.jpg"
    category: "Užina",
    title: "Grčki jogurt sa whey proteinom, kikiriki puterom, komadićima čokolade i voćem",
    description: "Brz i sit obrok/užina - kombinacija proteina iz jogurta i whey-a sa hrskavim kikiriki puterom i slatkoćom čokolade i voća.",
    servings: "1 porcija",
    ingredientGroups: [{ name: null, items: [
      { name: "Grčki tip jogurta, punomasni", amount: "200 g" },
      { name: "Čokoladni whey protein", amount: "20 g (~4 kašičice)" },
      { name: "Kikiriki puter sa komadićima (crunchy)", amount: "15 g (1 kašika)" },
      { name: "Komadići crne čokolade", amount: "15 g (1 kašika)" },
      { name: "Mešano voće (po izboru)", amount: "60 g" },
    ]}],
    steps: [
      { title: "Sipaj jogurt", text: "Sipaj grčki tip jogurta u posudu ili činiju." },
      { title: "Umešaj whey protein", text: "Dodaj čokoladni whey protein i dobro promešaj dok se potpuno ne sjedini sa jogurtom. Ako je smesa previše gusta, dodaj kap mleka ili vode." },
      { title: "Dodaj kikiriki puter", text: "Prelij ili umešaj kikiriki puter preko jogurta (može i uvrtati kroz smesu za \"marble\" efekat)." },
      { title: "Dodaj čokoladu i voće", text: "Pospi komadićima crne čokolade i dodaj voće po vrhu." },
      { title: "Posluži odmah", text: "Najbolje je sveže, dok je kikiriki puter i dalje hrskav." },
    ],
    notes: [
      "Količine nisu bile precizno izmerene - procena je po ugledu na sličan recept.",
      "Umesto crne čokolade može mlečna ili čoko-mrvice. Kikiriki puter se može zameniti bademovim.",
      "Za manje kalorija smanji kikiriki puter na 1 kašičicu ili izostavi čokoladu.",
    ],
    nutrition: {
      hasProtein: true,
      rows: [
        { name: "Grčki tip jogurta (200 g)", kcal: "121", protein: "18 g" },
        { name: "Čokoladni whey protein (~20 g)", kcal: "77", protein: "16 g" },
        { name: "Kikiriki puter crunchy (15 g)", kcal: "95", protein: "4 g" },
        { name: "Komadići crne čokolade (15 g)", kcal: "82", protein: "1 g" },
        { name: "Mešano voće (60 g)", kcal: "25", protein: "0,5 g" },
      ],
      totals: [
        { name: "Ukupno (1 porcija)", kcal: "400", protein: "39,5 g", perServing: true },
      ]
    },
    source: null
  },

  {
    id: "bananin-kolac-jaja-jogurt-med-voce",
    image: null, // npr. "/img/recepti/bananin-kolac-jaja-jogurt-med-voce.jpg"
    category: "Dezert",
    title: "Bananin kolač sa jajima, grčkim jogurtom, medom i voćem",
    description: "Kolač bez brašna - samo izmešaš i ubaciš u rernu. Vlažan i sit zahvaljujući jajima i jogurtu, sa svežinom voća umesto kakaa.",
    servings: "8 kriški",
    ingredientGroups: [{ name: null, items: [
      { name: "Zrele banane", amount: "3 kom" },
      { name: "Jaja", amount: "5 kom" },
      { name: "Grčki jogurt, punomasni", amount: "180 g (1 tegla)" },
      { name: "Med", amount: "3 kašike" },
      { name: "Voće (jagode, borovnice ili po izboru), iseckano", amount: "150 g" },
    ]}],
    steps: [
      { title: "Izgnječi banane", text: "U većoj posudi izgnječi banane viljuškom ili mikserom dok ne dobiješ glatku smesu." },
      { title: "Dodaj jaja, jogurt i med", text: "Dodaj jaja, grčki jogurt i med, pa sve dobro promešaj dok ne dobiješ glatko, ujednačeno testo bez grudvica." },
      { title: "Umešaj voće", text: "Umešaj iseckano voće u testo (ili ga rasporedi po vrhu pre pečenja, ako želiš da ostane vidljivo)." },
      { title: "Sipaj u kalup", text: "Prebaci smesu u podmazan kalup (okrugli, prečnika ~20-22 cm, ili pravougaoni slične zapremine)." },
      { title: "Peci", text: "Peci u rerni na 180°C (malo duže nego bez voća, zbog dodatne vlage) - dok čačkalica ubodena u sredinu ne izađe suva.", timer: "35-40 min" },
      { title: "Ohladi pre sečenja", text: "Ostavi kolač da se prohladi u kalupu pre nego što ga isečeš na kriške.", timer: "10 min" },
    ],
    notes: [
      "Ovo je varijanta sa više jaja i meda u odnosu na banane - daje čvršću strukturu i veći sadržaj proteina po krišci, ali malo izraženiji \"jaja\" ukus.",
      "Ako ti testo deluje pretečno ili presuvo, prilagodi količinu jogurta.",
    ],
    nutrition: {
      hasProtein: true,
      rows: [
        { name: "3 banane", kcal: "315", protein: "4 g" },
        { name: "5 jaja", kcal: "350", protein: "30 g" },
        { name: "Grčki jogurt (180 g, punomasni)", kcal: "110", protein: "16 g" },
        { name: "Med (3 tbsp)", kcal: "190", protein: "0 g" },
        { name: "Voće (150 g)", kcal: "60", protein: "1 g" },
      ],
      totals: [
        { name: "Ukupno (8 kriški)", kcal: "1025", protein: "51 g" },
        { name: "Po krišci", kcal: "128", protein: "6,4 g", perServing: true },
      ]
    },
    source: null
  },

  {
    id: "proteinske-palacinke-whey-jaja-jogurt",
    image: null, // npr. "/img/recepti/proteinske-palacinke-whey-jaja-jogurt.jpg"
    category: "Doručak",
    title: "Proteinske palačinke (whey, jaja, jogurt, ovsene pahuljice)",
    description: "Palačinke sa dosta proteina, mekane i pahuljaste - idealne kad želiš klasičan \"palačinka\" osećaj, ali kao pravi obrok.",
    servings: "2 porcije",
    ingredientGroups: [{ name: null, items: [
      { name: "Whey protein", amount: "50 g" },
      { name: "Jaja, srednja", amount: "4 kom" },
      { name: "Grčki tip jogurta", amount: "50 g" },
      { name: "Mlevene ovsene pahuljice", amount: "60 g" },
      { name: "Prašak za pecivo", amount: "1 kesica" },
      { name: "Ulje (za pečenje)", amount: "malo" },
    ]}],
    steps: [
      { title: "Pomešaj suve sastojke", text: "U posudi pomešaj whey protein, mlevene ovsene pahuljice i prašak za pecivo." },
      { title: "Dodaj mokre sastojke", text: "Dodaj jaja i grčki tip jogurta, pa dobro umutaj dok ne dobiješ glatko testo bez grudvica." },
      { title: "Zagrej tiganj", text: "Zagrej malo ulja na srednje niskoj vatri." },
      { title: "Ispeci palačinke", text: "Sipaj po 2-3 kašike testa za svaku, praveći manje palačinke (lakše se okreću). Peci dok se ne pojave mehurići, pa okreni i peci još malo.", timer: "~3-4 min" },
      { title: "Posluži", text: "Po želji sa svežim voćem, medom ili puterom od kikirikija." },
    ],
    notes: [
      "Whey protein u palačinkama može da ih učini malo gumenastim ako se pregore - drži srednje nisku vatru i ne peci predugo.",
      "Recept je namenjen odraslima - ~37g proteina po porciji je previše za decu u jednom obroku.",
    ],
    nutrition: {
      hasProtein: true,
      rows: [
        { name: "Whey protein (50 g)", kcal: "192", protein: "40 g" },
        { name: "Jaja srednja (4 kom)", kcal: "252", protein: "22 g" },
        { name: "Grčki tip jogurta (50 g)", kcal: "30", protein: "4,5 g" },
        { name: "Mlevene ovsene pahuljice (60 g)", kcal: "230", protein: "8 g" },
        { name: "Prašak za pecivo", kcal: "—", protein: "0 g" },
        { name: "Ulje za pečenje (~1 tbsp)", kcal: "120", protein: "0 g" },
      ],
      totals: [
        { name: "Ukupno (2 porcije)", kcal: "824", protein: "74,5 g" },
        { name: "Po porciji", kcal: "412", protein: "37,2 g", perServing: true },
      ]
    },
    source: null
  },

  {
    id: "curetina-cimicuri-batat-senf-salata",
    image: null, // npr. "/img/recepti/curetina-cimicuri-batat-senf-salata.jpg"
    category: "Glavni obrok",
    title: "Marinirana ćuretina sa čimičuri sosom, pečenim batatom i salatom na senf dresingu",
    description: "Meal-prep obrok po ugledu na gotove kutije iz prodavnice - ćuretina marinirana pa propečena, čimičuri sos za svežinu, pečeni batat i hrskava salata sa senf dresingom.",
    servings: "1 porcija",
    ingredientGroups: [
      { name: "Za ćuretinu", items: [
        { name: "Ćureći (ili pileći) file", amount: "220 g" },
        { name: "Maslinovo ulje", amount: "1 kašičica" },
        { name: "Beli luk, iseckan", amount: "1 čen" },
        { name: "Sok od limuna", amount: "1/2 limuna" },
        { name: "So, biber, aleva paprika", amount: "po želji" },
      ]},
      { name: "Za čimičuri sos", items: [
        { name: "Svež peršun, sitno seckan", amount: "15 g" },
        { name: "Maslinovo ulje", amount: "1 kašika" },
        { name: "Crveno vinsko sirće", amount: "1 kašika" },
        { name: "Beli luk, sitno seckan", amount: "1/2 čena" },
        { name: "Origano, čili pahuljice, so", amount: "po želji" },
      ]},
      { name: "Za pečeni batat", items: [
        { name: "Batat, oljušten i iseckan", amount: "150 g" },
        { name: "Maslinovo ulje", amount: "1 kašičica" },
        { name: "So, biber, kim", amount: "po želji" },
      ]},
      { name: "Za salatu", items: [
        { name: "Mladi beli kupus, tanko seckan", amount: "60 g" },
        { name: "Svež peršun ili rukola", amount: "šaka" },
      ]},
      { name: "Za senf dresing", items: [
        { name: "Dijon senf", amount: "1 kašičica" },
        { name: "Maslinovo ulje", amount: "1 kašičica" },
        { name: "Jabukovo sirće ili limunov sok", amount: "1 kašičica" },
        { name: "Med", amount: "1/2 kašičice" },
        { name: "So, biber", amount: "po želji" },
      ]},
    ],
    steps: [
      { title: "Marinirај ćuretinu", text: "Pomešaj ulje, beli luk, limunov sok, so, biber i papriku. Premaži file i ostavi da se marinira bar 20-ak minuta (može i preko noći za jači ukus).", timer: "20+ min" },
      { title: "Zagrej rernu i ispeci batat", text: "Zagrej rernu na 220°C. Kockice batata prebaci na pleh sa peki-papirom, prelij uljem, začini i promešaj. Rasporedi u jednom sloju i peci, okrenuvši na pola vremena.", timer: "25-30 min" },
      { title: "Napravi čimičuri sos", text: "Pomešaj seckani peršun, ulje, sirće, beli luk, so i po želji origano i čili pahuljice. Ostavi sa strane da odstoji." },
      { title: "Ispeci ćuretinu", text: "Zagrej tiganj na srednje jakoj vatri. Peci file sa svake strane dok unutrašnja temperatura ne dostigne 74°C i sokovi ne budu bistri. Skloni sa vatre i ostavi da odstoji pre sečenja.", timer: "4-5 min / strana" },
      { title: "Napravi senf dresing", text: "Umutaj senf, ulje, sirće i med dok se ne sjedini u glatku smesu. Posoli i pobiberi po ukusu." },
      { title: "Sastavi tanjir", text: "Iseckaj ćuretinu i prelij čimičuri sosom. Salatu prelij senf dresingom neposredno pre jela. Posluži zajedno sa pečenim batatom." },
    ],
    notes: [
      "Odličan kandidat za meal-prep – skladišti komponente odvojeno i sastavi neposredno pred jelo. Dresing i čimičuri drži odvojeno do trenutka jela.",
      "Ćuretina se, kao u originalu, može jesti na sobnoj temperaturi – nije neophodno podgrevati.",
      "Za manje kalorija, smanji ulje u marinadi i batatu na pola kašičice, ili izostavi ulje u dresingu.",
      "Umesto ćuretine može i pileći file – priprema je ista.",
    ],
    nutrition: {
      hasProtein: true,
      rows: [
        { name: "Ćureći file (220 g, sirov)", kcal: "230", protein: "53 g" },
        { name: "Maslinovo ulje (marinada)", kcal: "40", protein: "0 g" },
        { name: "Peršun za čimičuri", kcal: "6", protein: "0,5 g" },
        { name: "Maslinovo ulje (čimičuri)", kcal: "119", protein: "0 g" },
        { name: "Batat (150 g, sirov)", kcal: "130", protein: "2 g" },
        { name: "Maslinovo ulje (batat)", kcal: "40", protein: "0 g" },
        { name: "Kupus/salata", kcal: "15", protein: "1 g" },
        { name: "Senf dresing (ulje, med, senf)", kcal: "55", protein: "0 g" },
      ],
      totals: [
        { name: "Ukupno (1 porcija)", kcal: "635", protein: "56,5 g", perServing: true },
      ]
    },
    source: null
  },

  {
    id: "cottage-sir-whey-kikiriki-puter",
    image: null, // npr. "/img/recepti/cottage-sir-whey-kikiriki-puter.jpg"
    category: "Užina",
    title: "Cottage sir sa whey proteinom i kikiriki puterom",
    description: "Brza, jednostavna verzija - samo tri sastojka. Sit obrok/užina sa dosta proteina.",
    servings: "1 porcija",
    ingredientGroups: [{ name: null, items: [
      { name: "Sir tipa cottage", amount: "180 g" },
      { name: "Čokoladni whey protein", amount: "20 g (~4 kašičice)" },
      { name: "Kikiriki puter sa komadićima (crunchy)", amount: "15 g (1 kašika)" },
    ]}],
    steps: [
      { title: "Sipaj sir", text: "Sipaj sir u posudu ili činiju." },
      { title: "Umešaj whey protein", text: "Dodaj čokoladni whey protein i dobro promešaj dok se potpuno ne sjedini. Ako je smesa previše gusta, dodaj kap mleka ili vode." },
      { title: "Dodaj kikiriki puter", text: "Prelij ili umešaj kikiriki puter preko smese." },
      { title: "Posluži odmah", text: "Najbolje je sveže." },
    ],
    notes: [
      "Po želji možeš dodati komadiće crne čokolade i/ili mešano voće za slađu, punjeniju verziju.",
      "Ako je sir previše grudvast, kratko ga izblenderaj za glatkiju teksturu.",
    ],
    nutrition: {
      hasProtein: true,
      rows: [
        { name: "Sir tipa cottage (180 g)", kcal: "214", protein: "21,5 g" },
        { name: "Čokoladni whey protein (~20 g)", kcal: "77", protein: "16 g" },
        { name: "Kikiriki puter crunchy (15 g)", kcal: "95", protein: "4 g" },
      ],
      totals: [
        { name: "Ukupno (1 porcija)", kcal: "386", protein: "41,5 g", perServing: true },
      ]
    },
    source: null
  },

  {
    id: "grcki-jogurt-whey-cokolada-maline-plazma",
    image: null, // npr. "/img/recepti/grcki-jogurt-whey-cokolada-maline-plazma.jpg"
    category: "Užina",
    title: "Grčki jogurt sa whey proteinom, malinama i Plazmom",
    description: "Kiselkaste maline, čokoladni whey i mrvice Plazme koje malo omekšaju u jogurtu kao neka vrsta „cheesecake“ teksture.",
    servings: "1 porcija",
    ingredientGroups: [{ name: null, items: [
      { name: "Grčki tip jogurta, punomasni", amount: "200 g" },
      { name: "Čokoladni whey protein", amount: "20 g (~4 kašičice)" },
      { name: "Smrznute maline, izmrvljene", amount: "80 g" },
      { name: "Keks Plazma, izmrvljen", amount: "2 kom (~18 g)" },
    ]}],
    steps: [
      { title: "Sipaj jogurt", text: "Sipaj grčki tip jogurta u posudu ili činiju." },
      { title: "Umešaj whey protein", text: "Dodaj čokoladni whey protein i dobro promešaj dok se potpuno ne sjedini sa jogurtom. Ako je smesa previše gusta, dodaj kap mleka ili vode." },
      { title: "Izmrvi maline", text: "Smrznute maline izgnječi viljuškom ili rukama na krupnije komade — ne moraju potpuno da se odmrznu." },
      { title: "Dodaj maline", text: "Umešaj ili prelij izmrvljene maline preko jogurta." },
      { title: "Izmrvi Plazmu", text: "Rukama izlomi keks Plazmu na krupnije mrvice." },
      { title: "Pospi Plazmom i posluži", text: "Pospi mrvice Plazme preko i odmah posluži, dok su još hrskave." },
    ],
    notes: [
      "Smrznute maline puštaju malo soka kad se odmrznu — ako previše razvodne jogurt, kratko ih ocedi pre dodavanja.",
      "Plazma vremenom omekša u jogurtu (kao kod tiramisua) — za hrskaviji zalogaj dodaj je poslednju i jedi odmah.",
    ],
    nutrition: {
      hasProtein: true,
      rows: [
        { name: "Grčki tip jogurt (200 g)", kcal: "121", protein: "18 g" },
        { name: "Čokoladni whey protein (20 g)", kcal: "77", protein: "16 g" },
        { name: "Smrznute maline (80 g)", kcal: "42", protein: "1 g" },
        { name: "Plazma keks (18 g)", kcal: "82", protein: "1,6 g" },
      ],
      totals: [
        { name: "Ukupno (1 porcija)", kcal: "322", protein: "36,6 g", perServing: true },
      ]
    },
    source: null
  },
];
