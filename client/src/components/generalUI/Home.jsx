import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

export default function Home() {
  const user = useSelector((state) => state.auth.user);
  let navigate = useNavigate();

  if (!user) {
    navigate("/");
  }

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Welcome back, {user.username}!</h1>
    </div>
  );
}
