export async function userExists(username, password) {
    const endpoint = ""; //URL del endpoint de la API 

    //Construir la url con los parámetros de consulta
    let url = `${endpoint}?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`;

    try {
        // Realizar la solicitud GET usando fetch
        let response = await fetch(url, {
            method: "GET",
            headers: {
                // "Content-Type": "application/json", Configura el tipo de contenido, en el objeto headers se pueden pasar auth ej: 'Authorization': 'Bearer tu-token'
            },
        });
        return response.json["exists"];

    } catch (error) {
        throw error;
    }
}