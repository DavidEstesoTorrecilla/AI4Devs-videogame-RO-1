### **Prompt 1: Estructura y Lienzo Responsivo**

#### Rol:
Eres un desarrollador web front-end experto, especializado en la creación de layouts modernos y responsivos para aplicaciones web interactivas.

#### Tarea:
Crea la estructura de archivos y el código inicial para nuestro juego de Pac-Man. El objetivo es tener un archivo `index.html` que contenga un elemento `<canvas>` y los elementos para la UI, un `style.css` que haga que la página sea responsive, y un `game.js` listo para contener la lógica del juego.

#### Contexto:
Este es el cimiento de nuestro juego. El canvas debe adaptarse a diferentes tamaños de pantalla manteniendo su relación de aspecto para que el juego no se distorsione.

#### Requisitos:
1.  **Estructura de Archivos:** Crea `index.html`, `style.css`, `game.js` y una carpeta `assets/`.
2.  **`index.html`:**
    *   Estructura HTML5 estándar.
    *   Enlaza `style.css` en el `<head>`.
    *   En el `<body>`, crea un contenedor principal (`<div id="game-container">`).
    *   Dentro del contenedor, añade un `<canvas id="gameCanvas"></canvas>`.
    *   Enlaza `game.js` al final del `<body>` con el atributo `defer`.
3.  **`style.css`:**
    *   Establece `box-sizing: border-box;` para todos los elementos.
    *   Estiliza el `body` con un fondo negro (`#000`) y usa Flexbox para centrar el `#game-container` vertical y horizontalmente.
    *   Estiliza `#game-container` para que sea el referente del layout.
    *   Estiliza el `#gameCanvas` para que sea responsivo:
        *   `width: 100%;`
        *   `max-width: 500px;` (o un tamaño que prefieras para el juego).
        *   `aspect-ratio: 19 / 22;` (relación de aspecto típica de un tablero de Pac-Man vertical).
        *   `background-color: #111;`
        *   `border: 2px solid yellow;`

4.  **`game.js`:**
    *   Añade un listener para `DOMContentLoaded` para asegurarte de que el DOM está cargado antes de ejecutar cualquier código.
    *   Dentro del listener, obtén la referencia al canvas y a su contexto 2D.
    *   Añade un `console.log("Juego listo para empezar.");` para confirmar que todo está enlazado correctamente.

---

### **Prompt 2: La Clase `Game` - El Orquestador Principal**

#### Rol:
Eres un arquitecto de software y programador de juegos, experto en el diseño de sistemas de juego modulares y eficientes utilizando JavaScript y Programación Orientada a Objetos.

#### Tarea:
Crea la clase principal `Game` que actuará como el motor central de nuestro juego. Esta clase se encargará de inicializar el juego, gestionar el estado y ejecutar el bucle principal (`game loop`).

#### Contexto:
Ya tenemos la estructura HTML/CSS. Ahora necesitamos el corazón del juego. La clase `Game` orquestará todas las demás partes (mapa, jugador, fantasmas) y contendrá el bucle de juego que actualiza la lógica y dibuja el estado en el canvas a cada fotograma.

#### Requisitos:
1.  **Crea la clase `Game` en `game.js`.**
2.  **Constructor (`constructor`):**
    *   Debe aceptar el `canvas` como parámetro.
    *   Debe almacenar el `canvas`, el contexto `ctx`, el `width` y el `height`.
    *   Inicializa propiedades para los componentes del juego que crearemos más adelante: `this.map = null;`, `this.player = null;`, `this.ghosts = [];`.
    *   Inicializa propiedades de estado: `this.score = 0;`, `this.lives = 3;`.
    *   Define el `tileSize`, que será el tamaño de cada celda del laberinto (ej. `this.tileSize = canvas.width / 19;`).
3.  **Método `start()`:**
    *   Este método inicializará los objetos del juego (más adelante llamará a `new Map()`, `new Player()`, etc.).
    *   Por ahora, solo debe llamar al método `gameLoop()`.
4.  **Método `gameLoop()`:**
    *   Este método será el corazón del juego, ejecutándose continuamente.
    *   Utiliza `requestAnimationFrame(this.gameLoop.bind(this))` para crear un bucle de animación eficiente.
    *   Dentro del bucle, llama a dos métodos: `this.update()` y `this.draw()`.
5.  **Método `update()`:**
    *   Este método contendrá toda la lógica de actualización del juego.
    *   Por ahora, déjalo vacío. Más adelante, llamará a los métodos `update()` del jugador y los fantasmas.
6.  **Método `draw()`:**
    *   Este método se encargará de dibujar todo en el canvas.
    *   Empieza con `this.ctx.clearRect(0, 0, this.width, this.height)` para limpiar el canvas en cada fotograma.
    *   Por ahora, déjalo vacío. Más adelante, llamará a los métodos `draw()` del mapa, jugador y fantasmas.
7.  **Instanciación:**
    *   Fuera de la clase, dentro del listener `DOMContentLoaded`, crea una instancia de la clase `Game`: `const game = new Game(gameCanvas);`.
    *   Llama a `game.start();` para iniciar el juego.

---

*Nota: Continúa con los siguientes prompts en el mismo chat con el agente de IA para que mantenga el contexto de las clases ya creadas.*

### **Prompt 3: La Clase `Map` - Diseño de Niveles**

#### Rol:
Eres un diseñador de niveles y programador de juegos, especializado en la creación de entornos de juego basados en baldosas (tiles).

#### Tarea:
Crea una clase `Map` que se encargue de definir, cargar y dibujar los laberintos del juego. El sistema debe soportar múltiples niveles.

#### Contexto:
Necesitamos un mundo para que Pac-Man se mueva. La clase `Map` encapsulará toda la lógica del laberinto, incluyendo las paredes, las píldoras (pellets) y los power-ups. La clase `Game` utilizará una instancia de `Map`.

