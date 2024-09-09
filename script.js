// Import the Firebase libraries
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, addDoc, query, where, getDocs, updateDoc, doc } from "firebase/firestore";

// Your Firebase configuration
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
const db = getFirestore(app);

// Registration
async function register() {
    const username = document.getElementById('regUsername').value;
    const password = document.getElementById('regPassword').value;
    const verifyPassword = document.getElementById('regVerifyPassword').value;
    const message = document.getElementById('regMessage');

    if (password !== verifyPassword) {
        message.textContent = 'Passwords do not match!';
        message.style.color = 'red';
        return;
    }

    try {
        await createUserWithEmailAndPassword(auth, username, password);
        message.textContent = 'Registration successful!';
        message.style.color = 'green';
    } catch (error) {
        message.textContent = `Error: ${error.message}`;
        message.style.color = 'red';
    }
}

// Login
async function login() {
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    const message = document.getElementById('loginMessage');

    try {
        await signInWithEmailAndPassword(auth, username, password);
        window.location.href = 'main.html';  // Redirect to main page on successful login
    } catch (error) {
        message.textContent = `Error: ${error.message}`;
        message.style.color = 'red';
    }
}

// Display welcome message on main screen
async function displayWelcomeMessage() {
    const user = auth.currentUser;
    if (!user) {
        window.location.href = 'index.html';
        return;
    }

    document.getElementById('welcomeMessage').textContent = `Welcome, ${user.email}`;
}

// Add card
async function addCard() {
    const cardText = document.getElementById('newCardText').value;
    if (!cardText) return;

    const user = auth.currentUser;
    if (!user) {
        alert('You must be logged in to add cards.');
        return;
    }

    const cardsRef = collection(db, 'cards');
    await addDoc(cardsRef, {
        userId: user.uid,
        text: cardText,
        used: false
    });

    displayCards();
}

// Display cards
async function displayCards() {
    const cardList = document.getElementById('cardList');
    const user = auth.currentUser;
    if (!user) {
        window.location.href = 'index.html';
        return;
    }

    const cardsRef = collection(db, 'cards');
    const q = query(cardsRef, where('userId', '==', user.uid));
    const querySnapshot = await getDocs(q);
    
    cardList.innerHTML = '';
    querySnapshot.forEach((doc) => {
        const cardData = doc.data();
        const cardItem = document.createElement('div');
        cardItem.className = cardData.used ? 'card-item used' : 'card-item';
        cardItem.textContent = cardData.text;
        cardItem.setAttribute('data-id', doc.id);
        cardItem.addEventListener('click', handleCardClick);
        cardList.appendChild(cardItem);
    });
}

// Handle card click event
async function handleCardClick(event) {
    const cardItem = event.currentTarget;
    const cardId = cardItem.getAttribute('data-id');
    const cardText = cardItem.textContent;

    if (cardItem.classList.contains('used')) {
        return; // Do nothing if the card is already used
    }

    if (confirm(`Do you want to use the card: "${cardText}"?`)) {
        cardItem.classList.add('used');
        cardItem.removeEventListener('click', handleCardClick);

        const cardRef = doc(db, 'cards', cardId);
        await updateDoc(cardRef, {
            used: true
        });
    }
}

// Start game
async function startGame() {
    const user = auth.currentUser;
    if (!user) {
        alert('You must be logged in to start the game.');
        return;
    }

    const cardsRef = collection(db, 'cards');
    const q = query(cardsRef, where('userId', '==', user.uid), where('used', '==', false));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.size < 14) {
        alert('You need at least 14 cards to start the game.');
        return;
    }

    const allCards = querySnapshot.docs.map(doc => doc.data().text);
    const shuffledCards = allCards.sort(() => 0.5 - Math.random());
    const selectedCards = shuffledCards.slice(0, 18);
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
            alert('Game over!');
            window.location.href = 'main.html';
        });
    }
});
