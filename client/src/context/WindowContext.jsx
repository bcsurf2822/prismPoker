import PropTypes from "prop-types";
import { createContext, useContext, useState } from "react";

const OpenWindowsContext = createContext();

export const OpenWindowsProvider = ({ children }) => {
  const [openWindows, setOpenWindows] = useState({});
  return (
    <OpenWindowsContext.Provider value={{ openWindows, setOpenWindows }}>
      {children}
    </OpenWindowsContext.Provider>
  );
};

export const useOpenWindows = () => useContext(OpenWindowsContext);

OpenWindowsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
