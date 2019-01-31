/**
 * Action handler
 *
 * @param {object} plg - Pluga developer platform toolbox.
 * @param {object} plg.axios - [axios](https://github.com/axios/axios)
 *
 * @param {object} event - Event bundle to handle.
 * @param {object} event.meta - Pluga event meta data.
 * @param {string} event.meta.baseURI - Environment base URI.
 * @param {object} event.auth - Your app.json auth fields.
 * @param {object} event.input - Your meta.json fields.
 *
 * @returns {Promise} Promise object represents the action result.
 */

const getClienteId = (plg, event) => {
    const input = Object.assign({}, event.input)
    let cliente = {};
    cliente.razao = input.razao_cliente
    cliente.email = input.email_cliente
    cliente.celular = input.celular_cliente
    cliente.fone = input.fone_cliente
    cliente.id_usuario = input.id_usuario

    const values = [
        cliente.razao,
        // cliente.tipo_pessoa,
        // cliente.cpf,
        // cliente.cnpj,
        // cliente.celular,
        cliente.email
        // cliente.id_usuario,
        // cliente.celular,
        // cliente.email,
        // cliente.telefone,
        // cliente.id_atuacao,
        // cliente.id_origem,
        // cliente.cidade,
        // cliente.uf
    ].filter(v => v);

    if (values.length === 0) return null;

    return plg.axios({
        baseURL: event.meta.baseURI,
        url: '/cliente/salvar',
        method: 'POST',
        headers: {
            Authorization: `${event.auth.token}`,
        },
        data: cliente
    }).then(res => res.data.id_cliente).catch((err) => {
        // se for erro 400, o cliente foi encontrado
        if(err.response.status == 400){
            let cliente = err.response.data.cliente
            return cliente.id_cliente
        }
        throw `Cliente: ${err}`;
    });
};

const getOportunidadeId = (plg, event, id_cliente) => {
    const params = {
      nome: event.input.descricao,
      id_cliente: id_cliente
    };

    return plg.axios({
      baseURL: event.meta.baseURI,
      url: '/oportunidade/listar',
      method: 'GET',
      headers: {
        Authorization: `${event.auth.token}`,
      },
      params: params
    }).then(res => (res.data.dados.filter(d => d.descricao === event.input.descricao)[0] || { id_oportunidade: '' }).id_oportunidade).catch((err) => {
      throw `Oportunidade: ${err.response.data.msg}`;
    });
  };

exports.handle = async (plg, event) => {
    if (event.input.form_id) delete event.input.form_id
    if (event.input.response) delete event.input.response
    if (event.input.payload_schema) delete event.input.payload_schema

    const clienteId = await getClienteId(plg, event)
    const oportunidadeId = await getOportunidadeId(plg, event, clienteId)

    const data = Object.assign({}, event.input)
    data.id_oportunidade = oportunidadeId
    data.id_status = JSON.stringify([data.id_status])
    data.produtos = JSON.stringify([{id: data.produtos}])

    return plg.axios({
        baseURL: event.meta.baseURI,
        url: '/oportunidade/salvar',
        method: 'POST',
        headers: {
            Authorization: `${event.auth.token}`,
        },
        data: data
    }).then((res) => {
      if (res.data.codigo === -1) {
        throw res.data.msg
      }
      return res.data
    });
};
