// 1. Databas
const foodDB = {
    // PROTEIN (Kött & Fisk)
    "lax": { kcal: 200, p: 20, c: 0, f: 13 },
    "kyckling": { kcal: 165, p: 31, c: 0, f: 3.6 },
    "nötfärs": { kcal: 250, p: 26, c: 0, f: 15 },
    "torsk": { kcal: 82, p: 18, c: 0, f: 0.7 },
    "räkor": { kcal: 99, p: 24, c: 0, f: 0.3 },
    "tonfisk": { kcal: 116, p: 26, c: 0, f: 1 },

    // KOLHYDRATER
    "ris": { kcal: 130, p: 2.7, c: 28, f: 0.3 },
    "pasta": { kcal: 131, p: 5, c: 25, f: 1.1 },
    "potatis": { kcal: 77, p: 2, c: 17, f: 0.1 },
    "havregryn": { kcal: 389, p: 17, c: 66, f: 7 },
    "quinoa": { kcal: 120, p: 4.4, c: 21, f: 1.9 },
    "bröd": { kcal: 265, p: 9, c: 49, f: 3.2 },
    "sötpotatis": { kcal: 86, p: 1.6, c: 20, f: 0.1 },

    // FETT & NÖTTER
    "avokado": { kcal: 160, p: 2, c: 9, f: 15 },
    "olivolja": { kcal: 884, p: 0, c: 0, f: 100 },
    "smör": { kcal: 717, p: 0.9, c: 0.1, f: 81 },
    "jordnötssmör": { kcal: 588, p: 25, c: 20, f: 50 },
    "valnötter": { kcal: 654, p: 15, c: 14, f: 65 },
    "mandlar": { kcal: 579, p: 21, c: 22, f: 50 },

    // MEJERI & ÄGG
    "ägg": { kcal: 155, p: 13, c: 1.1, f: 11 },
    "mjölk": { kcal: 42, p: 3.4, c: 5, f: 1.5 },
    "kvarg": { kcal: 60, p: 11, c: 3, f: 0.2 },
    "grekisk yoghurt": { kcal: 115, p: 10, c: 3, f: 7 },
    "ost": { kcal: 402, p: 25, c: 1.3, f: 33 },
    "keso": { kcal: 98, p: 11, c: 3.4, f: 4.3 },

    // VEGETARISKT/VEGANSKT
    "tofu": { kcal: 76, p: 8, c: 1.9, f: 4.8 },
    "linser": { kcal: 116, p: 9, c: 20, f: 0.4 },
    "bönor": { kcal: 130, p: 9, c: 23, f: 0.5 },
    "hummus": { kcal: 166, p: 8, c: 14, f: 10 },

    // GRÖNSAKER & FRUKT
    "broccoli": { kcal: 34, p: 2.8, c: 7, f: 0.4 },
    "spenat": { kcal: 23, p: 2.9, c: 3.6, f: 0.4 },
    "banan": { kcal: 89, p: 1.1, c: 23, f: 0.3 },
    "äpple": { kcal: 52, p: 0.3, c: 14, f: 0.2 },
    "blåbär": { kcal: 57, p: 0.7, c: 14, f: 0.3 }
};

