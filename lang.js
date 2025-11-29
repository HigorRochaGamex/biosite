const LANG_STORAGE_KEY = "idiomaSelecionado";
const DEFAULT_LANG = "pt";

function carregarIdioma(lang) {
  fetch(`lang/${lang}.json`)
    .then(res => res.json())
    .then(traduzirPagina)
    .catch(() => {
      console.error(`Falha ao carregar o arquivo de idioma: lang/${lang}.json`);
    });
}

function traduzirPagina(json) {
	  document.querySelectorAll("[data-i18n]").forEach(el => {
	    const chave = el.getAttribute("data-i18n");
	    if (json[chave]) {
	      // Se o elemento for um link do menu (<li><a>), ele terá a imagem como primeiro filho.
	      if (el.tagName === 'A' && el.querySelector('img')) {
	        // Para links do menu, o texto a ser traduzido é o último nó filho (Text Node)
	        const textoAntigo = el.childNodes[el.childNodes.length - 1];
	        if (textoAntigo && textoAntigo.nodeType === 3) { // 3 é o tipo para Text Node
	          textoAntigo.nodeValue = " " + json[chave]; // Adiciona um espaço antes do texto
	        }
	      } else {
	        // Para outros elementos, usa innerText
	        el.innerText = json[chave];
	      }
	    }
	  });

	  document.querySelectorAll("[data-i18n-html]").forEach(el => {
	    const chave = el.getAttribute("data-i18n-html");
	    if (json[chave]) {
	      el.innerHTML = json[chave];
	    }
	  });
	}

function definirIdioma(lang) {
  localStorage.setItem(LANG_STORAGE_KEY, lang);
  carregarIdioma(lang);
}

function idiomaAtual() {
  return localStorage.getItem(LANG_STORAGE_KEY) || DEFAULT_LANG;
}

// Inicialização
carregarIdioma(idiomaAtual());

// Se quiser trocar com botões:
document.querySelectorAll("[data-set-lang]").forEach(btn => {
  btn.addEventListener("click", () => {
    const novoLang = btn.getAttribute("data-set-lang");
    definirIdioma(novoLang);
  });
});
// Mostrar seletor com animação apenas na primeira vez
window.addEventListener("DOMContentLoaded", () => {
  const seletor = document.getElementById("seletorIdioma");
  const jaViuSeletor = localStorage.getItem("idiomaVisto");

  if (!jaViuSeletor) {
    seletor.classList.remove("oculto");
    setTimeout(() => seletor.classList.add("oculto"), 4000); // fecha após 4s
    localStorage.setItem("idiomaVisto", "sim");
  } else {
    seletor.classList.remove("oculto"); // pode deixar visível fixo se quiser
  }
});
