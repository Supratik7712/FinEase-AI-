// 🔥 Firebase Imports
import { initializeApp } from
"https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInAnonymously
} from
"https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// 🔑 Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyBnN-LMnakXWk3mqmmD75g3UIYAT9YWHk0",
  authDomain: "finease-ai-dd793.firebaseapp.com",
  projectId: "finease-ai-dd793",
  storageBucket: "finease-ai-dd793.firebasestorage.app",
  messagingSenderId: "517124591660",
  appId: "1:517124591660:web:6bfd83849a2b2fa0bec189",
  measurementId: "G-FVKYKR7REZ"
};

// 🚀 Init Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// UI Elements
const loginCard = document.getElementById("loginCard");
const dashboardCard = document.getElementById("dashboardCard");

// 🔁 Auth State Listener
onAuthStateChanged(auth, user => {
  if (user) {
    loginCard.style.display = "none";
    dashboardCard.style.display = "block";
  } else {
    loginCard.style.display = "block";
    dashboardCard.style.display = "none";
  }
});

// 🔐 Auth Functions
window.signup = () => {
  createUserWithEmailAndPassword(auth, email.value, password.value)
    .catch(err => msg.innerText = err.message);
};

window.login = () => {
  signInWithEmailAndPassword(auth, email.value, password.value)
    .catch(() => msg.innerText = "Invalid email or password");
};

// 🔐 Google Sign-In Handler
window.handleGoogleSignIn = (response) => {
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider)
    .catch(err => {
      msg.innerText = "Google sign-in failed: " + err.message;
    });
};

window.logout = () => {
  signOut(auth);
};

// 👤 Anonymous/Guest Login
window.guestLogin = () => {
  signInAnonymously(auth)
    .catch(err => msg.innerText = "Guest login failed: " + err.message);
};

// � File Upload Handlers
window.handleDragOver = (e) => {
  e.preventDefault();
  e.stopPropagation();
  document.getElementById("uploadZone").classList.add("drag-over");
};

window.handleDragLeave = (e) => {
  e.preventDefault();
  e.stopPropagation();
  document.getElementById("uploadZone").classList.remove("drag-over");
};

window.handleDrop = (e) => {
  e.preventDefault();
  e.stopPropagation();
  document.getElementById("uploadZone").classList.remove("drag-over");
  
  const files = e.dataTransfer.files;
  if (files.length > 0) {
    document.getElementById("fileInput").files = files;
    window.handleFileSelect({ target: { files } });
  }
};

window.handleFileSelect = (e) => {
  const files = e.target.files;
  const file = files[0];
  if (!file) return;

  const fileName = file.name;
  const fileSize = (file.size / (1024 * 1024)).toFixed(2);

  // Validate file size (max 10MB)
  if (file.size > 10 * 1024 * 1024) {
    alert("File size exceeds 10MB limit!");
    document.getElementById("fileInput").value = "";
    return;
  }

  // Validate file type
  if (!fileName.endsWith(".csv") && !fileName.endsWith(".pdf")) {
    alert("Please upload a CSV or PDF file only!");
    document.getElementById("fileInput").value = "";
    return;
  }

  // Display file name
  document.getElementById("file-name").innerText = `✅ Selected: ${fileName} (${fileSize}MB)`;
  document.getElementById("analyzeBtn").style.display = "block";
};

// 📊 CSV Analysis
window.analyze = () => {
  const file = fileInput.files[0];
  if (!file) return alert("Please upload a CSV or PDF file");

  if (file.name.endsWith(".pdf")) {
    parsePDF(file);
  } else if (file.name.endsWith(".csv")) {
    const reader = new FileReader();
    reader.onload = e => parseCSV(e.target.result);
    reader.readAsText(file);
  } else {
    alert("Please upload a CSV or PDF file");
  }
};

// 📄 PDF Parser
async function parsePDF(file) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
    let csvText = "";

    // Extract text from all pages
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map(item => item.str).join(" ");
      csvText += pageText + "\n";
    }

    // Try to parse PDF as CSV-like data
    parseCSV(csvText);
  } catch (error) {
    alert("Error reading PDF. Please ensure it contains financial transaction data.");
    console.error(error);
  }
}

