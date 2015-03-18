package com.kbarret.ns.controller;

import javax.ws.rs.Consumes;
import javax.ws.rs.Produces;

import static com.kbarret.ns.controller.BaseWebService.PRODUCES_JSON_STREAMING;
import static com.kbarret.ns.controller.BaseWebService.PRODUCES_XML_STREAMING;
import static javax.ws.rs.core.MediaType.*;

@Consumes({ PRODUCES_JSON_STREAMING, APPLICATION_JSON, PRODUCES_XML_STREAMING, PRODUCES_XML_STREAMING })
@Produces({ PRODUCES_JSON_STREAMING, APPLICATION_JSON, PRODUCES_XML_STREAMING, PRODUCES_XML_STREAMING })
public class BaseWebService {

    public static final String PRODUCES_XML_STREAMING = APPLICATION_OCTET_STREAM + ";charset=UTF-8";

    public static final String PRODUCES_JSON_STREAMING = APPLICATION_OCTET_STREAM + ";charset=UTF-8";

    public static final String PRODUCES_STRING_STREAMING = TEXT_PLAIN + ";charset=UTF-8";

}