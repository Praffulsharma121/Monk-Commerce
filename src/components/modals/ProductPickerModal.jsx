import React, { useEffect, useState, useRef, useCallback } from "react";
import StyleCss from "./ProductPickerModal.module.css";
import { useFetch } from "../../hooks/useFetch";
import { useDebouncer } from "../../hooks/useDebouncer";
import { Loader } from "../ui/loader/Loader";
import { ApiError } from "../ui/api-error/ApiError";
import { EmptyState } from "../ui/empty-state/EmptyState";
import SearchIcon from "../../assets/icon/searchicon.svg";

export const ProductPickerModal = ({
  isOpen,
  onClose,
  onAddingProduct,
  selectedProductList,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebouncer(searchTerm, 250);
  const [page, setPage] = useState(1);
  const modalBodyRef = useRef(null);
  const prevSearchRef = useRef("");
  const isLoadingMoreRef = useRef(false);

  const { response, loading, error, refetch } = useFetch({
    search: debouncedSearch,
    page: page,
    limit: 10,
    append: page > 1,
  });

  const [selectedProducts, setSelectedProducts] = useState(selectedProductList);

  useEffect(() => {
    if (isOpen) {
      setSearchTerm("");
      setPage(1);
      setSelectedProducts(selectedProductList);
      prevSearchRef.current = "";
      isLoadingMoreRef.current = false;
    }
  }, [isOpen, selectedProductList]);

  useEffect(() => {
    if (prevSearchRef.current !== debouncedSearch) {
      setPage(1);
      prevSearchRef.current = debouncedSearch;
      isLoadingMoreRef.current = false;
    }
  }, [debouncedSearch]);

  useEffect(() => {
    if (!loading) {
      isLoadingMoreRef.current = false;
    }
  }, [loading]);

  const handleScroll = () => {
    if (!modalBodyRef.current || loading || isLoadingMoreRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = modalBodyRef.current;
    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 5;
    
    if (isAtBottom) {
      isLoadingMoreRef.current = true;
      setPage((prev) => prev + 1);
    }
  };

  useEffect(() => {
    const modalBody = modalBodyRef.current;
    if (modalBody) {
      modalBody.addEventListener("scroll", handleScroll);
      return () => {
        modalBody.removeEventListener("scroll", handleScroll);
      };
    }
  }, [handleScroll]);

  if (!isOpen) return null;

  const onSelectCheckBox = (product) => {
    setSelectedProducts((prev) => {
      const exist = prev?.some((item) => item.id === product.id);
      return exist
        ? prev?.filter((i) => i.id !== product.id)
        : [...prev, product];
    });
  };

  const onSelectSubItem = (variant, product) => {
    setSelectedProducts((prev = []) => {
      const productIndex = prev.findIndex((item) => item.id === product.id);

      if (productIndex !== -1) {
        const existingProduct = prev[productIndex];

        const variantExists = existingProduct.variants.some(
          (v) => v.id === variant.id && v.product_id === product.id,
        );

        if (variantExists) {
          const updatedVariants = existingProduct.variants.filter(
            (v) => !(v.id === variant.id && v.product_id === product.id),
          );

          if (updatedVariants.length === 0) {
            return prev.filter((_, index) => index !== productIndex);
          }

          return prev.map((item, index) =>
            index === productIndex
              ? { ...item, variants: updatedVariants }
              : item,
          );
        }

        return prev.map((item, index) =>
          index === productIndex
            ? {
                ...item,
                variants: [...item.variants, variant],
              }
            : item,
        );
      }
      return [
        ...prev,
        {
          ...product,
          variants: [variant],
        },
      ];
    });
  };

  return (
    <div className={StyleCss.Modal} onClick={onClose}>
      <div
        className={StyleCss["Modal__Container"]}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={StyleCss["Modal__Header"]}>
          <h3 className={StyleCss["Modal__Title"]}>Select Products</h3>
          <button className={StyleCss["Modal__Close"]} onClick={onClose}>
            ✕
          </button>
        </div>
        <div className={StyleCss["Modal__Search"]}>
        <div className={StyleCss["Modal__Search--Input--Box"]}>
          <img src={SearchIcon} alt="Search" />
          <input
            className={StyleCss["Modal__Input--Box"]}
            type="text"
            placeholder="Search product"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search products"
          />
          {searchTerm && (
            <span
              className={StyleCss["Modal__Search--Clear"]}
              onClick={() => setSearchTerm("")}
            >
              ×
            </span>
          )}
        </div>
        </div>
        <div
          className={StyleCss["Modal__Body"]}
          ref={modalBodyRef}
        >
          {error && !loading && (
            <ApiError error={error} onRetry={refetch} />
          )}
          {!error && !loading && (!response?.products || response.products.length === 0) && (
            <EmptyState message={debouncedSearch ? "No products found for your search" : "No products available"} />
          )}
          {!error && response?.products?.map((res) => {
            return (
              <div
                className={StyleCss["Modal__Body__Item__List--Div"]}
                key={res.id}
              >
                <div className={StyleCss["Modal__Body__Item__List"]}>
                  <div>
                    <label className={StyleCss["Modal__Checkbox"]}>
                      <input
                        type="checkbox"
                        onClick={() => onSelectCheckBox(res)}
                        checked={selectedProducts.some((i) => i.id === res.id)}
                      />
                      <span className={StyleCss["Modal__Checkmark"]}></span>
                    </label>
                  </div>
                  <img
                      src={res.image?.src ?? "https://placehold.co/36x36/EEF0F3/9CA3AF/png"}
                      className={StyleCss["Modal__Item__Image"]}
                      loading="lazy"
                      alt=""
                      onError={(e) => {
                        const img = e.currentTarget;
                        img.onerror = null;
                        img.src = "https://placehold.co/36x36/EEF0F3/9CA3AF/png";
                      }}
                    />
                  <p className={StyleCss["Modal__Item__Title"]}>{res.title}</p>
                </div>
                {res.variants.map((variant) => {
                  return (
                    <div
                      className={StyleCss["Modal__Body__Item__SubList"]}
                      key={variant.id}
                    >
                      <div
                        className={
                          StyleCss["Modal__Body__Item__SubList--Check"]
                        }
                      >
                        <label className={StyleCss["Modal__Checkbox"]}>
                          <input
                            type="checkbox"
                            onClick={() => onSelectSubItem(variant, res)}
                            checked={selectedProducts?.some((pro) => {
                              return pro.variants.some(
                                (p) => p.id === variant.id && pro.id === res.id,
                              );
                            })}
                          />
                          <span className={StyleCss["Modal__Checkmark"]}></span>
                        </label>
                        <p>{variant.title}</p>
                      </div>
                      <div>
                        {variant.available && <p>{variant.available}</p>}
                        <p>${variant.price}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
          {loading && response?.products?.length > 0 && <Loader />}
        </div>
        <div className={StyleCss["Modal__Footer"]}>
          <span className={StyleCss["Modal__Footer--Text"]}>{selectedProducts.length} product selected</span>

          <div className={StyleCss["Modal__Footer__Actions"]}>
            <button className={StyleCss["Modal__Button--Secondary"]} onClick={onClose}>Cancel</button>
            <button
              className={StyleCss["Modal__Button--Primary"]}
              onClick={() => onAddingProduct(selectedProducts)}
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
