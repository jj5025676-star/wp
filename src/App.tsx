import { ProductSelectionPage } from './components/ProductSelectionPage';

function App() {
  const handleSelectProduct = (productId: string) => {
    console.log('Selected product:', productId);
  };

  return (
    <div className="min-h-screen bg-background">
      <ProductSelectionPage onSelectProduct={handleSelectProduct} />
    </div>
  );
}

export default App;
