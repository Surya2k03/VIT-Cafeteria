const users = require("../models/userSchema");
const userotp = require("../models/userOtp");
const dish = require("../models/dish");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const SECRECT_KEY = "abcdefghijklmnop";
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";


//email config
const tarnsporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

exports.api = async (req, res) => {
  res.status(200).json({ message: "Server is working" });
};

// user Registration
exports.userregister = async (req, res) => {
  const { fname, email, password, isAdmin } = req.body;

  if (!fname || !email || !password) {
    res.status(400).json({ error: "Please Enter All Input Data" });
  }

  try {
    const preuser = await users.findOne({ email: email });

    if (preuser) {
      res.status(400).json({ error: "This User Allready exist in our db" });
    } else {
      const userregister = new users({
        fname,
        email,
        password,
        isAdmin: isAdmin || false,
      });

      // here password hasing

      const storeData = await userregister.save();
      res.status(200).json(storeData);
    }
  } catch (error) {
    res.status(400).json({ error: "Invalid Details", error });
  }
};


// user send otp
exports.userOtpSend = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.status(400).json({ error: "Please Enter Your Email" });
  }

  try {
    const presuer = await users.findOne({ email: email });

    if (presuer) {
      const OTP = Math.floor(100000 + Math.random() * 900000);

      const existEmail = await userotp.findOne({ email: email });

      if (existEmail) {
        const updateData = await userotp.findByIdAndUpdate(
          { _id: existEmail._id },
          {
            otp: OTP,
          },
          { new: true }
        );
        await updateData.save();

        const mailOptions = {
          from: process.env.EMAIL,
          to: email,
          subject: "Sending Email For Otp Validation",
          text: `OTP:- ${OTP}`,
        };

        tarnsporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log("error", error);
            res.status(400).json({ error: "email not send" });
          } else {
            console.log("Email sent", info.response);
            res.status(200).json({ message: "Email sent Successfully" });
          }
        });
      } else {
        const saveOtpData = new userotp({
          email,
          otp: OTP,
        });

        await saveOtpData.save();
        const mailOptions = {
          from: process.env.EMAIL,
          to: email,
          subject: "Sending Eamil For Otp Validation",
          text: `OTP:- ${OTP}`,
        };

        tarnsporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log("error", error);
            res.status(400).json({ error: "email not send" });
          } else {
            console.log("Email sent", info.response);
            res.status(200).json({ message: "Email sent Successfully" });
          }
        });
      }
    } else {
      res.status(400).json({ error: "This User Not Exist In our Db" });
    }
  } catch (error) {
    res.status(400).json({ error: "Invalid Details", error });
  }
};

// user login
exports.userLogin = async (req, res) => {
  const { email, otp } = req.body;

  if (!otp || !email) {
    res.status(400).json({ error: "Please Enter Your OTP and email" });
  }

  try {
    const otpverification = await userotp.findOne({ email: email });

    if (otpverification.otp === otp) {
      const preuser = await users.findOne({ email: email });

      // token generate
      const token = await preuser.generateAuthtoken();
      res
        .status(200)
        .json({ message: "User Login Succesfully Done", userToken: token });
    } else {
      res.status(400).json({ error: "Invalid Otp" });
    }
  } catch (error) {
    res.status(400).json({ error: "Invalid Details", error });
  }
};

// get all user's data form admin
exports.getPaginateUsers = async (req, res) => {
  const search = req.body.search || "";
  if (search.length === 0) {
    const allUsers = await users.find({});

    const { page, limit } = req.body;

    const startIndex = (page - 1) * limit;
    const lastIndex = page * limit;

    const result = {};

    result.totalUser = allUsers.length;
    result.pageCount = Math.ceil(allUsers.length / limit);

    if (lastIndex < allUsers.length) {
      result.next = {
        page: page + 1,
      };
    }
    if (startIndex > 0) {
      result.prev = {
        page: page - 1,
      };
    }

    result.result = allUsers.slice(startIndex, lastIndex);
    res.status(200).json(result);
  } else {
    const query = {
      fname: { $regex: search, $options: "i" },
    };
    try {
      const userData = await users.find(query);
      res.status(201).json(userData);
    } catch (error) {
      res.status(400).json({ error: "Some Error Occured", error });
    }
  }
};

