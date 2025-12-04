import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PatientsApiService } from '../core/api/patients-api.service';
import { Patient, PatientCreate, PatientDiagnosis, MedicalRecords } from '../core/models/patient.model';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './main.html',
  styleUrl: './main.css'
})
export class Main implements OnInit {
  // Patient list
  patients = signal<Patient[]>([]);
  selectedPatient = signal<Patient | null>(null);
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  // Form fields for patient info
  patientForm = signal<PatientCreate>({
    full_name: '',
    control_number: '',
    gender: undefined,
    career: '',
    age: undefined,
  });

  // Diagnosis checkboxes
  diagnosis = signal<PatientDiagnosis>({
    malnutrition: false,
    underweight: false,
    healthy_weight: false,
    overweight: false,
    obesity_1: false,
    obesity_2: false,
    obesity_3: false,
    diabetes: false,
    hypertension: false,
    dyslipidemia: false,
    nephropathy: false,
    other: '',
  });

  // Medical records
  medicalRecords = signal<MedicalRecords>({
    orientations: '',
    hcn: '',
    meal_plan_type: '',
    first_visit: '',
    follow_up: '',
  });

  // Anthropometry
  anthropometry = signal({
    weight_kg: undefined as number | undefined,
    height_cm: undefined as number | undefined,
    bmi: 0,
    body_fat_percentage: undefined as number | undefined,
    muscle_mass_kg: undefined as number | undefined,
    waist_cm: undefined as number | undefined,
    hip_cm: undefined as number | undefined,
  });

  // Computed BMI
  calculatedBmi = computed(() => {
    const anthro = this.anthropometry();
    if (anthro.weight_kg && anthro.height_cm) {
      const heightM = anthro.height_cm / 100;
      return +(anthro.weight_kg / (heightM * heightM)).toFixed(2);
    }
    return 0;
  });

  constructor(private patientsApi: PatientsApiService) {}

  ngOnInit(): void {
    this.loadPatients();
  }

  async loadPatients(): Promise<void> {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    try {
      const response = await this.patientsApi.getAll();
      if (response.status === 200 && response.data) {
        this.patients.set(response.data);
      } else {
        this.errorMessage.set(response.error?.message || 'Error loading patients');
      }
    } catch (error) {
      this.errorMessage.set('Error connecting to server');
    } finally {
      this.isLoading.set(false);
    }
  }

  selectPatient(patient: Patient): void {
    this.selectedPatient.set(patient);
    
    // Load patient data into forms
    this.patientForm.set({
      full_name: patient.full_name,
      control_number: patient.control_number || '',
      gender: patient.gender,
      career: patient.career || '',
      age: patient.age,
    });

    this.diagnosis.set(patient.diagnosis || {
      malnutrition: false,
      underweight: false,
      healthy_weight: false,
      overweight: false,
      obesity_1: false,
      obesity_2: false,
      obesity_3: false,
      diabetes: false,
      hypertension: false,
      dyslipidemia: false,
      nephropathy: false,
      other: '',
    });

    this.medicalRecords.set(patient.medical_records || {
      orientations: '',
      hcn: '',
      meal_plan_type: '',
      first_visit: '',
      follow_up: '',
    });

    this.anthropometry.set({
      weight_kg: patient.weight_kg,
      height_cm: patient.height_cm,
      bmi: patient.bmi || 0,
      body_fat_percentage: patient.body_fat_percentage,
      muscle_mass_kg: patient.muscle_mass_kg,
      waist_cm: patient.waist_cm,
      hip_cm: patient.hip_cm,
    });

    this.showSuccess('Paciente seleccionado: ' + patient.full_name);
  }

