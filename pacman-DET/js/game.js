/**
 * Clase principal Game - Motor central del juego de Pac-Man
 * Se encarga de inicializar el juego, gestionar el estado y ejecutar el bucle principal
 */
class Game {
    /**
     * Constructor de la clase Game
     * @param {HTMLCanvasElement} canvas - El elemento canvas donde se dibujará el juego
     */    constructor(canvas) {
        // Almacenar referencias del canvas y contexto
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;
        
        // Definir el tamaño de cada celda del laberinto ANTES de crear el mapa
        // Pac-Man clásico tiene 19 columnas
        this.tileSize = this.width / 19;
        
        // Inicializar componentes del juego
        this.map = new Map(this.tileSize);
        this.player = null;
        this.ghosts = [];          // Inicializar propiedades de estado del juego
        this.score = 0;
        this.lives = 3;
        this.currentLevel = 0;
        this.isTransitioning = false;
          // Estados de fin del juego
        this.isGameOver = false;
        this.didWin = false;
        this.isPlayerInvincible = false;
        this.invincibilityTimer = 0;
        this.invincibilityDuration = 120; // 2 segundos a 60 FPS
        this.showDebugInfo = false; // Cambiar a true para mostrar info de debug
          // Gestión de estados de fantasmas
        this.ghostModeTimer = 0;
        this.scatterDuration = 7000; // 7 segundos en modo Scatter
        this.chaseDuration = 20000; // 20 segundos en modo Chase
        this.currentGhostMode = 'scatter';
        
        // Gestión del modo Frightened
        this.frightenedModeTimer = 0;
        this.frightenedDuration = 10000; // 10 segundos en modo Frightened
        this.isFrightenedModeActive = false;
        
        // Configurar la captura de teclado
        this._setupInput();
        
        console.log("Game inicializado:");
        console.log("- Canvas:", this.canvas);
        console.log("- Dimensiones:", this.width + "x" + this.height);
        console.log("- Tile size:", this.tileSize);
    }
      /**
     * Método start - Inicializa los objetos del juego y comienza el bucle principal
     */    start() {
        console.log("Iniciando el juego...");
        
        // Cargar el primer nivel
        this.map.loadLevel(0);
          // Encontrar la posición inicial de Pac-Man (o usar una posición fija)
        // Pac-Man empezará en la posición central inferior, donde está la celda 5
        let playerStartX = 9 * this.tileSize; // Columna 9 (centro del mapa)
        let playerStartY = 16 * this.tileSize; // Fila 16 (posición de spawn clásica)
        
        // Opcionalmente, buscar una posición específica en el mapa
        const playerSpawnTile = this._findPlayerSpawnPoint();
        if (playerSpawnTile) {
            playerStartX = playerSpawnTile.col * this.tileSize;
            playerStartY = playerSpawnTile.row * this.tileSize;
        }// Crear la instancia del jugador
        const playerVelocity = 1; // Reducir velocidad para movimiento más controlado
        this.player = new Player(playerStartX, playerStartY, this.tileSize, playerVelocity, this.map, this);
        
        // Crear las instancias de los fantasmas
        this._createGhosts();
        
        // Iniciar el bucle principal del juego
        this.gameLoop();
    }
      /**
     * Método gameLoop - Bucle principal del juego que se ejecuta continuamente
     * Utiliza requestAnimationFrame para una animación eficiente
     */
    gameLoop() {        // Detener el bucle si el juego ha terminado
        if (this.isGameOver || this.didWin) {
            // Solo dibujar el estado actual (que incluye las pantallas de fin)
            this.draw();
            // Continuar el bucle para permitir reinicio
            requestAnimationFrame(this.gameLoop.bind(this));
            return;
        }
        
        // Actualizar la lógica del juego
        this.update();
        
        // Dibujar el estado actual del juego
        this.draw();
        
        // Programar la siguiente iteración del bucle
        requestAnimationFrame(this.gameLoop.bind(this));
    }    /**
     * Método update - Contiene toda la lógica de actualización del juego
     */    update() {        // No actualizar si estamos en transición entre niveles
        if (this.isTransitioning) {
            return;
        }
        
        // Actualizar invencibilidad del jugador
        this._updatePlayerInvincibility();
        
        // Actualizar el jugador
        if (this.player) {
            this.player.update();
        }
        
        // Actualizar los fantasmas
        this.ghosts.forEach(ghost => ghost.update());
        
        // Gestión de modos de fantasmas (Chase/Scatter)
        this._updateGhostModes();
        
        // Gestión del modo Frightened
        this._updateFrightenedMode();
        
        // Detectar colisiones entre jugador y fantasmas
        this._checkCollisions();
        
        // Verificar condición de victoria del nivel
        this._checkLevelCompletion();
    }/**
     * Método draw - Se encarga de dibujar todo en el canvas
     */
    draw() {
        // Limpiar el canvas en cada fotograma
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        // Restablecer transformaciones y estilos
        this.ctx.save();
        
        // Dibujar el mapa
        this.map.draw(this.ctx);
        
        // Dibujar el jugador
        if (this.player) {
            this.player.draw(this.ctx);
        }
        
        // Dibujar los fantasmas
        this.ghosts.forEach(ghost => ghost.draw(this.ctx));
          // Dibujar UI (puntuación, vidas, nivel)        
        this._drawUI();
        
        // Dibujar mensajes de estado superpuestos
        if (this.isGameOver) {
            this._drawGameOver();
        }
        if (this.didWin) {
            this._drawYouWin();
        }
        
        // Restaurar el estado del canvas
        this.ctx.restore();
    }
    
