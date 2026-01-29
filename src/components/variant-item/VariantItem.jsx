import React, { useState, useCallback, memo } from "react";
import DragIcon from "../../assets/icon/dragicon.svg";
import StyleCss from "./VariantItem.module.css";

export const VariantItem = memo(
  ({ variant, productId, variantIndex, variantLength, addVariantDiscountDetails, moveVariant }) => {
    const [isAddingDiscount, setIsAddingDiscount] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const [discountDetails, setDiscountDetails] = useState(
      variant.discountDetails ?? {
        discount: 0,
        type: "% Off",
      },
    );

    const toggleDiscount = useCallback(
      () => setIsAddingDiscount((p) => !p),
      [],
    );

    const toggleDropdown = useCallback(() => setIsDropdownOpen((p) => !p), []);

    const onDiscountChange = useCallback((e) => {
      const value = e.target.value;
      if (value === "") {
        setDiscountDetails((prev) => ({
          ...prev,
          discount: "",
        }));
        return;
      }
      const numValue = Number(value);
      if (!isNaN(numValue)) {
        const clampedValue = Math.max(0, Math.min(100, numValue));
        setDiscountDetails((prev) => ({
          ...prev,
          discount: clampedValue,
        }));
      }
    }, []);

    const setPercent = useCallback(() => {
      setDiscountDetails((p) => ({ ...p, type: "% Off" }));
      setIsDropdownOpen(false);
    }, []);

    const setFlat = useCallback(() => {
      setDiscountDetails((p) => ({ ...p, type: "flat" }));
      setIsDropdownOpen(false);
    }, []);

    const saveDiscount = useCallback(() => {
      addVariantDiscountDetails(productId, variant.id, discountDetails);
      setIsAddingDiscount(false);
    }, [addVariantDiscountDetails, productId, variant.id, discountDetails]);

    const onDragStart = useCallback(
      (e) => {
        e.stopPropagation();
        e.dataTransfer.setData("text/plain", variantIndex.toString());
        e.dataTransfer.setData("productId", productId.toString());
        e.dataTransfer.effectAllowed = "move";
      },
      [variantIndex, productId],
    );

    const onDragOver = useCallback((e) => {
      e.preventDefault();
      e.stopPropagation();
    }, []);

    const onDrop = useCallback(
      (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!moveVariant) return;
        const fromIndex = Number(e.dataTransfer.getData("text/plain"));
        const fromProductId = Number(e.dataTransfer.getData("productId"));
        if (fromProductId === productId) {
          moveVariant(productId, fromIndex, variantIndex);
        }
      },
      [variantIndex, productId, moveVariant],
    );

    return (
      <div
        className={StyleCss.VariantItem}
        onDragOver={onDragOver}
        onDrop={onDrop}
      >
        <img
          src={DragIcon}
          className={StyleCss["VariantItem__Icon"]}
          alt=""
          draggable
          onDragStart={onDragStart}
        />

        <div className={StyleCss["VariantItem__Input--Box"]}>
          <p className={StyleCss["VariantItem__PlaceHolder"]}>{variant.title}</p>
        </div>

        {isAddingDiscount ? (
          <div className={StyleCss["VariantItem__Adding--Discount"]}>
            <input
              type="number"
              className={StyleCss["VariantItem__Discount__Input"]}
              value={discountDetails.discount}
              onChange={onDiscountChange}
              min="0"
              max="100"
            />

            <div
              className={`${StyleCss["VariantItem__Select__Wrapper"]} ${
                isDropdownOpen ? StyleCss["VariantItem__Select__Wrapper--open"] : ""
              }`}
            >
              <div
                className={StyleCss["VariantItem__Select"]}
                onClick={toggleDropdown}
              >
                <span>{discountDetails.type}</span>
                <span className={StyleCss["VariantItem__Select__Arrow"]} />
              </div>

              {isDropdownOpen && (
                <div className={StyleCss["VariantItem__Select__Dropdown"]}>
                  <div
                    className={StyleCss["VariantItem__Select__Option"]}
                    onClick={setPercent}
                  >
                    % Off
                  </div>
                  <div
                    className={StyleCss["VariantItem__Select__Option"]}
                    onClick={setFlat}
                  >
                    flat off
                  </div>
                </div>
              )}
            </div>

            <span
              className={StyleCss["VariantItem__Close__Icon"]}
              onClick={saveDiscount}
            >
              ×
            </span>
          </div>
        ) : (
          <button
            className={StyleCss["VariantItem__Add--Discount--Button"]}
            onClick={toggleDiscount}
          >
            Add Discount
          </button>
        )}
      </div>
    );
  },
);
