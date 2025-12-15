import { query } from '@/lib/db';

export async function GET(request) {
  try {
    const result = await query(
      'SELECT t.id, t.titulo, t.descricao, t.prazo, t.materia_id, m.nome as materia FROM tarefas t LEFT JOIN materias m ON t.materia_id = m.id ORDER BY t.id DESC'
    );

    return Response.json(result.rows);
  } catch (error) {
    console.error('GET /api/tasks:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { titulo, descricao, prazo, materia_id } = body;

    if (!titulo) {
      return Response.json({ error: 'Título é obrigatório' }, { status: 400 });
    }

    const result = await query(
      'INSERT INTO tarefas (titulo, descricao, prazo, materia_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [titulo, descricao || null, prazo || null, materia_id || null]
    );

    return Response.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('POST /api/tasks:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
