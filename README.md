💸 Financial Stress Relief App - FinEase-AI

A privacy-first web application that analyzes bank statements to detect financial stress levels and provides personalized financial and mental wellness suggestions using simple, explainable logic.

🚀 Problem Statement

Financial stress is a major contributor to anxiety, poor mental health, and impulsive financial decisions.
Although bank statements contain valuable insights, most users find them difficult to interpret and receive no guidance on how their finances affect their well-being.

💡 Solution Overview

The Financial Stress Relief App helps users:

Upload a bank statement (CSV)

Automatically analyze income, expenses, and debt

Generate a financial stress score

Receive actionable relief suggestions

All processing happens locally in the browser, ensuring data privacy and security.

✨ Key Features

🔐 Secure Authentication (Email & Google Sign-In)

📂 Bank Statement Upload (CSV format)

📊 Financial Stress Score (0–100)

🚦 Stress Classification (Low / Moderate / High)

🧠 Personalized Financial & Mental Wellness Tips

🔒 Privacy-first (No financial data stored)

🇮🇳 Indian Rupee–based realistic analysis

⚡ Lightweight frontend-only solution

🛠️ Tech Stack

Frontend: HTML, CSS, JavaScript

Authentication: Firebase Authentication

OAuth: Google Sign-In

Hosting (Optional): Firebase Hosting / GitHub Pages

🧠 How Stress Is Calculated

The app analyzes:

Income vs Expense ratio

EMI / Debt burden

Spending patterns

A combined stress score is generated and categorized into:

Low Stress

Moderate Stress

High Stress

🔄 Application Flow

User logs in using Email or Google

User uploads a bank statement (CSV)

App parses transactions in the browser

Financial stress indicators are detected

Stress score and suggestions are displayed

📂 Project Structure
finance-stress-app/
├── index.html
├── style.css
└── app.js

🧪 Sample CSV Format
Date,Description,Amount,Type
2025-02-01,Salary,40000,Credit
2025-02-03,Groceries,-3000,Debit
2025-02-06,EMI,-7000,Debit
2025-02-10,Food,-2000,Debit

▶️ How to Run Locally

Clone the repository

Open the folder in VS Code

Replace Firebase configuration in app.js

Run using Live Server

Sign up → Upload CSV → Analyze stress

🔐 Privacy & Security

No financial data is stored on servers

All analysis is done locally in the browser

Firebase handles authentication securely

🔮 Future Enhancements

PDF and image bank statement support (OCR)

Monthly stress trend visualization

Savings and investment recommendations

Firestore-based stress history

Multilingual support

AI chat assistant for financial wellness

🎥 Demo Video

📺 Demo Video (3 Minutes):

https://youtu.be/your-demo-video

🌐 Live Demo (Optional)
https://supratik7712.github.io/FinEase-AI-/

🤝 Contributors

Supratik Saha, Rhitam Mondal, Anindra Talukder, Abdul Barish Khan.

🏆 Conclusion

This project bridges the gap between financial data and mental well-being by transforming raw bank statements into meaningful, actionable stress relief insights—securely, simply, and ethically.
