import React, { useEffect } from "react";

import "./style.scss";

import upbgreideCoin from "../../assets/png/upbgreide-coin.png";
import bgCard from "../../assets/png/bg-cards-user.png";
import userPhoto from "../../assets/png/user-photo.png";
import checkedUser from "../../assets/svg/header/Vector.svg";
import logo from "../../assets/Logomark.svg";

import { Buttons } from "../Buttons";
import { UserPanel } from "../Header";
import { Button } from "antd";
import {useKindeAuth} from "@kinde-oss/kinde-auth-react";
import { useNavigate } from "react-router-dom";

interface SidebarProps {
  isActiveSidebar: boolean;
  hendlActiveTitle: (value: string) => void;
  hendlUnactiveSidebar: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isActiveSidebar,
  hendlActiveTitle,
  hendlUnactiveSidebar,
}) => {

  const { user, isAuthenticated, isLoading } = useKindeAuth();
  const navigate = useNavigate();

  useEffect(()=>{ 
    if(!isAuthenticated && !user && !isLoading){
      navigate('/')
    }
  },[1])


  return (
    <aside className={`sidebar ${isActiveSidebar ? "mobile-version" : ""}`}>
      <div className={`sidebar__wrapper `}>
        <div className="sidebar__header">
          <a href="/">
            <img src={logo} alt="Logo" height="48px"/>
          </a>
          <h2>PFVerse</h2>
        </div>  
        <div className="all-amount">
          <p>Hi {user?.given_name}!</p> 
        </div> 

        <Buttons
          hendlActiveTitle={hendlActiveTitle}
          hendlUnactiveSidebar={hendlUnactiveSidebar}
        />

        <div
          className="upgreide-ad shadow"
          style={{ marginTop: isActiveSidebar ? "10px" : "20px" }}
        >
          <div>
            <h5>SUBSCRIBE TO</h5>
            <h3>Premium Tier</h3>
          </div>
           <img src={logo} alt="Upbgreide Coin" />
        </div>

        {isActiveSidebar && (
          <div className="user-panel-mobile">
            <UserPanel />
          </div>
        )}
      </div>
    </aside>
  );
};
