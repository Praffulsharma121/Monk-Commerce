import React, { useState, useCallback, useMemo } from "react";
import { ProductItem } from "../product-item/ProductItem";
import StyleCss from "./ProductList.module.css";
import { ProductPickerModal } from "../modals/ProductPickerModal";

export const ProductList = () => {
  const [selectedProductList, setSelectedProductList] = useState([]);
  const [isSelectingProduct, setIsSelectingItem] = useState(false);
  const [addOne, setIsAddOne] = useState(true);
  const [error, setError] = useState("");

  const onAddProduct = useCallback(() => {
    setIsSelectingItem(true);
  }, []);

  const onAddingProduct = useCallback((productData) => {
    setSelectedProductList(productData);
    setIsAddOne(false);
    setIsSelectingItem(false);
    setError("");
  }, []);

  const addDiscountDetails = useCallback((product, discountDetails) => {
    setSelectedProductList((prev) =>
      prev.map((p) => (p.id === product.id ? { ...p, discountDetails } : p)),
    );
  }, []);

  const addVariantDiscountDetails = useCallback(
    (productId, variantId, discountDetails) => {
      setSelectedProductList((prev) =>
        prev.map((product) =>
          product.id !== productId
            ? product
            : {
                ...product,
                variants: product.variants.map((variant) =>
                  variant.id === variantId
                    ? { ...variant, discountDetails }
                    : variant,
                ),
              },
        ),
      );
    },
    [],
  );

  const moveProduct = useCallback((fromIndex, toIndex) => {
    setSelectedProductList((prev) => {
      if (fromIndex === toIndex) return prev;
      const updated = [...prev];
      const [moved] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, moved);
      return updated;
    });
  }, []);

  const moveVariant = useCallback((productId, fromIndex, toIndex) => {
    setSelectedProductList((prev) => {
      return prev.map((product) => {
        if (product.id !== productId || !product.variants) return product;
        if (fromIndex === toIndex) return product;
        const updatedVariants = [...product.variants];
        const [moved] = updatedVariants.splice(fromIndex, 1);
        updatedVariants.splice(toIndex, 0, moved);
        return { ...product, variants: updatedVariants };
      });
    });
  }, []);

  const removeVariant = useCallback((productId, variantId) => {
    setSelectedProductList((prev) =>
      prev
        .map((product) => {
          if (product.id !== productId || !product.variants) return product;
          const updatedVariants = product.variants.filter((v) => v.id !== variantId);
          if (updatedVariants.length === 0) return null;
          return { ...product, variants: updatedVariants };
        })
        .filter(Boolean),
    );
  }, []);

  const removeProduct = useCallback((index) => {
    setSelectedProductList((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const renderedProducts = useMemo(
    () =>
      selectedProductList.map((product, index) => {
        if (!product) return null;
        return (
          <ProductItem
            key={product.id}
            product={product}
            index={index}
            productLength={selectedProductList.length - 1}
            onAddProduct={onAddProduct}
            addDiscountDetails={addDiscountDetails}
            addVariantDiscountDetails={addVariantDiscountDetails}
            moveProduct={moveProduct}
            moveVariant={moveVariant}
            removeVariant={removeVariant}
            removeProduct={removeProduct}
          />
        );
      }),
    [
      selectedProductList,
      onAddProduct,
      addDiscountDetails,
      addVariantDiscountDetails,
      moveProduct,
      moveVariant,
      removeVariant,
      removeProduct,
    ],
  );

  const handleAddProductClick = () => {
    if (addOne) {
      setError("Please select the current product before adding another.");
      return;
    }
    setIsAddOne(true);
    setError("");
  };

  return (
    <div className={StyleCss.ProductList}>
      <h3 className={StyleCss["ProductList__Title"]}>Add Products</h3>

      <div className={StyleCss["ProductList__HeaderRow"]}>
        <p>Product</p>
        <p>Discount</p>
      </div>

      <div className={StyleCss["ProductList__List"]}>
        {renderedProducts}
        {addOne && <ProductItem onAddProduct={onAddProduct} index={selectedProductList.length}/>}
      </div>

      {error && <small className={StyleCss["ProductList__Error--Text"]}>{error}</small>}

      <button
        className={StyleCss["ProductList__Add--Product--Button"]}
        onClick={handleAddProductClick}
      >
        Add Product
      </button>

      <ProductPickerModal
        isOpen={isSelectingProduct}
        onClose={() => setIsSelectingItem(false)}
        onAddingProduct={onAddingProduct}
        selectedProductList={selectedProductList}
      />
    </div>
  );
};
