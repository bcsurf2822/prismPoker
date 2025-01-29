import { Navigate } from "react-router";
import LoginForm from "./components/authentication/LoginForm";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { rehydrateUser } from "./features/auth/authenticationSlice";
import SocketService from "./features/websockets/socketService";

function App() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(rehydrateUser());
    SocketService.connect(); // ✅ Connect WebSocket on App Load

    return () => {
      SocketService.disconnect(); // ✅ Cleanup on unmount
    };
  }, [dispatch]);

  if (user === undefined) {
    return <div>Loading...</div>;
  }

  return user ? <Navigate to="/home" replace /> : <LoginForm />;
}

export default App;
