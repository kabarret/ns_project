package com.kbarret.ns.service;

import com.kbarret.ns.model.Cep;
import com.kbarret.ns.repository.CepRepository;

import java.util.ArrayList;

/**
 * Created by krb on 3/18/15.
 */
public class CepService {

    public static void main(String args[]){
        char[] chars = "aAbBABac".toCharArray();
        ArrayList<Character> caracteresQueNaoSeReptem = new ArrayList<>();
        ArrayList<Character> caracteresRepetidos = new ArrayList<>();

        for (char c: chars ){
            if(caracteresQueNaoSeReptem.indexOf(c) == -1){
                // se nao foi registrado como caracter repeito adiciona como nao repetido
                if(caracteresRepetidos.indexOf(c) == -1){
                    caracteresQueNaoSeReptem.add(c);
                }
            }else{
                // se aparecer mais de uma ocorrencia do caractere remove da lista de caracteres nao repetidos
                caracteresQueNaoSeReptem.remove(caracteresQueNaoSeReptem.indexOf(c));
                // registra como caractere repetido
                caracteresRepetidos.add(c);
            }
        }

        System.out.print(caracteresQueNaoSeReptem.get(0));

    }

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
