// App.js
import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Nav from './components/Nav';
import AdminForm from './components/AdminForm';
import Dashboard from './components/Dashboard';
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBb-DheHI1ntijKt8fSDDh63gGCdAvD4gM",
  authDomain: "adminqlsa-vlh.firebaseapp.com",
  projectId: "adminqlsa-vlh",
  storageBucket: "adminqlsa-vlh.appspot.com",
  messagingSenderId: "572475036087",
  appId: "1:572475036087:web:91734f57c35f81bdd4d832",
  measurementId: "G-69JW0QRKJ9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
function App() {
  return (
    <div>
      <Nav />
      <BrowserRouter>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tonghopxuatan" element={<AdminForm />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
