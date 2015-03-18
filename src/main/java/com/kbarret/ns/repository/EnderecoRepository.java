package com.kbarret.ns.repository;

import com.kbarret.ns.model.Endereco;

import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by krb on 3/18/15.
 */
public class EnderecoRepository {

    private  static Map<Integer, Endereco> enderecos = new HashMap<>();

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
