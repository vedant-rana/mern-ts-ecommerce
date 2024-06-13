import { ReactElement, useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { Column } from "react-table";
import AdminSidebar from "../../components/admin/AdminSidebar";
import TableHOC from "../../components/admin/TableHOC";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import {
  useAllUsersQuery,
  useDeleteUserMutation,
} from "../../redux/api/userApi";
import { CustomError } from "../../types/apiTypes";
import toast from "react-hot-toast";
import { SkelatonLoader } from "../../components/Loader";
import { responseToast } from "../../utils/features";
import { ConfirmDialog } from "primereact/confirmdialog";
import { confirmDialogBox } from "../../utils/confirmDialogBox";

interface DataType {
  avatar: ReactElement;
  name: string;
  email: string;
  gender: string;
  role: string;
  action: ReactElement;
}

const columns: Column<DataType>[] = [
  {
    Header: "Avatar",
    accessor: "avatar",
  },
  {
    Header: "Name",
    accessor: "name",
  },
  {
    Header: "Gender",
    accessor: "gender",
  },
  {
    Header: "Email",
    accessor: "email",
  },
  {
    Header: "Role",
    accessor: "role",
  },
  {
    Header: "Action",
    accessor: "action",
  },
];

const Customers = () => {
  const { user } = useSelector((state: RootState) => state.userReducer);
  const { isLoading, isError, error, data } = useAllUsersQuery(user?._id!);
  const [deleteUser] = useDeleteUserMutation();

  const [rows, setRows] = useState<DataType[]>([]);

  if (isError) toast.error((error as CustomError).data.message);

  const deleteUserFunction = async (userId?: string) => {
    const res = await deleteUser({ userId: userId!, adminUserId: user?._id! });
    return responseToast(res, null, "");
  };

  const deleteHandler = (userId: string) => {
    // confirmDialog({
    //   message: "Are you sure you want to Delete?",
    //   header: "Confirmation",
    //   icon: "pi pi-exclamation-triangle",
    //   className: "custom-confirm-dialog",
    //   acceptClassName: "p-button-danger",
    //   defaultFocus: "accept",
    //   accept: () => deleteUserFunction(userId),
    //   reject: () => {
    //     return;
    //   },
    // });

    confirmDialogBox({
      message: "Are you sure you want to Delete ?",
      header: "Confirmation",
      id: userId,
      acceptFunction: deleteUserFunction,
    });
  };

  useEffect(() => {
    if (data) {
      setRows(
        data.users.map((user) => ({
          avatar: (
            <img
              style={{
                borderRadius: "50%",
              }}
              src={user.photo}
              alt={user.name}
            />
          ),
          name: user.name,
          email: user.email,
          gender: user.gender,
          role: user.role,
          action: (
            <button onClick={() => deleteHandler(user._id)}>
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
    "Customers",
    rows.length > 6
  )();

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main>{isLoading ? <SkelatonLoader length={20} /> : Table}</main>
      <ConfirmDialog />
    </div>
  );
};

export default Customers;
