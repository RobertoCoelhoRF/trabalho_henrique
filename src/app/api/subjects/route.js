import { query } from '@/lib/db';

export async function GET(request) {
  try {
    const result = await query(
      'SELECT id, nome, created_at FROM materias ORDER BY nome ASC'
    );

    return Response.json(result.rows);
  } catch (error) {
    console.error('GET /api/subjects:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { nome } = body;

    if (!nome) {
      return Response.json({ error: 'Nome é obrigatório' }, { status: 400 });
    }

    const result = await query(
      'INSERT INTO materias (nome) VALUES ($1) RETURNING *',
      [nome]
    );

    return Response.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('POST /api/subjects:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
