document.addEventListener('DOMContentLoaded', () => {
    const usernameInput = document.getElementById("search");
    const addName = document.getElementById("search_input");
    // const userDrop = document.getElementById("dropdown-list");
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

   
    addName.addEventListener('click', function(){
        username = usernameInput.value.trim();
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
    const applyDiscountBtn = document.getElementById("apply-discount-btn");
    applyDiscountBtn.addEventListener('click',function(){
        updateBill();
        const clipboarBtn = document.getElementById('copyClipboardBtn');
        clipboarBtn.style.display = "inline";
    })
    function updateBill() {
        amountPaid=0
        totalAmount = items.reduce((sum, item) => sum + item.total, 0);
        amountPaid = parseFloat(amountPaidInput.value) || 0;
        let discount = 0;
      
        if (amountPaid < totalAmount) {
            discount = totalAmount - amountPaid;
        

        totalAmountElement.textContent = `Rs. ${totalAmount.toFixed(2)}`;
        billBreakdownContainer.innerHTML = '';

        const table = document.createElement("table");
        table.classList.add("table", "table-bordered", "table-striped");
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

        items.forEach(item => {
            item.people.forEach(person => {
                const personTotal = item.total / item.people.length;
                const discountedAmount = discount > 0 ? personTotal - (personTotal * (discount / totalAmount)) : personTotal;
                table.innerHTML += `
                    <tr>
                        <td>${person}</td>
                        <td>Rs. ${personTotal.toFixed(2)}</td>
                        <td>Rs. ${discountedAmount.toFixed(2)}</td>
                    </tr>
                `;
            });
        });

        table.innerHTML += `</tbody>`;
        billBreakdownContainer.appendChild(table);
    }else{
        totalAmountElement.textContent = `Rs. ${totalAmount.toFixed(2)}`;
        billBreakdownContainer.innerHTML = '';

        const table = document.createElement("table");
        table.classList.add("table", "table-bordered", "table-striped");
        table.innerHTML = `
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Total Amount</th>
                </tr>
            </thead>
            <tbody>
        `;

        items.forEach(item => {
            item.people.forEach(person => {
                const personTotal = item.total / item.people.length;
                table.innerHTML += `
                    <tr>
                        <td>${person}</td>
                        <td>Rs. ${personTotal.toFixed(2)}</td>
                    </tr>
                `;
            });
        });

        table.innerHTML += `</tbody>`;
        billBreakdownContainer.appendChild(table);
    }
    }
});

function copyTableToClipboard(divId) {
    const div = document.getElementById(divId);
    const clipboarBtn = document.getElementById('copyClipboardBtn');
    if (!div) {
        alert("Div not found!");
        return;
    }
    const table = div.querySelector("table");
    if (!table) {
        alert("Table not found inside the div!");
        return;
    }
    let tableContent = "";
    for (let row of table.rows) {
        let rowData = [];
        for (let cell of row.cells) {
            rowData.push(cell.innerText.trim());
        }
        tableContent += rowData.join("\t") + "\n";
    }
    navigator.clipboard.writeText(tableContent).then(() => {
        clipboarBtn.classList.add("btn-outline-success");
        clipboarBtn.classList.remove("btn-outline-primary");
        clipboarBtn.innerText="Copied"
    }).catch((err) => {
        console.error("Failed to copy table to clipboard: ", err);
        clipboarBtn.classList.remove("btn-outline-primary");
        clipboardBtn.classList.add('btn-outline-danger');
        clipboardBtn.innerText="Error"
    });
}