    /**
     * Método privado para encontrar el punto de spawn del jugador en el mapa
     * @returns {object|null} - Objeto con row y col, o null si no se encuentra
     */
    _findPlayerSpawnPoint() {
        if (!this.map || !this.map.currentMap) {
            return null;
        }
        
        // Buscar una celda específica para el spawn del jugador
        // Buscaremos en la parte inferior del mapa una celda con valor 5 o 0
        for (let row = this.map.currentMap.length - 1; row >= 0; row--) {
            for (let col = 0; col < this.map.currentMap[row].length; col++) {
                const tileValue = this.map.currentMap[row][col];
                // Buscar una celda específica para Pac-Man (valor 5 en la parte inferior)
                if (tileValue === 5 && row > 15) { // Área inferior del mapa
                    return { row, col };
                }
            }
        }
          // Si no se encuentra, usar una posición predeterminada
        return { row: 16, col: 9 }; // Centro-inferior del mapa
    }
      /**
     * Método privado para configurar la captura de teclado y eventos táctiles
     */    _setupInput() {
        // Configurar controles de teclado
        document.addEventListener('keydown', (event) => {
            // Solo procesar si el jugador existe
            if (!this.player) {
                return;
            }
            
            // Capturar las teclas de flecha y actualizar la dirección solicitada
            switch (event.key) {
                case 'ArrowUp':
                    this.player.requestedDirection = 'ArrowUp';
                    event.preventDefault(); // Prevenir scroll de la página
                    break;
                case 'ArrowDown':
                    this.player.requestedDirection = 'ArrowDown';
                    event.preventDefault();
                    break;
                case 'ArrowLeft':
                    this.player.requestedDirection = 'ArrowLeft';
                    event.preventDefault();
                    break;                case 'ArrowRight':
                    this.player.requestedDirection = 'ArrowRight';
                    event.preventDefault();
                    break;                case 'f':
                case 'F':
                    // Tecla F para activar modo Frightened (para pruebas)
                    if (!this.isGameOver && !this.didWin) {
                        this.activateFrightenedMode();
                    }
                    event.preventDefault();
                    break;
                case 'd':
                case 'D':
                    // Tecla D para activar/desactivar debug info
                    this.showDebugInfo = !this.showDebugInfo;
                    console.log("Debug info:", this.showDebugInfo ? "activado" : "desactivado");
                    event.preventDefault();
                    break;
                case ' ':
                case 'Enter':
                    // Tecla Espacio o Enter para reiniciar el juego
                    if (this.isGameOver || this.didWin) {
                        this.resetGame();
                    }
                    event.preventDefault();
                    break;                default:
                    // Ignorar otras teclas
                    break;
            }        });
        
        // Para reiniciar el juego con un toque en la pantalla cuando el juego ha terminado
        document.addEventListener('touchstart', (event) => {
            if ((this.isGameOver || this.didWin) && event.target.id !== 'restart-button') {
                // Sólo reiniciar si el jugador toca en cualquier lugar que no sea el botón de reinicio
                this.resetGame();
                event.preventDefault();
            }
        }, { passive: false });
        
        // Configurar controles táctiles (D-Pad)
        this._setupTouchControls();
        
        console.log("Sistema de entrada configurado - Usa las teclas de flecha para mover a Pac-Man");
        console.log("Presiona 'F' para activar modo Frightened (prueba)");
        console.log("Presiona 'D' para mostrar/ocultar información de debug");
        console.log("Presiona 'ESPACIO' para reiniciar cuando el juego termine");
    }
    
