package org.utl.dsm.SneakStyle.model;

public class Producto {
    private int idProducto;
    private String nombreProducto;
    private String descripcion;
    private double precio;
    private String categoria;
    private int estatus;

    // NUEVO
    private String imagenBase64;

    public int getIdProducto() { return idProducto; }
    public void setIdProducto(int idProducto) { this.idProducto = idProducto; }

    public String getNombreProducto() { return nombreProducto; }
    public void setNombreProducto(String nombreProducto) { this.nombreProducto = nombreProducto; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public double getPrecio() { return precio; }
    public void setPrecio(double precio) { this.precio = precio; }

    public String getCategoria() { return categoria; }
    public void setCategoria(String categoria) { this.categoria = categoria; }

    public int getEstatus() { return estatus; }
    public void setEstatus(int estatus) { this.estatus = estatus; }

    // NUEVO
    public String getImagenBase64() { return imagenBase64; }
    public void setImagenBase64(String imagenBase64) { this.imagenBase64 = imagenBase64; }
}
