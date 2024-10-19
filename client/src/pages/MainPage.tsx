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
  column_id: string;
  color: string;
}

interface List {
  id: string;
  title: string;
  cards?: Card[];
}

interface ProjectData {
  id: string;
  title: string;
  lists: List[];
}

interface Project {
  id: string;
  name: string;
  description?: string;
  lists?: List[];
}

const MainPage: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [visibleComponent, setVisibleComponent] = useState<string>("home");
  const [projectData, setProjectData] = useState<ProjectData | null>(null);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const showMembersIcon = visibleComponent === 'board' || visibleComponent === 'members';

  const { user } = useUser();
  const url = process.env.REACT_APP_API_URL;

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleButtonClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    toggleMenu();
  };

  const getBoard = async (boardID: string) => {
    try {
      const response = await fetch(`${url}/board/getColumnsAndCards/${boardID}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      if (!response.ok) {
        console.log({ response });
        console.log('Erro ao pegar tudo');
        return;
      }

      const allListsandBoards = await response.json();
      console.log({ allListsandBoards });
      return allListsandBoards.data;
      //+ordenar as listas pela posição quando renderizar.
    } catch (error) {
      console.error('Erro ao pegar listas:', error);
    }
  }

  const openBoard = async (project: Project) => {
    try {
      setCurrentProject(project);

      const boardData = await getBoard(project.id);
      console.log({boardData});
      
      const list = boardData.columns;
      console.log(list);
      
      if (boardData) {
        setCurrentProject((prevProject) => {
          if (prevProject) {
            return {
              ...prevProject,
              lists: list, 
            };
          }
          return prevProject;
        });
      }
  
      setVisibleComponent('board');
    } catch (error) {
      console.error('Erro ao carregar o board:', error);
    }
  };

  useEffect(() => {
    if (currentProject) {
      setProjectData((prevState) => ({
        ...prevState,
        id: currentProject.id,
        title: currentProject.name,
        lists: currentProject?.lists || [],
      }));
    }
  }, [currentProject]);

  const handleBack = (project: string) => {
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
              {visibleComponent === "home" && <Home openBoard={async (project) => await openBoard(project as Project)} />}
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
