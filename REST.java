package org.utl.dsm.SneakStyle.dsm;

import com.google.gson.Gson;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.utl.dsm.SneakStyle.controller.ControllerUsers;
import org.utl.dsm.SneakStyle.model.User;

@Path("login")
public class REST {

    @Path("auth")
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response auth(User usuario) {
        String out;
        ControllerUsers cu = new ControllerUsers();
        Gson gson = new Gson();

        try {
            System.out.println("🛂 Intentando login con usuario: " + usuario.getCorreo_usuario());

            User userLogged = cu.login(usuario);

            if (userLogged != null) {
                String redirectPage = userLogged.getRol_usuario().equals("admin") ? "admin.html" : "Principal.html";

                out = gson.toJson(new ResponseLogin(
                    true,
                    "Bienvenido " + userLogged.getNombre_usuario(),
                    userLogged,
                    redirectPage
                ));

                return Response.status(Response.Status.OK).entity(out).build();
            } else {
                out = gson.toJson(new ResponseLogin(false, "Credenciales incorrectas"));
                return Response.status(Response.Status.UNAUTHORIZED).entity(out).build();
            }

        } catch (Exception e) {
            e.printStackTrace(); // Para depuración en consola
            out = gson.toJson(new ResponseLogin(false, "Error en el servidor: " + e.getMessage()));
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(out).build();
        }
    }

    // Clase interna para armar la respuesta JSON
    class ResponseLogin {
        boolean success;
        String message;
        User user;
        String redirect;

        public ResponseLogin(boolean success, String message) {
            this.success = success;
            this.message = message;
        }

        public ResponseLogin(boolean success, String message, User user, String redirect) {
            this.success = success;
            this.message = message;
            this.user = user;
            this.redirect = redirect;
        }
    }
}
