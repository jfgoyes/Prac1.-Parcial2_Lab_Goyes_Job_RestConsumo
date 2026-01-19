import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, firstValueFrom } from 'rxjs';

// Exportamos la interfaz con un nombre específico
export interface ICobrador {
  cobrador_id?: number;
  cobrador_cedula: string;
  cobrador_nombre: string;
  cobrador_direccion: string;
}

@Injectable({
  providedIn: 'root',
})
export class CobradorService {
  private apiUrl = 'http://localhost:3000/cobrador';

  constructor(private http: HttpClient) { }

  // Obtener todos los cobradores
  getCobradores(): Observable<ICobrador[]> {
    return this.http.get<ICobrador[]>(this.apiUrl);
  }

  // Obtener cobrador por cédula
  async getCobradorPorCedula(cedula: string): Promise<ICobrador | null> {
    try {
      return await firstValueFrom(
        this.http.get<ICobrador>(`${this.apiUrl}/cedula/${cedula}`)
      );
    } catch (error) {
      console.error('Error al buscar cobrador:', error);
      return null;
    }
  }

  // Crear nuevo cobrador
  async crearCobrador(cobrador: ICobrador): Promise<ICobrador> {
    return await firstValueFrom(
      this.http.post<ICobrador>(this.apiUrl, cobrador)
    );
  }

  // Actualizar cobrador
  async actualizarCobrador(id: number, cobrador: ICobrador): Promise<any> {
    return await firstValueFrom(
      this.http.put(`${this.apiUrl}/${id}`, cobrador)
    );
  }

  // Eliminar cobrador
  async eliminarCobrador(id: number): Promise<any> {
    return await firstValueFrom(
      this.http.delete(`${this.apiUrl}/${id}`)
    );
  }
}
