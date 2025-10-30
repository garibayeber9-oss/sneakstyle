package org.utl.dsm.SneakStyle.dsm;

import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;
import org.utl.dsm.SneakStyle.controller.ControllerProveedor;
import org.utl.dsm.SneakStyle.model.Proveedor;

@Path("proveedores") // Ruta base: /api/proveedores
public class RESTProveedores {

    @POST
    @Path("insertar")                       // Endpoint: /api/proveedores/insertar
    @Consumes(MediaType.APPLICATION_JSON)   // Recibe JSON en el cuerpo
    @Produces(MediaType.APPLICATION_JSON)   // Responde JSON
    public Response insertar(Proveedor p) { // Inserta un proveedor (datos vienen ya mapeados a Proveedor)
        ControllerProveedor cp = new ControllerProveedor(); // Usamos el controller para hablar con la BD
        try {
            cp.insertar(p); // Llama al método de inserción en la BD
            // 200 OK con un JSON de éxito
            return Response.ok("{\"result\":\"Proveedor agregado exitosamente\"}").build();
        } catch (Exception e) { // Si algo falla, capturamos y respondemos 500
            e.printStackTrace(); // Log en consola para depurar
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                           .entity("{\"error\":\"" + e.getMessage() + "\"}") // Enviamos el error como JSON
                           .build();
        }
    }

    @PUT
    @Path("modificar")                       // Endpoint: /api/proveedores/modificar
    @Consumes(MediaType.APPLICATION_JSON)    // Recibe JSON
    @Produces(MediaType.APPLICATION_JSON)    // Responde JSON
    public Response modificar(Proveedor p) { // Actualiza un proveedor (debe venir con su id)
        ControllerProveedor cp = new ControllerProveedor(); // Controller ↔ BD
        try {
            cp.actualizar(p); // Actualiza el registro en la BD
            return Response.ok("{\"result\":\"Proveedor modificado\"}").build(); // 200 OK
        } catch (Exception e) { // Error → 500
            e.printStackTrace();
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                           .entity("{\"error\":\"" + e.getMessage() + "\"}")
                           .build();
        }
    }

    @DELETE
    @Path("eliminarFisico/{id}")           // Endpoint: /api/proveedores/eliminarFisico/{id}
    @Produces(MediaType.APPLICATION_JSON)  // Responde JSON
    public Response eliminar(@PathParam("id") int id) { // Elimina físicamente por ID (desde la URL)
        ControllerProveedor cp = new ControllerProveedor(); // Controller
        try {
            cp.eliminar(id); // Borra en la BD
            return Response.ok("{\"result\":\"Proveedor eliminado\"}").build(); // 200 OK
        } catch (Exception e) { // Error → 500
            e.printStackTrace();
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                           .entity("{\"error\":\"" + e.getMessage() + "\"}")
                           .build();
        }
    }

    @GET
    @Path("getAll")                        // Endpoint: /api/proveedores/getAll
    @Produces(MediaType.APPLICATION_JSON)  // Responde JSON
    public Response getAll() {             // Devuelve lista completa de proveedores
        ControllerProveedor cp = new ControllerProveedor(); // Controller
        try {
            List<Proveedor> lista = cp.getAll(); // Pide la lista a la BD
            return Response.ok(lista).build();   // 200 OK devolviendo el arreglo como JSON
        } catch (Exception e) { // Error → 500
            e.printStackTrace();
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                           .entity("{\"error\":\"" + e.getMessage() + "\"}")
                           .build();
        }
    }

    @GET
    @Path("buscar/{id}")                   // Endpoint: /api/proveedores/buscar/{id}
    @Produces(MediaType.APPLICATION_JSON)  // Responde JSON
    public Response buscarPorId(@PathParam("id") int id) { // Busca un proveedor por ID (en la URL)
        ControllerProveedor cp = new ControllerProveedor(); // Controller
        try {
            Proveedor p = cp.getById(id); // Consulta en la BD
            return Response.ok(p).build(); // 200 OK con el objeto (o null si no existe)
        } catch (Exception e) { // Error → 500
            e.printStackTrace();
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                           .entity("{\"error\":\"" + e.getMessage() + "\"}")
                           .build();
        }
    }
}
