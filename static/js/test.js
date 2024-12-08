document.addEventListener('DOMContentLoaded', () => {
    const usernameInput = document.getElementById("search");
    const addName = document.getElementById("search_input");
    const nameContainer = document.getElementById("name-container");
    const itemNameInput = document.getElementById('item-name');
    const itemQuantityInput = document.getElementById('item-quantity');
    const itemPriceInput = document.getElementById('item-price');
    const addItemButton = document.getElementById('add-item-btn');
    const itemContainer = document.getElementById('item-container');
    const totalAmountElement = document.getElementById('total-amount');
    const amountPaidInput = document.getElementById('amount-paid');
    const billBreakdownContainer = document.getElementById('bill-breakdown');
    const billSummaryRow = document.getElementById('bill-summary-row');
    let peopleList = [];
    const items = [];
    usernameInput.focus();
   usernameInput.addEventListener("keypress",function(event){
    if(event.key === "Enter"){
        addName.click();
    }
   })
   itemNameInput.addEventListener('keypress',function(event){
    if(event.key==="Enter"){
        itemQuantityInput.focus();
    }
   })
   itemQuantityInput.addEventListener('keypress',function(event){
    if(event.key==='Enter'){
        itemPriceInput.focus();
    }
   })
   itemPriceInput.addEventListener("keypress",function(event){
    if(event.key==='Enter'){
        addItemButton.click();
    }
   })
    addName.addEventListener('click', function(){
        str= usernameInput.value.trim();
        username = str.charAt(0).toUpperCase() + str.slice(1)
        usernameInput.value="";
        usernameInput.focus();
        addNameToContainer(username);
    })
    const addNameToContainer = (name) => {
        const div = document.createElement("div");
        div.classList.add("name-item", "badge", "bg-primary", "text-white", "p-2", "m-2", "d-inline-flex", "align-items-center", "gap-2", "me-2");
        div.textContent = name;
        div.setAttribute('draggable', true);
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "×";
        deleteBtn.classList.add("btn", "btn-sm", "btn-danger", "ms-2");
        deleteBtn.addEventListener("click", () => {
            div.remove();
            peopleList = peopleList.filter(person => person !== name);
            items.forEach(item => {
                const index = item.people.indexOf(name);
                if (index !== -1) {
                    item.people.splice(index, 1);
                }
            });
            updateItemList();
        });
        div.appendChild(deleteBtn);
        nameContainer.appendChild(div);
        div.addEventListener("dragstart", (event) => {
            event.dataTransfer.setData('text', name);
        });
        peopleList.push(name);
        display_select(peopleList);
    };
    addItemButton.addEventListener("click", () => {
        const name = itemNameInput.value.trim();
        const quantity = parseInt(itemQuantityInput.value.trim(), 10);
        const price = parseFloat(itemPriceInput.value.trim());
        if (name && !isNaN(quantity) && quantity > 0 && !isNaN(price) && price > 0) {
            const total = quantity * price;
            items.push({ name, quantity, price, total, people: [] });
            updateItemList();
            if (items.length > 0) {
                billSummaryRow.style.display = "block"; 
            }
            itemNameInput.value = '';
            itemQuantityInput.value = '';
            itemPriceInput.value = '';
            itemNameInput.focus();
        } else {
            alert("Please enter valid values for all fields.");
        }
    });
    function updateItemList() {
        itemContainer.innerHTML = '';
        items.forEach((item, index) => {
            const itemDiv = document.createElement("div");
            itemDiv.classList.add("item", "mb-3");
            itemDiv.dataset.id = index;
            itemDiv.innerHTML = `
                <div class="d-flex justify-content-between align-items-center">
                    <span><strong>${item.name}</strong> - Quantity: <input type="number" value="${item.quantity}" class="quantity-input" style="width: 60px; text-align: center;"> Price: Rs. <input type="number" value="${item.price}" class="price-input" style="width: 80px; text-align: center;"> 
                    <span class="badge bg-info">Total: Rs. <span class="total-price">${item.total.toFixed(2)}</span></span>
                    </span>
                    <button class="btn btn-danger btn-sm" onclick="deleteItem(${index})">×</button>
                </div>
                <div class="mt-2" id="item-${index}-people">
                    <div class="text-muted">Assigned People:</div>
                    <div class="assigned-names" id="assigned-names-${index}" style="display: flex; flex-wrap: wrap; gap: 8px;"></div>
                    <div class="text-muted mt-2">Drag people here:</div>
                    <div class="drop-area" id="drop-area-${index}" style="min-height: 40px; border: 1px dashed #ccc;"></div>
                </div>
            `;
            itemContainer.appendChild(itemDiv);
            const quantityInput = itemDiv.querySelector(".quantity-input");
            const priceInput = itemDiv.querySelector(".price-input");
            quantityInput.addEventListener("change", (e) => {
                item.quantity = parseInt(e.target.value, 10);
                item.total = item.quantity * item.price;
                updateItemList();
            });
            priceInput.addEventListener("change", (e) => {
                item.price = parseFloat(e.target.value);
                item.total = item.quantity * item.price;
                updateItemList();
            });
            const dropArea = document.getElementById(`drop-area-${index}`);
            makeDropAreaDraggable(dropArea, index);
        });
        updateAssignedNames();
    }
    function makeDropAreaDraggable(dropArea, index) {
        dropArea.addEventListener("dragover", (event) => {
            event.preventDefault();
        });
        dropArea.addEventListener("drop", (event) => {
            event.preventDefault();
            const name = event.dataTransfer.getData('text');
            const item = items[index];

            if (name && !item.people.includes(name)) {
                item.people.push(name);
                updateItemList();
                updateBill();
            }
        });
    }
    function updateAssignedNames() {
        items.forEach((item, index) => {
            const assignedNamesContainer = document.getElementById(`assigned-names-${index}`);
            assignedNamesContainer.innerHTML = '';
            item.people.forEach((person) => {
                const nameTag = document.createElement("span");
                nameTag.classList.add("badge", "bg-success", "text-white", "p-2", "me-2");
                nameTag.textContent = person;
                assignedNamesContainer.appendChild(nameTag);
            });
        });
    }
    window.deleteItem = function (index) {
        items.splice(index, 1);
        updateItemList();
        if (items.length === 0) {
            billSummaryRow.style.display = "none";
        }
    };
    amountPaidInput.addEventListener('keypress',function(event){
        if(event.key==="Enter"){
            applyDiscountBtn.click();
        }
    })
    const applyDiscountBtn = document.getElementById("apply-discount-btn");
    applyDiscountBtn.addEventListener('click',function(){
        updateBill();
        const clipboarBtn = document.getElementById('copyClipboardBtn');
        clipboarBtn.style.display = "inline";
    })
    amountPaidInput.addEventListener("keypress",function(event){
    if(event.key === "Enter"){
        applyDiscountBtn.click();
    }
   })
    function updateBill() {
        const totalAmount = items.reduce((sum, item) => sum + item.total, 0);
        const amountPaid = parseFloat(amountPaidInput.value) || 0;
        let discount = 0;
        if (amountPaid < totalAmount) {
            discount = totalAmount - amountPaid;
        totalAmountElement.textContent = `Rs. ${totalAmount.toFixed(2)}`;
        billBreakdownContainer.innerHTML = '';
        const table = document.createElement("table");
        table.classList.add("table", "table-bordered", "table-striped");
        table.setAttribute("id","final_bill_table");
        table.innerHTML = `
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Total Amount</th>
                    <th>Discounted Amount</th>
                </tr>
            </thead>
            <tbody>
        `;
        const personTotals = {};
        items.forEach(item => {
            const perPersonAmount = item.total / item.people.length;
    
            item.people.forEach(person => {
                if (!personTotals[person]) {
                    personTotals[person] = 0;
                }
                personTotals[person] += perPersonAmount;
            });
        });
        for (const [person, total] of Object.entries(personTotals)) {
            const discountedAmount = discount > 0 ? total - (total * (discount / totalAmount)) : total;
            table.innerHTML += `
                <tr>
                    <td>${person}</td>
                    <td>Rs. ${total.toFixed(2)}</td>
                    <td>Rs. ${discount > 0 ? discountedAmount.toFixed(2) : '-'}</td>
                </tr>
            `;
        }
        table.innerHTML += `</tbody>`;
        billBreakdownContainer.appendChild(table);
    } else {
        totalAmountElement.textContent = `Rs. ${totalAmount.toFixed(2)}`;
        billBreakdownContainer.innerHTML = '';
    
        const table = document.createElement("table");
        table.classList.add("table", "table-bordered", "table-striped");
        table.setAttribute("id", "final_bill_table")
        table.innerHTML = `
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Total Amount</th>
                </tr>
            </thead>
            <tbody>
        `;
        const personTotals = {};
        items.forEach(item => {
            const perPersonAmount = item.total / item.people.length;
            item.people.forEach(person => {
                if (!personTotals[person]) {
                    personTotals[person] = 0;
                }
                personTotals[person] += perPersonAmount;
            });
        });
        for (const [person, total] of Object.entries(personTotals)) {
            table.innerHTML += `
                <tr>
                    <td>${person}</td>
                    <td>Rs. ${total.toFixed(2)}</td>
                </tr>
            `;
        }
        table.innerHTML += `</tbody>`;
        billBreakdownContainer.appendChild(table);
            }
    }
        
});

