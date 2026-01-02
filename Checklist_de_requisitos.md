# Checklist de Requisitos

## 1. Visão Geral

O projeto **Cestas Da Nanda** é uma plataforma de e-commerce focada na venda e personalização de cestas de presentes. O sistema é composto por uma loja virtual para os clientes e um painel administrativo para gerenciamento de produtos e pedidos.

## 2. Tecnologias Utilizadas

### Frontend

- **React.js**: Biblioteca principal para construção da interface.
- **Tailwind CSS**: Framework de utilitários para estilização rápida e responsiva.
- **Framer Motion**: Biblioteca para animações fluidas.
- **React Router**: Gerenciamento de rotas e navegação.
- **Axios**: Cliente HTTP para requisições à API.

### Backend

- **Node.js & Express**: Servidor e API RESTful.
- **Sequelize**: ORM para interação com o banco de dados.
- **MySQL**: Banco de dados relacional.
- **Authentication**: JWT (JSON Web Tokens) e Bcrypt para segurança e autenticação (além de uso pontual de Firebase).

## 3. Requisitos Funcionais

### 3.1. Módulo do Cliente (Loja)

#### Navegação e Produtos

- [x] **Visualização de Cestas**: Listagem de produtos com imagens, nomes e preços.
- [x] **Detalhes do Produto**: Página individual com descrição detalhada e opção de compra.
- [x] **Busca**: Campo de pesquisa para filtrar cestas por nome ou termos.
- [x] **Itens Extras**: Possibilidade de adicionar itens complementares à cesta antes de adicionar ao carrinho.

#### Carrinho de Compras

- [x] **Gerenciar Carrinho**: Adicionar, remover e alterar quantidades de itens.
- [x] **Cálculo de Total**: Atualização dinâmica do subtotal e total com itens extras.
- [ ] **Persistência**: Manter itens no carrinho após recarregar a página (Atualmente apresentando bug).

#### Checkout e Pagamento

- [x] **Autenticação no Checkout**: Login ou cadastro simplificado.
- [x] **Endereço**: Preenchimento automático de endereço via API ViaCEP.
- [x] **Formas de Pagamento**: Seleção entre Pix, Boleto e Cartão de Crédito.
- [ ] **Integração Real**: Implementar gateway de pagamento funcional (atualmente simulado).

#### Área do Cliente (Minha Conta)

- [x] **Perfil**: Visualizar dados cadastrais.
- [x] **Meus Pedidos**: Listagem de histórico de compras.
- [ ] **Cancelar Pedido**: Opção para solicitar cancelamento.
- [ ] **Reembolso**: Fluxo para solicitação de reembolso.
- [ ] **Avaliações**: Sistema de avaliação de produtos e entrega.
- [ ] **Editar Dados**: Alterar senha, endereço e informações pessoais.
- [ ] **Desativar Conta**: Opção para encerrar a conta.

### 3.2. Módulo Administrativo (Backoffice)

#### Gestão de Catálogo

- [x] **CRUD de Cestas**: Criar, ler, atualizar e remover produtos.
- [x] **Gerenciar Imagens**: Upload e associação de fotos aos produtos.

#### Gestão de Pedidos

- [x] **Listagem de Pedidos**: Visualizar novos pedidos.
- [x] **Alterar Status**: Atualizar status do pedido (Pendente, Preparando, Enviado, Entregue).
- [ ] **Detalhes de Entrega**: Visualizar endereço completo de entrega no detalhe do pedido (Atualmente ausente/bugado).

## 4. Backlog de Melhorias e Correções

### Funcionalidades a Criar

- **Minha Conta**:
  - [ ] Adicionar opção de cancelar pedido.
  - [ ] Adicionar opção de reembolso.
  - [ ] Adicionar opção de avaliar produto e entrega.
  - [ ] Adicionar opção de reenviar nota fiscal.
  - [ ] Editar perfil (Nome, Email, Senha, Endereço).
  - [ ] Desativar conta.
  - [ ] Confirmação de recebimento do pedido pelo usuário.

### Bugs e Correções Necessárias

- [ ] **Endereço no Histórico**: Na página "Meus Pedidos" do cliente, o endereço não aparece corretamente.
- [ ] **Endereço no Admin**: No painel administrativo, o endereço de entrega não está visível nos detalhes do pedido.
- [ ] **Carrinho (Persistência)**: Ao atualizar a página, os produtos somem do carrinho.
- [ ] **Carrinho (UI)**: O sidebar do carrinho não fecha automaticamente ao ir para o pagamento.
- [ ] **Erro no Header**: `TypeError: item.includedItems.map is not a function` ao clicar no carrinho após adicionar produto.
- [ ] **Visual**: Melhorar design da página de Login/Cadastro (cores e personalização).

### Todo List (Técnico)

- [ ] Definir integração de pagamento real.
- [ ] Implementar geração e envio de Nota Fiscal.
- [ ] Sistema de verificação automática de pagamento.

## 5. Requisitos Não Funcionais

- **Performance**: O site deve carregar as principais páginas em menos de 2 segundos.
- **Responsividade**: Layout totalmente adaptável para Mobile, Tablet e Desktop.
- **Segurança**: Senhas criptografadas no banco e uso de HTTPS.
