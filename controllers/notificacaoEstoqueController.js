// notificacaoEstoque - Controller 

// Importando o módulo connection, responsável por estabelecer conexão com o banco de dados
const Database = require('../connection');

// Importando a biblioteca - Moment.js, que permite trabalhar com datas e horários.
const moment = require('moment-timezone');
const { NOW } = require('sequelize');

const ControleEstoqueController = require('./controleEstoqueController')

// Importando da model usuarios a classe Usuario
const { Usuario } = require('../models/index');

const nodemailer = require('nodemailer');

async function verificaEstoqueBaixo (req, res){
    try {
        const produtosComEstoqueBaixo = await ControleEstoqueController.getProdutosEstoqueBaixo();
    
        for (const item  of produtosComEstoqueBaixo) {
          const produto = item.Produto;
          envioNotificacaoEstoqueBaixo(produto);
        }
    
        res.status(200).json({ message: 'Notificações enviadas com sucesso' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao enviar notificações' });
      }
}

// Criando o objeto "transportador" de email, usando a biblioteca Nodemailer,
// para conectar à conta do Gmail do usuário e enviar email
let transportador = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
})

// verificando configuração de conexão para mandar mensagem
transportador.verify(function (error) {
    if (!error) {
        console.log("O servidor está pronto para receber nossas mensagens!");
    } else {
        console.log(error);
    }
})


// Função para enviar uma notificação de estoque baixo
async function envioNotificacaoEstoqueBaixo(produto, userEmail){

  const foundUser = await Usuario.findOne({ where: { email: userEmail} });

  const emailCorpo = {
    from: process.env.EMAIL, // Meu e-mail
    to: userEmail, // E-mail do destinatário
    subject: 'SistemaStore - Notificação de estoque baixo',
    html: `
    <div style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px;">
      <h2 style="color: #1f9ee7;">Notificação de Estoque Baixo</h2>
      <p style="font-size: 16px;">Olá, <strong>${foundUser.nome}</strong></p>
      <p style="font-size: 16px;">O produto <strong>${produto.nome}</strong> está com estoque baixo. A quantidade atual é <strong>${produto.quantidade}</strong>. Por favor, reponha o estoque.</p>
      <p style="font-size: 16px;">Atenciosamente,</p>
      <p style="font-size: 16px; font-weight: bold;">Equipe do SistemaStore</p>
    </div>
  `,
  css: `
  div {
    border-radius: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    background-color: #ffffff;
    padding: 20px;
    margin: 0 auto;
    max-width: 600px;
  }
  h2 {
    color: #1f9ee7;
  }
  p {
    font-size: 16px;
    color: #333;
    margin-bottom: 10px;
  }
  strong {
    font-weight: bold;
  }
`
  };

  await transportador.sendMail(emailCorpo, (error, info) => {
    if (error) {
      console.error('Erro ao enviar notificação:', error);
    } else {
      console.log('Notificação enviada:', info.response);
    }
  });
};

module.exports = {
    envioNotificacaoEstoqueBaixo,
    verificaEstoqueBaixo
};