#### Requisitos:
1.  **Crea la clase `Map` en un nuevo archivo `Map.js` y enlázalo en `index.html` ANTES de `game.js`.**
2.  **Constructor (`constructor`):**
    *   Acepta un parámetro `tileSize`.
    *   Inicializa `this.tileSize = tileSize;`.
    *   Define una propiedad `this.levels` como un array que contendrá las matrices de los 5 niveles.
    *   Define `this.currentMap` para almacenar la matriz del nivel actual.
3.  **Datos de Niveles:**
    *   Dentro del constructor, define 5 matrices 2D para `this.levels`. Usa números para representar los elementos:
        *   `0`: Píldora (pellet)
        *   `1`: Muro
        *   `4`: Power-up (píldora grande)
        *   `5`: Espacio vacío (donde empiezan los fantasmas o Pac-Man)
    *   Crea un primer laberinto simple de 22x19 para `this.levels[0]`. Puedes usar el siguiente como ejemplo:
    ```javascript
    // Dentro del constructor de Map
    this.levels = [
      [ // Nivel 1
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,4,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,4,1],
        [1,0,1,1,0,1,1,1,0,1,0,1,1,1,0,1,1,0,1],
        [1,0,1,1,0,1,1,1,0,1,0,1,1,1,0,1,1,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,1,1,0,1,0,1,1,1,1,1,0,1,0,1,1,0,1],
        [1,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,1],
        [1,1,1,1,0,1,1,1,5,1,5,1,1,1,0,1,1,1,1],
        [1,1,1,1,0,1,5,5,5,5,5,5,5,1,0,1,1,1,1],
        [1,1,1,1,0,1,5,1,1,5,1,1,5,1,0,1,1,1,1],
        [0,0,0,0,0,5,5,1,5,5,5,1,5,5,0,0,0,0,0], // Zona de túnel
        [1,1,1,1,0,1,5,1,1,1,1,1,5,1,0,1,1,1,1],
        [1,1,1,1,0,1,5,5,5,5,5,5,5,1,0,1,1,1,1],
        [1,1,1,1,0,1,5,1,1,1,1,1,5,1,0,1,1,1,1],
        [1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1],
        [1,0,1,1,0,1,1,1,0,1,0,1,1,1,0,1,1,0,1],
        [1,0,0,1,0,0,0,0,0,5,0,0,0,0,0,1,0,0,1],
        [1,1,0,1,0,1,0,1,1,1,1,1,0,1,0,1,0,1,1],
        [1,4,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,4,1],
        [1,0,1,1,1,1,1,1,0,1,0,1,1,1,1,1,1,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      ]
      // ... (deja placeholders para los otros 4 niveles)
    ];
    ```
4.  **Método `loadLevel(levelNumber)`:**
    *   Acepta un número de nivel (0-4).
    *   Copia el mapa correspondiente de `this.levels` a `this.currentMap` usando `JSON.parse(JSON.stringify(...))` para evitar la mutación del original.
5.  **Método `draw(ctx)`:**
    *   Itera sobre la matriz `this.currentMap` (fila por fila, columna por columna).
    *   Usa un `switch` o `if/else if` para dibujar cada celda según su valor:
        *   **Muro (1):** Dibuja un rectángulo azul. `ctx.fillStyle = 'blue'; ctx.fillRect(col * this.tileSize, row * this.tileSize, this.tileSize, this.tileSize);`
        *   **Píldora (0):** Dibuja un pequeño círculo amarillo en el centro de la celda.
        *   **Power-up (4):** Dibuja un círculo amarillo más grande y parpadeante.
6.  **Métodos de Ayuda:**
    *   Crea un método `isWall(row, col)` que devuelva `true` si la celda en `this.currentMap[row][col]` es un muro (1), y `false` en caso contrario.
    *   Crea un método `getTile(row, col)` que devuelva el valor de la celda.
7.  **Integración con la Clase `Game`:**
    *   En `Game.js`, importa la clase `Map`.
    *   En el constructor de `Game`, inicializa el mapa: `this.map = new Map(this.tileSize);`.
    *   En el método `start()` de `Game`, llama a `this.map.loadLevel(0);` para cargar el primer nivel.
    *   En el método `draw()` de `Game`, llama a `this.map.draw(this.ctx);`.

---

### **Prompt 4: La Clase `Player` (Pac-Man)**

#### Rol:
Eres un programador de juegos experto en el desarrollo de personajes de jugador (Player-Characters). Tu especialidad es crear clases de personajes que encapsulan su estado, renderizado y lógica de movimiento.

#### Tarea:
Crea la clase `Player` que representará a Pac-Man. Esta clase manejará su posición, velocidad, dirección, animación y el dibujo de su sprite en el canvas.

#### Contexto:
Ya tenemos un motor de juego (`Game`) y un mapa (`Map`). Ahora necesitamos al actor principal. La clase `Player` debe ser instanciada por `Game` y debe saber cómo dibujarse a sí misma en el canvas usando una imagen (sprite).

#### Requisitos:
1.  **Crea un nuevo archivo `Player.js` y enlázalo en `index.html`** (después de `Map.js` y antes de `game.js`).
2.  **Crea la clase `Player`.**
3.  **Constructor (`constructor`):**
    *   Debe aceptar como parámetros `x`, `y`, `tileSize`, `velocity` y `map`. Esto permite a la clase `Game` posicionar al jugador y darle acceso al mapa para futuras colisiones.
    *   Almacena estas propiedades: `this.x`, `this.y`, `this.tileSize`, `this.velocity`, `this.map`.
    *   Define las propiedades de dirección: `this.currentDirection = null;` y `this.requestedDirection = null;`. La separación es clave para un movimiento fluido (Pac-Man solo cambia de dirección en una intersección).
    *   Configura la carga de la imagen del jugador:
        *   Crea una propiedad `this.pacmanImages = [];`
        *   Crea `this.pacmanImageIndex = 0;` para la animación.
        *   Crea `this.pacmanAnimationTimer = 10;` (un contador para controlar la velocidad de la animación).
        *   Carga las imágenes del sprite. Asumiremos un spritesheet simple con la boca abierta y cerrada. Si tienes una sola imagen, puedes omitir la animación por ahora.
        ```javascript
        // Ejemplo de carga de imágenes (puedes adaptarlo a tus sprites)
        const pacmanImage1 = new Image();
        pacmanImage1.src = 'assets/pacman_open.png'; // boca abierta
        const pacmanImage2 = new Image();
        pacmanImage2.src = 'assets/pacman_closed.png'; // boca cerrada

        this.pacmanImages.push(pacmanImage1, pacmanImage2);
        ```
