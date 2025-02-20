
import { NavLink } from "react-router";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="mb-6">
        Sorry, the page you are looking for does not exist.
      </p>
      <NavLink to="/" className="btn btn-primary">
        Go Home
      </NavLink>
    </div>
  );
}
