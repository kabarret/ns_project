package com.kbarret.ns.service;

import com.kbarret.ns.model.Endereco;
import com.kbarret.ns.repository.EnderecoRepository;

import java.util.Collection;
import java.util.List;

/**
 * Created by krb on 3/18/15.
 */
public class EnderecoService {

    EnderecoRepository enderecoRepository = new EnderecoRepository();
    CepService cepService = new CepService();

    public Endereco novoEndereco(Endereco endereco) throws Exception {
        endereco.setCep(cepService.buscaCep(endereco.getCep().getNumero()));
        endereco.validate();
        return enderecoRepository.save(endereco);
    }

    public void atualizarEndereco(Endereco endereco) throws Exception {
        buscaEndereco(endereco.getId());
        endereco.setCep(cepService.buscaCep(endereco.getCep().getNumero()));
        endereco.validate();
        enderecoRepository.update(endereco);
    }

    public Endereco buscaEndereco(Integer id) throws Exception {
        Endereco endereco = enderecoRepository.findById(id);
        if (endereco == null){
            throw new Exception("Endereço não encontrado");
        }
        return endereco;

    }

    public Collection<Endereco> listaEnderecoes(){
        return enderecoRepository.list();
    }

    public void removeEndereco(Integer idEndereco) throws Exception {
        buscaEndereco(idEndereco);
        enderecoRepository.remove(idEndereco);
    }

}
