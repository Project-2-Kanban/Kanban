import React, { useState, useEffect } from 'react';
import Button from '../components/Button/Button';
import Dialog from '../components/Dialog/Dialog';
import Input from '../components/Input';
import ProjectCard from '../components/ProjectCard';
import { useUser } from '../context/UserContext';

const Home: React.FC = () => {

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [nameProject, setNameProject] = useState("");
    const { user } = useUser();

    interface Project {
        id: number;
        name: string;
        description?: string;
    }

    const data = ['Adicionar Clientes CGNAT ao slot 4', 'Atualizar planilhas de controle PWN', 'Atualizar planilhas de controle CMI', 'Fazer ordens de serviço', 'atualizar contratos na planilha de IP', 'Atualizar telas de monitoramento', 'Adicionar Clientes CGNAT ao slot 4', 'Atualizar planilhas de controle PWN', 'Atualizar planilhas de controle CMI', 'Fazer ordens de serviço', 'atualizar contratos na planilha de IP', 'Atualizar telas de monitoramento', 'Adicionar Clientes CGNAT ao slot 4', 'Atualizar planilhas de controle PWN', 'Atualizar planilhas de controle CMI', 'Fazer ordens de serviço', 'atualizar contratos na planilha de IP', 'Atualizar telas de monitoramento', 'Adicionar Clientes CGNAT ao slot 4', 'Atualizar planilhas de controle PWN', 'Atualizar planilhas de controle CMI', 'Fazer ordens de serviço', 'atualizar contratos na planilha de IP', 'Atualizar telas de monitoramento']

    const [projects, setProjects] = useState<Project[]>([]);

    //!temporário
    useEffect(() => {
        const projectData = data.map((name, index) => ({
            id: index + 1,
            name: name
        }));

        setProjects(projectData);
    }, []);

    // + para quando hover a rota de pegar os projetos do user:
    // useEffect(() => {
    //   async function fetchProjects() {
    //     try {
    //       const response = await fetch('');
    //       const data = await response.json();
    //       setProjects(data); 
    //     } catch (error) {
    //       console.error('Erro ao buscar projetos', error);
    //     }
    //   }

    //   fetchProjects();
    // }, []);


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
        };

        handleAddProject(newProject);
        //! Fazer um fetch para adicionar ao banco de dados

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
                {projects.map((project) => (
                    <ProjectCard key={project.id} title={project.name} />
                ))}
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

export default Home
