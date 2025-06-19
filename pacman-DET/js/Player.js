/**
 * Clase Player - Representa a Pac-Man
 * Maneja la posición, velocidad, dirección, animación y renderizado del jugador
 */
class Player {    /**
     * Constructor de la clase Player
     * @param {number} x - Posición inicial X
     * @param {number} y - Posición inicial Y
     * @param {number} tileSize - Tamaño de cada baldosa
     * @param {number} velocity - Velocidad de movimiento
     * @param {Map} map - Referencia al mapa para detección de colisiones
     * @param {Game} game - Referencia al juego para manejar puntuación y eventos
     */
    constructor(x, y, tileSize, velocity, map, game) {
        // Propiedades de posición y movimiento
        this.x = x;
        this.y = y;
        this.tileSize = tileSize;
        this.velocity = velocity;
        this.map = map;
        this.game = game;
        
        // Propiedades de dirección
        this.currentDirection = null;
        this.requestedDirection = null;
        
        // Propiedades de animación
        this.pacmanImages = [];
        this.pacmanImageIndex = 0;
        this.pacmanAnimationTimer = 10;
        this.animationTimerReset = 10; // Valor para reiniciar el timer
        
        // Cargar las imágenes del sprite de Pac-Man
        this._loadImages();
        
        console.log("Player (Pac-Man) inicializado en posición:", this.x, this.y);    }    /**
     * Método privado para cargar las imágenes del sprite
     */    _loadImages() {
        // Cargar la imagen fija de Pac-Man desde la carpeta assets
        this.pacmanImage = new Image();
        this.pacmanImage.src = 'assets/pacman.png';
        
        // Inicializar con un valor por defecto hasta que la imagen se cargue
        this.useImageSprites = false; 
        
        // Una vez cargada la imagen, actualizar el flag
        this.pacmanImage.onload = () => {
            this.useImageSprites = true;
            console.log("Imagen de Pac-Man cargada correctamente");
        };
        
        this.pacmanImage.onerror = () => {
            console.error("Error al cargar la imagen de Pac-Man");
            this.useImageSprites = false;
        };
    }    /**
     * Método draw - Dibuja a Pac-Man en el canvas
     * @param {CanvasRenderingContext2D} ctx - Contexto del canvas
     */
    draw(ctx) {
        // Si el jugador es invencible, hacer parpadear
        if (this.game && this.game.isPlayerInvincible) {
            // Parpadear cada 8 frames (aprox. 8 veces por segundo a 60 FPS)
            const blinkRate = Math.floor(this.game.invincibilityTimer / 8) % 2;
            if (blinkRate === 0) {
                return; // No dibujar en esta frame (efecto parpadeo)
            }
        }
        
        // Verificar que las coordenadas sean válidas antes de dibujar
        if (isNaN(this.x) || isNaN(this.y)) {
            console.error("Coordenadas inválidas para Pac-Man:", this.x, this.y);
            return;
        }
        
        // Dibujar la imagen de Pac-Man
        this._drawSimpleSprite(ctx);
    }/**
     * Método privado para la animación del sprite
     * (Este método se mantiene por compatibilidad pero ya no alterna entre imágenes)
     */
    _animate() {
        // Como ahora usamos una sola imagen, no necesitamos alternar entre sprites
        // pero mantenemos el método para no romper referencias existentes
        
        // Decrementar el temporizador de animación
        this.pacmanAnimationTimer--;
        
        // Cuando el temporizador llega a 0, reiniciarlo
        if (this.pacmanAnimationTimer <= 0) {
            // Reiniciar el temporizador
            this.pacmanAnimationTimer = this.animationTimerReset;
        }
    }    /**
     * Método privado de respaldo, redirige al método _drawSimpleSprite
     * @param {CanvasRenderingContext2D} ctx - Contexto del canvas
     */
    _drawFallbackSprite(ctx) {
        // Para mayor consistencia, ahora siempre usamos el mismo método de dibujo
        this._drawSimpleSprite(ctx);
    }
    
    /**
     * Método update - Actualizar la lógica del jugador
     */
    update() {
        // Manejar la entrada del usuario
        this._handleInput();
        
        // Mover al jugador según la dirección actual
        this._move();
        
        // Detectar y procesar píldoras/power-ups después del movimiento
        this._checkForPickups();
    }
    
