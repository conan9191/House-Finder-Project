const express = require('express');
const router = express.Router();
const data = require('../data');
const userData = data.users;

router.get('/', async (req, res) => {
    try {
      const userList = await userData.getAllUsers();
      res.json(userList);
    } catch (e) {
      res.status(500).json({ error: e });
    }
  });

router.get('/:id', async (req, res) => {
    try {
        let user = await userData.getUserById(req.params.id);
        res.json(user);
    } catch (e) {
        res.status(404).json({ error: 'User not found' });
    }
  });

router.post('/', async (req, res) => {
    let userInfo = req.body;

    if (!userInfo) {
      res.status(400).json({ error: 'You must provide data to create a user' });
      return;
    }
    if (Object.keys(userInfo).length === 0) {
      res.status(400).json({ error: 'You must provide data without null body'});
      return;
    }
    if (!userInfo.firstName) {
      res.status(400).json({ error: 'You must provide a firstName' });
      return;
    }
    if (!userInfo.lastName) {
        res.status(400).json({ error: 'You must provide a lastName' });
        return;
      }
      if (!userInfo.profilePicture) {
        res.status(400).json({ error: 'You must provide a profilePicture' });
        return;
      }
      if (!userInfo.street) {
        res.status(400).json({ error: 'You must provide a street' });
        return;
      }
      if (!userInfo.house_number) {
        res.status(400).json({ error: 'You must provide a house_number' });
        return;
      }
      if (!userInfo.city) {
        res.status(400).json({ error: 'You must provide a city' });
        return;
      }
      if (!userInfo.state) {
        res.status(400).json({ error: 'You must provide a state' });
        return;
      }
      if (!userInfo.pincode) {
        res.status(400).json({ error: 'You must provide a pincode' });
        return;
      }
      if (!userInfo.age) {
        res.status(400).json({ error: 'You must provide a age' });
        return;
      }
      if (!userInfo.hashedPassword) {
        res.status(400).json({ error: 'You must provide a hashedPassword' });
        return;
      }
    
    try {
      const newUser = await userData.addUser(
        userInfo.firstName,
        userInfo.lastName,
        userInfo.email,
        userInfo.profilePicture,
        userInfo.street,
        userInfo.house_number,
        userInfo.city,
        userInfo.state,
        userInfo.pincode,
        userInfo.age,
        userInfo.hashedPassword
      );
      res.json(newUser);
    } catch (e) {
      res.status(500).json({ error: e });
    }
});

router.patch('/:id', async (req, res) => {
    const requestBody = req.body;
    if (!requestBody) {
      res.status(400).json({ error: 'You must provide data to update a user' });
      return;
    }
    if (Object.keys(requestBody).length === 0) {
      res.status(400).json({ error: 'You must provide data without null body'});
      return;
    }
    if (!requestBody.firstName && !requestBody.lastName && !requestBody.email
        && requestBody.profilePicture && requestBody.street && requestBody.house_number
        && requestBody.city && requestBody.state && requestBody.pincode && requestBody.age 
        && requestBody.hashedPassword && requestBody.reviewIds && requestBody.reviewIds 
        && requestBody.favourites) {
      res.status(400).json({ error: 'You must Supply one of fields' });
      return;
    }
    let updatedObject = {};
    try {
        const oldUser = await userData.getUserById(req.params.id);
        if (requestBody.firstName && requestBody.firstName !== oldUser.firstName)
        updatedObject.firstName = requestBody.firstName;
        if (requestBody.lastName && requestBody.lastName !== oldUser.lastName)
        updatedObject.lastName = requestBody.lastName;
        if (requestBody.email && requestBody.email !== oldUser.email)
        updatedObject.email = requestBody.email;
        if (requestBody.profilePicture && requestBody.profilePicture !== oldUser.profilePicture)
        updatedObject.profilePicture = requestBody.profilePicture;
        if (requestBody.street && requestBody.street !== oldUser.street)
        updatedObject.street = requestBody.street;
        if (requestBody.house_number && requestBody.house_number !== oldUser.house_number)
        updatedObject.house_number = requestBody.house_number;
        if (requestBody.city && requestBody.city !== oldUser.city)
        updatedObject.city = requestBody.city;
        if (requestBody.state && requestBody.state !== oldUser.state)
        updatedObject.state = requestBody.state;
        if (requestBody.pincode && requestBody.pincode !== oldUser.pincode)
        updatedObject.pincode = requestBody.pincode;
        if (requestBody.age && requestBody.age !== oldUser.age)
        updatedObject.age = requestBody.age;
        if (requestBody. hashedPassword && requestBody.hashedPassword !== oldUser.hashedPassword)
        updatedObject.hashedPassword = requestBody.hashedPassword;
        if (requestBody.reviewIds && requestBody.reviewIds !== oldUser.reviewIds)
        updatedObject.reviewIds = requestBody.reviewIds;
        if (requestBody.favourites && requestBody.favourites !== oldUser.favourites)
        updatedObject.favourites = requestBody.favourites;
      
    } catch (e) {
      res.status(404).json({ error: 'user not found' });
      return;
    }
    try {
      const updatedUser = await userData.updateUser(req.params.id, updatedObject);
      res.json(updatedUser);
    } catch (e) {
      res.status(500).json({ error: e });
    }
});

router.delete('/:id', async (req, res) => {
  if (!req.params.id) {
    res.status(400).json({ error: 'You must Supply and ID to delete' });
    return;
  }
  try {
    await userData.getUserById(req.params.id);
  } catch (e) {
    res.status(404).json({ error: 'user not found' });
    return;
  }
  try {
    await userData.removeUser(req.params.id);
    res.sendStatus(200);
  } catch (e) {
    res.status(500).json({ error: e });
  }
});


module.exports = router;
