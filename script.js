// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAb5_fcWOzMtrGqIIjlZ7vbEowtyvVAxZE",
    authDomain: "oob-uno.firebaseapp.com",
    projectId: "oob-uno",
    storageBucket: "oob-uno.appspot.com",
    messagingSenderId: "988582411605",
    appId: "1:988582411605:web:6a2ae0c8128353e3bd03dc",
    measurementId: "G-4F533V9M69"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

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
        await auth.createUserWithEmailAndPassword(email, password);
        const userRef = db.collection('users').doc(email);
        await userRef.set({ cards: [] });
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
        await auth.signInWithEmailAndPassword(email, password);
        localStorage.setItem('currentUser', email);
        window.location.href = 'main.html'; // Redirect to main page
    } catch (error) {
        message.textContent = 'Invalid email or password!';
        message.style.color = 'red';
    }
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
async function addCard() {
    console.log("Add Card button clicked"); // Debugging
    const cardText = document.getElementById('newCardText').value;
    if (!cardText) return;

    const username = localStorage.getItem('currentUser');
    if (!username) {
        alert('You must be logged in to add cards.');
        return;
    }

    const userRef = db.collection('users').doc(username);
    await userRef.update({
        cards: firebase.firestore.FieldValue.arrayUnion({ text: cardText, used: false })
    });

    displayCards();
}

// Display cards with delete option
async function displayCards() {
    console.log("Display Cards function called"); // Debugging
    const cardList = document.getElementById('cardList');
    const username = localStorage.getItem('currentUser');
    if (!username) {
        window.location.href = 'index.html';
        return;
    }

    const userRef = db.collection('users').doc(username);
    const userDoc = await userRef.get();
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
    console.log(`Delete Card function called for index: ${index}`); // Debugging
    const username = localStorage.getItem('currentUser');
    const userRef = db.collection('users').doc(username);
    const userDoc = await userRef.get();
    const userCards = userDoc.data()?.cards || [];
    
    userCards.splice(index, 1);
    await userRef.update({ cards: userCards });

    displayCards();
}

// Start game function
async function startGame() {
    console.log("Start Game button clicked"); // Debugging
    const username = localStorage.getItem('currentUser');
    if (!username) {
        alert('You must be logged in to start the game.');
        return;
    }

    const userRef = db.collection('users').doc(username);
    const userDoc = await userRef.get();
    const availableCards = userDoc.data()?.cards.filter(card => !card.used) || [];

    if (availableCards.length < 14) {
        alert('You need at least 14 cards to start the game.');
        return;
    }

    const shuffledCards = availableCards.sort(() => Math.random() - 0.5);
    const gameRef = db.collection('games');
    const newGameDoc = await gameRef.add({ cards: shuffledCards, players: [username] });

    localStorage.setItem('currentGame', newGameDoc.id);
    window.location.href = 'game.html'; // Redirect to game page
}

// Display game cards function
async function displayGameCards() {
    console.log("Display Game Cards function called"); // Debugging
    const gameId = localStorage.getItem('currentGame');
    if (!gameId) {
        window.location.href = 'index.html';
        return;
    }

    const gameRef = db.collection('games').doc(gameId);
    const gameDoc = await gameRef.get();
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

// Ensure the document is fully loaded before attaching event listeners
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded and parsed"); // Debugging

    // Attach event listeners for forms and buttons
    const loginForm = document.getElementById('loginForm');
    if (loginForm) loginForm.addEventListener('submit', (e) => { e.preventDefault(); login(); });

    const registrationForm = document.getElementById('registrationForm');
    if (registrationForm) registrationForm.addEventListener('submit', (e) => { e.preventDefault(); register(); });

    const addCardButton = document.getElementById('addCardButton');
    if (addCardButton) addCardButton.addEventListener('click', addCard);

    const goBackButton = document.getElementById('goBackButton');
    if (goBackButton) goBackButton.addEventListener('click', () => window.location.href = 'main.html');

    const endGameButton = document.getElementById('endGameButton');
    if (endGameButton) endGameButton.addEventListener('click', () => window.location.href = 'main.html');

    const startGameButton = document.getElementById('startGameButton');
    if (startGameButton) startGameButton.addEventListener('click', startGame);

    // Initialize specific page contexts
    if (document.getElementById('addCardsContainer')) {
        displayCards();
    } else if (document.getElementById('gameArea')) {
        displayGameCards();
    } else if (document.getElementById('authScreen')) {
        displayWelcomeMessage();
    }
});
