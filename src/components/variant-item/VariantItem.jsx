import React, { useState, useCallback, memo } from "react";
import DragIcon from "../../assets/icon/dragicon.svg";
import StyleCss from "./VariantItem.module.css";
import { DiscountEditor } from "../ui/discount-editor/DiscountEditor";
import { DISCOUNT_TYPES, DISCOUNT_LIMITS, DEFAULT_DISCOUNT } from "../../constants/discount";

export const VariantItem = memo(
  ({ variant, productId, variantIndex, variantLength, addVariantDiscountDetails, moveVariant, removeVariant }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const [discountDetails, setDiscountDetails] = useState(
      variant.discountDetails ?? DEFAULT_DISCOUNT,
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
        const clampedValue = Math.max(DISCOUNT_LIMITS.MIN, Math.min(DISCOUNT_LIMITS.MAX, numValue));
        setDiscountDetails((prev) => ({
          ...prev,
          discount: clampedValue,
        }));
      }
    }, []);

    const setPercent = useCallback(() => {
      setDiscountDetails((p) => ({ ...p, type: DISCOUNT_TYPES.PERCENTAGE }));
      setIsDropdownOpen(false);
    }, []);

    const setFlat = useCallback(() => {
      setDiscountDetails((p) => ({ ...p, type: DISCOUNT_TYPES.FLAT }));
      setIsDropdownOpen(false);
    }, []);

    const saveDiscount = useCallback(() => {
      addVariantDiscountDetails(productId, variant.id, discountDetails);
    }, [addVariantDiscountDetails, productId, variant.id, discountDetails]);

    const handleClose = useCallback(() => {
      if (removeVariant) removeVariant(productId, variant.id);
    }, [removeVariant, productId, variant.id]);

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
          alt="Drag to reorder variant"
          draggable
          onDragStart={onDragStart}
          role="button"
          tabIndex={0}
        />

        <div className={StyleCss["VariantItem__Input--Box"]}>
          <p className={StyleCss["VariantItem__PlaceHolder"]}>{variant.title}</p>
        </div>

        <DiscountEditor
          discountDetails={discountDetails}
          isDropdownOpen={isDropdownOpen}
          onDiscountChange={onDiscountChange}
          toggleDropdown={toggleDropdown}
          setPercent={setPercent}
          setFlat={setFlat}
          saveDiscount={saveDiscount}
          onClose={handleClose}
          showCloseButton={variantLength > 1}
        />
        {/* <button
            className={StyleCss["VariantItem__Add--Discount--Button"]}
            onClick={toggleDiscount}
          >
            Add Discount
          </button> */}
      </div>
    );
  },
);
