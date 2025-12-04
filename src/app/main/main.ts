import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PacientesApiService } from '../core/api/pacientes-api.service';
import { DiagnosticosApiService } from '../core/api/diagnosticos-api.service';
import { ControlExpedientesApiService } from '../core/api/control-expedientes-api.service';
import { AntropometriaApiService } from '../core/api/antropometria-api.service';
import { Paciente, PacienteCreate } from '../core/models/paciente.model';
import { DiagnosticoUpdate } from '../core/models/diagnostico.model';
import { ControlExpedienteUpdate } from '../core/models/control-expediente.model';
import { AntropometriaUpdate } from '../core/models/antropometria.model';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './main.html',
  styleUrl: './main.css'
})
export class Main implements OnInit {
  // Patient list
  pacientes = signal<Paciente[]>([]);
  selectedPaciente = signal<Paciente | null>(null);
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  // Form fields for patient info
  pacienteForm = signal<PacienteCreate>({
    nombre: '',
    numero_control: '',
    sexo: undefined,
    carrera: '',
    edad: undefined,
  });

  // Diagnosis checkboxes
  diagnostico = signal<DiagnosticoUpdate>({
    desnutricion: false,
    bajo_peso: false,
    peso_sano: false,
    sobrepeso: false,
    obesidad_1: false,
    obesidad_2: false,
    obesidad_3: false,
    diabetes: false,
    hipertension: false,
    dislipidemias: false,
    nefropatias: false,
    otros: '',
  });

  // Control expedientes
  controlExpediente = signal<ControlExpedienteUpdate>({
    orientaciones: '',
    hcn: '',
    plan_alimentacion: '',
    primera_vez: false,
    seguimiento: false,
  });

  // Anthropometry
  antropometria = signal({
    peso: undefined as number | undefined,
    talla: undefined as number | undefined,
    imc: 0,
  });

  // Computed BMI (talla in meters for IMC calculation)
  calculatedBmi = computed(() => {
    const anthro = this.antropometria();
    if (anthro.peso && anthro.talla) {
      // talla is in meters (e.g., 1.75)
      return +(anthro.peso / (anthro.talla * anthro.talla)).toFixed(2);
    }
    return 0;
  });

  constructor(
    private pacientesApi: PacientesApiService,
    private diagnosticosApi: DiagnosticosApiService,
    private controlExpedientesApi: ControlExpedientesApiService,
    private antropometriaApi: AntropometriaApiService
  ) {}

  ngOnInit(): void {
    this.loadPacientes();
  }

  async loadPacientes(): Promise<void> {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    try {
      const response = await this.pacientesApi.getAll();
      if (response.status === 200 && response.data) {
        this.pacientes.set(response.data);
      } else {
        this.errorMessage.set(response.error?.message || 'Error cargando pacientes');
      }
    } catch (error) {
      this.errorMessage.set('Error conectando al servidor');
    } finally {
      this.isLoading.set(false);
    }
  }

