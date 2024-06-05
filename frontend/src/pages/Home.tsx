import { Link } from "react-router-dom";
import ProductCard from "../components/products/ProductCard";
import { useLatestProductsQuery } from "../redux/api/productApi";
import toast from "react-hot-toast";
import Loader from "../components/Loader";

const Home = () => {
  const addToCartHandler = () => {};
  const { data, isLoading, isError } = useLatestProductsQuery("");

  if (isError) toast.error("Failed to Load the Products");
  return (
    <div className="home">
      <section></section>
      <h1>
        Latest Products
        <Link to="/search" className="findmore">
          More
        </Link>
      </h1>
      <main>
        {isLoading ? (
          <Loader />
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
  );
};

export default Home;
