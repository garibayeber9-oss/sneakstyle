package org.utl.dsm.SneakStyle.model;

public class User {
    private int id_usuario;
    private String nombre_usuario;
    private String contra_usuario;
    private String correo_usuario;
    private String rol_usuario;

    public User() {}

    public User(int id_usuario, String nombre_usuario, String contra_usuario, String correo_usuario, String rol_usuario) {
        this.id_usuario = id_usuario;
        this.nombre_usuario = nombre_usuario;
        this.contra_usuario = contra_usuario;
        this.correo_usuario = correo_usuario;
        this.rol_usuario = rol_usuario;
    }

    // Getters y setters
    public int getId_usuario() {
        return id_usuario;
    }

    public void setId_usuario(int id_usuario) {
        this.id_usuario = id_usuario;
    }

    public String getNombre_usuario() {
        return nombre_usuario;
    }

    public void setNombre_usuario(String nombre_usuario) {
        this.nombre_usuario = nombre_usuario;
    }

    public String getContra_usuario() {
        return contra_usuario;
    }

    public void setContra_usuario(String contra_usuario) {
        this.contra_usuario = contra_usuario;
    }

    public String getCorreo_usuario() {
        return correo_usuario;
    }

    public void setCorreo_usuario(String correo_usuario) {
        this.correo_usuario = correo_usuario;
    }

    public String getRol_usuario() {
        return rol_usuario;
    }

    public void setRol_usuario(String rol_usuario) {
        this.rol_usuario = rol_usuario;
    }

    @Override
    public String toString() {
        return "{" +
                "\"id_usuario\":" + id_usuario +
                ", \"nombre_usuario\":\"" + nombre_usuario + "\"" +
                ", \"correo_usuario\":\"" + correo_usuario + "\"" +
                ", \"rol_usuario\":\"" + rol_usuario + "\"" +
                "}";
    }
}