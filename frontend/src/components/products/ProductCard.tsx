import { FaPlus } from "react-icons/fa";
import { server } from "../../redux/store";
import { ICartItem } from "../../types/types";

type ProductProps = {
  productId: string;
  name: string;
  photo: string;
  price: number;
  stock: number;
  handler: (cartItem: ICartItem) => string | undefined;
};

const ProductCard = ({
  productId,
  name,
  photo,
  price,
  stock,
  handler,
}: ProductProps) => {
  return (
    <div className="product-card">
      <img src={`${server}/${photo}`} alt={name} />
      <p>{name}</p>
      <span>₹ {price}</span>
      <div>
        <button
          onClick={() =>
            handler({
              productId,
              name,
              photo,
              price,
              stock,
              quantity: 1,
            })
          }
        >
          <FaPlus />
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
