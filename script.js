document.addEventListener('DOMContentLoaded', () => {
  const people = [];
  const items = [];

  const addPersonButton = document.getElementById('addPerson');
  const personNameInput = document.getElementById('personName');
  const peopleList = document.getElementById('peopleList');

  const addItemButton = document.getElementById('addItem');
  const itemNameInput = document.getElementById('itemName');
  const itemPriceInput = document.getElementById('itemPrice');
  const itemList = document.getElementById('itemList');

  const totalPaymentInput = document.getElementById('totalPayment');
  const calculateBillButton = document.getElementById('calculateBill');
  const resultDiv = document.getElementById('result');

  addPersonButton.addEventListener('click', () => {
    const name = personNameInput.value.trim();
    if (name) {
      const person = { name, id: `person-${Date.now()}` };
      people.push(person);
      const personElement = document.createElement('div');
      personElement.className = 'drag-item';
      personElement.draggable = true;
      personElement.textContent = name;
      personElement.dataset.id = person.id;
      const deletePersonSpan = document.createElement('span');
      deletePersonSpan.className = 'delete-person';
      deletePersonSpan.innerHTML = '&times;';
      deletePersonSpan.onclick = () => {
        peopleList.removeChild(personElement);
        const personIndex = people.findIndex(p => p.id === person.id);
        if (personIndex > -1) people.splice(personIndex, 1);
      };
      personElement.appendChild(deletePersonSpan);
      peopleList.appendChild(personElement);
      personNameInput.value = '';
    }
  });

  addItemButton.addEventListener('click', () => {
    const name = itemNameInput.value.trim();
    const price = parseFloat(itemPriceInput.value);
    if (name && price) {
      const item = { name, price, id: `item-${Date.now()}`, people: [] };
      items.push(item);
      const itemElement = document.createElement('div');
      itemElement.className = 'item col-md-6';
      itemElement.dataset.id = item.id;
      itemElement.innerHTML = `
        <h5>${name} - Rs. <span class="item-price">${price.toFixed(2)}</span></h5>
        <div class="item-people-list item-list" data-id="${item.id}"></div>
        <span class="edit-item">Edit</span>
      `;
      itemElement.querySelector('.edit-item').onclick = () => {
        const newPrice = parseFloat(prompt('Enter new price:', item.price));
        if (newPrice) {
          item.price = newPrice;
          itemElement.querySelector('.item-price').textContent = newPrice.toFixed(2);
        }
      };
      itemList.appendChild(itemElement);
      itemNameInput.value = '';
      itemPriceInput.value = '';
    }
  });

  itemList.addEventListener('dragover', (event) => {
    event.preventDefault();
  });

  itemList.addEventListener('drop', (event) => {
    event.preventDefault();
    const personId = event.dataTransfer.getData('text');
    const personElement = document.querySelector(`[data-id="${personId}"]`);
    const itemPeopleList = event.target.closest('.item').querySelector('.item-people-list');
    const newPersonElement = personElement.cloneNode(true);
    newPersonElement.querySelector('.delete-person').onclick = () => {
      itemPeopleList.removeChild(newPersonElement);
      const itemId = itemPeopleList.dataset.id;
      const item = items.find(i => i.id === itemId);
      const personIndex = item.people.indexOf(personId);
      if (personIndex > -1) {
        item.people.splice(personIndex, 1);
      }
    };
    itemPeopleList.appendChild(newPersonElement);
    const itemId = itemPeopleList.dataset.id;
    const item = items.find(i => i.id === itemId);
    if (!item.people.includes(personId)) {
      item.people.push(personId);
    }
  });

  peopleList.addEventListener('dragstart', (event) => {
    event.dataTransfer.setData('text', event.target.dataset.id);
  });

  calculateBillButton.addEventListener('click', () => {
    const totalPayment = parseFloat(totalPaymentInput.value);
    const totalBill = items.reduce((sum, item) => sum + item.price, 0);
    const discountPercent = totalBill > 0 ? ((totalBill - totalPayment) / totalBill) * 100 : 0;

    const billSummary = people.map(person => {
      const personItems = items.filter(item => item.people.includes(person.id));
      const total = personItems.reduce((sum, item) => {
        return sum + item.price / item.people.length;
      }, 0);
      const discountedTotal = total - (total * discountPercent / 100);
      return { name: person.name, total: total.toFixed(2), discountedTotal: discountedTotal.toFixed(2) };
    });

    let resultHtml = `
      <h4>Bill Summary:</h4>
      <table class="table table-striped">
        <thead>
          <tr>
            <th>Person</th>
            <th>Total (Rs.)</th>
            <th>Discounted Total (Rs.)</th>
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
        </tbody>
      </table>
    `;
    resultDiv.innerHTML = resultHtml;
  });
});
