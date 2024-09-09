const usersKey = 'users';
const cardsKey = 'cards';

// Registration
function register() {
    const username = document.getElementById('regUsername').value;
    const password = document.getElementById('regPassword').value;
    const verifyPassword = document.getElementById('regVerifyPassword').value;
    const message = document.getElementById('regMessage');

    if (password !== verifyPassword) {
        message.textContent = 'Paroolid ei klapi!';
        message.style.color = 'white';
        return;
    }

    let users = JSON.parse(localStorage.getItem(usersKey)) || {};
    if (users[username]) {
        message.textContent = 'Kasutajanimi juba olemas!';
        message.style.color = 'white';
        return;
    }

    users[username] = password;
    localStorage.setItem(usersKey, JSON.stringify(users));
    message.textContent = 'Korras. Logi sisse!';
    message.style.color = 'white';
}

// Login
function login() {
    const username = document.getElementById('loginUsername');
    const password = document.getElementById('loginPassword');
    const message = document.getElementById('loginMessage');

    if (!username || !password || !message) {
        console.error('Required elements not found in the DOM');
        return;
    }

    const usernameValue = username.value;
    const passwordValue = password.value;

    let users = JSON.parse(localStorage.getItem(usersKey)) || {};
    if (users[usernameValue] && users[usernameValue] === passwordValue) {
        localStorage.setItem('loggedInUser', usernameValue);
        window.location.href = 'main.html';
    } else {
        message.textContent = 'Vale kasutajanimi või parool!';
        message.style.color = 'white';
    }
}

// Display welcome message on main screen
function displayWelcomeMessage() {
    const username = localStorage.getItem('loggedInUser');
    if (!username) {
        window.location.href = 'index.html';
    }

    document.getElementById('welcomeMessage').textContent = `Tere, ${username}`;
}

// Add card
function addCard() {
    const cardText = document.getElementById('newCardText').value;
    if (!cardText) return;

    let cards = JSON.parse(localStorage.getItem(cardsKey)) || [];
    if (cards.length >= 40) {
        alert('Maximum number of cards reached.');
        return;
    }

    cards.push(cardText);
    localStorage.setItem(cardsKey, JSON.stringify(cards));
    displayCards();
}

// Display cards
function displayCards() {
    const cardList = document.getElementById('cardList');
    let cards = JSON.parse(localStorage.getItem(cardsKey)) || [];
    cardList.innerHTML = '';

    cards.forEach((card, index) => {
        const cardItem = document.createElement('div');
        cardItem.className = 'card-item';
        cardItem.textContent = card;
        cardItem.setAttribute('data-index', index);
        cardItem.addEventListener('click', handleCardClick);
        cardList.appendChild(cardItem);
    });
}

// Handle card click event
function handleCardClick(event) {
    const cardItem = event.currentTarget;
    const cardIndex = cardItem.getAttribute('data-index');
    const cardText = cardItem.textContent;

    if (cardItem.classList.contains('used')) {
        return; // Do nothing if the card is already used
    }

    if (confirm(`Kas soovite kasutada kaarti: "${cardText}"?`)) {
        cardItem.classList.add('used');
        cardItem.removeEventListener('click', handleCardClick);

        let cards = JSON.parse(localStorage.getItem(cardsKey)) || [];
        // Optionally handle the card usage here (e.g., move it to another list)
    }
}

// Remove card
function removeCard(index) {
    let cards = JSON.parse(localStorage.getItem(cardsKey)) || [];
    cards.splice(index, 1);
    localStorage.setItem(cardsKey, JSON.stringify(cards));
    displayCards();
}

// Start game
function startGame() {
    let cards = JSON.parse(localStorage.getItem(cardsKey)) || [];
    if (cards.length < 14) {
        alert('You need at least 14 cards to start the game.');
        return;
    }

    let shuffledCards = cards.sort(() => 0.5 - Math.random());
    let selectedCards = shuffledCards.slice(0, 18);
    localStorage.setItem('gameCards', JSON.stringify(selectedCards));
    window.location.href = 'game.html';
}

// Back button functionality
function goBack() {
    window.location.href = 'main.html';
}

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.endsWith('index.html')) {
        // Login and registration page logic
        document.getElementById('registrationForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            register();
        });

        document.getElementById('loginForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            login();
        });
    } else if (window.location.pathname.endsWith('main.html')) {
        displayWelcomeMessage();
        document.getElementById('addCardsButton')?.addEventListener('click', () => window.location.href = 'add-cards.html');
        document.getElementById('startGameButton')?.addEventListener('click', startGame);
    } else if (window.location.pathname.endsWith('add-cards.html')) {
        displayCards();
        document.getElementById('addCardButton')?.addEventListener('click', addCard);
        document.getElementById('goBackButton')?.addEventListener('click', goBack);
    } else if (window.location.pathname.endsWith('game.html')) {
        let gameCards = JSON.parse(localStorage.getItem('gameCards')) || [];
        const gameCardsContainer = document.getElementById('gameCardsContainer');
        gameCards.forEach(cardText => {
            const cardButton = document.createElement('button');
            cardButton.textContent = cardText;
            cardButton.className = 'card-item';
            cardButton.setAttribute('data-text', cardText);
            cardButton.addEventListener('click', handleCardClick);
            gameCardsContainer.appendChild(cardButton);
        });
        document.getElementById('endGameButton')?.addEventListener('click', () => {
            alert('Mäng läbi!');
            window.location.href = 'main.html';
        });
    }
});
