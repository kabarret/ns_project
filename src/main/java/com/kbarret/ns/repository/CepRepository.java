package com.kbarret.ns.repository;

import com.kbarret.ns.model.Cep;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by krb on 3/18/15.
 */
public class CepRepository {

    private static Map<String, Cep> ceps;

    static{
        ceps = new HashMap();
        ceps.put("01000000",new Cep("SP Capital", "01000000"));
        ceps.put("06000000",new Cep("SP Área Metropolitana", "06000000"));
        ceps.put("11000000", new Cep("SP Litoral",	"11000000"));
        ceps.put("13000000",new Cep("SP Interior",	"13000000"));
        ceps.put("20000000",new Cep("Rio de Janeiro (RJ)",	"20000000"));
        ceps.put("29000000",new Cep("Espirito Santo (ES) Vitória",	"29000000"));
        ceps.put("30000000",new Cep("Minas Gerais (MG)	Belo Horizonte", "30000000"));
        ceps.put("40000000",new Cep("Bahia (BA)	Salvador",	"40000000"));
        ceps.put("49000000",new Cep("Sergipe (SE) Aracaju",	"49000000"));
        ceps.put("50000000",new Cep("Pernambuco (PE) Recife",	"50000000"));
        ceps.put("57000000",new Cep("Alagoas (AL) Maceió",	"57000000"));
        ceps.put("58000000",new Cep("Paraiba (PB)	João Pessoa", "58000000"));
        ceps.put("59000000",new Cep("Rio Grande do Norte (RN)	Natal",	"59000000"));
        ceps.put("60000000",new Cep("Ceará	Fortaleza",	"60000000"));
        ceps.put("64000000",new Cep("Piauí (PI)	Teresina",	"64000000"));
        ceps.put("65000000",new Cep("Maranhão (MA)	São Luiz",	"65000000"));
        ceps.put("66000000",new Cep("Pará (PA)	Belém",	"66000000"));
        ceps.put("68900000",new Cep("Amapá (AP)	Macapá", "68900000"));
        ceps.put("70000000",new Cep("Distrito Federal (DF)	Brasília",	"70000000"));
        ceps.put("72800000",new Cep("Goiás(GO)	Goiânia",	"72800000"));
    }

    public Cep get(String cep){
        return ceps.get(cep);
    }

}
