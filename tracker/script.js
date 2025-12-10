window.addEventListener("load", () => {
    const loader = document.getElementById("loading-screen");

    setTimeout(() => {
      loader.style.opacity = "0";

      setTimeout(() => {
        loader.style.display = "none";
      }, 800); // match transition duration
    }, 1500); 
});
 
document.addEventListener("DOMContentLoaded", () => {
    let totalAmount = document.getElementById("total-amount");
    let userAmount = document.getElementById("user-amount");
    const checkAmountButton = document.getElementById("check-amount");
    const totalAmountButton = document.getElementById("total-amount-button");
    const addBudgetButton = document.getElementById("add-budget-button");

    const productTittle = document.getElementById("product-tittle");

    const errorMessage = document.getElementById("budget-error");
    const amount = document.getElementById("amount");
    const expenditureValue = document.getElementById("expenditure-value");
    const balanceValue = document.getElementById("balance-amount");
    const list = document.getElementById("list");

    let tempAmount = 0;

    // Check login state
    const isLoggedIn = localStorage.getItem('loggedIn') === 'true';
    if (isLoggedIn) {
        document.getElementById('logout-btn').style.display = 'inline-block';
    } else {
        document.getElementById('guest-login-btn').style.display = 'inline-block';
    }

    // Load from localStorage on load
    const loadFromLocalStorage = () => {
        const savedBudget = localStorage.getItem("budget");
        const savedExpense = localStorage.getItem("expense");
        const savedList = JSON.parse(localStorage.getItem("expenseList")) || [];

        if (savedBudget) {
            amount.innerText = savedBudget;
            tempAmount = parseInt(savedBudget);
        }

        if (savedExpense) {
            expenditureValue.innerText = savedExpense;
        }

        balanceValue.innerText = tempAmount - parseInt(expenditureValue.innerText);

        savedList.forEach(item => listCreator(item.title, item.amount));
    };

    const saveToLocalStorage = () => {
        localStorage.setItem("budget", tempAmount);
        localStorage.setItem("expense", expenditureValue.innerText);
        const expenses = [];
        document.querySelectorAll(".sublist-content").forEach(div => {
            expenses.push({
                title: div.querySelector(".product").innerText,
                amount: div.querySelector(".amount").innerText
            });
        });
        localStorage.setItem("expenseList", JSON.stringify(expenses));
    };

    totalAmountButton.addEventListener("click", () => {
        tempAmount = totalAmount.value;
        if (tempAmount === "" || tempAmount < 0) {
            errorMessage.classList.remove("hide-error");
            errorMessage.textContent = "Invalid budget amount.";
        } else {
            errorMessage.classList.add("hide-error");
            amount.innerHTML = tempAmount;
            balanceValue.innerHTML = tempAmount - expenditureValue.innerText;
            totalAmount.value = "";
            saveToLocalStorage();
        }
    });

    addBudgetButton.addEventListener("click", () => {
        let additionalAmount = parseInt(totalAmount.value);
        if (isNaN(additionalAmount) || additionalAmount <= 0) {
            errorMessage.classList.remove("hide-error");
            errorMessage.textContent = "Enter a valid amount to add.";
        } else {
            errorMessage.classList.add("hide-error");
            tempAmount = parseInt(amount.innerText) + additionalAmount;
            amount.innerText = tempAmount;
            balanceValue.innerText = tempAmount - parseInt(expenditureValue.innerText);
            totalAmount.value = "";
            saveToLocalStorage();
        }
    });
    

    const disableButtons = (bool) => {
        let editButtons = document.getElementsByClassName("edit");
        Array.from(editButtons).forEach(element => {
            element.disabled = bool;
        });
    };

    const modifyElement = (element, edit = false) => {
        let parentDiv = element.parentElement;
        let currentBalance = balanceValue.innerText;
        let currentExpense = expenditureValue.innerText;
        let parentAmount = parentDiv.querySelector(".amount").innerText;

        if (edit) {
            let parentTitle = parentDiv.querySelector(".product").innerText;
            productTittle.value = parentTitle;
            userAmount.value = parentAmount;
            disableButtons(true);
        }

        balanceValue.innerText = parseInt(currentBalance) + parseInt(parentAmount);
        expenditureValue.innerText = parseInt(currentExpense) - parseInt(parentAmount);
        parentDiv.remove();
        saveToLocalStorage();
    };

    const listCreator = (expenseName, expenseValue) => {
        let sublistContent = document.createElement("div");
        sublistContent.classList.add("sublist-content", "flex-space");
        sublistContent.innerHTML = `
            <p class="product">${expenseName}</p>
            <p class="amount">${expenseValue}</p>
        `;

        let editButton = document.createElement("button");
        editButton.classList.add("fa-solid", "fa-pen-to-square", "edit");
        editButton.style.fontSize = "24px";
        editButton.addEventListener("click", () => modifyElement(editButton, true));

        let deleteButton = document.createElement("button");
        deleteButton.classList.add("fa-solid", "fa-trash-can", "delete");
        deleteButton.style.fontSize = "24px";
        deleteButton.addEventListener("click", () => modifyElement(deleteButton));

        sublistContent.appendChild(editButton);
        sublistContent.appendChild(deleteButton);
        list.appendChild(sublistContent);
    };

    checkAmountButton.addEventListener("click", () => {
        if (!userAmount.value || userAmount.value < 0) {
            errorMessage.classList.remove("hide-error");
            errorMessage.textContent = "Enter a valid expense amount.";
            return false;
        }

        disableButtons(false);
        let expenditure = parseInt(userAmount.value);
        let sum = parseInt(expenditureValue.innerText) + expenditure;
        expenditureValue.innerText = sum;
        balanceValue.innerText = tempAmount - sum;

        listCreator(productTittle.value, userAmount.value);
        productTittle.value = "";
        userAmount.value = "";
        errorMessage.classList.add("hide-error");
        saveToLocalStorage();
    });

    const resetButton = document.getElementById("reset-button");

    resetButton.addEventListener("click", () => {
        localStorage.clear();
        amount.innerText = 0;
        expenditureValue.innerText = 0;
        balanceValue.innerText = 0;
        list.innerHTML = "";
        productTittle.value = "";
        userAmount.value = "";
        totalAmount.value = "";
    });

    // Load data initially
    loadFromLocalStorage();
});
