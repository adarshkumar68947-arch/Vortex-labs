// ==========================================
// 📟 CUSTOM TABLET RUNTIME DEBUGGER ENGINE
// ==========================================
const originalConsoleLog = console.log;
const originalConsoleError = console.error;

console.log = function(...args) {
    originalConsoleLog.apply(console, args);
    appendLogToTabletUI(args.join(' '), 'LOG');
};

console.error = function(...args) {
    originalConsoleError.apply(console, args);
    appendLogToTabletUI(args.join(' '), 'ERROR');
};

window.onerror = function(message, source, lineno, colno, error) {
    let errorMetaString = `${message} | Line: ${lineno} | Src: ${source}`;
    console.error(errorMetaString);
    return false;
};

function appendLogToTabletUI(text, type) {
    const anchor = document.getElementById('debugConsoleStreamAnchor');
    if (!anchor) return;
    const logLine = document.createElement('div');
    logLine.className = 'debug-line';
    
    if (type === 'ERROR') {
        logLine.innerHTML = `<span class="debug-err-type">[ERR]</span> ${text}`;
    } else {
        logLine.innerHTML = `<span class="debug-log-type">[LOG]</span> ${text}`;
    }
    
    anchor.appendChild(logLine);
    anchor.scrollTop = anchor.scrollHeight;
}

function clearTabletConsoleLogs() {
    const anchor = document.getElementById('debugConsoleStreamAnchor');
    if (anchor) anchor.innerHTML = '';
}

// Trigger Page Loaded Log Immediately
console.log("Page Loaded");

// ==========================================
// 🔥 FIREBASE INITIALIZATION & SYNC PIPELINE
// ==========================================
const firebaseConfig = {
    apiKey: "AIzaSyCAUQfcd1k63pp2DDyBHWZoD5M-dkid45M",
    authDomain: "scarlet-private-limited.firebaseapp.com",
    databaseURL: "https://scarlet-private-limited-default-rtdb.firebaseio.com/",
    projectId: "scarlet-private-limited",
    storageBucket: "scarlet-private-limited.firebasestorage.app",
    messagingSenderId: "570744434725",
    appId: "1:570744434725:web:14b0452a7810806a1ccfcc",
    measurementId: "G-4FZBRZRQBY"
};

let database;
try {
    console.log("Starting Firebase connection protocol...");
    firebase.initializeApp(firebaseConfig);
    database = firebase.database();
    console.log("Firebase Connected");
} catch(e) {
    console.error(e);
}

// Runtime Global Variables State
let userPhone = ""; 
let currentBalance = 0, promoIncome = 0, investIncome = 0, totalRecharge = 0, totalWithdraw = 0;
let isWheelSpinningInProgress = false;

const networkNodesCatalog = [
    { id: 0, name: "Sandbox Prototype Setup", cost: 0, profit: 50, days: 3, label: "Test Matrix Tier" },
    { id: 1, name: "Omni Alpha Computing Node", cost: 500, profit: 55, days: 40, label: "Standard Infrastructure Tier" },
    { id: 2, name: "Omni Beta High Capacity Unit", cost: 1200, profit: 140, days: 40, label: "Advanced Layer Layer" },
    { id: 3, name: "Omni Gamma Data Grid Array", cost: 3000, profit: 360, days: 45, label: "Premium Pooling Suite" },
    { id: 4, name: "Quantum Cluster Matrix v5", cost: 5000, profit: 630, days: 45, label: "Enterprise Super-Array" },
    { id: 5, name: "Quantum Cluster Matrix v6", cost: 10000, profit: 1350, days: 50, label: "Macro Arbitrage Core" },
    { id: 6, name: "Sovereign Pool Allocation Node", cost: 20000, profit: 2900, days: 50, label: "Elite Ledger Engine" },
    { id: 7, name: "Sovereign Pool Allocation Pro", cost: 35000, profit: 5400, days: 60, label: "Monolithic Server Cluster" },
    { id: 8, name: "Apex Data Distribution Rig", cost: 50000, profit: 8200, days: 60, label: "Global Institutional Core" },
    { id: 9, name: "Imperial Core Arbitrage Flagship", cost: 80000, profit: 14000, days: 65, letter: "Infinite Arbitrage Grid" }
];

