import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-analytics.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js"; // <- updated
import {
  getFirestore,
  doc,
  setDoc,
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js"; // <- updated

// Your web app's Firebase configuration
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
  alert(message); // Simple alert for now, can be upgraded later
}

// Register form submission
const registerForm = document.querySelector("#register-form");
if (registerForm) {
  registerForm.addEventListener("submit", (e) => {
    e.preventDefault(); // Prevent default form submission

    const fullName = document.getElementById("register-name").value.trim();
    const email = document.getElementById("register-email").value.trim();
    const password = document.getElementById("register-password").value;
    const confirmPassword = document.getElementById(
      "register-confirm-password"
    ).value;
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

    // Firebase Auth and Firestore logic
    const auth = getAuth(app);
    const db = getFirestore(app);

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log("User created:", user); // Log the user object

        const userData = {
          fullName: fullName,
          email: email,
        };

        const docRef = doc(db, "users", user.uid);
        setDoc(docRef, userData)
          .then(() => {
            console.log("Document successfully written!");
            showMessage("User created successfully! Redirecting...");
            setTimeout(() => {
                window.location.href = "./tracker/exptr.html";
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
} else {
  console.error("Register form not found!");
}

// Login
const loginForm = document.querySelector("#login-form");

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value;

  const auth = getAuth();

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      showMessage("Login successful! Redirecting...");
      setTimeout(() => {
        window.location.href = "dashboard.html"; // Adjust your post-login page
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

// Tab switching function
window.openTab = function (tabName) {
  const tabContents = document.querySelectorAll(".tab-content");
  const tabButtons = document.querySelectorAll(".tab-btn");

  // Hide all tabs
  tabContents.forEach((tab) => {
    tab.classList.remove("active");
  });

  // Remove active class from all buttons
  tabButtons.forEach((button) => {
    button.classList.remove("active");
  });

  // Show the selected tab
  document.getElementById(tabName).classList.add("active");

  // Add active class to the button that was clicked
  const selectedButton = Array.from(tabButtons).find(
    (button) => button.textContent.toLowerCase() === tabName.toLowerCase()
  );
  if (selectedButton) {
    selectedButton.classList.add("active");
  }
};

// Initialize to make sure the active tab is properly displayed
document.addEventListener("DOMContentLoaded", function () {
  const activeTab = document.querySelector(".tab-content.active");
  if (activeTab) {
    activeTab.style.opacity = "1";
    activeTab.style.transform = "translateY(0)";
  }
});