4.  **Método `draw(ctx)`:**
    *   Este método dibujará a Pac-Man en el canvas.
    *   Llama a un método `_animate()` al principio del `draw()` para actualizar la imagen que se debe mostrar.
    *   Dibuja la imagen actual (`this.pacmanImages[this.pacmanImageIndex]`) en la posición `this.x`, `this.y` con el tamaño `this.tileSize`.
5.  **Método Privado `_animate()`:**
    *   Decrementa `this.pacmanAnimationTimer`.
    *   Cuando el temporizador llega a 0, cambia `this.pacmanImageIndex` para alternar entre las imágenes del array.
    *   Reinicia el temporizador.
6.  **Integración con la Clase `Game`:**
    *   En `Game.js`, importa la clase `Player`.
    *   En el constructor de `Game`, inicializa `this.player = null;`.
    *   En el método `start()` de `Game` (después de cargar el mapa), encuentra la posición inicial de Pac-Man en el mapa (puedes usar un número específico como `6` para el "spawn point" si quieres, o simplemente colocarlo en una coordenada fija).
    *   Crea la instancia del jugador: `this.player = new Player(x, y, this.tileSize, velocity, this.map);`. `velocity` puede ser un valor como `1` o `2`.
    *   En el método `draw()` de `Game`, llama a `this.player.draw(this.ctx);`.
    *   En el método `update()` de `Game`, llama a `this.player.update();` (lo crearemos en el siguiente prompt). Por ahora, puedes crear un método `update()` vacío en `Player.js`.

---

### **Prompt 5: Controles de Teclado y Colisión con Muros**

#### Rol:
Eres un programador de gameplay especializado en la física del jugador y la interacción con el entorno. Tu fuerte es implementar controles responsivos y una detección de colisiones precisa.

#### Tarea:
Implementa el movimiento de Pac-Man controlado por las teclas de flecha y asegúrate de que no pueda atravesar los muros del laberinto.

#### Contexto:
Nuestro `Player` ya existe y se dibuja, pero está estático. Necesitamos capturar la entrada del teclado, traducirla en un intento de movimiento (`requestedDirection`), y luego, en el `update` del jugador, procesar ese movimiento solo si no resulta en una colisión con un muro.

#### Requisitos:
1.  **Captura de Teclado (en `Game.js`):**
    *   Crea un método `_setupInput()` en la clase `Game`.
    *   Dentro de este método, añade un `event listener` al `document` para el evento `keydown`.
    *   En el callback del listener, usa un `switch` para las `event.key`: "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight".
    *   Cuando se presiona una tecla de flecha, actualiza la propiedad `requestedDirection` del jugador: `this.player.requestedDirection = event.key;`.
    *   Llama a `this._setupInput()` desde el constructor de `Game`.
2.  **Lógica de Movimiento (en `Player.js`):**
    *   Crea el método `update()` en la clase `Player`. Este método se ejecutará en cada fotograma.
    *   Dentro de `update()`, implementa la lógica principal de movimiento:
        a.  Primero, llama a un método `_handleInput()` que determinará si el `requestedDirection` es válido.
        b.  Luego, llama a un método `_move()` que actualizará las coordenadas `x` e `y` del jugador.
3.  **Método Privado `_handleInput()` (en `Player.js`):**
    *   Este método comprueba si el `requestedDirection` solicitado puede ejecutarse.
    *   Si no hay una dirección solicitada (`requestedDirection` es `null`), no hace nada.
    *   Si la dirección solicitada no choca con un muro, actualiza `this.currentDirection = this.requestedDirection;`.
    *   Para hacer esto, necesitarás un método de ayuda para la detección de colisiones.
4.  **Método de Detección de Colisión (en `Player.js`):**
    *   Crea un método `_isCollidingWithWall(direction)`.
    *   Este método debe calcular cuál sería la próxima posición del jugador (`nextRow`, `nextCol`) si se moviera en la `direction` dada.
    *   Usa el método `this.map.isWall(nextRow, nextCol)` que creamos en el Prompt 3 para verificar si esa próxima celda es un muro.
    *   **Importante:** La colisión debe ser precisa. El jugador solo puede cambiar de dirección cuando está alineado con la cuadrícula del `tileSize`. Puedes comprobar esto con el operador módulo: `this.x % this.tileSize === 0` y `this.y % this.tileSize === 0`. El `requestedDirection` solo debe convertirse en `currentDirection` cuando esta condición se cumpla Y la nueva dirección no sea un muro.
5.  **Método Privado `_move()` (en `Player.js`):**
    *   Este método actualiza las coordenadas `x` e `y` basándose en `this.currentDirection`.
    *   Antes de mover, vuelve a comprobar si el movimiento es válido (no choca con un muro en la dirección actual). Esto evita que el jugador se quede atascado en una pared si el tamaño del paso (`velocity`) es mayor que 1.
    *   Usa un `switch` para `this.currentDirection` ("ArrowUp", "ArrowDown", etc.) y ajusta `this.y -= this.velocity;`, `this.y += this.velocity;`, etc.
6.  **Integración con `Game.js`:**
    *   Asegúrate de que `game.player.update();` se está llamando dentro del `gameLoop` de la clase `Game`.

---

### **Prompt 6: Mecánica de Puntuación y Avance de Nivel**

#### Rol:
Eres un desarrollador de sistemas de juego, experto en implementar mecánicas de progresión, puntuación y condiciones de victoria.

