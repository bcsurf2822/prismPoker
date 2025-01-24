import LoginForm from "./components/authentication/LoginForm";
import { useSelector } from "react-redux";

function App() {
  const user = useSelector((state) => state.auth.user);
  console.log("User App", user)

  return (
    <div>
      {user ? (
        <h1 className="text-2xl font-bold">Welcome back, {user.username}!</h1>
      ) : (
        <LoginForm />
      )}
    </div>
  );
}

export default App;