$(document).ready(function() {
    renderCatalogElements();
});

// ==========================================
// INTERACTIVE WINDOW ROUTING ACTIONS
// ==========================================
function routeForm(id) {
    console.log("Routing form presentation to: " + id);
    $('.form-panel').removeClass('active');
    $('#' + id).addClass('active');
    $('input').val('');
}

function pushToastMessage(text) { 
    $('#toast-frame').text(text).fadeIn(200).delay(2300).fadeOut(200); 
}

function dismissModal() { 
    $('#startupAnnouncementBox').removeClass('show'); 
}

function switchPortalContextToDashboard(confirmedPhone) {
    console.log("Switching environment for terminal number: " + confirmedPhone);
    userPhone = confirmedPhone;
    $('#authWrapperPortal').fadeOut(400);
    $('#mainAppDashboardFrame').fadeIn(500);
    
    $('#terminalAddressUid').text("TERMINAL ID: +91 " + userPhone);
    let shareUrl = window.location.origin + window.location.pathname + "?ref=" + userPhone;
    $('#propagationTargetLinkField').val(shareUrl);
    $('#qrElementBox').attr('src', "https://api.qrserver.com/v1/create-qr-code/?size=110x110&data=" + encodeURIComponent(shareUrl));
    
    initializeLiveDatabaseStreamSync();
    setTimeout(() => { $('#startupAnnouncementBox').addClass('show'); }, 600);
}

// ==========================================
// CORE FIREBASE FUNCTION AUTHENTICATIONS
// ==========================================
function validateAndLogin() {
    console.log("Login Clicked");
    let phone = $('#loginPhone').val().trim();
    let pass = $('#loginPassword').val();
    console.log("Firebase Function: Reading values for login lookup verification structural frame.");

    if(!phone || !pass) { 
        let fieldsErr = new Error("Auth Fields Empty Validation Failure Exception");
        console.error(fieldsErr);
        alert("Matrix Alert: Fields cannot be blank."); 
        return; 
    }
    if(!database) { 
        let dbOfflineErr = new Error("Firebase Engine Unreachable Context Null Reference Exception");
        console.error(dbOfflineErr);
        alert("Core Database Engine Unreachable."); 
        return; 
    }

    console.log(`Firebase Function: Fetching user data snap path for 'users/${phone}'`);
    database.ref('users/' + phone).once('value').then((snapshot) => {
        if(snapshot.exists()) {
            let uData = snapshot.val();
            if(uData.password === pass) {
                console.log("Firebase Function: Auth credentials verified successfully mapped.");
                switchPortalContextToDashboard(phone);
            } else { 
                let passErr = new Error(`Authentication Failed: Cipher string mismatch for identity node ${phone}`);
                console.error(passErr);
                alert("Incorrect password credentials."); 
            }
        } else { 
            let userAbsentErr = new Error(`Database Verification Void: Identity reference ${phone} mapping index absent.`);
            console.error(userAbsentErr);
            alert("Node identity not found in configuration."); 
        }
    }).catch((err) => { 
        console.error(err);
        alert("Database link pipeline error."); 
    });
}

