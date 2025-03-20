"use client";

import { useState } from "react";
import Layout from "../components/Layout";
import TaskScheduler from "../components/TaskScheduler";

const Dashboard = () => {
  const [initialTaskCount, setInitialTaskCount] = useState(null); // Valeur par défaut nulle

  return (
    <Layout setInitialTaskCount={setInitialTaskCount}>
      {initialTaskCount && <TaskScheduler initialTaskCount={initialTaskCount} />}
    </Layout>
  );
};

export default Dashboard;
