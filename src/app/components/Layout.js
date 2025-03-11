import Header from "./Header";
import Sidebar from "./Sidebar";
import TaskScheduler from "./TaskScheduler";

const Layout = ({ children }) => {
  return (
    <div className="relative ">
      {/* Sidebar au-dessus du header */}
      <div className="absolute top-0 left-0 z-50">
        <Sidebar />
      </div>

      {/* Header (en dessous du sidebar) */}
      <div className="relative z-40">
        <Header />
      </div>

      {/* Contenu principal */}
      <main className="mt-16 p-4"><TaskScheduler/></main>
    </div>
  );
};

export default Layout;
