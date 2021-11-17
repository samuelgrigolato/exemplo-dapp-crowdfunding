import { useCallback, useEffect, useState } from 'react';
import TruffleContract from '@truffle/contract';
import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3 from "web3";
import SCHEMA_CONTRATO from './Crowdfunding.json';
import './App.css';

const ENDERECO_ROPSTEN = '0x6C19bDcb7aDec160F17E6ed2eeaEAb01411E431e';

const provider = new WalletConnectProvider({
  infuraId: "b46382ca47364b21b6ed9379fc70f023",
  chainId: 3 /*ropsten*/
});

function meu(projeto) {
  //return window['ethereum'].selectedAddress.toLowerCase() === projeto.solicitante.toLowerCase();
  return provider.accounts[0].toLowerCase() === projeto.solicitante.toLowerCase();
}

function expirado(projeto) {
  return projeto.timestampLimite * 1000 <= new Date().getTime();
}

function arrecadado(projeto) {
  return projeto.weiObtido >= projeto.weiSolicitado;
}

// const ENDERECO_CONTRATO = '0x469a6540fb77b118e38a38C8881375101107811c';
// const Crowdfunding = TruffleContract(SCHEMA_CONTRATO);

async function buscarProjetos() {
  // const contrato = await Crowdfunding.at(ENDERECO_CONTRATO);
  // const projetos = await contrato.todosOsProjetos();

  const web3 = new Web3(provider);
  const projetosEncoded = await web3.eth.call({
    from: provider.accounts[0],
    to: ENDERECO_ROPSTEN,
    data: web3.eth.abi.encodeFunctionCall(
      {
        "inputs": [],
        "name": "todosOsProjetos",
        "outputs": [
          {
            "components": [
              {
                "internalType": "address",
                "name": "solicitante",
                "type": "address"
              },
              {
                "internalType": "uint256",
                "name": "weiSolicitado",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "weiObtido",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "timestampLimite",
                "type": "uint256"
              },
              {
                "internalType": "bool",
                "name": "ativo",
                "type": "bool"
              }
            ],
            "internalType": "struct Crowdfunding.Projeto[]",
            "name": "",
            "type": "tuple[]"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      []
    )
  });
  const projetos = web3.eth.abi.decodeParameter(
    {
      "components": [
        {
          "internalType": "address",
          "name": "solicitante",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "weiSolicitado",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "weiObtido",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "timestampLimite",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "ativo",
          "type": "bool"
        }
      ],
      "internalType": "struct Crowdfunding.Projeto[]",
      "name": "",
      "type": "tuple[]"
    },
    projetosEncoded
  );
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
    // if (!window['ethereum']) {
    //   setState({ status: 'erro', mensagem: 'Habilite/instale a extensão MetaMask e tente novamente' });
    //   return;
    // }
    (async () => {
      try {

        await provider.enable();
        // await window['ethereum'].enable();

        // setState({ status: 'carregando' });

        // Crowdfunding.setProvider(window['ethereum']);

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

  const solicitar = useCallback(async (wei, limiteEmSegundos) => {
    try {

      setState({ status: 'processando' });
      
      const web3 = new Web3(provider);
      await web3.eth.sendTransaction({
        from: provider.accounts[0],
        to: ENDERECO_ROPSTEN,
        data: web3.eth.abi.encodeFunctionCall(
          {
            "inputs": [
              {
                "internalType": "uint256",
                "name": "_wei",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "limiteEmSegundos",
                "type": "uint256"
              }
            ],
            "name": "solicitar",
            "outputs": [
              {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
              }
            ],
            "stateMutability": "nonpayable",
            "type": "function"
          },
          [wei, limiteEmSegundos]
        )
      });
      // const contrato = await Crowdfunding.at(ENDERECO_CONTRATO);
      // await contrato.solicitar(wei, limiteEmSegundos, {
      //   from: window['ethereum'].selectedAddress
      // });

      setState({ status: 'carregando' });
      const projetos = await buscarProjetos();
      setState({
        status: 'pronto',
        projetos
      });

    } catch (err) {
      console.error(err);
      setState({ status: 'erro', mensagem: err.message || err.toString() });
    }
  }, []);

  const contribuir = useCallback(async (idProjeto, wei) => {
    try {

      setState({ status: 'processando' });
      throw new Error('não implementado ainda...');
      // const contrato = await Crowdfunding.at(ENDERECO_CONTRATO);
      // await contrato.contribuir(idProjeto, {
      //   value: wei,
      //   from: window['ethereum'].selectedAddress
      // });
      setState({ status: 'carregando' });
      const projetos = await buscarProjetos();
      setState({
        status: 'pronto',
        projetos
      });

    } catch (err) {
      console.error(err);
      setState({ status: 'erro', mensagem: err.message || err.toString() });
    }
  }, []);

  const resgatar = useCallback(async (idProjeto) => {
    try {

      setState({ status: 'processando' });
      throw new Error('não implementado ainda...');
      // const contrato = await Crowdfunding.at(ENDERECO_CONTRATO);
      // await contrato.resgatar(idProjeto, {
      //   from: window['ethereum'].selectedAddress
      // });
      setState({ status: 'carregando' });
      const projetos = await buscarProjetos();
      setState({
        status: 'pronto',
        projetos
      });

    } catch (err) {
      console.error(err);
      setState({ status: 'erro', mensagem: err.message || err.toString() });
    }
  }, []);

  const recuperar = useCallback(async (idProjeto) => {
    try {

      setState({ status: 'processando' });
      throw new Error('não implementado ainda...');
      // const contrato = await Crowdfunding.at(ENDERECO_CONTRATO);
      // await contrato.recuperarMinhasContribuicoes(idProjeto, {
      //   from: window['ethereum'].selectedAddress
      // });
      setState({ status: 'carregando' });
      const projetos = await buscarProjetos();
      setState({
        status: 'pronto',
        projetos
      });

    } catch (err) {
      console.error(err);
      setState({ status: 'erro', mensagem: err.message || err.toString() });
    }
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
