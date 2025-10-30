package org.utl.dsm.SneakStyle.controller;

import java.sql.*;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.utl.dsm.SneakStyle.db.ConexionMySQL;
import org.utl.dsm.SneakStyle.model.Inventario;
import org.utl.dsm.SneakStyle.model.Producto;
import org.utl.dsm.SneakStyle.model.Proveedor;

public class ControllerInventario {

    /* ================== helpers para columnas “camaleón” ================== */

    private Set<String> cols(ResultSet rs) throws SQLException {
        ResultSetMetaData md = rs.getMetaData();
        Set<String> set = new HashSet<>();
        for (int i = 1; i <= md.getColumnCount(); i++) {
            set.add(md.getColumnLabel(i));
        }
        return set;
    }

    private boolean has(Set<String> set, String c) { return set.contains(c); }

    private int getIntSafe(ResultSet rs, Set<String> set, String... names) throws SQLException {
        for (String n : names) if (has(set, n)) return rs.getInt(n);
        return 0;
    }

    private String getStringSafe(ResultSet rs, Set<String> set, String... names) throws SQLException {
        for (String n : names) if (has(set, n)) {
            String v = rs.getString(n);
            if (v != null) return v;
        }
        return null;
    }

    /* ================== CRUD (misma estructura que ya tenías) ================== */

    // INSERT con OUT id (usa tus SP actuales)
    public void insert(Inventario i) throws Exception {
        String sql = "{CALL SneakStyle.sp_inventario_insert(?, ?, ?, ?)}";
        try (Connection conn = new ConexionMySQL().open();
             CallableStatement cs = conn.prepareCall(sql)) {
            cs.setInt(1, i.getProducto().getIdProducto());      // p_id_producto
            cs.setInt(2, i.getProveedor().getIdProveedor());    // p_id_proveedor
            cs.setInt(3, i.getCantidad());                      // p_cantidad
            cs.registerOutParameter(4, Types.INTEGER);          // OUT p_id_inventario
            cs.execute();
            i.setIdInventario(cs.getInt(4)); // por si lo ocupas
        }
    }

    // UPDATE (tu SP actualiza id_producto, id_proveedor y cantidad)
    public void update(Inventario i) throws Exception {
        String sql = "{CALL SneakStyle.sp_inventario_update(?, ?, ?, ?)}";
        try (Connection conn = new ConexionMySQL().open();
             CallableStatement cs = conn.prepareCall(sql)) {
            cs.setInt(1, i.getIdInventario());                  // p_id_inventario
            cs.setInt(2, i.getProducto().getIdProducto());      // p_id_producto
            cs.setInt(3, i.getProveedor().getIdProveedor());    // p_id_proveedor
            cs.setInt(4, i.getCantidad());                      // p_cantidad
            cs.execute();
        }
    }

    // DELETE físico (alias para mantener tu firma)
    public void delete(int idInventario) throws Exception {
        deleteFisico(idInventario);
    }

    public void deleteFisico(int idInventario) throws Exception {
        String sql = "{CALL SneakStyle.sp_inventario_deleteFisico(?)}";
        try (Connection conn = new ConexionMySQL().open();
             CallableStatement cs = conn.prepareCall(sql)) {
            cs.setInt(1, idInventario);
            cs.execute();
        }
    }

    // GET ALL (mapea lo que venga: idInventario o id_inventario; productoNombre o producto; etc.)
    public List<Inventario> getAll() throws Exception {
        List<Inventario> lista = new ArrayList<>();
        String sql = "{CALL SneakStyle.sp_inventario_getAll()}";

        try (Connection conn = new ConexionMySQL().open();
             CallableStatement cs = conn.prepareCall(sql);
             ResultSet rs = cs.executeQuery()) {

            while (rs.next()) {
                Set<String> set = cols(rs);

                Inventario inv = new Inventario();
                inv.setIdInventario(getIntSafe(rs, set, "idInventario", "id_inventario"));
                inv.setCantidad(getIntSafe(rs, set, "cantidad"));

                Producto p = new Producto();
                p.setIdProducto(getIntSafe(rs, set, "productoId", "id_producto", "idProducto"));
                p.setNombreProducto(
                    coalesce(getStringSafe(rs, set, "productoNombre", "producto", "nombreProducto"), "")
                );
                inv.setProducto(p);

                Proveedor pr = new Proveedor();
                pr.setIdProveedor(getIntSafe(rs, set, "proveedorId", "id_proveedor", "idProveedor"));
                // Guarda en nombreEmpresa el nombre del proveedor calculado
                pr.setNombreEmpresa(
                    coalesce(getStringSafe(rs, set, "proveedorNombre", "proveedor", "nombreProveedor", "nombre_empresa", "nombre_contacto"),
                             "Proveedor " + pr.getIdProveedor())
                );
                inv.setProveedor(pr);

                lista.add(inv);
            }
        }
        return lista;
    }

    // GET BY ID (mismo esquema flexible)
    public Inventario getById(int idInventario) throws Exception {
        Inventario inv = null;
        String sql = "{CALL SneakStyle.sp_inventario_getById(?)}";

        try (Connection conn = new ConexionMySQL().open();
             CallableStatement cs = conn.prepareCall(sql)) {

            cs.setInt(1, idInventario);

            try (ResultSet rs = cs.executeQuery()) {
                if (rs.next()) {
                    Set<String> set = cols(rs);

                    inv = new Inventario();
                    inv.setIdInventario(getIntSafe(rs, set, "idInventario", "id_inventario"));
                    inv.setCantidad(getIntSafe(rs, set, "cantidad"));

                    Producto p = new Producto();
                    p.setIdProducto(getIntSafe(rs, set, "productoId", "id_producto", "idProducto"));
                    p.setNombreProducto(
                        coalesce(getStringSafe(rs, set, "productoNombre", "producto", "nombreProducto"), "")
                    );
                    inv.setProducto(p);

                    Proveedor pr = new Proveedor();
                    pr.setIdProveedor(getIntSafe(rs, set, "proveedorId", "id_proveedor", "idProveedor"));
                    pr.setNombreEmpresa(
                        coalesce(getStringSafe(rs, set, "proveedorNombre", "proveedor", "nombreProveedor", "nombre_empresa", "nombre_contacto"),
                                 "Proveedor " + pr.getIdProveedor())
                    );
                    inv.setProveedor(pr);
                }
            }
        }
        return inv;
    }

    /* ================== util ================== */
    private static String coalesce(String a, String b) { return (a != null && !a.isEmpty()) ? a : b; }
}