    /**
     * Método helper para obtener la posición del jugador en términos de baldosas del mapa
     * @returns {object} - Objeto con row y col
     */
    getTilePosition() {
        return {
            row: Math.floor(this.y / this.tileSize),
            col: Math.floor(this.x / this.tileSize)
        };
    }
      /**
     * Método helper para verificar si el jugador está centrado en una baldosa
     * @returns {boolean} - true si está centrado
     */
    isCenteredOnTile() {
        const tolerance = 2; // Píxeles de tolerancia
        return (this.x % this.tileSize < tolerance || this.x % this.tileSize > this.tileSize - tolerance) &&
               (this.y % this.tileSize < tolerance || this.y % this.tileSize > this.tileSize - tolerance);
    }    /**
     * Método privado para manejar la entrada del usuario
     */
    _handleInput() {
        // Si no hay dirección solicitada, no hacer nada
        if (!this.requestedDirection) {
            return;
        }
        
        // Verificar si la nueva dirección es válida (no choca con un muro)
        const isValidMove = !this._isCollidingWithWall(this.requestedDirection);
        
        if (isValidMove) {
            // Cambiar dirección inmediatamente si es válida
            this.currentDirection = this.requestedDirection;
            this.requestedDirection = null;
            // Reducir logs para mejor rendimiento
            if (Math.random() < 0.1) { // Solo 10% de probabilidad de log
                console.log("Dirección cambiada a:", this.currentDirection);
            }
        } else {
            // Mantener la dirección solicitada para intentar de nuevo
            // Solo mostrar logs ocasionalmente para evitar spam
            if (Math.random() < 0.05) { // Solo 5% de probabilidad
                console.log("Movimiento bloqueado en dirección:", this.requestedDirection);
            }
        }
    }/**
     * Método privado para mover al jugador
     */
    _move() {
        // Si no hay dirección actual, no moverse
        if (!this.currentDirection) {
            return;
        }
        
        // Calcular nueva posición
        let newX = this.x;
        let newY = this.y;
        
        switch (this.currentDirection) {
            case 'ArrowUp':
                newY -= this.velocity;
                break;
            case 'ArrowDown':
                newY += this.velocity;
                break;
            case 'ArrowLeft':
                newX -= this.velocity;
                break;
            case 'ArrowRight':
                newX += this.velocity;
                break;
        }
        
        // Verificar si la nueva posición es válida usando solo el centro
        const centerX = newX + this.tileSize / 2;
        const centerY = newY + this.tileSize / 2;
        const centerRow = Math.floor(centerY / this.tileSize);
        const centerCol = Math.floor(centerX / this.tileSize);
        
        // Verificar límites del mapa
        if (centerRow >= 0 && centerRow < this.map.currentMap.length &&
            centerCol >= 0 && centerCol < this.map.currentMap[0].length) {
            
            // Verificar si el centro está en un espacio válido (no muro)
            if (!this.map.isWall(centerRow, centerCol)) {
                // Movimiento válido, actualizar posición
                this.x = newX;
                this.y = newY;
                this._handleScreenWrap();
            } else {
                // Detener movimiento si hay colisión
                this.currentDirection = null;
            }
        } else {
            // Manejar wrap-around o detener en límites
            this._handleScreenWrap();
        }
    }    /**
     * Método privado para detectar colisiones con muros
     * @param {string} direction - La dirección a verificar
     * @returns {boolean} - true si hay colisión, false si es seguro moverse
     */
    _isCollidingWithWall(direction) {
        // Calcular la próxima posición basada en la dirección
        let nextX = this.x;
        let nextY = this.y;
        
        switch (direction) {
            case 'ArrowUp':
                nextY -= this.velocity;
                break;
            case 'ArrowDown':
                nextY += this.velocity;
                break;
            case 'ArrowLeft':
                nextX -= this.velocity;
                break;
            case 'ArrowRight':
                nextX += this.velocity;
                break;
        }
        
        // Verificar solo el centro del jugador en la nueva posición
        const centerX = nextX + this.tileSize / 2;
        const centerY = nextY + this.tileSize / 2;
        const centerRow = Math.floor(centerY / this.tileSize);
        const centerCol = Math.floor(centerX / this.tileSize);
        
        // Verificar límites del mapa
        if (centerRow < 0 || centerRow >= this.map.currentMap.length ||
            centerCol < 0 || centerCol >= this.map.currentMap[0].length) {
            return true; // Fuera de límites = colisión
        }
        
        // Verificar si es un muro
        return this.map.isWall(centerRow, centerCol);
    }    /**
     * Verificar si hay un muro en una posición específica
     * @param {number} x - Coordenada X en píxeles
     * @param {number} y - Coordenada Y en píxeles
     * @returns {boolean} - true si hay un muro
     */
    _checkWallAt(x, y) {
        const row = Math.floor(y / this.tileSize);
        const col = Math.floor(x / this.tileSize);
        
        // Verificar límites del mapa
        if (!this.map || !this.map.currentMap ||
            row < 0 || row >= this.map.currentMap.length ||
            col < 0 || col >= this.map.currentMap[0].length) {
            return true; // Fuera de límites = muro
        }
        
        return this.map.isWall(row, col);
    }
    
