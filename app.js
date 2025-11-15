// app.js

// Variable para mostrar los resultados en la interfaz
const resultsDisplay = document.getElementById('results');

// Función auxiliar para mostrar la respuesta del servidor y animar
function displayResult(data) {
    resultsDisplay.textContent = JSON.stringify(data, null, 2);
    
    // Animación de flash al recibir resultados (feedback visual)
    resultsDisplay.style.transition = 'none';
    
    // Cambia el color brevemente (rojo si es error, azul si es éxito)
    resultsDisplay.style.backgroundColor = (data.error || (data.message && data.message.includes('Error'))) ? '#dc3545' : '#007bff';
    
    // Después de un breve momento, vuelve al estilo normal con una transición
    setTimeout(() => {
        resultsDisplay.style.transition = 'background-color 0.6s ease';
        resultsDisplay.style.backgroundColor = '#333';
    }, 50);
}

// Función auxiliar que maneja el envío de formularios con animación
async function handleFormSubmit(e, url, method, data = null) {
    e.preventDefault();
    const button = e.target.querySelector('button');
    const originalText = button.textContent;
    
    // 1. Iniciar Animación
    button.classList.add('loading');
    button.textContent = 'Cargando...';

    try {
        const fetchOptions = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
        };
        if (data) {
            fetchOptions.body = JSON.stringify(data);
        }

        const response = await fetch(url, fetchOptions);
        // Verifica si la respuesta es OK (200-299) para evitar errores de JSON parsing
        const resultData = await response.json(); 
        displayResult(resultData);
    } catch (error) {
        // Muestra el error de conexión si el servidor no responde
        console.error("Fetch Error:", error);
        displayResult({ error: 'Error de conexión al servidor. Asegúrate de que Node.js esté ejecutándose.' });
    } finally {
        // 2. Detener Animación y restaurar texto
        button.classList.remove('loading');
        button.textContent = originalText;
    }
}

// ----------------------------------------------------
// 1. CREAR USUARIO (POST) - URL CORREGIDA
// ----------------------------------------------------
document.getElementById('create-form').addEventListener('submit', (e) => {
    const name = document.getElementById('create-name').value;
    handleFormSubmit(e, 'http://localhost:3000/account', 'POST', { name });
});

// ----------------------------------------------------
// 2. BUSCAR USUARIO (GET) - URL CORREGIDA
// ----------------------------------------------------
document.getElementById('read-form').addEventListener('submit', (e) => {
    const id = document.getElementById('read-id').value;
    handleFormSubmit(e, `http://localhost:3000/account/${id}`, 'GET');
});

// ----------------------------------------------------
// 3. ACTUALIZAR USUARIO (PATCH) - URL CORREGIDA
// ----------------------------------------------------
document.getElementById('update-form').addEventListener('submit', (e) => {
    const id = document.getElementById('update-id').value;
    const name = document.getElementById('update-name').value;
    handleFormSubmit(e, `http://localhost:3000/account/${id}`, 'PATCH', { name });
});

// ----------------------------------------------------
// 4. ELIMINAR USUARIO (DELETE) - URL CORREGIDA
// ----------------------------------------------------
document.getElementById('delete-form').addEventListener('submit', (e) => {
    const id = document.getElementById('delete-id').value;
    handleFormSubmit(e, `http://localhost:3000/account/${id}`, 'DELETE');
});