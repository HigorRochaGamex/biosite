// ==========================
// MÚSICA
// ==========================

const playlist = [
  "musicas/som1.mp3",
  "musicas/som2.mp3",
  "musicas/som3.mp3",
  "musicas/som4.mp3"
];

let indice = Math.floor(Math.random() * playlist.length);
const audio = document.getElementById("audioMusica");
const icone = document.getElementById("iconeMusica");
const playPauseBtn = document.getElementById("playPauseBtn");
const volumeSlider = document.getElementById("controleVolume");

const volumeSalvo = localStorage.getItem("volumeMusica");
if (volumeSalvo !== null) {
  audio.volume = parseFloat(volumeSalvo);
  volumeSlider.value = volumeSalvo;
} else {
  audio.volume = 1;
  volumeSlider.value = 1;
}

audio.src = playlist[indice];
audio.play().catch(() => {}); // caso bloqueado
icone.classList.add("girando");

function tocarProxima() {
  indice = (indice + 1) % playlist.length;
  audio.src = playlist[indice];
  audio.play();
}

audio.addEventListener("ended", tocarProxima);

function toggleMusica() {
  if (audio.paused) {
    audio.play();
    icone.classList.add("girando");
    playPauseBtn.innerHTML = `<i class="fas fa-pause"></i>`;
  } else {
    audio.pause();
    icone.classList.remove("girando");
    playPauseBtn.innerHTML = `<i class="fas fa-play"></i>`;
  }
}

function proximaMusica() {
  tocarProxima();
}

volumeSlider.addEventListener("input", () => {
  audio.volume = volumeSlider.value;
  localStorage.setItem("volumeMusica", volumeSlider.value);
});

function tentarTocarAutomaticamente() {
  const interagir = () => {
    if (audio.paused) {
      audio.play().then(() => {
        icone.classList.add("girando");
        playPauseBtn.innerHTML = `<i class="fas fa-pause"></i>`;
      });
    }
    window.removeEventListener('click', interagir);
    window.removeEventListener('mousemove', interagir);
    window.removeEventListener('touchstart', interagir);
  };

  window.addEventListener('click', interagir);
  window.addEventListener('mousemove', interagir);
  window.addEventListener('touchstart', interagir);
}
tentarTocarAutomaticamente();


// ==========================
// CATEGORIAS & PROJETOS
// ==========================

function toggleCategorias() {
  const categorias = document.getElementById("categoriasProjetos");
  const visivel = categorias.style.display === "block";
  categorias.style.display = visivel ? "none" : "block";

  if (!visivel) return;
  esconderTodasCategorias(); // se for esconder categorias, fecha os projetos também
}

function toggleCategoria(nome) {
  const id = "projetos" + capitalize(nome);
  const atual = document.getElementById(id);
  const estaVisivel = atual.style.display === "block";

  esconderTodasCategorias();

  if (!estaVisivel) {
    atual.style.display = "block";
  }
}

function esconderTodasCategorias() {
  const seções = document.querySelectorAll(".projetos-categoria");
  seções.forEach(secao => {
    secao.style.display = "none";
  });
}

function capitalize(texto) {
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}


// ==========================
// MODAL DE CONFIRMAÇÃO
// ==========================

function abrirConfirmacao(nomeProjeto, link) {
  const modal = document.getElementById("confirmacaoModal");
  const nome = document.getElementById("nomeProjeto");
  const continuarBtn = document.getElementById("botaoContinuar");
  const cancelarBtn = document.getElementById("botaoCancelar");

  nome.textContent = nomeProjeto;
  modal.style.display = "flex";

  continuarBtn.onclick = () => {
    modal.style.display = "none";
    window.open(link, "_blank");
  };

  cancelarBtn.onclick = () => {
    modal.style.display = "none";
  };
}
