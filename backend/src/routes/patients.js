const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// Helper function to parse and validate date
function parseDate(value) {
  if (!value) return null;
  const date = new Date(value);
  if (isNaN(date.getTime())) {
    throw new Error('Invalid date format');
  }
  return date;
}

// Helper function to parse and validate float
function parseFloatValue(value) {
  if (value === null || value === undefined || value === '') return null;
  const num = parseFloat(value);
  if (isNaN(num)) {
    throw new Error('Invalid numeric value');
  }
  return num;
}

// Helper function to validate full_name
function validateFullName(value) {
  if (!value || typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

// GET /api/patients - List all patients
router.get('/', async (req, res) => {
  try {
    const patients = await prisma.patient.findMany({
      orderBy: { created_at: 'desc' },
    });
    res.json(patients);
  } catch (error) {
    console.error('Error fetching patients:', error);
    res.status(500).json({ error: 'Failed to fetch patients' });
  }
});

// GET /api/patients/search?term= - Search patients
router.get('/search', async (req, res) => {
  try {
    const { term } = req.query;
    if (!term) {
      return res.status(400).json({ error: 'Search term is required' });
    }

    const patients = await prisma.patient.findMany({
      where: {
        OR: [
          { full_name: { contains: term } },
          { email: { contains: term } },
          { phone: { contains: term } },
        ],
      },
      orderBy: { created_at: 'desc' },
    });
    res.json(patients);
  } catch (error) {
    console.error('Error searching patients:', error);
    res.status(500).json({ error: 'Failed to search patients' });
  }
});

// GET /api/patients/:id - Get a patient by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const patient = await prisma.patient.findUnique({
      where: { id },
    });

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    res.json(patient);
  } catch (error) {
    console.error('Error fetching patient:', error);
    res.status(500).json({ error: 'Failed to fetch patient' });
  }
});

// POST /api/patients - Create a new patient
router.post('/', async (req, res) => {
  try {
    const { full_name, email, phone, birth_date, gender, weight, height, allergies, medical_notes, photo_path } = req.body;

    // Validation: full_name is required and must not be empty after trimming
    const validatedName = validateFullName(full_name);
    if (!validatedName) {
      return res.status(400).json({ error: 'full_name is required and cannot be empty' });
    }

    // Parse and validate date and numeric fields
    let parsedBirthDate, parsedWeight, parsedHeight;
    try {
      parsedBirthDate = parseDate(birth_date);
      parsedWeight = parseFloatValue(weight);
      parsedHeight = parseFloatValue(height);
    } catch (validationError) {
      return res.status(400).json({ error: validationError.message });
    }

    const patient = await prisma.patient.create({
      data: {
        full_name: validatedName,
        email: email || null,
        phone: phone || null,
        birth_date: parsedBirthDate,
        gender: gender || null,
        weight: parsedWeight,
        height: parsedHeight,
        allergies: allergies || null,
        medical_notes: medical_notes || null,
        photo_path: photo_path || null,
      },
    });

    res.status(201).json(patient);
  } catch (error) {
    console.error('Error creating patient:', error);
    res.status(500).json({ error: 'Failed to create patient' });
  }
});

// PUT /api/patients/:id - Update a patient
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { full_name, email, phone, birth_date, gender, weight, height, allergies, medical_notes, photo_path } = req.body;

    // Check if patient exists
    const existingPatient = await prisma.patient.findUnique({
      where: { id },
    });

    if (!existingPatient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    // Validate full_name if provided - must not be empty after trimming
    let validatedName = existingPatient.full_name;
    if (full_name !== undefined) {
      validatedName = validateFullName(full_name);
      if (!validatedName) {
        return res.status(400).json({ error: 'full_name cannot be empty' });
      }
    }

    // Parse and validate date and numeric fields if provided
    let parsedBirthDate = existingPatient.birth_date;
    let parsedWeight = existingPatient.weight;
    let parsedHeight = existingPatient.height;
    
    try {
      if (birth_date !== undefined) {
        parsedBirthDate = parseDate(birth_date);
      }
      if (weight !== undefined) {
        parsedWeight = parseFloatValue(weight);
      }
      if (height !== undefined) {
        parsedHeight = parseFloatValue(height);
      }
    } catch (validationError) {
      return res.status(400).json({ error: validationError.message });
    }

    const patient = await prisma.patient.update({
      where: { id },
      data: {
        full_name: validatedName,
        email: email !== undefined ? email : existingPatient.email,
        phone: phone !== undefined ? phone : existingPatient.phone,
        birth_date: parsedBirthDate,
        gender: gender !== undefined ? gender : existingPatient.gender,
        weight: parsedWeight,
        height: parsedHeight,
        allergies: allergies !== undefined ? allergies : existingPatient.allergies,
        medical_notes: medical_notes !== undefined ? medical_notes : existingPatient.medical_notes,
        photo_path: photo_path !== undefined ? photo_path : existingPatient.photo_path,
      },
    });

    res.json(patient);
  } catch (error) {
    console.error('Error updating patient:', error);
    res.status(500).json({ error: 'Failed to update patient' });
  }
});

// DELETE /api/patients/:id - Delete a patient
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if patient exists
    const existingPatient = await prisma.patient.findUnique({
      where: { id },
    });

    if (!existingPatient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    await prisma.patient.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting patient:', error);
    res.status(500).json({ error: 'Failed to delete patient' });
  }
});

module.exports = router;