#### Tarea:
Implementa la lógica para que Pac-Man coma las píldoras (pellets) y los power-ups. Al comer, la puntuación debe aumentar. Cuando todas las píldoras de un nivel se han comido, el juego debe avanzar al siguiente nivel.

#### Contexto:
El jugador ya se mueve por el laberinto. El siguiente paso lógico es permitirle interactuar con los objetos del mapa. Esta mecánica es fundamental para el bucle de juego: comer para ganar.

#### Requisitos:
1.  **Detección de "Comer" (en `Player.js`, método `update`):**
    *   Dentro del método `update()` del jugador, después de que se ha movido, determina en qué celda (`row`, `col`) se encuentra actualmente el centro del jugador.
    *   Usa `Math.floor((this.y + this.tileSize / 2) / this.tileSize)` para `row` y una fórmula similar para `col`.
    *   Llama al método `this.map.getTile(row, col)` para ver qué hay en esa celda.
2.  **Procesamiento de Píldoras (en `Player.js`):**
    *   Si el `tile` es una píldora (`0`):
        *   Llama a un método en la clase `Game` para incrementar la puntuación (ej. `this.game.addScore(10)`). Necesitarás pasar la instancia de `Game` al constructor de `Player`.
        *   Llama a un método en la clase `Map` para eliminar la píldora de esa celda, cambiándola a un espacio vacío (`5`). Ej: `this.map.eatPellet(row, col);`.
    *   Si el `tile` es un power-up (`4`):
        *   Llama a `this.game.addScore(50)`.
        *   Llama a `this.map.eatPellet(row, col);`.
        *   Llama a un método en la clase `Game` para activar el modo "Frightened" de los fantasmas (ej. `this.game.activateFrightenedMode();`). Crearemos este método más adelante, pero prepara la llamada.
3.  **Modificaciones en `Map.js`:**
    *   Crea el método `eatPellet(row, col)` que simplemente cambia `this.currentMap[row][col] = 5;`.
    *   Añade una propiedad `this.pelletCount` al constructor.
    *   En el método `loadLevel()`, después de cargar el mapa, itera sobre él y cuenta cuántas píldoras (`0`) y power-ups (`4`) hay, almacenando el total en `this.pelletCount`.
    *   Cada vez que `eatPellet` es llamado, decrementa `this.pelletCount`.
4.  **Modificaciones en `Game.js`:**
    *   Pasa `this` (la instancia de `Game`) al constructor de `Player` cuando lo creas.
    *   Crea el método `addScore(points)` que simplemente hace `this.score += points;`.
    *   Crea un método vacío por ahora: `activateFrightenedMode() { console.log("Fantasmas asustados!"); }`.
5.  **Condición de Victoria de Nivel (en `Game.js`, método `update`):**
    *   En el `update()` de `Game`, comprueba si `this.map.pelletCount === 0`.
    *   Si es `true`, el nivel está completado.
    *   Implementa la lógica para pasar al siguiente nivel:
        *   Incrementa un contador de nivel `this.currentLevel++`.
        *   Comprueba si `this.currentLevel` es menor que el número total de niveles.
        *   Si hay más niveles, llama a un método `_nextLevel()`.
        *   Si no, activa un estado de "victoria del juego".
6.  **Método `_nextLevel()` (en `Game.js`):**
    *   Este método debe resetear el estado para el nuevo nivel.
    *   Llama a `this.map.loadLevel(this.currentLevel)`.
    *   Reposiciona al jugador y a los fantasmas a sus posiciones iniciales para ese nivel. (Por ahora, solo reposiciona al jugador).

---

### **Prompt 7: La Clase `Ghost` - Estructura Básica**

#### Rol:
Eres un programador de IA para videojuegos, especializado en la creación de agentes no jugadores (NPCs). Tu tarea es diseñar una clase `Ghost` robusta y flexible que sirva como base para todos los fantasmas del juego.

#### Tarea:
Crea la clase `Ghost`. Esta clase manejará el estado individual de cada fantasma, incluyendo su posición, velocidad, estado actual (Chase, Scatter, Frightened) y el renderizado de su sprite.

#### Contexto:
Nuestro juego necesita adversarios. La clase `Ghost` será la plantilla para los cuatro fantasmas. Cada instancia de `Ghost` tendrá su propia personalidad, que definiremos más adelante, pero compartirán una estructura y capacidades comunes. La clase `Game` se encargará de crear y gestionar un array de estos fantasmas.

#### Requisitos:
1.  **Crea un nuevo archivo `Ghost.js` y enlázalo en `index.html`** (antes de `game.js`).
2.  **Crea la clase `Ghost`.**
3.  **Constructor (`constructor`):**
    *   Debe aceptar como parámetros `x`, `y`, `tileSize`, `velocity`, `map` y, opcionalmente, un `color` o `id` para diferenciarlo.
    *   Almacena estas propiedades: `this.x`, `this.y`, `this.tileSize`, `this.velocity`, `this.map`.
    *   Define los estados del fantasma usando un `enum` o constantes. Esto es crucial para la IA:
        ```javascript
        this.states = {
          CHASE: 'chase',
          SCATTER: 'scatter',
          FRIGHTENED: 'frightened',
        };
        this.currentState = this.states.SCATTER; // Los fantasmas suelen empezar dispersándose
        ```
    *   Define una dirección de movimiento: `this.direction = null;`.
    *   Prepara la carga de imágenes:
        *   `this.image = new Image();`
        *   `this.image.src = 'assets/ghost.png';` // Imagen base del fantasma
        *   `this.frightenedImage = new Image();`
        *   `this.frightenedImage.src = 'assets/ghost_frightened.png';` // Imagen para el modo asustado
4.  **Método `draw(ctx)`:**
    *   Dibuja el sprite del fantasma en el canvas en su posición `x`, `y`.
    *   La imagen a dibujar dependerá de `this.currentState`:
        *   Si `this.currentState === this.states.FRIGHTENED`, dibuja `this.frightenedImage`.
        *   En otro caso, dibuja `this.image` normal. Puedes añadir lógica para cambiar el color del fantasma si tienes diferentes sprites por color.
