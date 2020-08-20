const express = require("express");
const router = express.Router();
const house = require("../../data/houseData");
const houseData = house.houseData;
const user = require("../../data/userData");
const userData = user.users;
const review = require("../../data/commentAndReviewData");
const reviewData = review.reviewsDate;
const comment = require("../../data/commentAndReviewData");
const commentData = comment.commentsData;
const favHouseData = house.favHouseData;
const xss = require("xss");

router.get("/", async (req, res) => {
  try {
    let houseList = await houseData.getAllHouse();

    let houseInfo = [];
    for (let i = 0; i < houseList.length; i++) {
      let reviews = await reviewData.getReviewByHouseId(houseList[i]._id);
      let sum = 0;
      for (let j = 0; j < reviews.length; j++) sum += await reviews[j].rating;

      let avg = 0;
      avg = (sum / reviews.length).toFixed(1);
      houseInfo.push([i, reviews.length, avg]);
    }

    let ratingSort = houseInfo;
    let reviewSort = houseInfo;

    ratingSort = ratingSort.sort(function (a, b) {
      return b[2] - a[2];
    });

    let ratingList = [];
    for (let i = 0; i < ratingSort.length; i++)
      ratingList.push(houseList[ratingSort[i][0]]);

    reviewSort = reviewSort.sort(function (a, b) {
      return b[1] - a[1];
    });

    let reviewList = [];
    for (let i = 0; i < reviewSort.length; i++)
      reviewList.push(houseList[reviewSort[i][0]]);

    res.render("pages/mainPage", {
      title: "Main Page",
      rateList: ratingList,
      reviewList: reviewList,
      hasLogin: req.session.user,
    });
  } catch (error) {
    res.status(404).json({ error: "Houses not found" });
  }
});

router.get("/add", async (req, res) => {
  if (!req.session || !req.session.user) {
    res.status(404).json({
      error: "To add a house, must login with valid user.",
    });
    return;
  }
  try {
    res.render("pages/houseManage", {
      title: "Add new house",
      hasLogin: req.session.user,
    });
  } catch (error) {
    res.status(404).json({ error: "Houses not found" });
  }
});

router.get("/updateHouse", async (req, res) => {
  try {
    if (!req.session || !req.session.user) {
      res.status(404).json({
        error: "To edit or delete house, must login with valid user.",
      });
      return;
    }

    let houseList = await houseData.getAllHouseforCurrentUser(req.session.user);
    let userAddedZeroHouse = false;
    if (houseList.length === 0) {
      userAddedZeroHouse = true;
    }
    //to hide edit and delete button
    houseList = showEditandDeleteButton(houseList, true);
    console.log("update house=" + JSON.stringify(houseList));
    res.render("pages/houseList", {
      title: "Main Page",
      list: houseList,
      hasLogin: req.session.user,
      userAddedZeroHouse: userAddedZeroHouse,
    });
  } catch (error) {
    res.status(404).json({ error: "Houses not found" });
  }
});

//to edit house
router.get("/add/:id", async (req, res) => {
  console.log("most outside Edit house");
  try {
    if (!req.session || !req.session.user) {
      res.status(404).json({
        error: "To edit or delete house, must login with valid user.",
      });
      return;
    }

    let houseId = "";
    if (req.params.id) {
      houseId = req.params.id;
    }

    let house = await houseData.getHouseById(houseId);

    console.log("Edit house=" + JSON.stringify(house));
    let houseType = house["houseType"];
    res.render("pages/houseManage", {
      title: "Edit house",
      houseDetail: JSON.stringify(house),
      hasLogin: true,
    });
  } catch (error) {
    res.status(404).json({ error: " edit Houses not found" });
  }
});

router.get("/search", async (req, res) => {
  //the user shouldn't be able to manually enter this page
  res.redirect("/");
});

