import Navbar from "../components/generalUI/Navbar";

export default function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main className="flex items-center justify-center min-h-screen bg-blue-100">{children}</main>
    </>
  );
}
