import Express from 'express'  //la primera es el nombre que le damos a la importaccion
import {v4 as uuidv4} from 'uuid'
import Database from 'better-sqlite3';

const db = new Database('mi_basedatos.db'); //Database es clase

// crear tabla si no existe
db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        createdAt TEXT
    )
`);

const app = Express()//debe de concordar con la primera parte de la importracion
app.use(Express.json())//mismo caso

app.post('/account', (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).send({ message: "El nombre es obligatorio" });
    }

    const id = uuidv4();
    const createdAt = new Date().toISOString();

    try {
        const stmt = db.prepare(`
            INSERT INTO users (id, name, createdAt)
            VALUES (?, ?, ?)
        `);
        
        stmt.run(id, name, createdAt);

        res.status(201).send({
            message: "Usuario creado exitosamente",
            user: { id, name, createdAt }
        });
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Error al crear el usuario" });
    }
});


app.get('/account/:id', (req, res) => {
    const { id } = req.params;

    try {
        const stmt = db.prepare(`
            SELECT id, name, createdAt
            FROM users
            WHERE id = ?
        `);
        const user = stmt.get(id);

        if (!user) {
            return res.status(404).send({ message: "Usuario no encontrado" });
        }

        res.send({
            message: "Usuario encontrado",
            user
        });
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Error al consultar el usuario" });
    }
});

app.delete('/account/:id', (req, res) => {
    const { id } = req.params;

    try {
        // preparamos consulta segura
        const stmt = db.prepare(`
            DELETE FROM users
            WHERE id = ?
        `);

        const info = stmt.run(id); // aquí se ejecuta

        if (info.changes === 0) {
            return res.status(404).send({ message: "Usuario no encontrado" });
        }

        res.send({
            message: "Usuario eliminado correctamente",
            deletedId: id
        });
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Error al eliminar usuario" });
    }
});
app.patch('/account/:id', (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
        return res.status(400).send({ message: "El nombre es obligatorio" });
    }

    try {
        const stmt = db.prepare(`
            UPDATE users
            SET name = ?
            WHERE id = ?
        `);

        const info = stmt.run(name, id);

        if (info.changes === 0) {
            return res.status(404).send({ message: "Usuario no encontrado" });
        }

        res.send({
            message: "Usuario actualizado correctamente",
            updatedId: id,
            newName: name
        });
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Error al actualizar usuario" });
    }
});



app.listen(3000, () => {
    console.log('Servidor escuchando en puerto 3000');
    console.log('Conectado a SQLite con better-sqlite3');
});
