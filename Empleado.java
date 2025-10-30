package org.utl.dsm.SneakStyle.model;

public class Empleado {
    private int idEmpleado;
    private String nombreCompleto;
    private String telefono;
    private String correoEmpleado;
    private String nombreUsuario;
    private String correoUsuario;
    private String fotoBase64; // NUEVO

    public int getIdEmpleado() { return idEmpleado; }
    public void setIdEmpleado(int idEmpleado) { this.idEmpleado = idEmpleado; }

    public String getNombreCompleto() { return nombreCompleto; }
    public void setNombreCompleto(String nombreCompleto) { this.nombreCompleto = nombreCompleto; }

    public String getTelefono() { return telefono; }
    public void setTelefono(String telefono) { this.telefono = telefono; }

    public String getCorreoEmpleado() { return correoEmpleado; }
    public void setCorreoEmpleado(String correoEmpleado) { this.correoEmpleado = correoEmpleado; }

    public String getNombreUsuario() { return nombreUsuario; }
    public void setNombreUsuario(String nombreUsuario) { this.nombreUsuario = nombreUsuario; }

    public String getCorreoUsuario() { return correoUsuario; }
    public void setCorreoUsuario(String correoUsuario) { this.correoUsuario = correoUsuario; }

    public String getFotoBase64() { return fotoBase64; }
    public void setFotoBase64(String fotoBase64) { this.fotoBase64 = fotoBase64; }
}
