import React from "react";

import "./style.scss";

import exitSvg from "../../assets/svg/header/exit.svg";
import notifications from "../../assets/svg/header/notifications.svg";
import messages from "../../assets/svg/header/messages.svg";
import search from "../../assets/svg/header/search.svg";
import themeDark from "../../assets/svg/header/theme-dark.svg";
import themeLight from "../../assets/svg/header/theme-light.svg";
import arrowDown from "../../assets/svg/header/arrow-down.svg";
import { ReactComponent as BurgerLine } from "../../assets/svg/header/burgerLine.svg";
import { ReactComponent as CancelClose } from "../../assets/svg/header/cancelClose.svg";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import {useKindeAuth} from "@kinde-oss/kinde-auth-react";

interface HeaderProps {
  hendlActiveSidebar: () => void;
  isActiveSidebar: boolean;
  activeNameInHeaderTitle: string;
}

export const Header: React.FC<HeaderProps> = ({
  hendlActiveSidebar,
  isActiveSidebar,
  activeNameInHeaderTitle,
}) => {

  return (
    <header className="mobile">
      <h1>{activeNameInHeaderTitle}</h1>

      <div className="user-panel">
        <UserPanel />
      </div>

      <button className="burger-menu" onClick={hendlActiveSidebar}>
        {isActiveSidebar ? (
          <CancelClose className="burger-menu__svg" />
        ) : (
          <BurgerLine className="burger-menu__svg" />
        )}
      </button>
    </header>
  );
};

export const UserPanel: React.FC = () => {

  const { logout } = useKindeAuth();

  return (
    <> 
      <div>
        <WalletMultiButton style={{ height:'32px'}}/> 
      </div>
      <div> 
        <img src={exitSvg} alt="Exit" onClick={()=>logout()}/>
      </div>
    </>
  );
};
