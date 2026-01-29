import React from "react";
import StyleCss from "./UiComponent.module.css";

export const ApiError = ({ error, onRetry }) => {
  return (
    <div className={StyleCss.ApiError}>
      <h3 className={StyleCss["ApiError__Title"]}>Failed to load products</h3>
      <p className={StyleCss["ApiError__Message"]}>
        {error || "Unable to fetch products. Please try again."}
      </p>
      {onRetry && (
        <button className={StyleCss["ApiError__Button"]} onClick={onRetry}>
          Retry
        </button>
      )}
    </div>
  );
};
