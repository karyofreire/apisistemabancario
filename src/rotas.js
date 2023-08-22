const { Router } = require('express');
const { validaSenhaBanco, validarCPFEmail, verificarConta, verificarContaeSenha } = require('./intermediarios');
const { obterContas, criarConta, atualizarUsuarioConta, excluirConta, saldo, extrato } = require('./controladores/contas');
const { depositar, sacar, transferir } = require('./controladores/transacoes');

const rotas = Router();

rotas.post('/contas', validarCPFEmail, criarConta);
rotas.put('/contas/:numeroConta/usuario', validarCPFEmail, verificarConta, atualizarUsuarioConta);
rotas.delete('/contas/:numeroConta', verificarConta, excluirConta);
rotas.post('/transacoes/depositar', depositar);
rotas.post('/transacoes/sacar', sacar);
rotas.post('/transacoes/transferir', transferir);
rotas.get('/contas/saldo', verificarContaeSenha, saldo);
rotas.get('/contas/extrato', verificarContaeSenha, extrato);
rotas.use(validaSenhaBanco);
rotas.get('/contas', obterContas);

module.exports = rotas;