import { Link } from "react-router-dom";
import ProductCard from "../components/products/ProductCard";
import { useLatestProductsQuery } from "../redux/api/productApi";
import toast from "react-hot-toast";
import { SkelatonLoader } from "../components/Loader";
import { ICartItem } from "../types/types";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/reducer/cartReducer";
import HomeCarosel from "../components/HomeCarosel";

const Home = () => {
  const { data, isLoading, isError } = useLatestProductsQuery("");
  const dispatch = useDispatch();

  const addToCartHandler = (cartItem: ICartItem) => {
    if (cartItem.stock < 1) return toast.error("Out of Stock");

    dispatch(addToCart(cartItem));
    toast.success(`${cartItem.name} added to cart`);
  };

  if (isError) toast.error("Failed to Load the Products");

  return (
    <>
      <HomeCarosel />
      <div className="home">
        {/* <section></section> */}
        <h1>
          Latest Products
          <Link to="/search" className="findmore">
            More
          </Link>
        </h1>
        <main>
          {isLoading ? (
            <SkelatonLoader width="80vw" />
          ) : (
            data?.products.map((product, index) => (
              <ProductCard
                key={index}
                productId={product._id}
                name={product.name}
                price={product.price}
                stock={product.stock}
                handler={addToCartHandler}
                photo={product.photo}
              />
            ))
          )}
        </main>
      </div>
    </>
  );
};

export default Home;
