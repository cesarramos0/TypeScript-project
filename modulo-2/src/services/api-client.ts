// BASE DE DATOS LOCAL

const baseDatos : Record<string, unknown[]> = {
    "/usuarios":[
        {id: 1, nombre:"Sergio", email:"sergio43@gmail.com"},
        {id: 2, nombre:"Naya", email:"naya21@gmail.com"},
    ],
    "/productos":[
        {id: 3, nombre:"Teclado", precio:34},
    ],
}

// ESPERA ARTIFICIAL

function esperar(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// METODO GENERICO

async function obtenerRecurso<T>(endpoint: string): Promise<T> {
    await esperar(300);

    const datos = baseDatos[endpoint];

    if (!datos){
        throw new Error(`No existe el endpoint: ${endpoint}`);
    }

    return datos as T;
    
}

// USO

interface Usuario { id: number; nombre: string, email: string;}

async function main() {
    
    const usuarios = await obtenerRecurso<Usuario[]>("/usuarios");

    usuarios.forEach(e => console.log(e));
}