router.post("/search", async (req, res) => {
  //this route will display the houses that match the search criteria
  try {
    let info = await req.body;

    let secureInfo = {};
    secureInfo["rent-min"] = await xss(info["rent-min"]);
    secureInfo["rent-max"] = await xss(info["rent-max"]);
    secureInfo["date-start"] = await xss(info["date-start"]);
    secureInfo["date-end"] = await xss(info["date-end"]);
    secureInfo["house-number"] = await xss(info["house-number"]);
    secureInfo["house-street"] = await xss(info["house-street"]);
    secureInfo["house-city"] = await xss(info["house-city"]);
    secureInfo["house-state"] = await xss(info["house-state"]);
    secureInfo["house-zipcode"] = await xss(info["house-zipcode"]);
    secureInfo["pet"] = await xss(info["pet"]);
    secureInfo["park"] = await xss(info["park"]);
    secureInfo["variant"] = await xss(info["variant"]);
    secureInfo["house-bed"] = await xss(info["house-bed"]);

    let searchList = await houseData.filterList(secureInfo);
    //to hide edit and delete button
    searchList = showEditandDeleteButton(searchList, false);
    //console.log(searchList);

    let houseInfo = [];
    for (let i = 0; i < searchList.length; i++) {
      let reviews = await reviewData.getReviewByHouseId(searchList[i]._id);
      let sum = 0;
      for (let j = 0; j < reviews.length; j++) sum += await reviews[j].rating;

      let avg = 0;
      avg = (sum / reviews.length).toFixed(1);
      houseInfo.push([i, reviews.length, avg]);
    }

    let ratingSort = houseInfo;

    ratingSort = ratingSort.sort(function (a, b) {
      return b[2] - a[2];
    });

    let ratingList = [];
    for (let i = 0; i < ratingSort.length; i++)
      ratingList.push(searchList[ratingSort[i][0]]);

    let emptySearch = false;
    if (ratingList.length === 0) {
      emptySearch = true;
    }

    res.render("pages/houseList", {
      title: "Matched Houses",
      list: ratingList,
      hasLogin: req.session.user,
      emptySearch: emptySearch,
    });
  } catch (e) {
    res.status(500);
    res.render("pages/error", {
      message: e,
    });
  }
});

router.get("/:id", async (req, res) => {
  if (!req.params.id) {
    res.status(404).json({ error: "House Id missing" });
    return;
  }
  if (!req.session || !req.session.user) {
    res.status(404).json({
      error: "To visit this house, must login with valid user.",
    });
    return;
  }

  let isFavHouse = false;
  let user = await userData.getUserById(req.session.user);
  if (user) {
    let userFavHouse = user["favourites"];
    if (userFavHouse) {
      let filterHouse = userFavHouse.filter(function (houseObj) {
        return houseObj.houseId === req.params.id;
      });

      if (filterHouse.length > 0) {
        isFavHouse = true;
      }
    }
  }

  //Get reviews by houseId
  let reviewsList = [];
  let reviews = [];
  let totalRate = 0;
  let aveRate = 0;
  try {
    reviews = await reviewData.getReviewByHouseId(req.params.id);
  } catch (error) {
    console.log(error);
  }

  for (r of reviews) {
    let review = {
      username: "",
      profileImg: "",
      reviewData: {},
      currentUser: false,
    };
    let currentUser = req.session.user ? req.session.user : "";
    let user = {};
    try {
      user = await userData.getUserById(r.userId);
    } catch (error) {
      console.log(error);
    }

    try {
      allcommentsList = await configureAllcommentList(currentUser, r.comments);
    } catch (error) {
      console.log(error);
    }
    r.comments = allcommentsList;
    review["username"] = user.firstName + " " + user.lastName;
    review["profileImg"] = user.profilePicture;
    review["reviewData"] = r;
    if (req.session.user === r.userId) {
      review["currentUser"] = true;
    }
    reviewsList.push(review);
    totalRate = totalRate + r.rating;
  }
  if (reviews && reviews.length !== 0) {
    if (reviews.length === 0) throw "The denominator can not be 0";
    aveRate = (totalRate / reviews.length).toFixed(1);
  } else aveRate = 0;

  try {
    let house = await houseData.getHouseById(req.params.id);
    console.log(house);
    //res.json(house);
    //renderds the individual house page with the house info
    res.render("pages/individualHouse", {
      houseId: house._id,
      isFavHouse: isFavHouse,
      latitude: house.latitude,
      longitude: house.longitude,
      title: "Individual House Page",
      houseImage: house.profilePicture,
      houseNumber: house.houseNumber,
      street: house.street,
      city: house.city,
      state: house.state,
      zip: house.pincode,
      rent: house.rent,
      startDate: house.startDate,
      endDate: house.endDate,
      description: house.description,
      amenities: house.otherAmenities,
      pet: house.petFriendly,
      park: house.parkingAvailable,
      reviewsList: reviewsList,
      aveRate: aveRate,
      variant: house.houseType.type,
      bedroom: house.houseType.bedroom,
      hall: house.houseType.hall,
      kitchen: house.houseType.kitchen,
      hasLogin: req.session.user,
    });
  } catch (error) {
    console.log(error);
  }
});

