package org.utl.dsm.SneakStyle.controller;

import org.utl.dsm.SneakStyle.db.ConexionMySQL;
import org.utl.dsm.SneakStyle.model.Empleado;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class ControllerEmpleado {

    public void insertarEmpleado(Empleado e) throws Exception {
        // sp_empleado_add con foto y OUT id (9 params)
        String sql = "{CALL sp_empleado_add(?, ?, ?, ?, ?, ?, ?, ?, ?)}";
        ConexionMySQL conn = new ConexionMySQL();
        Connection con = conn.open();
        CallableStatement cs = con.prepareCall(sql);

        // nombreCompleto -> partes
        String[] partes = (e.getNombreCompleto() == null ? "" : e.getNombreCompleto()).trim().split("\\s+");
        String nombre = partes.length > 0 ? partes[0] : "";
        String apellidoPaterno = partes.length > 1 ? partes[1] : "";
        String apellidoMaterno = partes.length > 2 ? partes[2] : "";

        // generar nombreUsuario si no llega
        String nombreUsuario = (e.getNombreUsuario() == null || e.getNombreUsuario().trim().isEmpty())
                ? (nombre.toLowerCase()
                   + (apellidoPaterno.isEmpty() ? "" : Character.toLowerCase(apellidoPaterno.charAt(0)))
                   + (apellidoMaterno.isEmpty() ? "" : Character.toLowerCase(apellidoMaterno.charAt(0))))
                : e.getNombreUsuario();

        String telefono = e.getTelefono();
        String direccion = "Dirección generada";
        String contrasena = "contrasena123"; // si quieres usar la que te llega, añade ese campo en el modelo

        cs.setString(1, nombre);
        cs.setString(2, apellidoPaterno);
        cs.setString(3, apellidoMaterno);
        cs.setString(4, telefono);
        cs.setString(5, direccion);
        cs.setString(6, nombreUsuario);
        cs.setString(7, contrasena);
        cs.setString(8, e.getFotoBase64()); // FOTO
        cs.registerOutParameter(9, Types.INTEGER);

        cs.execute();

        int idGenerado = cs.getInt(9);
        e.setIdEmpleado(idGenerado);

        cs.close();
        con.close();
    }

    public void actualizarEmpleado(Empleado e) throws Exception {
        // sp_empleado_update con foto (7 params)
        String sql = "{CALL sp_empleado_update(?, ?, ?, ?, ?, ?, ?)}";
        ConexionMySQL conn = new ConexionMySQL();
        Connection con = conn.open();
        CallableStatement cs = con.prepareCall(sql);

        String[] partes = (e.getNombreCompleto() == null ? "" : e.getNombreCompleto()).trim().split("\\s+");
        String nombre = partes.length > 0 ? partes[0] : "";
        String apellidoPaterno = partes.length > 1 ? partes[1] : "";
        String apellidoMaterno = partes.length > 2 ? partes[2] : "";

        cs.setInt(1, e.getIdEmpleado());
        cs.setString(2, nombre);
        cs.setString(3, apellidoPaterno);
        cs.setString(4, apellidoMaterno);
        cs.setString(5, e.getTelefono());
        cs.setString(6, "Dirección actualizada");
        cs.setString(7, e.getFotoBase64()); // FOTO

        cs.execute();
        cs.close();
        con.close();
    }

    public void eliminarEmpleado(int id) throws Exception {
        String sql = "{CALL sp_empleado_delete(?)}";
        ConexionMySQL conn = new ConexionMySQL();
        Connection con = conn.open();
        CallableStatement cs = con.prepareCall(sql);

        cs.setInt(1, id);
        cs.execute();

        cs.close();
        con.close();
    }

    public Empleado buscarEmpleadoPorId(int id) throws Exception {
        Empleado emp = null;
        String sql = "{CALL sp_empleado_getById(?)}";
        ConexionMySQL conn = new ConexionMySQL();
        Connection con = conn.open();
        CallableStatement cs = con.prepareCall(sql);

        cs.setInt(1, id);
        ResultSet rs = cs.executeQuery();

        if (rs.next()) {
            emp = new Empleado();
            emp.setIdEmpleado(rs.getInt("id_empleado"));
            emp.setNombreCompleto(rs.getString("nombre_completo"));
            emp.setTelefono(rs.getString("telefono"));
            emp.setCorreoEmpleado(rs.getString("correo_empleado"));
            emp.setNombreUsuario(rs.getString("nombre_usuario"));
            emp.setCorreoUsuario(rs.getString("correo_usuario"));
            emp.setFotoBase64(rs.getString("foto_base64")); // FOTO
        }

        rs.close();
        cs.close();
        con.close();
        return emp;
    }

    public List<Empleado> obtenerTodos() throws Exception {
        List<Empleado> lista = new ArrayList<>();
        String sql = "{CALL sp_empleado_getAll()}";
        ConexionMySQL conn = new ConexionMySQL();
        Connection con = conn.open();
        CallableStatement cs = con.prepareCall(sql);
        ResultSet rs = cs.executeQuery();

        while (rs.next()) {
            Empleado emp = new Empleado();
            emp.setIdEmpleado(rs.getInt("id_empleado"));
            emp.setNombreCompleto(rs.getString("nombre_completo"));
            emp.setTelefono(rs.getString("telefono"));
            emp.setCorreoEmpleado(rs.getString("correo_empleado"));
            emp.setNombreUsuario(rs.getString("nombre_usuario"));
            emp.setCorreoUsuario(rs.getString("correo_usuario"));
            emp.setFotoBase64(rs.getString("foto_base64")); // FOTO
            lista.add(emp);
        }

        rs.close();
        cs.close();
        con.close();

        return lista;
    }
}
