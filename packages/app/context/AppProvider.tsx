import React, { useState } from "react";
import AppContext from "./AppContext";

const AppProvider = ({ children, posts }: any) => {
  const [isInitialSetup, setisInitialSetup] = useState<boolean>(true);
  return (
    <AppContext.Provider
      value={{
        isInitialSetup,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