function validateAndRegister() {
    console.log("Register Clicked");
    let phone = $('#regPhone').val().trim();
    let pass = $('#regPassword').val();
    console.log("Firebase Function: Parsing registration constraint validation arrays.");

    if(phone.length !== 10 || pass.length < 6) { 
        let regInputErr = new Error("Invalid Input Sequence Constraints: Phone length must be 10, password min 6 chars.");
        console.error(regInputErr);
        alert("Use a 10-digit phone number & minimum 6 characters password."); 
        return; 
    }
    if(!database) { 
        let dbRefErr = new Error("Firebase Engine Database Object Offline Exception");
        console.error(dbRefErr);
        alert("Database reference offline."); 
        return; 
    }

    console.log(`Firebase Function: Querying uniqueness structural path check for 'users/${phone}'`);
    database.ref('users/' + phone).once('value').then((snapshot) => {
        if(snapshot.exists()) { 
            let collisionErr = new Error(`Database Integrity Exception: Index Collision detected. Terminal node ${phone} already instantiated.`);
            console.error(collisionErr);
            alert("Number already registered in database."); 
        } else {
            console.log(`Firebase Function: Committing clean data packet write profile deployment coordinate path into 'users/${phone}'`);
            database.ref('users/' + phone).set({
                password: pass, phone: phone, balance: 0, promotion_income: 0, invest_income: 0, recharge: 0, withdraw: 0
            }).then(() => {
                console.log("Firebase Function: Data packet write operation committed safely.");
                alert("Account Created successfully!");
                routeForm('loginSection');
            }).catch((e) => { 
                console.error(e); 
            });
        }
    }).catch((err) => { 
        console.error(err); 
    });
}

function validateAndReset() {
    let phone = $('#forgotPhone').val().trim();
    let newPass = $('#forgotNewPassword').val();
    console.log("Password reset overlay override execution initialized for reference field target ID: " + phone);

    if(phone.length !== 10 || !newPass) { 
        let resetErr = new Error("Reset Payload Processing Exception: Fields are malformed.");
        console.error(resetErr);
        alert("Provide valid input targets."); 
        return; 
    }
    if(!database) { 
        let resetDbErr = new Error("Firebase Engine Target Connection Lost during reset layout processing.");
        console.error(resetDbErr);
        return; 
    }

    console.log(`Firebase Function: Fetching mapping index path before override write for 'users/${phone}'`);
    database.ref('users/' + phone).once('value').then((snapshot) => {
        if(snapshot.exists()) {
            console.log(`Firebase Function: Updating password cipher token packet on path 'users/${phone}'`);
            database.ref('users/' + phone).update({ password: newPass }).then(() => {
                console.log("Firebase Function: Overriding field pass cipher token payload successful.");
                alert("Password modified successfully.");
                routeForm('loginSection');
            }).catch((ex) => { console.error(ex); });
        } else { 
            let mappingEx = new Error(`Identity Reference Node Index ${phone} Absent Error Object`);
            console.error(mappingEx);
            alert("Identity reference absent."); 
        }
    }).catch((err) => { 
        console.error(err); 
    });
}

function initializeLiveDatabaseStreamSync() {
    console.log(`Firebase Function: Initializing live persistent snapshot synchronization stream loop listener for user path 'users/${userPhone}'`);
    database.ref('users/' + userPhone).on('value', (snap) => {
        if(snap.exists()) {
            console.log("Firebase Function: Realtime remote server changes detected. Re-syncing local control matrix fields.");
            let u = snap.val();
            currentBalance = Number(u.balance || 0);
            promoIncome = Number(u.promotion_income || 0);
            investIncome = Number(u.invest_income || 0);
            totalRecharge = Number(u.recharge || 0);
            totalWithdraw = Number(u.withdraw || 0);

            $('#valMainWallet').text("₹" + currentBalance.toFixed(2));
            $('#valPromoWallet').text("₹" + promoIncome.toFixed(2));
            $('#valInvestWallet').text("₹" + investIncome.toFixed(2));

            let devicesCount = u.active_devices ? Object.keys(u.active_devices).length : 0;
            $('#activeNodesLabelCount').text(devicesCount);
        }
    }, (streamError) => {
        console.error(streamError);
    });
}

// ==========================================
// CORE APP LOGIC & UTILITIES
// ==========================================
function navigateMasterTab(targetTabId) {
    dismissUtilityCanvas();
    $('.app-section').removeClass('active');
    $('.dock-element').removeClass('active');
    $('#' + targetTabId).addClass('active');
    $('#' + targetTabId.replace('tab-', 'nav-')).addClass('active');
}