    /**
     * Método privado para configurar los controles táctiles (D-Pad)
     */
    _setupTouchControls() {
        // Referencias a los botones del D-Pad
        const dpadUp = document.getElementById('dpad-up');
        const dpadDown = document.getElementById('dpad-down');
        const dpadLeft = document.getElementById('dpad-left');
        const dpadRight = document.getElementById('dpad-right');
        
        // Verificar que todos los elementos existen
        if (!dpadUp || !dpadDown || !dpadLeft || !dpadRight) {
            console.error("No se pudieron encontrar todos los elementos del D-Pad");
            return;
        }
        
        // Función auxiliar para manejar los eventos táctiles
        const handleTouch = (direction) => (e) => {
            e.preventDefault(); // Prevenir comportamiento por defecto (scroll, zoom)
            
            // Solo procesar si el jugador existe
            if (!this.player) return;
            
            // Actualizar la dirección solicitada
            this.player.requestedDirection = direction;
        };
        
        // Agregar event listeners para cada botón del D-Pad
        // Usamos tanto touchstart como mousedown para compatibilidad
        
        // Botón arriba
        dpadUp.addEventListener('touchstart', handleTouch('ArrowUp'), { passive: false });
        dpadUp.addEventListener('mousedown', handleTouch('ArrowUp'));
        
        // Botón abajo
        dpadDown.addEventListener('touchstart', handleTouch('ArrowDown'), { passive: false });
        dpadDown.addEventListener('mousedown', handleTouch('ArrowDown'));
        
        // Botón izquierda
        dpadLeft.addEventListener('touchstart', handleTouch('ArrowLeft'), { passive: false });
        dpadLeft.addEventListener('mousedown', handleTouch('ArrowLeft'));
        
        // Botón derecha
        dpadRight.addEventListener('touchstart', handleTouch('ArrowRight'), { passive: false });
        dpadRight.addEventListener('mousedown', handleTouch('ArrowRight'));
        
        console.log("Controles táctiles (D-Pad) configurados");
    }
    
    /**
     * Método para incrementar la puntuación
     * @param {number} points - Puntos a añadir
     */
    addScore(points) {
        this.score += points;
        console.log("Puntuación actual:", this.score, "(+" + points + ")");
    }    /**
     * Método para activar el modo "Frightened" de los fantasmas
     */
    activateFrightenedMode() {
        console.log("¡Fantasmas asustados! Modo Frightened activado");
        
        // Activar el temporizador de modo Frightened
        this.frightenedModeTimer = 0;
        this.isFrightenedModeActive = true;            // Activar el modo Frightened en todos los fantasmas
        this.ghosts.forEach(ghost => ghost.setFrightened());
    }
    
    /**
     * Método para desactivar el modo "Frightened" de los fantasmas
     */
    deactivateFrightenedMode() {
        console.log("Modo Frightened desactivado - fantasmas vuelven a la normalidad");
        
        this.isFrightenedModeActive = false;
        this.frightenedModeTimer = 0;
        
        // Devolver los fantasmas a su estado normal
        this.ghosts.forEach(ghost => ghost.exitFrightenedMode());
    }
    
    /**
     * Método privado para verificar si el nivel está completo
     */
    _checkLevelCompletion() {
        if (this.map && this.map.pelletCount === 0) {
            console.log("¡Nivel completado! Todas las píldoras han sido comidas");
            this._handleLevelCompletion();
        }
    }
    
