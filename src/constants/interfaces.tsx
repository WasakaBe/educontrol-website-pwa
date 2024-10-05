// interfaces.tsx
export interface Asignatura {
 id_asignatura: number;
 nombre_asignatura: string;
 nombre_docente: string;
 nombre_grado: string;
 nombre_grupo: string;
 nombre_carrera_tecnica: string;
 ciclo_escolar: string;
 dias_horarios: Array<{ day: string; startTime: string; endTime: string }>;
 id_horario: number; // Asegúrate de incluir esta propiedad
 id_alumno: number;  // Agregar esta propiedad
}

export interface HorarioAlumno {
 id_horario_alumno: number;
 nombre_asignatura: string;
 nombre_docente: string;
 nombre_carrera_tecnica: string;
 ciclo_escolar: string;
 dias_horarios: Array<{ day: string; startTime: string; endTime: string }>;
 id_alumno: number;
 fecha_inscripcion: string; // o Date si prefieres manejarlo como objeto Date
}


export interface Asistencia {
 id_asistencia: number;
 id_alumno: number;
 id_horario: number;
 fecha: string;
 estado_asistencia: string;
 comentarios: string;
}

export interface Horario {
 id_horario: number
 nombre_asignatura: string
 nombre_docente: string
 nombre_grado: string
 nombre_grupo: string
 nombre_carrera_tecnica: string
 ciclo_escolar: string
 dias_horarios: Array<{ day: string; startTime: string; endTime: string }>
}

export interface Alumno {
 id_alumnos: number
 nombre_alumnos: string
 app_alumnos: string
 apm_alumnos: string
 nocontrol_alumnos: string
 foto_alumnos: string
 nombre_carrera_tecnica: string
 nombre_grado: string
 nombre_grupo: string
}

export interface Docente {
 id_docentes: number;
 nombre_docentes: string;
 app_docentes: string;
 apm_docentes: string;
 foto_docentes?: string;
 fecha_nacimiento_docentes: string;
 noconttrol_docentes: string;
 telefono_docentes: string;
 seguro_social_docentes: string;
 sexo: string;
 clinica: string;
 idUsuario: number;
}

export interface Notification {
 id_notificaciones_docentes: number;
 subject_notificacion_doc: string;
 message_notificacion_doc: string;
 fecha_notificafecha_notificaciones_docciones: string;
}

export interface Notificacion_Alumno {
 id_notificacion: number;
 subject_notificacion: string;
 message_notificacion: string;
 fecha_notificaciones: string; // o Date si prefieres convertir la fecha al recibir los datos
}


export interface MensajeContacto {
 id: number;
 nombre: string;
 app?: string;
 apm?: string;
 correo: string;
 motivo: string;
 fecha: string;
 tipo: string;
}

export interface MensajeContactoAPI {
 id_mensaje_contacto: number;
 nombre_mensaje_contacto: string;
 correo_mensaje_contacto: string;
 motivo_mensaje_contacto: string;
 fecha_mensaje: string;
}

export interface MensajeMotivoCredencialAPI {
 id_mensajes_motivo_credencial: number;
 nombre_alumnos: string;
 app_alumnos: string;
 apm_alumnos: string;
 correo_usuario: string;
 nombre_motivo_credencial: string;
 fecha_motivo_credencial: string;
}

export interface Alumnos {
 id_alumnos: string
 nombre_alumnos: string
 app_alumnos: string
 apm_alumnos: string
 foto_usuario: string | null
 foto_carrera_tecnica: string | null
 fecha_nacimiento_alumnos: string
 curp_alumnos: string
 nocontrol_alumnos: string
 telefono_alumnos: string
 seguro_social_alumnos: string
 cuentacredencial_alumnos: string
 sexo: string
 correo_usuario: string
 clinica: string
 grado: string
 grupo: string
 traslado: number
 traslado_transporte: number
 carrera_tecnica: string
 pais: string
 estado: string
 municipio_alumnos: string
 comunidad_alumnos: string
 calle_alumnos: string
 proc_sec_alumno: string
 nombre_completo_familiar: string
 telefono_familiar : string
 telefono_trabajo_familiar : string
 correo_familiar : string
}

export interface Credencial {
 id_credencial_escolar: number;
 nombre_credencial_escolar: string;
 app_credencial_escolar: string;
 apm_credencial_escolar: string;
 carrera_credencial_escolar: string;
 grupo_credencial_escolar: string;
 curp_credencial_escolar: string;
 nocontrol_credencial_escolar: string;
 segsocial_credencial_escolar: string;
 idalumnocrede: number;
}

export interface Grupo {
 id_grupos: number;
 nombre_grupos: string;
}

export interface Alumn {
 id_alumnos: number
 nombre_alumnos: string
 app_alumnos: string
 apm_alumnos: string
 foto_usuario: string | null
 foto_carrera_tecnica: string | null
 fecha_nacimiento_alumnos: string
 curp_alumnos: string
 nocontrol_alumnos: string
 telefono_alumnos: string
 seguro_social_alumnos: string
 cuentacredencial_alumnos: string
 sexo: string
 correo_usuario: string
 clinica: string
 grado: string
 grupo: string
 traslado: number
 traslado_transporte: number
 carrera_tecnica: string
 pais: string
 estado: string
 municipio_alumnos: string
 comunidad_alumnos: string
 calle_alumnos: string
 proc_sec_alumno: string
 nombre_completo_familiar: string
 telefono_familiar : string
 telefono_trabajo_familiar : string
 correo_familiar : string
}


export interface ManualAddFormData {
 nombre_alumnos: string
 app_alumnos: string
 apm_alumnos: string
 fecha_nacimiento_alumnos: string
 curp_alumnos: string
 nocontrol_alumnos: string
 telefono_alumnos: string
 seguro_social_alumnos: string
 cuentacredencial_alumnos: string
 idSexo: string
 idUsuario: number
 idClinica: string
 idGrado: string
 idGrupo: string
 idTraslado: string
 idTrasladotransporte: string
 idCarreraTecnica: string
 idPais: string
 idEstado: string
 municipio_alumnos: string
 comunidad_alumnos: string
 calle_alumnos: string
 proc_sec_alumno: string
 nombre_completo_familiar: string
 telefono_familiar : string
 telefono_trabajo_familiar : string
 correo_familiar : string
}

export interface SecretQuestion {
 id_preguntas: number
 nombre_preguntas: string
}

export interface SexOption {
 id_sexos: number
 nombre_sexo: string
}

export interface Clinic {
 id_clinicas: number
 nombre_clinicas: string
}

export interface Grado {
 id_grado: number
 nombre_grado: string
}


export interface Traslado {
 id_traslado: number
 nombre_traslado: string
}

export  interface TrasladoTransporte {
 id_traslado_transporte: number
 nombre_traslado_transporte: string
}

export  interface CarreraTecnica {
 id_carrera_tecnica: number
 nombre_carrera_tecnica: string
 descripcion_carrera_tecnica: string
 foto_carrera_tecnica: string | null
}

export interface Pais {
 id_pais: number
 nombre_pais: string
 foto_pais: string | null
}

export  interface Estado {
 id_estado: number
 nombre_estado: string
 foto_estado: string | null
}


export interface Beca {
 id_info_becas: number;
 titulo_info_becas: string;
 descripcion_info_becas: string;
 requisitos_info_becas: string;
 foto_info_becas: string;
}
