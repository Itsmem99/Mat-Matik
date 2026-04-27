let allIng = [];
let selectedItems = [];

// 1. Ladda listan vid start
fetch("https://dataportal.livsmedelsverket.se/livsmedel/api/v1/livsmedel?offset=0&limit=2500&sprak=1")
    .then(r => r.json())
    .then(data => {
        allIng = data.livsmedel;
        allIng.forEach(i => {
            const opt = document.createElement("option");
            opt.value = i.namn;
            document.getElementById("ingredientOptions").appendChild(opt);
        });
    });

//2.Hitta knappen+Hämta ingrediensnamnet ska sparas i name
document.getElementById("addButton").addEventListener("click", () => {
    const name = document.getElementById("search-text").value;
    const gram = parseFloat(document.getElementById("amount-gram").value);
    const match = allIng.find(i => i.namn === name);

    if (!match || !gram) return alert("Välj ingrediens och antal gram!");

    fetch(`https://dataportal.livsmedelsverket.se/livsmedel/api/v1/livsmedel/${match.nummer}/naringsvarden?sprak=1`)
        .then(r => r.json())
        //nutrients är datan man har tillbaka från API:et
        .then(nutrients => {
            const factor = gram / 100;
//hur stor del av 100 gram jag använder ur arrayen.
            
            const kcalRaw = nutrients.find(n => n.namn.includes("Energi (kcal)"))?.varde || 0;
            const protRaw = nutrients.find(n => n.namn.includes("Protein"))?.varde || 0;

//svenska API:er använder ofta komma istället för punkt för decimale int javascript
            const kcal = (parseFloat(kcalRaw.toString().replace(',', '.')) * factor);
            const prot = (parseFloat(protRaw.toString().replace(',', '.')) * factor);

            // Spara och rendera
            selectedItems.push({ name, kcal, prot });
            updateUI();
            
            // Nollställ input
            document.getElementById("search-text").value = "";
            document.getElementById("amount-gram").value = "";
        });
});

// 3. Uppdatera listan och totalen
function updateUI() {
    const container = document.getElementById("ingredientsContainer");
    container.innerHTML = "";
    let tKcal = 0, tProt = 0;

    selectedItems.forEach(i => {
//berräkning av totalat kalorier och protin
        tKcal += i.kcal; tProt += i.prot;
        const d = document.createElement("div");
        d.className = "ing-item";
        d.innerHTML = `${i.name}: ${i.kcal.toFixed(0)} kcal`;
        container.appendChild(d);
    });

    document.getElementById("summary").style.display = "block";
    document.getElementById("total-kcal").innerText = tKcal.toFixed(0);
    document.getElementById("total-protein").innerText = tProt.toFixed(1);
}