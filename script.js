// Firebase SDK initialization
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAb5_fcWOzMtrGqIIjlZ7vbEowtyvVAxZE",
  authDomain: "oob-uno.firebaseapp.com",
  projectId: "oob-uno",
  storageBucket: "oob-uno.appspot.com",
  messagingSenderId: "988582411605",
  appId: "1:988582411605:web:6a2ae0c8128353e3bd03dc",
  measurementId: "G-4F533V9M69"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

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

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            message.textContent = 'Registration successful!';
            message.style.color = 'green';
        })
        .catch((error) => {
            message.textContent = `Error: ${error.message}`;
            message.style.color = 'red';
        });
}

// Login function
function login() {
    const email = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    const message = document.getElementById('loginMessage');

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            window.localStorage.setItem('currentUser', email);
            window.location.href = 'main.html';  // Redirect to main page on successful login
        })
        .catch((error) => {
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

    // Fetch user data and add a card (this will need to be adapted to your backend setup)
    // For example, using Firestore or Realtime Database
}

// Display cards with delete option
function displayCards() {
    const cardList = document.getElementById('cardList');
    const username = localStorage.getItem('currentUser');
    if (!username) {
        window.location.href = 'index.html';
        return;
    }

    // Fetch user cards and display them (this will need to be adapted to your backend setup)
}

// Delete card function
function deleteCard(index) {
    const username = localStorage.getItem('currentUser');

    // Fetch user data and delete a card (this will need to be adapted to your backend setup)
}

// Start game
function startGame() {
    const username = localStorage.getItem('currentUser');
    if (!username) {
        alert('You must be logged in to start the game.');
        return;
    }

    // Fetch user cards and start game (this will need to be adapted to your backend setup)
}

// Display game cards on the game page
function displayGameCards() {
    const gameCards = JSON.parse(localStorage.getItem('gameCards')) || [];
    const cardList = document.getElementById('gameCardsContainer'); // Correct ID
    cardList.innerHTML = '';

    gameCards.forEach(card => {
        const cardItem = document.createElement('div');
        cardItem.className = 'card-item';
        cardItem.textContent = card.text;
        cardList.appendChild(cardItem);
    });
}

// End game and go back to start
function endGame() {
    localStorage.removeItem('gameCards'); // Clear game state
    window.location.href = 'index.html'; // Redirect to the start screen
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
        // Mark card as used and save it (this will need to be adapted to your backend setup)
        cardItem.classList.add('used');
        cardItem.removeEventListener('click', handleCardClick);
    }
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
