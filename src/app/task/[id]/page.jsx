'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import styles from './task-form.module.css';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

export default function EditarTask() {
  const router = useRouter();
  const params = useParams();
  const taskId = params.id;

  const [materias, setMaterias] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [submetendo, setSubmetendo] = useState(false);
  const [erro, setErro] = useState(null);

  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    prazo: '',
    materia_id: '',
  });

  useEffect(() => {
    const carregarDados = async () => {
      try {
        setCarregando(true);

        const resMaterias = await fetch(`${API_URL}/subjects`);
        if (!resMaterias.ok) throw new Error('Erro ao carregar matérias');
        const dadosMaterias = await resMaterias.json();
        setMaterias(dadosMaterias);

        const resTarefa = await fetch(`${API_URL}/tasks/${taskId}`);
        if (!resTarefa.ok) throw new Error('Erro ao carregar tarefa');
        const tarefa = await resTarefa.json();

        setFormData({
          titulo: tarefa.titulo,
          descricao: tarefa.descricao,
          prazo: tarefa.prazo.split('T')[0],
          materia_id: tarefa.materia_id,
        });
      } catch (err) {
        setErro(err.message);
        console.error('Erro:', err);
      } finally {
        setCarregando(false);
      }
    };

    carregarDados();
  }, [taskId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro(null);

    if (!formData.titulo.trim()) {
      setErro('Título é obrigatório');
      return;
    }

    if (!formData.descricao.trim()) {
      setErro('Descrição é obrigatória');
      return;
    }

    if (!formData.prazo) {
      setErro('Prazo é obrigatório');
      return;
    }

    if (!formData.materia_id) {
      setErro('Selecione uma matéria');
      return;
    }

    try {
      setSubmetendo(true);
      const res = await fetch(`${API_URL}/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          titulo: formData.titulo,
          descricao: formData.descricao,
          prazo: formData.prazo,
          materia_id: parseInt(formData.materia_id),
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Erro ao atualizar tarefa');
      }

      router.push('/');
    } catch (err) {
      setErro(err.message);
      console.error('Erro:', err);
    } finally {
      setSubmetendo(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <div className={styles.header}>
          <Link href="/" className={styles.voltar}>
            ← Voltar
          </Link>
          <h1>Editar Tarefa</h1>
        </div>

        {erro && <p className={styles.erro}>{erro}</p>}

        {carregando ? (
          <p className={styles.carregando}>Carregando tarefa...</p>
        ) : (
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="titulo">Título *</label>
              <input
                type="text"
                id="titulo"
                name="titulo"
                value={formData.titulo}
                onChange={handleChange}
                placeholder="Digite o título da tarefa"
                maxLength={100}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="descricao">Descrição *</label>
              <textarea
                id="descricao"
                name="descricao"
                value={formData.descricao}
                onChange={handleChange}
                placeholder="Digite a descrição da tarefa"
                rows={5}
                maxLength={500}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="prazo">Prazo *</label>
              <input
                type="date"
                id="prazo"
                name="prazo"
                value={formData.prazo}
                onChange={handleChange}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="materia_id">Matéria *</label>
              {materias.length === 0 ? (
                <p className={styles.aviso}>Nenhuma matéria cadastrada</p>
              ) : (
                <select
                  id="materia_id"
                  name="materia_id"
                  value={formData.materia_id}
                  onChange={handleChange}
                >
                  {materias.map((materia) => (
                    <option key={materia.id} value={materia.id}>
                      {materia.nome}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className={styles.botoes}>
              <button
                type="submit"
                disabled={submetendo}
                className={styles.btnSubmit}
              >
                {submetendo ? 'Salvando...' : 'Atualizar Tarefa'}
              </button>
              <Link href="/" className={styles.btnCancelar}>
                Cancelar
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
