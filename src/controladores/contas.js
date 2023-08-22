const { contas, depositos, saques, transferencias } = require('../bancodedados');

let numeroNovaConta = 1;

const obterContas = (req, res) => {
    return res.json(contas);
}

const criarConta = (req, res) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

    if (!nome || !cpf || !data_nascimento || !telefone || !email || !senha) {
        return res.status(400).json({ mensagem: 'Favor, revisar informações do usuário. Todos os campos são obrigatórios.' });
    };

    const usuario = {
        nome,
        cpf,
        data_nascimento,
        telefone,
        email,
        senha
    };

    const novaConta = {
        numero: numeroNovaConta,
        saldo: 0,
        usuario
    };

    contas.push(novaConta);

    numeroNovaConta++;

    return res.status(201).json(novaConta);
}
const atualizarUsuarioConta = (req, res) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

    if (!nome && !cpf && !data_nascimento && !telefone && !email && !senha) {
        return res.status(400).json({ mensagem: 'Favor, inserir informações do usuário. Pelo menos um campo é obrigatórios.' });
    }

    const numeroConta = Number(req.params.numeroConta);

    const indiceConta = contas.findIndex(conta => conta.numero == numeroConta);

    if (nome) { contas[indiceConta].usuario.nome = nome };
    if (cpf) { contas[indiceConta].usuario.cpf = cpf };
    if (data_nascimento) { contas[indiceConta].usuario.data_nascimento = data_nascimento };
    if (telefone) { contas[indiceConta].usuario.telefone = telefone };
    if (email) { contas[indiceConta].usuario.email = email };
    if (senha) { contas[indiceConta].usuario.senha = senha };

    return res.status(200).json({ mensagem: 'Conta atualizada com sucesso!' });
};
const excluirConta = (req, res) => {

    const numeroConta = Number(req.params.numeroConta);

    const indiceConta = contas.findIndex(conta => conta.numero == numeroConta);

    if (contas[indiceConta].saldo != 0) {
        return res.status(400).json({ mensagem: 'Só é possível excluir contas com saldo zerado.' });
    } else {
        contas.splice(indiceConta, 1);
        return res.status(200).json({ mensagem: 'Conta excluida com sucesso.' });
    };

}
const saldo = (req, res) => {

    const { numero_conta } = req.query;

    const indiceConta = contas.findIndex(conta => conta.numero == numero_conta);

    return res.status(200).json({ Saldo: contas[indiceConta].saldo });

}
const extrato = (req, res) => {

    const { numero_conta } = req.query;

    const depositosConta = [];
    const saquesConta = [];
    const transferenciasEnviadas = [];
    const transferenciasRecebidas = [];

    for (let deposito of depositos) {
        if (deposito.numero_conta == numero_conta) {
            depositosConta.push(deposito);
        };
    };

    for (let saque of saques) {
        if (saque.numero_conta == numero_conta) {
            saquesConta.push(saque);
        };
    };

    for (let transferencia of transferencias) {
        if (transferencia.numero_conta_origem == numero_conta) {
            transferenciasEnviadas.push(transferencia);
        }
    };

    for (let transferencia of transferencias) {
        if (transferencia.numero_conta_destino == numero_conta) {
            transferenciasRecebidas.push(transferencia);
        }
    };

    return res.status(200).json({
        depositos: depositosConta,
        saques: saquesConta,
        transferenciasEnviadas,
        transferenciasRecebidas
    });
};

module.exports = {
    obterContas,
    criarConta,
    atualizarUsuarioConta,
    excluirConta,
    saldo,
    extrato
}