router.post("/", async (req, res) => {
  if (!req.body) {
    res.status(404).json({ error: "Must supply all fields." });
    return;
  }
  if (!req.session || !req.session.user) {
    res
      .status(404)
      .json({ error: "To add new house, must login with valid user." });
    return;
  }

  let houseParamBody = req.body;
  try {
    houseParamBody["userId"] = req.session.user;

    //XSS attack check for add house
    let errorArray = checkXSSattack(houseParamBody);

    // console.log("Add house error check :" + errorArray.toString());
    if (errorArray.length > 0) {
      // console.log("Render house manage page :");
      res.render("pages/houseManage", {
        error_messages: errorArray,
        hasErrors: true,
        title: "Add new house",
      });
    } else {
      let newHouse = await houseData.addHouse(houseParamBody);
      // console.log("Add house successfully :" + JSON.stringify(newHouse));
      res.json(newHouse);
    }
  } catch (error) {
    console.log("Add house failure :" + error);
    res.status(404).json({ error: "Cannot add new House" });
  }
});

router.put("/:id", async (req, res) => {
  if (!req.params.id || !req.body) {
    res.status(404).json({ error: "Must supply all fields." });
    return;
  }

  let houseParamBody = req.body;
  let houseId = req.params.id;

  try {
    await houseData.getHouseById(houseId);
  } catch (error) {
    res.status(404).json({ error: "Cannot update House." });
  }

  try {
    let updateHouse = await houseData.updateHouse(houseId, houseParamBody);
    res.json(updateHouse);
  } catch (error) {
    res.status(404).json({ error: "Cannot update House." });
  }
});

router.delete("/:id", async (req, res) => {
  if (!req.params.id) {
    ({ error: "Must supply House Id." });
    return;
  }

  try {
    await houseData.getHouseById(req.params.id);
  } catch (error) {
    res.status(404).json({ error: "Cannot delete House." });
    return;
  }

  //delete review
  let review = [];
  try {
    review = await reviewData.getAllReviews();
  } catch (e) {
    console.log(e);
  }
  if (review) {
    for (let r of review) {
      if (r.houseId === req.params.id) {
        let comments = r.comments;
        for (let c of comments) {
          try {
            await commentData.deleteComment(c._id);
          } catch (e) {
            console.log(e);
          }
        }
        let user = {};
        try {
          user = await userData.getUserById(r.userId.toString());
        } catch (error) {
          console.log(error);
        }
        console.log(user._id);
        let userReviewsId = [];
        if (user.reviewIds) {
          userReviewsId = user.reviewIds;
        }
        for (let i of userReviewsId) {
          let index = userReviewsId.indexOf(i);
          if (i === r._id.toString()) {
            let ii = user.reviewIds.splice(index, 1);
            console.log(index + ":" + ii);
            break;
          }
        }
        try {
          await reviewData.removeReview(r._id.toString());
        } catch (e) {
          console.log(e);
        }
        try {
          await userData.updateUser(user._id.toString(), user);
        } catch (error) {
          console.log(error);
        }
      }
    }
  }
  //delete favorites
  let favourites = [];
  try {
    favourites = await favHouseData.getAllFavouriteHouse();
  } catch (e) {
    console.log(e);
  }
  if (favourites) {
    for (let f of favourites) {
      if (f.houseId === req.params.id) {
        let userlist = [];
        try {
          userlist = await userData.getAllUsers();
        } catch (error) {
          console.log(error);
        }

        for (let u of userlist) {
          for (let favourite of u.favourites) {
            let index = u.favourites.indexOf(favourite);
            console.log("user: " + favourite._id + "f: " + f._id);
            if (favourite._id === f._id) {
              console.log(22222);
              let ff = u.favourites.splice(index, 1);
              console.log(index + ":" + ff);
              break;
            }
          }
          try {
            await userData.updateUser(u._id.toString(), u);
          } catch (error) {
            console.log(error);
          }
        }
        try {
          await favHouseData.deleteFavouriteHouse(f._id);
        } catch (error) {
          console.log(error);
        }
      }
    }
  }
  try {
    await houseData.deleteHouse(req.params.id);
    res.sendStatus(200);
  } catch (error) {
    res.status(404).json({ error: "Cannot delete House." });
  }
});

