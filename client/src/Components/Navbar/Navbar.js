import React, { useEffect, useState } from "react";
import { getAllDish } from "../../Services/Apis";
import "./Navbar.css";
import { CgProfile } from "react-icons/cg";
import { Link, useNavigate } from "react-router-dom";
import { userData } from "../../Services/Apis";

const Navbar = () => {
  const navigate = useNavigate();

  const [data, setData] = useState({});
  const [dataGazebo, setDataGazebo] = useState([]);
  const [dataDakshin, setDataDakshin] = useState([]);
  const [dataLH, setDataLH] = useState([]);
  const [dataAavin, setDataAavin] = useState([]);
  const [dataNQ, setDataNQ] = useState([]);
  const userToken = sessionStorage.getItem("userdbtoken");
  const isLoggedIn = sessionStorage.getItem("loggedIn");

  const handleLinkClick = (record, shop) => {
    // You can pass the data as state using the 'state' property
    navigate("/shop", { state: { shopData: record, shop } });
  };

  const handleLogoutClick = () => {
    sessionStorage.clear();
    window.location.reload();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const getUserData = await userData({ token: userToken });
        if (getUserData.status === 200) {
          // Set the fetched user data to the component state
          setData(getUserData.data.data);
          //console.log("User data is: ", data);
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

  useEffect(() => {
    const fetchData = async (shop) => {
      const response = await getAllDish({ shop });
      if (response.status === 200) {
        if (shop === "Gazebo") {
          setDataGazebo(response.data.content);
        } else if (shop === "Dakshin") {
          setDataDakshin(response.data.content);
        } else if (shop === "LH") {
          setDataLH(response.data.content);
        } else if (shop === "Aavin") {
          setDataAavin(response.data.content);
        } else {
          setDataNQ(response.data.content);
        }
      } else {
        console.log(response.data);
      }
    };
    fetchData("Gazebo");
    fetchData("Dakshin");
    fetchData("LH");
    fetchData("Aavin");
    fetchData("NQ");
  }, []);

  return (
    <div>
      <nav
        className="navbar navbar-expand-lg navbar-dark"
        style={{ backgroundColor: "#7C007C" }}
      >
        <div className="container">
          <Link className="btn btn-outline-light logo" to="/">
            VIT-Cafetria
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item mx-2 dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="/"
                  id="navbarDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Gazebo
                </a>
                <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                  <ul>
                    {dataGazebo?.map((record, i) => (
                      <li key={i}>
                        <button
                          className="dropdown-item"
                          onClick={() => handleLinkClick(record, "Gazebo")}
                        >
                          {record.dishName}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
              <li className="nav-item mx-2 dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="/"
                  id="navbarDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Lassi House
                </a>
                <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                  <ul>
                    {dataLH?.map((record, i) => (
                      <li key={i}>
                        <button
                          className="dropdown-item"
                          // onClick={() => handleLinkClick(record, "LH")}
                        >
                          {record.dishName}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
              <li className="nav-item mx-2 dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="/"
                  id="navbarDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Dakshin
                </a>
                <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                  <ul>
                    {dataDakshin?.map((record, i) => (
                      <li key={i}>
                        <button
                          className="dropdown-item"
                          onClick={() => handleLinkClick(record, "Dakshin")}
                        >
                          {record.dishName}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
              <li className="nav-item mx-2 dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="/"
                  id="navbarDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Aavin
                </a>
                <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                  <ul>
                    {dataAavin?.map((record, i) => (
                      <li key={i}>
                        <button
                          className="dropdown-item"
                          onClick={() => handleLinkClick(record, "Aavin")}
                        >
                          {record.dishName}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
              <li className="nav-item mx-2 dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="/"
                  id="navbarDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  North Square
                </a>
                <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                  <ul>
                    {dataNQ?.map((record, i) => (
                      <li key={i}>
                        <button
                          className="dropdown-item"
                          onClick={() => handleLinkClick(record, "NQ")}
                        >
                          {record.dishName}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            </ul>
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              {isLoggedIn ? (
                data.isAdmin ? (
                  <li className="nav-item mx-5 dropdown">
                    <a
                      className="nav-link dropdown-toggle"
                      href="/"
                      id="navbarDropdown"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <CgProfile style={{ fontSize: "28px" }} />
                    </a>
                    <div
                      className="dropdown-menu"
                      aria-labelledby="navbarDropdown"
                    >
                      <ul>
                        <li>
                          <Link className="dropdown-item" to="/users">
                            Users
                          </Link>
                        </li>
                        <li>
                          <Link className="dropdown-item" to="/adddish">
                            Add Dish
                          </Link>
                        </li>
                        <li>
                          <Link
                            className="dropdown-item logout-btn"
                            onClick={handleLogoutClick}
                          >
                            Logout
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </li>
                ) : (
                  <li className="nav-item mx-5 dropdown">
                    <a
                      className="nav-link dropdown-toggle"
                      href="/"
                      id="navbarDropdown"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <CgProfile style={{ fontSize: "28px" }} />
                    </a>
                    <div
                      className="dropdown-menu"
                      aria-labelledby="navbarDropdown"
                    >
                      <ul>
                        <li className="exception">
                          <Link className="dropdown-item" to="/contact">
                            Contact Us
                          </Link>
                        </li>
                        <li>
                          <Link
                            className="dropdown-item logout-btn"
                            to="/cart"
                          >
                            My Cart
                          </Link>
                        </li>
                        <li>
                          <Link
                            className="dropdown-item logout-btn"
                            onClick={handleLogoutClick}
                          >
                            Logout
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </li>
                )
              ) : (
                <li>
                  <Link className="btn btn-outline-light" to="/login">
                    Login
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
