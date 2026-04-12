
interface MatriculaActiva{
    estado : "ACTIVA",
    asignaturas : string[];
}
interface MatriculaSuspendida{
    estado : "SUSPENDIDA",
    motivo : string;
}

interface MatriculaFinalizada{
    estado : "FINALIZADA",
    notaMedia : number;
}

type EstadoMatricula = MatriculaActiva | MatriculaSuspendida | MatriculaFinalizada;

interface Estudiante {
    readonly id : string,
    nombre : string,
    edad : number,
    nota_media : number,
    estado : "PARADO" | "ESTUDIANDO"
};

interface Asignatura {
    readonly idAsignatura : string,
    nombre : string,
    dificultad : "FACIL" | "MEDIA" | "DIFICIL"
};

function generarReporte(matricula: EstadoMatricula){
    switch(matricula.estado){
        case "ACTIVA":
            console.log(`Es estado de la matrícula es ${matricula.estado}`);
        case "SUSPENDIDA":
            console.log(`Es estado de la matrícula es ${matricula.estado}`);
        case "FINALIZADA":
            console.log(`Es estado de la matrícula es ${matricula.estado}`);
    }
}