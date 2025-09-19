// Fábrica de Naiê - JavaScript Principal
class FabricaNaie {
    constructor() {
        this.videos = {
            video1: null,
            video2: null
        };
        this.canvas = document.getElementById('video-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.isPlaying = false;
        this.currentTime = 0;
        this.duration = 15; // segundos
        this.animationFrame = null;
        this.layout = 'split-vertical';
        this.textOverlay = {
            text: 'Digite seu texto aqui...',
            fontSize: 24,
            color: '#ffffff',
            backgroundColor: '#000000',
            opacity: 70,
            position: 'center'
        };
        
        this.textBox = {
            text: '',
            x: 50,
            y: 50,
            fontSize: 24,
            color: '#ffffff',
            fontFamily: 'Arial',
            fontWeight: 'normal',
            fontStyle: 'normal'
        };

        // Sistema de segmentos
        this.segments = [];
        this.currentSegment = null;
        this.segmentIdCounter = 0;
        this.videoDuration = 60; // duração padrão em segundos
        this.currentTime = 0; // tempo atual para preview
        
        // Seleção de parte do vídeo
        this.videoSelectionStart = 0;
        this.videoSelectionEnd = 0;
        this.videoSelectionActive = false;
        
        // Configurações individuais dos vídeos
        this.videoSettings = {
            video1: {
                x: 0,
                y: 0,
                scale: 1,
                rotation: 0,
                brightness: 100,
                contrast: 100,
                saturation: 100,
                opacity: 100,
                speed: 1
            },
            video2: {
                x: 0,
                y: 0,
                scale: 1,
                rotation: 0,
                brightness: 100,
                contrast: 100,
                saturation: 100,
                opacity: 100,
                speed: 1
            }
        };
        
        this.initializeEventListeners();
        this.setupCanvas();
        
        // Inicializar timeline
        setTimeout(() => {
            this.updateTimelineDisplay();
        }, 100);
    }

    initializeEventListeners() {
        // Layout buttons
        document.querySelectorAll('.layout-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.layout-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.layout = e.target.dataset.layout;
                this.renderFrame();
            });
        });

        // Text controls
        document.getElementById('text-content').addEventListener('input', (e) => {
            this.textOverlay.text = e.target.value || 'Digite seu texto aqui...';
            this.updateTextOverlay();
        });

        document.getElementById('font-size').addEventListener('input', (e) => {
            this.textOverlay.fontSize = parseInt(e.target.value);
            this.updateTextOverlay();
        });

        document.getElementById('text-color').addEventListener('input', (e) => {
            this.textOverlay.color = e.target.value;
            this.updateTextOverlay();
        });

        document.getElementById('bg-color').addEventListener('input', (e) => {
            this.textOverlay.backgroundColor = e.target.value;
            this.updateTextOverlay();
        });

        document.getElementById('bg-opacity').addEventListener('input', (e) => {
            this.textOverlay.opacity = parseInt(e.target.value);
            this.updateTextOverlay();
        });

        document.getElementById('text-position').addEventListener('change', (e) => {
            this.textOverlay.position = e.target.value;
            this.updateTextOverlay();
        });

        // Video controls
        document.getElementById('timeline').addEventListener('input', (e) => {
            this.currentTime = (parseFloat(e.target.value) / 100) * this.duration;
            this.renderFrame();
        });

        document.getElementById('video-duration').addEventListener('input', (e) => {
            this.duration = parseInt(e.target.value);
            this.renderFrame();
        });

        // Video editor tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                
                const videoNum = e.target.dataset.video;
                document.querySelectorAll('.video-edit-panel').forEach(panel => {
                    panel.style.display = 'none';
                });
                document.getElementById(`video-edit-${videoNum}`).style.display = 'block';
            });
        });

        // Video controls for both videos
        this.setupVideoControls();

        // Text box dragging
        this.setupTextBoxDragging();
    }

    setupCanvas() {
        // Configurar canvas para formato vertical (9:16)
        this.canvas.width = 405;
        this.canvas.height = 720;
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Adicionar texto inicial
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '24px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Carregue seus vídeos para começar', this.canvas.width / 2, this.canvas.height / 2);
    }

    setupVideoControls() {
        // Setup controls for both videos
        [1, 2].forEach(videoNum => {
            const videoKey = `video${videoNum}`;
            
            // Position controls
            const xControl = document.getElementById(`${videoKey}-x`);
            const yControl = document.getElementById(`${videoKey}-y`);
            const xValue = document.getElementById(`${videoKey}-x-value`);
            const yValue = document.getElementById(`${videoKey}-y-value`);
            
            xControl.addEventListener('input', (e) => {
                this.videoSettings[videoKey].x = parseInt(e.target.value);
                xValue.textContent = e.target.value + 'px';
                this.renderFrame();
            });
            
            yControl.addEventListener('input', (e) => {
                this.videoSettings[videoKey].y = parseInt(e.target.value);
                yValue.textContent = e.target.value + 'px';
                this.renderFrame();
            });
            
            // Scale control
            const scaleControl = document.getElementById(`${videoKey}-scale`);
            const scaleValue = document.getElementById(`${videoKey}-scale-value`);
            
            scaleControl.addEventListener('input', (e) => {
                this.videoSettings[videoKey].scale = parseFloat(e.target.value);
                scaleValue.textContent = Math.round(e.target.value * 100) + '%';
                this.renderFrame();
            });
            
            // Rotation control
            const rotationControl = document.getElementById(`${videoKey}-rotation`);
            const rotationValue = document.getElementById(`${videoKey}-rotation-value`);
            
            rotationControl.addEventListener('input', (e) => {
                this.videoSettings[videoKey].rotation = parseInt(e.target.value);
                rotationValue.textContent = e.target.value + '°';
                this.renderFrame();
            });
            
            // Brightness control
            const brightnessControl = document.getElementById(`${videoKey}-brightness`);
            const brightnessValue = document.getElementById(`${videoKey}-brightness-value`);
            
            brightnessControl.addEventListener('input', (e) => {
                this.videoSettings[videoKey].brightness = parseInt(e.target.value);
                brightnessValue.textContent = e.target.value + '%';
                this.renderFrame();
            });
            
            // Contrast control
            const contrastControl = document.getElementById(`${videoKey}-contrast`);
            const contrastValue = document.getElementById(`${videoKey}-contrast-value`);
            
            contrastControl.addEventListener('input', (e) => {
                this.videoSettings[videoKey].contrast = parseInt(e.target.value);
                contrastValue.textContent = e.target.value + '%';
                this.renderFrame();
            });
            
            // Saturation control
            const saturationControl = document.getElementById(`${videoKey}-saturation`);
            const saturationValue = document.getElementById(`${videoKey}-saturation-value`);
            
            saturationControl.addEventListener('input', (e) => {
                this.videoSettings[videoKey].saturation = parseInt(e.target.value);
                saturationValue.textContent = e.target.value + '%';
                this.renderFrame();
            });
            
            // Opacity control
            const opacityControl = document.getElementById(`${videoKey}-opacity`);
            const opacityValue = document.getElementById(`${videoKey}-opacity-value`);
            
            opacityControl.addEventListener('input', (e) => {
                this.videoSettings[videoKey].opacity = parseInt(e.target.value);
                opacityValue.textContent = e.target.value + '%';
                this.renderFrame();
            });
            
            // Speed control
            const speedControl = document.getElementById(`${videoKey}-speed`);
            const speedValue = document.getElementById(`${videoKey}-speed-value`);
            
            speedControl.addEventListener('input', (e) => {
                this.videoSettings[videoKey].speed = parseFloat(e.target.value);
                speedValue.textContent = e.target.value + 'x';
                this.renderFrame();
            });
        });
    }

    setupTextBoxDragging() {
        const textBox = document.getElementById('text-box');
        if (!textBox) return;
        
        let isDragging = false;
        let startX, startY, startLeft, startTop;

        textBox.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            const rect = textBox.getBoundingClientRect();
            startLeft = rect.left;
            startTop = rect.top;
            textBox.style.cursor = 'grabbing';
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            
            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;
            
            textBox.style.left = (startLeft + deltaX) + 'px';
            textBox.style.top = (startTop + deltaY) + 'px';
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
            if (textBox) textBox.style.cursor = 'move';
        });
    }

    async loadVideo(videoNumber) {
        const urlInput = document.getElementById(`video${videoNumber}-url`);
        const preview = document.getElementById(`video${videoNumber}-preview`);
        const url = urlInput.value.trim();

        if (!url) {
            alert('Por favor, insira uma URL válida do YouTube');
            return;
        }

        try {
            this.showLoading(true);
            
            // Extrair ID do vídeo do YouTube
            const videoId = this.extractYouTubeId(url);
            if (!videoId) {
                throw new Error('URL do YouTube inválida');
            }

            // Criar elemento de vídeo
            const video = document.createElement('video');
            video.crossOrigin = 'anonymous';
            video.preload = 'metadata';
            
            // Usar um serviço proxy para contornar CORS (em produção, usar backend próprio)
            const proxyUrl = `https://cors-anywhere.herokuapp.com/https://www.youtube.com/watch?v=${videoId}`;
            
            // Para demonstração, vamos simular o carregamento
            setTimeout(() => {
                const videoDuration = 30 + Math.random() * 60; // duração simulada entre 30-90 segundos
                
                this.videos[`video${videoNumber}`] = {
                    element: video,
                    loaded: true,
                    duration: videoDuration,
                    thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
                };

                // Atualizar duração baseada no vídeo mais longo
                const maxDuration = Math.max(
                    this.videos.video1?.duration || 0,
                    this.videos.video2?.duration || 0
                );
                
                if (maxDuration > 0) {
                    this.videoDuration = Math.ceil(maxDuration);
                    this.updateTimelineDisplay();
                    this.updateTimeControls();
                }

                // Mostrar preview
                preview.innerHTML = `
                    <div style="text-align: center; padding: 20px;">
                        <img src="https://img.youtube.com/vi/${videoId}/maxresdefault.jpg" 
                             style="max-width: 100%; height: auto; border-radius: 8px; margin-bottom: 10px;">
                        <p style="color: #28a745; font-weight: 600;">
                            <i class="fas fa-check-circle"></i> Vídeo ${videoNumber} carregado com sucesso!
                        </p>
                        <p style="color: #666; font-size: 14px;">
                            Duração: ${Math.floor(videoDuration / 60)}:${Math.floor(videoDuration % 60).toString().padStart(2, '0')}
                        </p>
                    </div>
                `;

                this.showLoading(false);
                this.renderFrame();
                
                // Verificar se ambos os vídeos estão carregados
                if (this.videos.video1 && this.videos.video2) {
                    this.showSuccessMessage();
                }
            }, 2000);

        } catch (error) {
            console.error('Erro ao carregar vídeo:', error);
            alert('Erro ao carregar o vídeo. Verifique a URL e tente novamente.');
            this.showLoading(false);
        }
    }

    extractYouTubeId(url) {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    }

    renderFrame() {
        // Limpar canvas
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        if (!this.videos.video1 || !this.videos.video2) {
            // Mostrar placeholder
            this.ctx.fillStyle = '#ffffff';
            this.ctx.font = '20px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('Carregue ambos os vídeos', this.canvas.width / 2, this.canvas.height / 2);
            return;
        }

        // Renderizar vídeos baseado no layout (considerando segmentos)
        switch (this.layout) {
            case 'split-vertical':
                this.renderSplitVertical();
                break;
            case 'split-horizontal':
                this.renderSplitHorizontal();
                break;
            case 'picture-in-picture':
                this.renderPictureInPicture();
                break;
        }

        // Renderizar overlay de texto
        this.renderTextOverlay();
    }

    renderSplitVertical() {
        const halfWidth = this.canvas.width / 2;
        
        // Verificar se vídeos devem ser renderizados baseado nos segmentos
        const showVideo1 = this.shouldShowVideo(1, this.currentTime);
        const showVideo2 = this.shouldShowVideo(2, this.currentTime);
        
        // Renderizar Vídeo 1 (lado esquerdo)
        this.ctx.save();
        this.applyVideoTransforms('video1', 0, 0, halfWidth, this.canvas.height);
        if (showVideo1) {
            this.ctx.fillStyle = '#ff6b6b';
        } else {
            this.ctx.fillStyle = '#333333'; // Cor mais escura quando inativo
        }
        this.ctx.fillRect(0, 0, halfWidth, this.canvas.height);
        this.ctx.restore();
        
        // Renderizar Vídeo 2 (lado direito)
        this.ctx.save();
        this.applyVideoTransforms('video2', halfWidth, 0, halfWidth, this.canvas.height);
        if (showVideo2) {
            this.ctx.fillStyle = '#4ecdc4';
        } else {
            this.ctx.fillStyle = '#333333'; // Cor mais escura quando inativo
        }
        this.ctx.fillRect(0, 0, halfWidth, this.canvas.height);
        this.ctx.restore();
        
        // Adicionar labels com indicação de status
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '16px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(`Vídeo 1 ${showVideo1 ? '(Ativo)' : '(Inativo)'}`, halfWidth / 2, 30);
        this.ctx.fillText(`Vídeo 2 ${showVideo2 ? '(Ativo)' : '(Inativo)'}`, halfWidth + halfWidth / 2, 30);
    }

    renderSplitHorizontal() {
        const halfHeight = this.canvas.height / 2;
        
        // Verificar se vídeos devem ser renderizados baseado nos segmentos
        const showVideo1 = this.shouldShowVideo(1, this.currentTime);
        const showVideo2 = this.shouldShowVideo(2, this.currentTime);
        
        // Renderizar Vídeo 1 (parte superior)
        this.ctx.save();
        this.applyVideoTransforms('video1', 0, 0, this.canvas.width, halfHeight);
        if (showVideo1) {
            this.ctx.fillStyle = '#ff6b6b';
        } else {
            this.ctx.fillStyle = '#333333';
        }
        this.ctx.fillRect(0, 0, this.canvas.width, halfHeight);
        this.ctx.restore();
        
        // Renderizar Vídeo 2 (parte inferior)
        this.ctx.save();
        this.applyVideoTransforms('video2', 0, halfHeight, this.canvas.width, halfHeight);
        if (showVideo2) {
            this.ctx.fillStyle = '#4ecdc4';
        } else {
            this.ctx.fillStyle = '#333333';
        }
        this.ctx.fillRect(0, 0, this.canvas.width, halfHeight);
        this.ctx.restore();
        
        // Adicionar labels com indicação de status
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '16px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(`Vídeo 1 ${showVideo1 ? '(Ativo)' : '(Inativo)'}`, this.canvas.width / 2, 30);
        this.ctx.fillText(`Vídeo 2 ${showVideo2 ? '(Ativo)' : '(Inativo)'}`, this.canvas.width / 2, halfHeight + 30);
    }

    renderPictureInPicture() {
        // Verificar se vídeos devem ser renderizados baseado nos segmentos
        const showVideo1 = this.shouldShowVideo(1, this.currentTime);
        const showVideo2 = this.shouldShowVideo(2, this.currentTime);
        
        // Renderizar Vídeo 1 (principal/fundo)
        this.ctx.save();
        this.applyVideoTransforms('video1', 0, 0, this.canvas.width, this.canvas.height);
        if (showVideo1) {
            this.ctx.fillStyle = '#ff6b6b';
        } else {
            this.ctx.fillStyle = '#333333';
        }
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.restore();
        
        // Vídeo secundário (picture-in-picture)
        const pipWidth = this.canvas.width * 0.3;
        const pipHeight = this.canvas.height * 0.25;
        const pipX = this.canvas.width - pipWidth - 20;
        const pipY = 20;
        
        // Renderizar Vídeo 2 (PiP)
        this.ctx.save();
        this.applyVideoTransforms('video2', pipX, pipY, pipWidth, pipHeight);
        if (showVideo2) {
            this.ctx.fillStyle = '#4ecdc4';
        } else {
            this.ctx.fillStyle = '#333333';
        }
        this.ctx.fillRect(0, 0, pipWidth, pipHeight);
        this.ctx.restore();
        
        // Borda do PiP
        this.ctx.strokeStyle = showVideo2 ? '#ffffff' : '#666666';
        this.ctx.lineWidth = 3;
        this.ctx.strokeRect(pipX, pipY, pipWidth, pipHeight);
        
        // Labels com indicação de status
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '16px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(`Vídeo Principal ${showVideo1 ? '(Ativo)' : '(Inativo)'}`, this.canvas.width / 2, this.canvas.height - 30);
        this.ctx.fillText(`Vídeo 2 ${showVideo2 ? '(Ativo)' : '(Inativo)'}`, pipX + pipWidth / 2, pipY + pipHeight / 2);
    }

    renderTextOverlay() {
        if (!this.textOverlay.text || this.textOverlay.text === 'Digite seu texto aqui...') return;

        // Configurar estilo do texto
        this.ctx.font = `${this.textOverlay.fontSize}px Arial`;
        this.ctx.textAlign = 'center';
        
        // Calcular posição
        let x = this.canvas.width / 2;
        let y;
        
        switch (this.textOverlay.position) {
            case 'top':
                y = 80;
                break;
            case 'center':
                y = this.canvas.height / 2;
                break;
            case 'bottom':
                y = this.canvas.height - 80;
                break;
        }

        // Medir texto para background
        const textMetrics = this.ctx.measureText(this.textOverlay.text);
        const textWidth = textMetrics.width;
        const textHeight = this.textOverlay.fontSize;
        
        // Desenhar background
        const padding = 20;
        const bgOpacity = this.textOverlay.opacity / 100;
        this.ctx.fillStyle = this.hexToRgba(this.textOverlay.backgroundColor, bgOpacity);
        this.ctx.fillRect(
            x - textWidth / 2 - padding,
            y - textHeight / 2 - padding / 2,
            textWidth + padding * 2,
            textHeight + padding
        );
        
        // Desenhar texto
        this.ctx.fillStyle = this.textOverlay.color;
        this.ctx.fillText(this.textOverlay.text, x, y + textHeight / 4);
    }

    updateTextOverlay() {
        const textBox = document.getElementById('text-box');
        textBox.textContent = this.textOverlay.text;
        textBox.style.fontSize = this.textOverlay.fontSize + 'px';
        textBox.style.color = this.textOverlay.color;
        textBox.style.backgroundColor = this.hexToRgba(this.textOverlay.backgroundColor, this.textOverlay.opacity / 100);
        
        this.renderFrame();
    }

    // Funções de gerenciamento de segmentos
    addSegment(startTime, endTime, videoNumber, active = true) {
        // Se não foram fornecidos parâmetros, criar segmento baseado no tempo atual
        if (arguments.length === 0) {
            let segmentStartTime = this.currentTime;
            let segmentEndTime;
            
            // Se há seleção ativa, limitar o segmento à seleção
            if (this.videoSelectionActive) {
                segmentStartTime = Math.max(segmentStartTime, this.videoSelectionStart);
                segmentEndTime = Math.min(segmentStartTime + 10, this.videoSelectionEnd);
                
                if (segmentStartTime >= this.videoSelectionEnd) {
                    alert('Não é possível adicionar segmento fora da seleção ativa!');
                    return;
                }
            } else {
                segmentEndTime = Math.min(segmentStartTime + 10, this.videoDuration);
            }
            
            startTime = segmentStartTime;
            endTime = segmentEndTime;
            videoNumber = 1; // Vídeo 1 por padrão
            active = true;
        }
        
        const segment = {
            id: ++this.segmentIdCounter,
            startTime: parseFloat(startTime),
            endTime: parseFloat(endTime),
            videoNumber: parseInt(videoNumber),
            active: active
        };
        
        this.segments.push(segment);
        this.updateTimelineDisplay();
        return segment;
    }

    deleteSegment(segmentId) {
        this.segments = this.segments.filter(s => s.id !== segmentId);
        if (this.currentSegment && this.currentSegment.id === segmentId) {
            this.currentSegment = null;
            this.clearSegmentEditor();
        }
        this.updateTimelineDisplay();
    }

    updateSegment(segmentId, updates) {
        const segment = this.segments.find(s => s.id === segmentId);
        if (segment) {
            Object.assign(segment, updates);
            this.updateTimelineDisplay();
        }
    }

    selectSegment(segmentId) {
        this.currentSegment = this.segments.find(s => s.id === segmentId);
        if (this.currentSegment) {
            this.populateSegmentEditor(this.currentSegment);
            document.getElementById('segment-editor').style.display = 'block';
        }
        this.updateTimelineDisplay();
    }

    clearAllSegments() {
        this.segments = [];
        this.currentSegment = null;
        this.clearSegmentEditor();
        this.updateTimelineDisplay();
    }

    updateTimelineDisplay() {
        const container = document.querySelector('.segments-container');
        if (!container) return;

        container.innerHTML = '';

        // Criar régua de tempo
        this.createTimelineRuler();

        // Adicionar indicador de seleção de vídeo se ativo
        if (this.videoSelectionActive) {
            const selectionElement = document.createElement('div');
            selectionElement.className = 'video-selection-indicator';
            selectionElement.style.position = 'absolute';
            selectionElement.style.left = `${(this.videoSelectionStart / this.videoDuration) * 100}%`;
            selectionElement.style.width = `${((this.videoSelectionEnd - this.videoSelectionStart) / this.videoDuration) * 100}%`;
            selectionElement.style.height = '100%';
            selectionElement.style.backgroundColor = 'rgba(76, 175, 80, 0.3)';
            selectionElement.style.border = '2px solid #4CAF50';
            selectionElement.style.borderRadius = '4px';
            selectionElement.style.pointerEvents = 'none';
            selectionElement.style.zIndex = '1';
            
            // Adicionar label da seleção
            const selectionLabel = document.createElement('div');
            selectionLabel.textContent = 'Seleção Ativa';
            selectionLabel.style.position = 'absolute';
            selectionLabel.style.top = '-25px';
            selectionLabel.style.left = '50%';
            selectionLabel.style.transform = 'translateX(-50%)';
            selectionLabel.style.fontSize = '12px';
            selectionLabel.style.color = '#4CAF50';
            selectionLabel.style.fontWeight = 'bold';
            selectionLabel.style.whiteSpace = 'nowrap';
            selectionElement.appendChild(selectionLabel);
            
            container.appendChild(selectionElement);
        }

        // Renderizar segmentos
        this.segments.forEach(segment => {
            const segmentElement = this.createSegmentElement(segment);
            container.appendChild(segmentElement);
        });
    }

    createTimelineRuler() {
        const ruler = document.querySelector('.timeline-ruler');
        if (!ruler) return;

        ruler.innerHTML = '';
        
        const timelineWidth = ruler.offsetWidth;
        const markersCount = 10;
        
        for (let i = 0; i <= markersCount; i++) {
            const marker = document.createElement('div');
            marker.className = 'time-marker';
            marker.style.left = `${(i / markersCount) * 100}%`;
            
            const time = (i / markersCount) * this.videoDuration;
            marker.textContent = this.formatTime(time);
            
            ruler.appendChild(marker);
        }
    }

    createSegmentElement(segment) {
        const element = document.createElement('div');
        element.className = `segment-item video${segment.videoNumber}`;
        element.dataset.segmentId = segment.id;
        
        if (!segment.active) {
            element.classList.add('inactive');
        }
        
        if (this.currentSegment && this.currentSegment.id === segment.id) {
            element.classList.add('selected');
        }

        // Calcular posição e largura baseado no tempo
        const startPercent = (segment.startTime / this.videoDuration) * 100;
        const widthPercent = ((segment.endTime - segment.startTime) / this.videoDuration) * 100;
        
        element.style.left = `${startPercent}%`;
        element.style.width = `${widthPercent}%`;
        element.style.zIndex = '2';
        
        element.textContent = `${this.formatTime(segment.startTime)} - ${this.formatTime(segment.endTime)}`;
        
        element.addEventListener('click', () => {
            this.selectSegment(segment.id);
        });
        
        return element;
    }

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    populateSegmentEditor(segment) {
        document.getElementById('segment-start').value = segment.startTime;
        document.getElementById('segment-end').value = segment.endTime;
        document.getElementById('segment-video').value = `video${segment.videoNumber}`;
        document.getElementById('segment-active').checked = segment.active;
    }

    clearSegmentEditor() {
        document.getElementById('segment-start').value = '';
        document.getElementById('segment-end').value = '';
        document.getElementById('segment-video').value = 'video1';
        document.getElementById('segment-active').checked = true;
    }

    saveSegmentFromEditor() {
        const startTime = parseFloat(document.getElementById('segment-start').value);
        const endTime = parseFloat(document.getElementById('segment-end').value);
        const videoValue = document.getElementById('segment-video').value;
        const videoNumber = videoValue === 'video1' ? 1 : 2;
        const active = document.getElementById('segment-active').checked;

        if (isNaN(startTime) || isNaN(endTime) || startTime >= endTime) {
            alert('Por favor, insira tempos válidos (início deve ser menor que fim)');
            return;
        }

        // Validar limites baseados na seleção ativa
        let minTime = 0;
        let maxTime = this.videoDuration;
        
        if (this.videoSelectionActive) {
            minTime = this.videoSelectionStart;
            maxTime = this.videoSelectionEnd;
        }
        
        if (startTime < minTime || endTime > maxTime) {
            if (this.videoSelectionActive) {
                alert(`Os tempos devem estar dentro da seleção ativa (${this.formatTime(minTime)} - ${this.formatTime(maxTime)})!`);
            } else {
                alert(`Tempo final não pode ser maior que ${this.videoDuration} segundos`);
            }
            return;
        }

        if (this.currentSegment) {
            // Atualizar segmento existente
            this.updateSegment(this.currentSegment.id, {
                startTime,
                endTime,
                videoNumber,
                active
            });
        } else {
            // Criar novo segmento
            this.addSegment(startTime, endTime, videoNumber, active);
        }

        this.clearSegmentEditor();
        this.currentSegment = null;
    }

    deleteCurrentSegment() {
        if (this.currentSegment) {
            if (confirm('Tem certeza que deseja excluir este segmento?')) {
                this.deleteSegment(this.currentSegment.id);
            }
        }
    }

    // Função para verificar se um tempo está em um segmento ativo
    isTimeInActiveSegment(time, videoNumber) {
        return this.segments.some(segment => 
            segment.active && 
            segment.videoNumber === videoNumber &&
            time >= segment.startTime && 
            time <= segment.endTime
        );
    }

    // Função para determinar se um vídeo deve ser mostrado no tempo atual
    shouldShowVideo(videoNumber, currentTime) {
        // Verificar se o tempo atual está dentro da seleção de vídeo
        if (this.videoSelectionActive) {
            if (currentTime < this.videoSelectionStart || currentTime > this.videoSelectionEnd) {
                return false;
            }
        }
        
        // Se não há segmentos definidos, mostrar sempre
        if (this.segments.length === 0) {
            return true;
        }
        
        // Verificar se existe algum segmento ativo para este vídeo no tempo atual
        return this.isTimeInActiveSegment(currentTime, videoNumber);
    }

    // Função para obter informações do segmento atual
    getCurrentSegmentInfo() {
        const activeSegments = this.segments.filter(segment => {
            return segment.active && 
                   this.currentTime >= segment.startTime && 
                   this.currentTime <= segment.endTime;
        });
        
        return {
             video1Active: activeSegments.some(s => s.videoNumber === 1),
             video2Active: activeSegments.some(s => s.videoNumber === 2),
             activeSegments: activeSegments
         };
     }

     // Função para atualizar controles de tempo
     updateTimeControls() {
         const timeSlider = document.getElementById('timeSlider');
         const maxTimeDisplay = document.getElementById('maxTimeDisplay');
         
         if (timeSlider) {
             timeSlider.max = this.videoDuration;
         }
         
         if (maxTimeDisplay) {
             maxTimeDisplay.textContent = this.formatTime(this.videoDuration);
         }
         
         // Atualizar controles de seleção de vídeo
         this.updateVideoSelectionControls();
     }
     
     updateVideoSelectionControls() {
         const startInput = document.getElementById('video-start-time');
         const endInput = document.getElementById('video-end-time');
         
         if (startInput && endInput) {
             startInput.max = this.videoDuration;
             endInput.max = this.videoDuration;
             
             if (!this.videoSelectionActive) {
                 startInput.value = 0;
                 endInput.value = this.videoDuration;
                 this.videoSelectionStart = 0;
                 this.videoSelectionEnd = this.videoDuration;
             }
             
             this.updateSelectionDuration();
         }
     }
     
     updateSelectionDuration() {
         const startInput = document.getElementById('video-start-time');
         const endInput = document.getElementById('video-end-time');
         const durationDisplay = document.getElementById('selection-duration');
         const warningDiv = document.getElementById('selection-warning');
         
         if (startInput && endInput && durationDisplay) {
             const start = parseFloat(startInput.value) || 0;
             const end = parseFloat(endInput.value) || 0;
             const duration = Math.max(0, end - start);
             
             durationDisplay.textContent = `Duração: ${this.formatTime(duration)}`;
             
             // Verificar limite de 4 minutos (240 segundos)
             if (duration > 240) {
                 warningDiv.style.display = 'block';
                 durationDisplay.style.color = '#f44336';
             } else {
                 warningDiv.style.display = 'none';
                 durationDisplay.style.color = '#4CAF50';
             }
         }
     }

    applyVideoTransforms(videoKey, x, y, width, height) {
        const settings = this.videoSettings[videoKey];
        
        // Aplicar transformações
        this.ctx.translate(x + width/2, y + height/2);
        this.ctx.rotate(settings.rotation * Math.PI / 180);
        this.ctx.scale(settings.scale, settings.scale);
        this.ctx.translate(-width/2 + settings.x, -height/2 + settings.y);
        
        // Aplicar filtros
        const brightness = settings.brightness / 100;
        const contrast = settings.contrast / 100;
        const saturation = settings.saturation / 100;
        const opacity = settings.opacity / 100;
        
        this.ctx.filter = `brightness(${brightness}) contrast(${contrast}) saturate(${saturation})`;
        this.ctx.globalAlpha = opacity;
    }

    hexToRgba(hex, alpha) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    togglePlayPause() {
        const btn = document.getElementById('play-pause-btn');
        
        if (this.isPlaying) {
            this.pause();
            btn.innerHTML = '<i class="fas fa-play"></i> Play';
        } else {
            this.play();
            btn.innerHTML = '<i class="fas fa-pause"></i> Pause';
        }
    }

    play() {
        if (!this.videos.video1 || !this.videos.video2) {
            alert('Carregue ambos os vídeos antes de reproduzir');
            return;
        }
        
        this.isPlaying = true;
        this.animate();
    }

    pause() {
        this.isPlaying = false;
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
    }

    animate() {
        if (!this.isPlaying) return;
        
        this.currentTime += 1/30; // 30 FPS
        
        if (this.currentTime >= this.duration) {
            this.currentTime = 0;
        }
        
        // Atualizar timeline
        const progress = (this.currentTime / this.duration) * 100;
        document.getElementById('timeline').value = progress;
        
        // Atualizar display de tempo
        const currentMin = Math.floor(this.currentTime / 60);
        const currentSec = Math.floor(this.currentTime % 60);
        const totalMin = Math.floor(this.duration / 60);
        const totalSec = Math.floor(this.duration % 60);
        
        document.getElementById('time-display').textContent = 
            `${currentMin.toString().padStart(2, '0')}:${currentSec.toString().padStart(2, '0')} / ${totalMin.toString().padStart(2, '0')}:${totalSec.toString().padStart(2, '0')}`;
        
        this.renderFrame();
        this.animationFrame = requestAnimationFrame(() => this.animate());
    }

    async exportVideo() {
        if (!this.videos.video1 || !this.videos.video2) {
            alert('Carregue ambos os vídeos antes de exportar');
            return;
        }

        const exportBtn = document.getElementById('export-btn');
        const progressDiv = document.getElementById('export-progress');
        const progressFill = progressDiv.querySelector('.progress-fill');
        const progressText = progressDiv.querySelector('.progress-text');

        try {
            // Mostrar progresso
            exportBtn.style.display = 'none';
            progressDiv.style.display = 'block';
            
            // Simular processo de exportação
            for (let i = 0; i <= 100; i += 10) {
                progressFill.style.width = i + '%';
                progressText.textContent = `Processando... ${i}%`;
                await this.sleep(200);
            }

            // Criar blob do canvas como vídeo simulado
            const canvas = document.createElement('canvas');
            canvas.width = this.canvas.width;
            canvas.height = this.canvas.height;
            const ctx = canvas.getContext('2d');
            
            // Copiar frame atual
            ctx.drawImage(this.canvas, 0, 0);
            
            // Converter para blob
            canvas.toBlob((blob) => {
                // Criar link de download
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `fabrica-naie-video-${Date.now()}.png`; // Simulando como imagem
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                
                // Resetar interface
                exportBtn.style.display = 'flex';
                progressDiv.style.display = 'none';
                progressFill.style.width = '0%';
                
                alert('Vídeo exportado com sucesso!\n\nNota: Esta é uma versão de demonstração. O arquivo exportado é uma imagem do frame atual.');
            }, 'image/png');

        } catch (error) {
            console.error('Erro na exportação:', error);
            alert('Erro ao exportar o vídeo. Tente novamente.');
            
            // Resetar interface
            exportBtn.style.display = 'flex';
            progressDiv.style.display = 'none';
            progressFill.style.width = '0%';
        }
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    showLoading(show) {
        const overlay = document.getElementById('loading-overlay');
        overlay.style.display = show ? 'flex' : 'none';
    }

    showSuccessMessage() {
        // Criar notificação de sucesso
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(45deg, #2ed573, #1e90ff);
            color: white;
            padding: 15px 25px;
            border-radius: 10px;
            box-shadow: 0 10px 25px rgba(46, 213, 115, 0.3);
            z-index: 1001;
            font-weight: 600;
            animation: slideIn 0.3s ease-out;
        `;
        notification.innerHTML = '<i class="fas fa-check-circle"></i> Ambos os vídeos carregados! Você pode começar a editar.';
        
        document.body.appendChild(notification);
        
        // Remover após 3 segundos
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Funções globais para compatibilidade com HTML
function loadVideo(videoNumber) {
    window.fabricaNaie.loadVideo(videoNumber);
}

function togglePlayPause() {
    window.fabricaNaie.togglePlayPause();
}

function exportVideo() {
    window.fabricaNaie.exportVideo();
}

function resetVideo1Settings() {
    window.fabricaNaie.videoSettings.video1 = {
        x: 0, y: 0, scale: 1, rotation: 0,
        brightness: 100, contrast: 100, saturation: 100, opacity: 100, speed: 1
    };
    
    // Atualizar controles na interface
    updateVideoControlsDisplay('video1');
    window.fabricaNaie.renderFrame();
}

function resetVideo2Settings() {
    window.fabricaNaie.videoSettings.video2 = {
        x: 0, y: 0, scale: 1, rotation: 0,
        brightness: 100, contrast: 100, saturation: 100, opacity: 100, speed: 1
    };
    
    // Atualizar controles na interface
    updateVideoControlsDisplay('video2');
    window.fabricaNaie.renderFrame();
}

function updateVideoControlsDisplay(videoKey) {
    const settings = window.fabricaNaie.videoSettings[videoKey];
    
    // Atualizar sliders e valores
    document.getElementById(`${videoKey}-x`).value = settings.x;
    document.getElementById(`${videoKey}-x-value`).textContent = settings.x + 'px';
    
    document.getElementById(`${videoKey}-y`).value = settings.y;
    document.getElementById(`${videoKey}-y-value`).textContent = settings.y + 'px';
    
    document.getElementById(`${videoKey}-scale`).value = settings.scale;
    document.getElementById(`${videoKey}-scale-value`).textContent = Math.round(settings.scale * 100) + '%';
    
    document.getElementById(`${videoKey}-rotation`).value = settings.rotation;
    document.getElementById(`${videoKey}-rotation-value`).textContent = settings.rotation + '°';
    
    document.getElementById(`${videoKey}-brightness`).value = settings.brightness;
    document.getElementById(`${videoKey}-brightness-value`).textContent = settings.brightness + '%';
    
    document.getElementById(`${videoKey}-contrast`).value = settings.contrast;
    document.getElementById(`${videoKey}-contrast-value`).textContent = settings.contrast + '%';
    
    document.getElementById(`${videoKey}-saturation`).value = settings.saturation;
    document.getElementById(`${videoKey}-saturation-value`).textContent = settings.saturation + '%';
    
    document.getElementById(`${videoKey}-opacity`).value = settings.opacity;
    document.getElementById(`${videoKey}-opacity-value`).textContent = settings.opacity + '%';
    
    document.getElementById(`${videoKey}-speed`).value = settings.speed;
    document.getElementById(`${videoKey}-speed-value`).textContent = settings.speed + 'x';
}

// Inicializar aplicação quando DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    window.fabricaNaie = new FabricaNaie();
    
    // Funções globais para os botões (chamadas via onclick)
    window.addSegment = function() {
        window.fabricaNaie.clearSegmentEditor();
        window.fabricaNaie.currentSegment = null;
        document.getElementById('segment-editor').style.display = 'block';
    };

    window.clearAllSegments = function() {
        if (confirm('Tem certeza que deseja limpar todos os segmentos?')) {
            window.fabricaNaie.clearAllSegments();
        }
    };

    window.saveSegment = function() {
        window.fabricaNaie.saveSegmentFromEditor();
        document.getElementById('segment-editor').style.display = 'none';
    };

    window.deleteSegment = function() {
        window.fabricaNaie.deleteCurrentSegment();
        document.getElementById('segment-editor').style.display = 'none';
    };

    window.cancelSegmentEdit = function() {
        window.fabricaNaie.clearSegmentEditor();
        window.fabricaNaie.currentSegment = null;
        window.fabricaNaie.updateTimelineDisplay();
        document.getElementById('segment-editor').style.display = 'none';
    };

    // Funções globais para seleção de vídeo
    window.applyVideoSelection = function() {
        const startInput = document.getElementById('video-start-time');
        const endInput = document.getElementById('video-end-time');
        
        if (startInput && endInput) {
            const start = parseFloat(startInput.value) || 0;
            const end = parseFloat(endInput.value) || 0;
            const duration = end - start;
            
            // Validar duração máxima de 4 minutos
            if (duration > 240) {
                alert('A duração selecionada não pode exceder 4 minutos!');
                return;
            }
            
            if (start >= end) {
                alert('O tempo de início deve ser menor que o tempo de fim!');
                return;
            }
            
            window.fabricaNaie.videoSelectionStart = start;
            window.fabricaNaie.videoSelectionEnd = end;
            window.fabricaNaie.videoSelectionActive = true;
            
            // Atualizar timeline para mostrar apenas a parte selecionada
            window.fabricaNaie.updateTimeControls();
            window.fabricaNaie.renderFrame();
            
            alert(`Seleção aplicada: ${window.fabricaNaie.formatTime(start)} - ${window.fabricaNaie.formatTime(end)}`);
        }
    };

    window.resetVideoSelection = function() {
        window.fabricaNaie.videoSelectionStart = 0;
        window.fabricaNaie.videoSelectionEnd = window.fabricaNaie.videoDuration;
        window.fabricaNaie.videoSelectionActive = false;
        
        const startInput = document.getElementById('video-start-time');
        const endInput = document.getElementById('video-end-time');
        
        if (startInput && endInput) {
            startInput.value = 0;
            endInput.value = window.fabricaNaie.videoDuration;
        }
        
        window.fabricaNaie.updateSelectionDuration();
        window.fabricaNaie.renderFrame();
        
        alert('Seleção resetada para o vídeo completo');
    };

    // Event listener para controle de tempo
        document.getElementById('timeSlider').addEventListener('input', function(e) {
            window.fabricaNaie.currentTime = parseFloat(e.target.value);
            document.getElementById('currentTimeDisplay').textContent = window.fabricaNaie.formatTime(window.fabricaNaie.currentTime);
            window.fabricaNaie.renderFrame();
        });
        
        // Event listeners para seleção de vídeo
        const startInput = document.getElementById('video-start-time');
        const endInput = document.getElementById('video-end-time');
        
        if (startInput) {
            startInput.addEventListener('input', () => {
                window.fabricaNaie.updateSelectionDuration();
            });
        }
        
        if (endInput) {
            endInput.addEventListener('input', () => {
                window.fabricaNaie.updateSelectionDuration();
            });
        }
    
    // Adicionar animação de entrada
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
    
    console.log('🎬 Fábrica de Naiê inicializada com sucesso!');
});