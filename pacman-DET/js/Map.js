/**
 * Clase Map - Se encarga de definir, cargar y dibujar los laberintos del juego
 * Soporta múltiples niveles y gestiona todos los elementos del mapa
 */
class Map {
    /**
     * Constructor de la clase Map
     * @param {number} tileSize - El tamaño de cada baldosa/celda del mapa
     */    constructor(tileSize) {
        this.tileSize = tileSize;
        this.currentMap = null;
        this.pelletCount = 0; // Contador de píldoras restantes en el nivel actual
        
        // Definir los 5 niveles del juego
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
            ],
            [ // Nivel 2 (placeholder - se puede personalizar más tarde)
                [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                [1,4,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,4,1],
                [1,0,1,1,1,1,1,1,0,1,0,1,1,1,1,1,1,0,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                [1,0,1,1,0,1,1,1,0,1,0,1,1,1,0,1,1,0,1],
                [1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1],
                [1,1,1,1,0,1,1,1,5,1,5,1,1,1,0,1,1,1,1],
                [1,1,1,1,0,1,5,5,5,5,5,5,5,1,0,1,1,1,1],
                [1,1,1,1,0,1,5,1,1,5,1,1,5,1,0,1,1,1,1],
                [0,0,0,0,0,5,5,1,5,5,5,1,5,5,0,0,0,0,0],
                [1,1,1,1,0,1,5,1,1,1,1,1,5,1,0,1,1,1,1],
                [1,1,1,1,0,1,5,5,5,5,5,5,5,1,0,1,1,1,1],
                [1,1,1,1,0,1,5,1,1,1,1,1,5,1,0,1,1,1,1],
                [1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1],
                [1,0,1,1,0,1,1,1,0,1,0,1,1,1,0,1,1,0,1],
                [1,0,0,0,0,0,0,0,0,5,0,0,0,0,0,0,0,0,1],
                [1,1,1,1,0,1,0,1,1,5,1,1,0,1,0,1,1,1,1],
                [1,4,0,0,0,1,0,0,0,5,0,0,0,1,0,0,0,4,1],
                [1,0,1,1,1,1,1,1,0,5,0,1,1,1,1,1,1,0,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            ],
            [ // Nivel 3 (placeholder)
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
                [0,0,0,0,0,5,5,1,5,5,5,1,5,5,0,0,0,0,0],
                [1,1,1,1,0,1,5,1,1,1,1,1,5,1,0,1,1,1,1],
                [1,1,1,1,0,1,5,5,5,5,5,5,5,1,0,1,1,1,1],
                [1,1,1,1,0,1,5,1,1,1,1,1,5,1,0,1,1,1,1],
                [1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1],
                [1,0,1,1,0,1,1,1,0,1,0,1,1,1,0,1,1,0,1],
                [1,0,0,1,0,0,0,0,0,5,0,0,0,0,0,1,0,0,1],
                [1,1,0,1,0,1,0,1,1,5,1,1,0,1,0,1,0,1,1],
                [1,4,0,0,0,1,0,0,0,5,0,0,0,1,0,0,0,4,1],
                [1,0,1,1,1,1,1,1,0,5,0,1,1,1,1,1,1,0,1],
                [1,0,0,0,0,0,0,0,0,5,0,0,0,0,0,0,0,0,1],
                [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            ],
            [ // Nivel 4 (placeholder)
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
                [0,0,0,0,0,5,5,1,5,5,5,1,5,5,0,0,0,0,0],
                [1,1,1,1,0,1,5,1,1,1,1,1,5,1,0,1,1,1,1],
                [1,1,1,1,0,1,5,5,5,5,5,5,5,1,0,1,1,1,1],
                [1,1,1,1,0,1,5,1,1,1,1,1,5,1,0,1,1,1,1],
                [1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1],
                [1,0,1,1,0,1,1,1,0,1,0,1,1,1,0,1,1,0,1],
                [1,0,0,1,0,0,0,0,0,5,0,0,0,0,0,1,0,0,1],
                [1,1,0,1,0,1,0,1,1,5,1,1,0,1,0,1,0,1,1],
                [1,4,0,0,0,1,0,0,0,5,0,0,0,1,0,0,0,4,1],
                [1,0,1,1,1,1,1,1,0,5,0,1,1,1,1,1,1,0,1],
                [1,0,0,0,0,0,0,0,0,5,0,0,0,0,0,0,0,0,1],
                [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            ],
            [ // Nivel 5 (placeholder)
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
                [0,0,0,0,0,5,5,1,5,5,5,1,5,5,0,0,0,0,0],
                [1,1,1,1,0,1,5,1,1,1,1,1,5,1,0,1,1,1,1],
                [1,1,1,1,0,1,5,5,5,5,5,5,5,1,0,1,1,1,1],
                [1,1,1,1,0,1,5,1,1,1,1,1,5,1,0,1,1,1,1],
                [1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1],
                [1,0,1,1,0,1,1,1,0,1,0,1,1,1,0,1,1,0,1],
                [1,0,0,1,0,0,0,0,0,5,0,0,0,0,0,1,0,0,1],
                [1,1,0,1,0,1,0,1,1,5,1,1,0,1,0,1,0,1,1],
                [1,4,0,0,0,1,0,0,0,5,0,0,0,1,0,0,0,4,1],
                [1,0,1,1,1,1,1,1,0,5,0,1,1,1,1,1,1,0,1],
                [1,0,0,0,0,0,0,0,0,5,0,0,0,0,0,0,0,0,1],
                [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            ]
        ];
        
        console.log("Map inicializado con", this.levels.length, "niveles disponibles");
    }
    
    /**
     * Método loadLevel - Carga un nivel específico
     * @param {number} levelNumber - Número del nivel a cargar (0-4)
     */    loadLevel(levelNumber) {
        if (levelNumber >= 0 && levelNumber < this.levels.length) {
            // Hacer una copia profunda para evitar mutación del original
            this.currentMap = JSON.parse(JSON.stringify(this.levels[levelNumber]));
            
            // Contar píldoras y power-ups en el mapa
            this._countPellets();
            
            console.log("Nivel", levelNumber + 1, "cargado exitosamente");
            console.log("Píldoras totales en el nivel:", this.pelletCount);
        } else {
            console.error("Número de nivel inválido:", levelNumber);
        }
    }
    
    /**
     * Método draw - Dibuja el mapa actual en el canvas
     * @param {CanvasRenderingContext2D} ctx - Contexto del canvas
     */
    draw(ctx) {
        if (!this.currentMap) {
            return;
        }
        
        // Iterar sobre cada fila del mapa
        for (let row = 0; row < this.currentMap.length; row++) {
            // Iterar sobre cada columna de la fila
            for (let col = 0; col < this.currentMap[row].length; col++) {
                const tileValue = this.currentMap[row][col];
                const x = col * this.tileSize;
                const y = row * this.tileSize;
                
                // Dibujar según el tipo de baldosa
                switch (tileValue) {
                    case 1: // Muro
                        ctx.fillStyle = '#0000FF'; // Azul
                        ctx.fillRect(x, y, this.tileSize, this.tileSize);
                        break;
                        
                    case 0: // Píldora (pellet)
                        ctx.fillStyle = '#FFFF00'; // Amarillo
                        ctx.beginPath();
                        ctx.arc(
                            x + this.tileSize / 2, 
                            y + this.tileSize / 2, 
                            this.tileSize / 8, 
                            0, 
                            2 * Math.PI
                        );
                        ctx.fill();
                        break;
                        
                    case 4: // Power-up (píldora grande)
                        ctx.fillStyle = '#FFFF00'; // Amarillo
                        ctx.beginPath();
                        // Efecto parpadeante usando el tiempo
                        const pulseSize = this.tileSize / 4 + Math.sin(Date.now() / 200) * 2;
                        ctx.arc(
                            x + this.tileSize / 2, 
                            y + this.tileSize / 2, 
                            pulseSize, 
                            0, 
                            2 * Math.PI
                        );
                        ctx.fill();
                        break;
                        
                    case 5: // Espacio vacío (fantasmas/Pac-Man)
                        // No dibujar nada, solo espacio vacío
                        break;
                        
                    default:
                        // Tipo de baldosa no reconocido
                        break;
                }
            }
        }
    }
    
    /**
     * Método isWall - Verifica si una posición es un muro
     * @param {number} row - Fila a verificar
     * @param {number} col - Columna a verificar
     * @returns {boolean} - true si es un muro, false en caso contrario
     */
    isWall(row, col) {
        if (!this.currentMap || row < 0 || row >= this.currentMap.length || 
            col < 0 || col >= this.currentMap[0].length) {
            return true; // Considera los límites como muros
        }
        return this.currentMap[row][col] === 1;
    }
    
    /**
     * Método getTile - Obtiene el valor de una baldosa específica
     * @param {number} row - Fila de la baldosa
     * @param {number} col - Columna de la baldosa
     * @returns {number} - Valor de la baldosa (0, 1, 4, 5, etc.)
     */
    getTile(row, col) {
        if (!this.currentMap || row < 0 || row >= this.currentMap.length || 
            col < 0 || col >= this.currentMap[0].length) {
            return -1; // Valor para indicar posición inválida
        }
        return this.currentMap[row][col];
    }
      /**
     * Método setTile - Establece el valor de una baldosa específica (útil para comer píldoras)
     * @param {number} row - Fila de la baldosa
     * @param {number} col - Columna de la baldosa
     * @param {number} value - Nuevo valor para la baldosa
     */
    setTile(row, col, value) {
        if (this.currentMap && row >= 0 && row < this.currentMap.length && 
            col >= 0 && col < this.currentMap[0].length) {
            this.currentMap[row][col] = value;
        }
    }
    
    /**
     * Método eatPellet - Elimina una píldora o power-up del mapa
     * @param {number} row - Fila de la baldosa
     * @param {number} col - Columna de la baldosa
     */
    eatPellet(row, col) {
        if (this.currentMap && row >= 0 && row < this.currentMap.length && 
            col >= 0 && col < this.currentMap[0].length) {
            
            const currentTile = this.currentMap[row][col];
            
            // Solo procesar si es una píldora o power-up
            if (currentTile === 0 || currentTile === 4) {
                // Cambiar a espacio vacío
                this.currentMap[row][col] = 5;
                
                // Decrementar el contador de píldoras
                this.pelletCount--;
                
                console.log("Píldora eliminada. Píldoras restantes:", this.pelletCount);
            }
        }
    }
    
    /**
     * Método privado para contar todas las píldoras y power-ups en el mapa actual
     */
    _countPellets() {
        this.pelletCount = 0;
        
        if (!this.currentMap) {
            return;
        }
        
        // Iterar sobre todo el mapa
        for (let row = 0; row < this.currentMap.length; row++) {
            for (let col = 0; col < this.currentMap[row].length; col++) {
                const tileValue = this.currentMap[row][col];
                
                // Contar píldoras (0) y power-ups (4)
                if (tileValue === 0 || tileValue === 4) {
                    this.pelletCount++;
                }
            }
        }
    }
}