router.patch("/:id", async (req, res) => {
  if (!req.params.id || !req.body || Object.keys(req.body).length === 0) {
    res.status(404).json({
      error: "Must provide atleast one field in request body.",
    });
    return;
  }

  let newHouse = req.body;
  let oldHouse = "";
  try {
    oldHouse = await houseData.getHouseById(req.params.id);
    oldHouse = checkAndUpdate(newHouse, oldHouse);
  } catch (error) {
    res.status(404).json({ error: "Cannot update House." });
  }

  try {
    //XSS attack check for edit house
    let errorArray = checkXSSattack(oldHouse);
    if (errorArray.length > 0) {
      res.render("pages/houseManage", {
        error_messages: errorArray,
        hasErrors: true,
        title: "Edit house",
      });
      return;
    }

    let updateHouse = await houseData.updateHouse(req.params.id, oldHouse);
    res.json(updateHouse);
  } catch (error) {
    res.status(404).json({ error: "Cannot update House." });
  }
});

function checkAndUpdate(newHouse, oldHouse) {
  if (
    newHouse.profilePicture &&
    newHouse.profilePicture != oldHouse.profilePicture
  ) {
    oldHouse.profilePicture = newHouse.profilePicture;
  }

  if (newHouse.longitude && newHouse.longitude != oldHouse.longitude) {
    oldHouse.longitude = newHouse.longitude;
  }
  if (newHouse.latitude && newHouse.latitude != oldHouse.latitude) {
    oldHouse.latitude = newHouse.latitude;
  }

  if (newHouse.street && newHouse.street != oldHouse.street) {
    oldHouse.street = newHouse.street;
  }

  if (newHouse.houseNumber && newHouse.houseNumber != oldHouse.houseNumber) {
    oldHouse.houseNumber = newHouse.houseNumber;
  }
  if (newHouse.city && newHouse.city != oldHouse.city) {
    oldHouse.city = newHouse.city;
  }

  if (newHouse.state && newHouse.state != oldHouse.state) {
    oldHouse.state = newHouse.state;
  }

  if (newHouse.pincode && newHouse.pincode != oldHouse.pincode) {
    oldHouse.pincode = newHouse.pincode;
  }
  if (newHouse.rent && newHouse.rent != oldHouse.rent) {
    oldHouse.rent = newHouse.rent;
  }

  if (newHouse.startDate && newHouse.startDate != oldHouse.startDate) {
    oldHouse.startDate = newHouse.startDate;
  }

  if (newHouse.endDate && newHouse.endDate != oldHouse.endDate) {
    oldHouse.endDate = newHouse.endDate;
  }
  if (
    newHouse.otherAmenities &&
    newHouse.otherAmenities != oldHouse.otherAmenities
  ) {
    oldHouse.otherAmenities = newHouse.otherAmenities;
  }
  if (newHouse.description && newHouse.description != oldHouse.description) {
    oldHouse.description = newHouse.description;
  }

  if (newHouse.petFriendly && newHouse.petFriendly != oldHouse.petFriendly) {
    oldHouse.petFriendly = newHouse.petFriendly;
  }
  if (
    newHouse.parkingAvailable &&
    newHouse.parkingAvailable != oldHouse.parkingAvailable
  ) {
    oldHouse.parkingAvailable = newHouse.parkingAvailable;
  }

  if (newHouse.houseType && oldHouse.houseType) {
    let newhouseType = newHouse.houseType;
    let oldhouseType = oldHouse.houseType;

    if (newhouseType.type && newhouseType.type != oldhouseType.type) {
      oldHouse.houseType.type = newhouseType.type;
    }
    if (newhouseType.bedroom && newhouseType.bedroom != oldhouseType.bedroom) {
      oldHouse.houseType.bedroom = newhouseType.bedroom;
    }
    if (newhouseType.hall && newhouseType.hall != oldhouseType.hall) {
      oldHouse.houseType.hall = newhouseType.hall;
    }
    if (newhouseType.kitchen && newhouseType.kitchen != oldhouseType.kitchen) {
      oldHouse.houseType.kitchen = newhouseType.kitchen;
    }
    if (
      newhouseType.bathroom &&
      newhouseType.bathroom != oldhouseType.bathroom
    ) {
      oldHouse.houseType.bathroom = newhouseType.bathroom;
    }
  }

  return oldHouse;
}

