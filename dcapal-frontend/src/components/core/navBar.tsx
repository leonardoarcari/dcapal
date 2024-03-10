import { useMediaQuery } from "@react-hook/media-query";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { MEDIA_SMALL } from "@app/config";
import { ExportBtn } from "../exportBtn.jsx";

import classNames from "classnames";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../languageSwitcher";

import HAMBURGER_MENU from "@images/icons/hamburger-menu.svg";
import CLOSE_MENU from "@images/icons/close-menu.svg";
import { useDispatch } from "react-redux";
import { Step, setAllocationFlowStep } from "@app/appSlice";

const CloseBtn = ({ onClick }) => {
  return (
    <div className="cursor-pointer" onClick={onClick}>
      <img className="w-full max-w-[32px]" alt="Close menu" src={CLOSE_MENU} />
    </div>
  );
};

const MobileMenu = ({ visible, onClickTitle, toggleMenu }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const onClickMyPortfolios = () => {
    dispatch(setAllocationFlowStep({ step: Step.PORTFOLIOS }));
    toggleMenu();
  };

  const className = classNames(
    "absolute z-50 w-full h-dvh inset-0 flex flex-col justify-between bg-[#333333]",
    {
      invisible: !visible,
    }
  );

  return (
    <div className={className}>
      <div className="w-full">
        <div className="w-full h-14 min-h-[3.5rem] px-4 py-2 flex justify-between items-center bg-[#333333]">
          <div className="flex gap-x-8">
            <div
              className="text-xl font-semibold text-white"
              onClick={onClickTitle}
            >
              <Link to={"/"}>DcaPal</Link>
            </div>
          </div>
          <CloseBtn onClick={toggleMenu} />
        </div>
        <div className="grow flex flex-col px-8 py-3 gap-y-6">
          <Link to={"/allocate"} onClick={onClickMyPortfolios}>
            <div className="w-full text-2xl font-light text-white">
              {t("navbar.myPortfolios")}
            </div>
          </Link>
          <Link to={"/about"} onClick={toggleMenu}>
            <div className="w-full text-2xl font-light text-white">
              {" "}
              {t("navbar.about")}
            </div>
          </Link>
          <Link to={"/docs"} onClick={toggleMenu}>
            <div className="w-full text-2xl font-light text-white">
              {" "}
              {t("navbar.docs")}
            </div>
          </Link>
        </div>
      </div>
      <div className="self-center pb-4">
        <LanguageSwitcher />
      </div>
    </div>
  );
};

const MenuBtn = ({ onClick }) => {
  return (
    <div className="cursor-pointer" onClick={onClick}>
      <img
        className="w-full max-w-[32px]"
        alt="Hamburger"
        src={HAMBURGER_MENU}
      />
    </div>
  );
};

export const NavBar = () => {
  const [menuVisible, setMenuVisible] = useState(false);

  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = !useMediaQuery(MEDIA_SMALL);

  const toggleMenuVisible = () => {
    setMenuVisible(!menuVisible);
    document.body.classList.toggle("fixed", !menuVisible);
  };

  const onClickHome = () => {
    navigate("/");
  };

  const onClickMyPortfolios = () => {
    dispatch(setAllocationFlowStep({ step: Step.PORTFOLIOS }));
  };

  const isAllocate = location.pathname === "/allocate";

  return (
    <div className="w-full h-14 min-h-[3.5rem] px-4 py-2 flex justify-between items-center bg-[#333333]">
      <div className="flex gap-x-8">
        <div className="text-xl font-semibold text-white" onClick={onClickHome}>
          <Link to={"/"}>DcaPal</Link>
        </div>
        {!isMobile && (
          <div className="flex gap-x-5">
            <div className="text-lg font-light text-white">
              <Link to={"/allocate"} onClick={onClickMyPortfolios}>
                {t("navbar.myPortfolios")}
              </Link>
            </div>
            <div className="text-lg font-light text-white">
              <Link to={"/about"}>{t("navbar.about")}</Link>
            </div>
            <div className="text-lg font-light text-white">
              <Link to={"/docs"}>{t("navbar.docs")}</Link>
            </div>
          </div>
        )}
        {isMobile && (
          <MobileMenu
            visible={menuVisible}
            toggleMenu={toggleMenuVisible}
            onClickTitle={onClickHome}
          />
        )}
      </div>
      <div className="flex gap-x-2 items-center">
        {!isMobile && <LanguageSwitcher></LanguageSwitcher>}

        {isAllocate && <ExportBtn />}
        {isMobile && <MenuBtn onClick={toggleMenuVisible} />}
      </div>
    </div>
  );
};
