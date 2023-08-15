// notificacaoEstoque - Controller 

// Importando o módulo connection, responsável por estabelecer conexão com o banco de dados
const Database = require('../connection');

// Importando a biblioteca - Moment.js, que permite trabalhar com datas e horários.
const moment = require('moment-timezone');
const { NOW } = require('sequelize');

const ControleEstoqueController = require('./controleEstoqueController')


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
const envioNotificacaoEstoqueBaixo = (produto) => {
  const emailCorpo = {
    from: process.env.EMAIL, // Meu e-mail
    to: process.env.EMAIL, // E-mail do destinatário
    subject: 'Estoque Baixo - Repor Produto',
    text: `O produto ${produto.nome} está com estoque baixo. A quantidade atual é ${produto.quantidade}. Por favor, reponha o estoque.`
  };

  transportador.sendMail(emailCorpo, (error, info) => {
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
