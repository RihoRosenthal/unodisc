// Add card function
function addCard() {
    const cardText = document.getElementById('newCardText').value.trim();
    if (!cardText) return;

    let cards = JSON.parse(localStorage.getItem('cards')) || [];
    cards.push({ text: cardText, used: false });
    localStorage.setItem('cards', JSON.stringify(cards));

    displayCards();
}

// Display cards with delete option
function displayCards() {
    const cardList = document.getElementById('cardList');
    let cards = JSON.parse(localStorage.getItem('cards')) || [];

    cardList.innerHTML = '';
    cards.forEach((card, index) => {
        const cardItem = document.createElement('div');
        cardItem.className = card.used ? 'card-item used' : 'card-item';
        cardItem.textContent = card.text;

        // Add delete button
        const deleteButton = document.createElement('span');
        deleteButton.textContent = ' X';
        deleteButton.style.color = 'red';
        deleteButton.style.cursor = 'pointer';
        deleteButton.style.marginLeft = '10px';
        deleteButton.addEventListener('click', () => deleteCard(index));

        cardItem.appendChild(deleteButton);
        cardList.appendChild(cardItem);
    });
}

// Delete card function
function deleteCard(index) {
    let cards = JSON.parse(localStorage.getItem('cards')) || [];
    cards.splice(index, 1);
    localStorage.setItem('cards', JSON.stringify(cards));
    displayCards();
}

// Start game function
function startGame() {
    let cards = JSON.parse(localStorage.getItem('cards')) || [];
    if (cards.length < 14) {
        alert('You need at least 14 cards to start the game.');
        return;
    }

    const selectedCards = [];
    while (selectedCards.length < 14) {
        const randomIndex = Math.floor(Math.random() * cards.length);
        if (!selectedCards.includes(cards[randomIndex])) {
            selectedCards.push(cards[randomIndex]);
        }
    }

    localStorage.setItem('selectedCards', JSON.stringify(selectedCards));
    window.location.href = 'game.html'; // Redirect to game page
}

// End game function
function endGame() {
    localStorage.removeItem('selectedCards');
    window.location.href = 'index.html'; // Redirect to main menu
}

// View cards function
function viewCards() {
    window.location.href = 'add-cards.html'; // Redirect to add cards page
}

// Event listeners
document.getElementById('addCardButton')?.addEventListener('click', addCard);
document.getElementById('goBackButton')?.addEventListener('click', () => window.location.href = 'index.html');
document.getElementById('startGameButton')?.addEventListener('click', startGame);
document.getElementById('endGameButton')?.addEventListener('click', endGame);
document.getElementById('viewCardsButton')?.addEventListener('click', viewCards);

// Load cards on the add cards page
if (document.getElementById('cardList')) {
    displayCards();
}

// Load selected cards for the game
if (document.getElementById('gameCardsContainer')) {
    const selectedCards = JSON.parse(localStorage.getItem('selectedCards')) || [];
    const gameCardsContainer = document.getElementById('gameCardsContainer');
    gameCardsContainer.innerHTML = '';

    selectedCards.forEach((card, index) => {
        const cardItem = document.createElement('div');
        cardItem.className = 'game-card';
        cardItem.textContent = card.text;
        cardItem.addEventListener('click', () => {
            cardItem.classList.toggle('played');
            cardItem.classList.toggle('unused');
        });
        gameCardsContainer.appendChild(cardItem);
    });
}
