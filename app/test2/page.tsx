"use client";

import { GenericSidebar } from "../components/GenericSidebar";
import React, { FC, useState, useEffect } from 'react';

interface AnimatedTextProps {
  text: string;
}

const AnimatedText: FC<AnimatedTextProps> = ({ text }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // trigger animation after first render
    setIsVisible(true);
  }, []);

  return (
    <p
      className={
        // start hidden & shifted down, then fade/slide in
        `  transition-opacity 
         duration-1000 ease-out
         ${isVisible ? 'opacity-100' : 'opacity-0'}`
      }
    >
      {text}
    </p>
  );
};

export default function App() {
  const [isMySidebarVisible, setMySidebarVisible] = useState(true);

  return (
    <>
      <AnimatedText text="
      You got it. I'll refactor the code to extract all the content currently inside the GenericSidebar into a new component named DebugSidebarContent. This new component will be defined in the same file, app/components/DebugPanel.tsx.
To ensure the layout remains consistent and to improve the component structure:
The DebugSidebarContent component will now manage the header row, which includes the Messages: ({messages.length}): title and the old/Unfold All button.
The existing MessageDisplay component will be simplified to only be responsible for rendering the list of messages. I'll remove the outer padding and title from it, as DebugSidebarContent will handle those.
Here's how I'll modify the file:" />
      {/* <div className="flex flex-col h-screen items-start">
      <button onClick={() => setMySidebarVisible(true)}>
        Open Generic Sidebar
      </button>
        <div className="grow self-end">
          <GenericSidebar
            isVisible={isMySidebarVisible}
            setVisible={setMySidebarVisible}
            title="My Custom Sidebar"
            // sidebarWidth={250} // Optionally set a custom width
          >
            <p>This is content inside the generic sidebar.</p>
            <button onClick={() => console.log("Button clicked!")}>
              Click me
            </button>
          </GenericSidebar>
        </div>
      </div> */}
    </>
  );
}