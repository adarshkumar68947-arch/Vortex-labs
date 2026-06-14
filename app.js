// NexGen Prime Financial - Application Logic

const PRODUCTS = [
  { id: 1, name: "Starter Wealth Plan", price: 0, days: 3, dailyProfit: 50, type: "Free" },
  { id: 2, name: "Silver Growth Fund", price: 1000, days: 5, dailyProfit: 80, type: "Premium" },
  { id: 3, name: "Gold Yield Portfolio", price: 2500, days: 7, dailyProfit: 150, type: "Premium" },
  { id: 4, name: "Platinum Equity Trust", price: 5000, days: 10, dailyProfit: 300, type: "Premium" },
  { id: 5, name: "Diamond Capital Fund", price: 10000, days: 15, dailyProfit: 600, type: "Premium" },
  { id: 6, name: "Emerald Tech Index", price: 1500, days: 6, dailyProfit: 100, type: "Premium" },
  { id: 7, name: "Sapphire Bond Scheme", price: 3000, days: 8, dailyProfit: 200, type: "Premium" },
  { id: 8, name: "Ruby Real Estate Fund", price: 7500, days: 12, dailyProfit: 450, type: "Premium" },
  { id: 9, name: "Pearl Global Markets", price: 4000, days: 9, dailyProfit: 250, type: "Premium" },
  { id: 10, name: "Titan Infrastructure", price: 8000, days: 14, dailyProfit: 500, type: "Premium" }
];

let rechargeTimerInterval;

function getState() {
  const state = localStorage.getItem('nexgen_state');
  if (!state) {
    const initialState = { users: {}, currentUser: null };
    localStorage.setItem('nexgen_state', JSON.stringify(initialState));
    return initialState;
  }
  return JSON.parse(state);
}

function saveState(state) {
  localStorage.setItem('nexgen_state', JSON.stringify(state));
}

function getCurrentUser() {
  const state = getState();
  if (!state.currentUser) return null;
  return state.users[state.currentUser];
}

function updateCurrentUser(updates) {
  const state = getState();
  if (state.currentUser) {
    state.users[state.currentUser] = { ...state.users[state.currentUser], ...updates };
    saveState(state);
  }
}

// Auth Functions
function handleLogin() {
  const phone = document.getElementById('loginPhone').value.trim();
  const password = document.getElementById('loginPassword').value;
  const captcha = parseInt(document.getElementById('loginCaptcha').value);
  
  if (!phone || !password) return showAlert('Error', 'Please fill in all fields.');
  if (captcha !== captchaAnswers.login) return showAlert('Error', 'Invalid captcha answer.');
  
  const state = getState();
  const user = state.users[phone];
  
  if (!user || user.password !== password) {
    return showAlert('Error', 'Invalid phone number or password.');
  }
  
  state.currentUser = phone;
  saveState(state);
  window.location.href = 'dashboard.html';
}

function handleRegister() {
  const phone = document.getElementById('regPhone').value.trim();
  const password = document.getElementById('regPassword').value;
  const confirmPass = document.getElementById('regConfirmPassword').value;
  const captcha = parseInt(document.getElementById('regCaptcha').value);
  
  if (!phone || !password || !confirmPass) return showAlert('Error', 'Please fill in all fields.');
  if (password !== confirmPass) return showAlert('Error', 'Passwords do not match.');
  if (captcha !== captchaAnswers.reg) return showAlert('Error', 'Invalid captcha answer.');
  if (phone.length !== 10 || !/^\d+$/.test(phone)) return showAlert('Error', 'Invalid phone number.');
  
  const state = getState();
  if (state.users[phone]) return showAlert('Error', 'Phone number already registered.');
  
  state.users[phone] = {
    password,
    balance: 0,
    promoIncome: 0,
    investIncome: 0,
    bank: { accNo: '', ifsc: '' },
    orders: [],
    lastCheckIn: null,
    rechargeRecords: [],
    withdrawRecords: [],
    team: []
  };
  state.currentUser = phone;
  saveState(state);
  window.location.href = 'dashboard.html';
}

function handleForgotPassword() {
  const phone = document.getElementById('forgotPhone').value.trim();
  const password = document.getElementById('forgotPassword').value;
  const captcha = parseInt(document.getElementById('forgotCaptcha').value);
  
  if (!phone || !password) return showAlert('Error', 'Please fill in all fields.');
  if (captcha !== captchaAnswers.forgot) return showAlert('Error', 'Invalid captcha answer.');
  
  const state = getState();
  if (!state.users[phone]) return showAlert('Error', 'Phone number not found.');
  
  state.users[phone].password = password;
  saveState(state);
  showAlert('Success', 'Password updated successfully. You can now login.');
  document.getElementById('forgotPhone').value = '';
  document.getElementById('forgotPassword').value = '';
  document.getElementById('forgotCaptcha').value = '';
}

