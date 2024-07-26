import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
    name: String,
    email: String,
    mentorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Mentor',
        default: null
    },
    previousMentors: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Mentor'
    }]
});

const Student = mongoose.model('Student', studentSchema);
export default Student;