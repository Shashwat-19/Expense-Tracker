// Firebase Imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-analytics.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyD_0zFIz23g2oVTCZ3ZGN8uv_G9cSS9lkc",
  authDomain: "login-reg-expense-tracker.firebaseapp.com",
  projectId: "login-reg-expense-tracker",
  storageBucket: "login-reg-expense-tracker.firebasestorage.app",
  messagingSenderId: "856548931737",
  appId: "1:856548931737:web:f3b95bfd92d873ce40e008",
  measurementId: "G-006E89MWCY",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Utility function to show messages
function showMessage(message) {
  alert(message); 
}

// SESSION Management
function startSession() {
  const currentTime = new Date().getTime();
  localStorage.setItem('loggedIn', 'true');
  localStorage.setItem('loginTime', currentTime);
}

function clearSession() {
  localStorage.removeItem('loggedIn');
  localStorage.removeItem('loginTime');
}

function checkSessionAndRedirect() {
  const isLoggedIn = localStorage.getItem('loggedIn');
  const loginTime = localStorage.getItem('loginTime');

  if (isLoggedIn === 'true' && loginTime) {
    const now = new Date().getTime();
    const thirtyTwoHours = 32 * 60 * 60 * 1000; // 32 hours

    if (now - loginTime < thirtyTwoHours) {
      window.location.href = "tracker/index.html";
    } else {
      clearSession();
    }
  }
}

function protectTrackerPage() {
  const isLoggedIn = localStorage.getItem('loggedIn');
  const loginTime = localStorage.getItem('loginTime');

  if (isLoggedIn !== 'true' || !loginTime) {
    window.location.href = "../index.html";
  } else {
    const now = new Date().getTime();
    const thirtyTwoHours = 32 * 60 * 60 * 1000;
    if (now - loginTime >= thirtyTwoHours) {
      clearSession();
      window.location.href = "../index.html";
    }
  }
}

// Call session check on login page
if (window.location.pathname.endsWith("/index.html") || window.location.pathname.endsWith("/")) {
  document.addEventListener("DOMContentLoaded", checkSessionAndRedirect);
}

// Call protection on tracker page
if (window.location.pathname.includes("/tracker/")) {
  document.addEventListener("DOMContentLoaded", protectTrackerPage);
}

// Register form
const registerForm = document.querySelector("#register-form");
if (registerForm) {
  registerForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const fullName = document.getElementById("register-name").value.trim();
    const email = document.getElementById("register-email").value.trim();
    const password = document.getElementById("register-password").value;
    const confirmPassword = document.getElementById("register-confirm-password").value;
    const termsAccepted = document.getElementById("terms").checked;

    if (!termsAccepted) {
      showMessage("Please accept the Terms & Conditions.");
      return;
    }

    if (password !== confirmPassword) {
      showMessage("Passwords do not match.");
      return;
    }

    console.log("Form data:", { fullName, email, password });

    const auth = getAuth(app);
    const db = getFirestore(app);

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log("User created:", user);

        const userData = {
          fullName: fullName,
          email: email,
        };

        const docRef = doc(db, "users", user.uid);
        setDoc(docRef, userData)
          .then(() => {
            console.log("Document successfully written!");
            showMessage("User created successfully! Redirecting...");
            startSession();
            setTimeout(() => {
              window.location.href = "tracker/index.html";
            }, 1500);
          })
          .catch((error) => {
            console.error("Error writing document: ", error);
            showMessage("Error saving user data: " + error.message);
          });
      })
      .catch((error) => {
        const errorCode = error.code;
        if (errorCode === "auth/email-already-in-use") {
          showMessage("Email already in use.");
        } else {
          showMessage("Error: " + error.message);
        }
      });
  });
}

// Login form
const loginForm = document.querySelector("#login-form");
if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value;

    const auth = getAuth();

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        showMessage("Login successful! Redirecting...");
        startSession();
        setTimeout(() => {
          window.location.href = "tracker/index.html";
        }, 1500);
      })
      .catch((error) => {
        const errorCode = error.code;
        if (
          errorCode === "auth/user-not-found" ||
          errorCode === "auth/wrong-password"
        ) {
          showMessage("Invalid email or password.");
        } else {
          showMessage("Login failed: " + error.message);
        }
      });
  });
}

// Logout function (for tracker page)
window.logout = function() {
  clearSession();
  window.location.href = "../index.html";
};

// Tab switching function (for registration/login tabs)
window.openTab = function (tabName) {
  const tabContents = document.querySelectorAll(".tab-content");
  const tabButtons = document.querySelectorAll(".tab-btn");

  tabContents.forEach((tab) => tab.classList.remove("active"));
  tabButtons.forEach((button) => button.classList.remove("active"));

  document.getElementById(tabName).classList.add("active");

  const selectedButton = Array.from(tabButtons).find(
    (button) => button.textContent.toLowerCase() === tabName.toLowerCase()
  );
  if (selectedButton) {
    selectedButton.classList.add("active");
  }
};

// Initialize active tab on page load
document.addEventListener("DOMContentLoaded", function () {
  const activeTab = document.querySelector(".tab-content.active");
  if (activeTab) {
    activeTab.style.opacity = "1";
    activeTab.style.transform = "translateY(0)";
  }
});
