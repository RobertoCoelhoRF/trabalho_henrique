import { query } from '@/lib/db';

export async function PUT(request, context) {
  try {
    const params = await context.params;
    const { id } = params;
    const taskId = parseInt(id, 10);
    const body = await request.json();
    const { titulo, descricao, prazo, materia_id } = body;

    const result = await query(
      'UPDATE tarefas SET titulo = $1, descricao = $2, prazo = $3, materia_id = $4 WHERE id = $5 RETURNING *',
      [titulo, descricao || null, prazo || null, materia_id || null, taskId]
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

export async function DELETE(request, context) {
  try {
    const params = await context.params;
    const { id } = params;
    
    if (!id || id === 'undefined' || id === 'null') {
      return Response.json({ error: 'ID inválido' }, { status: 400 });
    }
    
    const taskId = parseInt(id, 10);
    
    if (isNaN(taskId)) {
      return Response.json({ error: 'ID inválido' }, { status: 400 });
    }

    const result = await query(
      'DELETE FROM tarefas WHERE id = $1 RETURNING *',
      [taskId]
    );

    if (result.rows.length === 0) {
      return Response.json({ error: 'Tarefa não encontrada' }, { status: 404 });
    }

    return Response.json({ message: 'Tarefa deletada com sucesso', deleted: result.rows[0] });
  } catch (error) {
    console.error('DELETE /api/tasks/[id]:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request, context) {
  try {
    const params = await context.params;
    const { id } = params;
    const taskId = parseInt(id, 10);

    const result = await query(
      'SELECT t.id, t.titulo, t.descricao, t.prazo, t.materia_id, m.nome as materia FROM tarefas t LEFT JOIN materias m ON t.materia_id = m.id WHERE t.id = $1',
      [taskId]
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