function parseCSV(data) {
  const rows = data.split("\n").slice(1);
  let income = 0, expense = 0, emi = 0;
  let categories = {};

  rows.forEach(row => {
    const cols = row.split(",");
    if (cols.length < 4) return;

    const amount = parseFloat(cols[2]);
    const desc = cols[1].toLowerCase();

    if (amount > 0) {
      income += amount;
      categories["Income"] = (categories["Income"] || 0) + amount;
    } else {
      const absAmount = Math.abs(amount);
      expense += absAmount;

      // Categorize expenses
      let category = "Other";
      if (desc.includes("food") || desc.includes("grocery")) category = "Food";
      else if (desc.includes("rent") || desc.includes("housing")) category = "Rent";
      else if (desc.includes("utility") || desc.includes("electric")) category = "Utilities";
      else if (desc.includes("transport") || desc.includes("fuel")) category = "Transport";
      else if (desc.includes("health") || desc.includes("medical")) category = "Medical";
      else if (desc.includes("emi") || desc.includes("loan")) category = "EMI/Loan";

      categories[category] = (categories[category] || 0) + absAmount;

      if (desc.includes("emi")) emi += absAmount;
    }
  });

  financialData = { income, expense, emi, categories };
  calculateStress(income, expense, emi, categories);
}

// 🧠 Stress Logic
function calculateStress(income, expense, emi, categories) {
  let expenseRatio = expense / income;
  let emiRatio = emi / income;

  let score = Math.min(
    100,
    expenseRatio * 50 + emiRatio * 50
  );

  let level =
    score < 40 ? "Low" :
    score < 70 ? "Moderate" : "High";

  scoreElem.innerText = score.toFixed(1);
  levelElem.innerText = level;

  // Update metrics
  document.getElementById("totalIncome").innerText = `₹${income.toFixed(2)}`;
  document.getElementById("totalExpenses").innerText = `₹${expense.toFixed(2)}`;
  document.getElementById("totalEMI").innerText = `₹${emi.toFixed(2)}`;

  // Create visualizations
  createIncomeExpenseChart(income, expense);
  createExpenseChart(categories);
  createStressGaugeChart(score);
  createHealthChart(expenseRatio, emiRatio);

  showSuggestions(expenseRatio, emiRatio, level, income);

  // Switch to analysis tab
  showSection('analysis');
}

// 📊 Chart instances
let incomeExpenseChart = null;
let expenseChart = null;
let stressGaugeChart = null;
let healthChart = null;

// 💾 Store financial data for charts
let financialData = {
  income: 0,
  expense: 0,
  emi: 0,
  categories: {}
};

function showSuggestions(expenseRatio, emiRatio, level, income) {
  suggestions.innerHTML = "";
  const suggestionsList = [];

  // Smart financial recommendations
  if (expenseRatio > 0.8) {
    suggestionsList.push("🚨 Critical: Your expenses are over 80% of income. Consider immediate spending audit.");
  } else if (expenseRatio > 0.7) {
    suggestionsList.push("⚠️ High expense ratio: Reduce discretionary spending by 10-15%.");
  }

  if (emiRatio > 0.5) {
    suggestionsList.push("💳 Very high EMI burden: Consider loan consolidation or refinancing options.");
  } else if (emiRatio > 0.3) {
    suggestionsList.push("📊 Moderate EMI burden: Try to increase income or reduce other expenses.");
  }

  if (level === "High") {
    suggestionsList.push("🧘 Your stress level is HIGH. Practice 10 mins of meditation daily.");
  }

  if (expenseRatio > 0.6 && emiRatio > 0.2) {
    suggestionsList.push("💰 Create a detailed budget: Track every expense category for 30 days.");
  }

  if (income > 0 && (income * 0.2) > 0) {
    suggestionsList.push("🎯 Save at least 20% of your income (₹" + (income * 0.2).toFixed(0) + " per month). Open a dedicated savings account.");
  }

  if (expenseRatio < 0.5 && emiRatio < 0.2) {
    suggestionsList.push("✅ Great job! Your finances are healthy. Invest in emergency fund.");
  }

  suggestionsList.forEach(suggestion => {
    suggestions.innerHTML += `<li>${suggestion}</li>`;
  });

  // Show relaxation tips
  showRelaxationTips(level);
  showSmartTips(expenseRatio, emiRatio);
}

