import React, { useState } from 'react';
import NavBar from '../components/NavBar/NavBar';
import Button from '../components/Button/Button';
import UserMenu from '../components/UserMenu';
import Menu from '../components/Menu';
import Home from '../components/Home';
import Members from '../components/Members';
import { useUser } from '../context/UserContext';


const MainPage: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { user } = useUser();
  const [visibleComponent, setVisibleComponent] = useState<string>("home");

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleButtonClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    toggleMenu();
  };

  return (
    <div style={{display: 'flex', flexDirection: 'row'}}>
      <Menu visibleComponent={visibleComponent} setVisibleComponent={setVisibleComponent} />
      <div onClick={() => setIsMenuOpen(false)} style={{ backgroundColor: '#7F8C8D', height: '100vh', width:'100%' }}>
        <NavBar
          style={{ backgroundColor: '#7F8C8D' }}
          title='Logo'
          button={
            <Button
              text={user?.initials || ''}
              onClick={handleButtonClick}
              className='userIcon'
              style={{ backgroundColor: user?.userColor }}
            />
          }
        />
        {isMenuOpen && user && (
          <UserMenu
            name={user.name}
            email={user.email}
            initials={user.initials}
          />
        )}
        <div style={{ height: 'calc(100vh - 86px)', backgroundColor: '#BDC3C7', borderRadius: '7px', margin: '0 20px 20px 20px' }}>
          <div id='mainContent' style={{ padding: '20px' }}>
            <div>
            {visibleComponent === "home" && <Home />}
            {visibleComponent === "members" && <Members />}
        </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainPage;
