package com.kbarret.ns.controller;

import com.kbarret.ns.model.Cep;
import com.kbarret.ns.service.CepService;
import com.wordnik.swagger.annotations.Api;
import com.wordnik.swagger.annotations.ApiOperation;
import com.wordnik.swagger.annotations.ApiParam;
import org.springframework.stereotype.Controller;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.core.Response;

import static javax.ws.rs.core.Response.Status.BAD_REQUEST;
import static javax.ws.rs.core.Response.Status.NO_CONTENT;
import static javax.ws.rs.core.Response.Status.OK;

/**
 * Created by krb on 3/18/15.
 */
@Controller
@Path("/cep")
@Api(value = "/cep", description = "Serviço busca de cep")
public class CepController extends BaseWebService {

    public CepController(){
        super();
    }

    private CepService cepService = new CepService();

    @GET
    @Path("/{cep}")
    @ApiOperation(
            value = "Busca cep informado",
            notes = "Caso o cep não for encontrada retorna o CEP aproximado",
            responseClass = "java.lang.String")
    public Response buscaCep(@ApiParam(defaultValue = "01000000", value = "cep para consulta", required = true)  @PathParam("cep") String cep) {
        try {
            Cep cepRetornado = cepService.buscaCep(cep);
            if(cepRetornado != null){
                return Response.status(OK).entity(cepRetornado).build();
            }else{
                return Response.status(NO_CONTENT).build();
            }
        } catch (Exception e) {
            return Response.status(BAD_REQUEST).entity(e.getMessage()).build();
        }
    }

}
