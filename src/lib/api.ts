// Configuração da API
const API_BASE_URL = import.meta.env?.VITE_API_URL || 'http://localhost:3001/api';

// Classe para gerenciar requisições HTTP
class ApiClient {
  private baseURL: string;
  private token: string | null;

  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('auth_token');
  }

  // Configurar token de autenticação
  setToken(token: string) {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  // Remover token
  removeToken() {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  // Headers padrão
  private getHeaders() {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    return headers;
  }

  // Método genérico para requisições
  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `HTTP ${response.status}`);
    }

    return data;
  }

  // Métodos HTTP
  async get(endpoint: string) {
    return this.request(endpoint, { method: 'GET' });
  }

  async post(endpoint: string, body?: any) {
    return this.request(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async put(endpoint: string, body?: any) {
    return this.request(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async delete(endpoint: string) {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

// Instância global da API
export const api = new ApiClient();

// ============================================
// FUNÇÕES ESPECÍFICAS DA API
// ============================================

// Autenticação
export const auth = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.token) {
      api.setToken(response.token);
    }
    return response;
  },

  register: async (userData: any) => {
    const response = await api.post('/auth/register', userData);
    if (response.token) {
      api.setToken(response.token);
    }
    return response;
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      api.removeToken();
    }
  },

  getCurrentUser: async () => {
    return api.get('/auth/me');
  },

  changePassword: async (currentPassword: string, newPassword: string) => {
    return api.put('/auth/change-password', {
      currentPassword,
      newPassword,
    });
  },
};

// Atendimentos
export const getAtendimentos = async (params?: {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  data_inicio?: string;
  data_fim?: string;
}) => {
  const searchParams = new URLSearchParams();
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString());
      }
    });
  }

  const queryString = searchParams.toString();
  const endpoint = `/atendimentos${queryString ? `?${queryString}` : ''}`;
  
  return api.get(endpoint);
};

export const getAtendimento = async (id: string) => {
  return api.get(`/atendimentos/${id}`);
};

export const createAtendimento = async (atendimento: any) => {
  return api.post('/atendimentos', atendimento);
};

export const updateAtendimento = async (id: string, atendimento: any) => {
  return api.put(`/atendimentos/${id}`, atendimento);
};

export const deleteAtendimento = async (id: string) => {
  return api.delete(`/atendimentos/${id}`);
};

export const getAtendimentosStats = async () => {
  return api.get('/atendimentos/stats/overview');
};

// Clientes
export const clientes = {
  list: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    tipo_pessoa?: string;
  }) => {
    const searchParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, value.toString());
        }
      });
    }

    const queryString = searchParams.toString();
    const endpoint = `/clientes${queryString ? `?${queryString}` : ''}`;
    
    return api.get(endpoint);
  },

  get: async (id: string) => {
    return api.get(`/clientes/${id}`);
  },

  create: async (cliente: any) => {
    return api.post('/clientes', cliente);
  },

  update: async (id: string, cliente: any) => {
    return api.put(`/clientes/${id}`, cliente);
  },

  delete: async (id: string) => {
    return api.delete(`/clientes/${id}`);
  },

  autocomplete: async (query: string) => {
    return api.get(`/clientes/search/autocomplete?q=${encodeURIComponent(query)}`);
  },

  stats: async () => {
    return api.get('/clientes/stats/overview');
  },
};

// CRM / Leads
export const crm = {
  leads: {
    list: async (params?: {
      page?: number;
      limit?: number;
      status?: string;
      plataforma?: string;
      search?: string;
      data_inicio?: string;
      data_fim?: string;
    }) => {
      const searchParams = new URLSearchParams();
      
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            searchParams.append(key, value.toString());
          }
        });
      }

      const queryString = searchParams.toString();
      const endpoint = `/crm/leads${queryString ? `?${queryString}` : ''}`;
      
      return api.get(endpoint);
    },

    get: async (id: string) => {
      return api.get(`/crm/leads/${id}`);
    },

    create: async (lead: any) => {
      return api.post('/crm/leads', lead);
    },

    update: async (id: string, lead: any) => {
      return api.put(`/crm/leads/${id}`, lead);
    },

    delete: async (id: string) => {
      return api.delete(`/crm/leads/${id}`);
    },

    convert: async (id: string) => {
      return api.post(`/crm/leads/${id}/convert`);
    },
  },

  stats: async (periodo?: string) => {
    const endpoint = `/crm/stats${periodo ? `?periodo=${periodo}` : ''}`;
    return api.get(endpoint);
  },

  funil: async () => {
    return api.get('/crm/funil');
  },
};