    /**
     * Método privado para manejar la finalización de un nivel
     */
    _handleLevelCompletion() {
        // Incrementar el nivel actual
        this.currentLevel++;
          // Verificar si hay más niveles disponibles
        if (this.currentLevel < this.map.levels.length) {
            console.log("Avanzando al nivel", this.currentLevel + 1);
            this._nextLevel();
        } else {
            console.log("¡Felicitaciones! ¡Has completado todos los niveles!");
            this.gameWon();
        }
    }
      /**
     * Método privado para cargar el siguiente nivel
     */
    _nextLevel() {
        // Añadir una propiedad para pausar el juego durante la transición
        this.isTransitioning = true;
        
        // Mostrar mensaje de nivel completado
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        this.ctx.fillStyle = '#FFFF00';
        this.ctx.font = '24px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('¡Nivel Completado!', this.width / 2, this.height / 2 - 20);
        this.ctx.fillText('Nivel ' + (this.currentLevel + 1), this.width / 2, this.height / 2 + 10);
        
        // Pausa antes de cargar el siguiente nivel
        setTimeout(() => {
            // Cargar el nuevo nivel
            this.map.loadLevel(this.currentLevel);
              // Reposicionar al jugador
            this._resetPlayerPosition();
            
            // Reposicionar fantasmas
            this.ghosts.forEach(ghost => ghost.resetPosition());
            
            // Permitir que el juego continúe
            this.isTransitioning = false;
            
            console.log("Nivel", this.currentLevel + 1, "iniciado");
        }, 2000); // Pausa de 2 segundos para que el jugador pueda leer el mensaje
    }
    
    /**
     * Método privado para manejar la finalización completa del juego
     */    /**
     * Método privado para reposicionar al jugador en su posición inicial
     */
    _resetPlayerPosition() {
        if (!this.player) return;
        
        // Encontrar la posición inicial del jugador
        const playerSpawnTile = this._findPlayerSpawnPoint();
        if (playerSpawnTile) {
            this.player.x = playerSpawnTile.col * this.tileSize;
            this.player.y = playerSpawnTile.row * this.tileSize;
        } else {
            // Posición por defecto
            this.player.x = 9 * this.tileSize;
            this.player.y = 16 * this.tileSize;
        }
          // Resetear dirección
        this.player.currentDirection = null;
        this.player.requestedDirection = null;        
        console.log("Jugador reposicionado a:", this.player.x, this.player.y);
    }    /**
     * Método privado para crear las instancias de los fantasmas
     */    _createGhosts() {
        // Definir las posiciones iniciales en el túnel central y esquinas de dispersión de los fantasmas
        // Todos los fantasmas empiezan en el área del túnel central válida
        const ghostData = [
            { 
                x: 9 * this.tileSize,   // Columna 9 - centro del túnel
                y: 11 * this.tileSize,  // Fila 11 - área del túnel central
                color: 'red',
                scatterTarget: { x: 18, y: 0 } // Esquina superior derecha para Blinky
            },
            { 
                x: 8 * this.tileSize,   // Columna 8 - izquierda del túnel
                y: 11 * this.tileSize,  // Fila 11 - área del túnel central
                color: 'pink',
                scatterTarget: { x: 0, y: 0 } // Esquina superior izquierda para Pinky
            },
            { 
                x: 10 * this.tileSize,  // Columna 10 - derecha del túnel
                y: 11 * this.tileSize,  // Fila 11 - área del túnel central
                color: 'cyan',
                scatterTarget: { x: 18, y: 21 } // Esquina inferior derecha para Inky
            },
            { 
                x: 9 * this.tileSize,   // Columna 9 - centro del túnel
                y: 12 * this.tileSize,  // Fila 12 - área del túnel central
                color: 'orange',
                scatterTarget: { x: 0, y: 21 } // Esquina inferior izquierda para Clyde
            }
        ];        // Crear una instancia de Ghost para cada configuración
        const ghostVelocity = 1; // Esta velocidad debe coincidir con la del jugador
        this.ghosts = ghostData.map(data => 
            new Ghost(
                data.x, 
                data.y, 
                this.tileSize, 
                ghostVelocity, 
                this.map, 
                data.color,
                data.scatterTarget,
                this.player
            )
        );
        
        // Dar referencia de Blinky a Inky para su IA especial
        const blinky = this.ghosts.find(ghost => ghost.color === 'red');
        const inky = this.ghosts.find(ghost => ghost.color === 'cyan');
        if (blinky && inky) {
            inky.blinky = blinky;
        }
        
        console.log("Fantasmas creados:", this.ghosts.length);
    }    /**
     * Método privado para dibujar la interfaz de usuario
     */
    _drawUI() {
        // Guardar estado del contexto
        this.ctx.save();
          // ========== PUNTUACIÓN ==========
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = 'bold 14px "Press Start 2P", monospace';
        this.ctx.textAlign = 'left';
        this.ctx.fillText('SCORE', 10, 25);
        
        this.ctx.fillStyle = '#FFFF00';
        this.ctx.font = '12px "Press Start 2P", monospace';
        this.ctx.fillText(this.score.toString().padStart(6, '0'), 10, 45);
        
        // ========== VIDAS VISUALES ==========
        this._drawLivesIcons();
          // ========== NIVEL ==========
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = 'bold 10px "Press Start 2P", monospace';
        this.ctx.textAlign = 'right';
        this.ctx.fillText('LEVEL ' + (this.currentLevel + 1), this.width - 10, 25);
        
        // ========== PÍLDORAS RESTANTES ==========
        if (this.map) {
            this.ctx.fillStyle = '#00FFFF';
            this.ctx.font = '8px "Press Start 2P", monospace';
            this.ctx.fillText('DOTS: ' + this.map.pelletCount, this.width - 10, 45);
        }
        
        // ========== INFORMACIÓN DE DEBUG (OPCIONAL) ==========
        if (this.showDebugInfo) {
            this._drawDebugInfo();
        }
        
        // Restaurar estado del contexto
        this.ctx.restore();
    }
    
