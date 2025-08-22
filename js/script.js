// --- 1. Seleccionar Elementos del DOM ---
const balance = document.getElementById('balance');
const money_plus = document.getElementById('money-plus');
const money_minus = document.getElementById('money-minus');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');

// --- 2. Cargar transacciones desde Local Storage o usar un array vacío ---
const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'));
let transactions = localStorage.getItem('transactions') !== null ? localStorageTransactions : [];

// --- 3. Función para Añadir Transacción ---
function addTransaction(e) {
    e.preventDefault(); // Evita que el formulario se envíe y recargue la página

    if (text.value.trim() === '' || amount.value.trim() === '') {
        alert('Por favor, añade una descripción y una cantidad');
    } else {
        const transaction = {
            id: generateID(),
            text: text.value,
            amount: +amount.value // Convierte el string a número
        };

        transactions.push(transaction); // Añade la nueva transacción al array
        addTransactionDOM(transaction); // Añade la transacción al DOM
        updateValues(); // Actualiza los balances
        updateLocalStorage(); // Actualiza el Local Storage

        text.value = ''; // Limpia los inputs
        amount.value = '';
    }
}

// --- 4. Generar un ID único ---
function generateID() {
    return Math.floor(Math.random() * 100000000);
}

// --- 5. Añadir Transacciones al DOM (a la lista) ---
function addTransactionDOM(transaction) {
    // Determina si es un ingreso o un gasto
    const sign = transaction.amount < 0 ? '-' : '+';
    const item = document.createElement('li');

    // Añade la clase 'minus' o 'plus' según corresponda
    item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');

    item.innerHTML = `
        ${transaction.text} <span>${sign}${Math.abs(transaction.amount).toFixed(2)}€</span>
        <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
    `;
    list.appendChild(item);
}

// --- 6. Actualizar el Balance, Ingresos y Gastos ---
function updateValues() {
    const amounts = transactions.map(transaction => transaction.amount);

    const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);
    const income = amounts
        .filter(item => item > 0)
        .reduce((acc, item) => (acc += item), 0)
        .toFixed(2);
    const expense = (amounts
        .filter(item => item < 0)
        .reduce((acc, item) => (acc += item), 0) * -1)
        .toFixed(2);

    balance.innerText = `${total}€`;
    money_plus.innerText = `+${income}€`;
    money_minus.innerText = `-${expense}€`;
}

// --- 7. Eliminar Transacción por ID ---
function removeTransaction(id) {
    transactions = transactions.filter(transaction => transaction.id !== id);
    updateLocalStorage();
    init(); // Vuelve a inicializar la app para actualizar el DOM
}

// --- 8. Actualizar Local Storage con las transacciones ---
function updateLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

// --- 9. Función de Inicialización ---
function init() {
    list.innerHTML = ''; // Limpia la lista del DOM
    transactions.forEach(addTransactionDOM); // Carga cada transacción en el DOM
    updateValues(); // Actualiza los balances
}

// --- 10. Event Listeners ---
form.addEventListener('submit', addTransaction);

// --- Inicializar la aplicación ---
init();