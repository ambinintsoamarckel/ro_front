import { redirect } from "next/navigation";
import Layout from "./components/Layout";
import TaskScheduler from "./components/TaskScheduler";

const Page = () => {
  const [initialTaskCount, setInitialTaskCount] = useState(3); // Valeur par défaut

  return (
    <Layout setInitialTaskCount={setInitialTaskCount}>
{/*       <TaskScheduler initialTaskCount={initialTaskCount} /> */}
    </Layout>
  );
};

export default function Home() {
  redirect("/login");
}