// get one user data
exports.userData = async (req, res) => {
  const { token } = req.body;
  try {
    const user = jwt.verify(token, SECRECT_KEY);
    // token expiration handling
    /*const user = jwt.verify(token, SECRECT_KEY, (err, res) => {
      if (err) {
        return "Token expired";
      } else {
        return res;
      }
    });

    if (user === "Token expired") {
      res.status(401).json({ error: "Token Expired", data: "Token Expired" });
    }
    */
    const userID = user._id;
    const userData = await users.findOne({ _id: userID });

    res.status(200).json({ data: userData });
  } catch (error) {
    res.status(400).json({ error: "Some Error Occured", error });
  }
};

// delete one user
exports.deleteOneUser = async (req, res) => {
  const { index } = req.body;

  try {
    const userData = await users.findByIdAndDelete(index);

    if (!userData) {
      // Handle case where user with the specified ID doesn't exist
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User's Account Deleted Successfully",
      deletedUser: userData,
    });
  } catch (error) {
    // Handle other errors
    res
      .status(500)
      .json({ error: "Some error occurred", details: error.message });
  }
};

// get all dishes of a shop
exports.getAllDish = async (req,res) => {
  try {
    const {shop} = req.body;

    let shopData = await dish.findOne({shop})
    if(!shopData){
      res.status(400).json({message: "No such shop exist"})
    }else{
      res.status(200).json({message: "Shop exist",content: shopData.content})
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// add a new dish in a shop
exports.Dish = async (req, res) => {
  try {
    const { shop, content } = req.body;

    // Find or create a subject based on domain and courseTitle
    let Dish = await dish.findOne({
      shop,
    });

    if (!Dish) {
      // If dish doesn't exist, create a new one
      Dish = new dish({
        shop,
        content: [content],
      });
    } else {
      // If dish exists, update the content array with the new data
      Dish.content.push(content);
    }

    await Dish.save();

    res.status(200).json(Dish);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// delete one dish of a shop
exports.deleteDish = async (req, res) => {
  try {
    const { shop, dishId } = req.body;

    let existingShop = await dish.findOne({ shop });

    if (!existingShop) {
      res.status(400).json({ message: "This Shop does not exist" });
    } else {
      // Use $pull to remove the subdocument from the 'content' array
      existingShop.content.pull({ _id: dishId });

      // Save the updated document
      await existingShop.save();

      res.status(200).json({ message: "Dish Deleted successfully" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update price for a dish of a shop
exports.updatePrice = async (req, res) => {
  try {
    const { shop, dishId, price } = req.body;
    
    // Find the domain
    let existingShop = await dish.findOne({ shop });

    if (!existingShop) {
      return res.status(400).json({ message: "This Shop does not exist" });
    }

    // Find the dish in the shop
    let priceToUpdate = existingShop.content.find(
      (dish) => dish._id.toString() === dishId
    );

    if (!priceToUpdate) {
      return res.status(400).json({ message: "Dish not found" });
    }

    // Update the price
    priceToUpdate.price = price;
    
    // Save the changes
    await existingShop.save();

    res.status(200).json({ message: "Price updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add to Cart
exports.addToCart = async (req, res) => {
  try {
    const { userId, dishName, price } = req.body;
    console.log(userId);
    console.log(dishName);
    console.log(price);
    // Find the user by userId
    const user = await users.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Add item to user's cart
    user.cart.push({ dishName, price });
    //add the total price of the item to the cart
    user.totalPrice += parseInt(price);
    user.totalItems += 1;

    // Save the updated user document
    await user.save();

    res.status(200).json({ message: "Item added to cart successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCartItem = async (req, res) => {
  try {
    console.log("object22")
    console.log(req)
    const userId = req.params.id;
    console.log(userId)
    const user = await users.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Send the cart items as a response
    res.status(200).json(user.cart);
  } catch (error) {
    console.error("Error fetching cart items:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.deleteCartItem = async (req, res) => {
  try {
    const { userId, itemId } = req.body;
    // Find the user by userId
    const user = await users.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the index of the item in the user's cart
    const itemIndex = user.cart.findIndex(item => item._id === itemId);

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    // Remove the item from the cart
    user.cart.splice(itemIndex, 1);
    totalPrice -= parseInt(price);
    totalItems -= 1;

    // Save the updated user document
    await user.save();

    res.status(200).json({ message: "Item deleted from cart successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

