import { query } from '@/lib/db';

// PUT /api/tasks/[id] - Atualizar tarefa (marcar como concluída ou editar)
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { titulo, descricao, prazo, materia_id } = body;

    const result = await query(
      'UPDATE tarefas SET titulo = $1, descricao = $2, prazo = $3, materia_id = $4 WHERE id = $5 RETURNING *',
      [titulo, descricao || null, prazo || null, materia_id || null, id]
    );

    if (result.rows.length === 0) {
      return Response.json({ error: 'Tarefa não encontrada' }, { status: 404 });
    }

    return Response.json(result.rows[0]);
  } catch (error) {
    console.error('PUT /api/tasks/[id]:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

// DELETE /api/tasks/[id] - Deletar tarefa
export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    const result = await query(
      'DELETE FROM tarefas WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return Response.json({ error: 'Tarefa não encontrada' }, { status: 404 });
    }

    return Response.json({ message: 'Tarefa deletada com sucesso' });
  } catch (error) {
    console.error('DELETE /api/tasks/[id]:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

// GET /api/tasks/[id] - Obter uma tarefa específica
export async function GET(request, { params }) {
  try {
    const { id } = params;

    const result = await query(
      'SELECT t.id, t.titulo, t.descricao, t.prazo, t.materia_id, m.nome as materia FROM tarefas t LEFT JOIN materias m ON t.materia_id = m.id WHERE t.id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return Response.json({ error: 'Tarefa não encontrada' }, { status: 404 });
    }

    return Response.json(result.rows[0]);
  } catch (error) {
    console.error('GET /api/tasks/[id]:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
