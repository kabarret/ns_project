package com.kbarret.ns.model;

import javax.xml.bind.annotation.XmlRootElement;

/**
 * Created by krb on 3/18/15.
 */
@XmlRootElement(name = "Cep")
public class Cep {

    private String numero;
    private String logradouro;

    public Cep(String logradouro, String numero) {
        this.logradouro = logradouro;
        this.numero = numero;
    }

    public String getNumero() {
        return numero;
    }

    public void setNumero(String numero) {
        this.numero = numero;
    }

    public String getLogradouro() {
        return logradouro;
    }

    public void setLogradouro(String logradouro) {
        this.logradouro = logradouro;
    }
}
