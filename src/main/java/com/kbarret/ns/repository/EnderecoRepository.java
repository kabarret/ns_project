package com.kbarret.ns.repository;

import com.kbarret.ns.model.Endereco;

import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by krb on 3/18/15.
 */
public class EnderecoRepository {

    private  static Map<Integer, Endereco> enderecos = new HashMap<>();

    static {
        enderecos.put(1,new Endereco(1,CepRepository.ceps.get("13000000"), "Note sul" , 233, "Campinas" , "SP", "Taquaral", null));
        enderecos.put(2,new Endereco(2,CepRepository.ceps.get("01000000"), "Rua verguei" , 120, "São Paulo" , "SP", "Liberdade", null));
        enderecos.put(3,new Endereco(3,CepRepository.ceps.get("20000000"), "Av Atlantica" , 555, "Rio de Janeiro" , "RJ", "Copacabana", null));
        enderecos.put(4,new Endereco(4,CepRepository.ceps.get("40000000"), "Av Oceanica" , 233, "Salvado" , "BA", "Centro", null));
    }


    public Collection<Endereco> list() {
        return enderecos.values();
    }

    public Endereco findById(Integer id) {
        return enderecos.get(id);
    }

    public Endereco save(Endereco endereco){
        endereco.setId(enderecos.size()+1);
        enderecos.put(endereco.getId(),endereco);
        return endereco;
    }

    public void update(Endereco endereco) {
        remove(endereco.getId());
        enderecos.put(endereco.getId(), endereco);
    }

    public void remove(Integer id){
        enderecos.remove(id);
    }
}
