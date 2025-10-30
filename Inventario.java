package org.utl.dsm.SneakStyle.model;

/**
 *
 * @author Patri
 */
public class Inventario {
    
    private int idInventario;
    private Producto producto;
    private Proveedor proveedor;
    private int cantidad;

    public Inventario() {}

    public Inventario(int idInventario, Producto producto, Proveedor proveedor, int cantidad) {
        this.idInventario = idInventario;
        this.producto = producto;
        this.proveedor = proveedor;
        this.cantidad = cantidad;
    }

    public int getIdInventario() {
        return idInventario;
    }

    public void setIdInventario(int idInventario) {
        this.idInventario = idInventario;
    }

    public Producto getProducto() {
        return producto;
    }

    public void setProducto(Producto producto) {
        this.producto = producto;
    }

    public Proveedor getProveedor() {
        return proveedor;
    }

    public void setProveedor(Proveedor proveedor) {
        this.proveedor = proveedor;
    }

    public int getCantidad() {
        return cantidad;
    }

    public void setCantidad(int cantidad) {
        this.cantidad = cantidad;
    }
    
}
