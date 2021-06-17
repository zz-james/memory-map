import React, { useRef } from "react";

const MemoryContext = React.createContext();

const MemoryContextProvider = ({ size, children }) => {
  if (size % 256 !== 0) {
    throw new Error("Memory size must be a multiple of 256");
  }

  const buffer = new ArrayBuffer(size);

  const numberOfPages = size / 256;

  let pages = []; // array of 256 byte pages

  for (let i = 0; i <= numberOfPages; i++) {
    pages[i] = new Uint8Array(buffer, i * 256);
  }

  const DISC = true; // Set to TRUE to load the code above DFS and relocate
  // down, so we can load the cassette version from disc

  const PROT = false; // Set to TRUE to enable the tape protection code

  const C = "0f40";
  const hiBite = parseInt(C.substring(0, 2), 16);

  const loBite = parseInt(C.substring(2, 4), 16);
  console.log(hiBite, loBite);

  pages[hiBite][loBite] = 128;

  return (
    <MemoryContext.Provider value={{ pages }}>
      {children}
    </MemoryContext.Provider>
  );
};

const useMemoryContext = (page) => {
  const context = React.useContext(MemoryContext);
  if (context === undefined) {
    throw new Error(
      "useMemoryContext must be used within a MemoryContextProvider"
    );
  }

  return context.pages[page];
};

export { MemoryContextProvider, useMemoryContext };
