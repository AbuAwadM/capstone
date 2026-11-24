import ProductsHeading from "./Components/ProductsHeading";
import ProductToolBox from "./Components/ProductToolBox";
import ProductTable from "./Components/ProductTable";
import ProductEditSidePanel from "./Components/ProductEditSidePanel";

function ProductsPage() {
  function handleNewProduct() {
    // TODO: clear the selected row and switch the side panel to "New Product" mode.
    console.log("New product");
  }

  return (
    <div className="flex h-full gap-4 p-4">
      {/* Main content — takes the remaining 70%; the table fills the leftover height and scrolls. */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <ProductsHeading onNewProduct={handleNewProduct} />
        <ProductToolBox />
        <ProductTable />
      </div>
      {/* Side panel — fixed at 30% of the page width, fits the page height without scrolling. */}
      <aside className="w-[30%] shrink-0 overflow-hidden">
        <ProductEditSidePanel />
      </aside>
    </div>
  );
}

export default ProductsPage;
