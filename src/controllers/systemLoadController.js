const { getSystemLoad } = require('../services/systemLoadService');

const getSystemLoadHandler = async (req, res) => {
    try {
        const systemLoad = await getSystemLoad();

        return res.status(200).json({
            carga_del_sistema_por_hora: systemLoad
        });
    } catch (error) {
        console.error(`Error calculando la carga del sistema: ${error.message}`);
        return res.status(500).json({ error: 'Hubo un problema al obtener la carga del sistema.' });
    }
};

module.exports = { getSystemLoadHandler };