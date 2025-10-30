package org.utl.dsm.SneakStyle.model;

public class Proveedor {
    private int idProveedor;
    private String nombreEmpresa;
    private String nombreContacto;
    private String telefono;
    private String direccion;
    private boolean activo;

    public Proveedor() {}

    public Proveedor(int idProveedor, String nombreEmpresa, String nombreContacto, String telefono, String direccion, boolean activo) {
        this.idProveedor = idProveedor;
        this.nombreEmpresa = nombreEmpresa;
        this.nombreContacto = nombreContacto;
        this.telefono = telefono;
        this.direccion = direccion;
        this.activo = activo;
    }

    public int getIdProveedor() { return idProveedor; }
    public void setIdProveedor(int idProveedor) { this.idProveedor = idProveedor; }

    public String getNombreEmpresa() { return nombreEmpresa; }
    public void setNombreEmpresa(String nombreEmpresa) { this.nombreEmpresa = nombreEmpresa; }

    public String getNombreContacto() { return nombreContacto; }
    public void setNombreContacto(String nombreContacto) { this.nombreContacto = nombreContacto; }

    public String getTelefono() { return telefono; }
    public void setTelefono(String telefono) { this.telefono = telefono; }

    public String getDireccion() { return direccion; }
    public void setDireccion(String direccion) { this.direccion = direccion; }

    public boolean isActivo() { return activo; }
    public void setActivo(boolean activo) { this.activo = activo; }
}
