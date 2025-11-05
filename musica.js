// ==========================
// SISTEMA DE MÚSICA COM PERSISTÊNCIA COMPLETA
// ==========================

// Configuração da playlist
const playlist = [
  "musicas/som1.mp3",
  "musicas/som2.mp3",
  "musicas/som3.mp3",
  "musicas/som4.mp3"
];

// Variáveis globais
let indice = 0;
let audio = null;
let icone = null;
let playPauseBtn = null;
let volumeSlider = null;
let progressBar = null;
let currentTimeDisplay = null;
let durationDisplay = null;
let proximaMusicaBtn = null;

// Chave única para localStorage (compartilhada entre todas as abas)
const STORAGE_KEY = 'musicPlayerState';

// ==========================
// FUNÇÕES DE PERSISTÊNCIA
// ==========================

function saveState() {
  if (!audio) return;
  
  const state = {
    indice: indice,
    volume: audio.volume,
    currentTime: audio.currentTime,
    isPaused: audio.paused,
    timestamp: Date.now()
  };
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return null;
  
  try {
    return JSON.parse(saved);
  } catch (e) {
    console.error("Erro ao carregar estado:", e);
    return null;
  }
}

function syncWithOtherTabs() {
  const state = loadState();
  if (!state || !audio) return;
  
  // Sincronizar apenas se o timestamp for recente (últimos 2 segundos)
  const timeDiff = Date.now() - state.timestamp;
  if (timeDiff > 2000) return;
  
  // Sincronizar índice da música
  if (state.indice !== indice) {
    indice = state.indice;
    audio.src = playlist[indice];
  }
  
  // Sincronizar volume
  if (Math.abs(audio.volume - state.volume) > 0.01) {
    audio.volume = state.volume;
    if (volumeSlider) volumeSlider.value = state.volume;
  }
  
  // Sincronizar tempo (com tolerância de 1 segundo)
  if (Math.abs(audio.currentTime - state.currentTime) > 1) {
    audio.currentTime = state.currentTime;
  }
  
  // Sincronizar estado de play/pause
  if (state.isPaused && !audio.paused) {
    audio.pause();
    updatePlayPauseButton(true);
  } else if (!state.isPaused && audio.paused) {
    audio.play().catch(() => {});
    updatePlayPauseButton(false);
  }
}

// ==========================
// INICIALIZAÇÃO
// ==========================

function initMusicPlayer() {
  // Obter elementos do DOM
  audio = document.getElementById("audioMusica");
  icone = document.getElementById("iconeMusica");
  playPauseBtn = document.getElementById("playPauseBtn");
  volumeSlider = document.getElementById("controleVolume");
  progressBar = document.getElementById("progressBar");
  currentTimeDisplay = document.getElementById("currentTime");
  durationDisplay = document.getElementById("duration");
  proximaMusicaBtn = document.getElementById("proximaMusicaBtn");
  
  if (!audio) {
    console.error("Elemento de áudio não encontrado!");
    return;
  }
  
  // Carregar estado salvo
  const savedState = loadState();
  if (savedState) {
    indice = savedState.indice || 0;
    audio.volume = savedState.volume || 1;
    if (volumeSlider) volumeSlider.value = audio.volume;
  } else {
    // Estado inicial padrão
    indice = Math.floor(Math.random() * playlist.length);
    audio.volume = 1;
    if (volumeSlider) volumeSlider.value = 1;
  }
  
  // Configurar fonte de áudio
  audio.src = playlist[indice];
  
  // Restaurar tempo se houver
  if (savedState && savedState.currentTime) {
    audio.currentTime = savedState.currentTime;
  }
  
  // Configurar eventos
  setupEventListeners();
  
  // Tentar reproduzir automaticamente
  if (savedState && !savedState.isPaused) {
    audio.play().then(() => {
      updatePlayPauseButton(false);
      if (icone) icone.classList.add("girando");
    }).catch(() => {
      console.log("Reprodução automática bloqueada pelo navegador");
      updatePlayPauseButton(true);
    });
  } else {
    updatePlayPauseButton(true);
  }
  
  // Sincronizar com outras abas a cada 500ms
  setInterval(syncWithOtherTabs, 500);
  
  // Salvar estado periodicamente (a cada 1 segundo)
  setInterval(saveState, 1000);
  
  // Escutar mudanças no localStorage (de outras abas)
  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY) {
      syncWithOtherTabs();
    }
  });
}

// ==========================
// CONFIGURAÇÃO DE EVENTOS
// ==========================

function setupEventListeners() {
  // Botão Play/Pause
  if (playPauseBtn) {
    playPauseBtn.addEventListener("click", toggleMusica);
  }
  
  // Botão Próxima Música
  if (proximaMusicaBtn) {
    proximaMusicaBtn.addEventListener("click", proximaMusica);
  }
  
  // Controle de Volume
  if (volumeSlider) {
    volumeSlider.addEventListener("input", () => {
      audio.volume = volumeSlider.value;
      saveState();
    });
  }
  
  // Barra de Progresso
  if (progressBar) {
    progressBar.addEventListener("input", () => {
      audio.currentTime = (progressBar.value / 100) * audio.duration;
      saveState();
    });
  }
  
  // Atualizar barra de progresso durante reprodução
  audio.addEventListener("timeupdate", updateProgress);
  
  // Quando a música termina
  audio.addEventListener("ended", tocarProxima);
  
  // Quando os metadados são carregados
  audio.addEventListener("loadedmetadata", () => {
    updateDuration();
  });
  
  // Salvar estado quando a página é fechada
  window.addEventListener("beforeunload", saveState);
  
  // Salvar estado quando a aba perde foco
  window.addEventListener("blur", saveState);
  
  // Sincronizar quando a aba ganha foco
  window.addEventListener("focus", syncWithOtherTabs);
}

// ==========================
// CONTROLES DE MÚSICA
// ==========================

function toggleMusica() {
  if (audio.paused) {
    audio.play().then(() => {
      updatePlayPauseButton(false);
      if (icone) icone.classList.add("girando");
      saveState();
    }).catch((error) => {
      console.error("Erro ao reproduzir:", error);
    });
  } else {
    audio.pause();
    updatePlayPauseButton(true);
    if (icone) icone.classList.remove("girando");
    saveState();
  }
}

function proximaMusica() {
  tocarProxima();
}

function tocarProxima() {
  indice = (indice + 1) % playlist.length;
  audio.src = playlist[indice];
  audio.addEventListener("canplaythrough", () => {
    audio.play().catch(() => {}); // caso bloqueado
    icone.classList.add("girando");
  });
}

// ==========================
// ATUALIZAÇÃO DE UI
// ==========================

function updatePlayPauseButton(isPaused) {
  if (!playPauseBtn) return;
  
  if (isPaused) {
    playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
  } else {
    playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
  }
}

function updateProgress() {
  if (!audio || !progressBar) return;
  
  const progress = (audio.currentTime / audio.duration) * 100;
  progressBar.value = progress || 0;
  
  if (currentTimeDisplay) {
    currentTimeDisplay.textContent = formatTime(audio.currentTime);
  }
}

function updateDuration() {
  if (!audio || !durationDisplay) return;
  durationDisplay.textContent = formatTime(audio.duration);
}

function formatTime(seconds) {
  if (isNaN(seconds)) return "0:00";
  
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// ==========================
// INICIALIZAR QUANDO O DOM ESTIVER PRONTO
// ==========================

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMusicPlayer);
} else {
  initMusicPlayer();
}

