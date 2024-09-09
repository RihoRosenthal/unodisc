// Firebase authentication instance from the window object
const auth = window.auth;

// Registration function
function register() {
    const email = document.getElementById('regUsername').value;
    const password = document.getElementById('regPassword').value;
    const verifyPassword = document.getElementById('regVerifyPassword').value;
    const message = document.getElementById('regMessage');

    if (password !== verifyPassword) {
        message.textContent = 'Passwords do not match!';
        message.style.color = 'red';
        return;
    }

    // Create a new user using Firebase
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Registration successful
            message.textContent = 'Registration successful!';
            message.style.color = 'green';
        })
        .catch((error) => {
            // Display error message
            message.textContent = `Error: ${error.message}`;
            message.style.color = 'red';
        });
}

// Login function
function login() {
    const email = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    const message = document.getElementById('loginMessage');

    // Sign in user with Firebase
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Login successful
            localStorage.setItem('currentUser', email);
            window.location.href = 'main.html'; // Redirect to main page
        })
        .catch((error) => {
            // Display error message
            message.textContent = `Error: ${error.message}`;
            message.style.color = 'red';
        });
}

// Display welcome message on main screen
function displayWelcomeMessage() {
    const username = localStorage.getItem('currentUser');
    if (!username) {
        window.location.href = 'index.html';
        return;
    }

    document.getElementById('welcomeMessage').textContent = `Welcome, ${username}`;
}

// Add card function
function addCard() {
    const cardText = document.getElementById('newCardText').value;
    if (!cardText) return;

    const username = localStorage.getItem('currentUser');
    if (!username) {
        alert('You must be logged in to add cards.');
        return;
    }

    const users = JSON.parse(localStorage.getItem('users')) || {};
    users[username] = users[username] || { cards: [] };
    users[username].cards.push({ text: cardText, used: false });
    localStorage.setItem('users', JSON.stringify(users));

    displayCards();
}

// Display cards with delete option
function displayCards() {
    const cardList = document.getElementById('cardList');
    const username = localStorage.getItem('currentUser');
    if (!username) {
        window.location.href = 'index.html';
        return;
    }

    const users = JSON.parse(localStorage.getItem('users')) || {};
    const userCards = users[username]?.cards || [];

    cardList.innerHTML = '';
    userCards.forEach((card, index) => {
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
    const username = localStorage.getItem('currentUser');
    const users = JSON.parse(localStorage.getItem('users')) || {};
    if (users[username]) {
        users[username].cards.splice(index, 1);
        localStorage.setItem('users', JSON.stringify(users));
        displayCards();
    }
}

// Start game function
function startGame() {
    const username = localStorage.getItem('currentUser');
    if (!username) {
        alert('You must be logged in to start the game.');
        return;
    }

    const users = JSON.parse(localStorage.getItem('users')) || {};
    const availableCards = users[username]?.cards.filter(card => !card.used) || [];

    if (availableCards.length < 14) {
        alert('You need at least 14 cards to start the game.');
        return;
    }

    const shuffledCards = availableCards.sort(() => 0.5 - Math.random());
    const selectedCards = shuffledCards.slice(0, 14); // Select 14 cards
    localStorage.setItem('gameCards', JSON.stringify(selectedCards));
    window.location.href = 'game.html';
}

// Display game cards on the game page
function displayGameCards() {
    const gameCards = JSON.parse(localStorage.getItem('gameCards')) || [];
    const cardList = document.getElementById('gameCardsContainer');
    cardList.innerHTML = '';

    gameCards.forEach(card => {
        const cardItem = document.createElement('div');
        cardItem.className = 'card-item';
        cardItem.textContent = card.text;
        cardItem.addEventListener('click', handleCardClick);
        cardList.appendChild(cardItem);
    });
}

// Handle card click event
function handleCardClick(event) {
    const cardItem = event.currentTarget;
    const cardIndex = cardItem.getAttribute('data-index');
    const cardText = cardItem.textContent;
    const username = localStorage.getItem('currentUser');

    if (cardItem.classList.contains('used')) {
        return; // Do nothing if the card is already used
    }

    if (confirm(`Do you want to use the card: "${cardText}"?`)) {
        const users = JSON.parse(localStorage.getItem('users')) || {};
        users[username].cards[cardIndex].used = true;
        localStorage.setItem('users', JSON.stringify(users));
        cardItem.classList.add('used');
        cardItem.removeEventListener('click', handleCardClick);
    }
}

// End game and go back to start
function endGame() {
    localStorage.removeItem('gameCards'); // Clear game state
    window.location.href = 'index.html'; // Redirect to the start screen
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
        displayGameCards();
        document.getElementById('endGameButton')?.addEventListener('click', endGame);
    }
});
