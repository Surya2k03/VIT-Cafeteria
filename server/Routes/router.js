const express = require("express");
const router = new express.Router();
const controllers = require("../controllers/userControllers");

// Routes
router.get("/", controllers.api);
router.post("/user/register", controllers.userregister);
router.post("/user/sendotp", controllers.userOtpSend);
router.post("/user/login", controllers.userLogin);
router.post("/user/data", controllers.userData);
router.delete("/user/delete", controllers.deleteOneUser);
router.post("/user/alluserdata", controllers.getPaginateUsers);
router.post("/user/alldish", controllers.getAllDish);
router.post("/user/dish",controllers.Dish);
router.delete("/user/deletedish", controllers.deleteDish);
router.post("/user/updateprice",controllers.updatePrice);
router.post("/user/addtocart", controllers.addToCart);
router.post("/user/cart", controllers.getCartItem);
router.delete("/user/deletecartitem", controllers.deleteCartItem);

module.exports = router;
