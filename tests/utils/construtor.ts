export class ConstrutorDeDadosDeTeste {

    static gerarEmailUnico(): string {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 10000);
        return `teste.qa.${timestamp}.${random}@carrefour.com.br`;
    }

    static gerarUsuarioValido(isAdmin: boolean = false) {
        return {
            nome: 'Usuario Teste QA',
            email: this.gerarEmailUnico(),
            password: 'senha@123',
            administrador: isAdmin ? 'true' : 'false',
        };
    }

    static gerarUsuarioAdmin() {
        return this.gerarUsuarioValido(true);
    }

    static gerarDadosAtualizacao() {
        return {
            nome: 'Usuario Atualizado QA',
            email: this.gerarEmailUnico(),
            password: 'novaSenha@456',
            administrador: 'true',
        };
    }
}