function showRelaxationTips(stressLevel) {
  const relaxationTips = document.getElementById("relaxation-tips");
  relaxationTips.innerHTML = "";

  const tips = [
    { title: "Deep Breathing", desc: "Inhale for 4 counts, hold for 4, exhale for 4. Repeat 5 times." },
    { title: "Meditation", desc: "Spend 10 minutes daily practicing mindfulness meditation." },
    { title: "Exercise", desc: "Walk for 30 mins daily. It reduces cortisol levels." },
    { title: "Budget Review", desc: "Weekly 30-min budget review sessions reduce anxiety." },
    { title: "Sleep", desc: "Aim for 7-8 hours. Financial stress often disrupts sleep." }
  ];

  tips.forEach(tip => {
    relaxationTips.innerHTML += `<div class="tip-item"><strong>${tip.title}:</strong> ${tip.desc}</div>`;
  });
}

function showSmartTips(expenseRatio, emiRatio) {
  const smartTips = document.getElementById("smart-tips");
  smartTips.innerHTML = "";

  const tips = [];

  if (expenseRatio > 0.7) {
    tips.push("Cut one subscription service. Average savings: ₹5,000-15,000/year.");
  }
  if (emiRatio > 0.3) {
    tips.push("Increase EMI payments by 10% to pay off debt 20% faster.");
  }
  tips.push("Use the 50/30/20 rule: 50% needs, 30% wants, 20% savings.");
  tips.push("Set up automatic transfers to savings on payday.");
  tips.push("Review insurance: Car/Health policies for better rates.");

  tips.forEach(tip => {
    smartTips.innerHTML += `<div class="tip-item">💡 ${tip}</div>`;
  });
}

// 📊 Visualization functions
function createIncomeExpenseChart(income, expense) {
  const ctx = document.getElementById("incomeExpenseChart");
  if (!ctx) return;

  if (incomeExpenseChart) incomeExpenseChart.destroy();

  incomeExpenseChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Income", "Expenses"],
      datasets: [{
        label: "Amount (₹)",
        data: [income, expense],
        backgroundColor: ["#667eea", "#764ba2"],
        borderRadius: 8,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true } }
    }
  });
}

function createExpenseChart(categories) {
  const ctx = document.getElementById("expenseChart");
  if (!ctx) return;

  if (expenseChart) expenseChart.destroy();

  const categoryNames = Object.keys(categories);
  const categoryAmounts = Object.values(categories);

  expenseChart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: categoryNames.length > 0 ? categoryNames : ["No Data"],
      datasets: [{
        data: categoryAmounts.length > 0 ? categoryAmounts : [1],
        backgroundColor: [
          "#667eea", "#764ba2", "#f093fb", "#4facfe",
          "#fa709a", "#fee140", "#30b0fe"
        ]
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true
    }
  });
}

function createStressGaugeChart(score) {
  const ctx = document.getElementById("stressGaugeChart");
  if (!ctx) return;

  if (stressGaugeChart) stressGaugeChart.destroy();

  const remaining = 100 - score;

  stressGaugeChart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Stress", "Wellness"],
      datasets: [{
        data: [score, remaining],
        backgroundColor: [
          score < 40 ? "#10b981" : score < 70 ? "#f59e0b" : "#ef4444",
          "#e5e7eb"
        ]
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        tooltip: { enabled: true },
        datalabels: { display: false }
      }
    }
  });
}

function createHealthChart(expenseRatio, emiRatio) {
  const ctx = document.getElementById("healthChart");
  if (!ctx) return;

  if (healthChart) healthChart.destroy();

  const savingsRatio = Math.max(0, 1 - expenseRatio - emiRatio) * 100;
  const healthScore = 100 - (expenseRatio * 50 + emiRatio * 30);

  healthChart = new Chart(ctx, {
    type: "radar",
    data: {
      labels: ["Savings", "Income Stability", "Low Expenses", "Low EMI"],
      datasets: [{
        label: "Financial Health",
        data: [savingsRatio, 75, (1 - expenseRatio) * 100, (1 - emiRatio) * 100],
        borderColor: "#667eea",
        backgroundColor: "rgba(102, 126, 234, 0.1)"
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      scales: { r: { beginAtZero: true, max: 100 } }
    }
  });
}

// 🎯 Show dashboard section
window.showSection = (section) => {
  document.querySelectorAll(".section").forEach(s => s.classList.remove("active"));
  document.querySelectorAll(".nav-item").forEach(n => n.classList.remove("active"));
  
  document.getElementById(`section-${section}`).classList.add("active");
  event.target.classList.add("active");
};

// DOM Shortcuts
const scoreElem = document.getElementById("score");
const levelElem = document.getElementById("level");
const suggestions = document.getElementById("suggestions");
