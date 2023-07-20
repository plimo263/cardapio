/**
 * Este Hook é usado para criar um interface simples de atualização de dados
 * fazendo solicitações axios para atualizar os dados.
 */
import { useState, useCallback } from "react";
import axios from "axios";
/**
 * usuario envia dados, metodo e url
 *
 * Ele recebe um objeto com os seguintes valores
 * { error, wait, setFetch, data }
 *
 * - error: str (Uma string com a mensagem de erro, se não haver erro retorna null)
 * - wait: bool (Um boleano com os estados do aguardo)
 * - setFetch: function ( Uma funcao para redefinir os dados que serao usado para a consulta )
 * - data: obj | null (Um objeto com a resposta referente aos novos dados atualizados )
 */
const useFetch = (url, metodo = "POST") => {
  const [wait, setWait] = useState(null);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  // Funcao setFetch usada para fazer uma solicitacao dos dados
  const setFetch = useCallback(
    (dados) => {
      setError(null);
      // Faz a consulta
      let fn;
      let copiaURL = url;

      const formData = new FormData();
      switch (metodo) {
        case "POST":
          fn = axios.post;
          formData.append("dados", JSON.stringify(dados));
          break;
        case "PUT":
          fn = axios.put;
          formData.append("dados", JSON.stringify(dados));
          break;
        case "GET":
          fn = axios.get;
          if (dados && Object.keys(dados).length > 0) {
            const urlParams = new URLSearchParams();
            Object.keys(dados).forEach((k) => {
              urlParams.append(k, dados[k]);
            });

            copiaURL = `${url}?${urlParams.toString()}`;
          }
          break;
        case "DELETE":
          fn = axios.delete;
          formData.append("dados", JSON.stringify(dados));
          break;
        default: // Patch
          fn = axios.patch;
          formData.append("dados", JSON.stringify(dados));
          break;
      }
      // Coloca em espera
      setWait(true);
      // Passa para o envio
      const params =
        metodo === "DELETE"
          ? { data: formData }
          : metodo === "GET"
          ? null
          : formData;

      fn(copiaURL, params)
        .then((resp) => {
          if (resp.status !== 200) {
            setError(
              "ERRO INTERNO DO SERVIDOR, SE PERSISTIR INFORMAR AO ADMIN"
            );
            return false;
          }
          // Veja se tem mensagem de erro
          if (resp.data.erro) {
            setError(resp.data.erro);
            setData(null);
            return false;
          }
          // Tudo certo atualiza os dados e limpa o erro
          setError(null);
          setData(resp.data);
        })
        .catch((err) => {
          console.log(err);
          setError(err);
          return false;
        })
        .finally(() => {
          setWait(false);
        });
    },
    [metodo, url]
  );

  //  // useEffect para fazer a primeira solicitacao de dados
  //  useEffect(()=>{
  //      (()=>{
  //         setFetch(dados);
  //      })();

  // }, [url]);

  return { error, wait, data, setFetch };
};

export default useFetch;
