document.addEventListener('DOMContentLoaded', () => {
    const personNameInput = document.getElementById('personName');
    const addPersonButton = document.getElementById('addPerson');
    const peopleList = document.getElementById('peopleList');
    const itemNameInput = document.getElementById('itemName');
    const itemPriceInput = document.getElementById('itemPrice');
    const addItemButton = document.getElementById('addItem');
    const itemList = document.getElementById('itemList');
    const totalAmountSpan = document.getElementById('totalAmount');
    const totalPaymentInput = document.getElementById('totalPayment');
    const calculateBillButton = document.getElementById('calculateBill');
    const resultDiv = document.getElementById('result');

    let people = [];
    let items = [];

    addPersonButton.addEventListener('click', () => {
      const name = personNameInput.value.trim();
      if (name && !people.find(person => person.name === name)) {
        people.push({ name });
        updatePeopleList();
        personNameInput.value = '';
      }
    });

    addItemButton.addEventListener('click', () => {
      const name = itemNameInput.value.trim();
      const price = parseFloat(itemPriceInput.value.trim());
      if (name && !isNaN(price) && price > 0) {
        items.push({ name, price, people: [] });
        updateItemList();
        itemNameInput.value = '';
        itemPriceInput.value = '';
      }
    });

    function updatePeopleList() {
      peopleList.innerHTML = people.map((person, index) =>
        `<div class="drag-item" data-id="${index}" draggable="true">
          ${person.name} <span class="delete-person" onclick="deletePerson(${index})">X</span>
        </div>`
      ).join('');
      setupDragAndDrop();
    }

    function updateItemList() {
      itemList.innerHTML = items.map((item, index) =>
        `<div class="item col-md-6" data-id="${index}">
          <h5>${item.name}</h5>
          <input type="number" class="form-control mb-2 item-price" placeholder="Price" value="${item.price.toFixed(2)}" onchange="updateItemPrice(${index}, this.value)">
          <div class="item-people-list" data-id="${index}"></div>
        </div>`
      ).join('');
      items.forEach((item, index) => updateItemPeopleList(index));
      setupDragAndDrop();
      updateTotalAmount();
    }

    function setupDragAndDrop() {
      const dragItems = document.querySelectorAll('.drag-item');
      dragItems.forEach(item => {
        item.addEventListener('dragstart', handleDragStart);
      });

      const itemElements = document.querySelectorAll('.item');
      itemElements.forEach(item => {
        item.addEventListener('dragover', handleDragOver);
        item.addEventListener('drop', handleDrop);
      });
    }

    function handleDragStart(event) {
      event.dataTransfer.setData('text/plain', event.target.dataset.id);
    }

    function handleDragOver(event) {
      event.preventDefault();
    }

    function handleDrop(event) {
      event.preventDefault();
      const personId = event.dataTransfer.getData('text/plain');
      const itemId = event.currentTarget.dataset.id;

      if (personId && itemId) {
        const person = people[personId];
        const item = items[itemId];
        if (person && item) {
          if (!item.people.find(p => p.name === person.name)) {
            item.people.push(person);
            updateItemPeopleList(itemId);
          }
        }
      }
    }

    function updateItemPeopleList(itemId) {
      const item = items[itemId];
      const itemElement = document.querySelector(`.item[data-id="${itemId}"] .item-people-list`);
      if (itemElement) {
        itemElement.innerHTML = item.people.map((person, index) =>
          `<div class="person-container">
            ${person.name} <span class="delete-person" onclick="removePersonFromItem(${itemId}, ${index})">X</span>
          </div>`
        ).join('');
      }
    }

    window.removePersonFromItem = (itemId, personIndex) => {
      const item = items[itemId];
      if (item && item.people[personIndex]) {
        item.people.splice(personIndex, 1);
        updateItemPeopleList(itemId);
      }
    };

    window.deletePerson = (personId) => {
      people.splice(personId, 1);
      updatePeopleList();
      items.forEach((item, index) => {
        const personIndex = item.people.findIndex(p => p.name === people[personId]?.name);
        if (personIndex !== -1) item.people.splice(personIndex, 1);
        updateItemPeopleList(index);
      });
    };

    window.updateItemPrice = (itemId, price) => {
      items[itemId].price = parseFloat(price);
      updateTotalAmount();
    };

    function calculateBill() {
      const totalPayment = parseFloat(totalPaymentInput.value.trim()) || 0;
      const totalItemCost = items.reduce((sum, item) => sum + item.price, 0);

      return people.map(person => {
        const total = items.reduce((sum, item) => {
          const itemCost = item.price * (item.people.some(p => p.name === person.name) ? 1 / item.people.length : 0);
          return sum + itemCost;
        }, 0);

        const discountedTotal = totalPayment * (total / totalItemCost);

        return {
          name: person.name,
          total: total.toFixed(2),
          discountedTotal: discountedTotal.toFixed(2),
        };
      });
    }

    calculateBillButton.addEventListener('click', () => {
      if (!totalPaymentInput.value) {
        alert('Please enter the total payment amount.');
        return;
      }

      const billSummary = calculateBill();
      const totalAmount = items.reduce((sum, item) => sum + item.price, 0);
      const totalDiscountedAmount = totalPaymentInput.value.trim();

      let resultHtml = `
        <h4>Bill Summary:</h4>
        <button id="copyTable" class="btn btn-secondary mb-2">Copy Table</button>
        <table id="billSummaryTable" class="table table-striped">
          <thead>
            <tr>
              <th>Person</th>
              <th>Total (Rs.)</th>
              <th>To Be Paid (Rs.)</th>
            </tr>
          </thead>
          <tbody>
      `;
      billSummary.forEach(entry => {
        resultHtml += `
          <tr>
            <td>${entry.name}</td>
            <td>Rs. ${entry.total}</td>
            <td>Rs. ${entry.discountedTotal}</td>
          </tr>
        `;
      });
      resultHtml += `
          <tr>
            <td><strong>Total</strong></td>
            <td><strong>Rs. ${totalAmount.toFixed(2)}</strong></td>
            <td><strong>Rs. ${totalDiscountedAmount}</strong></td>
          </tr>
        </tbody>
      </table>
      `;
      resultDiv.innerHTML = resultHtml;

      document.getElementById('copyTable').addEventListener('click', () => {
        const billSummaryTable = document.getElementById('billSummaryTable');
        if (billSummaryTable) {
          const range = document.createRange();
          range.selectNode(billSummaryTable);
          window.getSelection().removeAllRanges();
          window.getSelection().addRange(range);
          document.execCommand('copy');
          alert('Table copied to clipboard!');
        }
      });
    });

    function updateTotalAmount() {
      const totalAmount = items.reduce((sum, item) => sum + item.price, 0);
      totalAmountSpan.textContent = totalAmount.toFixed(2);
    }

    window.updateTotalAmount = updateTotalAmount;
  });
