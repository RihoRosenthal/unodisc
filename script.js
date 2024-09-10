// Navigate to the add cards screen
function goToAddCards() {
    window.location.href = 'add-cards.html'; // Redirect to add cards page
}

// Navigate to the game screen
function goToGame() {
    const userCards = JSON.parse(localStorage.getItem('cards')) || [];
    if (userCards.length < 14) {
        alert(`Sul on vaja vähemalt 14 kaarti, et mängu alustada. Sul on ${userCards.length} kaart(i).`);
        return;
    }
    window.location.href = 'game.html'; // Redirect to game page
}

// End game function
function endGame() {
    localStorage.removeItem('selectedCards');
    window.location.href = 'main.html'; // Redirect to main page
}

// Add card function
function addCard() {
    const cardText = document.getElementById('newCardText').value.trim(); // Trim whitespace
    if (!cardText) {
        alert('Ilma tekstita kaarti ei saa lisada'); // Alert if card text is empty
        return;
    }

    let cards = JSON.parse(localStorage.getItem('cards')) || [];
    cards.push({ text: cardText, used: false });
    localStorage.setItem('cards', JSON.stringify(cards));
    displayCards(); // Refresh the card list
}

// Display cards with delete option
function displayCards() {
    const cardList = document.getElementById('cardList');
    if (!cardList) return; // Ensure cardList exists

    let cards = JSON.parse(localStorage.getItem('cards')) || [];
    cardList.innerHTML = '';
    cards.forEach((card, index) => {
        const cardItem = document.createElement('div');
        cardItem.className = 'card-item'; // Always blue
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
    cards.splice(index, 1); // Remove card at index
    localStorage.setItem('cards', JSON.stringify(cards));
    displayCards(); // Refresh the card list
}

// Start game function
function startGame() {
    let cards = JSON.parse(localStorage.getItem('cards')) || [];
    if (cards.length < 14) {
        alert(`Sul on vaja vähemalt 14 kaarti, et mängu alustada. Sul on ${cards.length} kaart(i).`);
        return;
    }

    const selectedCards = [];
    while (selectedCards.length < 14) {
        const randomIndex = Math.floor(Math.random() * cards.length);
        const card = cards[randomIndex];
        if (!selectedCards.includes(card)) {
            selectedCards.push(card);
        }
    }

    localStorage.setItem('selectedCards', JSON.stringify(selectedCards));
    window.location.href = 'game.html'; // Redirect to game page
}

// Confirm card usage
function confirmCardUsage(cardItem, card, index) {
    const confirmation = confirm("Kas tahad seda kaarti kasutada?");
    if (confirmation) {
        cardItem.classList.add('played'); // Add 'played' class to grey out
        card.used = true;
        updateCard(index, card);
    } else {
        deleteCard(index);
    }
}

// Update card in LocalStorage
function updateCard(index, updatedCard) {
    let cards = JSON.parse(localStorage.getItem('cards')) || [];
    cards[index] = updatedCard;
    localStorage.setItem('cards', JSON.stringify(cards));
    displayCards(); // Refresh the card list
}

// Load selected cards for the game
function loadGameCards() {
    const selectedCards = JSON.parse(localStorage.getItem('selectedCards')) || [];
    const gameCardsContainer = document.getElementById('gameCardsContainer');
    gameCardsContainer.innerHTML = '';

    selectedCards.forEach((card, index) => {
        const cardItem = document.createElement('div');
        cardItem.className = 'card-item'; // Use 'card-item' for blue cards in game
        cardItem.textContent = card.text;

        // Add click event to confirm card usage
        cardItem.addEventListener('click', () => {
            if (!card.used) {
                confirmCardUsage(cardItem, card, index);
            }
        });

        gameCardsContainer.appendChild(cardItem);
    });
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('addCardButton')) {
        document.getElementById('addCardButton').addEventListener('click', addCard);
    }
    if (document.getElementById('goBackButton')) {
        document.getElementById('goBackButton').addEventListener('click', () => window.location.href = 'main.html');
    }
    if (document.getElementById('startGameButton')) {
        document.getElementById('startGameButton').addEventListener('click', startGame);
    }
    if (document.getElementById('endGameButton')) {
        document.getElementById('endGameButton').addEventListener('click', endGame);
    }
    
    // Load cards on the add cards page
    if (document.getElementById('cardList')) {
        displayCards();
    }

    // Load selected cards for the game
    if (document.getElementById('gameCardsContainer')) {
        loadGameCards();
    }
});
