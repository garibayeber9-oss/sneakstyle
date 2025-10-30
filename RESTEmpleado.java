package org.utl.dsm.SneakStyle.dsm;

import com.google.gson.Gson;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import java.util.List;
import org.utl.dsm.SneakStyle.controller.ControllerEmpleado;
import org.utl.dsm.SneakStyle.model.Empleado;

@Path("empleados")      //Ruta: /api/empleados
public class RESTEmpleado {

    @GET
    @Path("getAll")     // /api/empleados/getAll
    @Produces(MediaType.APPLICATION_JSON)   //Response JSON
    public String getAll() {    //Metodo HTTP GET
        String out = "";
        try {
            ControllerEmpleado ce = new ControllerEmpleado();   //Usamos el controller
            List<Empleado> empleados = ce.obtenerTodos();   //Pedimos la lista a la bd
            Gson gson = new Gson();     //Creamos el Gson
            out = gson.toJson(empleados);   //Convertimos la lista en json 
        } catch (Exception e) {
            e.printStackTrace();
            out = "{\"error\":\"Error al obtener empleados\"}"; //Si falla mandamos un mensaje de error
        }
        return out;     //Devolvemos en json si todo esta bien
    }

    @POST
    @Path("insertar")   // /api/empleados/insertar
    @Consumes(MediaType.APPLICATION_JSON)   //Recibe el JSON
    @Produces(MediaType.APPLICATION_JSON)   //Responde el JSON
    public String insert(String json) { 
        String out = "";
        try {
            Gson gson = new Gson();     //Creamos un objeto Gson para convertir a Json que es igual a un objeto en java 
            Empleado e = gson.fromJson(json, Empleado.class);   //Tomamos el string json y lo convertimos a un obj empleado 
            ControllerEmpleado ce = new ControllerEmpleado();   //Creamos el controller que es quien habla con la bd 
            ce.insertarEmpleado(e);     //El controller insertara al empleado en la bd 
            out = "{\"result\":\"Empleado insertado correctamente\"}";  //Si se inserto bien nos mostrara este mesaje 
        } catch (Exception ex) {    //Si algo falla nos mostrara el error 
            ex.printStackTrace();   //Nos mostrara el error en la consola
            out = "{\"error\":\"Error al insertar empleado\"}";     //Respondemos con un mensaje de error
        }
        return out;     //Devolvemos el mensaje dependiendo de la situacion(exito o error)
    }

    @POST
    @Path("modificar")  // /api/empleado/modificar/
    @Consumes(MediaType.APPLICATION_JSON)   //Recibe el JSON
    @Produces(MediaType.APPLICATION_JSON)   //Responde el JSON
    public String update(String json) {     //Recibe el JSON como string 
        String out = "";    //Se guarda la respuesta que devolvemos
        try {
            Gson gson = new Gson();     //Creamos un objeto Gson para convertir a JSON que es igual a un objeto en java
            Empleado e = gson.fromJson(json, Empleado.class);   //Tomamos el string JSON y lo convertimos a un obj empleado 
            ControllerEmpleado ce = new ControllerEmpleado();   //Creamos el controller que es quien habla con la bd
            ce.actualizarEmpleado(e);   //El controller actualizara al empleado en la bd 
            out = "{\"result\":\"Empleado actualizado correctamente\"}";    //Si se modifico bien nos mostrara este mesaje
        } catch (Exception ex) {    //Si algo falla nos mostrara el error 
            ex.printStackTrace();   //Nos mostrara el error en la consola
            out = "{\"error\":\"Error al modificar empleado\"}";    //Respondemos con un mensaje de error
        }
        return out;     
    }

    @POST
    @Path("eliminar")   // /api/empleados/eliminar
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)    // Espera datos tipo form (x-www-form-urlencoded)
    @Produces(MediaType.APPLICATION_JSON)   //Responde el JSON
    public String eliminarPorForm(@FormParam("idEmpleado") int idEmpleado) {    // Toma el campo 'idEmpleado' del form
        try {
            new ControllerEmpleado().eliminarEmpleado(idEmpleado);  //El controller eliminara al empleado en la bd por id
            return "{\"result\":\"Empleado eliminado correctamente\"}";     //Si se elimino bien nos mostrara este mesaje
        } catch (Exception ex) {    //Si algo falla nos mostrara el error 
            ex.printStackTrace();   //Nos mostrara el error en la consola
            return "{\"error\":\"Error al eliminar empleado\"}";    //Respondemos con un mensaje de error
        }
    }

    @GET
    @Path("buscar/{id}")    // /api/empleados/buscar/
    @Produces(MediaType.APPLICATION_JSON)   //Recibe el JSON
    public String buscarPorId(@PathParam("id") int id) {    // Recibe el id desde la URL
        String out = "";    //Se guarda la respuesta que devolvemos
        try {
            ControllerEmpleado ce = new ControllerEmpleado();   //El controller se instanciara
            Empleado e = ce.buscarEmpleadoPorId(id);    //Buscara al empleado en la bd por id
            Gson gson = new Gson();     //Creamos un objeto Gson para convertir a JSON que es igual a un objeto en java
            out = gson.toJson(e);   //Se convertira el empleado O null a JSON y lo guardaremos en out 
        } catch (Exception ex) {    //Si algo falla nos mostrara el error
            ex.printStackTrace();   //Nos mostrara el error en la consola
            out = "{\"error\":\"Error al buscar empleado\"}";   //Respondemos con un mensaje de error
        }
        return out;     //Devolvemos el mensaje dependiendo de la situacion(el empleado buscado o error)
    }
}
