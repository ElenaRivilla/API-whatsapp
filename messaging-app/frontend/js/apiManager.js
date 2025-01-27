export async function userExists(username, password) {
    const endpoint = ""; // URL del endpoint de la API

    // Construir la url con los parámetros de consulta
    let url = `${endpoint}?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`;

    try {
        // Realizar la solicitud GET usando fetch
        let response = await fetch(url, {
            method: "GET",
            headers: {
                // "Content-Type": "application/json", Configura el tipo de contenido
            }
        });

        // Verificar que la respuesta sea exitosa
        if (!response.ok) {
            throw new Error("Error en la respuesta del servidor");
        }

        // Parsear la respuesta JSON
        const data = await response.json();

        // Comprobar si el usuario existe
        if (!data.exists) {
            throw new Error("Usuario o contraseña incorrectos.");
        }

        return;
    } catch (error) {
        // Lanzar un error general si hay algún problema en la solicitud
        throw new Error("Hay un error en el servidor, por favor, inténtalo de nuevo más tarde.");
    }
}