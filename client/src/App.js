import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./Components/Navbar/Navbar";
import ScrollToTopBtn from "./Components/ScrollToTop/ScrollToTop";
import Contact from "./Pages/Contact/Contact";
import Home from "./Pages/Home/Home";
import Otp from "./Pages/OTP/Otp";

// Bootstrap CSS --------------------------------------
//import "bootstrap/dist/css/bootstrap.min.css";
// Bootstrap Bundle JS --------------------------------
//import "bootstrap/dist/js/bootstrap.bundle.min";
// React Toastify -------------------------------------

// mutli carousel style -------------------------
import "react-multi-carousel/lib/styles.css";
// ---------------------------------------------
import "react-toastify/dist/ReactToastify.css";
import Login from "./Pages/Login/Login";
import Register from "./Pages/Register/Register";
import { useEffect, useState } from "react";
import Users from "./Pages/Users/Users";
import Footer from "./Components/Footer/Footer";
import AddDish from "./Pages/Material/AddDish";

import Cart from "./Pages/Cart/Cart";

import Error from "./Pages/Error/Error";
import { userData } from "./Services/Apis";

function App() {
  const [admin, setAdmin] = useState(false);
  const isLoggedIn = sessionStorage.getItem("loggedIn");
  const userToken = sessionStorage.getItem("userdbtoken");

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

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="*" element={<Error />} />
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/user/otp" element={<Otp />} />

        <Route 
          path="/"
          element={isLoggedIn ? <Cart /> : <Login />}
        />
        
        <Route
          path="/adddish"
          element={isLoggedIn ? admin ? <AddDish /> : <Home /> : <Login />}
        />
        
        
        <Route path="/contact" element={isLoggedIn ? <Contact /> : <Login />} />
        
        <Route
          path="/users"
          element={isLoggedIn ? admin ? <Users /> : <Home /> : <Login />}
        />
        <Route
          path="/cart"
          element={isLoggedIn ? !admin ? <Cart /> : <Home /> : <Login />}
        />
      </Routes>
      <Footer />
      <ScrollToTopBtn />
    </Router>
  );
}

export default App;
