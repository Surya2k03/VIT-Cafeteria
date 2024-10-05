import React, { useState, useEffect } from "react";
import { getCartItem } from "../../Services/Apis";
import Spinner from "react-bootstrap/Spinner";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [spinner, setSpinner] = useState(true); // Show spinner initially

  useEffect(() => {
    console.log("object");
    const fetchCartItems = async () => {
      try {
        console.log("Ji");
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
        console.log("User:",userId)
        const response = await getCartItem(userId);
        console.log(response)
        console.log(response.data)
        if (response.status == 200) {
          console.log("Hi");
          console.log(response.data);
          setCartItems(response.data);
        } else {
          console.error("Error fetching cart items 22:", response.data.error);
        }
      } catch (error) {
        console.error("Error fetching cart items 23:", error);
      } finally {
        setSpinner(false); // Hide spinner after fetching data
      }
    };

    fetchCartItems();
  }, []);

  return (
    <div className="container my-5 px-5">
      <div><h2>YOUR CART</h2></div>
      {spinner ? (
        <div className="text-center my-5">
          Loading <Spinner animation="border" />
        </div>
      ) : (
        <div>
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Item Name</th>
                <th scope="col">Price</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item, index) => (
                <tr key={index}>
                  <td>{item.dishName}</td>
                  <td>{item.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Cart;
