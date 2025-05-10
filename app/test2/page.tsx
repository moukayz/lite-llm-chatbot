"use client";

import { GenericSidebar } from "../components/GenericSidebar";
import { useState } from "react";

export default function App() {
  const [isMySidebarVisible, setMySidebarVisible] = useState(true);

  return (
    <>
      <div className="flex flex-col h-screen items-start">
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
            {/* Add your custom sidebar content here */}
            <p>This is content inside the generic sidebar.</p>
            <button onClick={() => console.log("Button clicked!")}>
              Click me
            </button>
          </GenericSidebar>
        </div>
        {/* Rest of your app */}
      </div>
    </>
  );
}