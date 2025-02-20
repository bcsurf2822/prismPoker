import { useState } from "react";
import { TbCardsFilled } from "react-icons/tb";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "motion/react";
import { useSelector, useDispatch } from "react-redux";
import { NavLink } from "react-router";
import { logoutUser } from "../../features/auth/authenticationSlice";
import { useNavigate } from "react-router";
import PropTypes from "prop-types";
const NavBar = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 250 ? true : false);
  });

  const handleLogout = () => {
    dispatch(logoutUser());
    localStorage.removeItem("authToken");
    navigate("/");
  };

  return (
    <nav
      className={`fixed top-0 z-50 w-full text-white transition-all duration-300 ease-out ${
        scrolled ? "bg-neutral-950  shadow-xl" : "bg-neutral-950/0 shadow-none"
      }`}
    >
      <div className="mx-auto flex items-center justify-between bg-neutral w-full px-4">
        <NavLink to="/" className="flex items-center gap-2">
          <span className="text-xl">PKR Poker</span>
          <TbCardsFilled className="text-2xl" />
        </NavLink>

        <div className="flex items-center justify-center gap-6 flex-1">
          {LINKS.map((link) => (
            <FlyoutLink key={link.to} to={link.to}>
              {link.text}
            </FlyoutLink>
          ))}
          {user && (
            <FlyoutLink to="#" FlyoutContent={SettingsContent}>
              Settings
            </FlyoutLink>
          )}
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <div className="text-right">
                <p className="font-bold">{user.username}</p>
                <p className="font-bold">SC: ${user.accountBalance}</p>
              </div>
              <button
                onClick={handleLogout}
                className="btn btn-outline btn-error bg-neutral"
              >
                Log Out
              </button>
            </>
          ) : (
            <>
              <div className="invisible text-right">
                <p className="font-bold">Placeholder</p>
                <p className="font-bold">SC: $0</p>
              </div>
              <button className="invisible btn btn-outline btn-error bg-neutral">
                Log Out
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

const FlyoutLink = ({ children, to, FlyoutContent }) => {
  const [open, setOpen] = useState(false);

  return (
    <div
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      className="relative h-fit w-fit"
    >
      <NavLink
        to={to}
        className={({ isActive }) =>
          `relative ${isActive ? "text-indigo-300" : "text-white"}`
        }
      >
        {children}
        <span
          style={{ transform: open ? "scaleX(1)" : "scaleX(0)" }}
          className="absolute -bottom-2 -left-2 -right-2 h-1 origin-left scale-x-0 rounded-full bg-indigo-300 transition-transform duration-300 ease-out"
        />
      </NavLink>

      <AnimatePresence>
        {open && FlyoutContent && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            className="absolute left-1/2 top-12 -translate-x-1/2"
          >
            <div className="absolute -top-6 left-0 right-0 h-6 bg-transparent" />
            <div className="absolute left-1/2 top-0 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-white" />
            <FlyoutContent />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

FlyoutLink.propTypes = {
  children: PropTypes.node.isRequired,
  to: PropTypes.string.isRequired,
  FlyoutContent: PropTypes.elementType,
};

const SettingsContent = () => {
  return (
    <div className="w-48 bg-white rounded-lg shadow-lg p-2 text-black">
      <NavLink
        to="/profile"
        className="block px-4 py-2 hover:bg-neutral-100 rounded-md"
      >
        Profile
      </NavLink>
      <NavLink
        to="/account"
        className="block px-4 py-2 hover:bg-neutral-100 rounded-md"
      >
        Account
      </NavLink>
    </div>
  );
};

const LINKS = [
  { text: "Home", to: "/" },
  { text: "About", to: "/about" },
  { text: "Games", to: "/games" },
];

export default NavBar;
