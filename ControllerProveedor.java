package org.utl.dsm.SneakStyle.controller;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import org.utl.dsm.SneakStyle.db.ConexionMySQL;
import org.utl.dsm.SneakStyle.model.Proveedor;

public class ControllerProveedor {

    public void insertar(Proveedor p) throws Exception {
        String sql = "{CALL sp_proveedor_add(?, ?, ?, ?)}";

        ConexionMySQL connMySQL = new ConexionMySQL();
        Connection conn = connMySQL.open();
        CallableStatement cs = conn.prepareCall(sql);

        cs.setString(1, p.getNombreEmpresa());
        cs.setString(2, p.getNombreContacto());
        cs.setString(3, p.getTelefono());
        cs.setString(4, p.getDireccion());

        cs.execute();

        cs.close();
        conn.close();
    }

    public void actualizar(Proveedor p) throws Exception {
        String sql = "{CALL sp_proveedor_update(?, ?, ?, ?, ?)}";

        ConexionMySQL connMySQL = new ConexionMySQL();
        Connection conn = connMySQL.open();
        CallableStatement cs = conn.prepareCall(sql);

        cs.setInt(1, p.getIdProveedor());
        cs.setString(2, p.getNombreEmpresa());
        cs.setString(3, p.getNombreContacto());
        cs.setString(4, p.getTelefono());
        cs.setString(5, p.getDireccion());

        cs.execute();

        cs.close();
        conn.close();
    }

    public void eliminar(int idProveedor) throws Exception {
        String sql = "{CALL sp_proveedor_delete(?)}";

        ConexionMySQL connMySQL = new ConexionMySQL();
        Connection conn = connMySQL.open();
        CallableStatement cs = conn.prepareCall(sql);

        cs.setInt(1, idProveedor);
        cs.execute();

        cs.close();
        conn.close();
    }

    public List<Proveedor> getAll() throws Exception {
        String sql = "{CALL sp_proveedor_getAll()}";
        List<Proveedor> lista = new ArrayList<>();

        ConexionMySQL connMySQL = new ConexionMySQL();
        Connection conn = connMySQL.open();
        CallableStatement cs = conn.prepareCall(sql);
        ResultSet rs = cs.executeQuery();

        while (rs.next()) {
            Proveedor p = new Proveedor();
            p.setIdProveedor(rs.getInt("id_proveedor"));
            p.setNombreEmpresa(rs.getString("nombre_empresa"));
            p.setNombreContacto(rs.getString("nombre_contacto"));
            p.setTelefono(rs.getString("telefono"));
            p.setDireccion(rs.getString("direccion"));
            p.setActivo(rs.getBoolean("activo"));
            lista.add(p);
        }

        rs.close();
        cs.close();
        conn.close();

        return lista;
    }

    public Proveedor getById(int id) throws Exception {
        String sql = "{CALL sp_proveedor_getById(?)}";
        Proveedor p = null;

        ConexionMySQL connMySQL = new ConexionMySQL();
        Connection conn = connMySQL.open();
        CallableStatement cs = conn.prepareCall(sql);
        cs.setInt(1, id);

        ResultSet rs = cs.executeQuery();

        if (rs.next()) {
            p = new Proveedor();
            p.setIdProveedor(rs.getInt("id_proveedor"));
            p.setNombreEmpresa(rs.getString("nombre_empresa"));
            p.setNombreContacto(rs.getString("nombre_contacto"));
            p.setTelefono(rs.getString("telefono"));
            p.setDireccion(rs.getString("direccion"));
            p.setActivo(rs.getBoolean("activo"));
        }

        rs.close();
        cs.close();
        conn.close();

        return p;
    }
}
