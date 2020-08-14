/*
 * @Descripttion: 
 * @version: 
 * @Date: 2020-08-12 09:54:42
 * @LastEditors: Yiqun Peng
 * @LastEditTime: 2020-08-13 03:15:29
 */
const dbCollections = require("../../settings/collections");
const reviews = dbCollections.reviews;
const { ObjectId } = require("mongodb");


let exportedMethods = {
    /**
     * This method is used to get the list of all the reviews
     * @return: the users list
     */
    async getAllReviews() {
        const reviewCollection = await reviews();
        const reviewList = await reviewCollection.find().toArray();
        if (!reviewList || reviewList.length === 0) throw "No reviews in database!";
        return reviewList;
    },

    /**
     * This method is used to get the review object by id
     * @param {string} id
     * @return {object} review
     */
    async getReviewById(id) {
        if (!id) throw "You must provide an id";
        if (typeof id !== "string") throw "ID needs to be a string";
        const objId = ObjectId.createFromHexString(id);
        const reviewCollection = await reviews();
        const review = await reviewCollection.findOne({ _id: objId });
        if (!review) throw "reviews not found";
        return review;
    },

    /**
     * This method is used to get the review object by houseId
     * @param {string} houseId
     * @return {object} review
     */
    async getReviewByHouseId(houseId) {
        houseId = getValidId(houseId);
        const reviewCollection = await reviews();
        const review = await reviewCollection.find({ 'houseId': houseId }).toArray();
        if (!review) throw "review not found";
        return review;
    },

    async addReview(houseId, userId, rating, reviewText){
        checkIsProperString(houseId, "houseId");
        checkIsProperString(userId, "userId");
        checkIsProperString(reviewText, "reviewText");
        if (!rating) throw "You must provide a rating for the review";
        if (typeof rating !== "number") throw "rating is not a string";
        const reviewCollection = await reviews();
        let newReview = {
            houseId: houseId,
            userId: userId,
            comments: [],
            rating: rating,
            reviewText: reviewText
          };
        const newInsertInformation = await reviewCollection.insertOne(newReview);
        if (newInsertInformation.insertedCount === 0) throw 'Insert failed!';
        const newId = newInsertInformation.insertedId;
        return await this.getReviewById(newId.toString())
    },

    async updateReview(id, updatedReview) {
        checkIsProperString(id,"id");
        const reviewCollection = await reviews();
        const updatedReviewData = {};
        if (updatedReview.houseId) {
            checkIsProperString(updatedReview.houseId, "houseId")
            updatedReviewData.houseId = updatedReview.houseId;
        }
        if (updatedReview.userId) {
            checkIsProperString(updatedReview.userId, "userId")
            updatedReviewData.userId = updatedReview.userId;
        }
        if (updatedReview.userId) {
            checkIsProperString(updatedReview.userId, "userId")
            updatedReviewData.userId = updatedReview.userId;
        }
        if (updatedReview.comments) {
            if (!Array.isArray(updatedReview.comments)) throw "Comments need to be array";
            for(let i of updatedReview.comments){
                if (typeof i !== "object" || Array.isArray(i)) throw "Each comments needs to be a object";
                if (Object.keys(i).length !== 3)throw "Length of comments need to be e (_id, userId and text)";
                if (i.hasOwnProperty("_id") === false || i.hasOwnProperty("userId") || i.hasOwnProperty("text") === false)throw "The review need to have _id, userId and text)";
                if (typeof i["_id"] !== "string") throw "_id of comment needs to be a string";
                if (typeof i["userId"] !== "string") throw "userId of comment needs to be a string";
                if (typeof i["text"] !== "string") throw "text of comment needs to be a string";
                if (i["_id"].length <= 0)throw "Length of _id of comment need to be greater than zero";
                if (i["userId"].length <= 0)throw "Length of userId of comment need to be greater than zero";
                if (i["text"].length <= 0)throw "Length of text of comment need to be greater than zero";
            }
            updatedReviewData.comments = updatedReview.comments;
        }
        if (updatedReview.rating) {
            if (!updatedReview.rating) throw "You must provide a rating for the review";
            if (typeof updatedReview.rating !== "number") throw "rating is not a string";
            updatedReviewData.rating = updatedReview.rating;
        }
        if (updatedReview.reviewText) {
            checkIsProperString(updatedReview.reviewText, "reviewText")
            updatedReviewData.reviewText = updatedReview.reviewText;
        }
        
        const objId = ObjectId.createFromHexString(id);
        const updateInfo = await reviewCollection.updateOne({ _id: objId }, { $set: updatedReviewData});
        if (!updateInfo.matchedCount && !updateInfo.modifiedCount)throw 'Update failed';
            return await this.getReviewById(id);
    },

    async removeReview(id) {
        if (!id) throw "You must provide an id";
        if (typeof id !== "string") throw "ID needs to be a string";
        const objId = ObjectId.createFromHexString(id);
        const reviewCollection = await reviews();
        const deletionInfo = await reviewCollection.removeOne({ _id: objId });
        if (deletionInfo.deletedCount === 0) {
            throw "Could not delete review with id";
        }
    }
};

/**
 * This method is used to check if the data is a proper string
 * @param {string} val
 * @param {string} variableName
 */
function checkIsProperString(val, variableName) {
    if (!val)
      throw `You must provide a ${variableName || "provided variable"} for the review`;
    if (typeof val !== "string")
      throw `${variableName || "provided variable"} is not a string`;
    if (val.length === 0) throw `${variableName || "provided variable"} is null`;
  }

/**
 * Check and validate ID .
 * @param {} id : ID to be validate
 */
function getValidId(id) {
    if (!id) {
        throw "Given  id is invalid";
    }
    
    if (typeof id != "object" && typeof id != "string") {
        throw "Provide  id of type object or string ";
    }
    return id;
}
  
  module.exports = exportedMethods;