  async selectPaciente(paciente: Paciente): Promise<void> {
    this.selectedPaciente.set(paciente);
    this.isLoading.set(true);
    
    // Load patient data into forms
    this.pacienteForm.set({
      nombre: paciente.nombre,
      numero_control: paciente.numero_control,
      sexo: paciente.sexo,
      carrera: paciente.carrera || '',
      edad: paciente.edad,
    });

    try {
      // Load diagnosis
      const diagResponse = await this.diagnosticosApi.getByPacienteId(paciente.id);
      if (diagResponse.status === 200 && diagResponse.data) {
        this.diagnostico.set({
          desnutricion: diagResponse.data.desnutricion,
          bajo_peso: diagResponse.data.bajo_peso,
          peso_sano: diagResponse.data.peso_sano,
          sobrepeso: diagResponse.data.sobrepeso,
          obesidad_1: diagResponse.data.obesidad_1,
          obesidad_2: diagResponse.data.obesidad_2,
          obesidad_3: diagResponse.data.obesidad_3,
          diabetes: diagResponse.data.diabetes,
          hipertension: diagResponse.data.hipertension,
          dislipidemias: diagResponse.data.dislipidemias,
          nefropatias: diagResponse.data.nefropatias,
          otros: diagResponse.data.otros || '',
        });
      } else {
        this.resetDiagnostico();
      }

      // Load control expediente
      const controlResponse = await this.controlExpedientesApi.getByPacienteId(paciente.id);
      if (controlResponse.status === 200 && controlResponse.data) {
        this.controlExpediente.set({
          orientaciones: controlResponse.data.orientaciones || '',
          hcn: controlResponse.data.hcn || '',
          plan_alimentacion: controlResponse.data.plan_alimentacion || '',
          primera_vez: controlResponse.data.primera_vez,
          seguimiento: controlResponse.data.seguimiento,
        });
      } else {
        this.resetControlExpediente();
      }

      // Load anthropometry
      const anthroResponse = await this.antropometriaApi.getByPacienteId(paciente.id);
      if (anthroResponse.status === 200 && anthroResponse.data) {
        this.antropometria.set({
          peso: anthroResponse.data.peso,
          talla: anthroResponse.data.talla,
          imc: anthroResponse.data.imc || 0,
        });
      } else {
        this.resetAntropometria();
      }

      this.showSuccess('Paciente seleccionado: ' + paciente.nombre);
    } catch (error) {
      this.showError('Error cargando datos del paciente');
    } finally {
      this.isLoading.set(false);
    }
  }

