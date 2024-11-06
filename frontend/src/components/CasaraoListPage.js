import React, { useEffect, useState } from 'react';
import CasaraoFormPage from './CasaraoFormPage';
import { MdOutlineModeEdit } from 'react-icons/md';
import { IoIosStarOutline, IoMdCheckmarkCircleOutline } from 'react-icons/io';
import { BsFillPatchQuestionFill } from 'react-icons/bs';

function CasaraoListPage({ isAdmin }) {
  const [casaroes, setCasaroes] = useState([]);
  const [showCadastro, setShowCadastro] = useState(false);
  const [showList, setShowList] = useState(false);
  const [error, setError] = useState(null);
  const [casaraoToEdit, setCasaraoToEdit] = useState(null);
  const [favoritos, setFavoritos] = useState([]);
  const [visitados, setVisitados] = useState([]);
  const [comentarios, setComentarios] = useState({});
  const [showInput, setShowInput] = useState(false); 
  const [suggestion, setSuggestion] = useState(''); 
  const [successMessage, setSuccessMessage] = useState(''); 

  const fetchCasaroes = async () => {
    try {
      const response = await fetch('http://localhost:5000/casaroes');
      if (!response.ok) throw new Error('Erro ao carregar os casarões: ' + response.statusText);
      
      const data = await response.json();
      setCasaroes(data);
      setError(null);
    } catch (error) {
      console.error('Erro ao carregar os casarões:', error);
      setError(error.message);
    }
  };

  useEffect(() => {
    if (showList) {
      fetchCasaroes();
    }
  }, [showList]);

  const handleCadastroClick = () => {
    setShowCadastro(true);
    setShowList(false);
    setCasaraoToEdit(null);
  };

  const handleConsultarClick = () => {
    setShowList((prev) => !prev);
    setShowCadastro(false);
    if (!showList) {
      fetchCasaroes();
    }
  };
  const handleIconClick = () => {
    setShowInput(!showInput); // Alterna a exibição do input
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    setSuccessMessage('Sugestão enviada com sucesso!');
    setSuggestion('');
  };

  const handleFavoritar = (casarao) => {
    setFavoritos((prev) => 
      prev.some(favorito => favorito.id === casarao.id) 
      ? prev.filter(favorito => favorito.id !== casarao.id)
      : [...prev, casarao]
    );
  };

  const handleMarcarVisitado = (casarao) => {
    setVisitados((prev) =>
      prev.some(visitado => visitado.id === casarao.id)
      ? prev.filter(visitado => visitado.id !== casarao.id)
      : [...prev, casarao]
    );
  };

  const handleDeleteCasarao = async (casaraoId) => {
    try {
      const response = await fetch(`http://localhost:5000/casaroes/${casaraoId}`, {
        method: 'DELETE',
      });
  
      if (!response.ok) throw new Error(`Erro ao excluir o casarão: ${response.statusText}`);
  
      setCasaroes(prev => prev.filter(casarao => casarao.id !== casaraoId));
    } catch (error) {
      console.error('Erro ao excluir o casarão:', error);
      alert('Erro ao excluir o casarão: ' + error.message);
    }
  };

  const handleCasaraoSubmit = async (novoCasarao) => {
    try {
      const method = casaraoToEdit?.id ? 'PUT' : 'POST';
      const url = casaraoToEdit?.id 
        ? `http://localhost:5000/casaroes/${casaraoToEdit.id}`
        : 'http://localhost:5000/casaroes';
  
      const response = await fetch(url, {
        method,
        body: novoCasarao,
      });
      
      if (!response.ok) throw new Error(`Erro ao salvar o casarão: ${response.statusText}`);
      
      fetchCasaroes();
      setShowCadastro(false);
      setShowList(true);
    } catch (error) {
      console.error('Erro ao salvar o casarão:', error);
      alert('Erro ao salvar o casarão: ' + error.message);
    }
  };

  const handleEditClick = (casarao) => {
    setCasaraoToEdit(casarao);
    setShowCadastro(true);
    setShowList(false);
  };

  const handleAddComment = (casaraoId, comment) => {
    setComentarios((prev) => ({
      ...prev,
      [casaraoId]: [...(prev[casaraoId] || []), comment],
    }));
  };

  return (
    <div style={styles.container}>
      {showCadastro ? (
        <CasaraoFormPage 
          onSubmit={handleCasaraoSubmit} 
          casaraoData={casaraoToEdit}
        />
      ) : (
        <>
          <h2 style={styles.title}>
        Lista de Casarões
        <BsFillPatchQuestionFill onClick={handleIconClick} style={{ cursor: 'pointer', marginLeft: '10px' }} />
      </h2>

      {showInput && (
        <div style={styles.formContainer}>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={suggestion}
              onChange={(e) => setSuggestion(e.target.value)}
              placeholder="Digite sua sugestão"
              style={styles.input}
            />
            <button type="submit" style={styles.button}>
              Enviar
            </button>
          </form>
        </div>
      )}

      {successMessage && <p style={styles.successMessage}>{successMessage}</p>}
    
    
          <button onClick={handleConsultarClick} style={styles.button}>
            {showList ? 'Fechar Casarões' : 'Consultar Casarões'}
          </button>
          {isAdmin && (
            <button onClick={handleCadastroClick} style={styles.button}>
              Cadastrar Novo Casarão
            </button>
          )}
          {showList && (
            <div style={styles.listContainer}>
              {error && <div style={{ color: 'red' }}>{error}</div>}
              {casaroes.length > 0 ? (
                <ul style={styles.list}>
                  {casaroes.map((casarao) => (
                    <li key={casarao.id} style={styles.listItem}>
                      <h3>{casarao.name}</h3>
                      <p>{casarao.description}</p>
                      <p>{casarao.location}</p>

                      {casarao.image_path && (
  <div style={styles.imageContainer}>
    <img
      src={`http://localhost:5000/${casarao.image_path}`}
      alt={casarao.name}
      onError={(e) => {
        console.error('Erro ao carregar a imagem:', e);
      }}
      style={styles.image}
    />
  </div>



                      )}
                      {isAdmin && (
                        <>
                          <button onClick={() => handleEditClick(casarao)} style={styles.editButton}>
                            <MdOutlineModeEdit /> Editar
                          </button>
                          <button onClick={() => handleDeleteCasarao(casarao.id)} style={styles.deleteButton}>
                            Excluir
                          </button>
                        </>
                      )}
                      {!isAdmin && (
                        <>
                          <button onClick={() => handleFavoritar(casarao)} style={styles.favoritoButton}>
                            <IoIosStarOutline style={{ color: favoritos.some(favorito => favorito.id === casarao.id) ? 'gold' : 'gray' }} />
                          </button>
                          <button onClick={() => handleMarcarVisitado(casarao)} style={styles.visitadoButton}>
                            <IoMdCheckmarkCircleOutline style={{ color: visitados.some(visitado => visitado.id === casarao.id) ? 'green' : 'gray' }} />
                          </button>
                        </>
                      )}
                      
                      {/* Seção de Comentários */}
                      <div style={styles.comentariosContainer}>
                        <h4>Comentários</h4>
                        <ul>
                          {(comentarios[casarao.id] || []).map((comment, index) => (
                            <li key={index}>{comment}</li>
                          ))}
                        </ul>
                        <input
                          type="text"
                          placeholder="Adicionar um comentário"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && e.target.value.trim()) {
                              handleAddComment(casarao.id, e.target.value);
                              e.target.value = ''; // Limpa o campo de entrada
                            }
                          }}
                          style={styles.comentarioInput}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Nenhum casarão cadastrado.</p>
              )}
            </div>
          )}
          {!isAdmin && (
            <div style={styles.favoritosContainer}>
              <h3>Favoritos</h3>
              <ul>
                {favoritos.length > 0 ? (
                  favoritos.map(favorito => (
                    <li key={favorito.id}>{favorito.name}</li>
                  ))
                ) : (
                  <p>Nenhum favorito adicionado.</p>
                )}
              </ul>
              <h3>Visitados</h3>
              <ul>
                {visitados.length > 0 ? (
                  visitados.map(visitado => (
                    <li key={visitado.id}>{visitado.name}</li>
                  ))
                ) : (
                  <p>Nenhum casarão visitado.</p>
                )}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
    
  );
}



const styles = {
  container: {
    padding: '30px',
    backgroundColor: '#F4E1C1', 
    fontFamily: 'Georgia, serif', 
    borderRadius: '12px',
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)', 
  },
  title: {
    fontSize: '36px', 
    color: '#6B3E26', 
    textAlign: 'center',
    marginBottom: '25px',
    fontWeight: 'bold',
    textTransform: 'uppercase', 
    letterSpacing: '3px', 
  },
  button: {
    display: 'block',
    margin: '10px auto',
    padding: '10px 20px',
    backgroundColor: '#8B4513',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  listContainer: {
    backgroundColor: '#FFF8DC',
    padding: '15px',
    borderRadius: '5px',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
  },
  list: {
    listStyleType: 'none',
    padding: '0',
  },
  listItem: {
    padding: '15px',
    marginBottom: '15px', 
    borderRadius: '8px',
    backgroundColor: '#F5DEB3',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    transition: 'transform 0.2s',
  },
  imageContainer: {
    overflow: 'hidden',
    borderRadius: '5px',
    marginBottom: '10px',
  },
  image: {
    width: '100%',
    height: 'auto',
    borderRadius: '5px',
  },
  editButton: {
    marginRight: '5px',
    backgroundColor: '#FFA07A',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    width: '100px', 
    height: '40px', 
  },
  deleteButton: {
    backgroundColor: '#FF6347',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    width: '100px', 
    height: '40px', 
  },
  
  favoritoButton: {
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
  },
  visitadoButton: {
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
  },
  favoritosContainer: {
    marginTop: '20px',
    backgroundColor: '#FFF8DC',
    padding: '15px',
    borderRadius: '5px',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
  },
  comentariosContainer: {
    marginTop: '10px',
  },
  comentarioInput: {
    marginTop: '10px',
    width: '100%',
    padding: '5px',
    backgroundColor:'burlywood'
    
  },
  imageContainer: {
    display: 'flex',
    justifyContent: 'center',  
    alignItems: 'center',
    marginBottom: '20px',  
  },
  image: {
    width: '400px',  
    height: 'auto',  
    border: '5px solid #ccc',  
    borderRadius: '8px',  
    objectFit: 'cover',  
  },
  buttonHover: {
    backgroundColor: '#45a049',
  },
  successMessage: {
    marginTop: '20px',
    color: '#4CAF50',
    fontSize: '18px',
    fontWeight: 'bold',
  },
  input: {
    padding: '10px',
    width: '300px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    marginRight: '10px',
    fontSize: '16px',
  },
  
  
  
};

export default CasaraoListPage;