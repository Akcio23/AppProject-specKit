import { Test, TestingModule } from '@nestjs/testing';
import { PasswordService } from './password.service';

describe('PasswordService', () => {
  let service: PasswordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PasswordService],
    }).compile();

    service = module.get<PasswordService>(PasswordService);
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  it('deve gerar hash Argon2id válido para uma senha', async () => {
    const plain = 'MinhaSenhaSegura123!';
    const hash = await service.hash(plain);

    expect(hash).toBeDefined();
    expect(hash).toContain('$argon2id$');
  });

  it('deve verificar com sucesso uma senha correta', async () => {
    const plain = 'MinhaSenhaSegura123!';
    const hash = await service.hash(plain);

    const isValid = await service.verify(hash, plain);
    expect(isValid).toBe(true);
  });

  it('deve rejeitar uma senha incorreta', async () => {
    const plain = 'MinhaSenhaSegura123!';
    const hash = await service.hash(plain);

    const isValid = await service.verify(hash, 'SenhaErrada123!');
    expect(isValid).toBe(false);
  });

  it('deve lidar com dummyHash sem estourar exceção (anti-timing)', async () => {
    await expect(service.verifyDummy('qualquerCoisa')).resolves.not.toThrow();
  });
});
