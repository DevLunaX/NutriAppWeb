const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  // Clear existing patients
  await prisma.patient.deleteMany();

  // Create sample patients
  const patient1 = await prisma.patient.create({
    data: {
      full_name: 'María García López',
      email: 'maria.garcia@example.com',
      phone: '+52 55 1234 5678',
      birth_date: new Date('1985-03-15'),
      gender: 'Femenino',
      weight: 65.5,
      height: 1.65,
      allergies: 'Gluten, Mariscos',
      medical_notes: 'Paciente con intolerancia al gluten diagnosticada en 2020.',
      photo_path: null,
    },
  });

  const patient2 = await prisma.patient.create({
    data: {
      full_name: 'Carlos Rodríguez Martínez',
      email: 'carlos.rodriguez@example.com',
      phone: '+52 55 9876 5432',
      birth_date: new Date('1990-07-22'),
      gender: 'Masculino',
      weight: 82.0,
      height: 1.78,
      allergies: null,
      medical_notes: 'Control de peso. Objetivo: reducir 5kg en 3 meses.',
      photo_path: null,
    },
  });

  console.log('Seed data created:');
  console.log({ patient1, patient2 });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
