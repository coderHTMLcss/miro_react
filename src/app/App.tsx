import { AppHeader } from "@/features/header";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <div>
      <AppHeader />
      <Outlet />
    </div>
  );
}

export default App;
