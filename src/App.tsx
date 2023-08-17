import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import ContactList from './components/ContactList';
import AddContact from './components/AddContact';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ContactList />} />
        <Route path="/add/contact" element={<AddContact />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