5.  **Método `update()`:**
    *   Este método contendrá la lógica principal del fantasma. Por ahora, déjalo vacío. En los siguientes prompts, lo llenaremos con la lógica de navegación y toma de decisiones.
6.  **Integración con la Clase `Game`:**
    *   En `Game.js`, importa la clase `Ghost`.
    *   En el constructor de `Game`, inicializa `this.ghosts = [];`.
    *   En el método `start()` de `Game`, después de crear al jugador, crea las instancias de los fantasmas y guárdalas en `this.ghosts`. Deberás definir sus posiciones iniciales (normalmente en la "casa de fantasmas" en el centro del mapa).
        ```javascript
        // Ejemplo en Game.start()
        const ghostPositions = [
          { x: 9 * this.tileSize, y: 8 * this.tileSize }, // Ajusta estas coordenadas a tu mapa
          { x: 9 * this.tileSize, y: 10 * this.tileSize },
          // ... dos más
        ];
        this.ghosts = ghostPositions.map(pos => new Ghost(pos.x, pos.y, this.tileSize, this.velocity, this.map));
        ```
    *   En el método `draw()` de `Game`, itera sobre `this.ghosts` y llama al método `draw(this.ctx)` de cada fantasma.
    *   En el método `update()` de `Game`, itera sobre `this.ghosts` y llama al método `update()` de cada fantasma.

---

### **Prompt 8: Navegación Inteligente de Fantasmas**

#### Rol:
Eres un programador de IA especializado en `pathfinding` (búsqueda de caminos) y movimiento de agentes en entornos basados en cuadrículas.

#### Tarea:
Implementa la lógica de movimiento fundamental para los fantasmas. Deben ser capaces de navegar por el laberinto sin atravesar paredes y tomar decisiones en las intersecciones.

#### Contexto:
Un fantasma estático no es una amenaza. Necesitamos que se muevan de forma autónoma. El núcleo de su movimiento es la habilidad de detectar intersecciones y elegir una nueva dirección válida. Esta lógica será la base sobre la que construiremos los comportamientos de `Chase` y `Scatter`.

#### Requisitos:
1.  **Modifica el método `update()` en `Ghost.js`:**
    *   Este método ahora llamará a dos funciones principales: `_decideNextMove()` y `_move()`.
2.  **Crea el método `_move()` (en `Ghost.js`):**
    *   Este método es simple: actualiza las coordenadas `x` e `y` del fantasma basándose en `this.direction` y `this.velocity`.
    *   Es idéntico a la lógica de movimiento del jugador, pero usando la dirección del fantasma.
3.  **Crea el método `_decideNextMove()` (en `Ghost.js`):**
    *   Esta es la parte clave. Se ejecuta solo cuando el fantasma está perfectamente alineado en una celda (`this.x % this.tileSize === 0` y `this.y % this.tileSize === 0`).
    *   **Paso 1: Identificar Opciones:**
        *   Calcula la posición actual del fantasma en la cuadrícula (`row`, `col`).
        *   Llama a un nuevo método de ayuda `_getValidDirections(row, col)` que devuelve un array de las direcciones posibles a las que el fantasma puede moverse desde su celda actual (arriba, abajo, izquierda, derecha) sin chocar contra un muro.
        *   Importante: **Un fantasma no puede dar media vuelta y retroceder por donde vino**, a menos que no tenga otra opción (callejón sin salida). Excluye la dirección opuesta a `this.direction` de las opciones válidas.
    *   **Paso 2: Tomar una Decisión:**
        *   Si solo hay una dirección válida, el fantasma debe tomarla.
        *   Si hay múltiples direcciones (es una intersección), por ahora, implementa una lógica simple: **elige una dirección al azar** de las opciones válidas.
        *   Actualiza `this.direction` con la dirección elegida.
4.  **Crea el método de ayuda `_getValidDirections(row, col)` (en `Ghost.js`):**
    *   Este método comprobará las cuatro direcciones cardinales.
    *   Para cada dirección, usa `this.map.isWall()` para verificar si la celda adyacente es un muro.
    *   Devuelve un array de strings con las direcciones válidas (ej. `['ArrowUp', 'ArrowLeft']`).
5.  **Manejo del Túnel (Teletransporte):**
    *   En el método `_move()`, añade una comprobación para el túnel lateral. Si el fantasma sale por un lado del canvas (ej. `this.x < 0`), debe aparecer en el lado opuesto (`this.x = this.map.width * this.tileSize`). Haz lo mismo para la dirección contraria.

---

### **Prompt 9: IA de Fantasmas - Modos `Chase` y `Scatter`**

#### Rol:
Eres un diseñador y programador de IA de élite, famoso por replicar y mejorar comportamientos clásicos de enemigos de videojuegos. Tu especialidad es la IA basada en estados finitos (Finite State Machines).

#### Tarea:
Implementa los comportamientos `Chase` (Persecución) y `Scatter` (Dispersión) para los fantasmas, replicando la famosa IA de Pac-Man. Cada fantasma debe tener un "objetivo" diferente dependiendo de su estado actual.

#### Contexto:
Hemos logrado que los fantasmas se muevan. Ahora, vamos a darles un propósito. En el Pac-Man original, los fantasmas no solo persiguen a Pac-Man, sino que alternan entre perseguirlo (`Chase`) y retirarse a sus "esquinas" designadas (`Scatter`). Esto crea un ritmo de juego de tensión y alivio.