    /**
     * Método para dibujar iconos de vidas como pequeños Pac-Man
     */
    _drawLivesIcons() {
        const lifeIconSize = 12;
        const startX = 10;
        const startY = this.height - 25;
          this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = 'bold 10px "Press Start 2P", monospace';
        this.ctx.textAlign = 'left';
        this.ctx.fillText('LIVES', startX, startY - 15);
        
        // Dibujar iconos de Pac-Man para cada vida restante (excepto la actual)
        for (let i = 0; i < this.lives - 1; i++) {
            const x = startX + (i * (lifeIconSize + 8));
            const y = startY;
            
            this._drawMiniPacman(x, y, lifeIconSize);
        }
    }
    
    /**
     * Método para dibujar un mini Pac-Man para iconos de vidas
     */
    _drawMiniPacman(x, y, size) {
        const centerX = x + size / 2;
        const centerY = y + size / 2;
        const radius = size / 2;
        
        this.ctx.fillStyle = '#FFFF00';
        this.ctx.beginPath();
        
        // Dibujar Pac-Man mirando hacia la derecha
        this.ctx.arc(centerX, centerY, radius, 0.2 * Math.PI, 1.8 * Math.PI);
        this.ctx.lineTo(centerX, centerY);
        this.ctx.closePath();
        this.ctx.fill();
        
        // Borde negro
        this.ctx.strokeStyle = '#000000';
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
    }
    
    /**
     * Método para dibujar información de debug (opcional)
     */
    _drawDebugInfo() {
        const debugY = 70;
        
        this.ctx.fillStyle = '#888888';
        this.ctx.font = '10px Arial';
        this.ctx.textAlign = 'left';
        
        if (this.isFrightenedModeActive) {
            this.ctx.fillText('Ghost Mode: FRIGHTENED', 10, debugY);
            this.ctx.fillText('Timer: ' + Math.floor((this.frightenedDuration - this.frightenedModeTimer) / 1000) + 's', 10, debugY + 15);
        } else {
            this.ctx.fillText('Ghost Mode: ' + this.currentGhostMode.toUpperCase(), 10, debugY);
            this.ctx.fillText('Timer: ' + Math.floor(this.ghostModeTimer / 1000) + 's', 10, debugY + 15);
        }
        
        if (this.isPlayerInvincible) {
            this.ctx.fillStyle = '#FF6666';
            this.ctx.fillText('INVINCIBLE: ' + Math.ceil(this.invincibilityTimer / 60) + 's', 10, debugY + 30);
        }
    }
    
