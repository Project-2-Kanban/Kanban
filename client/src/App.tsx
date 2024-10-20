import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import InitialPage from './pages/InitialPage';
import MainPage from './pages/MainPage';
import { UserProvider } from './context/UserContext';
import PrivateRoute from './components/PrivateRoute';

const App: React.FC = () => {
  const [visibleError, setVisibleError] = useState<string>("");

  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route 
            path="/" 
            element={<InitialPage visibleError={visibleError} setVisibleError={setVisibleError} />} 
          />
          <Route 
            path="/main/:boardId?" 
            element={<PrivateRoute element={MainPage} />} 
          />
        </Routes>
      </Router>
    </UserProvider>
  );
};

export default App;