#### Requisitos:
1.  **Gestión de Estados en `Game.js`:**
    *   Necesitamos un temporizador para alternar entre `Chase` y `Scatter`. En el constructor de `Game`, añade:
        ```javascript
        this.ghostModeTimer = 0;
        this.scatterDuration = 7000; // 7 segundos en modo Scatter
        this.chaseDuration = 20000; // 20 segundos en modo Chase
        this.currentGhostMode = 'scatter';
        ```
    *   En el `update()` de `Game`, implementa un temporizador que, cuando llega a su fin, cambia el modo de los fantasmas y reinicia el temporizador para la siguiente fase.
        ```javascript
        // En Game.update()
        this.ghostModeTimer += 16; // Asumiendo 60 FPS, aprox. 16ms por frame
        if (this.currentGhostMode === 'scatter' && this.ghostModeTimer >= this.scatterDuration) {
          this.changeGhostMode('chase');
        } else if (this.currentGhostMode === 'chase' && this.ghostModeTimer >= this.chaseDuration) {
          this.changeGhostMode('scatter');
        }
        ```
    *   Crea el método `changeGhostMode(mode)` en `Game` que cambia `this.currentGhostMode`, reinicia `this.ghostModeTimer` y lo más importante: **itera sobre `this.ghosts` y llama a un nuevo método `ghost.setMode(mode)` en cada uno.**
2.  **Modificaciones en `Ghost.js`:**
    *   Añade la propiedad `this.targetTile = {x: 0, y: 0};` al constructor del fantasma. Este es el objetivo que el fantasma intentará alcanzar.
    *   Añade una propiedad `this.scatterTarget` que será la esquina personal del fantasma (ej. `{x: 0, y: 0}` para la esquina superior izquierda). Pasa esta coordenada como parámetro al constructor del fantasma para que cada uno tenga una esquina diferente.
    *   Crea el método `setMode(mode)` que actualiza `this.currentState` y, crucialmente, **hace que el fantasma invierta su dirección actual** la primera vez que cambia de modo. Esto es un detalle clásico de Pac-Man.
3.  **Lógica de Decisión Basada en Objetivo (en `Ghost.js`):**
    *   **Reemplaza la lógica aleatoria en `_decideNextMove()`**. En lugar de elegir una dirección al azar en una intersección, el fantasma ahora elegirá la dirección que lo acerque más a su `targetTile`.
    *   Dentro de `_decideNextMove()`, primero, actualiza el `targetTile` llamando a un nuevo método `_updateTargetTile()`.
    *   Luego, para cada dirección válida en la intersección:
        *   Calcula la celda a la que llevaría esa dirección.
        *   Calcula la distancia euclidiana (o de Manhattan) desde esa celda hasta `this.targetTile`.
        *   Elige la dirección que resulte en la menor distancia.
4.  **Crea el método `_updateTargetTile()` (en `Ghost.js`):**
    *   Este método establece el objetivo según el estado actual:
    *   `if (this.currentState === this.states.SCATTER)`: `this.targetTile = this.scatterTarget;`
    *   `if (this.currentState === this.states.CHASE)`:
        *   Aquí es donde reside la "personalidad" del fantasma. Por ahora, implementa la más simple: **el objetivo es la posición actual del jugador.**
        *   `this.targetTile = { x: player.x, y: player.y };` (necesitarás pasar la instancia del jugador al constructor del fantasma).
    *   `if (this.currentState === this.states.FRIGHTENED)`: El objetivo es un punto aleatorio en el mapa (lo implementaremos mejor en el siguiente prompt).
5.  **Integración Final:**
    *   En `Game.js`, cuando crees los fantasmas, pasa `this.player` a su constructor y una coordenada de esquina única para cada uno.

---

### **Prompt 10: IA de Fantasmas - Modo `Frightened` e Interacciones**

#### Rol:
Eres un programador de gameplay experto en la creación de mecánicas de poder y cambio de roles entre el jugador y los enemigos. Tu especialidad es gestionar estados temporales y sus consecuencias en el juego.

#### Tarea:
Implementa el modo `Frightened` (asustado) para los fantasmas. Cuando Pac-Man come un power-up, los fantasmas deben volverse azules, huir de Pac-Man y poder ser comidos por él para obtener puntos extra.

#### Contexto:
Esta mecánica es la que le da a Pac-Man la capacidad de contraatacar, creando una dinámica de poder que cambia constantemente. Ya tenemos el esqueleto de los estados (`Chase`, `Scatter`), ahora completaremos el ciclo con `Frightened`.

#### Requisitos:
1.  **Activación del Modo `Frightened` (en `Game.js`):**
    *   Ya creamos el método `activateFrightenedMode()` en un prompt anterior. Ahora vamos a darle cuerpo.
    *   Este método debe hacer lo siguiente:
        *   Establecer un temporizador para la duración del modo `Frightened`. Añade `this.frightenedModeTimer = 0;` y `this.frightenedDuration = 10000;` (10 segundos) al constructor de `Game`.
        *   Iterar sobre todos los fantasmas (`this.ghosts`) y llamar a un nuevo método en cada uno: `ghost.enterFrightenedMode()`.
2.  **Lógica del Modo `Frightened` (en `Ghost.js`):**
    *   Crea el método `enterFrightenedMode()`.
    *   Este método debe:
        *   Cambiar `this.currentState = this.states.FRIGHTENED;`.
        *   Invertir la dirección actual del fantasma para que inmediatamente se aleje.
3.  **Comportamiento de Huida (en `Ghost.js`, método `_updateTargetTile`):**
    *   Añade la lógica para el estado `FRIGHTENED`.
    *   Cuando el fantasma está asustado, su "objetivo" cambia. En lugar de buscar un punto, debe huir. Una forma sencilla y efectiva de lograrlo es que **su lógica de decisión en `_decideNextMove` elija la dirección que lo *aleje* más del jugador**, en lugar de la que lo acerque.
    *   Modifica la lógica en `_decideNextMove`:
        *   `if (this.currentState === this.states.FRIGHTENED)`: en la intersección, calcula la distancia a Pac-Man para cada opción de movimiento y elige la que maximice la distancia.
        *   Otra opción más simple: elige una dirección válida al azar. Esto también simula un comportamiento de pánico. Implementa esta segunda opción por simplicidad inicial.
