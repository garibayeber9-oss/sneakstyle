// package: REST (Java)
// Archivo: RESTInventario.java
package org.utl.dsm.SneakStyle.dsm;

import com.google.gson.*;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import org.utl.dsm.SneakStyle.controller.ControllerInventario;
import org.utl.dsm.SneakStyle.model.Inventario;
import org.utl.dsm.SneakStyle.model.Producto;
import org.utl.dsm.SneakStyle.model.Proveedor;

@Path("inventario") // Ruta base: /api/inventario
public class RESTInventario {

    /* ----- Helper cortito: arma Inventario desde JSON aceptando 2 formatos -----
       Acepta:
       1) { "productoId": 1, "proveedorId": 2, "cantidad": 10, "idInventario": 5 }
       2) { "producto": { "idProducto": 1 }, "proveedor": { "idProveedor": 2 }, "cantidad": 10, "idInventario": 5 }
    ----------------------------------------------------------------------------- */
    private Inventario parseInventario(String json) {
        JsonObject o = JsonParser.parseString(json).getAsJsonObject();

        int idInventario = o.has("idInventario") && !o.get("idInventario").isJsonNull()
                ? o.get("idInventario").getAsInt() : 0;

        int productoId = 0;
        if (o.has("productoId") && !o.get("productoId").isJsonNull()) {
            productoId = o.get("productoId").getAsInt();
        } else if (o.has("producto") && o.get("producto").isJsonObject()) {
            JsonObject p = o.getAsJsonObject("producto");
            if (p.has("idProducto") && !p.get("idProducto").isJsonNull()) {
                productoId = p.get("idProducto").getAsInt();
            }
        }

        int proveedorId = 0;
        if (o.has("proveedorId") && !o.get("proveedorId").isJsonNull()) {
            proveedorId = o.get("proveedorId").getAsInt();
        } else if (o.has("proveedor") && o.get("proveedor").isJsonObject()) {
            JsonObject p = o.getAsJsonObject("proveedor");
            if (p.has("idProveedor") && !p.get("idProveedor").isJsonNull()) {
                proveedorId = p.get("idProveedor").getAsInt();
            }
        }

        int cantidad = o.has("cantidad") && !o.get("cantidad").isJsonNull()
                ? o.get("cantidad").getAsInt() : 0;

        Producto prod = new Producto();
        prod.setIdProducto(productoId);

        Proveedor prov = new Proveedor();
        prov.setIdProveedor(proveedorId);

        Inventario inv = new Inventario();
        inv.setIdInventario(idInventario);
        inv.setProducto(prod);
        inv.setProveedor(prov);
        inv.setCantidad(cantidad);
        return inv;
    }

    @GET
    @Path("getAll") // /api/inventario/getAll
    @Produces(MediaType.APPLICATION_JSON) // Responde JSON
    public String getAll() {
        try {
            return new Gson().toJson(new ControllerInventario().getAll()); // Lista -> JSON
        } catch (Exception e) {
            e.printStackTrace();
            return "{\"error\":\"Error al obtener inventario\"}";
        }
    }

    @GET
    @Path("buscar/{id}") // /api/inventario/buscar/ID
    @Produces(MediaType.APPLICATION_JSON)
    public String buscarPorId(@PathParam("id") int id) {
        try {
            return new Gson().toJson(new ControllerInventario().getById(id)); // Objeto -> JSON
        } catch (Exception e) {
            e.printStackTrace();
            return "{\"error\":\"Error al buscar inventario\"}";
        }
    }

    @POST
    @Path("insertar") // /api/inventario/insertar
    @Consumes(MediaType.APPLICATION_JSON) // Recibe JSON
    @Produces(MediaType.APPLICATION_JSON) // Responde JSON
    public String insertar(String body) {
        try {
            Inventario i = parseInventario(body); // Soporta productoId/proveedorId o objetos anidados
            if (i.getProducto().getIdProducto() <= 0 || i.getProveedor().getIdProveedor() <= 0) {
                return "{\"error\":\"productoId y proveedorId son obligatorios\"}";
            }
            new ControllerInventario().insert(i);
            return "{\"result\":\"Inventario agregado exitosamente\"}";
        } catch (Exception e) {
            e.printStackTrace();
            return "{\"error\":\"Error al insertar inventario\"}";
        }
    }

    @PUT
    @Path("modificar") // /api/inventario/modificar
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public String modificar(String body) {
        try {
            Inventario i = parseInventario(body);
            if (i.getIdInventario() <= 0) {
                return "{\"error\":\"idInventario es obligatorio\"}";
            }
            new ControllerInventario().update(i);
            return "{\"result\":\"Inventario modificado exitosamente\"}";
        } catch (Exception e) {
            e.printStackTrace();
            return "{\"error\":\"Error al modificar inventario\"}";
        }
    }

    @DELETE
    @Path("eliminarFisico/{id}") // /api/inventario/eliminarFisico/ID
    @Produces(MediaType.APPLICATION_JSON)
    public String eliminarFisico(@PathParam("id") int id) {
        try {
            new ControllerInventario().delete(id); // Borrado físico (alias)
            return "{\"result\":\"Inventario eliminado exitosamente\"}";
        } catch (Exception e) {
            e.printStackTrace();
            return "{\"error\":\"Error al eliminar inventario\"}";
        }
    }
}
