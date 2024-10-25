import React, { useEffect, useState } from 'react';
import NavBar from '../components/NavBar/NavBar';
import Button from '../components/Button/Button';
import UserMenu from '../components/UserMenu';
import Menu from '../components/Menu';
import Home from '../components/Home';
import Members from '../components/Members';
import { useUser } from '../context/UserContext';
import Board from '../components/Board';
import { useParams, useNavigate } from 'react-router-dom';
import Dialog from '../components/Dialog/Dialog';
const fundo = require('../images/deserto2.jpg');

interface Card {
  title: string;
  description: string;
  column_id: string;
  priority?: string;
}

interface List {
  id: string;
  title: string;
  cards?: Card[];
  position: string;
}

interface ProjectData {
  id: string;
  title: string;
  lists: List[];
  owner_id?:string;
}

interface Project {
  id: string;
  name: string;
  description?: string;
  lists?: List[];
  owner_id?:string;
}

const MainPage: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [visibleComponent, setVisibleComponent] = useState<string>("home");
  const [projectData, setProjectData] = useState<ProjectData | null>(null);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const showMembersIcon = visibleComponent === 'board' || visibleComponent === 'members';
  const { boardId } = useParams<{ boardId?: string }>();
  const [hasAccess, setHasAccess] = useState<boolean | null>(true);
  const [isDialogOpen, setIsDialogOpen] = useState(true);

  const navigate = useNavigate();

  const { user } = useUser();
  const url = process.env.REACT_APP_API_URL;

  useEffect(() => {
    if (boardId) {
      const loadBoard = async () => {
        try {
          const userHasAccess = await checkUserAccess(boardId);
          setHasAccess(userHasAccess);

          if (userHasAccess) {
            const boardData = await getBoard(boardId);
            if (boardData) {
              setProjectData({
                id: boardId,
                title: boardData.name,
                lists: boardData.columns || [],
              });
              setVisibleComponent('board');
            }
          } else {
            navigate('/main');
          }
        } catch (error) {
          console.error('Erro ao carregar o board:', error);
        }
      };
      loadBoard();
    }
  }, [boardId]);

  useEffect(() => {
    if (boardId && !currentProject) {
      // Verifica se o boardId está na URL e se o currentProject ainda não foi setado
      const loadBoardOnReload = async () => {
        const boardData = await getBoard(boardId);
        if (boardData) {
          setCurrentProject({
            id: boardId,
            name: boardData.name,
            lists: boardData.columns,
            owner_id: boardData.owner_id,
          });
          setVisibleComponent('board');
        }
      };
      loadBoardOnReload();
    }
  }, [boardId, currentProject]);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleButtonClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    toggleMenu();
  };

  const handleOpenMembers = () => {
    setVisibleComponent('members');
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
        return;
      }

      const allListsandBoards = await response.json();
      return allListsandBoards.data;
    } catch (error) {
      console.error('Erro ao pegar listas:', error);
    }
  }

  const checkUserAccess = async (boardID: string) => {
    try {
      const response = await fetch(`${url}/board/membersInBoard/${boardID}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        return false;
      }

      const data = await response.json();
      const members = data.data;

      const userHasAccess = members.some((member: { email: string }) => member.email === user?.email);

      return userHasAccess;
    } catch (error) {
      console.error('Erro ao verificar acesso ao board:', error);
      return false;
    }
  };

  const openBoard = async (project: Project) => {
    try {
      setCurrentProject(project);
      const userHasAccess = await checkUserAccess(project.id);
      setHasAccess(userHasAccess);

      if (userHasAccess) {
        const boardData = await getBoard(project.id);
        const list = boardData.columns;
        const ownerId = boardData.owner_id

        if (boardData) {
          setCurrentProject((prevProject) => {
            if (prevProject) {
              return {
                ...prevProject,
                lists: list,
                owner_id: ownerId,
              };
            }
            return prevProject;
          });
        }
      } else {
        navigate('/main');
      }

      setVisibleComponent('board');
      navigate(`/main/${project.id}`);
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
        owner_id: currentProject.owner_id,
      }));
    }
  }, [currentProject]);

  const handleBack = (project: string) => {
    setVisibleComponent('board');
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <Menu visibleComponent={visibleComponent} setVisibleComponent={setVisibleComponent} showMembersIcon={showMembersIcon} />
      <div onClick={() => setIsMenuOpen(false)} style={{ backgroundColor: '#7F8C8D', height: '100vh', width: '100%', minWidth: '50%', backgroundImage: visibleComponent === 'home' ? 'none' : `url(${fundo})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', display:'flex', flexDirection:'column', gap:'10px'  }}>
        <NavBar
          style={{ backgroundColor: '#7f8c8d9e', fontSize:'35px', fontWeight:'500' }}
          title='Toth'
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
            style={{ zIndex: '4' }}
          />
        )}
        <div id='roalgem' style={{ height: 'calc(100vh - 86px)', backgroundColor: '#bdc3c794', borderRadius: '7px', margin: '0 20px 20px 20px'}}>
          <div id='mainContent' style={{ }}>
            {hasAccess === false ? (
              <>
                {visibleComponent === "home" && <Home openBoard={async (project) => await openBoard(project as Project)} />}
                <Dialog title='Atenção!' isOpen={isDialogOpen} onClose={handleCloseDialog}>
                  <p>Você não tem acesso a esse projeto.</p>
                </Dialog>
              </>
            ) : (
              <>
                {visibleComponent === "home" && <Home openBoard={async (project) => await openBoard(project as Project)} />}
                {visibleComponent === "members" && currentProject?.id && (
                  <Members
                    title={currentProject.name}
                    id={currentProject.id}
                    onBack={handleBack}
                    owner={currentProject.owner_id!}
                  />
                )}
                {visibleComponent === "board" && projectData && (
                  <Board
                    data={projectData}
                    setData={setProjectData as React.Dispatch<React.SetStateAction<ProjectData>>}
                    openMembers={handleOpenMembers}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainPage;
