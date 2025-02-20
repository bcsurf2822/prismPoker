import { Navigate } from "react-router";
import LoginForm from "./components/authentication/LoginForm";
import { useSelector } from "react-redux";


function App() {
  const user = useSelector((state) => state.auth.user);
  

  if (user === undefined) {
    return <div>Loading...</div>;
  }

  return user ? <Navigate to="/home" replace /> : <LoginForm />;
}

export default App;
