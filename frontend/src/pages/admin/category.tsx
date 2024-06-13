import { Button } from "primereact/button";
import { ConfirmDialog } from "primereact/confirmdialog";
import { InputText } from "primereact/inputtext";
import { FormEvent, ReactElement, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaTrash } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Column } from "react-table";
import { SkelatonLoader } from "../../components/Loader";
import AdminSidebar from "../../components/admin/AdminSidebar";
import TableHOC from "../../components/admin/TableHOC";
import {
  useAdminCategoriesQuery,
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
} from "../../redux/api/productApi";
import { RootState } from "../../redux/store";
import { CustomError } from "../../types/apiTypes";
import { confirmDialogBox } from "../../utils/confirmDialogBox";
import { responseToast } from "../../utils/features";

interface DataType {
  name: string;
  createdBy: string;
  createdAt: string;
  action: ReactElement;
}

const columns: Column<DataType>[] = [
  {
    Header: "Catgeory Name",
    accessor: "name",
  },
  {
    Header: "Created By",
    accessor: "createdBy",
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

const Category = () => {
  const { user } = useSelector((state: RootState) => state.userReducer);
  const { isLoading, isError, error, data } = useAdminCategoriesQuery(
    user?._id!
  );
  const [newCategory] = useCreateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  const [rows, setRows] = useState<DataType[]>([]);
  const [categoryName, setCategoryName] = useState<string>("");

  if (isError) toast.error((error as CustomError).data.message);

  const deleteCategoryFunction = async (categoryId?: string) => {
    const res = await deleteCategory({
      adminId: user?._id!,
      categoryId: categoryId!,
    });
    responseToast(res, null, "");
  };

  const deleteHandler = (categoryId: string) => {
    confirmDialogBox({
      message: "Are you sure you want to Delete ?",
      header: "Confirmation",
      id: categoryId,
      acceptFunction: deleteCategoryFunction,
    });
  };

  useEffect(() => {
    if (data) {
      setRows(
        data.categories.map((category) => ({
          name: category.name.charAt(0).toUpperCase() + category.name.slice(1),
          createdBy: category.createdBy.name,
          createdAt: category.createdAt.substring(0, 10) as string,
          action: (
            <button onClick={() => deleteHandler(category._id)}>
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
    "Categories",
    rows.length > 6
  )();

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!categoryName) {
      return toast.error("Please Enter a category name");
    }
    const res = await newCategory({
      createdBy: user?._id!,
      name: categoryName.toLowerCase(),
    });
    setCategoryName("");

    responseToast(res, null, "");
  };

  return (
    <div className="admin-container">
      <AdminSidebar />

      <main>
        {isLoading ? (
          <SkelatonLoader length={20} />
        ) : (
          <>
            <article className="category-form">
              <h2 className="heading">New Category</h2>
              <form onSubmit={submitHandler} style={{ display: "flex" }}>
                <div>
                  <label>Category Name</label>
                  <InputText
                    type="text"
                    placeholder="Coupon Name"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    required
                  />
                </div>

                <Button type="submit">Create</Button>
              </form>
            </article>
            {Table}
          </>
        )}
      </main>
      <ConfirmDialog />
    </div>
  );
};

export default Category;
