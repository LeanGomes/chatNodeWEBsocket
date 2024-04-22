// Seleciona os elementos HTML relacionados ao login
const login = document.querySelector(".login")  // Seleciona o elemento com a classe "login"
const loginForm = login.querySelector(".login__form")  // Seleciona o formulário dentro do elemento de login
const loginInput = login.querySelector(".login__input")  // Seleciona a entrada de texto dentro do formulário de login

// Seleciona os elementos HTML relacionados ao chat
const chat = document.querySelector(".chat")  // Seleciona o elemento com a classe "chat"
const chatForm = chat.querySelector(".chat__form")  // Seleciona o formulário dentro do elemento de chat
const chatInput = chat.querySelector(".chat__input")  // Seleciona a entrada de texto dentro do formulário de chat
const chatMessages = chat.querySelector(".chat__messages")  // Seleciona a área onde as mensagens do chat serão exibidas

// Define um array de cores para os usuários
const colors = [
    "cadetblue",
    "darkgoldenrod",
    "cornflowerblue",
    "darkkhaki",
    "hotpink",
    "gold"
]

// Cria um objeto vazio para representar o usuário
const user = { id: "", name: "", color: "" }

// Inicializa uma variável para armazenar a conexão WebSocket
let websocket

// Função para criar um elemento de mensagem enviada pelo próprio usuário
const createMessageSelfElement = (content) => {
    const div = document.createElement("div")

    // Adiciona classes CSS ao elemento para estilização
    div.classList.add("message--self")

    // Define o conteúdo da mensagem no elemento HTML
    div.innerHTML = content

    return div
}

// Função para criar um elemento de mensagem recebida de outro usuário
const createMessageOtherElement = (content, sender, senderColor) => {
    const div = document.createElement("div")
    const span = document.createElement("span")

    // Adiciona classes CSS ao elemento para estilização
    div.classList.add("message--other")
    span.classList.add("message--sender")

    // Define a cor do remetente
    span.style.color = senderColor

    // Adiciona o nome do remetente ao elemento HTML
    span.innerHTML = sender

    // Adiciona o conteúdo da mensagem ao elemento HTML
    div.innerHTML = content

    // Anexa o nome do remetente antes do conteúdo da mensagem
    div.insertBefore(span, div.firstChild)

    return div
}

// Função para obter uma cor aleatória para o usuário
const getRandomColor = () => {
    const randomIndex = Math.floor(Math.random() * colors.length)
    return colors[randomIndex]
}

// Função para rolar a tela até o final
const scrollScreen = () => {
    // Rola a tela até a parte inferior de forma suave
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth"
    })
}

// Função para processar uma mensagem recebida
const processMessage = ({ data }) => {
    // Extrai os dados da mensagem recebida
    const { userId, userName, userColor, content } = JSON.parse(data)

    // Verifica se a mensagem recebida foi enviada pelo próprio usuário ou por outro usuário
    const message =
        userId == user.id
            ? createMessageSelfElement(content)
            : createMessageOtherElement(content, userName, userColor)

    // Adiciona a mensagem à área de mensagens do chat
    chatMessages.appendChild(message)

    // Rola a tela para exibir a mensagem mais recente
    scrollScreen()
}

// Função para lidar com o evento de login
const handleLogin = (event) => {
    // Impede o comportamento padrão do formulário (recarregamento da página)
    event.preventDefault()

    // Gera um ID único para o usuário
    user.id = crypto.randomUUID()

    // Obtém o nome de usuário digitado no campo de entrada
    user.name = loginInput.value

    // Obtém uma cor aleatória para o usuário
    user.color = getRandomColor()

    // Esconde o formulário de login e mostra a interface de chat
    login.style.display = "none"
    chat.style.display = "flex"

    // Inicia uma conexão WebSocket com o servidor
    websocket = new WebSocket("ws://chatfront-i5dx.onrender.com")

    // Define a função a ser executada quando uma mensagem é recebida
    websocket.onmessage = processMessage
}

// Função para enviar uma mensagem
const sendMessage = (event) => {
    // Impede o comportamento padrão do formulário (recarregamento da página)
    event.preventDefault()

    // Cria um objeto de mensagem com os dados do usuário e o conteúdo da mensagem
    const message = {
        userId: user.id,
        userName: user.name,
        userColor: user.color,
        content: chatInput.value
    }

    // Converte o objeto de mensagem para uma string JSON e a envia para o servidor via WebSocket
    websocket.send(JSON.stringify(message))

    // Limpa o campo de entrada de texto após o envio da mensagem
    chatInput.value = ""
}

// Adiciona um ouvinte de evento para o envio do formulário de login
loginForm.addEventListener("submit", handleLogin)

// Adiciona um ouvinte de evento para o envio do formulário de chat
chatForm.addEventListener("submit", sendMessage)
