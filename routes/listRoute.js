const bodyParser = require("body-parser");
var express = require('express');
var router = express.Router();
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("../models/user");
const List = require('../models/list');
const middleware = require('../middlewares/index.js');


router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
//====================================================
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser()); // it reades, decodes information in session,encodes it
passport.deserializeUser(User.deserializeUser());

// List ROUTES===============================

/**
 * Get all lists
 */
router.get("/list/all",
    middleware.isLoggedin,
    async function (req, res) {
        const data = await List.find({ 'creator.id': req.user._id });
        // const data = await List.find({ 'creator.id': req.user._id });

        return res.render('./List/listAll.ejs', { data });
    });

/**
 * Create a new list
 */
router.post('/list/create',
    middleware.isLoggedin,
    async function (req, res) {
        /**
         * create a list
         */
        const { name } = req.body;

        let listData = new List({ name });

        // add craetor of list
        listData.creator.id = req.user._id;
        listData.creator.name = req.user.username;

        await listData.save();

        return res.redirect('/list/all')
        // return res.json(listData);
    });

/**
* Delete a list
*/
router.post('/list/delete',
    middleware.isLoggedin,
    async function (req, res) {
        /**
         * delete a task
         */
        const { listId } = req.body;
        const userId = req.user._id;

        const data = await List.findOneAndRemove({ 'creator.id': userId, '_id': listId });

        console.log(data);

        return res.redirect('/list/all')
    }
);


/**
 * Create a new task
 */
router.post('/task/create',
    middleware.isLoggedin,
    async function (req, res) {
        /**
         * create a task
         */
        const { listId, description } = req.body;

        const task = {
            description
        }

        // if already existing dont create new
        const existing = await List.findOne({ _id: listId, 'creator.id': req.user._id, 'tasks.description': task.description });

        const data = existing ? null : await List.findOneAndUpdate({ _id: listId, 'creator.id': req.user._id }, { $push: { tasks: task } });

        console.log(data);

        return res.redirect('/list/all')
    }
);

/**
 * Delete a  task
 */
router.post('/task/delete',
    middleware.isLoggedin,
    async function (req, res) {
        /**
         * delete a task
         */
        const { taskId } = req.body;
        const userId = req.user._id;

        const data = await List.update({ 'creator.id': userId, 'tasks._id': taskId }, { '$pull': { 'tasks': { _id: taskId } } });

        console.log(data);

        return res.redirect('/list/all')
    }
);


module.exports = router;
