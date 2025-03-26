"use client";

import { useState } from "react";
import Layout from "../components/Layout";
import TaskScheduler from "../components/TaskScheduler";
const Dashboard = () => {
  const [initialTaskCount, setInitialTaskCount] = useState(null);
  const [currentProject, setCurrentProject] = useState({}); // Valeur par défaut nulle
  const [projectPage, setProjectPage] = useState(false);
  const [projects, setProjects] = useState([]); // Valeur par défaut nulle

  return (
    <Layout setInitialTaskCount={setInitialTaskCount} setCurrentProject={setCurrentProject} setProjectPage={setProjectPage} projects={projects} setProjects={setProjects}>
      { (projectPage || initialTaskCount )&& <TaskScheduler initialTaskCount={initialTaskCount} currentProject = {currentProject}/>}

    </Layout>
  );
};

export default Dashboard;
