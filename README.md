# 🎁 Cestas Da Nanda - Loja Online  

Cestas Da Nanda é uma loja online desenvolvida com **React.js** que permite aos clientes personalizar e adquirir cestas de presente de forma prática e intuitiva. A plataforma oferece uma experiência fluida, desde a escolha da cesta até o pagamento, proporcionando um serviço personalizado.  

A plataforma permite **visualizar, buscar e adicionar cestas ao carrinho**, incluindo **itens extras** antes da finalização da compra. Além disso, conta com um **painel administrativo**, onde o administrador pode gerenciar produtos e pedidos.  

## 📌 Funcionalidades  

### 🛍️ Para os clientes:  
- Exibição de cestas com imagens, descrições e preços.  
- Pesquisa de cestas por nome e descrição.  
- Página de detalhes de cada cesta com opção de adicionar itens extras.  
- Carrinho de compras dinâmico, atualizando automaticamente o preço total.  
- **Checkout**:  
  - Cálculo automático do preço total, incluindo itens extras.  
  - Preenchimento automático do endereço via **API ViaCEP**.  
  - Escolha do método de pagamento (**Pix, boleto, cartão**).  

### 🔧 Para o administrador:  
- Cadastro, edição e remoção de cestas.  
- Gerenciamento de pedidos realizados pelos clientes.  

---

## 🛠️ Tecnologias Utilizadas  
- **React.js** ⚛️  
- **React Router** (para navegação) 🚏  
- **Tailwind CSS + Bootstrap** (para estilização) 🎨  
- **Firebase Authentication** 🔥 (para login/administração)  
- **API ViaCEP** 📍 (para preenchimento automático do endereço)  

---

## 🚀 Como Rodar o Projeto  

```sh
# Clone o repositório
git clone https://github.com/MateusSanfer/cestas-da-nanda.git

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm start
```

A aplicação estará disponível em `http://localhost:3000`.

---

## 📂 Estrutura do Projeto  
```
📦 src  
 ┣ 📂 assets      # Imagens e outros arquivos estáticos  
 ┣ 📂 components  # Componentes reutilizáveis  
 ┣ 📂 pages       # Páginas principais  
 ┣ 📂 utils       # Funções auxiliares (ex: cálculo de total do carrinho)  
 ┣ 📜 App.js      # Componente principal  
 ┣ 📜 index.js    # Ponto de entrada da aplicação  
```

---

## 📜 Principais Componentes  

### `CardCesta.jsx`  
- Renderiza um cartão com os detalhes da cesta.  
- Possui um botão **"Ver mais detalhes"** que leva à página de detalhes.  

### `DetalhesCesta.jsx`  
- Exibe detalhes da cesta selecionada.  
- Permite adicionar itens extras e calcular o preço total antes da compra.  

### `Carrinho.jsx`  
- Lista os produtos adicionados ao carrinho.  
- Exibe o cálculo atualizado do total, incluindo itens extras.  
- Redireciona para a página de pagamento.  

### `Pagamento.jsx`  
- Responsável pela finalização da compra.  
- Coleta os dados do cliente e o endereço.  
- Integra-se com a **API ViaCEP** para preenchimento automático do endereço.  
- Permite escolher entre **Pix, boleto ou cartão de crédito**.  

---

## 🔗 Rotas da Aplicação  

| Rota               | Descrição                              |
|------------------|----------------------------------|
| `/`               | Página inicial                    |
| `/cesta/:id/:slug` | Página de detalhes da cesta      |
| `/carrinho`        | Página do carrinho               |
| `/pagamento`       | Checkout e finalização do pedido |
| `/admin`           | Painel administrativo *(acesso restrito via login)* |

---

## 📌 Melhorias Futuras  
- Integração com gateway de pagamento real.  
- Implementação de um sistema de rastreamento de pedidos.  
- Área do cliente para acompanhar compras e histórico de pedidos.  

---

## 👨‍💻 Contribuição  
Caso queira contribuir, siga os passos:  

```sh
# 1️⃣ Faça um fork do repositório.
# 2️⃣ Crie uma branch com sua feature:
git checkout -b minha-feature

# 3️⃣ Commit suas alterações:
git commit -m "Adicionei uma nova feature"

# 4️⃣ Envie para o repositório:
git push origin minha-feature

# 5️⃣ Abra um Pull Request 🚀
```

---

## 📜 Licença  
Este projeto é **open-source** e pode ser utilizado e modificado livremente.  

---

## 📢 Observações  
Esta loja ainda está em fase de desenvolvimento, então novas funcionalidades podem ser adicionadas conforme necessário!  

🚀 **Desenvolvido por Mateus**

