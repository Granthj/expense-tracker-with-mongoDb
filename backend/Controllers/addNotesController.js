const Note = require('../Models/notesSchema');

const postNotes = async (req, res) => {
    try {
        const { description } = req.body;

        const now = new Date();

        const localDate = new Date(
            now.getTime() - now.getTimezoneOffset() * 60000
        );

        const note = await Note.create({
            description: description,
            date: localDate,
            UserId: req.userId
        });

        if (!note) {
            return res.status(400).json({
                message: 'Failed to add note'
            });
        }

        res.status(201).json({
            message: 'Note added successfully',
            note: note
        });
    }
    catch (err) {
        console.log('Error adding note:', err);

        res.status(500).json({
            message: 'Error adding note',
            error: err.message
        });
    }
};


const getNotes = async (req, res) => {
    try {

        const notes = await Note.find({
            UserId: req.userId
        }).sort({
            date: 1
        });

        const formattedDateNote = notes.map(note => {

            const d = new Date(note.date);

            const day = String(d.getDate()).padStart(2, '0');
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const year = d.getFullYear();

            return {
                ...note.toObject(),
                date: `${day}/${month}/${year}`
            };
        });

        res.status(200).json({
            message: 'Notes fetched successfully',
            notes: formattedDateNote
        });

    }
    catch (err) {
        console.log('Error fetching notes:', err);

        res.status(500).json({
            message: 'Error fetching notes',
            error: err.message
        });
    }
};


const deleteNote = async (req, res) => {

    try {

        const noteId = req.params.id;

        const deleted = await Note.findOneAndDelete({
            _id: noteId,
            UserId: req.userId
        });

        if (!deleted) {
            return res.status(404).json({
                message: 'Note not found'
            });
        }

        res.status(200).json({
            message: 'Note deleted successfully'
        });

    }
    catch (err) {
        console.log('Error deleting note:', err);

        res.status(500).json({
            message: 'Error deleting note',
            error: err.message
        });
    }
};


module.exports = {
    postNotes,
    getNotes,
    deleteNote
};