import React, { useState, useEffect } from 'react';
import Button from '../components/Button/Button';
import Dialog from '../components/Dialog/Dialog';
import Input from '../components/Input/Input';
import ProjectCard from '../components/ProjectCard';
import { useUser } from '../context/UserContext';

const Home: React.FC = () => {

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [nameProject, setNameProject] = useState("");
    const { user } = useUser();
    const url = process.env.REACT_APP_API_URL;

    interface Project {
        id: number;
        name: string;
        description?: string;
    }

    const [projects, setProjects] = useState<Project[]>([]);

    // + para quando hover a rota de pegar os projetos do user:
    useEffect(() => {
        async function fetchProjects() {
            try {
                const response = await fetch(`${url}/board/myBoards`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                });
                const result = await response.json();

                // Verifica se a resposta contém uma lista de projetos ou uma mensagem indicando que não há quadros
                if (Array.isArray(result.data)) {
                    setProjects(result.data);
                } else if (result.data === "Você não está em nenhum quadro.") {
                    setProjects([]); // Limpa os projetos e deixa a mensagem de vazio
                } else {
                    console.error('Resposta inesperada', result);
                }
            } catch (error) {
                console.error('Erro ao buscar projetos', error);
            }
        }

        fetchProjects();
    }, [url]);

    const handleAddProject = (newProject: Project) => {
        setProjects((prevProjects) => [...prevProjects, newProject]);
    };

    const handleAddClick = () => {
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setNameProject("");
        setIsDialogOpen(false);
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNameProject(e.target.value);
    };

    const handleConfirmClick = (event: React.MouseEvent) => {
        const newProject: Project = {
            id: Date.now(),
            name: nameProject,
            description: "",
        };

        handleAddProject(newProject);
        fetch(`${url}/board/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(newProject),
        });

        setNameProject("");
        setIsDialogOpen(false);
    };

    return (
        <div id='home'>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h2>Seus Projetos</h2>
                <Button
                    text={'Criar novo quadro'}
                    onClick={handleAddClick}
                    className='creatBoard'
                />
            </div>
            <div id='projects' style={{ display: 'flex', flexDirection: 'row', gap: '8px', marginTop: '20px', flexWrap: 'wrap', justifyContent: 'flex-start', overflowY: 'auto', height: 'calc(100vh - 197px)', alignContent: 'baseline', gridTemplateColumns: 'repeat(4, 1fr)' }}>
                {projects.length > 0 ? (
                    projects.map((project) => (
                        <ProjectCard key={project.id} title={project.name} />
                    ))
                ) : (
                    <p>Você não está em nenhum quadro. Tente criar ou se juntar a um novo projeto!</p>
                )}
            </div>

            <Dialog title="Criar quadro" isOpen={isDialogOpen} onClose={handleCloseDialog}>
                <div>
                    <Input
                        label='Titulo do Quadro'
                        type="text"
                        name="quadro"
                        placeholder="quadro"
                        value={nameProject}
                        onChange={handleNameChange}
                    />
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <Button text="Continuar" onClick={handleConfirmClick} className='login' />
                    </div>
                </div>
            </Dialog>

        </div>
    )
}

export default Home;
