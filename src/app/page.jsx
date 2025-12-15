'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

export default function Home() {
  const [tarefas, setTarefas] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        setCarregando(true);
        setErro(null);

        const resTarefas = await fetch(`${API_URL}/tasks`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!resTarefas.ok) throw new Error('Erro ao carregar tarefas');
        const dadosTarefas = await resTarefas.json();
        setTarefas(dadosTarefas);

        const resMaterias = await fetch(`${API_URL}/subjects`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!resMaterias.ok) throw new Error('Erro ao carregar matérias');
        const dadosMaterias = await resMaterias.json();
        setMaterias(dadosMaterias);
      } catch (err) {
        setErro(err.message);
        console.error('Erro:', err);
      } finally {
        setCarregando(false);
      }
    };

    carregarDados();
  }, []);

  const getNomeMaterias = (materiaId) => {
    const materia = materias.find((m) => m.id === materiaId);
    return materia ? materia.nome : 'Matéria desconhecida';
  };

  const deletarTarefa = async (id) => {
    if (!confirm('Tem certeza que deseja deletar esta tarefa?')) return;

    try {
      const res = await fetch(`${API_URL}/tasks/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        const errorBody = await res.text();
        throw new Error(errorBody || 'Erro ao deletar tarefa');
      }

      setTarefas(tarefas.filter((tarefa) => tarefa.id !== id));
    } catch (err) {
      alert('Erro ao deletar tarefa: ' + err.message);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Estude Já</h1>
        <div className={styles.botoes}>
          <Link href="/task/new" className={styles.btnPrimario}>
            ➕ Adicionar Nova Tarefa
          </Link>
          <Link href="/subject/new" className={styles.btnSecundario}>
            ➕ Adicionar Nova Matéria
          </Link>
        </div>
      </header>

      <main className={styles.main}>
        {carregando && <p className={styles.mensagem}>Carregando tarefas...</p>}
        {erro && <p className={styles.erro}>Erro: {erro}</p>}

        {!carregando && tarefas.length === 0 && (
          <p className={styles.mensagem}>Nenhuma tarefa cadastrada. Crie uma nova!</p>
        )}

        {!carregando && tarefas.length > 0 && (
          <div className={styles.tarefasContainer}>
            <h2>Todas as Tarefas ({tarefas.length})</h2>
            <div className={styles.tarefasGrid}>
              {tarefas.map((tarefa) => (
                <div key={tarefa.id} className={styles.tarefaCard}>
                  <div className={styles.tarefaHeader}>
                    <h3>{tarefa.titulo}</h3>
                    <span className={styles.materia}>{getNomeMaterias(tarefa.materia_id)}</span>
                  </div>
                  <p className={styles.descricao}>{tarefa.descricao}</p>
                  <div className={styles.tarefaFooter}>
                    <p className={styles.prazo}>
                      📅 {new Date(tarefa.prazo).toLocaleDateString('pt-BR')}
                    </p>
                    <div className={styles.acoes}>
                      <Link
                        href={`/task/${tarefa.id}`}
                        className={styles.btnEditar}
                      >
                        ✏️ Editar
                      </Link>
                      <button
                        onClick={() => deletarTarefa(tarefa.id)}
                        className={styles.btnDeletar}
                      >
                        🗑️ Deletar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
