import Header from "./Header";
import Sidebar from "./Sidebar";

const Layout = ({ children, setInitialTaskCount, setCurrentProject, setProjectPage, projects, setProjects }) => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="z-40">
        <Header />
      </div>

      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="w-[250px] z-50">
          <Sidebar
            setInitialTaskCount={setInitialTaskCount}
            setCurrentProject={setCurrentProject}
            setProjectPage={setProjectPage}
            projects={projects}
            setProjects={setProjects}
          />
        </div>

        {/* Contenu principal */}
        <main className="flex-1 mt-[60px] px-2 sm:px-4 lg:px-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
