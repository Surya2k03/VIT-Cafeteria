import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  getAllDish,
  userData,
  deleteDish,
  updatePrice,
  addToCart
} from "../../Services/Apis";
import "./Home.css";
import Contactus from "../../Components/Contact/Contact";
import Hero from "../../Components/Hero/Hero";
import Spinner from "react-bootstrap/Spinner";
import { ToastContainer, toast } from "react-toastify";
//import Hero from "../../Components/Hero/Hero";

const Home = () => {
  const [spiner, setSpiner] = useState(false);
  const [activelink, setactivelink] = useState(0);
  const [activeShop, setActiveShop] = useState("Gazebo");
  const [data, setData] = useState([]);
  const [toUpdatePrice, setToUpdatePrice] = useState({
    dishName: "",
    currentPrice:"",
    dishId: "",
  });

  const [admin, setAdmin] = useState(false);
  const userToken = sessionStorage.getItem("userdbtoken");
  // console.log(userToken)
  let userId;
  if (userToken) {
    const [, payloadBase64] = userToken.split('.');
    if (payloadBase64) {
      const payloadJson = atob(payloadBase64);
      const payload = JSON.parse(payloadJson);
      // console.log(payload)
      userId = payload._id;
    }
  }
  console.log(userId)
  const isLoggedIn = sessionStorage.getItem("loggedIn");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const getUserData = await userData({ token: userToken });

        // Set the fetched user data to the component state
        if (getUserData.status === 200) {
          setAdmin(getUserData.data.data.isAdmin);
          //console.log("User is admin : ", admin);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    // Check if the user is logged in before making the API call
    if (isLoggedIn) {
      fetchData();
    }
  }, [isLoggedIn, userToken]);

  const buttons = {
    "Gazebo":"Gazebo",
    "Dakshin": "Dakshin",
    "Lassi House": "LH",
    "Aavin": "Aavin",
    "North square": "NQ",
  };

  const updateBtnClick = (dishId, dishName, currentPrice) => {
    setToUpdatePrice({
      shop: activeShop,
      dishId: dishId,
      dishName: dishName,
      currentPrice: currentPrice,
    });
  };

  const handlePriceUpdate = async (activeShop, index, newPrice) => {
    //console.log(toUpdateSub);
    try {
      const response = await updatePrice({
        shop: activeShop,
        dishId: index,
        price: newPrice,
      });

      if (response.status === 200) {
        toast.success(response.data.message);
        window.location.reload();
      } else {
        toast.error(response.data.error);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleDeleteClick = async (index, activeShop) => {
    try {
      const response = await deleteDish({
        shop: activeShop,
        dishId: index,
      });

      if (response.status === 200) {
        toast.success(response.data.message);
        window.location.reload();
      } else {
        toast.error(response.data.error);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  // const [cart, setCart] = useState([]);
  const handleAddToCart = async(userId, dishName, price) => {
    try{
      // console.log(userId)
      // console.log(dishName)
      // console.log(price) 
      const response = await addToCart({userId, dishName, price });
      if (response.status === 200) {
        toast.success(`${dishName} added to cart`);
      } else {
        toast.error("Failed to add item to cart");
      }
    }
    catch(error){
      toast.error("Failed to add item to cart");
      console.error("Error adding item to cart:", error);
    }
  };

  const handleLinkClick = (index) => {
    setactivelink(index);
    //console.log(buttons[Object.keys(buttons)[index]]);
    setActiveShop(buttons[Object.keys(buttons)[index]]);
  };

  useEffect(() => {
    const fetchData = async () => {
      setSpiner(true);
      const response = await getAllDish({ shop: activeShop });
      if (response.status === 200) {
        setSpiner(false);
        //console.log(response.data);
        setData(response.data.content);
        //console.log("Data is: ", data);
      } else {
        console.log(response.data);
      }
    };
    fetchData();
  }, [activeShop]);

  return (
    <>
      <ToastContainer />
      <Hero />
      <div className="my-3">
        <div className="container">
          <h1 className="h1-style">Index</h1>
          <p className="p-style">
            All the shops with their specific dishes have been provided with the current price.
            To enhance your navigation experience, we have provided an index
            that enables you to search for dishes within various shops easily. Additionally, we
            offer the prices for each dish, which are updated regularly by our system.
          </p>
        </div>
        <ul className="nav nav-pills justify-content-center">
          {Object.keys(buttons).map((button, index) => (
            <li
              key={index}
              className={`nav-item ${activelink === index ? "active" : ""}`}
            >
              <Link
                className={`nav-link ${
                  activelink === index ? "active btn-style" : ""
                }`}
                to="/"
                onClick={() => handleLinkClick(index)}
              >
                {button}
              </Link>
            </li>
          ))}
        </ul>

        {spiner ? (
          <div className="text-center my-5" style={{ color: "black" }}>
            Loading <Spinner animation="border" />
          </div>
        ) : (
          <table className="table my-3 table-style container">
            <thead>
              <tr>
                <th>S no.</th>
                <th>Dish Name</th>
                <th>Price</th>
                {isLoggedIn && !admin ? <th>Add to Cart</th> : null}
                {admin ? <th>Action</th> : null}
                {admin ? <th>Update</th> : null}
                <th>Quantity</th>
              </tr>
            </thead>
            <tbody>
              {data?.map((record, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{record.dishName}</td>
                  <td>{record.price}</td>
                  {isLoggedIn && !admin ? (
                    <td>
                      <button
                        className="btn btn-outline-success py-1 px-2"
                        onClick={() =>
                          handleAddToCart(userId, record.dishName, record.price)
                        }
                      >
                        Add to Cart
                      </button>
                    </td>
                  ) : null}
                  {admin ? (
                    <td>
                      <button
                        className="btn btn-outline-danger py-1 px-2"
                        onClick={() =>
                          handleDeleteClick(record._id, activeShop)
                        }
                      >
                        Delete
                      </button>
                    </td>
                  ) : null}
                  {admin ? (
                    <td>
                      <button
                        type="button"
                        className="btn btn-outline-success py-1 px-2"
                        data-bs-toggle="modal"
                        data-bs-target="#exampleModal"
                        onClick={() =>
                          updateBtnClick(
                            record._id,
                            record.dishName,
                            record.price
                          )
                        }
                      >
                        Update
                      </button>
                    </td>
                  ) : null}
                  <td>{record.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}


        <div className="py-3">
          <Contactus />
        </div>
      </div>
      {/* given below is the structure of a model which opens when user clicks on "Edit Profile" button */}
      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Edit {toUpdatePrice.dishName} Dish Name
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() =>
                  handlePriceUpdate(
                    activeShop,
                    toUpdatePrice.dishId,
                    toUpdatePrice.currentPrice
                  )
                }
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
