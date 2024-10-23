// CallbackContext.js
import React, { createContext, useState, useContext } from "react";

// Create the context
const CallbackContext = createContext();

// Context Provider component
export function CallbackProvider({ children }) {
  const [callback, setCallback] = useState(null);
  const [callback2, setCallback2] = useState(null);
  return (
    <CallbackContext.Provider
      value={{ callback, callback2, setCallback, setCallback2 }}
    >
      {children}
    </CallbackContext.Provider>
  );
}

// Custom hook to use the CallbackContext
export function useActivityResult() {
  return useContext(CallbackContext);
}

// Navigate and handle the result using a promise
export const navigateForResult = (setCallback, router, pathName, params,opt=1) => {
  return new Promise((resolve) => {
    setCallback(() => resolve); // Set the callback using the context
    router.push({
      pathname: pathName,
      params: { data: JSON.stringify(params) },
    }); // Navigate to result screen
  });

  
};