    /**
     * Método privado para manejar el wrap-around en los túneles laterales
     */
    _handleScreenWrap() {
        const mapWidth = 19 * this.tileSize; // Ancho total del mapa
          // Túnel lateral izquierdo -> derecho
        if (this.x < -this.tileSize) {
            this.x = mapWidth;
        }
        // Túnel lateral derecho -> izquierdo
        else if (this.x > mapWidth) {
            this.x = -this.tileSize;
        }
    }
    
    /**
     * Método privado para detectar y procesar píldoras y power-ups
     */
    _checkForPickups() {
        // Calcular la posición del centro del jugador en términos de baldosas
        const centerX = this.x + this.tileSize / 2;
        const centerY = this.y + this.tileSize / 2;
        
        const row = Math.floor(centerY / this.tileSize);
        const col = Math.floor(centerX / this.tileSize);
        
        // Obtener el tipo de baldosa en la posición actual
        const tileType = this.map.getTile(row, col);
        
        // Procesar según el tipo de baldosa
        switch (tileType) {
            case 0: // Píldora normal
                console.log("¡Píldora comida en posición:", row, col);
                this.game.addScore(10);
                this.map.eatPellet(row, col);
                break;
                
            case 4: // Power-up
                console.log("¡Power-up comido en posición:", row, col);
                this.game.addScore(50);
                this.map.eatPellet(row, col);
                this.game.activateFrightenedMode();
                break;
                
            default:
                // No hay nada que recoger en esta baldosa
                break;
        }
    }
    /**
     * Método de renderizado usando la imagen cargada
     * @param {CanvasRenderingContext2D} ctx - Contexto del canvas
     */
    _drawSimpleSprite(ctx) {
        // Comprobar si la imagen se ha cargado correctamente
        if (this.useImageSprites && this.pacmanImage) {
            // Guardar el estado actual del contexto
            ctx.save();
            
            // Calcular el centro para dibujar la imagen
            const centerX = this.x + this.tileSize / 2;
            const centerY = this.y + this.tileSize / 2;
            
            // Calcular tamaño de la imagen (ligeramente más pequeño que el tamaño de la celda)
            const imageSize = this.tileSize * 0.8;
            
            // Posición de la esquina superior izquierda para dibujar la imagen
            const drawX = centerX - imageSize / 2;
            const drawY = centerY - imageSize / 2;
            
            // Configuración de rotación según dirección del jugador
            ctx.translate(centerX, centerY);
            
            switch(this.currentDirection) {
                case 'ArrowLeft':
                    ctx.rotate(Math.PI); // 180 grados
                    break;
                case 'ArrowUp':
                    ctx.rotate(-Math.PI / 2); // -90 grados
                    break;
                case 'ArrowDown':
                    ctx.rotate(Math.PI / 2); // 90 grados
                    break;
                // ArrowRight o null (por defecto hacia la derecha)
                default:
                    ctx.rotate(0);
            }
            
            // Dibujar la imagen centrada
            ctx.drawImage(
                this.pacmanImage, 
                -imageSize / 2, 
                -imageSize / 2, 
                imageSize, 
                imageSize
            );
            
            // Restaurar el estado del contexto
            ctx.restore();
        } else {
            // Código de respaldo si la imagen no está disponible
            const centerX = this.x + this.tileSize / 2;
            const centerY = this.y + this.tileSize / 2;
            const radius = this.tileSize / 3;
            
            // Dibujar un círculo amarillo simple
            ctx.fillStyle = '#FFFF00';
            ctx.strokeStyle = '#FFA500';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
            ctx.fill();
            ctx.stroke();
            
            // Punto negro en el centro para indicar dirección
            ctx.fillStyle = '#000000';
            ctx.beginPath();
            ctx.arc(centerX, centerY, 2, 0, 2 * Math.PI);
            ctx.fill();
        }
    }
}
