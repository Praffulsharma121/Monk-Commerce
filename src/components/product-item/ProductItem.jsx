import React, { useState, useCallback, useMemo, memo } from "react";
import DragIcon from "../../assets/icon/dragicon.svg";
import PencilIcon from "../../assets/icon/pencilicon.svg";
import StyleCss from "./ProductItem.module.css";
import { VariantItem } from "../variant-item/VariantItem";

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
  }) => {
    const [isAddingDiscount, setIsAddingDiscount] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [showVariant, setShowVariant] = useState(false);
    const [showErrorText, setShowErrorText] = useState(false);

    const [discountDetails, setDiscountDetails] = useState(
      product?.discountDetails ?? { discount: 0, type: "% Off" },
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
      addDiscountDetails(product, discountDetails);
      setIsAddingDiscount(false);
    }, [addDiscountDetails, product, discountDetails]);

    const renderedVariants = useMemo(
      () =>
        showVariant &&
        product?.variants?.map((variant, variantIndex) => (
          <VariantItem
            key={variant.id}
            variant={variant}
            productId={product.id}
            variantIndex={variantIndex}
            variantLength={product?.variants?.length || 0}
            addVariantDiscountDetails={addVariantDiscountDetails}
            moveVariant={moveVariant}
          />
        )),
      [showVariant, product, addVariantDiscountDetails, moveVariant],
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
            alt=""
            draggable
            onDragStart={onDragStart}
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
              alt=""
              onClick={onAddProduct}
            />
          </div>

          {isAddingDiscount ? (
            <div className={StyleCss["ProductItem__Adding--Discount"]}>
              <input
                type="number"
                className={StyleCss["ProductItem__Adding--Discount__Input"]}
                value={discountDetails.discount}
                onChange={onDiscountChange}
                min="0"
                max="100"
              />

              <div
                className={`${StyleCss["ProductItem__Select__Wrapper"]} ${
                  isDropdownOpen ? StyleCss["ProductItem__Select__Wrapper--open"] : ""
                }`}
              >
                <div
                  className={StyleCss["ProductItem__Adding--Discount__Select"]}
                  onClick={toggleDropdown}
                >
                  <span>{discountDetails.type}</span>
                  <span className={StyleCss["ProductItem__Select__Arrow"]} />
                </div>

                {isDropdownOpen && (
                  <div className={StyleCss["ProductItem__Select__Dropdown"]}>
                    <div
                      className={StyleCss["ProductItem__Select__Option"]}
                      onClick={setPercent}
                    >
                      % Off
                    </div>
                    <div
                      className={StyleCss["ProductItem__Select__Option"]}
                      onClick={setFlat}
                    >
                      flat off
                    </div>
                  </div>
                )}
              </div>

              <span className={StyleCss["ProductItem__Close__Icon"]} onClick={saveDiscount}>
                ×
              </span>
            </div>
          ) : (
            <button
              className={StyleCss["ProductItem__Add--Discount--Button"]}
              onClick={toggleDiscount}
            >
              Add Discount
            </button>
          )}
        </div>
        {showErrorText && (
          <small className={StyleCss["ProductItem__Error--Text"]}>
            Please select a product first.
          </small>
        )}
        {product?.variants && (
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