function checkAuth() {
  const state = getState();
  if (!state.currentUser) {
    window.location.href = 'index.html';
  }
}

function handleLogout() {
  const state = getState();
  state.currentUser = null;
  saveState(state);
  window.location.href = 'index.html';
}

// Dashboard Functions
function loadDashboard() {
  const state = getState();
  const phone = state.currentUser;
  document.getElementById('headerPhone').textContent = `ID: ${phone}`;
  document.getElementById('minePhone').textContent = phone;
  document.getElementById('mineInitial').textContent = phone.charAt(0).toUpperCase();
  document.getElementById('referralLink').value = `https://nexgenprime.finance/ref/${phone}`;
  updateStats();
}

function updateStats() {
  const user = getCurrentUser();
  if (!user) return;
  
  const balance = user.balance.toFixed(2);
  const promo = user.promoIncome.toFixed(2);
  const invest = user.investIncome.toFixed(2);
  
  document.getElementById('homeBalance').textContent = balance;
  document.getElementById('homePromo').textContent = promo;
  document.getElementById('homeInvest').textContent = invest;
  
  document.getElementById('mineBalance').textContent = balance;
  document.getElementById('minePromo').textContent = promo;
  document.getElementById('mineInvest').textContent = invest;
}

function updateMineStats() {
  updateStats();
  const user = getCurrentUser();
  const bankInfo = user.bank.accNo ? `****${user.bank.accNo.slice(-4)}` : 'Not Added';
  document.getElementById('withdrawBank').value = bankInfo;
}

// Gift Code
function redeemGiftCode() {
  const code = document.getElementById('giftCode').value.trim();
  if (code.length !== 6) return showAlert('Error', 'Gift code must be exactly 6 digits.');
  
  const amounts = [10, 20, 50];
  const reward = amounts[Math.floor(Math.random() * amounts.length)];
  
  const user = getCurrentUser();
  user.balance += reward;
  updateCurrentUser({ balance: user.balance });
  
  showAlert('Success', `Congratulations! ₹${reward} has been credited to your account.`);
  document.getElementById('giftCode').value = '';
  updateStats();
}

// Spinner
function spinWheel() {
  const user = getCurrentUser();
  const today = new Date().toDateString();
  
  if (user.lastCheckIn === today) {
    return showAlert('Info', 'You have already checked in today. Please return tomorrow.');
  }
  
  const btn = document.getElementById('spinBtn');
  const result = document.getElementById('spinResult');
  btn.disabled = true;
  result.textContent = 'Spinning...';
  
  const amounts = [10, 20, 100, 300, 500, 1500];
  const reward = amounts[Math.floor(Math.random() * amounts.length)];
  
  setTimeout(() => {
    user.balance += reward;
    user.lastCheckIn = today;
    updateCurrentUser({ balance: user.balance, lastCheckIn: today });
    
    result.textContent = `🎉 You won ₹${reward}!`;
    result.style.color = 'var(--accent)';
    updateStats();
    
    setTimeout(() => {
      btn.disabled = false;
      result.textContent = '';
      result.style.color = '';
    }, 3000);
  }, 2000);
}

// Products & Orders
function renderProducts() {
  const container = document.getElementById('productsList');
  container.innerHTML = '';
  
  PRODUCTS.forEach(product => {
    const div = document.createElement('div');
    div.className = 'product-card';
    div.innerHTML = `
      <div class="product-info">
        <h4>${product.name}</h4>
        <p>${product.days} Days • ₹${product.dailyProfit}/day</p>
        <span style="font-size: 11px; color: ${product.type === 'Free' ? 'var(--success)' : 'var(--accent)'}; font-weight: 600;">${product.type}</span>
      </div>
      <div class="product-price">
        <div class="amount">₹${product.price}</div>
        <button class="btn btn-primary" style="width: auto; padding: 8px 16px; font-size: 12px; margin-top: 8px;" onclick="buyProduct(${product.id})">
          ${product.price === 0 ? 'Claim Free' : 'Invest'}
        </button>
      </div>
    `;
    container.appendChild(div);
  });
}

function buyProduct(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  const user = getCurrentUser();
  
  if (user.orders.find(o => o.productId === productId)) {
    return showAlert('Error', 'You have already purchased this product.');
  }
  
  if (user.balance < product.price) {
    return showAlert('Error', 'Insufficient balance. Please recharge your account.');
  }
  
  user.balance -= product.price;
  user.orders.push({
    productId: product.id,
    name: product.name,
    days: product.days,
    dailyProfit: product.dailyProfit,
    purchaseDate: new Date().toISOString(),
    lastCollection: null,
    daysCollected: 0
  });
  
  updateCurrentUser({ balance: user.balance, orders: user.orders });
  showAlert('Success', `Successfully invested in ${product.name}!`);
  updateStats();
}

