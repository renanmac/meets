/**
 * Trigger handler
 *
 * @param {object} plg - Pluga developer platform toolbox.
 * @param {object} plg.axios - [axios](https://github.com/axios/axios)
 *
 * @param {object} event - Event bundle to handle.
 * @param {object} event.meta - Pluga event meta data.
 * @param {string} event.meta.baseURI - Environment base URI.
 * @param {number} event.meta.lastReqAt - Last task handle timestamp.
 * @param {object} event.auth - Your app.json auth fields.
 * @param {object} event.input - Your meta.json fields.
 *
 * @returns {Promise} Promise object represents an array of resources to handle.
 */
exports.handle = function (plg, event) {
    return plg.axios({
        baseURL: event.meta.baseURI,
        url: '/oportunidade/listar',
        method: 'GET',
        headers: {
          Authorization: `${event.auth.token}`,
        },
        params: {
          rp: 100,
          tipo_data: 'data_conquista_perda',
          status: 'P'
        }
      }).then(async (res) => {
        const oportunidades = res.data.dados.filter((oportunidade) => {
          const timestamp = Date.parse(oportunidade.data_conquista_perda);
          return timestamp >= event.meta.lastReqAt;
        });

        return oportunidades;
      });
};
