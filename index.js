//importar o framework Express 
const express = require('express');

//Importa métodos para validar e chegar os resultados
const {body, validationResult} = require('express-validator');

//Cria uma instância da aplicação 
const app = express()

//Middleware que permite interpretar o JSON no corpo das requisições
app.use(express.json())

//Função CPF

function cpfValido(cpf){
    //Remove qualquer caractere que não seja número
    cpf = cpf.replace(/[^\d]+/g, '')
    //Verifica se tem 11 dígitos ou se todos eles são iguais
    if(cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false

    //valida o primeiro digito verificador
    let soma = 0;
    //for(inicialização;condição;incrementação)
    for(let i = 0; i<9; i++){
        soma += parseInt(cpf[i]) * (10-i)
    }

    let dig1 = 11 - (soma % 11) 
    if(dig1 >=10) dig1 = 0
    if(dig1 !== parseInt(cpf[9]))
    return false

    //valida o segundo digito verficador 
    soma = 0;
    //for(inicialização;condição;incrementação)
    for(let i = 0; i<9; i++){
        soma += parseInt(cpf[i]) * (10-i)
    }

    let dig2 = 11 - (soma % 11) 
    if(dig2 >=10) dig2 = 0
    if(dig2 !== parseInt(cpf[10]))
    return false

    //11111111111

    return true

}

//Rota post para /login com validação
app.post('/login', [
    body('email').isEmail().withMessage('Email inválido!'), //verifica se o campo email é um formato de email
    body('senha').notEmpty().withMessage('Senha é obrigatória!')//Verifica se o campo senha não está vazio
], (req, res)=>{
    //pega o resultado das validações
    const erros = validationResult(req)

    //se houver erros, retorna o status 400 e a lista de erros 
    if(!erros.isEmpty()){
        return res.status(400).json({erros: erros.array()})
    }
    res.send('Login bem-sucedido!')
}
)

app.post('/cadastro',[

    //verifica se o nome o usuário foi preenchido
    body('nome')
    .trim()//Remove espaços no início ao fim;
    .notEmpty()
    .withMessage('Nome é obrigatório!'),

    //verifica se o email tem formato válido
    body('email')
    .trim()//remove espaço a mais
    .normalizeEmail()//ajusta todos para letra minúscula
    .isEmail()
    .withMessage('Email inválido!'),

    body('idade').isInt({min:18}).withMessage('Idade mínima é 18 anos'),
    body('senha').isLength({min:8}).withMessage('Senha muito curta'),
    //validação e sanitização do cpf
    body('cpf')
        .trim()
        .blacklist('.-')//remove pontos e traços
        .custom(cpf=>{
            if(!cpfValido(cpf)){
                throw new Error('CPF Inválido')
            }
            return true
        }),

    body('ativo').toBoolean()
], (req, res) => {
    //coleta os erros
    const erros = validationResult(req)

    //se houver erros, retorna 400 com os detalhes
    if (!erros.isEmpty()){
        return res.status(400).json({
            erros: erros.array()
        })
    }

    res.send('Usuário cadastrado com sucesso!')
}

//pessoa


)



app.listen(3000, ()=>console.log('Servidor rodando na porta 3000'))