package com.kbarret.ns.service;

import com.kbarret.ns.model.Cep;
import com.kbarret.ns.repository.CepRepository;

/**
 * Created by krb on 3/18/15.
 */
public class CepService {

    private CepRepository cepRepository = new CepRepository();

    public Cep buscaCep(String cep) throws Exception {
        if(cep.length() != 8) throw new Exception("Cep invalido");
        if(cep.equals("00000000")) return null;

        Cep cepRetornado = cepRepository.get(cep);
        return (cepRetornado != null) ? cepRetornado : buscaCep(replaceLastCharToZero(cep));
    }

    public String replaceLastCharToZero(String cep){
        char[] chars = cep.toCharArray();
        for(int i = cep.length() -1 ; i>=0; i--){
            if(chars[i] != '0'){
                chars[i] = '0';
                break;
            }
        }
        return String.valueOf(chars);
    }
}
