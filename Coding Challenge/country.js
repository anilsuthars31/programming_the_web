

const countrycard = document.getElementById("country-card");
const countryname = document.getElementById("country-name");
const caps = document.getElementById("capital");
const searchInput = document.getElementById("searchInput");
const regionFilter = document.getElementById("regionFilter");
const DarkMode = document.getElementById("Dark-mode");
const body = document.body;

async function page() {

    const countryflagurl = await fetch(`https://countriesnow.space/api/v0.1/countries/flag/images`);
    const dhwaja = await countryflagurl.json();

    const countrynameurl = await fetch(`https://countriesnow.space/api/v0.1/countries/capital`);
    var desha = await countrynameurl.json();

    const countrypopurl = await fetch(`https://countriesnow.space/api/v0.1/countries/population`);
    var jana = await countrypopurl.json();

    const countryCardsContainer = document.getElementById("country-card");
    countryCardsContainer.innerHTML = "";

    for (let i = 0; i < 200; i++) {
        const country = desha.data[i];
        const countrypop = jana.data.find(c => c.country === country.name);
        const countryflag = dhwaja.data.find(f => f.name === country.name);

        const card = document.createElement('div');
        card.classList.add('card');

        const flag = document.createElement('img');
        flag.classList.add('flag');

        flag.src = countryflag ? countryflag.flag : "na.png";
        flag.alt = countryflag ? `${country.name} Flag` : "No Flag Available";

        flag.onerror = () => {
            flag.src = "na.png";
        };

        const info = document.createElement('div');
        info.classList.add('card-info');

        const countryName = document.createElement('h3');
        countryName.classList.add('country-name');
        countryName.textContent = country.name;

        const capital = document.createElement('p');
        capital.innerHTML = `<b>Capital:</b> ${country.capital}`;

        const population = document.createElement('p');
        if (countrypop && countrypop.populationCounts.length > 0) {
            population.innerHTML = `<b>Population:</b> ${countrypop.populationCounts.slice(-1)[0].value.toLocaleString()}`;
        } else {
            population.innerHTML = `<b>Population:</b> N/A`;
        }

        // Store region data as a data attribute (you'll need to add region data from another API or manually)
        // For now, we'll add a placeholder
        card.setAttribute('data-region', '');

        info.appendChild(countryName);
        info.appendChild(capital);
        info.appendChild(population);

        card.appendChild(flag);
        card.appendChild(info);

        countryCardsContainer.appendChild(card);
    }
}
page();


// Dark Mode Toggle - Fixed
DarkMode.addEventListener("click", () => {
    body.classList.toggle("dark-theme");
    DarkMode.textContent = body.classList.contains("dark-theme") ? "☀️ Light Mode" : "🌙 Dark Mode";
});

// Search Input - Fixed: Now calls search() on every input change
searchInput.addEventListener("input", search);

// Region Filter - Added event listener
regionFilter.addEventListener("change", filterByRegion);

function search() {
    const input = searchInput.value.toLowerCase();
    const selectedRegion = regionFilter.value;
    const cards = document.querySelectorAll(".card");

    cards.forEach(card => {
        const countryName = card.querySelector(".country-name").textContent.toLowerCase();
        const region = card.getAttribute('data-region');
        
        const matchesSearch = countryName.includes(input);
        const matchesRegion = selectedRegion === "" || region === selectedRegion;
        
        if (matchesSearch && matchesRegion) {
            card.style.display = "flex";
        } else {
            card.style.display = "none";
        }
    });
}

function filterByRegion() {
    search(); // Call search to apply both filters together
}
