const host = 'http://localhost:8080';
const recorderPort = 'COM7' // Colocar porta acessível da sua maquina para testes
const recorderNum = 1

function verificaResposta(response, retornoEsperado, statusEsperado) {
  if (response.body.status) {
    expect(response.body.message).to.eq(retornoEsperado);
  } else {
    expect(response.body).to.eq(retornoEsperado);
  }
  expect(response.status).to.eq(statusEsperado);
  expect(response).to.have.property('headers');
  expect(response).to.have.property('duration');
}

beforeEach(() => cy.visit(host));

describe('Abrir conexao com porta serial', () => {
  it('Conexão com a porta serial da Gravadora', () => {
    let payload = {"port": recorderPort, "numRecorder": recorderNum}
    cy.request('POST', `${host}/api/serial/conectar`, payload).should((response) => {
      verificaResposta(response, 'Conexão estabelecida com a porta ' + recorderPort, 200)
    });
  });

  it('Conexão com a porta serial não disponível', () => {
    let portName = "COM255"
    let payload = {"port": portName, "numRecorder": recorderNum}
    cy.request('POST', `${host}/api/serial/conectar`, payload).should((response) => {
      verificaResposta(response, 'Não foi possível estabelecer conexão com a porta ' + portName, 200)
    });
  });

  it('Parametros enviados incorretos ou em falta', () => {
    let payload = {"parametroerrado1": recorderPort, "parametroerrado2": recorderNum}
    cy.request({
      method: 'POST',
      url: `${host}/api/serial/conectar`,
      failOnStatusCode: false,
      body: payload
    }).should((response) => verificaResposta(response, 'Parametros faltando', 400));
  });

});

describe('Verificação se existe porta aberta', () => {
  it('Porta que está aberta', () => {
    let payload = {"port": recorderPort, "numRecorder": recorderNum}
    cy.request('POST', `${host}/api/serial/porta-aberta`, payload).should((response) => {
      expect(response.body.status).to.eq(true);
      expect(response.body.port).to.eq(recorderPort);
      expect(response.status).to.eq(200);
      expect(response).to.have.property('headers');
      expect(response).to.have.property('duration');
    });
  });

});

describe('Comando para gerar cartao para um cliente', () => {
  it('Gerar cartao novo cliente', () => {
    let payload = {"apartamentoId": 103, "validade": 12200420}
    cy.request('POST', `${host}/api/serial/novo-cliente`, payload).should((response) => {
      verificaResposta(response, 'Gravação realizada com sucesso', 200)
    });
  });

  it('Parametros enviados incorretos ou em falta', () => {
    let payload = {"parametroerrado1": 103, "parametroerrado2": 12200420}
    cy.request({
      method: 'POST',
      url: `${host}/api/serial/novo-cliente`,
      failOnStatusCode: false,
      body: payload
    }).should((response) => verificaResposta(response, 'Parametros faltando', 400));
  });

});

describe('Fechar conexao com porta serial', () => {
  it('Fechar conexão com a Gravadora', () => {
    cy.request('POST', `${host}/api/serial/desconectar`).should((response) => {
      verificaResposta(response, 'Desconexão realizada', 200)
    });
  });

  it('Fechar conexão com porta não aberta', () => {
    cy.request({
      method: 'POST',
      url: `${host}/api/serial/desconectar`,
      failOnStatusCode: false
    }).should((response) => verificaResposta(response, 'Porta não conectada', 200));
  });

  it('Verificar porta fechada', () => {
    cy.request('POST', `${host}/api/serial/porta-aberta`).should((response) => {
      verificaResposta(response, false, 200)
    });
  });

  it('Tentar enviar comando de novo cartao com porta fechada', () => {
    let payload = {"apartamentoId": 103, "validade": 12200420}
    cy.request({
      method: 'POST',
      url: `${host}/api/serial/novo-cliente`,
      failOnStatusCode: false,
      body: payload
    }).should((response) => verificaResposta(response, 'Porta não conectada', 502));
  });

});

describe('Leitura dos arquivos de log', () => {
  it('Ler ultimas linhas de log', () => {
    let payload = {"port": recorderPort, "numRecorder": recorderNum}
    cy.request('POST', `${host}/api/serial/ultimo-log`, payload).should((response) => {
      expect(response.body).to.not.equal(null);
      expect(response.status).to.eq(200);
      expect(response).to.have.property('headers');
      expect(response).to.have.property('duration');
    });
  });

});


