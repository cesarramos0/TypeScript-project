# Construcción de simulación de servidor en local

## Estructura

Dividí el proyecto en 4 partes mas pequeñas.
- Base de datos
- Espera artificial
- Metodo genérico
- Uso

Cada una tiene una función específica e independiente de la anterior.

### Base de datos

Para implementar una base de datos cree un simple objeto en la cual las claves fueron los endpoints simulados
y los valores fueron arrays de datos.

```typescript
const baseDatos : Record<string, unknown[]> = {
    "/usuarios":[
        {id: 1, nombre:"Sergio", email:"sergio43@gmail.com"},
        {id: 2, nombre:"Naya", email:"naya21@gmail.com"},
    ],
    "/productos":[
        {id: 3, nombre:"Teclado", precio:34},
    ],
}
```

El tipo `Record<string, unknown[]>` le indica a TypeScript que las claves son strings
y los valores son arrays de objetos desconocidos, permitiendo acceder con cualquier endpoint.

### Espera artificial

Para recrear este tipo de espera tuve que crear una función específica para ello, la cual recogía
un número que sería la cantidad de ms que simularía de espera, y devolvía una `Promise<void>`,
es decir, una promesa que no retorna ningún valor útil, solo indica que la espera terminó.

```typescript
function esperar(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}
```

### Método genérico

El método genérico es el núcleo del servicio. Recibe un endpoint como string y devuelve
una `Promise<T>`, donde `T` es el tipo que se especifica en el momento de la llamada.

```typescript
async function obtenerRecurso<T>(endpoint: string): Promise<T> {
    await esperar(300);

    const datos = baseDatos[endpoint];

    if (!datos){
        throw new Error(`No existe el endpoint: ${endpoint}`);
    }

    return datos as T;
}
```

La `T` actúa como una variable de tipo: no tiene valor concreto hasta que se llama a la función.
En ese momento TypeScript sustituye `T` por el tipo indicado y puede detectar errores en compilación.
El `as T` es una aserción: le decimos a TypeScript que confíe en que los datos son del tipo esperado.

### Uso

Para consumir el método se define la interfaz que describe la forma de los datos esperados,
y se pasa como tipo genérico al llamar a `obtenerRecurso`.

```typescript
interface Usuario {
    id: number;
    nombre: string;
    email: string;
}

async function main() {
    const usuarios = await obtenerRecurso<Usuario[]>("/usuarios");
    usuarios.forEach(u => console.log(u.nombre));
}

main();
```

TypeScript sabe que `usuarios` es un array de `Usuario`, por lo que detecta en compilación
cualquier acceso a propiedades que no existan en la interfaz.

---

## Decisiones de diseño

### Por qué `interface` y no `type` para los datos

En el proyecto hay dos candidatos a modelar: `Usuario` y `Producto`. Ambos son entidades del
dominio, objetos con propiedades fijas que describen una cosa concreta del mundo real. Para esto
elegí `interface` por una razón concreta: una interfaz expresa un contrato estructural, es decir,
dice exactamente qué forma debe tener un objeto para ser considerado de ese tipo.

```typescript
interface Usuario {
    id: number;
    nombre: string;
    email: string;
}
```

Podría haber usado `type`, y habría funcionado igual en este caso. Pero `type` está pensado para
situaciones distintas: uniones de tipos, alias de primitivos, combinaciones. Como `Usuario` es
siempre la misma estructura fija, `interface` comunica mejor la intención.

### Por qué `Record<string, unknown[]>` para la base de datos

TypeScript necesita saber el tipo del objeto para permitir el acceso dinámico con
`baseDatos[endpoint]`. Sin un tipo explícito, solo conoce las claves concretas que ve y no acepta
un string genérico como índice.

Usé `unknown[]` y no `any[]` de forma deliberada. `any` desactiva completamente la comprobación
de tipos. `unknown` en cambio dice: "hay algo aquí pero no sé qué es todavía". Obliga a que quien
use esos datos los convierta a un tipo concreto antes de operar con ellos, que es exactamente lo
que hace el `as T` en el método genérico.

### Por qué un método genérico y no una función por cada tipo

La alternativa sin genéricos sería escribir una función para cada tipo de dato:

```typescript
async function obtenerUsuarios(): Promise<Usuario[]> { ... }
async function obtenerProductos(): Promise<Producto[]> { ... }
```

Esto funciona pero la lógica de buscar en la base de datos, simular la espera y comprobar si el
endpoint existe es idéntica en ambas funciones. Si se añade un tercer tipo, se repite la misma
lógica por tercera vez. El genérico resuelve esto escribiendo la lógica una sola vez y dejando
el tipo como parámetro:

```typescript
async function obtenerRecurso<T>(endpoint: string): Promise<T>
```

La `T` abstrae exactamente la parte que cambia entre llamadas (el tipo del resultado) mientras
mantiene fija la parte que no cambia (la lógica de acceso). Esto es especialmente valioso en
respuestas de red porque todas siguen el mismo patrón: esperar, buscar, comprobar errores,
devolver. Solo el tipo del payload varía.

### Por qué `Promise<void>` en `esperar` y `Promise<T>` en `obtenerRecurso`

Son dos usos distintos de Promise. En `esperar`, la función solo existe para introducir una pausa,
no hay ningún valor útil que devolver cuando termina, solo importa que hayan pasado los
milisegundos. `void` comunica exactamente eso.

En `obtenerRecurso` en cambio sí hay un valor que devolver, y ese valor tiene un tipo que depende
de quien llame a la función. `Promise<T>` mantiene esa información a través de la cadena asíncrona,
de forma que cuando el `await` resuelve, TypeScript sabe exactamente qué tipo tiene el resultado.