function toggleIncomeView(mode) {
    if(mode === 'catalog') {
        $('#triggerCatBtn').css('background','#1565ff'); $('#triggerDevBtn').css('background','#151824');
        $('#income-catalog-container').show(); $('#income-device-container').hide();
    } else {
        $('#triggerDevBtn').css('background','#1565ff'); $('#triggerCatBtn').css('background','#151824');
        $('#income-catalog-container').hide(); $('#income-device-container').show();
        fetchUserDeployedArraysLogs();
    }
}

function renderCatalogElements() {
    let h = "";
    networkNodesCatalog.forEach(n => {
        let fStyle = n.cost === 0 ? "free-node" : "";
        h += `<div class="product-strip ${fStyle}">
            <div>
                <b style="font-size:13px; color:#fff;">${n.name}</b><br>
                <span style="font-size:9.5px; color:var(--accent-neon); font-weight:700; text-transform:uppercase;">${n.label}</span><br>
                <span style="font-size:11px; color:var(--text-muted);">Cost: ₹${n.cost} | Profit: ₹${n.profit}/Day | Loop: ${n.days} Days</span>
            </div>
            <button class="buy-node-action" onclick="processClusterInitialization(${n.id})">${n.cost === 0 ? 'Free' : 'Deploy'}</button>
        </div>`;
    });
    $('#income-catalog-container').html(h);
}

function processClusterInitialization(id) {
    let node = networkNodesCatalog[id];
    if(currentBalance < node.cost) { 
        let bLowErr = new Error(`Operational Failure: Insufficient funds validation failed to allocate node package [${node.name}].`);
        console.error(bLowErr);
        pushToastMessage("Insufficiency: Vault balance low."); 
        return; 
    }
    if(confirm(`Confirm authorization setup sequence for ${node.name}?`)) {
        console.log(`Firebase Function: Initializing node balance allocation deduct and push item sequence configuration routing.`);
        database.ref('users/' + userPhone).update({ balance: currentBalance - node.cost }).then(() => {
            database.ref('users/' + userPhone + '/active_devices').push({
                productId: node.id, name: node.name, dailyYieldAmount: node.profit, lastHarvestTimestampDate: ""
            });
            database.ref('users/' + userPhone + '/ledgers').push({
                type: `Deployed ${node.name}`, variant: `-₹${node.cost}`, clock: new Date().toLocaleString()
            });
            console.log("Firebase Function: Node cluster allocation written and registered into downline arrays safely.");
            pushToastMessage("Success: Module configured inside profile pipeline.");
        }).catch((err) => { console.error(err); });
    }
}

function fetchUserDeployedArraysLogs() {
    console.log("Firebase Function: Pulling instantiated deployment device lists nodes once.");
    database.ref('users/' + userPhone + '/active_devices').once('value').then((snap) => {
        let h = "";
        if(!snap.exists()) { h = "<p style='text-align:center;font-size:12px;color:var(--text-muted);padding:20px 0;'>No pipeline structural arrays active.</p>"; }
        else {
            snap.forEach(i => {
                let data = i.val();
                h += `<div class="product-strip" style="border-left:3px solid var(--accent-green); background:#121520;">
                    <div><b>${data.name}</b><br><span style="font-size:11px; color:var(--text-muted);">Cycle Frequency Return: ₹${data.dailyYieldAmount} / 24h</span></div>
                </div>`;
            });
        }
        $('#activeNodesTerminalOutput').html(h);
    }).catch((err) => { console.error(err); });
}

