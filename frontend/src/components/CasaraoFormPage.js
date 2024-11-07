import React, { useState, useEffect } from 'react';



function CasaraoFormPage({ onSubmit, casaraoData }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [cep, setCep] = useState(''); 
  const [image, setImage] = useState(null);
  const [constructionDate, setConstructionDate] = useState('');
   
  useEffect(() => {
  if (casaraoData) {
    setName(casaraoData.name);
    setDescription(casaraoData.description);
    setLocation(casaraoData.location);
    setCep(casaraoData.cep || '');
    setImage(casaraoData.image_path ? casaraoData.image_path : null);

    if (casaraoData.constructionDate) {
      const date = new Date(casaraoData.constructionDate);
      const formattedDate = date.toISOString().split('T')[0]; // Garantir apenas a data no formato YYYY-MM-DD
      setConstructionDate(formattedDate);
    } else {
      setConstructionDate('');
    }
  }
}, [casaraoData]);

  const handleCepChange = async (e) => {
    setCep(e.target.value);

    // Se o CEP tiver 8 dígitos, buscar coordenadas
    if (e.target.value.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${e.target.value}/json/`);
        const data = await response.json();
        
        // Se a API retornar o endereço, usamos o Google Geocoding para obter lat/lng
        if (data.localidade) {
          
          

          
        }
      } catch (error) {
        console.error('Erro ao buscar CEP:', error);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('location', location);
    formData.append('cep', cep); // Adicionando o CEP
    formData.append('image', image);
    formData.append('date', constructionDate);

    if (constructionDate) {
      const formattedDate = new Date(constructionDate).toISOString().split('T')[0];
      formData.append('constructionDate', formattedDate);
    } else {
      formData.append('constructionDate', '');
    }
  
    if (casaraoData?.id) {
      formData.append('id', casaraoData.id); 
    }
  
    onSubmit(formData); 

    setName('');
    setDescription('');
    setLocation('');
    setCep('');
    setConstructionDate('');
    setImage(null);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>{casaraoData ? 'Editar Casarão' : 'Cadastrar Novo Casarão'}</h2>
      <form onSubmit={handleSubmit} style={styles.form} encType="multipart/form-data">
        <input
          type="text"
          placeholder="Nome do Casarão"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={styles.input}
        />
        <textarea
          placeholder="Descrição do Casarão"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          style={styles.textarea}
        />
        <input
          type="text"
          placeholder="Endereço do Casarão"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
          style={styles.input}
        />
        <input
          type="text"
          placeholder="CEP"
          value={cep}
          onChange={handleCepChange}
          maxLength="8"
          style={styles.input}
        />
          <input
          type="date" // Campo de data
          placeholder="Data de Construção"
          value={constructionDate}
          onChange={(e) => setConstructionDate(e.target.value)}
          style={styles.input}
        />

        {image && (
          <div>
            <img
              src={`http://localhost:5000/casaroes/${image}`} // Ajuste para a URL correta
              alt={name}
              style={{ width: '100%', height: 'auto', marginBottom: '10px' }}
            />
            <p>Imagem atual: {image.name}</p>
          </div>
        )}

        <label htmlFor="fileInput" style={styles.fileLabel}>
          {image ? image.name : 'Escolher arquivo'}
        </label>
        <input
          type="file"
          id="fileInput"
          onChange={(e) => setImage(e.target.files[0])}
          style={styles.fileInput}
        />
        <button type="submit" style={styles.submitButton}>
          {casaraoData ? 'Salvar Alterações' : 'Cadastrar'}
        </button>
      </form>
    </div>
  );
}
const styles = {
  container: {
    padding: '20px',
    backgroundColor: 'Burlywood',
    fontFamily: 'Arial, sans-serif',
    borderRadius: '8px',
    maxWidth: '400px',
    margin: '20px auto', 
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', 
  },
  title: {
    fontSize: '24px',
    color: '#333',
    textAlign: 'center',
    marginBottom: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  input: {
    padding: '10px',
    margin: '5px 0',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  textarea: {
    padding: '10px',
    margin: '5px 0',
    borderRadius: '5px',
    border: '1px solid #ccc',
    resize: 'vertical', 
  },
  fileLabel: {
    padding: '10px',
    margin: '5px 0',
    backgroundColor: '#8B4513', 
    color: '#fff',
    borderRadius: '5px',
    cursor: 'pointer',
    textAlign: 'center',
    display: 'inline-block',
    textDecoration: 'none',
  },
  fileInput: {
    display: 'none', 
  },
  submitButton: {
    padding: '10px 20px',
    backgroundColor: '#8B4513', 
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '10px',
    transition: 'background-color 0.3s', 
  },
  submitButtonHover: {
    backgroundColor: '#5C3D2D', 
  },
  imagePreview: {
    marginTop: '10px',
    textAlign: 'center',
  },
  previewImage: {
    maxWidth: '200px', 
    height: 'auto',
  },
 
};

export default CasaraoFormPage;