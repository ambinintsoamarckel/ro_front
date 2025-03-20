"use client";

import { useState } from "react";
import Layout from "../components/Layout";
import TaskScheduler from "../components/TaskScheduler";
import Tache from "../components/Tache";
const Dashboard = () => {
  const [initialTaskCount, setInitialTaskCount] = useState(null);
  const [currentProject, setCurrentProject] = useState({}); // Valeur par défaut nulle
  const [projectPage, setProjectPage] = useState(false); // Valeur par défaut nulle

  return (
    <Layout setInitialTaskCount={setInitialTaskCount} setCurrentProject={setCurrentProject} setProjectPage={setProjectPage}>
      {!projectPage && initialTaskCount && <TaskScheduler initialTaskCount={initialTaskCount} currentProject = {currentProject}/>}
      {projectPage && <Tache currentProject={currentProject}/>}
    </Layout>
  );
};

export default Dashboard;
