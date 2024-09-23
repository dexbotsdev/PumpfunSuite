import React from "react";
import { Link, useLocation } from "react-router-dom";

import "./style.scss";

import { ReactComponent as Community } from "../../assets/svg/buttons/Community.svg";
import { ReactComponent as Guides } from "../../assets/svg/buttons/Guides.svg";
import { ReactComponent as Support } from "../../assets/svg/buttons/Support.svg";
import { ReactComponent as Watchlist } from "../../assets/svg/buttons/asset-2.svg";
import { ReactComponent as AITradingBots } from "../../assets/svg/buttons/asset-3.svg";
import { ReactComponent as Wallet } from "../../assets/svg/buttons/asset-4.svg";
import { ReactComponent as Markets } from "../../assets/svg/buttons/asset-1.svg";
import { ReactComponent as Asset1 } from "../../assets/svg/buttons/white/21Asset1.svg";
import { ReactComponent as Asset2 } from "../../assets/svg/buttons/white/21Asset2.svg";
import { ReactComponent as Asset3 } from "../../assets/svg/buttons/white/21Asset3.svg";
import { ReactComponent as Asset4 } from "../../assets/svg/buttons/white/21Asset4.svg";
import { ReactComponent as Asset5 } from "../../assets/svg/buttons/white/21Asset5.svg";
import { ReactComponent as Asset6 } from "../../assets/svg/buttons/white/21Asset6.svg";
import { ReactComponent as Asset7 } from "../../assets/svg/buttons/white/21Asset7.svg";

interface ButtonsProps {
  hendlActiveTitle: (value: string) => void;
  hendlUnactiveSidebar: () => void;
}

interface IDataButtons {
  name: string;
  svg: React.FC<React.SVGAttributes<SVGElement>>;
  svgActive: React.FC<React.SVGAttributes<SVGElement>>;
  link: string;
}

const dataButtons: IDataButtons[] = [
  {
    name: "Home",
    svgActive: Asset1,
    svg: Markets,
    link: "/app",
  },
  {
    name: "My Projects",
    svgActive: Asset2,
    svg: Watchlist,
    link: "/app/myprojects",
  },
  {
    name: "Launch Bundle",
    svgActive: Asset3,
    svg: AITradingBots,
    link: "/app/launchBundle",
  },
  {
    name: "Manage Bundle",
    svgActive: Asset4,
    svg: Asset4,
    link: "/app/manageLaunch",
  },
  // {
  //   name: "Manage Launch",
  //   svgActive: Asset4,
  //   svg: Wallet,
  //   link: "/manageLaunch",
  // },
  // {
  //   name: "Wallet",
  //   svgActive: Asset4,
  //   svg: Wallet,
  //   link: "/wallet",
  // },
  // {
  //   name: "Guides",
  //   svgActive: Asset5,
  //   svg: Guides,
  //   link: "/guides",
  // },
  // {
  //   name: "Community",
  //   svgActive: Asset6,
  //   svg: Community,
  //   link: "/community",
  // },
  // {
  //   name: "Support",
  //   svgActive: Asset7,
  //   svg: Support,
  //   link: "/support",
  // },
];

export const Buttons: React.FC<ButtonsProps> = ({
  hendlActiveTitle,
  hendlUnactiveSidebar,
}) => {
  const path = useLocation().pathname;

  const [isActiveHoverIcon, setIsActiveHoverIcon] = React.useState(10);
  console.log(isActiveHoverIcon);

  React.useEffect(() => {
    hendlUnactiveSidebar();
    //eslint-disable-next-line
  }, [path]);

  const showNameForTitle = (data: IDataButtons[]): string => {
    if (path.includes("market")) {
      return "Markets";
    }

    if (path.includes("launchBundle")) {
      return "Launch A Token";
    }

    if (path.includes("manageLaunch")) {
      return "Manage launch";
    }

    const obj = data.filter((item) => item.link === path);

    return obj && obj.length>0 ?obj[0].name:'';
  };

  React.useEffect(() => {
    hendlActiveTitle(showNameForTitle(dataButtons));

    // eslint-disable-next-line
  }, [path]);

  const chosenNameOfMenuBotton = (link: string, index: number) => {
    const active = path === link;

    if (index === 0 && path.includes("market")) {
      return "active";
    }

    if (index === 2 && path.includes("ai-trading-bots")) {
      return "active";
    }

    if (index === 2 && path.includes("create-strategy")) {
      return "active";
    }

    return active ? "active" : "";
  };

  return (
    <nav>
      {dataButtons.map(
        (
          { name, svgActive: SvgActive, svg: Svg, link }: IDataButtons,
          index: number
        ) => {
          const i = index;
          return (
            <Link
              to={link}
              key={i}
              onMouseEnter={() => setIsActiveHoverIcon(i)}
              onMouseLeave={() => setIsActiveHoverIcon(10)}
            >
              <button className={chosenNameOfMenuBotton(link, i)}>
                {isActiveHoverIcon === i ||
                chosenNameOfMenuBotton(link, i) === "active" ? (
                  <SvgActive className={"svg svg-active"} />
                ) : (
                  <Svg className={"svg"} />
                )}
                <div>{name}</div>
              </button>
            </Link>
          );
        }
      )}
    </nav>
  );
};
