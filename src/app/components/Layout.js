import Header from "./Header";
import Sidebar from "./Sidebar";
import Dashboard from "./Dashboard";

const Layout = ({ children, setInitialTaskCount, setCurrentProject, setProjectPage, projects, setProjects }) => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header - Prend toute la largeur */}
      <div className="z-40 fixed top-0 left-0 right-0">
        <Header />
      </div>

      {/* Contenu principal avec sidebar */}
      <div className="flex flex-1 pt-[60px] sm:pt-[80px]">
        {/* Sidebar */}
        <div className="w-[250px] z-50 fixed left-0 top-[60px] sm:top-[80px] bottom-0">
          <Sidebar
            setInitialTaskCount={setInitialTaskCount}
            setCurrentProject={setCurrentProject}
            setProjectPage={setProjectPage}
            projects={projects}
            setProjects={setProjects}
          />
        </div>

        {/* Contenu principal - Décalé de la largeur de la sidebar */}
        <main className="flex-1 ml-[250px] px-2 sm:px-4 lg:px-6 py-4">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;