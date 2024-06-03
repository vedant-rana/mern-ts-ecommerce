import { Link } from "react-router-dom";
import ProductCard from "../components/products/ProductCard";

const Home = () => {
  const addToCartHandler = () => {};
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
        <ProductCard
          productId="jdciawbid"
          name="Mac Book"
          price={14900}
          stock={2}
          handler={addToCartHandler}
          photo="https://c.media-amazon.com/images/I/71jG+e7roXL._SX522_.jpg"
        />
      </main>
    </div>
  );
};

export default Home;
