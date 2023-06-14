const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const attendanceSchema = new Schema({
    name: {
        type: String,
    },
    date: {
        type: Date,
    },
    present: {
        type: Boolean,
    }
});

module.exports = mongoose.model('Attendance', attendanceSchema);