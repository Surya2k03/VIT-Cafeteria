import { commonrequest } from "./Apicall";
import { BACKEND_URL } from "./Helper";

export const addDish = async (data) =>{
  return await commonrequest (
    "POST", `${BACKEND_URL}/user/dish`, data
  )
}

export const addToCart = async (data) => {
  return await commonrequest("POST", `${BACKEND_URL}/user/addtocart`, data);
};

export const getCartItem = async (data) => {
  console.log(data)
  return await commonrequest("POST", `${BACKEND_URL}/user/cart`, data);
};

export const userData = async (data) => {
  return await commonrequest("POST", `${BACKEND_URL}/user/data`, data);
};

export const getAllDish = async (data) => {
  return await commonrequest("POST", `${BACKEND_URL}/user/alldish`, data);
};

export const deleteCartItem = async (data) => {
  return await commonrequest(
    "DELETE",
    `${BACKEND_URL}/user/deletecartitem`,
    data
  );
};

export const deleteDish = async (data) => {
  return await commonrequest(
    "DELETE",
    `${BACKEND_URL}/user/deletedish`,
    data
  );
};



export const sendMsg = async (data) => {
  return await commonrequest("POST", `${BACKEND_URL}/user/sendmsg`, data);
};

export const sentOtpFunction = async (data) => {
  return await commonrequest("POST", `${BACKEND_URL}/user/sendotp`, data);
};

export const registerfunction = async (data) => {
  return await commonrequest("POST", `${BACKEND_URL}/user/register`, data);
};

export const getPaginateUsers = async (data) => {
  return await commonrequest("POST", `${BACKEND_URL}/user/alluserdata`, data);
};

export const deleteOneUser = async (data) => {
  return await commonrequest("DELETE", `${BACKEND_URL}/user/delete`, data);
};

export const updatePrice = async (data) => {
  return await commonrequest(
    "POST",
    `${BACKEND_URL}/user/updateprice`,
    data
  );
};

export const userVerify = async (data) => {
  return await commonrequest("POST", `${BACKEND_URL}/user/login`, data);
};