// Agenda
export const agenda = {
  list: async (params?: {
    data_inicio?: string;
    data_fim?: string;
    tipo?: string;
    status?: string;
    cliente_id?: string;
    advogado_id?: string;
  }) => {
    const searchParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, value.toString());
        }
      });
    }

    const queryString = searchParams.toString();
    const endpoint = `/agenda${queryString ? `?${queryString}` : ''}`;
    
    return api.get(endpoint);
  },

  get: async (id: string) => {
    return api.get(`/agenda/${id}`);
  },

  create: async (agendamento: any) => {
    return api.post('/agenda', agendamento);
  },

  update: async (id: string, agendamento: any) => {
    return api.put(`/agenda/${id}`, agendamento);
  },

  delete: async (id: string) => {
    return api.delete(`/agenda/${id}`);
  },

  hoje: async () => {
    return api.get('/agenda/hoje/list');
  },

  proximos: async (limit?: number) => {
    const endpoint = `/agenda/proximos/list${limit ? `?limit=${limit}` : ''}`;
    return api.get(endpoint);
  },
};

// Dashboard
export const dashboard = {
  stats: async (periodo?: string) => {
    const endpoint = `/dashboard/stats${periodo ? `?periodo=${periodo}` : ''}`;
    return api.get(endpoint);
  },

  chartData: async (periodo?: string) => {
    const endpoint = `/dashboard/chart-data${periodo ? `?periodo=${periodo}` : ''}`;
    return api.get(endpoint);
  },

  proximosAgendamentos: async (limit?: number) => {
    const endpoint = `/dashboard/proximos-agendamentos${limit ? `?limit=${limit}` : ''}`;
    return api.get(endpoint);
  },

  leadsPorOrigem: async (periodo?: string) => {
    const endpoint = `/dashboard/leads-por-origem${periodo ? `?periodo=${periodo}` : ''}`;
    return api.get(endpoint);
  },

  atividadesRecentes: async (limit?: number) => {
    const endpoint = `/dashboard/atividades-recentes${limit ? `?limit=${limit}` : ''}`;
    return api.get(endpoint);
  },
};

// Configurações
export const configuracoes = {
  get: async () => {
    return api.get('/configuracoes');
  },

  update: async (config: any) => {
    return api.put('/configuracoes', config);
  },

  getNotificacoes: async () => {
    return api.get('/configuracoes/notificacoes');
  },

  updateNotificacoes: async (config: any) => {
    return api.put('/configuracoes/notificacoes', config);
  },

  backup: async () => {
    return api.post('/configuracoes/backup');
  },

  limparCache: async () => {
    return api.post('/configuracoes/limpar-cache');
  },
};

// Perfil
export const perfil = {
  get: async () => {
    return api.get('/perfil');
  },

  update: async (perfil: any) => {
    return api.put('/perfil', perfil);
  },

  changePassword: async (currentPassword: string, newPassword: string, confirmPassword: string) => {
    return api.put('/perfil/senha', {
      current_password: currentPassword,
      new_password: newPassword,
      confirm_password: confirmPassword,
    });
  },

  uploadFoto: async (file: File) => {
    // Implementação de upload será adicionada futuramente
    return api.post('/perfil/foto');
  },

  getAtividades: async (limit?: number) => {
    const endpoint = `/perfil/atividades${limit ? `?limit=${limit}` : ''}`;
    return api.get(endpoint);
  },

  desativar: async (password: string, motivo?: string) => {
    return api.post('/perfil/desativar', { password, motivo });
  },
};

// Utilitários
export const utils = {
  // Health check da API
  healthCheck: async () => {
    return fetch(`${API_BASE_URL.replace('/api', '')}/health`).then(res => res.json());
  },

  // Verificar se API está online
  isOnline: async (): Promise<boolean> => {
    try {
      await utils.healthCheck();
      return true;
    } catch {
      return false;
    }
  },
};

// Hook para verificar status da API (remover ou implementar com React hooks apropriados)
// export const useApiStatus = () => {
//   const [isOnline, setIsOnline] = useState(true);

//   useEffect(() => {
//     const checkStatus = async () => {
//       const online = await utils.isOnline();
//       setIsOnline(online);
//     };

//     checkStatus();
//     const interval = setInterval(checkStatus, 30000); // Verificar a cada 30s

//     return () => clearInterval(interval);
//   }, []);

//   return isOnline;
// };

export default api;
