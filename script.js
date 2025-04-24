let totalAmount = document.getElementById("total-amount");
let userAmount = document.getElementById("user-amount");
const checkAmountButton = document.getElementById("check-amount");
const totalAmountButton = document.getElementById("total-amount-button");
const productTittle = document.getElementById("product-title");
const errorMessage = document.getElementById("budget-error");
const productTittleError = document.getElementById("product-title-error");
const productCostError = document.getElementById("product-cost-error");
const amount = document.getElementById("amount");
const expenditureValue = document.getElementById("expenditure-value");
const balanceValue = document.getElementById("balance-amount");
const list = document.getElementById("list");

let tempAmount = 0;

//Set Budget
totalAmountButton.addEventListener("click", ()=>{
    tempAmount = totalAmount.value;
    //empty or negative value
    if(tempAmount === "" || tempAmount < 0){
        errorMessage.classList.remove("hide");
    }else{
        errorMessage.classList.add("hide");
        //set budget
        amount.innerHTML = tempAmount;
        //set balance
        balanceValue.innerHTML = tempAmount - expenditureValue.innerText;
        //clear input box
        totalAmount.value = ""; 
    }
});

//Function to disable edit and delete option
const disableButtons = (bool) => {
    let editButtons = document.getElementsByClassName("edit");
    Array.from(editButtons).forEach(element => {
        element.disabled = bool;
    })
}

//Function to modify list elements
const modifyElement = (element, edit=false) => {
    let parentDiv = element.parentElement;
    let currentBalance = balanceValue.innerText;
    let currentExpense = expenditureValue.innerText;
    let parentAmount = parentDiv.querySelector(".amount").innerText;
    if(edit){
        let parentTet = parentDiv.querySelector(".product").innerText;
        productTittle.value = parentTet;
        userAmount.value = parentAmount;
        disableButtons(true);
    }
    balanceValue.innerText = parseInt(currentBalance) + parseInt(parentAmount);
    expenditureValue.innerText = parseInt(currentExpense) - parseInt(parentAmount);
    parentDiv.remove();
};

//Function to create list elements
const listCreator = (expenseName, expenseValue) => {
    let sublistContent = document.createElement("div");
    sublistContent.classList.add("sublist-content", "flex-space");
    //list.appendChild(sublistContent);
    sublistContent.innerHTML = `
    <p class="product">${expenseName}</p>
    <p class="amount">${expenseValue}</p>
    `;
    let editButton = document.createElement("button");
    editButton.classList.add("fa-solid", "fa-pen-to-square", "edit");
    editButton.style.fontSize = "24px";
    editButton.addEventListener("click", () => {
        modifyElement(editButton, true);
    })
    let deleteButton = document.createElement("button");
    deleteButton.classList.add("fa-solid", "fa-trash-can", "delete");
    deleteButton.style.fontSize = "24px";
    deleteButton.addEventListener("click", () => {
        modifyElement(deleteButton);
    })
    sublistContent.appendChild(editButton);
    sublistContent.appendChild(deleteButton);
    list.appendChild(sublistContent); // Append to list
};

//Function to calculate Expense
checkAmountButton.addEventListener("click", () => {
    //empty or negative value
    if(!userAmount.value || userAmount.value < 0){
        productCostError.classList.remove("hide");
        return false;
    }
    disableButtons(false);
    let expenditure = parseInt(userAmount.value);
    let sum = parseInt(expenditureValue.innerText) + expenditure;
    expenditureValue.innerText = sum;
    //total balance
    const totalBalance = tempAmount - sum;
    balanceValue.innerText = totalBalance; 
    listCreator(productTittle.value, userAmount.value);
    productTittle.value = "";
    userAmount.value = "";
});
