import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import InitialPage from './pages/InitialPage';
import MainPage from './pages/MainPage';
import { UserProvider } from './context/UserContext';
import PrivateRoute from './components/PrivateRoute';

const App: React.FC = () => {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<InitialPage />} />          
          <Route 
            path="/main" 
            element={<PrivateRoute element={MainPage} />} 
          />
        </Routes>
      </Router>
    </UserProvider>
  );
};

export default App;
