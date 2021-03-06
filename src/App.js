import { useCallback, useEffect, useState } from 'react';
import './App.css';

function meu(projeto) {
  return '0x135Ca03139Cb9CA04C41c052380Bc872298643a8'.toLowerCase() === projeto.solicitante.toLowerCase();
}

function expirado(projeto) {
  return projeto.timestampLimite * 1000 <= new Date().getTime();
}

function arrecadado(projeto) {
  return projeto.weiObtido >= projeto.weiSolicitado;
}

function App() {

  // const [ state, setState ] = useState({ status: 'inicializando' });
  // const [ state, setState ] = useState({ status: 'processando' });
  // const [ state, setState ] = useState({ status: 'carregando' });
  // const [ state, setState ] = useState({
  //   status: 'erro',
  //   mensagem: 'Algo muito ruim aconteceu!'
  // });
  const [ state, setState ] = useState({
    status: 'pronto',
    projetos: [
      {
        solicitante: '0x135Ca03139Cb9CA04C41c052380Bc872298643a8',
        timestampLimite: (new Date().getTime() / 1000) + 100,
        ativo: true,
        weiObtido: 0,
        weiSolicitado: 100
      },
      {
        solicitante: '0x234Ca03139Cb9CA04C41c052380Bc872298643e3',
        timestampLimite: (new Date().getTime() / 1000) + 100,
        ativo: true,
        weiObtido: 0,
        weiSolicitado: 100
      },
      {
        solicitante: '0x234Ca03139Cb9CA04C41c052380Bc872298643e3',
        timestampLimite: (new Date().getTime() / 1000) + 10000,
        ativo: false,
        weiObtido: 500,
        weiSolicitado: 10000000
      },
      {
        solicitante: '0x234Ca03139Cb9CA04C41c052380Bc872298643e3',
        timestampLimite: (new Date().getTime() / 1000) - 300,
        ativo: false,
        weiObtido: 1000,
        weiSolicitado: 9900
      },
      {
        solicitante: '0x234Ca03139Cb9CA04C41c052380Bc872298643e3',
        timestampLimite: (new Date().getTime() / 1000) + 100,
        ativo: true,
        weiObtido: 1000,
        weiSolicitado: 900
      },
      {
        solicitante: '0x135Ca03139Cb9CA04C41c052380Bc872298643a8',
        timestampLimite: (new Date().getTime() / 1000) + 100,
        ativo: true,
        weiObtido: 1000,
        weiSolicitado: 900
      }
    ]
  });

  const solicitar = useCallback(async (wei, limiteEmSegundos) => {
  }, []);

  const contribuir = useCallback(async (idProjeto, wei) => {
  }, []);

  const recuperar = useCallback(async (idProjeto) => {
  }, []);

  const resgatar = useCallback(async (idProjeto) => {
  }, []);

  return (
    <div>
      {state.status === 'inicializando' && (
        <p>Inicializando...</p>
      )}
      {state.status === 'processando' && (
        <p>Processando...</p>
      )}
      {state.status === 'carregando' && (
        <p>Carregando...</p>
      )}
      {state.status === 'erro' && (
        <p style={{ color: 'red' }}>{state.mensagem}</p>
      )}
      {state.status === 'pronto' && (
        <>
          <div>
            <button onClick={() => solicitar(100, 10)}>
              Solicitar 100 wei em 10 segundos
              </button>
            <button onClick={() => solicitar('1000000000000000000', 10 * 60)}>
              Solicitar 1 ETH em 10 minutos
            </button>
          </div>
          <h1>Projetos</h1>
          {state.projetos.map((projeto, index) => (
            <div
              key={index}
              className='projeto'
            >
              <p>
                <strong>Projeto #{index}</strong><br />
                Solicitante: {projeto.solicitante}
                {meu(projeto) && (
                  <span style={{ color: 'blue' }}> (meu projeto!)</span>
                )}
                {!projeto.ativo && (
                  <span style={{ color: 'gray' }}> (inativo)</span>
                )}<br />
                Data limite: {new Date(projeto.timestampLimite * 1000).toLocaleString()}
                {expirado(projeto) && (
                  <span style={{ color: 'red' }}> (expirado!)</span>
                )}<br />
                Progresso: {projeto.weiObtido} obtido(s) de {projeto.weiSolicitado} solicitado(s)
                {arrecadado(projeto) && (
                  <span style={{ color: 'green' }}> (completamente arrecadado!)</span>
                )}
              </p>
              <p>
                {!meu(projeto) && (
                  <>
                    {projeto.ativo && !expirado(projeto) && !arrecadado(projeto) && (
                      <>
                        <button onClick={() => contribuir(index, 40)}>
                          Contribuir 40 wei
                        </button>
                        <button onClick={() => contribuir(index, 150)}>
                          Contribuir 150 wei
                        </button>
                        <button onClick={() => contribuir(index, '1000000000000000000')}>
                          Contribuir 1 ETH
                        </button>
                      </>
                    )}
                    {expirado(projeto) && (
                      <button onClick={() => recuperar(index)}>Recuperar</button>
                    )}
                  </>
                )}
                {meu(projeto) && projeto.ativo && arrecadado(projeto) && (
                  <button onClick={() => resgatar(index)}>Resgatar</button>
                )}
              </p>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

export default App;
