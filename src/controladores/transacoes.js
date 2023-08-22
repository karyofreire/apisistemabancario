const { contas, saques, depositos, transferencias } = require('../bancodedados');
const { format } = require('date-fns');

const depositar = (req, res) => {
    //Não usei o intermediário verificarConta por que os parâmetros dessa função vêm do body.
    const { numero_conta, valor } = req.body;

    if (!numero_conta || !valor) {
        return res.status(400).json({ mensagem: 'Número da conta e valor do depósito são obrigatórios para esta operação.' })
    };

    if (isNaN(numero_conta)) {
        return res.status(400).json({ mensagem: 'O numero de conta informado não é válido.' });
    };

    const indiceConta = contas.findIndex(conta => conta.numero == numero_conta);
    if (indiceConta < 0) {
        return res.status(404).json({ mensagem: 'Conta não encontrada.' });
    };

    if (Number(valor) <= 0) {
        return res.status(400).json({ mensagem: 'Valor não permitido para esta operação.' });
    };

    contas[indiceConta].saldo += Number(valor);
    const dataOperacao = new Date();

    depositos.push({
        data: format(dataOperacao, "yyy-MM-dd HH:mm:ss"),
        numero_conta,
        valor: Number(valor)
    });

    return res.status(200).json({ mensagem: 'Depósito realizado com sucesso.' });

};

const sacar = (req, res) => {
    //Não usei o intermediário verificarContaeSenha por que os parâmetros dessa função vêm do body.
    const { numero_conta, valor, senha } = req.body;

    if (!numero_conta || !valor || !senha) {
        return res.status(400).json({ mensagem: 'Número da conta e valor do depósito são obrigatórios para esta operação.' })
    };

    if (isNaN(numero_conta)) {
        return res.status(400).json({ mensagem: 'O numero de conta informado não é válido.' });
    };

    const indiceConta = contas.findIndex(conta => conta.numero == numero_conta);
    if (indiceConta < 0) {
        return res.status(404).json({ mensagem: 'Conta não encontrada.' });
    };

    if (senha != contas[indiceConta].usuario.senha) {
        return res.status(400).json({ mensagem: 'Senha incorreta.' });
    };

    if (contas[indiceConta].saldo == 0) {
        return res.status(400).json({ mensagem: 'Saldo zerado. Não é possível realizar a operação.' });
    };

    contas[indiceConta].saldo -= Number(valor);
    const dataOperacao = new Date();

    saques.push({
        data: format(dataOperacao, "yyy-MM-dd HH:mm:ss"),
        numero_conta,
        valor: Number(valor)
    });

    return res.status(200).json({ mensagem: 'Saque realizado com sucesso.' })
};

const transferir = (req, res) => {
    //Não usei intermediários por que os parâmetros dessa função são diferentes dos das outras.
    const { numero_conta_origem, numero_conta_destino, valor, senha } = req.body;

    if (!numero_conta_origem || !numero_conta_destino || !valor || !senha) {
        return res.status(400).json({ mensagem: 'Número da conta e valor do depósito são obrigatórios para esta operação.' })
    };

    if (isNaN(numero_conta_origem) || isNaN(numero_conta_destino)) {
        return res.status(400).json({ mensagem: 'Favor, revisar os números de conta.' });
    };

    const indiceContaOrigem = contas.findIndex(conta => conta.numero === numero_conta_origem);
    if (indiceContaOrigem < 0) {
        return res.status(404).json({ mensagem: 'Conta de origem não encontrada.' });
    };

    const indiceContaDestino = contas.findIndex(conta => conta.numero === numero_conta_destino);
    if (indiceContaDestino < 0) {
        return res.status(404).json({ mensagem: 'Conta de destino não encontrada.' });
    };

    if (senha != contas[indiceContaOrigem].usuario.senha) {
        return res.status(400).json({ mensagem: 'Senha incorreta.' });
    };

    if (contas[indiceContaOrigem].saldo == 0) {
        return res.status(400).json({ mensagem: 'Saldo zerado. Não é possível realizar a operação.' });
    };

    contas[indiceContaOrigem].saldo -= Number(valor);
    contas[indiceContaDestino].saldo += Number(valor);
    const dataOperacao = new Date();

    transferencias.push({
        data: format(dataOperacao, "yyy-MM-dd HH:mm:ss"),
        numero_conta_origem,
        numero_conta_destino,
        valor: Number(valor)
    });

    return res.status(200).json({ mensagem: 'Transferencia realizada com sucesso.' });

};

module.exports = {
    depositar,
    sacar,
    transferir
}