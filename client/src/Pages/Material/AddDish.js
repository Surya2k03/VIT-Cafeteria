import React, { useState } from "react";
import "./AddDish.css";
import { ToastContainer, toast } from "react-toastify";
import { addDish } from "../../Services/Apis";

const AddDish = () => {
  const [data, setData] = useState({
    shop: "",
    dishName: "",
    price: "",
    quantity: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const formSubmit = async (e) => {
  e.preventDefault();

  if (!data.shop || !data.dishName || !data.price || !data.quantity) {
    toast.error("Enter All Input Fields");
  }

  const toSendData = {
    shop: data.shop,
    content: {
      dishName: data.dishName,
      price: data.price,
      quantity: data.quantity
    }
  };

  const response = await addDish(toSendData);
  if (response.status === 200) {
    toast.success("Dish Added Successfully");
  } else {
    toast.error("Some error occurred");
    console.log(response.data.error);
  }
  setData({
    shop: "",
    dishName: "",
    price: "",
    quantity: ""
  });
};

  return (
    <div className="container">
      <h1 className="text-center my-3">Add Dish</h1>
      <div className="d-flex justify-content-center align-items-center my-5">
        <form>
          <div class="row mb-3">
            <div class="col">
              <input
                type="text"
                class="form-control"
                placeholder="Shop Name"
                name="shop"
                value={data.shop}
                onChange={handleChange}
                required
              />
            </div>
            <div class="col">
              <input
                type="text"
                class="form-control"
                placeholder="Dish Name"
                name="dishName"
                value={data.dishName}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="row mb-3">
            <div className="col">
              <input
                type="text"
                className="form-control"
                placeholder="Price"
                name="price"
                value={data.price}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="row mb-3">
            <div className="col">
              <input
                className="form-control"
                id="text"
                name="quantity"
                placeholder="Quantity"
                value={data.quantity}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div class="row">
            <div class="col">
              <button
                type="submit"
                class="btn btn-primary btn-style-material"
                onClick={formSubmit}
              >
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AddDish;
