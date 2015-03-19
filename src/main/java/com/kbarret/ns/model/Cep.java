package com.kbarret.ns.model;

import javax.xml.bind.annotation.XmlRootElement;

/**
 * Created by krb on 3/18/15.
 */
@XmlRootElement(name = "Cep")
public class Cep {

    private String numero;
    private String descricao;

    public Cep() {
        super();
    }

    public Cep(String logradouro, String numero) {
        this.descricao = logradouro;
        this.numero = numero;
    }

    public String getNumero() {
        return numero;
    }

    public void setNumero(String numero) {
        this.numero = numero;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }
}
