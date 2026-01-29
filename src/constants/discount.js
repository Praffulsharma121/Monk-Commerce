// Discount type constants
export const DISCOUNT_TYPES = {
  PERCENTAGE: "% Off",
  FLAT: "flat",
};

// Discount validation
export const DISCOUNT_LIMITS = {
  MIN: 0,
  MAX: 100,
};

// Default discount values
export const DEFAULT_DISCOUNT = {
  discount: 0,
  type: DISCOUNT_TYPES.PERCENTAGE,
};
