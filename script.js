// List of card texts in Estonian
const cardTexts = [
    "Valitud inimene peab viske sooritama vastaskäega",
    "Valitud inimene peab uuesti viske sooritama",
    "Peab sooritama viske kohast neli viset ning valima halvima",
    "Peab sooritama viske kohast kaks viset ning valima halvima",
    "Saab vahetada kaasmängijaga viskekoha ära (peab olema sooritatud sama visete arv)",
    "Saad valida MANDO, mis kehtib kõigile teistele v.a kaardi kasutajale",
    "Saad keelata valitud mängija kotist 2 ketast, millega ta ei tohi visata antud rajal",
    "Valid inimese, kelle kotist võtad kolm ketast, millega ta peab raja läbima (max 2 sama kiirusega)",
    "Saad viske uuesti sooritada, aga pead kasutama üks kiirus madalamat ketast (mitte puttimisel)",
    "Saad vabalt valitud inimese käest tõmmata ühe kaardi ja valida enda pakist vastu",
    "Saad astuda 7 jalga endale sobivas suunuas (tibusammud, ei saa kasutada C1)",
    "Kui ketas puudutab ükskõik millist korvi osa loetakse vise sisse läinuks",
    "Kolm mängijat peavad kõik ketta maandumise kohast astuma 3 sammu sinu valitud suunas",
    "Vabalt valitud inimene peab tegema 5 kiiret keerutust ühes suunas ja peale viimast keerutust kohe viskama",

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
            if (confirm('Kas tahad seda kaarti kasutada?')) {
                cardButton.disabled = true; // Disable the card after it's used
            }
        };

        cardsContainer.appendChild(cardButton);
    }
});

// Event listener for the End Game button
document.getElementById('endGameButton').addEventListener('click', function() {
    alert('Mäng läbi!'); // Show game over message
    location.reload(); // Reload the page to reset the game
});
