import { ReactElement, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaPlus, FaTrash } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Column } from "react-table";
import { SkelatonLoader } from "../../components/Loader";
import AdminSidebar from "../../components/admin/AdminSidebar";
import TableHOC from "../../components/admin/TableHOC";
import {
  useAllCouponsQuery,
  useDeleteCouponMutation,
} from "../../redux/api/couponApi";
import { RootState } from "../../redux/store";
import { CustomError } from "../../types/apiTypes";
import { responseToast } from "../../utils/features";
import { confirmDialogBox } from "../../utils/confirmDialogBox";
import { ConfirmDialog } from "primereact/confirmdialog";

interface DataType {
  id: string;
  couponName: string;
  discountAmount: number;
  createdAt: string;
  action: ReactElement;
}

const columns: Column<DataType>[] = [
  {
    Header: "Coupon ID",
    accessor: "id",
  },
  {
    Header: "Coupon Name",
    accessor: "couponName",
  },
  {
    Header: "Discount Amount",
    accessor: "discountAmount",
  },
  {
    Header: "Creation Date",
    accessor: "createdAt",
  },
  {
    Header: "Action",
    accessor: "action",
  },
];

const CouponPage = () => {
  const { user } = useSelector((state: RootState) => state.userReducer);
  const { isLoading, isError, error, data } = useAllCouponsQuery(user?._id!);
  const [deleteCoupon] = useDeleteCouponMutation();

  const [rows, setRows] = useState<DataType[]>([]);

  if (isError) toast.error((error as CustomError).data.message);

  const deleteCouponFunction = async (couponId?: string) => {
    const res = await deleteCoupon({
      adminId: user?._id!,
      couponId: couponId!,
    });
    responseToast(res, null, "");
  };

  const deleteHandler = (couponId: string) => {
    confirmDialogBox({
      message: "Are you sure you want to Delete ?",
      header: "Confirmation",
      id: couponId,
      acceptFunction: deleteCouponFunction,
    });
  };

  useEffect(() => {
    if (data) {
      setRows(
        data.coupons.map((coupon) => ({
          id: coupon._id,
          couponName: coupon.couponCode,
          discountAmount: coupon.amount,
          createdAt: coupon.createdAt.substring(0, 10) as string,
          action: (
            <button onClick={() => deleteHandler(coupon._id)}>
              <FaTrash />
            </button>
          ),
        }))
      );
    }
  }, [data]);

  const Table = TableHOC<DataType>(
    columns,
    rows,
    "dashboard-product-box",
    "Coupons",
    rows.length > 6
  )();

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main>{isLoading ? <SkelatonLoader length={20} /> : Table}</main>
      <ConfirmDialog />
      <Link to="/admin/coupon/new" className="create-product-btn">
        <FaPlus />
      </Link>
    </div>
  );
};

export default CouponPage;
