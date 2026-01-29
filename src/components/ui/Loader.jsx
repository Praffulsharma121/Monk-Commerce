import React from "react";
import StyleCss from "./UiComponent.module.css";

export const Loader = () => {
  return (
    <div className={StyleCss.Loader}>
      <div className={StyleCss["Loader__Spinner"]} />
    </div>
  );
};