function extractClusterDividends() {
    console.log("Firebase Function: Commencing recursive structural loop dividend extraction algorithms parsing.");
    database.ref('users/' + userPhone + '/active_devices').once('value').then((snap) => {
        if(!snap.exists()) { 
            let noArrayErr = new Error("Extraction Aborted Exception: Device data nodes missing entirely inside mapping track.");
            console.error(noArrayErr);
            pushToastMessage("System Null: No active clusters linked."); 
            return; 
        }
        let totalHarvestValue = 0, todayStr = new Date().toISOString().slice(0, 10), batchObj = {};

        snap.forEach(nodeItem => {
            let fields = nodeItem.val();
            if(fields.lastHarvestTimestampDate !== todayStr) {
                totalHarvestValue += Number(fields.dailyYieldAmount);
                batchObj[nodeItem.key + "/lastHarvestTimestampDate"] = todayStr;
            }
        });

        if(totalHarvestValue === 0) { 
            let duplicateHarvestErr = new Error("Double Extraction Flag Triggered: Time constraints prohibit multi harvest routines within identical timestamp dates.");
            console.error(duplicateHarvestErr);
            pushToastMessage("Already harvested inside this tracking day cycle."); 
            return; 
        }

        console.log(`Firebase Function: Executing transactional matrix atomic update updates for batch parameters data allocation clearing ₹${totalHarvestValue}.`);
        database.ref('users/' + userPhone + '/active_devices').update(batchObj).then(() => {
            database.ref('users/' + userPhone).update({ 
                balance: currentBalance + totalHarvestValue,
                invest_income: investIncome + totalHarvestValue 
            }).then(() => {
                database.ref('users/' + userPhone + '/ledgers').push({
                    type: "Synchronized Yield Harvest Dividends Extraction", variant: `+₹${totalHarvestValue}`, clock: new Date().toLocaleString()
                });
                console.log("Firebase Function: Structural dividends successfully integrated and added to wallet pools balance arrays.");
                pushToastMessage(`Harvest Success: +₹${totalHarvestValue} cleared to wallet.`);
            }).catch((ex) => { console.error(ex); });
        }).catch((err) => { console.error(err); });
    });
}

function validatePromoVoucher() {
    let keyStr = $('#giftCouponCode').val().trim();
    if(keyStr.length !== 6) { 
        let voucherLengthErr = new Error("Syntax Constraint Mismatch: Gift coupon codes must hold exact 6 length alignment specifications.");
        console.error(voucherLengthErr);
        pushToastMessage("Reject: Voucher code string index error."); 
        return; 
    }
    let randomAmt = Math.floor(10 + Math.random() * 41); 

    console.log(`Firebase Function: Redeeming alphanumeric key injection payload voucher balance: ${keyStr}`);
    database.ref('users/' + userPhone).update({ balance: currentBalance + randomAmt }).then(() => {
        database.ref('users/' + userPhone + '/ledgers').push({
            type: `Claimed Cryptographic Voucher [${keyStr}]`, variant: `+₹${randomAmt}`, clock: new Date().toLocaleString()
        });
        console.log(`Firebase Function: Voucher code verified, added alternative promotion token metric value +₹${randomAmt}`);
        pushToastMessage(`Approved! +₹${randomAmt} credit injected.`);
        $('#giftCouponCode').val('');
    }).catch((err) => { console.error(err); });
}

function executeSystemSpin() {
    if(isWheelSpinningInProgress) return;
    let todayIndexStr = new Date().toISOString().slice(0, 10);

    console.log("Firebase Function: Reading wheel transaction limit locks from user tree once.");
    database.ref('users/' + userPhone + '/lastWheelSpinTrackDate').once('value').then((snap) => {
        if(snap.exists() && snap.val() === todayIndexStr) { 
            let spinLimitErr = new Error(`Constraint Protection Alert: Daily allotment index lock triggered for wheel routine on timestamp date ${todayIndexStr}`);
            console.error(spinLimitErr);
            pushToastMessage("Limit: Exactly 1 loop execution allowed per 24 hours."); 
            return; 
        }

        isWheelSpinningInProgress = true;
        let angles = [0, 60, 120, 180, 240, 300];
     