function copyTableToClipboard() {
    
    const totalamt = document.getElementById('amount-paid').value;
    const table = document.getElementById("final_bill_table");
    const payee = document.getElementById("payer-select").value;
    const pretext = "Today's Total: Rs. " + totalamt;
    const posttext = "Payment to: " + payee;
    const tempDiv = document.createElement('div');
    document.body.appendChild(tempDiv);
    tempDiv.innerHTML = "";
    if (table) {
        tempDiv.innerHTML = `<p>${pretext}</p><br />`;
        const tableClone = table.cloneNode(true);
        tempDiv.appendChild(tableClone);
        tempDiv.innerHTML += `<br /><p>${posttext}</p>`;
        const range = document.createRange();
        const selection = window.getSelection();
        range.selectNodeContents(tempDiv);
        selection.removeAllRanges();
        selection.addRange(range);

        try {
            document.execCommand('copy');
            startTimer("yes");
        } catch (err) {
        console.error("Error copying data to clipboard:", err);
            startTimer("no");
        } finally {
            document.body.removeChild(tempDiv);
            selection.removeAllRanges();
        }
    } else {
        console.error("Table with ID 'final_bill_table' not found.");
    }
}
function startTimer(copied) {
    const clipboardBtn = document.getElementById('copyClipboardBtn');
    if (copied = "yes"){
        clipboardBtn.classList.add("btn-outline-success");
        clipboardBtn.classList.remove("btn-outline-primary");
        clipboardBtn.innerText = "Copied!";
    }else{
            clipboardBtn.classList.remove("btn-outline-primary");
            clipboardBtn.classList.add("btn-outline-danger");
            clipboardBtn.innerText = "Error";
    }
    setTimeout(function() {
        clipboardBtn.classList.add("btn-outline-primary");
        clipboardBtn.classList.remove("btn-outline-success");
        clipboardBtn.innerText = "Copy Table";
    }, 2000);
}

function display_select(peopleList) {
    const payer_div = document.getElementById("payer");
    payer_div.innerHTML="";
    const payer = document.createElement("select");
    payer.classList.add("form-select", "form-select-sm");
    payer.setAttribute("id","payer-select");
    for (const person of peopleList) {
        const option = document.createElement("option");
        option.setAttribute("value", person);
        option.innerHTML = person;
        payer.appendChild(option);
    }
    console.log("executed");
    payer_div.appendChild(payer);
}
