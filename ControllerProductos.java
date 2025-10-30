package org.utl.dsm.SneakStyle.controller;

import java.sql.*;
import java.util.*;
import org.utl.dsm.SneakStyle.db.ConexionMySQL;
import org.utl.dsm.SneakStyle.model.Producto;

public class ControllerProductos {

    public void insert(Producto p) throws Exception {
        String query = "INSERT INTO producto(nombreProducto, descripcion, precio, categoria, estatus, imagenBase64) " +
                       "VALUES (?, ?, ?, ?, 1, ?)";
        try (Connection conn = new ConexionMySQL().open();
             PreparedStatement ps = conn.prepareStatement(query)) {
            ps.setString(1, p.getNombreProducto());
            ps.setString(2, p.getDescripcion());
            ps.setDouble(3, p.getPrecio());
            ps.setString(4, p.getCategoria());
            ps.setString(5, p.getImagenBase64());  // NUEVO
            ps.executeUpdate();
        }
    }

    public void update(Producto p) throws Exception {
        String query = "UPDATE producto SET nombreProducto = ?, descripcion = ?, precio = ?, categoria = ?, imagenBase64 = ? " +
                       "WHERE idProducto = ?";
        try (Connection conn = new ConexionMySQL().open();
             PreparedStatement ps = conn.prepareStatement(query)) {
            ps.setString(1, p.getNombreProducto());
            ps.setString(2, p.getDescripcion());
            ps.setDouble(3, p.getPrecio());
            ps.setString(4, p.getCategoria());
            ps.setString(5, p.getImagenBase64());  // NUEVO
            ps.setInt(6, p.getIdProducto());
            ps.executeUpdate();
        }
    }

    public void deleteLogical(int id) throws Exception {
        String sql = "UPDATE producto SET estatus = 0 WHERE idProducto = ?";
        try (Connection conn = new ConexionMySQL().open();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, id);
            ps.executeUpdate();
        }
    }

    public void deletePhysicalSafe(int id) throws Exception {
        try (Connection conn = new ConexionMySQL().open()) {
            conn.setAutoCommit(false);
            try (PreparedStatement psInv = conn.prepareStatement("DELETE FROM inventario WHERE id_producto = ?");
                 PreparedStatement psProd = conn.prepareStatement("DELETE FROM producto WHERE idProducto = ?")) {

                psInv.setInt(1, id);
                psInv.executeUpdate();

                psProd.setInt(1, id);
                psProd.executeUpdate();

                conn.commit();
            } catch (Exception ex) {
                conn.rollback();
                throw ex;
            } finally {
                conn.setAutoCommit(true);
            }
        }
    }

    public List<Producto> getAll() throws Exception {
        List<Producto> productos = new ArrayList<>();
        String query = "SELECT * FROM producto WHERE estatus = 1";
        try (Connection conn = new ConexionMySQL().open();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(query)) {

            while (rs.next()) {
                Producto p = new Producto();
                p.setIdProducto(rs.getInt("idProducto"));
                p.setNombreProducto(rs.getString("nombreProducto"));
                p.setDescripcion(rs.getString("descripcion"));
                p.setPrecio(rs.getDouble("precio"));
                p.setCategoria(rs.getString("categoria"));
                p.setEstatus(rs.getInt("estatus"));
                p.setImagenBase64(rs.getString("imagenBase64")); // NUEVO
                productos.add(p);
            }
        }
        return productos;
    }

    public Producto getById(int id) throws Exception {
        Producto producto = null;
        String query = "SELECT * FROM producto WHERE idProducto = ? AND estatus = 1";
        try (Connection conn = new ConexionMySQL().open();
             PreparedStatement ps = conn.prepareStatement(query)) {
            ps.setInt(1, id);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    producto = new Producto();
                    producto.setIdProducto(rs.getInt("idProducto"));
                    producto.setNombreProducto(rs.getString("nombreProducto"));
                    producto.setDescripcion(rs.getString("descripcion"));
                    producto.setPrecio(rs.getDouble("precio"));
                    producto.setCategoria(rs.getString("categoria"));
                    producto.setEstatus(rs.getInt("estatus"));
                    producto.setImagenBase64(rs.getString("imagenBase64")); // NUEVO
                }
            }
        }
        return producto;
    }
}
