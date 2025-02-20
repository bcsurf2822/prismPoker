import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

export default function Home() {
  const { user, loading, rehydrated } = useSelector((state) => state.auth);
  let navigate = useNavigate();

  useEffect(() => {
    if (rehydrated && !user) {
      navigate("/");
    }
  }, [rehydrated, user, navigate]);

  if (loading || !rehydrated) return <p>Loading...</p>;

  if (!user) return null;
  return (
    <div>
      <h1 className="text-2xl font-bold">Welcome back, {user.username}!</h1>
    </div>
  );
}
