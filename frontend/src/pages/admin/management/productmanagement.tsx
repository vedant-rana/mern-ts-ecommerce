import { ConfirmDialog } from "primereact/confirmdialog";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { SkelatonLoader } from "../../../components/Loader";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import {
  useAdminCategoriesQuery,
  useDeleteProductMutation,
  useProductDetailsQuery,
  useUpdateProductMutation,
} from "../../../redux/api/productApi";
import { server } from "../../../redux/store";
import { UserReducerInitialState } from "../../../types/reducerTypes";
import { confirmDialogBox } from "../../../utils/confirmDialogBox";
import { responseToast } from "../../../utils/features";
import toast from "react-hot-toast";
import { Dropdown } from "primereact/dropdown";

const Productmanagement = () => {
  // getting id of admin from user state of redux which is required to create new product
  const { user } = useSelector(
    (state: { userReducer: UserReducerInitialState }) => state.userReducer
  );

  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  const params = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isError } = useProductDetailsQuery(params.id!);
  const {
    isError: categoryError,
    data: categoryData,
    isLoading: categoryLoading,
  } = useAdminCategoriesQuery(user?._id!);

  const { name, price, stock, photo, category } = data?.product || {
    _id: "",
    name: "",
    price: 0,
    stock: 0,
    photo: "",
    category: "",
  };

  const [priceUpdate, setPriceUpdate] = useState<number>(price);
  const [stockUpdate, setStockUpdate] = useState<number>(stock);
  const [nameUpdate, setNameUpdate] = useState<string>(name);
  const [categoryUpdate, setCategoryUpdate] = useState<string>(category);
  const [photoUpdate, setPhotoUpdate] = useState<string>("");
  const [photoFile, setPhotoFile] = useState<File>();

  const [allCategories, setAllCategories] = useState<string[]>([]);

  const changeImageHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const file: File | undefined = e.target.files?.[0];

    const reader: FileReader = new FileReader();

    if (file) {
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setPhotoUpdate(reader.result);
          setPhotoFile(file);
        }
      };
    }
  };

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();

    if (nameUpdate) formData.set("name", nameUpdate);
    if (priceUpdate) formData.set("price", priceUpdate.toString());
    if (stockUpdate !== undefined)
      formData.set("stock", stockUpdate.toString());
    if (photoFile) formData.set("photo", photoFile);
    if (categoryUpdate) formData.set("category", categoryUpdate);

    const res = await updateProduct({
      userId: user?._id!,
      productId: data?.product._id!,
      formData: formData,
    });

    responseToast(res, navigate, "/admin/product");
  };

  const deleteProductFunction = async () => {
    const res = await deleteProduct({
      userId: user?._id!,
      productId: data?.product._id!,
    });

    responseToast(res, navigate, "/admin/product");
  };

  const deleteHandler = async () => {
    confirmDialogBox({
      message: "Are you sure you want to Delete ?",
      header: "Confirmation",
      acceptFunction: deleteProductFunction,
    });
  };

  useEffect(() => {
    if (data) {
      setNameUpdate(data.product.name);
      setPriceUpdate(data.product.price);
      setStockUpdate(data.product.stock);
      setCategoryUpdate(data.product.category);
    }
    if (categoryData && categoryData.categories) {
      const adminCategoriesData: string[] = categoryData.categories.map(
        (category) => category.name
      );
      setAllCategories(adminCategoriesData);
    }
  }, [data, categoryData]);

  if (isError) return <Navigate to={"/404"} />;
  if (categoryError) return toast.error("Unable to find all categories");

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="product-management">
        {isLoading || categoryLoading ? (
          <SkelatonLoader length={20} />
        ) : (
          <>
            <section>
              <strong>ID - {data?.product._id}</strong>
              <img src={`${server}/${photo}`} alt="Product" />
              <p>{name}</p>
              {stock > 0 ? (
                <span className="green">{stock} Available</span>
              ) : (
                <span className="red"> Not Available</span>
              )}
              <h3>₹{price}</h3>
            </section>
            <article>
              <button className="product-delete-btn" onClick={deleteHandler}>
                <FaTrash />
              </button>
              <form onSubmit={submitHandler}>
                <h2>Manage</h2>
                <div>
                  <label>Name</label>
                  <input
                    type="text"
                    placeholder="Name"
                    value={nameUpdate}
                    onChange={(e) => setNameUpdate(e.target.value)}
                  />
                </div>
                <div>
                  <label>Price</label>
                  <input
                    type="number"
                    placeholder="Price"
                    value={priceUpdate}
                    onChange={(e) => setPriceUpdate(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label>Stock</label>
                  <input
                    type="number"
                    placeholder="Stock"
                    value={stockUpdate}
                    onChange={(e) => setStockUpdate(Number(e.target.value))}
                  />
                </div>

                <div>
                  <label>Category</label>
                  <Dropdown
                    options={allCategories}
                    placeholder="Select category"
                    onChange={(e) => setCategoryUpdate(e.value)}
                    value={categoryUpdate}
                    style={{ padding: "0.7rem", width: "100%" }}
                  />
                </div>

                <div>
                  <label>Photo</label>
                  <input type="file" onChange={changeImageHandler} />
                </div>

                {photoUpdate && <img src={photoUpdate} alt="New Image" />}
                <button type="submit">Update</button>
              </form>
            </article>
          </>
        )}
      </main>
      <ConfirmDialog />
    </div>
  );
};

export default Productmanagement;
