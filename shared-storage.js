// Add this at the top of your existing script section
const STORAGE_URL = 'https://api.jsonbin.io/v3/b/YOUR_BIN_ID';
const API_KEY = 'YOUR_API_KEY';

// Replace the localStorage code with this new version
async function loadScores() {
    try {
        const response = await fetch(STORAGE_URL, {
            headers: {
                'X-Master-Key': API_KEY
            }
        });
        const data = await response.json();
        return data.record || {
            overall: [],
            hiring: [],
            wage: [],
            performance: [],
            terminations: [],
            claims: [],
            policies: []
        };
    } catch (error) {
        console.error('Error loading scores:', error);
        return {
            overall: [],
            hiring: [],
            wage: [],
            performance: [],
            terminations: [],
            claims: [],
            policies: []
        };
    }
}

async function saveScores(scores) {
    try {
        await fetch(STORAGE_URL, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': API_KEY
            },
            body: JSON.stringify(scores)
        });
    } catch (error) {
        console.error('Error saving scores:', error);
    }
}

// Update the addScore function to use the new storage
async function addScore() {
    const category = document.getElementById('categorySelect').value;
    const playerName = document.getElementById('playerName').value;
    const score = parseInt(document.getElementById('score').value);
    const time = document.getElementById('time').value;

    if (!playerName || isNaN(score)) {
        alert('Please enter both name and score');
        return;
    }

    const scores = await loadScores();
    
    // Add score to selected category
    scores[category].push({
        name: playerName,
        score: score,
        time: time || 'N/A'
    });

    // Sort by score (descending)
    scores[category].sort((a, b) => b.score - a.score);

    await saveScores(scores);
    
    // Play submit sound
    document.getElementById('submitSound').play();

    updateLeaderboards();
    
    // Clear form
    document.getElementById('playerName').value = '';
    document.getElementById('score').value = '';
    document.getElementById('time').value = '';
}

// Add auto-refresh to keep scores updated
setInterval(async () => {
    const scores = await loadScores();
    updateLeaderboards(scores);
}, 5000); // Refresh every 5 seconds