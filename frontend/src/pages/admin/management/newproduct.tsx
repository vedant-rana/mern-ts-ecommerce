import { Dropdown } from "primereact/dropdown";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import {
  useAdminCategoriesQuery,
  useCreateProductMutation,
} from "../../../redux/api/productApi";
import { RootState } from "../../../redux/store";
import { responseToast } from "../../../utils/features";
import Loader from "../../../components/Loader";

const NewProduct = () => {
  // getting id of admin from user state of redux which is required to create new product
  const { user } = useSelector((state: RootState) => state.userReducer);

  // calling RTK QUERY API of creating new product
  const [newProduct] = useCreateProductMutation();
  const { isError, data, isLoading } = useAdminCategoriesQuery(user?._id!);

  const navigate = useNavigate();

  const [allCategories, setAllCategories] = useState<string[]>([]);

  const [name, setName] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [price, setPrice] = useState<number>();
  const [stock, setStock] = useState<number>();
  const [photoPrev, setPhotoPrev] = useState<string>("");
  const [photo, setPhoto] = useState<File>();

  const changeImageHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const file: File | undefined = e.target.files?.[0];

    const reader: FileReader = new FileReader();

    if (file) {
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setPhotoPrev(reader.result);
          setPhoto(file);
        }
      };
    }
  };

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name || !category || !price || stock! < 0 || !photo) {
      return toast.error("All Fields are required!!!");
    }

    const formData = new FormData();
    formData.set("name", name);
    formData.set("category", category);
    formData.set("price", price.toString());
    formData.set("stock", stock!.toString());
    formData.set("photo", photo);

    const res = await newProduct({
      id: user?._id!,
      formData: formData,
    });

    responseToast(res, navigate, "/admin/product");
  };

  useEffect(() => {
    if (data && data.categories) {
      const adminCategoriesData: string[] = data.categories.map(
        (category) => category.name
      );
      setAllCategories(adminCategoriesData);
    }
  }, [data]);

  if (isError) return toast.error("Failed to Load Categories");

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="product-management">
        {isLoading ? (
          <Loader />
        ) : (
          <article>
            <form onSubmit={submitHandler}>
              <h2>New Product</h2>
              <div>
                <label>Name</label>
                <input
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label>Price</label>
                <input
                  type="number"
                  placeholder="Price"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  required
                />
              </div>
              <div>
                <label>Stock</label>
                <input
                  type="number"
                  placeholder="Stock"
                  value={stock}
                  onChange={(e) => setStock(Number(e.target.value))}
                  required
                />
              </div>
              {/* 
            <div>
              <label>Category</label>
              <input
                type="text"
                placeholder="eg. laptop, camera etc"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              />
            </div> */}
              <div>
                <label>Category</label>
                <Dropdown
                  options={allCategories}
                  placeholder="Select category"
                  onChange={(e) => setCategory(e.value)}
                  value={category}
                  style={{ padding: "0.7rem", width: "100%" }}
                />
              </div>

              <div>
                <label>Photo</label>
                <input type="file" onChange={changeImageHandler} required />
              </div>

              {photoPrev && <img src={photoPrev} alt="New Image" />}
              <button type="submit">Create</button>
            </form>
          </article>
        )}
      </main>
    </div>
  );
};

export default NewProduct;