  async savePatientInfo(): Promise<void> {
    const form = this.patientForm();
    
    if (!form.full_name?.trim()) {
      this.showError('El nombre del paciente es requerido');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    try {
      const patientData: PatientCreate = {
        ...form,
        diagnosis: this.diagnosis(),
        medical_records: this.medicalRecords(),
        ...this.anthropometry(),
      };

      if (this.selectedPatient()) {
        // Update existing patient
        const response = await this.patientsApi.update(this.selectedPatient()!.id, patientData);
        if (response.status === 200) {
          this.showSuccess('Paciente actualizado correctamente');
          await this.loadPatients();
        } else {
          this.showError(response.error?.message || 'Error updating patient');
        }
      } else {
        // Create new patient
        const response = await this.patientsApi.create(patientData);
        if (response.status === 201) {
          this.showSuccess('Paciente creado correctamente');
          this.clearForm();
          await this.loadPatients();
        } else {
          this.showError(response.error?.message || 'Error creating patient');
        }
      }
    } catch (error) {
      this.showError('Error connecting to server');
    } finally {
      this.isLoading.set(false);
    }
  }

  async saveDiagnosis(): Promise<void> {
    if (!this.selectedPatient()) {
      this.showError('Seleccione un paciente primero');
      return;
    }

    this.isLoading.set(true);

    try {
      const response = await this.patientsApi.update(this.selectedPatient()!.id, {
        diagnosis: this.diagnosis(),
      });

      if (response.status === 200) {
        this.showSuccess('Diagnóstico guardado correctamente');
        await this.loadPatients();
      } else {
        this.showError(response.error?.message || 'Error saving diagnosis');
      }
    } catch (error) {
      this.showError('Error connecting to server');
    } finally {
      this.isLoading.set(false);
    }
  }

  async saveMedicalRecords(): Promise<void> {
    if (!this.selectedPatient()) {
      this.showError('Seleccione un paciente primero');
      return;
    }

    this.isLoading.set(true);

    try {
      const response = await this.patientsApi.update(this.selectedPatient()!.id, {
        medical_records: this.medicalRecords(),
      });

      if (response.status === 200) {
        this.showSuccess('Control de expedientes guardado correctamente');
        await this.loadPatients();
      } else {
        this.showError(response.error?.message || 'Error saving medical records');
      }
    } catch (error) {
      this.showError('Error connecting to server');
    } finally {
      this.isLoading.set(false);
    }
  }

  async saveAnthropometry(): Promise<void> {
    if (!this.selectedPatient()) {
      this.showError('Seleccione un paciente primero');
      return;
    }

    this.isLoading.set(true);

    try {
      const anthro = this.anthropometry();
      const response = await this.patientsApi.update(this.selectedPatient()!.id, {
        weight_kg: anthro.weight_kg,
        height_cm: anthro.height_cm,
        bmi: this.calculatedBmi(),
        body_fat_percentage: anthro.body_fat_percentage,
        muscle_mass_kg: anthro.muscle_mass_kg,
        waist_cm: anthro.waist_cm,
        hip_cm: anthro.hip_cm,
      });

      if (response.status === 200) {
        this.showSuccess('Antropometría guardada correctamente');
        await this.loadPatients();
      } else {
        this.showError(response.error?.message || 'Error saving anthropometry');
      }
    } catch (error) {
      this.showError('Error connecting to server');
    } finally {
      this.isLoading.set(false);
    }
  }

  async deletePatient(): Promise<void> {
    if (!this.selectedPatient()) {
      this.showError('Seleccione un paciente primero');
      return;
    }

    if (!confirm('¿Está seguro de eliminar este paciente?')) {
      return;
    }

    this.isLoading.set(true);

    try {
      const response = await this.patientsApi.delete(this.selectedPatient()!.id);
      if (response.status === 204) {
        this.showSuccess('Paciente eliminado correctamente');
        this.clearForm();
        await this.loadPatients();
      } else {
        this.showError(response.error?.message || 'Error deleting patient');
      }
    } catch (error) {
      this.showError('Error connecting to server');
    } finally {
      this.isLoading.set(false);
    }
  }

  clearForm(): void {
    this.selectedPatient.set(null);
    this.patientForm.set({
      full_name: '',
      control_number: '',
      gender: undefined,
      career: '',
      age: undefined,
    });
    this.diagnosis.set({
      malnutrition: false,
      underweight: false,
      healthy_weight: false,
      overweight: false,
      obesity_1: false,
      obesity_2: false,
      obesity_3: false,
      diabetes: false,
      hypertension: false,
      dyslipidemia: false,
      nephropathy: false,
      other: '',
    });
    this.medicalRecords.set({
      orientations: '',
      hcn: '',
      meal_plan_type: '',
      first_visit: '',
      follow_up: '',
    });
    this.anthropometry.set({
      weight_kg: undefined,
      height_cm: undefined,
      bmi: 0,
      body_fat_percentage: undefined,
      muscle_mass_kg: undefined,
      waist_cm: undefined,
      hip_cm: undefined,
    });
  }

  clearAnthropometry(): void {
    this.anthropometry.set({
      weight_kg: undefined,
      height_cm: undefined,
      bmi: 0,
      body_fat_percentage: undefined,
      muscle_mass_kg: undefined,
      waist_cm: undefined,
      hip_cm: undefined,
    });
  }

  // Form update helpers
  updatePatientForm(field: keyof PatientCreate, value: unknown): void {
    this.patientForm.update(form => ({ ...form, [field]: value }));
  }

  updateDiagnosis(field: keyof PatientDiagnosis, value: unknown): void {
    this.diagnosis.update(d => ({ ...d, [field]: value }));
  }

  updateMedicalRecords(field: keyof MedicalRecords, value: unknown): void {
    this.medicalRecords.update(mr => ({ ...mr, [field]: value }));
  }

  updateAnthropometry(field: 'weight_kg' | 'height_cm' | 'bmi' | 'body_fat_percentage' | 'muscle_mass_kg' | 'waist_cm' | 'hip_cm', value: unknown): void {
    this.anthropometry.update(a => ({ ...a, [field]: value }));
  }

  private showError(message: string): void {
    this.errorMessage.set(message);
    this.successMessage.set(null);
    setTimeout(() => this.errorMessage.set(null), 5000);
  }

  private showSuccess(message: string): void {
    this.successMessage.set(message);
    this.errorMessage.set(null);
    setTimeout(() => this.successMessage.set(null), 3000);
  }

  getGenderDisplay(gender?: string): string {
    switch (gender) {
      case 'male': return 'M';
      case 'female': return 'F';
      case 'other': return 'O';
      default: return '-';
    }
  }
}