const receptLista = [
    { namn: "Lax & Ris Deluxe", tid: "20 min", pers: "2", img: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=500", ing: "lax\nris" },
    { namn: "Avokado Breakfast", tid: "10 min", pers: "1", img: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=500", ing: "avokado\nägg" },
    { namn: "Fitness Chicken", tid: "25 min", pers: "1", img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500", ing: "kyckling\nris" }
];

// 2. Visa sektioner 
function showSection(sectionId) {
    const analys = document.getElementById('analys-section');
    const recept = document.getElementById('recept-section');
    
    if (sectionId === 'recept') {
        analys.style.display = 'none';
        recept.style.display = 'block';
        renderRecipes(); // Skapa korten när vi byter vy
    } else {
        analys.style.display = 'block';
        recept.style.display = 'none';
    }
    
    // Uppdatera knapp-färg
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`nav-${sectionId}`).classList.add('active');
}

// 3. Rendera recept
function renderRecipes() {
    const grid = document.getElementById('recipeGrid');
    grid.innerHTML = ""; 
    
    receptLista.forEach(r => {
        const card = document.createElement('div');
        card.className = 'recipe-card';
        card.innerHTML = `
            <img src="${r.img}" class="recipe-img">
            <div class="recipe-info">
                <h3>${r.namn}</h3>
                <p>🕒 ${r.tid} | 👥 ${r.pers} pers</p>
                <button class="analyze-btn" style="padding: 10px;">Välj Recept</button>
            </div>
        `;
        card.onclick = () => {
            document.getElementById('recipeInput').value = r.ing;
            showSection('analys');
            analyzeRecipe();
        };
        grid.appendChild(card);
    });
}

// 4. Analysera
function analyzeRecipe() {
    const input = document.getElementById('recipeInput').value.toLowerCase();
    const loader = document.getElementById('loading');
    const res = document.getElementById('nutritionResult');

    loader.style.display = 'block';
    res.style.display = 'none';

    setTimeout(() => {
        let totals = { kcal: 0, p: 0, c: 0, f: 0 };
        input.split('\n').forEach(line => {
            for (let food in foodDB) {
                if (line.includes(food)) {
                    totals.kcal += foodDB[food].kcal;
                    totals.p += foodDB[food].p;
                    totals.c += foodDB[food].c;
                    totals.f += foodDB[food].f;
                }
            }
        });

        document.getElementById('res-kcal').innerText = totals.kcal;
        document.getElementById('res-protein').innerText = totals.p;
        document.getElementById('res-carbs').innerText = totals.c;
        document.getElementById('res-fats').innerText = totals.f;

        loader.style.display = 'none';
        res.style.display = 'block';
    }, 800);
}
function analyzeRecipe() {
    const input = document.getElementById('recipeInput').value.toLowerCase();
    const loader = document.getElementById('loading');
    const resultDiv = document.getElementById('nutritionResult');

    loader.style.display = 'block';
    resultDiv.style.display = 'none';

    setTimeout(() => {
        let totals = { kcal: 0, p: 0, c: 0, f: 0 };
        const lines = input.split('\n');

        lines.forEach(line => {
            // MATTE-LOGIK: Hitta siffror (mängd) i raden
            const amountMatch = line.match(/\d+/); 
            const amount = amountMatch ? parseInt(amountMatch[0]) : 100; // Standard till 100g om ingen siffra finns

            for (let food in foodDB) {
                if (line.includes(food)) {
                    // Vi räknar (mängd / 100) * näringsvärdet
                    // Eftersom foodDB är baserad på 100g
                    const factor = amount / 100;
                    
                    totals.kcal += foodDB[food].kcal * factor;
                    totals.p += foodDB[food].p * factor;
                    totals.c += foodDB[food].c * factor;
                    totals.f += foodDB[food].f * factor;
                }
            }
        });

        // Uppdatera UI med avrundade värden
        document.getElementById('res-kcal').innerText = Math.round(totals.kcal);
        document.getElementById('res-protein').innerText = totals.p.toFixed(1);
        document.getElementById('res-carbs').innerText = totals.c.toFixed(1);
        document.getElementById('res-fats').innerText = totals.f.toFixed(1);

        loader.style.display = 'none';
        resultDiv.style.display = 'block';
    }, 600);
}
// 5. Klocka
setInterval(() => {
    document.getElementById('current-time').innerText = `🕒 ${new Date().toLocaleTimeString('sv-SE')}`;
}, 1000);

// API
function getDailyAdvice() {
    const adviceEl = document.getElementById('daily-advice');
    adviceEl.style.opacity = "0.5";

    // Fetch startar anropet
    fetch('https://api.adviceslip.com/advice')
        .then(response => {
            // Kontrollera om svaret är ok, omvandla sen till JSON
            return response.json();
        })
        .then(data => {
            // Här har vi datan klar
            adviceEl.innerText = data.slip.advice;
            adviceEl.style.opacity = "1";
        })
        .catch(error => {
            // Om något går fel (t.ex. inget internet)
            console.error("Fel vid hämtning:", error);
            adviceEl.innerText = "Ät gott, må gott!";
            adviceEl.style.opacity = "1";
        });
}

// Kör direkt vid start
getDailyAdvice();