    /**
     * Método privado para detectar colisiones entre el jugador y los fantasmas
     */
    _checkCollisions() {
        if (!this.player) return;
        
        // Verificar colisiones con cada fantasma
        this.ghosts.forEach(ghost => {
            if (this._isColliding(this.player, ghost)) {
                this._handlePlayerGhostCollision(ghost);
            }
        });
    }
      /**
     * Verificar si dos objetos están colisionando
     * @param {object} obj1 - Primer objeto (player)
     * @param {object} obj2 - Segundo objeto (ghost)
     * @returns {boolean} - true si están colisionando
     */
    _isColliding(obj1, obj2) {
        // Usar el método de detección de colisiones del fantasma
        if (typeof obj2.checkCollision === 'function') {
            return obj2.checkCollision(obj1);
        }
        
        // Método tradicional como respaldo
        const distance = Math.sqrt(
            Math.pow((obj1.x + obj1.tileSize/2) - (obj2.x + obj2.tileSize/2), 2) +
            Math.pow((obj1.y + obj1.tileSize/2) - (obj2.y + obj2.tileSize/2), 2)
        );
        
        // Colisión si la distancia es menor que la suma de los radios
        const collisionDistance = (obj1.tileSize + obj2.tileSize) / 4;
        return distance < collisionDistance;
    }
      /**
     * Manejar la colisión entre el jugador y un fantasma
     * @param {Ghost} ghost - El fantasma con el que colisionó
     */
    _handlePlayerGhostCollision(ghost) {
        // Si el jugador es invencible, ignorar colisiones
        if (this.isPlayerInvincible) {
            return;
        }
          if (ghost.currentState === ghost.states.FRIGHTENED) {
            // Pac-Man come al fantasma asustado
            this._eatGhost(ghost);
        } else if (ghost.currentState !== ghost.states.EATEN) {
            // El fantasma mata a Pac-Man (excepto si ya fue comido)
            this.playerDied();
        }
    }
      /**
     * Manejar cuando Pac-Man come un fantasma asustado
     * @param {Ghost} ghost - El fantasma comido
     */
    _eatGhost(ghost) {
        console.log("¡Pac-Man comió al fantasma", ghost.color + "!");        
        // Dar puntos por comer el fantasma
        this.addScore(200);
        
        // Hacer que el fantasma "muera" y vuelva a casa
        ghost.getEaten();
    }
      /**
     * Manejar cuando Pac-Man muere
     */
    playerDied() {
        console.log("¡Pac-Man ha muerto!");
        
        // Perder una vida
        this.lives--;
          if (this.lives <= 0) {
            // Game Over
            this.gameOver();
        } else {
            // Reiniciar estado del nivel actual
            this._resetLevelState();
            
            console.log("Vidas restantes:", this.lives);
        }
    }
      /**
     * Manejar el game over
     */
    gameOver() {
        console.log("¡Game Over! Puntuación final:", this.score);
        this.isGameOver = true;
    }

    /**
     * Método privado para actualizar los modos de los fantasmas
     */
    _updateGhostModes() {
        // Incrementar temporizador (asumiendo 60 FPS, aprox. 16ms por frame)
        this.ghostModeTimer += 16;
        
        if (this.currentGhostMode === 'scatter' && this.ghostModeTimer >= this.scatterDuration) {
            this.changeGhostMode('chase');
        } else if (this.currentGhostMode === 'chase' && this.ghostModeTimer >= this.chaseDuration) {
            this.changeGhostMode('scatter');
        }
    }
    
    /**
     * Método para cambiar el modo de todos los fantasmas
     * @param {string} mode - Nuevo modo ('chase' o 'scatter')
     */    changeGhostMode(mode) {
        this.currentGhostMode = mode;
        this.ghostModeTimer = 0; // Reiniciar temporizador
        
        // Cambiar el modo de todos los fantasmas
        this.ghosts.forEach(ghost => ghost.toggleChaseScatter(mode === 'chase'));
        
        console.log("Modo de fantasmas cambiado a:", mode);
    }
    
    /**
     * Método privado para actualizar el modo Frightened
     */
    _updateFrightenedMode() {
        if (this.isFrightenedModeActive) {
            this.frightenedModeTimer += 16; // Incrementar temporizador
            
            if (this.frightenedModeTimer >= this.frightenedDuration) {                this.deactivateFrightenedMode();
            }
        }
    }

