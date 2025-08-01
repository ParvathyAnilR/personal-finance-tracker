var transactions = JSON.parse(localStorage.getItem("transactions") || "[]");

function saveTransactions() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

function addTransaction(event) {
  event.preventDefault();

  const amount = parseFloat(document.getElementById('amount').value);
  const type = document.getElementById('type').value;
  const category = document.getElementById('category').value;
  const date = document.getElementById('date').value;
  const note = document.getElementById('note').value;

  if (isNaN(amount) || !type || !category || !date) {
    alert("Please fill all required fields.");
    return;
  }

  transactions.push({ amount, type, category, date, note });
  saveTransactions();
  document.getElementById('transactionForm').reset();
  updateTransactionList();
}

function updateTransactionList() {
  const transactionsDiv = document.getElementById('transactions');
  if (!transactionsDiv) return;

  transactionsDiv.innerHTML = '';
  transactions.forEach((t) => {
    const div = document.createElement('div');
    div.className = `transaction-item ${t.type.toLowerCase()}`;
    div.innerHTML = `${t.date} - ₹${t.amount} [${t.type}] (${t.category}) ${t.note ? '- ' + t.note : ''}`;
    transactionsDiv.appendChild(div);
  });
}

function updateSummary() {
  const totalIncome = transactions
    .filter(t => t.type === 'Income')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions
    .filter(t => t.type === 'Expense')
    .reduce((sum, t) => sum + t.amount, 0);

  document.getElementById('totalIncome').textContent = totalIncome.toFixed(2);
  document.getElementById('totalExpenses').textContent = totalExpenses.toFixed(2);
  document.getElementById('balance').textContent = (totalIncome - totalExpenses).toFixed(2);
}

function renderChart() {
  const ctx = document.getElementById('chart').getContext('2d');

  const categories = {};
  transactions.forEach(t => {
    if (t.type === 'Expense') {
      categories[t.category] = (categories[t.category] || 0) + t.amount;
    }
  });

  const data = {
    labels: Object.keys(categories),
    datasets: [{
      label: 'Expenses by Category',
      data: Object.values(categories),
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#66BB6A', '#BA68C8']
    }]
  };

  if (window.myChart) window.myChart.destroy();
  window.myChart = new Chart(ctx, {
    type: 'doughnut',
    data: data,
    options: { responsive: true }
  });
}

function renderSummaryBarChart() {
  const ctx = document.getElementById('chart').getContext('2d');

  const totalIncome = transactions
    .filter(t => t.type === 'Income')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions
    .filter(t => t.type === 'Expense')
    .reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncome - totalExpenses;

  const data = {
    labels: ['Income', 'Expenses', 'Balance'],
    datasets: [{
      label: 'Summary',
      data: [totalIncome, totalExpenses, balance],
      backgroundColor: ['#4CAF50', '#F44336', '#2196F3']
    }]
  };

  if (window.summaryChart) window.summaryChart.destroy();
  window.summaryChart = new Chart(ctx, {
    type: 'bar',
    data: data,
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

