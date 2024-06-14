// controllers/incidentsController.js
import connection from '../config/config.js';

export const getIncidents = (req, res) => {
    connection.query('SELECT * FROM incidents', (err, results) => {
        if (err) {
            console.error('Error al recuperar los incidentes:', err);
            res.status(500).json({ error: 'No se pudo recuperar los incidentes' });
        } else {
            res.json(results);
        }
    });
};

export const getIncidentById = (req, res) => {
    const { id } = req.params;
    connection.query('SELECT * FROM incidents WHERE id = ?', [id], (err, results) => {
        if (err) {
            console.error(`Error al recuperar el incidente con ID ${id}:`, err);
            res.status(500).json({ error: 'No se pudo recuperar el incidente con el ID proporcionado' });
        } else {
            res.json(results[0]);
        }
    });
};

export const createIncident = (req, res) => {
    const { user_id, status, job, description, image_url } = req.body;

    // Validación básica de entrada
    if (!user_id || !status || !job || !description) {
        return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    connection.query(
        'INSERT INTO incidents (user_id, status, job, description, image_url, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
        [user_id, status, job, description, image_url],
        (err, results) => {
            if (err) {
                console.error('Error al crear el incidente:', err);
                return res.status(500).json({ error: 'No se pudo crear el incidente' });
            }

            res.status(201).json({ id: results.insertId });
        }
    );
};

export const updateIncident = (req, res) => {
    const { id } = req.params;
    const { status, job, description, image_url } = req.body;

    // Validación básica de entrada
    if (!status || !job || !description) {
        return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    connection.query(
        'UPDATE incidents SET status = ?, job = ?, description = ?, image_url = ? WHERE id = ?',
        [status, job, description, image_url, id],
        (err, results) => {
            if (err) {
                console.error(`Error al actualizar el incidente con ID ${id}:`, err);
                res.status(500).json({ error: 'No se pudo actualizar el incidente' });
            } else {
                res.json({ mensaje: 'Incidente actualizado exitosamente' });
            }
        }
    );
};

export const deleteIncident = (req, res) => {
    const { id } = req.params;
    connection.query('DELETE FROM incidents WHERE id = ?', [id], (err, results) => {
        if (err) {
            console.error(`Error al eliminar el incidente con ID ${id}:`, err);
            res.status(500).json({ error: 'No se pudo eliminar el incidente' });
        } else {
            res.json({ mensaje: 'Incidente eliminado exitosamente' });
        }
    });
};
