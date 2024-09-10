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
        console.error('Registration error:', error);
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
        console.error('Login error:', error);
        message.textContent = 'Invalid email or password!';
        message.style.color = 'red';
    }
}

// Add card function
async function addCard() {
    console.log("Add Card button clicked"); // Debugging
    const cardText = document.getElementById('newCardText').value;
    if (!cardText) return;

    const user = firebase.auth().currentUser;
    if (!user) {
        alert('You must be logged in to add cards.');
        return;
    }

    try {
        const userId = user.uid; // Use Firebase Auth UID
        const userRef = db.collection('users').doc(userId);
        await userRef.update({
            cards: firebase.firestore.FieldValue.arrayUnion({ text: cardText, used: false })
        });
        console.log("Card added successfully"); // Debugging
        displayCards();
    } catch (error) {
        console.error('Add card error:', error);
    }
}


// Display cards with delete option
async function displayCards() {
    console.log("Display Cards function called"); // Debugging
    const cardList = document.getElementById('cardList');
    const email = localStorage.getItem('currentUser');
    if (!email) {
        window.location.href = 'index.html';
        return;
    }

    try {
        const userRef = db.collection('users').doc(email);
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
        console.error('Display cards error:', error);
    }
}

// Delete card function
async function deleteCard(index) {
    const email = localStorage.getItem('currentUser');
    if (!email) {
        alert('You must be logged in to delete cards.');
        return;
    }

    try {
        const userRef = db.collection('users').doc(email);
        const userDoc = await userRef.get();
        const userCards = userDoc.data()?.cards || [];
        userCards.splice(index, 1); // Remove card at index

        await userRef.update({ cards: userCards });
        console.log("Card deleted successfully"); // Debugging
        displayCards();
    } catch (error) {
        console.error('Delete card error:', error);
    }
}

// Event listeners for login and registration
document.getElementById('loginForm').addEventListener('submit', (event) => {
    event.preventDefault();
    login();
});

document.getElementById('registrationForm').addEventListener('submit', (event) => {
    event.preventDefault();
    register();
});

// Event listeners for adding cards
document.getElementById('addCardButton').addEventListener('click', addCard);

// Event listener for goBackButton on add-cards.html
document.getElementById('goBackButton')?.addEventListener('click', () => {
    window.location.href = 'main.html'; // Redirect to main page
});

// Event listener for startGameButton on main.html
document.getElementById('startGameButton')?.addEventListener('click', () => {
    window.location.href = 'game.html'; // Redirect to game page
});