    /**
     * Método para resetear el estado del nivel actual (jugador y fantasmas)
     */
    _resetLevelState() {
        // Desactivar modo Frightened si está activo
        if (this.isFrightenedModeActive) {
            this.deactivateFrightenedMode();
        }
        
        // Reiniciar posición del jugador y fantasmas
        this._resetPlayerPosition();
        this.ghosts.forEach(ghost => ghost.resetPosition());
        
        // Activar invencibilidad temporal
        this.isPlayerInvincible = true;
        this.invincibilityTimer = this.invincibilityDuration;
        
        console.log("Estado del nivel reiniciado - Jugador invencible por 2 segundos");
    }
    
    /**
     * Método para manejar cuando el jugador gana el juego
     */
    gameWon() {
        console.log("¡Felicitaciones! ¡Has completado todos los niveles! Puntuación final:", this.score);
        this.didWin = true;
    }
    
    /**
     * Método para actualizar la invencibilidad del jugador
     */
    _updatePlayerInvincibility() {
        if (this.isPlayerInvincible) {
            this.invincibilityTimer--;
            if (this.invincibilityTimer <= 0) {
                this.isPlayerInvincible = false;
                console.log("Invencibilidad terminada");
            }
        }    }    /**
     * Método para dibujar la pantalla de Game Over
     */
    _drawGameOver() {
        // Guardar estado del contexto
        this.ctx.save();
        
        // Overlay semi-transparente
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.fillRect(0, 0, this.width, this.height);
          // Configurar texto principal
        this.ctx.fillStyle = '#FF0000';
        this.ctx.font = 'bold 24px "Press Start 2P", monospace';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        
        // Añadir sombra al texto
        this.ctx.shadowColor = '#000000';
        this.ctx.shadowBlur = 3;
        this.ctx.shadowOffsetX = 2;
        this.ctx.shadowOffsetY = 2;
        
        // Texto principal
        this.ctx.fillText('GAME OVER', this.width / 2, this.height / 2 - 30);
        
        // Limpiar sombra
        this.ctx.shadowBlur = 0;
        this.ctx.shadowOffsetX = 0;
        this.ctx.shadowOffsetY = 0;
          // Puntuación final
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = 'bold 12px "Press Start 2P", monospace';
        this.ctx.fillText('Final Score: ' + this.score.toString().padStart(6, '0'), this.width / 2, this.height / 2 + 10);
        
        // Instrucciones de reinicio
        this.ctx.fillStyle = '#FFFF00';
        this.ctx.font = '8px "Press Start 2P", monospace';
        this.ctx.fillText('Press SPACE to play again', this.width / 2, this.height / 2 + 40);
        
        // Mostrar el botón de reinicio en dispositivos táctiles
        this._showRestartButton();
        
        // Restaurar estado del contexto
        this.ctx.restore();
    }
    
    /**
     * Método para dibujar la pantalla de Victoria
     */
    _drawYouWin() {
        // Guardar estado del contexto
        this.ctx.save();
        
        // Overlay semi-transparente
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.fillRect(0, 0, this.width, this.height);
          // Configurar texto principal
        this.ctx.fillStyle = '#00FF00';
        this.ctx.font = 'bold 20px "Press Start 2P", monospace';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        
        // Añadir sombra al texto
        this.ctx.shadowColor = '#000000';
        this.ctx.shadowBlur = 3;
        this.ctx.shadowOffsetX = 2;
        this.ctx.shadowOffsetY = 2;
        
        // Texto principal
        this.ctx.fillText('YOU WIN!', this.width / 2, this.height / 2 - 40);
        
        // Limpiar sombra
        this.ctx.shadowBlur = 0;
        this.ctx.shadowOffsetX = 0;
        this.ctx.shadowOffsetY = 0;
          // Mensaje de felicitación
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = 'bold 10px "Press Start 2P", monospace';
        this.ctx.fillText('Congratulations!', this.width / 2, this.height / 2 - 10);
        this.ctx.fillText('You completed all levels!', this.width / 2, this.height / 2 + 10);
        
        // Puntuación final
        this.ctx.fillStyle = '#FFFF00';
        this.ctx.font = 'bold 12px "Press Start 2P", monospace';
        this.ctx.fillText('Final Score: ' + this.score.toString().padStart(6, '0'), this.width / 2, this.height / 2 + 35);
          // Instrucciones de reinicio
        this.ctx.fillStyle = '#00FFFF';
        this.ctx.font = '8px "Press Start 2P", monospace';
        this.ctx.fillText('Press SPACE to play again', this.width / 2, this.height / 2 + 60);
        
        // Mostrar el botón de reinicio en dispositivos táctiles
        this._showRestartButton();
        
        // Restaurar estado del contexto
        this.ctx.restore();
    }
    
