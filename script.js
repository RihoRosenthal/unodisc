// List of card texts in Estonian
const cardTexts = [
    "Vaheta visked",
    "Viska nõrgema käega",
    "Kõik kolm tibusammu",
    "Kolm mängijat, kolm pikka sammu",
    "Tee uus vise",
    "Eemalda 2 kiirust",
    "Tee 10 keerutust",
    "Teen mando",
    "Anna viskajale ketas",
    "Viska rollerit",
    "Puudutab kette on sees",
    "Kaks mängijat vahetavad kettaid",
    "Puu on +1",
    "Kettaheitevise"
];

// Event listener for the Start button
document.getElementById('startButton').addEventListener('click', function() {
    document.getElementById('startButton').style.display = 'none';
    document.getElementById('gameArea').style.display = 'block';

    // Create 14 cards dynamically
    const cardsContainer = document.getElementById('cardsContainer');
    for (let i = 0; i < 14; i++) {
        const cardButton = document.createElement('button');
        cardButton.textContent = cardTexts[i]; // Use Estonian card text
        
        // Event listener for each card button
        cardButton.onclick = function() {
            if (confirm('Do you want to use this card?')) {
                cardButton.disabled = true; // Disable the card after it's used
            }
        };

        cardsContainer.appendChild(cardButton);
    }
});

// Event listener for the End Game button
document.getElementById('endGameButton').addEventListener('click', function() {
    alert('Game Over!'); // Show game over message
    location.reload(); // Reload the page to reset the game
});