4.  **Gestión del Tiempo y Retorno a la Normalidad (en `Game.js`):**
    *   En el `update()` de `Game`, si el modo `Frightened` está activo, incrementa `this.frightenedModeTimer`.
    *   Cuando `this.frightenedModeTimer` supere `this.frightenedDuration`:
        *   Llama a un nuevo método `deactivateFrightenedMode()`.
        *   Este método debe iterar sobre los fantasmas y llamar a `ghost.exitFrightenedMode()`, que los devolverá a su estado anterior (`Chase` o `Scatter`, dependiendo de en qué modo global se encuentre el juego).
5.  **Interacción de "Comer Fantasma" (en `Game.js`, método `update`):**
    *   En el `update()` de `Game`, añade una nueva sección para comprobar colisiones entre el jugador y los fantasmas.
    *   Itera sobre `this.ghosts`:
        *   Comprueba si el rectángulo del jugador (`this.player`) se solapa con el del fantasma. Una simple comprobación de distancia entre centros es suficiente: `if (distancia < this.tileSize / 2)`.
        *   Si hay colisión, comprueba el estado del fantasma:
            *   **Si `ghost.currentState === ghost.states.FRIGHTENED`:**
                *   El jugador come al fantasma.
                *   Aumenta la puntuación (`this.addScore(200)`).
                *   El fantasma debe "morir" y volver a la casa de fantasmas. Crea un método `ghost.die()` que lo reposicione en su punto de inicio y lo ponga en modo `Chase` o `Scatter` (no `FRIGHTENED`).
            *   **Si el fantasma NO está asustado:**
                *   El jugador muere. Lo implementaremos en el siguiente prompt.

---

### **Prompt 11: Gestión de Vidas y Estados de Juego (Game Over)**

#### Rol:
Eres un desarrollador de sistemas de juego especializado en la gestión del flujo del juego, incluyendo vidas, muerte del jugador, y las pantallas de "Game Over" y "Victoria".

#### Tarea:
Implementa el sistema de vidas de Pac-Man. El jugador debe perder una vida al chocar con un fantasma no asustado. Cuando las vidas llegan a cero, el juego debe terminar mostrando un mensaje de "Game Over".

#### Contexto:
El juego ya tiene riesgo y recompensa (comer fantasmas), pero falta la consecuencia final del fracaso. Este prompt introduce la penalización por ser atrapado, completando el núcleo del bucle de juego.

#### Requisitos:
1.  **Lógica de Muerte del Jugador (en `Game.js`):**
    *   En la sección de colisión jugador-fantasma del prompt anterior, implementa la lógica para cuando el fantasma **no** está asustado.
    *   Si hay colisión:
        *   Llama a un nuevo método `this.playerDied()`.
2.  **Crea el método `playerDied()` (en `Game.js`):**
    *   Este método se encarga del proceso de perder una vida.
    *   Resta uno a `this.lives`.
    *   Comprueba si `this.lives > 0`:
        *   Si es así, el juego continúa. Resetea la posición del jugador y los fantasmas a sus puntos de inicio para el nivel actual. Puedes crear un método `_resetLevelState()` para esto. Dale al jugador un par de segundos de invencibilidad para que no muera instantáneamente al reaparecer.
    *   Comprueba si `this.lives === 0`:
        *   Si es así, el juego ha terminado. Llama a un método `this.gameOver()`.
3.  **Estado de "Game Over" (en `Game.js`):**
    *   Crea una propiedad `this.isGameOver = false;` en el constructor.
    *   Crea el método `gameOver()`.
    *   Este método debe poner `this.isGameOver = true;`.
    *   En el `gameLoop` de `Game`, añade una condición al principio: `if (this.isGameOver) { return; }`. Esto detendrá toda la lógica de `update` y `draw` del juego, congelando la pantalla. (Mejoraremos el dibujo en el siguiente prompt).
