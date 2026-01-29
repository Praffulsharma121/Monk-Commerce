import './App.css';
import { Header } from './components/layouts/header/Header';
import { ProductList } from './components/product-list/ProductList';
import ErrorBoundary from './components/ui/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <div className="App">
        <Header />
        <ProductList />
      </div>
    </ErrorBoundary>
  );
}

export default App;
