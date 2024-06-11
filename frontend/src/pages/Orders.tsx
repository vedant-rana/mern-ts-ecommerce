import { ReactElement, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Column } from "react-table";
import { SkelatonLoader } from "../components/Loader";
import TableHOC from "../components/admin/TableHOC";
import { useMyOrdersQuery } from "../redux/api/orderApi";
import { RootState } from "../redux/store";
import { CustomError } from "../types/apiTypes";

type DataType = {
  _id: string;
  amount: number;
  quantity: number;
  discount: number;
  status: ReactElement;
  action: ReactElement;
};

const column: Column<DataType>[] = [
  { Header: "ID", accessor: "_id" },
  { Header: "Quantity", accessor: "quantity" },
  { Header: "Discount", accessor: "discount" },
  { Header: "Amount", accessor: "amount" },
  { Header: "Status", accessor: "status" },
  { Header: "Action", accessor: "action" },
];

const Orders = () => {
  const { user } = useSelector((state: RootState) => state.userReducer);
  const { isLoading, isError, error, data } = useMyOrdersQuery(user?._id!);

  const [rows, setRows] = useState<DataType[]>([]);

  if (isError) toast.error((error as CustomError).data.message);

  useEffect(() => {
    if (data) {
      setRows(
        data.orders.map((product) => ({
          _id: product.user.name,
          amount: product.total,
          discount: product.discount,
          quantity: product.orderItems.length,
          status: (
            <span
              className={
                product.status === "Processing"
                  ? "red"
                  : product.status === "SHipped"
                  ? "green"
                  : "purple"
              }
            >
              {product.status}
            </span>
          ),
          action: <Link to={`/admin/transaction/${product._id}`}>Manage</Link>,
        }))
      );
    }
  }, [data]);

  const Table = TableHOC<DataType>(
    column,
    rows,
    "dashboard-product-box",
    "My Orders",
    rows.length > 6
  );

  return (
    <div className="container">
      <h1>My Orders</h1>
      {isLoading ? <SkelatonLoader length={20} /> : <Table />}
    </div>
  );
};

export default Orders;
