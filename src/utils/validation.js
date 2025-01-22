const express = require('express');
const { User } = require('../models/User');
const {Connection} = require('../models/Connection');

function validateEditProfileData(req){
    allowedEditFields = ["firstName","lastName","photoUrl","gender","about","skills","age"]

    const isEditAllowed = Object.keys(req.body).every(field => allowedEditFields.includes(field));

    return isEditAllowed;
}

async function isValidUser (inputUserId){
    const user = await User.findById(inputUserId);
    if(!user){
        return false;
    }
    return true;
}

async function isValidConnection (userId1, userId2){
    const connection = await Connection.findOne({
        $or:[
            {fromUser:userId1,toUser:userId2},
            {fromUser:userId2, toUser: userId1},
        ]
    })

    if (!connection){
        return false
    }
    return true
}

module.exports = {validateEditProfileData , isValidUser,isValidConnection}