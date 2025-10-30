package org.utl.dsm.SneakStyle.dsm;

import com.google.gson.Gson;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import java.util.List;
import org.utl.dsm.SneakStyle.controller.ControllerProductos;
import org.utl.dsm.SneakStyle.model.Producto;

@Path("productos")      //Ruta: /api/productos
public class RESTProductos {

    @GET
    @Path("getAll") // /api/productos/getAll
    @Produces(MediaType.APPLICATION_JSON)   //Response JSON
    public String getAll() {     //Devolvemos todos los productos en activo
        try {
            List<Producto> productos = new ControllerProductos().getAll();  //Pedimos la lista al controller
            return new Gson().toJson(productos);    //Convertimos la lista a JSON y la regresamos
        } catch (Exception e) {     //Si algo falla nos mostrara el error
            e.printStackTrace();    //Nos mostrara el error en la consola
            return "{\"error\":\"Error al obtener productos\"}";    //Respondemos con un mensaje de error
        }
    }

    @GET
    @Path("buscar/{id}")    // /api/empleados/buscar/
    @Produces(MediaType.APPLICATION_JSON)   //Response JSON
    public String buscarPorId(@PathParam("id") int id) {    // Recibe el id desde la URL
        try {
            Producto p = new ControllerProductos().getById(id); //Buscamos el producto en la bd
            return new Gson().toJson(p);    //Lo convertimos a JSON y responde
        } catch (Exception e) { //Si algo falla nos mostrara el error
            e.printStackTrace();    //Nos mostrara el error en la consola
            return "{\"error\":\"Error al buscar producto\"}";  //Respondemos con un mensaje de error
        }
    }

    @POST
    @Path("insertar")   // /api/productos/insertar
    @Consumes(MediaType.APPLICATION_JSON)   //Recibe el JSON
    @Produces(MediaType.APPLICATION_JSON)   //Responde el JSON
    public String insert(String json) {     //Con JSON traemos los datos del producto como texto
        try {
            Producto p = new Gson().fromJson(json, Producto.class); //Convierte el JSON a objeto producto
            new ControllerProductos().insert(p);    //Llamamos al controller para hacer el insert en la bd
            return "{\"result\":\"Producto insertado correctamente\"}"; //Si se inserto bien nos mostrara este mesaje
        } catch (Exception e) { //Si algo falla nos mostrara el error
            e.printStackTrace();    //Nos mostrara el error en la consola
            return "{\"error\":\"Error al insertar producto\"}";    //Respondemos con un mensaje de error
        }
    }

    @PUT
    @Path("modificar")  // /api/productos/modificar/
    @Consumes(MediaType.APPLICATION_JSON)   //Recibe el JSON
    @Produces(MediaType.APPLICATION_JSON)    //Responde el JSON
    public String update(String json) { //JSON trae el producto con su id y sus nuevos datos
        try {
            Producto p = new Gson().fromJson(json, Producto.class); //Convierte el JSON a objeto producto
            new ControllerProductos().update(p);    //Llamamos al controller para hacer el update en la bd
            return "{\"result\":\"Producto actualizado correctamente\"}";   //Si se modifico bien nos mostrara este mesaje
        } catch (Exception e) { //Si algo falla nos mostrara el error
            e.printStackTrace();    //Nos mostrara el error en la consola
            return "{\"error\":\"Error al modificar producto\"}";   //Respondemos con un mensaje de error
        }
    }

    @DELETE //Baja Logica
    @Path("eliminar/{id}")  // /api/empleados/eliminar
    @Produces(MediaType.APPLICATION_JSON)   //Responde el JSON
    public String eliminarLogico(@PathParam("id") int id) { //Tomamos el id de la URL
        try {
            new ControllerProductos().deleteLogical(id);    //Ponemos el estatus en 0 es decir inactivo en la bd
            return "{\"result\":\"Producto dado de baja\"}";    //Si se elimino bien nos mostrara este mesaje
        } catch (Exception e) { //Si algo falla nos mostrara el error
            e.printStackTrace();    //Nos mostrara el error en la consola
            return "{\"error\":\"No se pudo dar de baja el producto\"}";    //Respondemos con un mensaje de error
        }
    }

    @DELETE //Baja Fisica
    @Path("eliminarFisico/{id}")    // /api/empleados/eliminarFisico
    @Produces(MediaType.APPLICATION_JSON)   //Responde el JSON
    public String eliminarFisico(@PathParam("id") int id) { //Tomamos el id de la URL
        try {
            new ControllerProductos().deletePhysicalSafe(id);   //Borramos el producto y su inventario relacionado
            return "{\"result\":\"Producto eliminado físicamente\"}";   //Si se elimino bien nos mostrara este mesaje
        } catch (Exception e) { //Si algo falla nos mostrara el erro
            e.printStackTrace();    //Nos mostrara el error en la consola
            return "{\"error\":\"No se pudo eliminar físicamente el producto\"}";   //Respondemos con un mensaje de error
        }
    }
}
