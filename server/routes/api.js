import express from 'express';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Doctor from '../models/Doctor.js';
import Appointment from '../models/Appointment.js';

const router = express.Router();

// --- Auth / User Routes ---

// Login Route
router.post('/auth/login', async (req, res) => {
    const { phone, role } = req.body;
    try {
        let user = await User.findOne({ email: phone, role: role }); // using email field for phone for quick mockup

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials. User not found.' });
        }

        res.json({
            user,
            role: user.role,
            token: 'dummy-jwt-token-123',
            isNewUser: false
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Signup Route
router.post('/auth/signup', async (req, res) => {
    const { phone, role, name } = req.body;
    try {
        let user = await User.findOne({ email: phone, role: role });
        if (user) {
            return res.status(400).json({ message: 'User already exists. Please login.' });
        }

        user = new User({
            name: name || (role === 'doctor' ? 'New Doctor' : 'New Patient'),
            email: phone, // using email field as unique identifier
            password: 'password', // dummy password
            role: role
        });
        await user.save();

        if (role === 'doctor') {
            const doctor = new Doctor({
                userId: user._id,
                name: `Dr. ${user.name}`,
                specialty: 'General',
                price: '₹500'
            });
            await doctor.save();
        }

        res.status(201).json({
            user,
            role: user.role,
            token: 'dummy-jwt-token-123',
            isNewUser: true
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// --- Doctor Routes ---
router.get('/doctors', async (req, res) => {
    try {
        const doctors = await Doctor.find();
        res.json(doctors);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/doctors/:id', async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id);
        if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
        res.json(doctor);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Seed Initial Doctors Route (Helper to populate DB)
router.post('/seed-doctors', async (req, res) => {
    try {
        // Delete existing
        await Doctor.deleteMany();
        // Dummy Data
        const mockDoctors = [
            { name: 'Dr. Sharma', specialty: 'Cardiologist', rating: 4.8, nextAvailable: 'Today, 2:00 PM', price: '₹1000', isVideoEnabled: true, userId: new mongoose.Types.ObjectId() },
            { name: 'Dr. Verma', specialty: 'Dermatologist', rating: 4.5, nextAvailable: 'Tomorrow, 10:00 AM', price: '₹800', isVideoEnabled: true, userId: new mongoose.Types.ObjectId() },
            { name: 'Dr. Gupta', specialty: 'Pediatrician', rating: 4.9, nextAvailable: 'Today, 4:30 PM', price: '₹900', isVideoEnabled: false, userId: new mongoose.Types.ObjectId() }
        ];

        const inserted = await Doctor.insertMany(mockDoctors);
        res.json({ message: 'Seeded successfully', count: inserted.length });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// --- Appointment Routes ---
router.get('/appointments/user/:userId', async (req, res) => {
    try {
        const appointments = await Appointment.find({ patientId: req.params.userId });
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/appointments', async (req, res) => {
    try {
        const newAppointment = new Appointment(req.body);
        const saved = await newAppointment.save();
        res.status(201).json(saved);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

export default router;
