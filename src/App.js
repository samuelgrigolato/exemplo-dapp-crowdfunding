import { useEffect, useState } from 'react';
import TruffleContract from '@truffle/contract';
import SCHEMA_CONTRATO from './Crowdfunding.json';
import './App.css';

function meu(projeto) {
  return window['ethereum'].selectedAddress.toLowerCase() === projeto.solicitante.toLowerCase();
}

function expirado(projeto) {
  return projeto.timestampLimite * 1000 <= new Date().getTime();
}

function arrecadado(projeto) {
  return projeto.weiObtido >= projeto.weiSolicitado;
}

const ENDERECO_CONTRATO = '0x469a6540fb77b118e38a38C8881375101107811c';
const Crowdfunding = TruffleContract(SCHEMA_CONTRATO);

async function buscarProjetos() {
  const contrato = await Crowdfunding.at(ENDERECO_CONTRATO);
  const projetos = await contrato.todosOsProjetos();
  return projetos.map(projeto => ({
    ativo: projeto.ativo,
    solicitante: projeto.solicitante,
    timestampLimite: parseInt(projeto.timestampLimite),
    weiObtido: parseInt(projeto.weiObtido),
    weiSolicitado: parseInt(projeto.weiSolicitado)
  }));
}

function App() {

  const [ state, setState ] = useState({ status: 'inicializando' });
  // const [ state, setState ] = useState({ status: 'processando' });
  // const [ state, setState ] = useState({ status: 'carregando' });
  // const [ state, setState ] = useState({
  //   status: 'erro',
  //   mensagem: 'Algo muito ruim aconteceu!'
  // });
  // const [ state, setState ] = useState({
  //   status: 'pronto',
  //   projetos: [
  //     {
  //       solicitante: '0x135Ca03139Cb9CA04C41c052380Bc872298643a8',
  //       timestampLimite: (new Date().getTime() / 1000) + 100,
  //       ativo: true,
  //       weiObtido: 0,
  //       weiSolicitado: 100
  //     },
  //     {
  //       solicitante: '0x234Ca03139Cb9CA04C41c052380Bc872298643e3',
  //       timestampLimite: (new Date().getTime() / 1000) + 100,
  //       ativo: true,
  //       weiObtido: 0,
  //       weiSolicitado: 100
  //     },
  //     {
  //       solicitante: '0x234Ca03139Cb9CA04C41c052380Bc872298643e3',
  //       timestampLimite: (new Date().getTime() / 1000) + 10000,
  //       ativo: false,
  //       weiObtido: 500,
  //       weiSolicitado: 10000000
  //     },
  //     {
  //       solicitante: '0x234Ca03139Cb9CA04C41c052380Bc872298643e3',
  //       timestampLimite: (new Date().getTime() / 1000) - 300,
  //       ativo: false,
  //       weiObtido: 1000,
  //       weiSolicitado: 9900
  //     },
  //     {
  //       solicitante: '0x234Ca03139Cb9CA04C41c052380Bc872298643e3',
  //       timestampLimite: (new Date().getTime() / 1000) + 100,
  //       ativo: true,
  //       weiObtido: 1000,
  //       weiSolicitado: 900
  //     },
  //     {
  //       solicitante: '0x135Ca03139Cb9CA04C41c052380Bc872298643a8',
  //       timestampLimite: (new Date().getTime() / 1000) + 100,
  //       ativo: true,
  //       weiObtido: 1000,
  //       weiSolicitado: 900
  //     }
  //   ]
  // });

  useEffect(() => {
    if (!window['ethereum']) {
      setState({ status: 'erro', mensagem: 'Habilite/instale a extensão MetaMask e tente novamente' });
      return;
    }
    (async () => {
      try {

        await window['ethereum'].enable();
        setState({ status: 'carregando' });

        Crowdfunding.setProvider(window['ethereum']);

        const projetos = await buscarProjetos();
        setState({
          status: 'pronto',
          projetos
        });

      } catch (err) {
        console.error(err);
        setState({ status: 'erro', mensagem: err.message || err.toString() });
      }
    })();
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
            <button>Solicitar 100 wei em 10 segundos</button>
            <button>Solicitar 1 ETH em 10 minutos</button>
          </div>
          <h1>Projetos</h1>
          {state.projetos.map((projeto, index) => (
            <div
              key={index}
              className='projeto'
              style={{
              }}
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
                {meu(projeto) && (
                  <>
                    {projeto.ativo && !expirado(projeto) && !arrecadado(projeto) && (
                      <>
                        <button>Contribuir 40 wei</button>
                        <button>Contribuir 150 wei</button>
                        <button>Contribuir 1 ETH</button>
                      </>
                    )}
                    {arrecadado(projeto) && (
                      <button>Resgatar</button>
                    )}
                  </>
                )}
                {!meu(projeto) && expirado(projeto) && (
                  <button>Recuperar</button>
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
