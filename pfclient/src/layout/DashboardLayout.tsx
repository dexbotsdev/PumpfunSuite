import React from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

import "./style.scss";
import { ConfigProvider } from "antd";
import enUS from "antd/locale/en_US";

interface MyContextType {
  activeBlackout: boolean;
  setActiveBlackout: React.Dispatch<React.SetStateAction<boolean>>;
}

export const BlackoutContext = React.createContext<MyContextType>({
  activeBlackout: true,
  setActiveBlackout: () => {},
});

export const DashboardLayout: React.FC = () => {
  const [isActiveSidebar, setIsActiveSidebar] = React.useState(false);
  const [activeNameInHeaderTitle, setActiveNameInHeaderTitle] =
    React.useState("");
  const [activeBlackout, setActiveBlackout] = React.useState<boolean>(false);

  const hendlActiveSidebar = () => {
    setIsActiveSidebar(!isActiveSidebar);
  };

  const hendlUnactiveSidebar = () => {
    setIsActiveSidebar(false);
  };

  const hendlActiveTitle = (value: string) => {
    setActiveNameInHeaderTitle(value);
  };

  return (
    <BlackoutContext.Provider value={{ activeBlackout, setActiveBlackout }}>
      <div className="app">
        <Sidebar
          hendlUnactiveSidebar={hendlUnactiveSidebar}
          isActiveSidebar={isActiveSidebar}
          hendlActiveTitle={hendlActiveTitle}
        />
        <div className="content">
          <Header
            hendlActiveSidebar={hendlActiveSidebar}
            isActiveSidebar={isActiveSidebar}
            activeNameInHeaderTitle={activeNameInHeaderTitle}
          />
              <ConfigProvider locale={enUS}>

          <Outlet />
          </ConfigProvider>
          <div className={isActiveSidebar ? "blackout" : ""}></div>
        </div>
      </div>
      <div
        className={activeBlackout ? "blackout-all-screen" : ""}
        onClick={() => setActiveBlackout(false)}
      ></div>
    </BlackoutContext.Provider>
  );
};
