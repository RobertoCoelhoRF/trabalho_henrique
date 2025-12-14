#!/usr/bin/env node

/**
 * Script para conectar ao Neon e criar as tabelas
 * Uso: DATABASE_URL="..." node setup-database.js
 */

const { Pool } = require('pg');

// Usar a string de conexão do ambiente
const connectionString = 'postgresql://neondb_owner:npg_YOaAHBxph93v@ep-little-mouse-acnbpie9-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require';

const pool = new Pool({
  connectionString,
});

const createTablesSQL = `
CREATE TABLE IF NOT EXISTS materias (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tarefas (
  id SERIAL PRIMARY KEY,
  titulo VARCHAR(200) NOT NULL,
  descricao TEXT,
  prazo DATE,
  materia_id INTEGER REFERENCES materias(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO materias (nome) VALUES ('Matemática'), ('Português'), ('História'), ('Ciências')
ON CONFLICT (nome) DO NOTHING;

INSERT INTO tarefas (titulo, descricao, prazo, materia_id) VALUES
  ('Fazer exercício de matemática', 'Página 42 do livro - exercícios de álgebra', '2024-12-20', 1),
  ('Ler capítulo 5', 'Português - leitura obrigatória', '2024-12-18', 2),
  ('Estudar Revolução Francesa', 'Para prova de história - capítulos 3 e 4', '2024-12-22', 3)
ON CONFLICT DO NOTHING;
`;

async function setupDatabase() {
  try {
    console.log('🔌 Conectando ao banco de dados Neon...');
    
    const client = await pool.connect();
    console.log('✅ Conectado!');

    console.log('📝 Criando tabelas...');
    await client.query(createTablesSQL);
    console.log('✅ Tabelas criadas com sucesso!');

    client.release();
    await pool.end();
    console.log('✨ Setup completo!');
  } catch (error) {
    console.error('❌ Erro:', error);
    process.exit(1);
  }
}

setupDatabase();
