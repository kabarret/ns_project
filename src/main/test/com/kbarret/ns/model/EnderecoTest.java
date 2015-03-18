package com.kbarret.ns.model;

import junit.framework.TestCase;
import org.junit.Assert;

public class EnderecoTest extends TestCase {

    public void testeCamposObrigatoriosNaoPreechidos(){

        try {
            new Endereco().validate();
        } catch (Exception e) {
            Assert.assertTrue(e.getMessage().equals("Os campos obrigatórios [RUA, NUMERO, CEP, CIDADE, ESTADO] não foram informados"));
        }

    }

    public void testeCamposObrigatoriosPreechidos() throws Exception {

            Endereco endereco = new Endereco();
            endereco.setRua("Av. Brasil");
            endereco.setNumero(1);
            endereco.setCep(new Cep("130001", "Sao Paulo"));
            endereco.setEstado("SP");
            endereco.setCidade("São Paulo");
            Assert.assertTrue(endereco.validate());
    }
}