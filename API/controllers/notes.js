const express = require('express');
const router = express.Router();
const utils = require('../utils');

router.post('/:carId', async(req, res) => {
    try{
        noteResult = await utils.postNote(req.user.id ,req.params.carId, req.body.note);

        if(noteResult === false){
            // No results
            res.status(404);
            res.json({message: "Note not found"})
            return;       
        }
        else{
            res.status(201);
            res.json(noteResult); 
            return;
        }

    } catch (error) {
        console.log(error);
        res.status(400);
        res.json({message: "Error while posting a new note"})
        return;
    }

});


router.get('/:carId', async(req, res) => {

    try{
        messageResult = await utils.getNotes(req.user.id ,req.params.carId);

        if(messageResult === false){
            // No results
            res.status(404);
            res.json({message: "no results for given id"})
            return;       
        }
        else{
            res.status(200);
            res.json(messageResult); 
            return;
        }

    } catch (error) {
        console.log(error);
        res.status(400);
        res.json({message: "Error while posting a new note"})
        return;
    }

});

router.put('/:noteId', async(req, res) => {
    try {
        noteResult = await utils.updateNote(req.user.id ,req.params.noteId, req.body.note);
        if(noteResult === false){
            res.status(404);
            res.json({message: "no results for given id"})
            return;     
        }
        else{
            res.status(201);
            res.json(noteResult); 
            return;
        }
    } catch (error) {
        console.log(error);
        res.status(400);
        res.json({message: "Error while modifying a note"})
        return;
    }
});

router.delete('/:noteId', async(req, res) => {

    try {
        noteResult = await utils.deleteNote(req.user.id,req.params.noteId);
        
        if(noteResult === false){
            res.status(404);
            res.json({message: "no results for given id"})
            return;     
        }
        else{
            res.status(201);
            res.json(noteResult); 
            return;
        }
    } catch (error) {
        console.log(error);
        res.status(400);
        res.json({message: "Error while deleting a note"})
        return;
    }
});



module.exports = router;