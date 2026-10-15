/**
 * E2E / Integration Test: Autenticação, Isolamento de Dados e Recuperação de Senha
 */
describe('E2E Auth & Data Isolation', () => {
  const API_BASE = 'http://localhost:3000/api/v1';

  const userA = {
    email: `usera_${Date.now()}@example.com`,
    password: 'PasswordA@123',
    name: 'Irmão A',
  };

  const userB = {
    email: `userb_${Date.now()}@example.com`,
    password: 'PasswordB@123',
    name: 'Irmão B',
  };

  let tokenA: string;
  let refreshA: string;
  let tokenB: string;

  it('deve registrar o Usuário A com sucesso', async () => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userA),
    });

    expect(res.status).toBe(201);
    const body = await res.json();
    const data = body.data || body;
    expect(data.accessToken).toBeDefined();
    expect(data.refreshToken).toBeDefined();
    expect(data.user.email).toBe(userA.email);

    tokenA = data.accessToken;
    refreshA = data.refreshToken;
  });

  it('deve registrar o Usuário B com sucesso', async () => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userB),
    });

    expect(res.status).toBe(201);
    const body = await res.json();
    const data = body.data || body;
    expect(data.accessToken).toBeDefined();
    expect(data.user.email).toBe(userB.email);

    tokenB = data.accessToken;
  });

  it('deve garantir isolamento de dados entre Usuário A e Usuário B', async () => {
    // 1. Usuário A salva um versículo (UUID v4 obrigatório pelo ParseUUIDPipe)
    const verseId = crypto.randomUUID();
    const saveRes = await fetch(`${API_BASE}/me/saved-verses/${verseId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenA}`,
      },
      body: JSON.stringify({
        reference: 'Romanos 8:28',
        text: 'Sabemos que todas as coisas cooperam para o bem daqueles que amam a Deus.',
        translation: 'NVI',
        savedAt: new Date().toISOString(),
      }),
    });
    expect([200, 201]).toContain(saveRes.status);

    // 2. Usuário B lista seus versículos salvos (deve vir vazio ou sem o versículo do A)
    const listResB = await fetch(`${API_BASE}/me/saved-verses`, {
      headers: { Authorization: `Bearer ${tokenB}` },
    });
    expect(listResB.status).toBe(200);
    const listDataB = await listResB.json();
    const versesB = listDataB.data || listDataB;
    const foundAInB = Array.isArray(versesB)
      ? versesB.find((v: { id: string }) => v.id === verseId)
      : undefined;
    expect(foundAInB).toBeUndefined();
  });

  it('deve rotacionar refresh token e invalidar token antigo', async () => {
    // 1. Rotação legítima
    const rotateRes = await fetch(`${API_BASE}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: refreshA }),
    });
    expect(rotateRes.status).toBe(200);
    const rotateBody = await rotateRes.json();
    const rotateData = rotateBody.data || rotateBody;
    const newRefresh = rotateData.refreshToken;
    expect(newRefresh).toBeDefined();
    expect(newRefresh).not.toBe(refreshA);

    // 2. Tentativa de reuso do token anterior (deve ser rejeitada)
    const reuseRes = await fetch(`${API_BASE}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: refreshA }),
    });
    expect(reuseRes.status).toBe(401);
  });
});
