'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './subject-form.module.css';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export default function NovaMateria() {
  const router = useRouter();
  const [submetendo, setSubmetendo] = useState(false);
  const [erro, setErro] = useState(null);

  const [formData, setFormData] = useState({
    nome: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro(null);

    if (!formData.nome.trim()) {
      setErro('Nome da matéria é obrigatório');
      return;
    }

    try {
      setSubmetendo(true);
      const res = await fetch(`${API_URL}/subjects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome: formData.nome,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Erro ao criar matéria');
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
          <h1>Adicionar Nova Matéria</h1>
        </div>

        {erro && <p className={styles.erro}>{erro}</p>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="nome">Nome da Matéria *</label>
            <input
              type="text"
              id="nome"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              placeholder="Ex: Matemática, Português, etc..."
              maxLength={100}
              autoFocus
            />
          </div>

          <div className={styles.botoes}>
            <button
              type="submit"
              disabled={submetendo}
              className={styles.btnSubmit}
            >
              {submetendo ? 'Salvando...' : 'Salvar Matéria'}
            </button>
            <Link href="/" className={styles.btnCancelar}>
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
