import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import MainPage from './components/MainPage/MainPage';
import LoginPage from './components/LoginPage/LoginPage';
import RegisterPage from './components/RegisterPage/RegisterPage';
import DetailsPage from './components/DetailsPage/DetailsPage'; 
// TASK 1 HINT: Import your SearchPage component
import SearchPage from './components/SearchPage/SearchPage'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Navbar from './components/Navbar/Navbar';

function App() {
  const navigate = useNavigate();
  return (
        <>
        <Navbar/>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/app" element={<MainPage />} />
          <Route path="/app/login" element={<LoginPage/>} />
          <Route path="/app/register" element={<RegisterPage />} />
          <Route path="/app/product/:productId" element={<DetailsPage/>} />
          {/* TASK 1 HINT: Add the search page path route mapping layout */}
          <Route path="/app/search" element={<SearchPage />} />
        </Routes>
        </>
  );
}

export default App;