package org.utl.dsm.SneakStyle.controller;

import org.utl.dsm.SneakStyle.db.ConexionMySQL;
import org.utl.dsm.SneakStyle.model.User;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

public class ControllerUsers {
    public User login(User usuario) throws Exception {
        String query = "{CALL sp_login_usuario(?, ?)}";
        
        try (Connection con = new ConexionMySQL().open();
             PreparedStatement pst = con.prepareStatement(query)) {
            
            pst.setString(1, usuario.getCorreo_usuario());
            pst.setString(2, usuario.getContra_usuario());
            
            try (ResultSet rs = pst.executeQuery()) {
                if (rs.next()) {
                    User userLogged = new User();
                    userLogged.setId_usuario(rs.getInt("id_usuario"));
                    userLogged.setNombre_usuario(rs.getString("nombre_usuario"));
                    userLogged.setCorreo_usuario(usuario.getCorreo_usuario());
                    userLogged.setRol_usuario(rs.getString("rol_usuario"));
                    return userLogged;
                } else {
                    return null;
                }
            }
        }
    }
}