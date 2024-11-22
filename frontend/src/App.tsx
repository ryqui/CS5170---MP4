import "./App.css";
import ToolScreen from "./screen/ToolScreen"
import Modal from "./components/Modal";

import { BrowserRouter as Router, Routes, Route, useLocation} from "react-router-dom";
import React, { useState } from "react";
import { SettingsProvider } from "./contexts/SettingsContext";

function AppLayout() {  
  const [showModal, setShowModal] = useState(false);
  const [modalText, setModalText] = useState<string>("");
  const [modalPrompt, setModalPrompt] = useState<string>("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div>
      <Routes>
        <Route path="/" element={<ToolScreen />} />
      </Routes>

      {showModal && (
      <Modal
          text={modalText}
          prompt={modalPrompt}
          onClose={() => setShowModal(false)}
      />
)}
    </div>
  );
};

export default function App() {
  return (
    <SettingsProvider>
      <Router>
        <AppLayout />
      </Router>
    </SettingsProvider>
  );
}
