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

// Função para abrir e fechar o menu lateral
function toggleMenuLateral() {
  const menu = document.getElementById("menuLateral");
  const menuBtn = document.getElementById("menuLateralBtn");

  if (!menu || !menuBtn) {
    console.error("Menu ou botão do menu lateral não encontrado.");
    return;
  }

  console.log("Toggle menu lateral chamado");

  menu.classList.toggle("oculto");

  // Ocultar ou mostrar o botão de abrir menu
  if (menu.classList.contains("oculto")) {
    console.log("Menu oculto");
    menuBtn.style.display = "block";
  } else {
    console.log("Menu visível");
    menuBtn.style.display = "none";
  }
}

// Função para exibir a seção correspondente ao botão clicado
function mostrarSecao(secaoId) {
  // Ocultar elementos iniciais
  document.querySelector(".perfil").style.display = "none";
  document.getElementById("menuLateral").style.display = "none";

  // Exibir a seção correspondente
  const secoes = document.querySelectorAll(".menu-section");
  secoes.forEach(secao => secao.style.display = "none");

  document.getElementById(secaoId).style.display = "block";
}

// Adicionar eventos aos botões do menu
const botoesMenu = {
  "Discord Servers": "discord-section",
  "Youtube Canais": "youtube-section",
  "Projetos": "projetos-section"
};

document.querySelectorAll("#menuLateral ul li a").forEach(link => {
  const texto = link.textContent.trim();
  if (botoesMenu[texto]) {
    link.addEventListener("click", (event) => {
      event.preventDefault(); // Prevenir comportamento padrão do link
      mostrarSecao(botoesMenu[texto]);
    });
  }
});

function carregarMenu() {
  // Adicionar um indicador de carregamento
  const loadingIndicator = document.createElement("div");
  loadingIndicator.id = "menuLoadingIndicator";
  loadingIndicator.style.position = "fixed";
  loadingIndicator.style.top = "0";
  loadingIndicator.style.left = "0";
  loadingIndicator.style.width = "100%";
  loadingIndicator.style.height = "100%";
  loadingIndicator.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
  loadingIndicator.style.color = "white";
  loadingIndicator.style.display = "flex";
  loadingIndicator.style.alignItems = "center";
  loadingIndicator.style.justifyContent = "center";
  loadingIndicator.style.zIndex = "9999";
  loadingIndicator.textContent = "Carregando menu...";
  document.body.appendChild(loadingIndicator);

  fetch("menu.html")
    .then(response => {
      if (!response.ok) {
        throw new Error("Erro ao carregar o menu lateral.");
      }
      return response.text();
    })
    .then(html => {
      const container = document.createElement("div");
      container.innerHTML = html;
      document.body.prepend(container);

      // Garantir que a chuva seja inicializada após interação do usuário
      const iniciarChuvaMenu = () => {
        const rainMenuCanvas = document.getElementById("rainMenu");
        if (rainMenuCanvas) {
          initializeRain("rainMenu", 50); // Densidade reduzida para o menu
        } else {
          console.error("Canvas rainMenu não encontrado no menu lateral.");
        }
        window.removeEventListener("click", iniciarChuvaMenu);
        window.removeEventListener("mousemove", iniciarChuvaMenu);
        window.removeEventListener("touchstart", iniciarChuvaMenu);
      };

      window.addEventListener("click", iniciarChuvaMenu);
      window.addEventListener("mousemove", iniciarChuvaMenu);
      window.addEventListener("touchstart", iniciarChuvaMenu);

      // Remover o indicador de carregamento
      document.body.removeChild(loadingIndicator);
    })
    .catch(error => {
      console.error(error);
      // Remover o indicador de carregamento em caso de erro
      document.body.removeChild(loadingIndicator);
    });
}

// Função para inicializar a chuva no canvas principal
function iniciarChuva() {
  initializeRain('rain', 100, 0.5);
}

// Inicializa a chuva no canvas principal com densidade e escala padrão
initializeRain('rain', 100, 0.5);

// Chamar a função para carregar o menu ao iniciar a página
carregarMenu();
