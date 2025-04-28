# 📌 Expense Tracker

![Project Banner](https://github.com/Shashwat-19/Expense-Tracker/raw/main/Assets/image.png)

## 🚀 Overview
The **Expense Tracker** is a lightweight and user-friendly web application that allows users to efficiently manage and monitor their daily expenses.  
It helps users track income, expenses, and balance — promoting better financial discipline and budgeting habits.

🔹 **Use Cases**:
- Personal daily/weekly expense management
- Student budgeting
- Small business simple bookkeeping

🔹 **Target Audience**:
- Students, working professionals, freelancers, small business owners

## 🎯 Key Features
- ✅ Add, edit, and delete income and expenses easily
- ✅ Real-time balance update
- ✅ Clean and responsive UI
- ✅ Firebase-backed data persistence
- ✅ Scalable and modular architecture
- ✅ High performance and optimized for efficiency

## 🛠️ Tech Stack & Tools
- **Languages**: HTML, CSS, JavaScript
- **Frameworks**: None (Vanilla JS)
- **Database**: Firebase Firestore
- **Cloud & DevOps**: Firebase Hosting, GitHub Actions (CI/CD)
- **Other Tools**: Firebase CLI, Prettier for formatting

## 📦 Installation & Setup

### 🔧 Prerequisites
- Ensure you have the following dependencies installed:
  - Node.js (v18 or above)
  - Firebase CLI
  - Git

### 🚀 Quick Start
```sh
# Clone the repository
git clone https://github.com/yourusername/expense-tracker.git

# Navigate to the project directory
cd expense-tracker

# Install Firebase CLI globally (if not already installed)
npm install -g firebase-tools

# Set up environment variables
cp .env.example .env  # Create your .env file based on example

# Login to Firebase
firebase login

# Start the application locally
firebase emulators:start
```

## 🚀 Usage Guide

```sh
# To deploy on Firebase Hosting
firebase deploy
```
## 🏗️ Project Architecture
```
expense-tracker/
├── assets/
│   ├── css/
│   ├── js/
│   └── images/
├── firebase/
│   ├── firebase-config.js
├── index.html
├── README.md
├── .gitignore
└── LICENSE
```

## 🧪 Testing
**Manual Testing:**

Add, edit, and delete transactions<br>
Check UI responsiveness<br>
Test Firebase integration<br>
Confirm balance updates correctly


---

## 📊 Performance Optimization

Firebase Hosting CDN enabled for faster load times<br>
Minified JavaScript and CSS<br>
Optimized images for web<br>
Indexed database reads (Firebase Firestore)

## 📖 Documentation
Detailed configuration and developer guidelines will be available inside the /docs folder (coming soon).
---

## 💡 Contribution Guidelines
```
Fork the repository
Create a new branch (git checkout -b feature-branch)
Commit changes (git commit -m "Added new feature")
Push to the branch (git push origin feature-branch)
Open a pull request
```
---

## 📱 Browser Support

Chrome (last 2 versions)<br>
Firefox (last 2 versions)<br>
Safari (last 2 versions)<br>
Edge (last 2 versions)
---
## 📜 License
Licensed under the MIT License.