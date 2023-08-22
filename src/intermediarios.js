const { contas } = require('./bancodedados');

const validaSenhaBanco = (req, res, next) => {
    const { senha_banco } = req.query;

    if (!senha_banco) {
        return res.status(404).json({ mensagem: 'Favor, digitar a senha do banco.' })
    };

    if (senha_banco != 'Cubos123Bank') {
        return res.status(400).json({ mensagem: 'Senha do banco incorreta.' });
    };

    next();
};

const validarCPFEmail = (req, res, next) => {
    const { cpf, email } = req.body;

    for (let conta of contas) {
        if (cpf === conta.usuario.cpf) {
            return res.status(400).json({ mensagem: 'O CPF informado já está cadastrado.' });
        };

        if (email === conta.usuario.email) {
            return res.status(400).json({ mensagem: 'O e-mail informado já está cadastrado.' });
        };
    };

    next();
};

const verificarConta = (req, res, next) => {
    const numeroConta = req.params.numeroConta;

    if (isNaN(numeroConta)) {
        return res.status(400).json({ mensagem: 'O numero de conta informado não é válido.' });
    };

    const indiceConta = contas.findIndex(conta => conta.numero == numeroConta);
    if (indiceConta < 0) {
        return res.status(404).json({ mensagem: 'Conta não encontrada.' });
    };

    next();
};

const verificarContaeSenha = (req, res, next) => {
    const { numero_conta, senha } = req.query;

    if (!numero_conta || !senha) {
        return res.status(400).json({ mensagem: 'Favor, informar número de conta e senha.' });
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

    next();

};

module.exports = {
    validaSenhaBanco,
    validarCPFEmail,
    verificarConta,
    verificarContaeSenha,
}