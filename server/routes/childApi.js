const express = require('express');
const router = express.Router();
// const Sequelize = require('sequelize');
// const Op = Sequelize.Op;
const user = require('../dataAccess/user-model');
const task = require('../dataAccess/task-model')
const multer = require('multer'); 


// upload a photo for the child 

var path = require('path');

var store = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '.' + file.originalname);
    }
});

var upload = multer({ storage: store }).single('file');

router.post('/upload', function (req, res, next) {
    console.log(req.path);
    upload(req, res, function (err) {
        if (err) {
            return res, status(501).json({ error: err });
        }
        //do all database record saving activity
        return res.json({ originalname: req.file.originalname, uploadname: req.file.filename });
    });
});


























//get tasks by childuserID -- this will go in Child API
router.get('/:userId', async (req, res) => {
    let childId = req.params.userId;
    console.log("++++++++++++++++++++++++++")
    console.log(childId);
    
    try {
        res.send(JSON.stringify(await task.getAllRows(childId)));
    } catch (err) {
        console.log(err);
    }
})

// Add task
router.post('/', async (req, res) => {
    let newTask = req.body
    console.log('++++++++++++' + newTask);
    try {
        await task.addTask(newTask);
        res.send(JSON.stringify(await task.getAllRows(newTask.user_id)));
    } catch (err) {
        alert(err);
    }
    // res.send(JSON.stringify(await user.addChild(newTask)));
})


/////////////////////////////////////////////////////////////////////////////////////


//add a new child
router.post('/addChild/', async (req, res) => {
    let newChild = req.body.newChild
    console.log('++++++++++++' + newChild)

    res.send(JSON.stringify(await user.addChild(newChild)));
})


// Update status
router.put('/updateStatus', (req, res) => {
    let taskId = req.body.task_id;
    let userId = req.body.user_id;
    try {
         task.taskStatusCompleted(taskId).then((data) => {
            console.log(data); // rows affected
        }, (err) => {
            console.error(err)
        });
        // res.send(data);
        // res.send(JSON.stringify(await task.getAllRows(userId)));
    }
    catch (err) {
        alert(err);
    }
})
module.exports = router;