  async savePacienteInfo(): Promise<void> {
    const form = this.pacienteForm();
    
    if (!form.nombre?.trim()) {
      this.showError('El nombre del paciente es requerido');
      return;
    }

    if (!form.numero_control?.trim()) {
      this.showError('El número de control es requerido');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    try {
      if (this.selectedPaciente()) {
        // Update existing patient
        const response = await this.pacientesApi.update(this.selectedPaciente()!.id, form);
        if (response.status === 200) {
          this.showSuccess('Paciente actualizado correctamente');
          await this.loadPacientes();
        } else {
          this.showError(response.error?.message || 'Error actualizando paciente');
        }
      } else {
        // Create new patient
        const response = await this.pacientesApi.create(form);
        if (response.status === 201) {
          this.showSuccess('Paciente creado correctamente');
          this.clearForm();
          await this.loadPacientes();
        } else {
          this.showError(response.error?.message || 'Error creando paciente');
        }
      }
    } catch (error) {
      this.showError('Error conectando al servidor');
    } finally {
      this.isLoading.set(false);
    }
  }

  async saveDiagnostico(): Promise<void> {
    if (!this.selectedPaciente()) {
      this.showError('Seleccione un paciente primero');
      return;
    }

    this.isLoading.set(true);

    try {
      const response = await this.diagnosticosApi.upsertByPacienteId(
        this.selectedPaciente()!.id,
        this.diagnostico()
      );

      if (response.status === 200 || response.status === 201) {
        this.showSuccess('Diagnóstico guardado correctamente');
      } else {
        this.showError(response.error?.message || 'Error guardando diagnóstico');
      }
    } catch (error) {
      this.showError('Error conectando al servidor');
    } finally {
      this.isLoading.set(false);
    }
  }

  async saveControlExpediente(): Promise<void> {
    if (!this.selectedPaciente()) {
      this.showError('Seleccione un paciente primero');
      return;
    }

    this.isLoading.set(true);

    try {
      const response = await this.controlExpedientesApi.upsertByPacienteId(
        this.selectedPaciente()!.id,
        this.controlExpediente()
      );

      if (response.status === 200 || response.status === 201) {
        this.showSuccess('Control de expedientes guardado correctamente');
      } else {
        this.showError(response.error?.message || 'Error guardando control de expedientes');
      }
    } catch (error) {
      this.showError('Error conectando al servidor');
    } finally {
      this.isLoading.set(false);
    }
  }

  async saveAntropometria(): Promise<void> {
    if (!this.selectedPaciente()) {
      this.showError('Seleccione un paciente primero');
      return;
    }

    const anthro = this.antropometria();
    if (!anthro.peso || anthro.peso <= 0) {
      this.showError('El peso debe ser mayor a 0');
      return;
    }

    if (!anthro.talla || anthro.talla <= 0) {
      this.showError('La talla debe ser mayor a 0');
      return;
    }

    this.isLoading.set(true);

    try {
      const response = await this.antropometriaApi.upsertByPacienteId(
        this.selectedPaciente()!.id,
        {
          peso: anthro.peso,
          talla: anthro.talla,
        }
      );

      if (response.status === 200 || response.status === 201) {
        // Update the IMC from the response (calculated by database trigger)
        if (response.data) {
          this.antropometria.update(a => ({ ...a, imc: response.data!.imc }));
        }
        this.showSuccess('Antropometría guardada correctamente');
      } else {
        this.showError(response.error?.message || 'Error guardando antropometría');
      }
    } catch (error) {
      this.showError('Error conectando al servidor');
    } finally {
      this.isLoading.set(false);
    }
  }

  async deletePaciente(): Promise<void> {
    if (!this.selectedPaciente()) {
      this.showError('Seleccione un paciente primero');
      return;
    }

    if (!confirm('¿Está seguro de eliminar este paciente?')) {
      return;
    }

    this.isLoading.set(true);

    try {
      const response = await this.pacientesApi.delete(this.selectedPaciente()!.id);
      if (response.status === 204) {
        this.showSuccess('Paciente eliminado correctamente');
        this.clearForm();
        await this.loadPacientes();
      } else {
        this.showError(response.error?.message || 'Error eliminando paciente');
      }
    } catch (error) {
      this.showError('Error conectando al servidor');
    } finally {
      this.isLoading.set(false);
    }
  }

  clearForm(): void {
    this.selectedPaciente.set(null);
    this.pacienteForm.set({
      nombre: '',
      numero_control: '',
      sexo: undefined,
      carrera: '',
      edad: undefined,
    });
    this.resetDiagnostico();
    this.resetControlExpediente();
    this.resetAntropometria();
  }

  private resetDiagnostico(): void {
    this.diagnostico.set({
      desnutricion: false,
      bajo_peso: false,
      peso_sano: false,
      sobrepeso: false,
      obesidad_1: false,
      obesidad_2: false,
      obesidad_3: false,
      diabetes: false,
      hipertension: false,
      dislipidemias: false,
      nefropatias: false,
      otros: '',
    });
  }

  private resetControlExpediente(): void {
    this.controlExpediente.set({
      orientaciones: '',
      hcn: '',
      plan_alimentacion: '',
      primera_vez: false,
      seguimiento: false,
    });
  }

  private resetAntropometria(): void {
    this.antropometria.set({
      peso: undefined,
      talla: undefined,
      imc: 0,
    });
  }

  clearAntropometria(): void {
    this.resetAntropometria();
  }

  // Form update helpers
  updatePacienteForm(field: keyof PacienteCreate, value: unknown): void {
    this.pacienteForm.update(form => ({ ...form, [field]: value }));
  }

  updateDiagnostico(field: keyof DiagnosticoUpdate, value: unknown): void {
    this.diagnostico.update(d => ({ ...d, [field]: value }));
  }

  updateControlExpediente(field: keyof ControlExpedienteUpdate, value: unknown): void {
    this.controlExpediente.update(ce => ({ ...ce, [field]: value }));
  }

  updateAntropometria(field: 'peso' | 'talla' | 'imc', value: unknown): void {
    this.antropometria.update(a => ({ ...a, [field]: value }));
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

  getSexoDisplay(sexo?: string): string {
    switch (sexo) {
      case 'M': return 'M';
      case 'F': return 'F';
      default: return '-';
    }
  }
}
