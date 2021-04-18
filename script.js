const transactionsUl = document.querySelector("#transactions");
const incomeDisplay = document.querySelector("#money-plus");
const expenseDisplay = document.querySelector("#money-minus");
const balanceDisplay = document.querySelector("#balance");
const form = document.querySelector("#form");
const inputTransactionName = document.querySelector("#text");
const inputTransactionAmount = document.querySelector("#amount");

const localStorageTransactions = JSON.parse(localStorage.getItem("transaction"));


let transactions = localStorage.getItem("transaction") !== null ? localStorageTransactions : [];


const removeTransaction = ID => {
    transactions = transactions.filter(transaction => transaction.id !== ID);
    updateLocalStorage();
    init();

};

const addTransactionsInDOM = ({ amount, name, id }) => {

    const operator = amount < 0 ? "-" : "+";
    const CSSClass = amount < 0 ? "minus" : "plus";
    const amountWithoutOperator = Math.abs(amount);
    const li = document.createElement("li");

    li.classList.add(CSSClass);
    li.innerHTML = `${name} <span>${operator} R$${amountWithoutOperator}</span> 
    <button class="delete-btn" onClick="removeTransaction(${id})">x</button>`;

    transactionsUl.append(li);
};

const getExpenses = transactionAmount => {
    return Math.abs(transactionAmount.filter(value => value < 0).reduce((accumulator, value) => accumulator + value, 0)).toFixed(2)
};

const getIncome = transactionAmount => {
    return transactionAmount.filter(value => value > 0).reduce((accumulator, value) => accumulator + value, 0).toFixed(2);
};

const getTotal = transactionAmount => {
    return transactionAmount.reduce((accumulator, transaction) => accumulator + transaction, 0).toFixed(2);
};


const updateBalanceValues = () => {
    const transactionAmount = transactions.map(({ amount }) => amount);
    const total = getTotal(transactionAmount);
    const income = getIncome(transactionAmount);
    const expense = getExpenses(transactionAmount);

    balanceDisplay.textContent = `R$ ${total}`;
    expenseDisplay.textContent = `R$ ${expense}`;
    incomeDisplay.textContent = `R$ ${income}`;

};

const init = () => {
    transactionsUl.innerHTML = "";
    transactions.forEach(addTransactionsInDOM);
    updateBalanceValues();
};


init();

const updateLocalStorage = () => {
    return localStorage.setItem("transaction", JSON.stringify(transactions));
};

const generateID = () => Math.round(Math.random() * 1000);

const addTransactionArray = (transactionName, transactionAmount) => {
    transactions.push({
        id: generateID(),
        name: transactionName,
        amount: Number(transactionAmount)
    });
}

const cleanInputs = () => {
    inputTransactionName.value = "";
    inputTransactionAmount.value = "";
};

const handleFromSubmit = event => {
    event.preventDefault();

    const transactionName = inputTransactionName.value.trim();
    const transactionAmount = inputTransactionAmount.value.trim();
    const IsSomeInputEmpty = inputTransactionName.value.trim() === "" || inputTransactionAmount.value.trim() === "";


    if (IsSomeInputEmpty) {
        alert("Por favor, preencha tanto o nome quanto o valor da transação");
        return;
    }

    addTransactionArray(transactionName, transactionAmount);


    init();
    updateLocalStorage();
    cleanInputs();
}

form.addEventListener("submit", handleFromSubmit);