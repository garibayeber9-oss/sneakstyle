package org.utl.dsm.SneakStyle.db;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class ConexionMySQL {
    // Datos de conexión
    private static final String URL = "jdbc:mysql://localhost:3306/SneakStyle?useSSL=false&useUnicode=true&characterEncoding=UTF-8";
    private static final String USER = "root";
    private static final String PASSWORD = "root";

    // Método para abrir la conexión
    public Connection open() throws SQLException, ClassNotFoundException {
        // Cargar el driver de MySQL
        Class.forName("com.mysql.cj.jdbc.Driver");

        // Retorna la conexión
        return DriverManager.getConnection(URL, USER, PASSWORD);
    }

    public void close() {
        throw new UnsupportedOperationException("Not supported yet."); // Generated from nbfs://nbhost/SystemFileSystem/Templates/Classes/Code/GeneratedMethodBody
    }
}