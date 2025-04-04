//importar o framework Express 
const express = require('express');

//Importa métodos para validar e chegar os resultados
const {body, validationResult} = require('express-validator');

//Cria uma instância da aplicação 
const app = express()

//Middleware que permite interpretar o JSON no corpo das requisições
app.use(express.json())

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
    body('nome').notEmpty().withMessage('Nome é obrigatório!'),

    //verifica se o email tem formato válido
    body('email').isEmail().withMessage('Email inválido!'),
    body('idade').isInt({min:18}).withMessage('Idade mínima é 18 anos'),
    body('senha').isLength({min:8}).withMessage('Senha muito curta'),
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