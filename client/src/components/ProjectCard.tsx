import React from 'react';

interface ProjectCardProps {
  title: string;
  onClick: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ title, onClick }) => {

  return (
    <div onClick={onClick} style={{borderRadius: '7px', padding: '20px', marginBottom: '10px', display: 'flex',justifyContent: 'center', height:'48px', alignItems:'center',backgroundColor: '#fefefe', boxShadow: '4px 4px 5px #00000024', cursor:'pointer', fontWeight:'bold', width:'300px', fontSize:'20px'}}>
      <p>{title}</p>
    </div>
  );
};

export default ProjectCard;
