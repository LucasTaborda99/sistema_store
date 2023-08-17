# :computer: Sistema Store
O **SistemaStore** é uma plataforma que foi desenvolvida para auxiliar micro e pequenas empresas a gerenciar e controlar seus estoques com facilidade. A ferramenta oferece uma solução prática e acessível para os proprietários de negócios que precisam gerenciar seus produtos e clientes, mas que enfrentam dificuldades com os sistemas disponíveis no mercado atual. Muitos empreendedores enfrentam problemas com o controle manual de seus estoques e clientes, bem como a utilização de planilhas eletrônicas.

Com o SistemaStore, é possível simplificar esse processo e obter um controle mais eficiente, sem precisar gastar muito tempo ou dinheiro. É uma plataforma web projetada para ser fácil de usar e acessível, permitindo que os usuários gerenciem seus estoques, cadastrem produtos, clientes, fornecedores, registrem as compras, vendas entre outras funcionalidades.

Com o SistemaStore, os proprietários de pequenos negócios podem se concentrar no que realmente importa para fazer sua empresa crescer, em vez de se preocupar com questões administrativas e operacionais que podem desviá-los do seu objetivo principal.

## Conteúdo

* [Sobre](#about)
* [Requisitos](#requirements)
* [Instalação](#installation)
* [Tecnologias](#technologies)

<div id='about'> &nbsp;

## :pushpin: Sobre

Este repositório refere-se ao projeto **Sistema Store**. <br>
Leia mais sobre este projeto no [repositório de apresentação](https://github.com/LucasTaborda99/sistema_store).

<div id='requirements'> &nbsp;

## :pushpin: Requisitos

>*Estes requisitos são direcionados aos desenvolvedores do projeto*

- [x] [NodeJs](https://nodejs.org/en/) instalado (LTS version) - necessário para o gerenciamento de pacotes da aplicação, com `npm` (*Node Package Manager*)
- [x] Angular CLI - [como instalar?](#installation) - necessário para utilização do Angular e execução do projeto via terminal
- [x] Navegador com suporte às versões recentes do JavaScript - recomenda-se o [Google Chrome](https://www.google.com/intl/pt-BR/chrome/)
- [x] IDE / Editor de texto - recomenda-se o [Visual Studio Code](https://code.visualstudio.com/)
  
> No caso da utilização do VSCode, recomenda-se a utilização das seguintes extensões:
> * Angular Language Service
> * Angular Snippets
> * GitLens

### Requisitos específicos para Windows

Caso seu sistema operacional seja Windows, talvez alguns recursos adicionais sejam necessários:

- [x] [Git for Windows](https://git-scm.com/) - recomenda-se, para a execução de comandos referentes ao Angular, utilizar o `git bash`

> Chocolatey ou qualquer outro gerenciador de pacotes para Windows - **não é necessário**, utilize apenas o `npm`

<div id='installation'> &nbsp;

## :pushpin: Instalação

>*Observe atentamente os [requisitos](#requirements) necessários para poder executar, em modo de desenvolvedor, a aplicação no seu computador*

* Clone este projeto
  ```bash
  git clone https://github.com/LucasTaborda99/sistema_store.git
  ```
* Defina as variáveis de ambiente do projeto de acordo com o exemplo
  - Exemplo em `.env.example`
* Dentro do repositório clonado do projeto, abra um terminal/cmd e siga as seguintes instruções:

:one: Instale as dependências do projeto
```bash
npm install
```
:two: Instale o Angular para linha de comando (Angular CLI)
```bash
npm install -g @angular/cli
```
:three: Execute o projeto em uma porta disponível no seu computador (default: `4200`)
```bash
ng serve --port 4200
```
:asterisk: Se o ng serve não funcionar, veja [como configurar o Angular CLI em variáveis de ambiente](https://stackoverflow.com/questions/37991556/ng-is-not-recognized-as-an-internal-or-external-command) (Windows).

<div id='technologies'> &nbsp;

## :pushpin: Tecnologias

A camada de front-end é desenvolvida sobre as seguintes tecnologias:

![angular-logo](https://www.searchenginejournal.com/wp-content/uploads/2019/04/the-seo-guide-to-angular.png)

- [x] Framework Angular 
- [x] TypeScript - Linguagem utilizada pelo framework
- [x] HTML5 - Linguagem de marcação utilizada nos templates
- [x] SCSS - Estilos aplicados ao template
- [x] Material Design para Angular - Biblioteca de componentes estilizados

A camada de backend é desenvolvida sobre as seguintes tecnologias:

![node.js-logo](https://upload.wikimedia.org/wikipedia/commons/d/d9/Node.js_logo.svg)

- [x] Framework Node.js 
- [x] JavaScript - Linguagem utilizada pelo framework
- [x] Express.js - Microframework para Node.js

Banco de Dados:

![mysql-logo](https://d1.awsstatic.com/asset-repository/products/amazon-rds/1024px-MySQL.ff87215b43fd7292af172e2a5d9b844217262571.png)

- [x] Banco de dados MySQL



