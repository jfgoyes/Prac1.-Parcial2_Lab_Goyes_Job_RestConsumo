import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CobradorService, ICobrador } from '../services/cobrador';

@Component({
  selector: 'app-cobrador-component',
  templateUrl: './cobrador-component.html',
  styleUrl: './cobrador-component.css',
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class CobradorComponent implements OnInit {
  cobradores: ICobrador[] = [];
  cobrador: ICobrador | null = null;
  cedulaBusqueda: string = '';

  // Formulario para nuevo registro/edición de registros
  formCobrador: ICobrador = {
    cobrador_cedula: '',
    cobrador_nombre: '',
    cobrador_direccion: ''
  };

  isEditMode: boolean = false;
  loading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private cobradorService: CobradorService) { }

  async ngOnInit() {
    await this.cargarCobradores();
  }

  // Función asíncrona para cargar todos los cobradores
  async cargarCobradores() {
    this.loading = true;
    this.errorMessage = '';
    
    try {
      this.cobradorService.getCobradores().subscribe({
        next: (data: ICobrador[]) => {
          this.cobradores = data;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error al cargar cobradores:', error);
          this.errorMessage = 'Error al cargar los cobradores';
          this.loading = false;
        }
      });
    } catch (error) {
      console.error('Error al cargar cobradores:', error);
      this.errorMessage = 'Error al cargar los cobradores';
      this.loading = false;
    }
  }

  // Función asíncrona para buscar un cobrador por cédula
  async buscarPorCedula() {
    if (!this.cedulaBusqueda.trim()) {
      this.errorMessage = 'Por favor ingrese una cédula válida';
      return;
    }
    
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';
    
    try {
      this.cobrador = await this.cobradorService.getCobradorPorCedula(this.cedulaBusqueda);
      
      if (!this.cobrador) {
        this.errorMessage = 'No se encontró ningún cobrador con esa cédula';
      }
    } catch (error) {
      console.error('Error al buscar cobrador:', error);
      this.errorMessage = 'Error al buscar el cobrador';
      this.cobrador = null;
    } finally {
      this.loading = false;
    }
  }

  // Función asíncrona para crear un nuevo cobrador
  async crearCobrador() {
    if (!this.validarFormulario()) return;
    
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';
    
    try {
      const resultado = await this.cobradorService.crearCobrador(this.formCobrador);
      console.log('Cobrador creado:', resultado);
      this.successMessage = 'Cobrador creado exitosamente';
      this.resetFormulario();
      setTimeout(() => {
        this.cargarCobradores();
      }, 500);
      
    } catch (error: any) {
      console.error('Error al crear cobrador:', error);
      this.errorMessage = error.error?.message || 'Error al crear el cobrador';
      this.successMessage = '';
    } finally {
      this.loading = false;
    }
  }

  // Función asíncrona para actualizar un cobrador existente
  async actualizarCobrador() {
    if (!this.validarFormulario()) return;
    if (!this.cobrador?.cobrador_id) {
      this.errorMessage = 'No hay cobrador seleccionado para actualizar';
      return;
    }
    
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';
    
    try {
      const resultado = await this.cobradorService.actualizarCobrador(
        this.cobrador.cobrador_id, 
        this.formCobrador
      );
      console.log('Cobrador actualizado:', resultado);
      this.successMessage = 'Cobrador actualizado exitosamente';
      this.resetFormulario();
      this.cobrador = null;
      setTimeout(() => {
        this.cargarCobradores();
      }, 500);
      
    } catch (error: any) {
      console.error('Error al actualizar cobrador:', error);
      this.errorMessage = error.error?.message || 'Error al actualizar el cobrador';
      this.successMessage = '';
    } finally {
      this.loading = false;
    }
  }

  // Función asíncrona para eliminar un cobrador
  async eliminarCobrador(id: number) {
    if (!id || !confirm('¿Está seguro de eliminar este cobrador?')) return;
    
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';
    
    try {
      const resultado = await this.cobradorService.eliminarCobrador(id);
      console.log('Cobrador eliminado:', resultado);
      this.successMessage = 'Cobrador eliminado exitosamente';
      if (this.cobrador?.cobrador_id === id) {
        this.cobrador = null;
        this.resetFormulario();
      }
      setTimeout(() => {
        this.cargarCobradores();
      }, 500);
      
    } catch (error: any) {
      console.error('Error al eliminar cobrador:', error);
      this.errorMessage = error.error?.message || 'Error al eliminar el cobrador';
      this.successMessage = '';
    } finally {
      this.loading = false;
    }
  }

  // Método para editar un cobrador existente
  editarCobrador(c: ICobrador) {
    this.cobrador = { ...c };
    this.formCobrador = { ...c };
    this.isEditMode = true;
    this.errorMessage = '';
    this.successMessage = '';
    setTimeout(() => {
      const formElement = document.querySelector('.card');
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }

  // Método para cancelar edición de algun cobrador
  cancelarEdicion() {
    this.resetFormulario();
    this.cobrador = null;
    this.isEditMode = false;
    this.errorMessage = '';
    this.successMessage = '';
  }

  // Método para cargar datos encontrados en el formulario
  cargarEnFormulario() {
    if (this.cobrador) {
      this.formCobrador = { ...this.cobrador };
      this.isEditMode = true;
      this.errorMessage = '';
      this.successMessage = '';
    }
  }

  // Métodos auxiliares privados
  private validarFormulario(): boolean {
    if (!this.formCobrador.cobrador_cedula.trim()) {
      this.errorMessage = 'La cédula es requerida';
      return false;
    }
    if (!this.formCobrador.cobrador_nombre.trim()) {
      this.errorMessage = 'El nombre es requerido';
      return false;
    }
    return true;
  }

  resetFormulario() {
    this.formCobrador = {
      cobrador_cedula: '',
      cobrador_nombre: '',
      cobrador_direccion: ''
    };
    this.isEditMode = false;
  }

  // Método para limpiar mensajes
  clearMessages() {
    this.errorMessage = '';
    this.successMessage = '';
  }
}
