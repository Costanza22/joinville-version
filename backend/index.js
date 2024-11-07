import express from 'express';
import mysql from 'mysql2';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());

// Servir arquivos estáticos da pasta 'uploads'
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Conexão ao banco de dados MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'casaroes_db',
});

db.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao MySQL:', err);
    return;
  }
  console.log('Conectado ao MySQL');
});

// Configuração do multer para salvar imagens em disco
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

app.post('/casaroes', upload.single('image'), (req, res) => {
  console.log('Dados recebidos:', req.body);  // Verifica se `date` está presente no corpo da requisição
  const { name, description, location, cep, date } = req.body; 
  const image_path = req.file ? req.file.path : null;

  const sql = 'INSERT INTO casaroes (name, description, location, cep, image_path, date) VALUES (?, ?, ?, ?, ?, ?)';
  db.query(sql, [name, description, location, cep, image_path, date || null], (err, results) => {
    if (err) {
      console.error('Erro ao cadastrar o casarão:', err);
      return res.status(500).json({ error: 'Erro ao cadastrar o casarão' });
    }
    res.status(201).json({ id: results.insertId, name, description, location, cep, image_path, date });
  });
});


// Rota para consultar todos os casarões
app.get('/casaroes', (req, res) => {
  const sql = 'SELECT id, name, description, location, image_path, date FROM casaroes';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Erro ao consultar casarões:', err);
      return res.status(500).json({ error: 'Erro ao consultar casarões' });
    }
    res.json(results);
  });
});


// Rota para editar um casarão pelo ID, atualizando apenas os campos fornecidos
app.put('/casaroes/:id', upload.single('image'), (req, res) => {
  const { id } = req.params;
  const { name, description, location, cep, date } = req.body;
  const image_path = req.file ? req.file.path : null;

  // Cria uma consulta dinâmica com os campos que foram enviados
  let sql = 'UPDATE casaroes SET ';
  const values = [];
  
  if (name) {
    sql += 'name = ?, ';
    values.push(name);
  }
  if (description) {
    sql += 'description = ?, ';
    values.push(description);
  }
  if (location) {
    sql += 'location = ?, ';
    values.push(location);
  }
  if (cep) {
    sql += 'cep = ?, ';
    values.push(cep);
  }
  if (date) {
    sql += 'date = ?, ';
    values.push(date);
  }
  if (image_path) {
    sql += 'image_path = ?, ';
    values.push(image_path);
  }
  
  sql = sql.slice(0, -2) + ' WHERE id = ?';
  values.push(id);

  db.query(sql, values, (err, results) => {
    if (err) {
      console.error('Erro ao atualizar o casarão:', err);
      return res.status(500).json({ error: 'Erro ao atualizar o casarão' });
    }
    
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Casarão não encontrado' });
    }

    res.status(200).json({ message: 'Casarão atualizado com sucesso' });
  });
});

// Rota para excluir um casarão pelo ID
app.delete('/casaroes/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM casaroes WHERE id = ?';

  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error('Erro ao excluir o casarão:', err);
      return res.status(500).json({ error: 'Erro ao excluir o casarão' });
    }
    
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Casarão não encontrado' });
    }

    res.status(200).json({ message: 'Casarão excluído com sucesso' });
  });
});

// Inicia o servidor
app.listen(5000, () => {
  console.log('Servidor rodando na porta 5000');
});
