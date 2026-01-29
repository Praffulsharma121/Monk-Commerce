import React from "react";
import StyleCss from "./EmptyState.module.css";

export const EmptyState = ({ message = "No products found" }) => {
  return (
    <div className={StyleCss.EmptyState}>
      <h3 className={StyleCss["EmptyState__Title"]}>{message}</h3>
      <p className={StyleCss["EmptyState__Message"]}>
        Try adjusting your search or check back later.
      </p>
    </div>
  );
};