function renderOrders() {
  const container = document.getElementById('ordersList');
  const user = getCurrentUser();
  container.innerHTML = '';
  
  if (user.orders.length === 0) {
    container.innerHTML = '<p class="text-center text-muted" style="padding: 40px;">No active investments. Start investing today!</p>';
    return;
  }
  
  const today = new Date().toDateString();
  
  user.orders.forEach((order, index) => {
    const lastCollectionDate = order.lastCollection ? new Date(order.lastCollection).toDateString() : null;
    const canCollect = lastCollectionDate !== today && order.daysCollected < order.days;
    const isCompleted = order.daysCollected >= order.days;
    
    const div = document.createElement('div');
    div.className = 'product-card';
    div.innerHTML = `
      <div class="product-info">
        <h4>${order.name}</h4>
        <p>Day ${order.daysCollected}/${order.days} • ₹${order.dailyProfit}/day</p>
        <span style="font-size: 11px; color: ${isCompleted ? 'var(--text-muted)' : 'var(--success)'}; font-weight: 600;">
          ${isCompleted ? 'Completed' : 'Active'}
        </span>
      </div>
      <div class="product-price">
        <div class="amount" style="font-size: 14px;">Total: ₹${order.daysCollected * order.dailyProfit}</div>
        <button class="btn btn-primary" style="width: auto; padding: 8px 16px; font-size: 12px; margin-top: 8px;" 
          ${!canCollect ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''} 
          onclick="collectProfit(${index})">
          ${isCompleted ? 'Done' : (canCollect ? 'Collect' : 'Wait')}
        </button>
      </div>
    `;
    container.appendChild(div);
  });
}

function collectProfit(index) {
  const user = getCurrentUser();
  const order = user.orders[index];
  const today = new Date().toDateString();
  
  if (order.lastCollection && new Date(order.lastCollection).toDateString() === today) {
    return showAlert('Error', 'Profit already collected today for this product.');
  }
  
  if (order.daysCollected >= order.days) {
    return showAlert('Error', 'This product has reached its maximum collection days.');
  }
  
  order.daysCollected += 1;
  order.lastCollection = new Date().toISOString();
  user.investIncome += order.dailyProfit;
  user.balance += order.dailyProfit;
  
  updateCurrentUser({ orders: user.orders, investIncome: user.investIncome, balance: user.balance });
  showAlert('Success', `₹${order.dailyProfit} profit collected successfully!`);
  renderOrders();
  updateStats();
}

function copyReferral() {
  const link = document.getElementById('referralLink');
  link.select();
  document.execCommand('copy');
  showAlert('Success', 'Referral link copied to clipboard!');
}

// Recharge
function openRechargeModal() {
  document.getElementById('rechargeModal').classList.add('active');
  document.getElementById('rechargeStep1').classList.remove('hidden');
  document.getElementById('rechargeStep2').classList.add('hidden');
}

function proceedRecharge() {
  const amount = parseInt(document.getElementById('rechargeAmount').value);
  if (!amount || amount < 500) return showAlert('Error', 'Minimum recharge amount is 500.');
  
  document.getElementById('rechargeStep1').classList.add('hidden');
  document.getElementById('rechargeStep2').classList.remove('hidden');
  
  let timeLeft = 600; // 10 minutes
  const timerEl = document.getElementById('rechargeTimer');
  
  clearInterval(rechargeTimerInterval);
  rechargeTimerInterval = setInterval(() => {
    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    timerEl.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
    
    if (timeLeft <= 0) {
      clearInterval(rechargeTimerInterval);
      closeModal('rechargeModal');
      showAlert('Timeout', 'Recharge session expired. Please try again.');
    }
    timeLeft--;
  }, 1000);
}

function submitRecharge() {
  const utr = document.getElementById('utrNumber').value.trim();
  const amount = parseInt(document.getElementById('rechargeAmount').value);
  
  if (utr.length !== 12 || !/^\d+$/.test(utr)) {
    return showAlert('Error', 'Please enter a valid 12-digit UTR number.');
  }
  
  clearInterval(rechargeTimerInterval);
  
  const user = getCurrentUser();
  user.balance += amount;
  user.rechargeRecords.push({
    amount,
    utr,
    date: new Date().toISOString(),
    status: 'Success'
  });
  
  updateCurrentUser({ balance: user.balance, rechargeRecords: user.rechargeRecords });
  closeModal('rechargeModal');
  showAlert('Success', `₹${amount} has been successfully credited to your account!`);
  updateStats();
  document.getElementById('rechargeAmount').value = '';
  document.getElementById('utrNumber').value = '';
}

