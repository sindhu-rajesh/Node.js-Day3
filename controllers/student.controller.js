import Student from '../models/student.schema.js';
import Mentor from '../models/mentor.schema.js';

// Create a student
export const createStudent = async (req, res) => {
    try {
        const newStudent = new Student(req.body);
        await newStudent.save();
        res.status(201).json({ message: "Student created successfully", data: newStudent });
    } catch (error) {
        res.status(500).json({ message: "Error creating student", error: error.message });
    }
};

// Get all students
export const getStudents = async (req, res) => {
    try {
        const students = await Student.find({ mentorId: null });
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ error: "Error fetching students" });
    }
};

// Update a student
export const updateStudent = async (req, res) => {
    try {
        const studentId = req.params.id;
        const { name, email, mentorId } = req.body;
        const result = await Student.updateOne({ _id: studentId }, { name, email, mentorId });

        if (result.matchedCount === 0) {
            return res.status(400).json({ error: "Student id not found" });
        }

        const updatedStudent = await Student.findById(studentId);
        res.status(200).json({ message: "Student updated successfully", data: updatedStudent });
    } catch (error) {
        res.status(500).json({ error: "Error updating student" });
    }
};

// Assign or change mentor for a student
export const assignMentor = async (req, res) => {
    try {
        const studentId = req.params.studentId;
        const mentorId = req.body.mentorId;

        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        if (student.mentorId) {
            student.previousMentorIds.push(student.mentorId);
        }

        student.mentorId = mentorId;
        await student.save();

        const mentor = await Mentor.findById(mentorId);
        if (mentor) {
            mentor.studentIds.push(studentId);
            await mentor.save();
        }

        res.status(200).json({ message: "Mentor assigned successfully", data: student });
    } catch (error) {
        res.status(500).json({ error: "Error assigning mentor" });
    }
};

// Get the previous mentors of a student
export const getPreviousMentors = async (req, res) => {
    try {
        const studentId = req.params.id;
        const student = await Student.findById(studentId).populate('previousMentors');
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }
        res.status(200).json({ previousMentors: student.previousMentors });
    } catch (error) {
        res.status(500).json({ message: "Error fetching previous mentors", error: error.message });
    }
}; 
export const updateStudentMentor = async (req, res) => {
    try {
        const studentId = req.params.id;
        const { mentorId } = req.body;

        // Find the student by ID
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        // Handle the mentor update
        if (student.mentorId && !student.previousMentors.includes(student.mentorId)) {
            student.previousMentors.push(student.mentorId);
        }

        student.mentorId = mentorId;
        await student.save();

        res.status(200).json({ message: "Student's mentor updated successfully", data: student });
    } catch (error) {
        res.status(500).json({ message: "Error updating student's mentor", error: error.message });
    }
};