    /**
     * Método para mostrar el botón de reinicio en dispositivos táctiles
     */
    _showRestartButton() {
        // Obtener referencia al botón de reinicio
        const restartButton = document.getElementById('restart-button');
        if (!restartButton) {
            console.error("No se encontró el botón de reinicio");
            return;
        }

        // Mostrar el botón
        restartButton.classList.remove('hidden');
        restartButton.classList.add('show');

        // Configurar el manejador de eventos si no está ya configurado
        if (!restartButton.dataset.initialized) {
            restartButton.addEventListener('click', (e) => {
                e.preventDefault();
                // Ocultar el botón al hacer clic
                restartButton.classList.remove('show');
                restartButton.classList.add('hidden');
                // Reiniciar el juego
                this.resetGame();
            });

            // Marcar como inicializado para no añadir múltiples listeners
            restartButton.dataset.initialized = 'true';
        }
    }

    /**
     * Método para ocultar el botón de reinicio
     */
    _hideRestartButton() {
        const restartButton = document.getElementById('restart-button');
        if (restartButton) {
            restartButton.classList.remove('show');
            restartButton.classList.add('hidden');
        }
    }
    
    /**
     * Método para reiniciar completamente el juego
     */    resetGame() {
        console.log("Reiniciando el juego...");
        
        // Ocultar el botón de reinicio si está visible
        this._hideRestartButton();
        
        // Reiniciar todas las propiedades del juego
        this.score = 0;
        this.lives = 3;
        this.currentLevel = 0;
        this.isTransitioning = false;
        this.isGameOver = false;
        this.didWin = false;
        this.isPlayerInvincible = false;
        this.invincibilityTimer = 0;
        
        // Reiniciar temporizadores de fantasmas
        this.ghostModeTimer = 0;
        this.currentGhostMode = 'scatter';
        this.frightenedModeTimer = 0;
        this.isFrightenedModeActive = false;
        
        // Limpiar arrays
        this.ghosts = [];
        this.player = null;
          // Reiniciar el juego
        this.start();
    }
}

// Esperamos a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    // Obtenemos referencias al canvas
    const gameCanvas = document.getElementById('gameCanvas');
    
    // Configuramos las dimensiones del canvas
    // Establecemos un tamaño base que mantenga la relación de aspecto 19:22
    const baseWidth = 380;
    const baseHeight = 440;
    
    gameCanvas.width = baseWidth;
    gameCanvas.height = baseHeight;
    
    // Función para redimensionar el canvas manteniendo la relación de aspecto
    function resizeCanvas() {
        const container = document.getElementById('game-container');
        const rect = container.getBoundingClientRect();
        
        // Calculamos el tamaño óptimo manteniendo la relación de aspecto
        const aspectRatio = 19 / 22;
        let newWidth = Math.min(rect.width * 0.9, 500);
        let newHeight = newWidth / aspectRatio;
        
        // Ajustamos si la altura es demasiado grande
        if (newHeight > window.innerHeight * 0.8) {
            newHeight = window.innerHeight * 0.8;
            newWidth = newHeight * aspectRatio;
        }
        
        // Aplicamos el nuevo tamaño al canvas
        gameCanvas.style.width = newWidth + 'px';
        gameCanvas.style.height = newHeight + 'px';
    }
    
    // Redimensionamos el canvas inicialmente
    resizeCanvas();
    
    // Redimensionamos cuando cambie el tamaño de la ventana
    window.addEventListener('resize', resizeCanvas);
    
    // Crear una instancia de la clase Game
    const game = new Game(gameCanvas);
    
    // Iniciar el juego
    game.start();
    
    console.log("Juego listo para empezar.");
});