// Withdraw
function openWithdrawModal() {
  const user = getCurrentUser();
  if (!user.bank.accNo) {
    return showAlert('Error', 'Please bind your bank account first in the Mine section.');
  }
  document.getElementById('withdrawModal').classList.add('active');
}

function submitWithdraw() {
  const amount = parseInt(document.getElementById('withdrawAmount').value);
  const user = getCurrentUser();
  
  if (!amount || amount < 1000) return showAlert('Error', 'Minimum withdrawal amount is 1000.');
  if (amount > user.balance) return showAlert('Error', 'Insufficient balance.');
  
  user.balance -= amount;
  user.withdrawRecords.push({
    amount,
    bank: `****${user.bank.accNo.slice(-4)}`,
    date: new Date().toISOString(),
    status: 'Under Review'
  });
  
  updateCurrentUser({ balance: user.balance, withdrawRecords: user.withdrawRecords });
  closeModal('withdrawModal');
  
  const messages = [
    'Your withdrawal request has been submitted and is currently under review. Processing time: 24-48 hours.',
    'Request received successfully. Our finance team will verify and process your withdrawal shortly.',
    'Withdrawal initiated. You will receive a confirmation once the funds are transferred to your bank account.'
  ];
  const randomMsg = messages[Math.floor(Math.random() * messages.length)];
  
  showAlert('Request Submitted', randomMsg);
  updateStats();
  document.getElementById('withdrawAmount').value = '';
}

// Bank Details
function openAddBankModal() {
  const user = getCurrentUser();
  if (user.bank.accNo) {
    document.getElementById('bankAccNo').value = user.bank.accNo;
    document.getElementById('bankIfsc').value = user.bank.ifsc;
  }
  document.getElementById('addBankModal').classList.add('active');
}

function saveBankDetails() {
  const accNo = document.getElementById('bankAccNo').value.trim();
  const ifsc = document.getElementById('bankIfsc').value.trim().toUpperCase();
  
  if (!accNo || !ifsc) return showAlert('Error', 'Please fill in all bank details.');
  if (accNo.length < 9 || accNo.length > 18) return showAlert('Error', 'Invalid account number.');
  if (ifsc.length !== 11) return showAlert('Error', 'Invalid IFSC code format.');
  
  updateCurrentUser({ bank: { accNo, ifsc } });
  closeModal('addBankModal');
  showAlert('Success', 'Bank account bound successfully!');
  document.getElementById('bankAccNo').value = '';
  document.getElementById('bankIfsc').value = '';
}

// Records & Team
function showRecords(type) {
  const user = getCurrentUser();
  let records = [];
  let title = '';
  
  if (type === 'bill') {
    title = 'Transaction History';
    records = [...(user.rechargeRecords || []), ...(user.withdrawRecords || [])].sort((a, b) => new Date(b.date) - new Date(a.date));
  } else if (type === 'recharge') {
    title = 'Recharge Records';
    records = (user.rechargeRecords || []).sort((a, b) => new Date(b.date) - new Date(a.date));
  } else if (type === 'withdraw') {
    title = 'Withdrawal Records';
    records = (user.withdrawRecords || []).sort((a, b) => new Date(b.date) - new Date(a.date));
  }
  
  if (records.length === 0) {
    return showAlert(title, 'No records found.');
  }
  
  let msg = records.map(r => {
    const date = new Date(r.date).toLocaleDateString();
    if (type === 'withdraw' || (r.bank && r.status === 'Under Review')) {
      return `₹${r.amount} to ${r.bank} on ${date} - ${r.status}`;
    }
    return `₹${r.amount} on ${date} - ${r.status}`;
  }).join('\n\n');
  
  showAlert(title, msg);
}

function showMyTeam() {
  const user = getCurrentUser();
  const teamCount = user.team ? user.team.length : 0;
  showAlert('My Team', `You currently have ${teamCount} active referrals. Share your link to grow your team and earn promotion income!`);
}

function openAboutModal() {
  document.getElementById('aboutModal').classList.add('active');
}

function openHelpModal() {
  // Reuse the help modal structure from index.html if needed, or create a simple alert
  showAlert('Customer Support', 'Email: support@nexgenprime.finance\nHeadquarters: 42nd Floor, Tower B, Financial District, Metro City, 100001\nHours: Mon-Fri, 9:00 AM - 6:00 PM (IST)');
}
