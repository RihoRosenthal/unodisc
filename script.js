// Navigate to the add cards screen
function goToAddCards() {
    window.location.href = 'add-cards.html'; // Redirect to add-cards page
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

    // Log current cards for debugging
    console.log('Current cards:', cards);

    // Check if a card with the same text already exists
    const cardExists = cards.some(card => card.text === cardText);
    if (cardExists) {
        alert('Selline kaart on juba olemas'); // Alert if card text is already in the list
        return;
    }

    // Add new card
    cards.push({ text: cardText, used: false });
    localStorage.setItem('cards', JSON.stringify(cards));
    displayCards(); // Refresh the card list

    // Log updated cards for debugging
    console.log('Updated cards:', cards);
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

    // Reset all cards to unplayed
    cards = cards.map(card => ({ ...card, used: false }));
    localStorage.setItem('cards', JSON.stringify(cards)); // Save the updated cards

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


// Load selected cards for the game
function loadGameCards() {
    const selectedCards = JSON.parse(localStorage.getItem('selectedCards')) || [];
    const unplayedCardsContainer = document.getElementById('unplayedCardsContainer');
    const playedCardsContainer = document.getElementById('playedCardsContainer');
    
    if (!unplayedCardsContainer || !playedCardsContainer) {
        console.error('Card containers not found.');
        return;
    }

    unplayedCardsContainer.innerHTML = '';
    playedCardsContainer.innerHTML = '';

    selectedCards.forEach((card, index) => {
        const cardItem = document.createElement('div');
        cardItem.className = 'card-item'; // Blue for unplayed cards
        cardItem.textContent = card.text;

        if (card.used) {
            cardItem.classList.add('played'); // Greyed out for used cards
            playedCardsContainer.appendChild(cardItem);
        } else {
            // Click event for confirming card usage
            cardItem.addEventListener('click', () => {
                if (!card.used) {
                    confirmCardUsage(cardItem, card, index);
                }
            });
            unplayedCardsContainer.appendChild(cardItem);
        }
    });
}

// Confirm card usage
function confirmCardUsage(cardItem, card, index) {
    const confirmation = confirm("Kas tahad seda kaarti kasutada?");
    if (confirmation) {
        cardItem.classList.add('played'); // Add 'played' class to grey out
        card.used = true;
        updateCard(index, card);
        // Move to played cards container
        document.getElementById('playedCardsContainer').appendChild(cardItem);
    }
}

// Update card in LocalStorage
function updateCard(index, updatedCard) {
    let cards = JSON.parse(localStorage.getItem('cards')) || [];
    cards[index] = updatedCard;
    localStorage.setItem('cards', JSON.stringify(cards));
    displayCards(); // Refresh the card list
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    const addCardButton = document.getElementById('addCardButton');
    if (addCardButton) {
        addCardButton.removeEventListener('click', addCard); // Clean up any existing event listeners
        addCardButton.addEventListener('click', addCard); // Add the click event listener for adding cards
    }
    
    const goBackButton = document.getElementById('goBackButton');
    if (goBackButton) {
        goBackButton.addEventListener('click', () => window.location.href = 'main.html');
    }
    
    const startGameButton = document.getElementById('startGameButton');
    if (startGameButton) {
        startGameButton.addEventListener('click', startGame);
    }
    
    const endGameButton = document.getElementById('endGameButton');
    if (endGameButton) {
        endGameButton.addEventListener('click', endGame);
    }

    // Load cards on the add cards page
    if (document.getElementById('cardList')) {
        displayCards();
    }

    // Load selected cards for the game
    if (document.getElementById('unplayedCardsContainer') || document.getElementById('playedCardsContainer')) {
        loadGameCards();
    }
});
