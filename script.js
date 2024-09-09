// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, collection, addDoc, getDocs, query, where, updateDoc, doc } from "firebase/firestore";

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
const db = getFirestore(app);

// Registration function
async function register() {
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const verifyPassword = document.getElementById('regVerifyPassword').value;
    const message = document.getElementById('regMessage');

    if (password !== verifyPassword) {
        message.textContent = 'Passwords do not match!';
        message.style.color = 'red';
        return;
    }

    try {
        await createUserWithEmailAndPassword(auth, email, password);
        const userRef = doc(db, 'users', email);
        await setDoc(userRef, { cards: [] });
        message.textContent = 'Registration successful!';
        message.style.color = 'green';
    } catch (error) {
        message.textContent = error.message;
        message.style.color = 'red';
    }
}

// Login function
async function login() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const message = document.getElementById('loginMessage');

    try {
        await signInWithEmailAndPassword(auth, email, password);
        localStorage.setItem('currentUser', email);
        window.location.href = 'main.html'; // Redirect to main page
    } catch (error) {
        message.textContent = 'Invalid email or password!';
        message.style.color = 'red';
    }
}

// Display welcome message on main screen
async function displayWelcomeMessage() {
    const username = localStorage.getItem('currentUser');
    if (!username) {
        window.location.href = 'index.html';
        return;
    }

    document.getElementById('welcomeMessage').textContent = `Welcome, ${username}`;
}

// Add card function
async function addCard() {
    const cardText = document.getElementById('newCardText').value;
    if (!cardText) return;

    const username = localStorage.getItem('currentUser');
    if (!username) {
        alert('You must be logged in to add cards.');
        return;
    }

    const userRef = doc(db, 'users', username);
    await updateDoc(userRef, {
        cards: firebase.firestore.FieldValue.arrayUnion({ text: cardText, used: false })
    });

    displayCards();
}

// Display cards with delete option
async function displayCards() {
    const cardList = document.getElementById('cardList');
    const username = localStorage.getItem('currentUser');
    if (!username) {
        window.location.href = 'index.html';
        return;
    }

    const userRef = doc(db, 'users', username);
    const userDoc = await getDoc(userRef);
    const userCards = userDoc.data()?.cards || [];

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
async function deleteCard(index) {
    const username = localStorage.getItem('currentUser');
    const userRef = doc(db, 'users', username);
    const userDoc = await getDoc(userRef);
    const userCards = userDoc.data()?.cards || [];
    
    userCards.splice(index, 1);
    await updateDoc(userRef, { cards: userCards });

    displayCards();
}

// Start game function
async function startGame() {
    const username = localStorage.getItem('currentUser');
    if (!username) {
        alert('You must be logged in to start the game.');
        return;
    }

    const userRef = doc(db, 'users', username);
    const userDoc = await getDoc(userRef);
    const availableCards = userDoc.data()?.cards.filter(card => !card.used) || [];

    if (availableCards.length < 14) {
        alert('You need at least 14 cards to start the game.');
        return;
    }

    const shuffledCards = availableCards.sort(() => Math.random() - 0.5);
    const gameRef = collection(db, 'games');
    const newGameDoc = await addDoc(gameRef, { cards: shuffledCards, players: [username] });

    localStorage.setItem('currentGame', newGameDoc.id);
    window.location.href = 'game.html'; // Redirect to game page
}

// Display game cards function
async function displayGameCards() {
    const gameId = localStorage.getItem('currentGame');
    if (!gameId) {
        window.location.href = 'index.html';
        return;
    }

    const gameRef = doc(db, 'games', gameId);
    const gameDoc = await getDoc(gameRef);
    const gameCards = gameDoc.data()?.cards || [];

    const gameCardsContainer = document.getElementById('gameCardsContainer');
    gameCardsContainer.innerHTML = '';

    gameCards.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.className = 'game-card';
        cardElement.style.backgroundColor = 'blue';
        cardElement.textContent = card.text;
        gameCardsContainer.appendChild(cardElement);
    });
}

// Event listeners
document.getElementById('registrationForm').addEventListener('submit', (e) => {
    e.preventDefault();
    register();
});

document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    login();
});

document.getElementById('addCardButton').addEventListener('click', addCard);
document.getElementById('goBackButton').addEventListener('click', () => window.location.href = 'index.html');
document.getElementById('endGameButton').addEventListener('click', () => window.location.href = 'index.html');

// Initialize page based on context
if (document.getElementById('addCardsContainer')) {
    displayCards();
} else if (document.getElementById('gameArea')) {
    displayGameCards();
} else if (document.getElementById('authScreen')) {
    displayWelcomeMessage();
}
