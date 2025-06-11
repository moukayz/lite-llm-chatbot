"use client";

import { useState, useCallback, useContext, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Menu } from "lucide-react";
import React from "react";
import {
  ChatSettingsContext,
  ChatSettingsProvider,
} from "@/components/chatSettingContext";
import { usePathname } from "next/navigation";

interface ChatHeaderProps {
  showSidebar: boolean;
  setShowSidebar: (show: boolean) => void;
  showDebugPanel: boolean;
  toggleDebugPanel: () => void;
}

const ChatHeader = ({
  showSidebar,
  setShowSidebar,
  showDebugPanel,
  toggleDebugPanel,
}: ChatHeaderProps) => {
  const { chatSettings } = useContext(ChatSettingsContext);
  return (
    <div className="bg-white shadow-sm border-b p-2 flex items-center">
      {!showSidebar && (
        <button
          onClick={() => {
            setShowSidebar(true);
          }}
          className="mr-3 p-1 rounded hover:bg-gray-100 transition-all"
        >
          <Menu size={20} />
        </button>
      )}
      <h2 className="text-lg font-medium flex-grow">
        <span className="p-1 text-gray-600 rounded-md bg-yellow-200">
          Chat with {chatSettings.model.name}
        </span>
      </h2>
      <button
        onClick={toggleDebugPanel}
        className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-md text-sm font-medium flex items-center transition-colors"
      >
        {showDebugPanel ? "Hide Debug" : "Debug"}
      </button>
    </div>
  );
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const id = pathname.split("/chat/")[1];

  const [showSidebar, setShowSidebar] = useState<boolean>(true);
  const [showDebugPanel, setShowDebugPanel] = useState<boolean>(false);
  const toggleDebugPanel = useCallback(() => {
    setShowDebugPanel((prev) => !prev);
  }, []);

  // useEffect(() => {
  //   console.log("render layout in effect, id: ", id);
  // }) 

  useEffect(() => {
    console.log("render layout in effect, id: ", id);
    return () => {
      console.log("unmount layout in effect, id: ", id);
    };
  }, []);

  console.log("render layout, id: ", id);
  return (
    <ChatSettingsProvider>
      <div className="w-full flex flex-row relative h-full overflow-hidden">
        <Sidebar
          isSidebarVisible={showSidebar}
          setSidebarVisible={setShowSidebar}
          activeChatId={id}
        />

        {/* Main chat container */}
        <div className="h-full relative flex flex-col flex-1 overflow-hidden">
          <ChatHeader
            showSidebar={showSidebar}
            setShowSidebar={setShowSidebar}
            showDebugPanel={showDebugPanel}
            toggleDebugPanel={toggleDebugPanel}
          />

          <div className="flex-1 flex overflow-hidden">
            {/* Chat content container */}
            <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
              {children}
            </div>

            {/* Debug panel
          <DebugPanel
            showDebugPanel={showDebugPanel}
            toggleDebugPanel={toggleDebugPanel}
            messages={messages}
          /> */}
          </div>
        </div>
      </div>
    </ChatSettingsProvider>
  );
}
