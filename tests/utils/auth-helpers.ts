import { ApiClient } from './clientes';
import { ConstrutorDeDadosDeTeste } from './construtor';

export class AuthHelper {
  private apiClient: ApiClient;
  private createdUserIds: string[] = [];

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  async createUserAndLogin(isAdmin: boolean = false): Promise<{
    token: string;
    userId: string;
    userData: any;
  }> {
    const userData = isAdmin 
      ? ConstrutorDeDadosDeTeste.gerarUsuarioAdmin() 
      : ConstrutorDeDadosDeTeste.gerarUsuarioValido();
    
    const createResponse = await this.apiClient.post('/usuarios', userData);
    const userId = createResponse.data._id;
    
    this.createdUserIds.push(userId);

    const loginResponse = await this.apiClient.post('/login', {
      email: userData.email,
      password: userData.password,
    });

    const token = loginResponse.data.authorization;

    return {
      token,
      userId,
      userData,
    };
  }

  async login(email: string, password: string): Promise<string> {
    const response = await this.apiClient.post('/login', {
      email,
      password,
    });

    return response.data.authorization;
  }

  async cleanupUsers(): Promise<void> {
    for (const userId of this.createdUserIds) {
      try {
        await this.apiClient.delete(`/usuarios/${userId}`);
      } catch (error) {
        console.warn(`Falha ao deletar usuário ${userId}:`, error);
      }
    }
    this.createdUserIds = [];
  }

  generateInvalidToken(): string {
    return 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
  }
}