async function configureAllcommentList(currentUser, allComments) {
  console.log("currentUser = " + currentUser);
  let allcommentsList = [];
  if (allComments) {
    for (let i = 0; i < allComments.length; i++) {
      try {
        let comment = allComments[i];
        let commentSchema = {
          _id: "",
          text: "",
          userId: "",
          profilePicture: "",
          userName: "",
          canUpdate: "",
        };

        //comment id
        commentSchema._id = comment["_id"];

        //user id
        let userId = comment["userId"];
        if (userId) {
          commentSchema.userId = userId;
          //to hide edit and delete button. If current user is same as added comment user
          //then show edit and delete button, else hide
          if (userId === currentUser) {
            commentSchema.canUpdate = "inline-block";
          } else {
            commentSchema.canUpdate = "none";
          }
        }

        //user name
        let user = await userData.getUserById(userId);
        if (user && (user["firstName"] || user["lastName"])) {
          let name = "";
          name += user["firstName"] ? user["firstName"] : "";
          name += user["lastName"] ? user["lastName"] : "";
          commentSchema.userName = name;
        }
        //profile image
        if (user && user["profilePicture"]) {
          commentSchema.profilePicture = user["profilePicture"];
        }

        //comment text
        if (comment["text"]) {
          commentSchema.text = comment["text"];
        }

        allcommentsList.push(commentSchema);
      } catch (error) {
        console.log("error in configure list" + error);
      }
    }
    return allcommentsList;
  } else {
    throw `Empty comment list`;
  }
}

function showEditandDeleteButton(list, value) {
  list.forEach((element) => {
    element["canUpdate"] = value;
  });
  return list;
}

function checkXSSattack(data) {
  let {
    userId,
    profilePicture,
    longitude,
    latitude,
    street,
    houseNumber,
    city,
    state,
    pincode,
    rent,
    startDate,
    endDate,
    otherAmenities,
    description,
    petFriendly,
    parkingAvailable,
    houseType,
  } = data;

  let erroMessage = [];

  userId = xss(userId);
  profilePicture = xss(profilePicture);
  longitude = xss(longitude);
  latitude = xss(latitude);
  street = xss(street);
  houseNumber = xss(houseNumber);
  city = xss(city);
  state = xss(state);
  pincode = xss(pincode);
  rent = xss(rent);
  startDate = xss(startDate);
  endDate = xss(endDate);
  otherAmenities = xss(otherAmenities);
  description = xss(description);
  petFriendly = xss(petFriendly);
  parkingAvailable = xss(parkingAvailable);
  houseType = xss(houseType);

  if (!userId) {
    erroMessage.push("Must login with valid user to add house");
  }

  if (!profilePicture) {
    erroMessage.push("Upload atleast 1 house picture");
  }

  if (!longitude) {
    erroMessage.push(
      "You must enter a longitude(between -180 to 180) for map location"
    );
  }

  if (!latitude) {
    erroMessage.push(
      "You must enter a latitude(between -90 to 90) for map location"
    );
  }

  if (!street) {
    erroMessage.push("You must enter a street");
  }
  if (!houseNumber) {
    erroMessage.push("You must enter a house number");
  }
  if (!state) {
    erroMessage.push("You must enter a state");
  }
  if (!city) {
    erroMessage.push("You must enter a city");
  }
  if (!pincode) {
    erroMessage.push("You must enter a pincode");
  }
  if (!rent) {
    erroMessage.push("You must enter a House rent");
  }
  if (!startDate) {
    erroMessage.push("You must enter a lease start date");
  }
  if (!endDate) {
    erroMessage.push("You must enter a lease end date");
  }

  if (!otherAmenities) {
    erroMessage.push("You must enter atleast 10 character aminities details");
  }
  if (!description) {
    erroMessage.push("You must enter atleast 10 character other description");
  }
  if (!petFriendly) {
    erroMessage.push("You must select a pet friendly option");
  }

  if (!parkingAvailable) {
    erroMessage.push("You must select a parking available option");
  }
  if (!houseType) {
    erroMessage.push(
      "You must enter house type details like type of house, number of bedroom, hall , kitchen "
    );
  }

  // else {
  //   let houseTypeDetail = houseType;

  //   let type = xss(houseTypeDetail.type);
  //   let bedroom = xss(houseTypeDetail.bedroom);
  //   let hall = xss(houseTypeDetail.hall);
  //   let kitchen = xss(houseTypeDetail.kitchen);

  //   if (!type) {
  //     erroMessage.push("You must enter house type");
  //   }
  //   if (!bedroom) {
  //     erroMessage.push("You must enter number of bedroom in house");
  //   }
  //   if (!hall) {
  //     erroMessage.push("You must enter number of hall in house");
  //   }
  //   if (!kitchen) {
  //     erroMessage.push("You must enter number of kitchen in house");
  //   }
  // }

  return erroMessage;
}

module.exports = router;
