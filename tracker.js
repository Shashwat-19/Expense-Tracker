let expenseChart = null;

// Loading Screen
window.addEventListener("load", () => {
    const loader = document.getElementById("loading-screen");
    setTimeout(() => {
        loader.style.opacity = "0";
        setTimeout(() => {
            loader.style.display = "none";
        }, 800); 
    }, 1500); 
});

// Tab Switching
window.switchTab = (tab) => {
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    
    document.getElementById(`${tab}-tab`).classList.add('active');
    // Find button that calls this tab (approximate)
    const buttons = document.querySelectorAll('.tab-btn');
    if (tab === 'budget') buttons[0].classList.add('active');
    else buttons[1].classList.add('active');
}

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

    // Initialize Chart
    const ctx = document.getElementById('expenseChart').getContext('2d');
    expenseChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Expenses', 'Remaining Balance'],
            datasets: [{
                data: [0, 100],
                backgroundColor: ['#ef4444', '#10b981'],
                borderWidth: 0,
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { color: '#94a3b8' }
                }
            }
        }
    });

    const updateChart = (expenses, total) => {
        if (!expenseChart) return;
        
        try {
            const balance = total - expenses;
            if (total === 0) {
                 expenseChart.data.datasets[0].data = [0, 100]; // Default empty state
                 expenseChart.data.datasets[0].backgroundColor = ['#334155', '#334155'];
            } else {
                 // If balance is negative, show full red
                 const chartBalance = balance < 0 ? 0 : balance;
                 const chartExpense = expenses;
                 
                 expenseChart.data.datasets[0].data = [chartExpense, chartBalance];
                 expenseChart.data.datasets[0].backgroundColor = ['#ef4444', '#10b981'];
            }
            expenseChart.update();
        } catch (e) {
            console.error("Error updating chart:", e);
        }
    };

    // Check login state safely
    try {
        const isLoggedIn = localStorage.getItem('loggedIn') === 'true';
        const logoutBtn = document.getElementById('logout-btn');
        const guestBtn = document.getElementById('guest-login-btn');
        
        if (isLoggedIn) {
            if(logoutBtn) logoutBtn.style.display = 'inline-block';
            if(guestBtn) guestBtn.style.display = 'none';
        } else {
            if(logoutBtn) logoutBtn.style.display = 'none';
            if(guestBtn) guestBtn.style.display = 'inline-block';
        }
    } catch(e) {
        console.error("Error checking login status:", e);
    }

    // Load from localStorage
    const loadFromLocalStorage = () => {
        try {
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
    
            const currentExp = parseInt(expenditureValue.innerText) || 0;
            balanceValue.innerText = tempAmount - currentExp;
    
            updateChart(currentExp, tempAmount);
            savedList.forEach(item => listCreator(item.title, item.amount));
        } catch(e) {
            console.error("Error loading from local storage", e);
            // localStorage.clear(); // Clear corrupt data? Only if essential
        }
    };

    const saveToLocalStorage = () => {
        try {
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
            
            // Update Chart on Save
            updateChart(parseInt(expenditureValue.innerText), tempAmount);
        } catch(e) { console.error("Error saving", e); }
    };

    // Budget Logic
    if (totalAmountButton) {
        totalAmountButton.addEventListener("click", () => {
            tempAmount = totalAmount.value;
            if (tempAmount === "" || tempAmount < 0) {
                errorMessage.classList.remove("hide-error");
                errorMessage.textContent = "Invalid budget amount.";
            } else {
                errorMessage.classList.add("hide-error");
                amount.innerHTML = tempAmount;
                balanceValue.innerHTML = tempAmount - parseInt(expenditureValue.innerText);
                totalAmount.value = "";
                saveToLocalStorage();
            }
        });
    }

    if (addBudgetButton) {
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
    }

    // List & Expense Logic
    const disableButtons = (bool) => {
        let editButtons = document.getElementsByClassName("action-btn edit");
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
            switchTab('expense'); // Switch to expense tab for editing
        }

        balanceValue.innerText = parseInt(currentBalance) + parseInt(parentAmount);
        expenditureValue.innerText = parseInt(currentExpense) - parseInt(parentAmount);
        parentDiv.remove();
        saveToLocalStorage();
    };

    const listCreator = (expenseName, expenseValue) => {
        let sublistContent = document.createElement("div");
        sublistContent.classList.add("sublist-content");
        sublistContent.innerHTML = `
            <p class="product">${expenseName}</p>
            <p class="amount">${expenseValue}</p>
        `;

        let editButton = document.createElement("button");
        editButton.className = "action-btn edit";
        editButton.innerHTML = '<i class="fa-solid fa-pen-to-square"></i>';
        editButton.addEventListener("click", () => modifyElement(editButton, true));

        let deleteButton = document.createElement("button");
        deleteButton.className = "action-btn delete";
        deleteButton.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
        deleteButton.addEventListener("click", () => modifyElement(deleteButton));

        sublistContent.appendChild(editButton);
        sublistContent.appendChild(deleteButton);
        list.appendChild(sublistContent);
    };

    if (checkAmountButton) {
        checkAmountButton.addEventListener("click", () => {
            if (!userAmount.value || userAmount.value < 0) {
                alert("Enter a valid expense amount");
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
            saveToLocalStorage();
        });
    }

    const resetButton = document.getElementById("reset-button");
    if (resetButton) {
        resetButton.addEventListener("click", () => {
            if(confirm("Are you sure you want to reset all data?")) {
                localStorage.clear();
                amount.innerText = 0;
                expenditureValue.innerText = 0;
                balanceValue.innerText = 0;
                list.innerHTML = "";
                productTittle.value = "";
                userAmount.value = "";
                totalAmount.value = "";
                tempAmount = 0;
                updateChart(0, 0);
            }
        });
    }

    // Initial Load
    loadFromLocalStorage();

    // Theme Toggle Logic
    const themeToggleBtn = document.getElementById('theme-toggle');
    const body = document.body;
    const icon = themeToggleBtn.querySelector('i');

    const applyTheme = (theme) => {
        if (theme === 'light') {
            body.classList.add('light-mode');
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
            if (expenseChart) {
                expenseChart.options.plugins.legend.labels.color = '#1e293b';
                expenseChart.update();
            }
        } else {
            body.classList.remove('light-mode');
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
            if (expenseChart) {
                expenseChart.options.plugins.legend.labels.color = '#94a3b8';
                expenseChart.update();
            }
        }
    };

    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        applyTheme(savedTheme);
    }

    themeToggleBtn.addEventListener('click', () => {
        const isLight = body.classList.toggle('light-mode');
        const newTheme = isLight ? 'light' : 'dark';
        
        applyTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    });

    // Handle button text color in light mode for dynamic contrast
    // (CSS variables handle most, but just to be safe for chart)
    const originalUpdateChart = updateChart; // Hook into existing function if needed
    // But chart colors are hardcoded... let's update chart colors dynamically?
    // For now, let's just stick to the CSS variables.
});
