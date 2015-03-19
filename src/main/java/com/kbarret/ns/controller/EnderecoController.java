package com.kbarret.ns.controller;

/**
 * Created by krb on 3/18/15.
 */

import com.kbarret.ns.model.Endereco;
import com.kbarret.ns.repository.EnderecoRepository;
import com.kbarret.ns.service.EnderecoService;
import com.wordnik.swagger.annotations.Api;
import com.wordnik.swagger.annotations.ApiOperation;
import com.wordnik.swagger.annotations.ApiParam;
import org.springframework.stereotype.Controller;

import javax.ws.rs.*;
import javax.ws.rs.core.Response;

import static javax.ws.rs.core.Response.Status.BAD_REQUEST;
import static javax.ws.rs.core.Response.Status.OK;

@Controller
@Path("/endereco")
@Api(value = "/endereco", description = "Endereços")
public class EnderecoController {

    private EnderecoService enderecoService = new EnderecoService();

    @GET
    @Path("/")
    @ApiOperation(
            value = "Lista endereços",
            responseClass = "com.kbarret.ns.model.Endereco")
    public Response listaEnderecos(){
        return Response.status(OK).entity(enderecoService.listaEnderecoes()).build();
    }

    @GET
    @Path("/{idEndereco}")
    @ApiOperation(
            value = "Busca endereço",
            responseClass = "com.kbarret.ns.model.Endereco")
    public Response buscaEndereco(@ApiParam(defaultValue = "1", value = "id do endereço", required = true) @PathParam("idEndereco") Integer idEndereco){
        try {
            return Response.status(OK).entity(enderecoService.buscaEndereco(idEndereco)).build();
        } catch (Exception e) {
            return Response.status(BAD_REQUEST).entity(e.getMessage()).build();
        }
    }

    @POST
    @Path("/")
    @ApiOperation(
            value = "Criar novo endereço",
            responseClass = "java.lang.String")
    public Response salvaEndereco(@ApiParam(defaultValue = "{ " +
            "    \"cep\": {\n" +
            "      \"numero\": \"\" \n" +
            "    },\n" +
            "    \"rua\": \"\",\n" +
            "    \"numero\": ,\n" +
            "    \"cidade\": \"\",\n" +
            "    \"estado\": \"\",\n" +
            "    \"bairro\": \"\",\n" +
            "    \"complemento\": \"\"}" ,
            value = "Endereço", required = true, name = "endereco") Endereco endereco){
        try {
            return Response.status(OK).entity("Endereço cadastrado com o id : " + enderecoService.novoEndereco(endereco).getId()).build();
        } catch (Exception e) {
            return Response.status(BAD_REQUEST).entity(e.getMessage()).build();
        }
    }

    @PUT
    @Path("/")
    @ApiOperation(
            value = "Alerar endereço",
            responseClass = "java.lang.String")
    public Response atualizaEndereco(@ApiParam(defaultValue = "{ " +
            "    \"id\": ,\n" +
            "    \"cep\": {\n" +
            "      \"numero\": \"\" \n" +
            "    },\n" +
            "    \"rua\": \"\",\n" +
            "    \"numero\": ,\n" +
            "    \"cidade\": \"\",\n" +
            "    \"estado\": \"\",\n" +
            "    \"bairro\": \"\",\n" +
            "    \"complemento\": \"\"}" ,
            value = "Endereço", required = true, name = "endereco") Endereco endereco){
        try {
            enderecoService.atualizarEndereco(endereco);
            return Response.status(OK).entity("Endereço atualizado").build();
        } catch (Exception e) {
            return Response.status(BAD_REQUEST).entity(e.getMessage()).build();
        }
    }

    @DELETE
    @Path("/{idEndereco}")
    @ApiOperation(
            value = "Exclui endereço",
            responseClass = "java.lang.String")
    public Response removeEndereco(@ApiParam(defaultValue = "1", value = "id do endereço", required = true) @PathParam("idEndereco") Integer idEndereco){
        try {
            enderecoService.removeEndereco(idEndereco);
            return Response.status(OK).entity("Endereço excluido").build();
        } catch (Exception e) {
            return Response.status(BAD_REQUEST).entity(e.getMessage()).build();
        }
    }

}
