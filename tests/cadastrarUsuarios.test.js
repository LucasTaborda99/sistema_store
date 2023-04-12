// Importando as dependências necessárias
const request = require('supertest'); // biblioteca para simular requisições HTTP
const bcrypt = require('bcrypt'); // biblioteca para lidar com hash de senhas
const moment = require('moment-timezone'); // biblioteca para lidar com datas e horários em diferentes fusos horários
const cadastrarUsuarios = require('../controllers/userController').cadastrarUsuarios; // importando o arquivo do aplicativo ou módulo que contém o método cadastrarUsuarios e importando o método também
const Usuario = require('../models/usuarios'); // importando o modelo de usuário do seu projeto

// Inicie os testes
describe('Testes do método cadastrarUsuarios', () => {
  // Antes de cada teste,pode-se configurar o ambiente de teste, como criar banco de dados em memória, iniciar o servidor, etc.
  beforeEach(() => {
    // Configurações antes de cada teste
  });

  // Após cada teste, pode-se limpar o ambiente de teste, como fechar conexões de banco de dados, desligar o servidor, etc.
  afterEach(() => {
    // Limpar configurações após cada teste
  });

  // Teste para verificar se o usuário é cadastrado com sucesso
  test('Deve cadastrar um novo usuário com sucesso', async () => {
    // Arrange: Mock dos dados de requisição
    const req = {
      body: {
        nome: 'John Doe',
        numero_contato: '123456789',
        email: 'johndoe@example.com',
        senha: '123456'
      }
    };

    // Arrange: Mock dos dados de resposta
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    // Arrange: Mock do método de banco de dados "findAll" e "findOne" para retornar dados vazios, já que estamos cadastrando o primeiro usuário
    Usuario.findAll = jest.fn().mockResolvedValue([]);
    Usuario.findOne = jest.fn().mockResolvedValue(null);

    // Arrange: Mock do método "create" do modelo de usuário para retornar o usuário cadastrado
    Usuario.create = jest.fn().mockResolvedValue({
      id: 1,
      nome: req.body.nome,
      numero_contato: req.body.numero_contato,
      email: req.body.email,
      senha: 'hashedPassword',
      role: 'admin',
      status: 'true',
      created_by: 'admin',
      created_at: '2023-04-12T10:00:00Z',
      data_expiracao: '2024-04-12T10:00:00Z'
    });

    // Arrange: Mock da função de hash de senhas para retornar a senha hashada
    bcrypt.hash = jest.fn().mockResolvedValue('hashedPassword');

    // Arrange: Mock da função de formatação de data para retornar uma data fixa
    moment.utc = jest.fn().mockReturnValue(moment('2023-04-12T10:00:00Z'));

    // Act: Chame o método a ser testado
    await cadastrarUsuarios(req, res);

    // Assert: Verifique se o usuário foi criado com sucesso
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Usuário registrado com sucesso' });

    // Assert: Verifique se os métodos do banco de dados foram chamados corretamente
    expect(Usuario.findAll).toHaveBeenCalled();
    expect(Usuario.findOne).toHaveBeenCalledWith({ where: { email: req.body.email } });
    expect(Usuario.create).toHaveBeenCalledWith({
    nome: req.body.nome,
    numero_contato: req.body.numero_contato,
    email: req.body.email,
    senha: 'hashedPassword',
    role: 'admin',
    status: 'true',
    created_by: 'admin',
    created_at: '2023-04-12T10:00:00Z',
    data_expiracao: '2024-04-12T10:00:00Z'
    });

    // Assert: Verifique se a função de hash de senhas foi chamada corretamente
    expect(bcrypt.hash).toHaveBeenCalledWith(req.body.senha, 10);

    // Assert: Verifique se a função de formatação de data foi chamada corretamente
    expect(moment.utc).toHaveBeenCalled();
    });
})