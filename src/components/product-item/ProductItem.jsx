import React, { useState, useCallback, useMemo, memo } from "react";
import DragIcon from "../../assets/icon/dragicon.svg";
import PencilIcon from "../../assets/icon/pencilicon.svg";
import StyleCss from "./ProductItem.module.css";
import { VariantItem } from "../variant-item/VariantItem";
import { DiscountEditor } from "../ui/discount-editor/DiscountEditor";
import { DISCOUNT_TYPES, DISCOUNT_LIMITS, DEFAULT_DISCOUNT } from "../../constants/discount";

export const ProductItem = memo(
  ({
    onAddProduct,
    product,
    index,
    addDiscountDetails,
    addVariantDiscountDetails,
    productLength,
    moveProduct,
    moveVariant,
    removeVariant,
    removeProduct,
  }) => {
    const [isAddingDiscount, setIsAddingDiscount] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [showVariant, setShowVariant] = useState(false);
    const [showErrorText, setShowErrorText] = useState(false);

    const [discountDetails, setDiscountDetails] = useState(
      product?.discountDetails ?? DEFAULT_DISCOUNT,
    );

    const onDragStart = useCallback(
      (e) => {
        e.dataTransfer.setData("text/plain", index);
        e.dataTransfer.effectAllowed = "move";
      },
      [index],
    );

    const onDragOver = useCallback((e) => {
      e.preventDefault();
    }, []);

    const onDrop = useCallback(
      (e) => {
        e.preventDefault();
        const productId = e.dataTransfer.getData("productId");
        if (productId) return;
        const fromIndex = Number(e.dataTransfer.getData("text/plain"));
        moveProduct(fromIndex, index);
      },
      [index, moveProduct],
    );

    const toggleDiscount = useCallback(() => {
      if (product) {
        setIsAddingDiscount((p) => !p);
      } else {
        setShowErrorText(true);
      }
    }, [product]);

    const toggleDropdown = useCallback(() => setIsDropdownOpen((p) => !p), []);

    const toggleVariant = useCallback(() => setShowVariant((p) => !p), []);

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
      addDiscountDetails(product, discountDetails);
      setIsAddingDiscount(false);
    }, [addDiscountDetails, product, discountDetails]);

    const hasSingleVariant = (product?.variants?.length ?? 0) === 1;
    const showVariants = showVariant || hasSingleVariant;

    const renderedVariants = useMemo(
      () =>
        showVariants &&
        product?.variants?.map((variant, variantIndex) => (
          <VariantItem
            key={variant.id}
            variant={variant}
            productId={product.id}
            variantIndex={variantIndex}
            variantLength={product?.variants?.length || 0}
            addVariantDiscountDetails={addVariantDiscountDetails}
            moveVariant={moveVariant}
            removeVariant={removeVariant}
          />
        )),
      [showVariants, product, addVariantDiscountDetails, moveVariant, removeVariant],
    );

    return (
      <div
        className={StyleCss.ProductItem}
        onDragOver={onDragOver}
        onDrop={onDrop}
      >
        <div className={StyleCss["ProductItem__Content"]}>
          <img
            src={DragIcon}
            className={StyleCss["ProductItem__Icon"]}
            alt="Drag to reorder product"
            draggable
            onDragStart={onDragStart}
            role="button"
            tabIndex={0}
          />

          <span className={StyleCss["ProductItem__Index"]}>
            {index + 1}.
          </span>

          <div className={StyleCss["ProductItem__Input--Box"]}>
            <p className={StyleCss["ProductItem__PlaceHolder"]}>
              {product ? product.title : "Select Product"}
            </p>
            <img
              src={PencilIcon}
              className={StyleCss["ProductItem__Icon"]}
              alt="Edit product selection"
              onClick={onAddProduct}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onAddProduct();
                }
              }}
            />
          </div>

          <div className={StyleCss["ProductItem__Discount--Row"]}>
            {isAddingDiscount ? (
              <DiscountEditor
                discountDetails={discountDetails}
                isDropdownOpen={isDropdownOpen}
                onDiscountChange={onDiscountChange}
                toggleDropdown={toggleDropdown}
                setPercent={setPercent}
                setFlat={setFlat}
                saveDiscount={saveDiscount}
              />
            ) : (
              <button
                className={StyleCss["ProductItem__Add--Discount--Button"]}
                onClick={toggleDiscount}
              >
                Add Discount
              </button>
            )}
            {product && productLength > 0 && removeProduct && (
              <span
                className={StyleCss["ProductItem__Close__Icon"]}
                onClick={() => removeProduct(index)}
                role="button"
                aria-label="Remove product"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    removeProduct(index);
                  }
                }}
              >
                ×
              </span>
            )}
          </div>
        </div>
        {showErrorText && (
          <small className={StyleCss["ProductItem__Error--Text"]}>
            Please select a product first.
          </small>
        )}
        {product?.variants && product.variants.length > 1 && (
          <p
            onClick={toggleVariant}
            className={StyleCss["ProductItem__Show--Variant--Text"]}
          >
            {showVariant ? "Hide" : "Show"} Variant
            <span
              className={`${StyleCss["ProductItem__Variant--Arrow"]} ${
                showVariant ? StyleCss["ProductItem__Variant--Arrow--up"] : StyleCss["ProductItem__Variant--Arrow--down"]
              }`}
            />
          </p>
        )}

        {renderedVariants}

        {index < productLength && (
          <div className={StyleCss["ProductItem__Divider--Div"]}>
            <hr className={StyleCss["ProductItem__Divider"]} />
          </div>
        )}
      </div>
    );
  },
);
