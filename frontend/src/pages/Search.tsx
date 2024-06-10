import { useState } from "react";
import ProductCard from "../components/products/ProductCard";
import {
  useCategoriesQuery,
  useSearchProductsQuery,
} from "../redux/api/productApi";
import toast from "react-hot-toast";
import { CustomError } from "../types/apiTypes";
import { SkelatonLoader } from "../components/Loader";
import { ICartItem } from "../types/types";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/reducer/cartReducer";

const Search = () => {
  const dispatch = useDispatch();
  const {
    data: CategoriesResponse,
    isLoading: loadingCategories,
    isError: categoryIsError,
    error: categoryError,
  } = useCategoriesQuery("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [maxPrice, setMaxPrice] = useState(100000);
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);

  const {
    isLoading: productLoading,
    data: searchedData,
    isError: productIsError,
    error: productError,
  } = useSearchProductsQuery({
    search,
    category,
    page,
    sort,
    price: maxPrice,
  });

  const isPrevPage = page > 1;
  const isNextPage = searchedData && page < searchedData.totalPage;

  const addToCartHandler = (cartItem: ICartItem) => {
    if (cartItem.stock < 1) return toast.error("Out of Stock");

    dispatch(addToCart(cartItem));
    toast.success(`${cartItem.name} added to cart`);
  };

  if (categoryIsError || productIsError) {
    const err = (categoryError || productError) as CustomError;
    toast.error(err.data.message);
  }
  // if (isError) toast.error((error as CustomError).data.message);
  // if (productIsError) toast.error((productError as CustomError).data.message);

  return (
    <div className="product-search-page">
      <aside>
        <h2>Filters</h2>
        <div>
          <h4>Sort</h4>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="">None</option>
            <option value="asc">Price (Low to High)</option>
            <option value="dsc">Price (High to Low)</option>
          </select>
        </div>
        <div>
          <h4>Max Price: {maxPrice || ""}</h4>
          <input
            type="range"
            min={100}
            max={100000}
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
          />
        </div>
        <div>
          <h4>Category</h4>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All</option>
            {loadingCategories === false &&
              CategoriesResponse?.categories.map((category, index) => (
                <option
                  value={category}
                  key={index}
                  style={{ textTransform: "capitalize" }}
                >
                  {category}
                </option>
              ))}
          </select>
        </div>
      </aside>
      <main>
        <h1>Products</h1>
        <input
          type="text"
          placeholder="Search by Name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {productLoading ? (
          <SkelatonLoader length={15} />
        ) : (
          <div className="search-product-list">
            {searchedData?.products.map((product, index) => (
              <ProductCard
                key={index}
                productId={product._id}
                name={product.name}
                price={product.price}
                stock={product.stock}
                handler={addToCartHandler}
                photo={product.photo}
              />
            ))}
          </div>
        )}

        {/* pagination should display only total page is > 1  */}
        {searchedData && searchedData?.totalPage > 1 && (
          <article>
            <button
              disabled={!isPrevPage}
              onClick={() => setPage((prev) => prev - 1)}
            >
              prev
            </button>
            <span>
              {page} of {searchedData?.totalPage}
            </span>
            <button
              disabled={!isNextPage}
              onClick={() => setPage((prev) => prev + 1)}
            >
              next
            </button>
          </article>
        )}
      </main>
    </div>
  );
};

export default Search;
