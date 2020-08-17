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
    });
  } catch (error) {
    res.status(404).json({ error: "Houses not found" });
  }
});

router.get("/add", async (req, res) => {
  try {
    res.render("pages/houseManage", {
      title: "Add new house",
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
    //to hide edit and delete button
    houseList = showEditandDeleteButton(houseList, true);
    console.log("update house=" + JSON.stringify(houseList));
    res.render("pages/houseList", {
      title: "Main Page",
      list: houseList,
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
    let searchList = await houseData.filterList(info);
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

    res.render("pages/houseList", {
      title: "Matched Houses",
      list: ratingList,
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
    });
  } catch (error) {
    res.status(404).json({ error: "Could not find house" });
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
    let newHouse = await houseData.addHouse(houseParamBody);
    res.json(newHouse);
  } catch (error) {
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
    res.status(404).json({ error: "Must supply House Id." });
    return;
  }

  try {
    await houseData.getHouseById(req.params.id);
  } catch (error) {
    res.status(404).json({ error: "Cannot delete House." });
    return;
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

module.exports = router;
