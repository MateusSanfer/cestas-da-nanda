# Aqui vou adicionar as funcionalidades que serão criadas e as que serão corrigidas

## Funcionalidades a serem criadas

- Na pagina MinhaConta:
  [ ] adicionar a opção de cancelar pedido
  [ ] adicionar a opção de reembolso
  [ ] adicionar a opção de avaliar produto e entrega
  [ ] adicionar a opção de reenviar nota fiscal
  [ ] adicionar a opção de editar conta (Nome, Email, Senha, Endereço).
  [ ] adicionar a opção de desativar conta.
  [ ] adicionar confirmação de recebimento de pedido.
  [ ] adicionar rastreio de pedido.

  - Na pagina Administrador
    [ ] adicionar rastreio de pedido.
    [] O admistrador deve ser notificado quando um pedido for criado.

## Funcionalidades a serem corrigidas

- Na pagina MinhaConta, meus pedidos, não esta mostrando o endereço de entrega, apenas ", -"!

- No painel administrativo, os pedidos não estão mostrando os endereço de entregas!
- Precisamos melhorar a pagina de pedidos no painel administrativo! Não temos informações sobre os endereços de entregas!
- Cadastrar produtos com algumas imagens ainda dar erro! Talvez seja por causa do tamanho das imagens!
- Ao finalizar o pedido, o produto que foi adicionado ao carrinho, não esta sendo removido!
- Seria bom ter uma funcionalidade para desmarcar os produtos que foram adicionados ao carrinho, mas que não vão ser comprados no momento!

# Todo

- Confirmação de pagamento, como vamos integrar o pagamento?
- Nota fiscal, como vamos integrar a nota fiscal?
- Verificação de pagamento, como vamos verificar o pagamento foi efetuado?

## Correções visuais:

- Pagina de Login/Criar Conta, está bem simple e feia, adicionar mais opções de cores e personalização.
- Quando vamos editar um produto, não fica claro que quando clicamos no botão de editar, ele vai para a pagina de edição do produto, que no caso é a parte superior da pagina, onde temos o formulario de cadastro de produtos! Eu estava achando que a edição não funcionava, porque quando eu clicava em editar não tinha nada acontecendo! Então fui olhar na parte superior da pagina e vi que a edição estava lá.

## Funcionalidades a serem melhoradas

## Bugs encontrados

- **Na pagina Home, ao adicionar um produto ao carrinho, quando clico no botão do carrinho um erro aparece:**

  - Header.jsx:193 Uncaught TypeError: item.includedItems.map is not a function
    at Header.jsx:193:1
    at Array.map (<anonymous>)
    at Header (Header.jsx:178:1)

- Os pedidos no carrinho caso atualizar a pagina, os produtos desaparecem!

  - Então o usuario tem que adicionar os produtos novamente ao carrinho!

- O side bar do carrinho, não esta fechando automaticamente ao ser direcionado para a pagina de pagamento, tendo que fechar manualmente!

-
