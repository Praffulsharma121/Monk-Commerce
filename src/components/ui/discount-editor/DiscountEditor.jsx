import React from "react";
import StyleCss from "./DiscountEditor.module.css";
import { DISCOUNT_TYPES, DISCOUNT_LIMITS } from "../../../constants/discount";

export const DiscountEditor = ({
  discountDetails,
  isDropdownOpen,
  onDiscountChange,
  toggleDropdown,
  setPercent,
  setFlat,
  saveDiscount,
  onClose,
  showCloseButton = true,
}) => {
  const handleCloseClick = () => {
    if (onClose) onClose();
    else saveDiscount();
  };
  return (
    <div className={StyleCss.DiscountEditor}>
      <input
        type="number"
        className={StyleCss["DiscountEditor__Input"]}
        value={discountDetails.discount}
        onChange={onDiscountChange}
        min={DISCOUNT_LIMITS.MIN}
        max={DISCOUNT_LIMITS.MAX}
        aria-label="Discount value"
      />

      <div
        className={`${StyleCss["DiscountEditor__Select__Wrapper"]} ${
          isDropdownOpen ? StyleCss["DiscountEditor__Select__Wrapper--open"] : ""
        }`}
      >
        <div
          className={StyleCss["DiscountEditor__Select"]}
          onClick={toggleDropdown}
          role="button"
          aria-label="Select discount type"
          aria-expanded={isDropdownOpen}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              toggleDropdown();
            }
          }}
        >
          <span>{discountDetails.type}</span>
          <span className={StyleCss["DiscountEditor__Select__Arrow"]} />
        </div>

        {isDropdownOpen && (
          <div className={StyleCss["DiscountEditor__Select__Dropdown"]}>
            <div
              className={StyleCss["DiscountEditor__Select__Option"]}
              onClick={setPercent}
            >
              {DISCOUNT_TYPES.PERCENTAGE}
            </div>
            <div
              className={StyleCss["DiscountEditor__Select__Option"]}
              onClick={setFlat}
            >
              flat off
            </div>
          </div>
        )}
      </div>

      {showCloseButton && (
        <span
          className={onClose ? StyleCss["DiscountEditor__Close__Icon"] : StyleCss["DiscountEditor__Save"]}
          onClick={handleCloseClick}
          role="button"
          aria-label={onClose ? "Remove variant" : "Save discount"}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleCloseClick();
            }
          }}
        >
          {onClose ? "×" : "Save"}
        </span>
      )}
    </div>
  );
};
