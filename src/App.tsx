import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import ContactList from './components/ContactList';
import AddContact from './components/AddContact';
import EditContact from './components/EditContact';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ContactList />} />
        <Route path="/contact/add" element={<AddContact />} />
        <Route path="/contact/edit/:id" element={<EditContact />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
