import Header from "./Header";
import Sidebar from "./Sidebar";
//import TaskScheduler from "./TaskScheduler";

const Layout = ({ children , setInitialTaskCount, setCurrentProject, setProjectPage }) => {
  return (
    <div className="relative ">
      {/* Sidebar au-dessus du header */}
      <div className="absolute top-0 left-0 z-50">
       <Sidebar setInitialTaskCount={setInitialTaskCount} setCurrentProject={setCurrentProject} setProjectPage={setProjectPage}/>

      </div>

      {/* Header (en dessous du sidebar) */}
      <div className="relative z-40">
        <Header />
      </div>

      {/* Contenu principal */}
      <main className="ml-[250px] mt-[60px] p-4">
        {children} 
      </main>
    </div>
  );
};

export default Layout;
