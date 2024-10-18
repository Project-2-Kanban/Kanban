import React, { useEffect, useState } from 'react';
import NavBar from '../components/NavBar/NavBar';
import Button from '../components/Button/Button';
import UserMenu from '../components/UserMenu';
import Menu from '../components/Menu';
import Home from '../components/Home';
import Members from '../components/Members';
import { useUser } from '../context/UserContext';
import Board from '../components/Board';
import ChatBot from '../components/ChatBot';

interface Card {
  title: string;
  description: string;
}

interface List {
  id: string;
  title: string;
  cards?: Card[];
  // color: string;
  // position: number;
}

interface ProjectData {
  id: number;
  title: string;
  lists: List[];
}

interface Project {
  id: number;
  name: string;
  description?: string;
}

const MainPage: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [visibleComponent, setVisibleComponent] = useState<string>("home");
  const [projectData, setProjectData] = useState<ProjectData | null>(null);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const showMembersIcon = visibleComponent === 'board' || visibleComponent === 'members';

  const { user } = useUser();

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleButtonClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    toggleMenu();
  };

  const projectListsMockData: List[] = [
    {
      id: '1',
      title: 'To Do',
      cards: [
        { title: 'Card 1', description: 'Task 1 description' },
        { title: 'Card 2', description: 'Task 2 description' },
        { title: 'Card 1', description: 'Task 1 description' },
        { title: 'Card 2', description: 'Task 2 description' },
        { title: 'Card 1', description: 'Task 1 description' },
        { title: 'Card 2', description: 'Task 2 description' },
        { title: 'Card 1', description: 'Task 1 description' },
        { title: 'Card 2', description: 'Task 2 description' },
        { title: 'Card 1', description: 'Task 1 description' },
        { title: 'Card 2', description: 'Task 2 description' },
      ],
      // color: 'pink',
      // position: 0,
    },
    {
      id: '2',
      title: 'In Progress',
      cards: [
        { title: 'Card 3', description: 'Task 3 description' },
        { title: 'Card 4', description: 'Task 4 description' }
      ],
      // color: 'red',
      // position: 1,
    },
    {
      id: '3',
      title: 'In testing',
      // color: 'red',
      // position: 1,
    },
  ];

  //!temporário. lists vai receber a response 
  const openBoard = (project: Project) => {
    setCurrentProject(project);
    setVisibleComponent('board');
  };

  useEffect(() => {
    if (currentProject) {
      setProjectData((prevState) => {
        if (!prevState) {
          return {
            id: currentProject.id,
            title: currentProject.name,
            lists: projectListsMockData 
          };
        }

        //- Atualizar o estado caso já exista.
        return {
          ...prevState,
          id: currentProject.id,
          title: currentProject.name,
          lists: projectListsMockData
        };
      });
    }
  }, [currentProject]);

  const handleBack = (project: number) => {
    setVisibleComponent('board');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <Menu visibleComponent={visibleComponent} setVisibleComponent={setVisibleComponent} showMembersIcon={showMembersIcon} />
      <div onClick={() => setIsMenuOpen(false)} style={{ backgroundColor: '#7F8C8D', height: '100vh', width: '100%', minWidth: '50%' }}>
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
              {visibleComponent === "home" && <Home openBoard={openBoard} />}
              {visibleComponent === "members" && currentProject?.id && <Members title={currentProject.name} id={currentProject.id} onBack={handleBack} />}
              {visibleComponent === "board" && projectData && (
                <Board
                  data={projectData}
                  setData={setProjectData as React.Dispatch<React.SetStateAction<ProjectData>>}
                />
              )}

            </div>
          </div>
          <ChatBot />
        </div>
      </div>
    </div>
  );
}

export default MainPage;
