// Referências iniciais

let colorsRef = document.getElementsByClassName("colors");
let canvas = document.getElementById("canvas");
let backgroundButton = document.getElementById("color-background");
let colorButton = document.getElementById("color-input");
let clearButton = document.getElementById("button-clear");
let eraseButton = document.getElementById("button-erase");
let penButton = document.getElementById("button-pen");
let penSize = document.getElementById("pen-slider");
let toolType = document.getElementById("tool-type");

//eraser = false e desenho=false inicialmente porque o usuário não começou a usar os dois
let erase_bool = false;
let draw_bool = false;

//contexto para tela
let context = canvas.getContext("2d");

//Inicialmente as posições X e Y do mouse são 0
let mouseX = 0;
let mouseY = 0;

// vai para a esquerda e para o topo da tela
let rectLeft = canvas.getBoundingClientRect().left;
let rectTop = canvas.getBoundingClientRect().top;


//Recursos iniciais

const init = () => {
  context.strokeStyle = "black";
  context.lineWidth = 1;

  //Define a altura da tela para a altura do div pai
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;

  //Configura o título do intervalo para o tamanho da caneta
  toolType.innerHTML = "Pen";

  //Definir as entradas de fundo e cor inicialmente
  canvas.style.backgroundColor = "#ffffff";
  backgroundButton.value = "#ffffff";
  penButton.value = context.strokeStyle;
};

// Detecta o dispositivo de toque
const is_touch_device = () => {
  try {

    //Tentamos criar TouchEvent (ele falharia para desktops e geraria erro)
    document.createEvent("TouchEvent");
    return true;
  } catch (e) {
    return false;
  }
};

//Posição x e y exata do mouse/toque
const getXY = (e) => {
  mouseX = (!is_touch_device() ? e.pageX : e.touches?.[0].pageX) - rectLeft;
  mouseY = (!is_touch_device() ? e.pageY : e.touches?.[0].pageY) - rectTop;
};

const stopDrawing = () => {
  context.beginPath();
  draw_bool = false;
};

//Usuário começou a desenhar
const startDrawing = (e) => {

  //desenho = verdadeiro
  draw_bool = true;
  getXY(e);

  //Comece a desenhar
  context.beginPath();
  context.moveTo(mouseX, mouseY);
};

//função de desenho
const drawOnCanvas = (e) => {
  if (!is_touch_device()) {
    e.preventDefault();
  }
  getXY(e);

  //se o usuário está desenhando
  if (draw_bool) {

    //cria uma linha para a posição x e y do cursor
    context.lineTo(mouseX, mouseY);
    context.stroke();
    if (erase_bool) {

      //destination-out desenha novas formas por trás do conteúdo da tela existente
      context.globalCompositeOperation = "destination-out";
    } else {
      context.globalCompositeOperation = "source-over";
    }
  }
};

//Mouse para baixo/toque para iniciar dentro da tela
canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("touchstart", startDrawing);

//Começa a desenhar quando o mouse.touch se move
canvas.addEventListener("mousemove", drawOnCanvas);
canvas.addEventListener("touchmove", drawOnCanvas);

//quando o clique do mouse parar/o toque parar, pare o desenho e comece um novo caminho

canvas.addEventListener("mouseup", stopDrawing);
canvas.addEventListener("touchend", stopDrawing);

//Quando o mouse sai da tela
canvas.addEventListener("mouseleave", stopDrawing);

//Botão para o modo caneta

penButton.addEventListener("click", () => {

  //configura o título do intervalo para o tamanho da caneta
  toolType.innerHTML = "Pen";
  erase_bool = false;
});

//Botão para modo apagador
eraseButton.addEventListener("click", () => {
  erase_bool = true;

  //defina o título do intervalo para apagar o tamanho
  toolType.innerHTML = "Eraser";
});

//Ajusta o tamanho da caneta
penSize.addEventListener("input", () => {

  //definir a largura para o valor do intervalo
  context.lineWidth = penSize.value;
});

//Mudar cor
colorButton.addEventListener("change", () => {

  //define a cor do traçado
  context.strokeStyle = colorButton.value;
});

//Mude o fundo
backgroundButton.addEventListener("change", () => {
  canvas.style.backgroundColor = backgroundButton.value;
});

//Claro
clearButton.addEventListener("click", () => {
  context.clearRect(0, 0, canvas.width, canvas.height);
  canvas.style.backgroundColor = "#fff";
  backgroundButton.value = "#fff";
});

window.onload = init();
