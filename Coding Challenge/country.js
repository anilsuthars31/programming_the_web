const box = document.querySelector('.wrap-main-grid'),
      search = document.getElementById('searchInput'),
      region = document.getElementById('regionFilter'),
      darkBtn = document.querySelector('.Dark-mode');

async function getData(url = 'https://restcountries.com/v3.1/all') {
  try {
    // Try the requested URL first
    let res = await fetch(url);

    // If the server returns a 400 complaining about a missing `fields` query,
    // retry once with a commonly used `fields` parameter that limits the
    // response size and satisfies servers that require it.
    if (!res.ok) {
      const bodyText = await res.text().catch(() => '');
      console.error('REST Countries API error', res.status, bodyText);

      const needsFields = /fields|query not specified/i.test(bodyText);
      if (res.status === 400 && needsFields) {
        const sep = url.includes('?') ? '&' : '?';
        const retryUrl = `${url}${sep}fields=name,capital,flags,population,region`;
        console.warn('Retrying with fields parameter:', retryUrl);
        res = await fetch(retryUrl);
      }

      if (!res.ok) {
        // give up after the retry and let the catch below handle the UI
        const finalBody = await res.text().catch(() => 'no body');
        throw new Error(`Request failed: ${res.status} ${finalBody}`);
      }
    }

    const data = await res.json();
    show(data);
  } catch (err) {
    console.error('getData error:', err);
    box.innerHTML = '<p style="text-align:center;">Failed to load data.</p>';
  }
}

function show(countries) {
  box.innerHTML = '';
  countries.forEach(c => {
    box.innerHTML += `
      <div class="country-card">
        <img src="${c.flags?.svg}" class="flag" alt="${c.name?.common}">
        <div class="card-info">
          <h3 class="country-name">${c.name?.common}</h3>
          <p><b>Population:</b> ${c.population?.toLocaleString() || 'N/A'}</p>
          <p><b>Region:</b> ${c.region || 'N/A'}</p>
          <p><b>Capital:</b> ${c.capital ? c.capital[0] : 'N/A'}</p>
        </div>
      </div>`;
  });
}

search.addEventListener('input', e => {
  let v = e.target.value.trim();
  // encode user input to avoid malformed requests when input contains spaces/symbols
  getData(v ? `https://restcountries.com/v3.1/name/${encodeURIComponent(v)}` : 'https://restcountries.com/v3.1/all');
});

region.addEventListener('change', e => {
  let v = e.target.value;
  // region values are simple strings, but encode anyway for safety
  getData(v ? `https://restcountries.com/v3.1/region/${encodeURIComponent(v)}` : 'https://restcountries.com/v3.1/all');
});

if (darkBtn) {
  darkBtn.addEventListener('click', () => {
    const added = document.body.classList.toggle('dark-theme');
    console.log('Dark mode toggled. now dark-theme =', added);
  });
} else {
  console.warn('Dark mode button not found: .Dark-mode');
}

getData();