4.  **Estado de "Victoria" (en `Game.js`):**
    *   Similar al Game Over, crea `this.didWin = false;`.
    *   En el `update` de `Game`, cuando el jugador completa el último nivel (del prompt #6), en lugar de intentar cargar un nivel que no existe, llama a un método `this.gameWon()`.
    *   El método `gameWon()` pondrá `this.didWin = true;`.
    *   También puedes congelar el juego de la misma manera.
5.  **Reinicio del Juego:**
    *   Añade un event listener en `_setupInput()` para la tecla 'Enter' o 'Space'.
    *   Si `this.isGameOver` o `this.didWin` es `true`, y el jugador presiona esta tecla, el juego debe reiniciarse por completo.
    *   Crea un método `resetGame()` que reinicialice todas las propiedades (`score`, `lives`, `currentLevel`, etc.) a sus valores iniciales y llame a `this.start()` de nuevo.

---

### **Prompt 12: Dibujo de la Interfaz (UI)**

#### Rol:
Eres un desarrollador front-end con un ojo para el diseño de interfaces de usuario (UI) en el contexto de videojuegos. Tu trabajo es comunicar información vital al jugador de forma clara y estilizada usando el API de Canvas.

#### Tarea:
Dibuja todos los elementos de la interfaz de usuario directamente en el canvas: la puntuación, las vidas restantes y los mensajes de estado del juego ("Ready!", "Game Over", "You Win!").

#### Contexto:
El jugador necesita feedback visual constante sobre su progreso y estado. En lugar de usar elementos HTML, dibujaremos la UI en el canvas para mantener todo unificado.

#### Requisitos:
1.  **Crea un método `_drawUI(ctx)` en `Game.js`.**
    *   Llama a este método al final del método `draw()` principal de `Game`, para que la UI se dibuje encima de todo lo demás.
2.  **Dibujo de la Puntuación:**
    *   Dentro de `_drawUI()`, usa `ctx.fillStyle`, `ctx.font` y `ctx.fillText()` para dibujar la puntuación.
    *   Ejemplo: `ctx.fillStyle = 'white'; ctx.font = '20px "Press Start 2P"'; ctx.fillText('Score: ' + this.score, 10, this.canvas.height - 10);`.
    *   (Opcional: puedes añadir una fuente de estilo retro como "Press Start 2P" desde Google Fonts en tu `index.html` y `style.css`).
3.  **Dibujo de las Vidas:**
    *   Dibuja las vidas restantes. En lugar de un número, una forma clásica es dibujar pequeños sprites de Pac-Man.
    *   En `_drawUI()`, crea un bucle que se ejecute `this.lives - 1` veces.
    *   En cada iteración, dibuja una pequeña imagen de Pac-Man en la esquina inferior derecha del canvas.
4.  **Dibujo de Mensajes de Estado:**
    *   Necesitamos mensajes superpuestos para `Game Over` y `Victoria`.
    *   En `Game.js`, modifica el método `draw()`:
        ```javascript
        draw() {
          this.ctx.clearRect(0, 0, this.width, this.height);
          // ... dibujar mapa, jugador, fantasmas ...
          this._drawUI(this.ctx);

          if (this.isGameOver) {
            this._drawGameOver();
          }
          if (this.didWin) {
            this._drawYouWin();
          }
        }
        ```
    *   **Crea el método `_drawGameOver(ctx)`:**
        *   Dibuja un rectángulo semi-transparente sobre todo el canvas para oscurecer el fondo (`ctx.fillStyle = 'rgba(0,0,0,0.5)';`).
        *   Dibuja el texto "GAME OVER" en el centro, grande y en rojo.
        *   Añade un texto más pequeño debajo: "Press Enter to Restart".
    *   **Crea el método `_drawYouWin(ctx)`:**
        *   Similar a `_drawGameOver`, pero con el texto "YOU WIN!" en verde o amarillo.

---

¡Genial! Estamos en la recta final. Ahora nos enfocaremos en hacer el juego accesible y más inmersivo. Estos últimos prompts añadirán controles táctiles para dispositivos móviles y efectos de sonido para una experiencia de juego completa.

---

### **Prompt 13: Controles Móviles con D-Pad Virtual**

#### Rol:
Eres un desarrollador web front-end especializado en la creación de interfaces de usuario interactivas y responsivas para dispositivos móviles. Tu fuerte es la gestión de eventos táctiles (`touch events`).

#### Tarea:
Implementa un D-Pad (cruceta de control) virtual en la pantalla para que el juego se pueda controlar en dispositivos táctiles. El D-Pad debe ser visible y funcional en móviles, pero puede estar oculto en escritorios.

#### Contexto:
Nuestro juego funciona perfectamente con teclado, pero es inaccesible en móviles y tablets. Un D-Pad virtual es la solución más intuitiva para un juego como Pac-Man en una pantalla táctil. Añadiremos los elementos del D-Pad al HTML y usaremos CSS para posicionarlos y JavaScript para que controlen al jugador.

#### Requisitos:
1.  **Añadir el D-Pad al `index.html`:**
    *   Dentro del `#game-container`, pero fuera del `<canvas>`, añade la estructura HTML para el D-Pad.
    *   Usa un contenedor `div` con `id="dpad-container"` y dentro, cuatro botones (pueden ser `div`s o `button`s) con IDs claros: `dpad-up`, `dpad-down`, `dpad-left`, `dpad-right`.
    *   Asígnales un `aria-label` para accesibilidad (ej. `aria-label="Move Up"`).
    ```html
    <!-- Dentro de #game-container, después del canvas -->
    <div id="dpad-container">
      <div id="dpad-up" class="dpad-button" aria-label="Move Up">▲</div>
      <div id="dpad-left" class="dpad-button" aria-label="Move Left">◀</div>
      <div id="dpad-right" class="dpad-button" aria-label="Move Right">▶</div>
      <div id="dpad-down" class="dpad-button" aria-label="Move Down">▼</div>
    </div>
    ```

2.  **Estilizar el D-Pad con `style.css`:**
    *   Posiciona el `#dpad-container` en la parte inferior de la pantalla, debajo del canvas. Puedes usar Flexbox en el `#game-container` (`flex-direction: column;`).
    *   Usa CSS Grid para maquetar los cuatro botones en forma de cruz dentro del `#dpad-container`.
    *   Estiliza los `.dpad-button` para que parezcan botones táctiles: tamaño generoso, un color de fondo, bordes redondeados y un estado `:active` para dar feedback visual cuando se presionan.
    *   **Importante:** Haz que el D-Pad solo sea visible en pantallas táctiles o pequeñas. Usa una media query:
        ```css
        #dpad-container {
          display: none; /* Oculto por defecto */
        }

        @media (max-width: 768px), (hover: none) {
          #dpad-container {
            display: grid; /* Visible en pantallas pequeñas o sin hover */
          }
        }
        ```

3.  **Añadir Lógica en `Game.js`:**
    *   En el método `_setupInput()` de la clase `Game`, añade la lógica para los eventos táctiles.
    *   Obtén las referencias a los cuatro botones del D-Pad.
    *   Añade un event listener `touchstart` a cada botón. **No uses `click`**, ya que tiene un pequeño retraso en móviles.
    *   Cuando se toca un botón, previene el comportamiento por defecto (`event.preventDefault()`) para evitar zoom o scroll no deseado.
    *   Dentro de cada listener, actualiza la dirección solicitada del jugador, igual que con las teclas del teclado:
        ```javascript
        // Ejemplo para el botón de arriba
        document.getElementById('dpad-up').addEventListener('touchstart', (e) => {
          e.preventDefault();
          this.player.requestedDirection = 'ArrowUp';
        });
        // Repite para los otros 3 botones.
        ```

4.  **Asegurar Compatibilidad:**
    *   El código existente para `this.player.requestedDirection` funcionará sin cambios, ya que hemos mapeado los eventos táctiles a los mismos strings que los eventos de teclado ("ArrowUp", etc.). Esto demuestra la ventaja de haber desacoplado la entrada de la lógica del jugador.

---
