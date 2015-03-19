package com.kbarret.ns.model;

import com.google.common.base.Joiner;
import org.apache.commons.lang.StringUtils;

import javax.xml.bind.annotation.XmlRootElement;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by krb on 3/18/15.
 */
@XmlRootElement(name = "Endereco")
public class Endereco {

    Integer id;
    Cep cep;
    String rua;
    Integer numero;
    String cidade;
    String estado;
    String bairro;
    String complemento;

    public Endereco(){ super();}

    public Endereco(Integer id, Cep cep, String rua, Integer numero, String cidade, String estado, String bairro, String complemento) {
        this.id = id;
        this.cep = cep;
        this.rua = rua;
        this.numero = numero;
        this.cidade = cidade;
        this.estado = estado;
        this.bairro = bairro;
        this.complemento = complemento;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Cep getCep() {
        return cep;
    }

    public void setCep(Cep cep) {
        this.cep = cep;
    }

    public String getRua() {
        return rua;
    }

    public void setRua(String rua) {
        this.rua = rua;
    }

    public Integer getNumero() {
        return numero;
    }

    public void setNumero(Integer numero) {
        this.numero = numero;
    }

    public String getCidade() {
        return cidade;
    }

    public void setCidade(String cidade) {
        this.cidade = cidade;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public String getBairro() {
        return bairro;
    }

    public void setBairro(String bairro) {
        this.bairro = bairro;
    }

    public String getComplemento() {
        return complemento;
    }

    public void setComplemento(String complemento) {
        this.complemento = complemento;
    }

    public Boolean validate() throws Exception {
        List<String> camposObrigatorios = new ArrayList<>();
        if (this.rua == null) camposObrigatorios.add("RUA");
        if (this.numero == null) camposObrigatorios.add("NUMERO");
        if (this.cep == null) camposObrigatorios.add("CEP");
        if (this.cidade == null) camposObrigatorios.add("CIDADE");
        if (this.estado == null) camposObrigatorios.add("ESTADO");

        if(!camposObrigatorios.isEmpty()){
            throw new Exception("Os campos obrigatórios [" + StringUtils.join(camposObrigatorios,", ") + "] não foram informados");
        }

        return true;
    }

}
