import { Outlet, useLocation } from "react-router";
import NavBar from "../components/generalUI/Navbar";
import { AnimatePresence, motion } from "motion/react";

export default function Layout() {
  const location = useLocation();
  return (
    <>
      <NavBar />
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ x: 6, opacity: 1 }}
          exit={{ x: "-60%", opacity: 0, transition: { duration: 0.2 } }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-center min-h-screen bg-gray-100"
        >
          <div>
            <Outlet />
          </div>
        </motion.main>
      </AnimatePresence>
    </>
  );
}
