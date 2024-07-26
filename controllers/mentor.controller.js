import Mentor from '../models/mentor.schema.js';
import Student from '../models/student.schema.js';

// Create a mentor
export const createMentor = async (req, res) => {
    try {
        const newMentor = new Mentor(req.body);
        await newMentor.save();
        res.status(201).json({ message: "Mentor created successfully", data: newMentor });
    } catch (error) {
        res.status(500).json({ message: "Error creating mentor", error: error.message });
    }
};

// Get all students for a particular mentor
export const getAssignedStudents = async (req, res) => {
    try {
        const mentorId = req.params.id;
        const mentor = await Mentor.findById(mentorId).populate('studentIds');
        if (!mentor) {
            return res.status(404).json({ message: "Mentor not found" });
        }
        res.status(200).json({
            mentor: mentor.name,
            students: mentor.studentIds.map(student => student.name)
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching assigned students", error: error.message });
    }
};

// Assign multiple students to a mentor
export const assignMultipleStudents = async (req, res) => {
    try {
        const mentorId = req.params.id;
        const { studentId } = req.body;

        // Check if studentIds is provided and is an array
        if (!Array.isArray(studentId) || studentId.length === 0) {
            return res.status(400).json({ message: "No student IDs provided" });
        }

        const mentor = await Mentor.findById(mentorId);
        if (!mentor) {
            return res.status(404).json({ message: "Mentor not found" });
        }

        // Process each student ID
        await Promise.all(studentId.map(async (studentId) => {
            const student = await Student.findById(studentId);
            if (student) {
                // Check if the student already has a mentor
                if (student.mentorId) {
                    if (!student.previousMentors) {
                        student.previousMentors = [];
                    }
                    if (!student.previousMentors.includes(student.mentorId)) {
                        student.previousMentors.push(student.mentorId);
                    }
                }

                // Assign new mentor
                student.mentorId = mentorId;
                await student.save();

                // Add student ID to mentor
                if (!mentor.studentId.includes(studentId)) {
                    mentor.studentId.push(studentId);
                }
            }
        }));

        await mentor.save();
        res.status(200).json({ message: "Students assigned successfully", data: mentor });
    } catch (error) {
        res.status(500).json({ message: "Error assigning students", error: error.message });
    }
};