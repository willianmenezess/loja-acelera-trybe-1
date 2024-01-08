# PSel Acelera Trybe

Com a chegada do OpenBanking no Brasil as transações bancárias passaram a ser menos burocráticas, permitindo que qualquer empresa possa realizar transações através de qualquer instituição financeira que utiliza o OpenBanking.

Uma loja virtual conhecida nacionalmente estava fazendo seu balanço de caixa, e percebeu que tem um alto custo com sistemas pagos de terceiros para realizar transações bancárias. Para tanto, decidiu criar seu próprio sistema de transações a fim de diminuir esse custo.

A empresa trabalha com a ideia de cashback em vendas realizadas para fidelizar clientes. Para cada pagamento recebido existe a possibilidade de gerar uma taxa variável em percentuais de cashback, a depender do(a) cliente. 
Você foi contratado para criar um dos módulos do sistema. Esse módulo será acessado apenas pelos outros módulos do sistema da empresa, ou seja, todas as requisições que a API receber, serão de origem dos outros módulos. 

# Back-end

O módulo que você irá criar, deverá ser uma aplicação REST capaz de:


## Fluxo Conta:

1. Criar uma conta
-  A conta deve ter, pelo menos, os campos CPF ou CNPJ, name, email, password e status da conta;
- O status da conta deve ter valor binário que represente ativo ou inativo.
- O CPF ou CNPJ devem ser valores válidos, isto é, os dígitos verificadores devem validar o documento.

2. Alterar uma conta
- Não é permitido alterar CPF/CNPJ
- Apenas é permitido alteração por acessos autenticados

3. Deletar uma conta
- O delete deve ser lógico, isto é, o status da conta deve ser colocado em inativo.
- Apenas é permitido deletar a conta por acessos autenticados

## Fluxo transações:

4. Registrar pagamento
- Apenas é permitido registrar pagamento por acessos autenticados
- Não é possível registrar pagamento caso a conta esteja inativa
- Deverá receber um identificador da conta com o valor e data da transação e retornar um identificador da transação

5. Registrar uma taxa de cashback
- Apenas é permitido registrar cashback por acessos autenticados
- Não é possível registrar um cashback caso a conta esteja inativa
- Deverá receber como entrada o identificador da transação e a taxa de cashback

6. Listar o extrato das transações
- Apenas é permitido listar extrato por acessos autenticados
- Não é possível listar extrato caso a conta esteja inativa
- Deve listar todas as transações realizadas na conta com seus devidos cashbacks
- Exemplo de resposta: 
```JSON
[
    {
        "transactionId": 123123123345453567765734,
        "accountId": "123475789-10",
        "date": "2023-03-08T12:48:25.000Z",
        "value": 105.39,
        "cashback": 0.02,
    },
    {
        "transactionId": 897609876572398740237613,
        "documento": "123475789-10",
        "date": "2023-03-09T09:23:58.000Z",
        "value": 641.23,
        "cashback": 0.025,
    }
]
```

# Front-end

Para interagir com a API REST, será necessário criar, pelo menos, as seguintes telas:

1. Tela de cadastro de nova conta
- Deverá acessar o endpoint de cadastro de nova conta
- Deverá validar o CPF ou CNPJ, isto é, os dígitos verificadores devem validar o documento.
- Deverá tratar os possíveis erros do request

2. Tela de acesso (login)
- Deverá acessar um endpoint de login que irá receber um token válido
- Deverá validar o CPF ou CNPJ, isto é, os dígitos verificadores devem validar o documento.
- Deverá tratar os possíveis erros do request

3. Tela para editar e deletar a conta
- Deverá acessar o endpoint de alterar ou de deletar a conta, enviando o token recebido pelo login
- Bloquear alteração de CPF ou CNPJ
- Deverá tratar os possíveis erros do request

4. Tela de extrato da conta
- Deverá acessar o endpoint de listar extrato de transações, enviando o token recebido pelo login
- Apresentar todas as transações em uma lista ordenada por data
- Apresentar a somatória dos valores da cashback, em reais

5. Um menu de acesso a todas as telas, com nome e CPF da pessoa logada.


## O que será avaliado
- Documentação
- Código limpo e organizado (nomenclatura, etc)
- Conhecimento de padrões (design patterns, SOLID)
- Ser consistente e saber argumentar suas decisões de arquitetura e construção de código
- Tratamento de erros
- Segurança
- Cobertura de testes

## Diferencial
- Uso de Docker
- Testes de integração
- Testes unitários
- Uso de Design Patterns
- Documentação
