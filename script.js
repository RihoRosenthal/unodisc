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
    const email = document.getElementById('regEmail').value.trim(); // Trim whitespace
    const password = document.getElementById('regPassword').value;
    const verifyPassword = document.getElementById('regVerifyPassword').value;
    const message = document.getElementById('regMessage');

    if (password !== verifyPassword) {
        message.textContent = 'Passwords do not match!';
        message.style.color = 'red';
        return;
    }

    try {
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const userId = userCredential.user.uid;
        const userRef = db.collection('users').doc(email); // Using email as user ID
        await userRef.set({ cards: [] });
        message.textContent = 'Registration successful!';
        message.style.color = 'green';
    } catch (error) {
        console.error('Registration error:', error.message);
        message.textContent = error.message;
        message.style.color = 'red';
    }
}

// Login function
async function login() {
    const email = document.getElementById('loginEmail').value.trim(); // Trim whitespace
    const password = document.getElementById('loginPassword').value;
    const message = document.getElementById('loginMessage');

    if (!email || !password) {
        message.textContent = 'Please enter both email and password!';
        message.style.color = 'red';
        return;
    }

    try {
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        const userId = userCredential.user.uid;
        localStorage.setItem('currentUser', email); // Use email as user ID
        window.location.href = 'main.html'; // Redirect to main page
    } catch (error) {
        console.error('Login error:', error.message);
        message.textContent = 'Invalid email or password!';
        message.style.color = 'red';
    }
}

// Add card function
async function addCard() {
    const cardText = document.getElementById('newCardText').value.trim(); // Trim whitespace
    if (!cardText) return;

    const userEmail = localStorage.getItem('currentUser');
    if (!userEmail) {
        alert('You must be logged in to add cards.');
        return;
    }

    try {
        const userRef = db.collection('users').doc(userEmail);
        await userRef.update({
            cards: firebase.firestore.FieldValue.arrayUnion({ text: cardText, used: false })
        });
        displayCards();
    } catch (error) {
        console.error('Add card error:', error.message);
    }
}

// Display cards with delete option
async function displayCards() {
    const cardList = document.getElementById('cardList');
    const userEmail = localStorage.getItem('currentUser');
    if (!userEmail) {
        window.location.href = 'index.html';
        return;
    }

    try {
        const userRef = db.collection('users').doc(userEmail);
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
    } catch (error) {
        console.error('Display cards error:', error.message);
    }
}

// Delete card function
async function deleteCard(index) {
    const userEmail = localStorage.getItem('currentUser');
    if (!userEmail) {
        alert('You must be logged in to delete cards.');
        return;
    }

    try {
        const userRef = db.collection('users').doc(userEmail);
        const userDoc = await userRef.get();
        const userCards = userDoc.data()?.cards || [];
        userCards.splice(index, 1); // Remove card at index

        await userRef.update({ cards: userCards });
        displayCards();
    } catch (error) {
        console.error('Delete card error:', error.message);
    }
}

// Start game function
async function startGame() {
    const userEmail = localStorage.getItem('currentUser');
    if (!userEmail) {
        alert('You must be logged in to start the game.');
        return;
    }

    try {
        const userRef = db.collection('users').doc(userEmail);
        const userDoc = await userRef.get();
        const userCards = userDoc.data()?.cards || [];

        if (userCards.length < 14) {
            alert('You need at least 14 cards to start the game.');
            return;
        }

        const selectedCards = [];
        while (selectedCards.length < 14) {
            const randomIndex = Math.floor(Math.random() * userCards.length);
            if (!selectedCards.includes(userCards[randomIndex])) {
                selectedCards.push(userCards[randomIndex]);
            }
        }

        localStorage.setItem('selectedCards', JSON.stringify(selectedCards));
        window.location.href = 'game.html'; // Redirect to game page
    } catch (error) {
        console.error('Start game error:', error.message);
    }
}

// End game function
function endGame() {
    localStorage.removeItem('selectedCards');
    window.location.href = 'main.html'; // Redirect to main page
}

// View cards function
function viewCards() {
    window.location.href = 'add-cards.html'; // Redirect to add cards page
}

// Event listeners
document.getElementById('addCardButton')?.addEventListener('click', addCard);
document.getElementById('goBackButton')?.addEventListener('click', () => window.location.href = 'main.html');
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
