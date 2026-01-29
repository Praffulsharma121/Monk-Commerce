# Monk Commerce – Product List Management

## Overview
This is a React-based frontend built for the Monk Commerce assignment.  
The app allows an e-commerce store owner to create and manage a list of products, handle variants, apply discounts, and reorder items based on the provided designs and API.

The focus was on clean structure, predictable state management, and keeping logic separate from UI.

## Features
- Product list with single and multiple variants
- Flat and percentage discounts at product or variant level
- Show / hide variants when applicable
- Drag-and-drop reordering of products and variants
- Product picker modal with search and multi-select
- Scroll-based pagination (10 items per fetch)
- Prevents duplicate products
- Product replacement via picker

## Tech Stack
- React JS
- JavaScript (ES6+)
- CSS Modules

## Architecture & Approach
- UI components are kept focused on rendering and user interaction
- Data fetching, pagination, and debouncing logic are extracted into custom hooks
- State is lifted only where multiple components need access
- No external state management library is used due to limited scope

## Custom Hooks
- **useFetch** – handles API calls, loading states, and pagination
- **useDebounce** – used for debounced product search

## Styling
- CSS Modules to avoid global scope issues
- BEM-like class naming for clarity and consistency

## Live Demo (optional)
https://monk-commerce-2r1h.vercel.app

## Run Locally
```bash
npm install
npm start