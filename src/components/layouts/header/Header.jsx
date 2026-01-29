import React from "react";
import monkIcon from "../../../assets/icon/monkicon.svg";
import StyleCss from "./Header.module.css";

export const Header = () => {
  return (
    <div className={StyleCss.Header}>
      <div className={StyleCss["Header__Div"]}>
        <img src={monkIcon} alt="" />
        <p className={StyleCss["Header__Text"]}>Monk Upsell & Cross-sell</p>
      </div>
      <hr className={StyleCss["Header__Hr"]} />
    </div>
  );
};
