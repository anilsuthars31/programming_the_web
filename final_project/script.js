
// Theme toggle
const toggleThemeBtn = document.getElementById('toggle-theme');
const colorblindBtn = document.getElementById('colorblindness');
const body = document.body;

toggleThemeBtn.addEventListener('click', () => {
    body.classList.toggle('dark-theme');
    const icon = body.classList.contains('dark-theme') ? '☀️ light mode' : '🌙 dark mode';
    toggleThemeBtn.textContent = `${icon}`;
});

colorblindBtn.addEventListener('click', () => {
    body.classList.toggle('colorblind-mode');
    const text = body.classList.contains('colorblind-mode') ? '✓ Colorblind Mode' : '👁️ Colorblind Mode';
    colorblindBtn.textContent = text;
});

// Text-to-speech
const speechBtn = document.getElementById('speech');
const descriptionText = document.getElementById('description-text');

speechBtn.addEventListener('click', () => {
    const utterance = new SpeechSynthesisUtterance(descriptionText.textContent);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    speechBtn.textContent = '🔊 Speaking...';
    
    utterance.onend = () => {
        speechBtn.textContent = '🔊 Text-to-Speech';
    };
    
    window.speechSynthesis.speak(utterance);
});

// Search functionality (placeholder)
const mainImg = document.getElementById('main-img');
const searchBtn = document.getElementById('search-btn');
const searchInput = document.getElementById('search');
const loading = document.getElementById('loading');

searchBtn.addEventListener('click', performSearch);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') performSearch();
});

function performSearch() {
    const query = searchInput.value.trim();
    if (!query) return;

    loading.classList.add('active');

    const apiUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) throw new Error("No results found.");
            return response.json();
        })
        .then(data => {
            descriptionText.textContent = data.extract || "No description available.";
            mainImg.src = data.thumbnail?.source || "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/480px-No_image_available.svg.png";
        })
        .catch(error => {
            descriptionText.textContent = `Sorry, no results for "${query}". Try another word!`;
            mainImg.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/480px-No_image_available.svg.png";
        })
        .finally(() => {
            loading.classList.remove('active');
        });
}








