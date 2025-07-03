"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Layout from "../components/Layout";
import DashboardHome from "../components/DashboardHome";
import TaskScheduler from "../components/TaskScheduler";
import { checkAuthStatus } from "@/utils/auth"; // adapte le chemin

const Dashboard = () => {
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [initialTaskCount, setInitialTaskCount] = useState(null);
  const [currentProject, setCurrentProject] = useState({});
  const [projectPage, setProjectPage] = useState(false);
  const [projects, setProjects] = useState([]);
  const [secondSidebarOpen, setSecondSidebarOpen] = useState(false);
  const [secondSidebarContent, setSecondSidebarContent] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  useEffect(() => {
    const verify = async () => {
      const user = await checkAuthStatus();
      if (!user) {
        router.replace("/login");
      } else {
        setIsCheckingAuth(false);
      }
    };
    verify();
  }, []);

  if (isCheckingAuth) return null;

  return (
    <Layout
      setInitialTaskCount={setInitialTaskCount}
      currentProject={currentProject}
      setCurrentProject={setCurrentProject}
      setProjectPage={setProjectPage}
      projects={projects}
      setProjects={setProjects}
      secondSidebarOpen={secondSidebarOpen}
      setSecondSidebarOpen={setSecondSidebarOpen}
      secondSidebarContent={secondSidebarContent}
      setSecondSidebarContent={setSecondSidebarContent}
      isModalOpen={isModalOpen}
      setIsModalOpen={setIsModalOpen}
      editModalOpen={editModalOpen}
      setEditModalOpen={setEditModalOpen}
      deleteModalOpen={deleteModalOpen}
      setDeleteModalOpen={setDeleteModalOpen}
      selectedProject={selectedProject} 
      setSelectedProject={setSelectedProject}
    >
      {projectPage ? (
        <TaskScheduler
          initialTaskCount={initialTaskCount}
          currentProject={currentProject}
          setProjects={setProjects}
          editModalOpen={editModalOpen}
          setEditModalOpen={setEditModalOpen}
          setProjectPage={setProjectPage}
          deleteModalOpen={deleteModalOpen}
          setDeleteModalOpen={setDeleteModalOpen}
          selectedProject={selectedProject} 
          setSelectedProject={setSelectedProject}
        />
      ) : (
        <DashboardHome
      secondSidebarOpen={secondSidebarOpen}
      setSecondSidebarOpen={setSecondSidebarOpen}
      secondSidebarContent={secondSidebarContent}
      setSecondSidebarContent={setSecondSidebarContent}
      isModalOpen={isModalOpen}
      setIsModalOpen={setIsModalOpen}
      projects={projects} />
      )}
    </Layout>
  );
  
};

export default Dashboard;
