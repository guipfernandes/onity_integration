<main>
  <div id="app">
    <h1 class="centered">ONITY-HT24</h1>
    <div class="form">
      <div>
        <div>
          <span for="input-recorder">N.° Gravadora:</span>
          <input id="input-recorder" type="number" bind:value={numRecorder}/>
        </div>
        <div>
          <span>Porta:</span>
          <select id="input-port" bind:value={port}>
            {#each ports as item}
              <option value={item}>{item}</option>
            {/each}
          </select>
        </div>
        <div class="centered">
          {#if !connected}
            <button id="btn-connect" on:click={connect}>Abrir Porta</button>
          {:else}
            <button id="btn-disconnect" on:click={disconnect}>Fechar Porta</button>
          {/if}
        </div>
      </div>
      <div style="margin-top: 50px;">
        <div>
          <span for="input-recorder">N.° Apartamento:</span>
          <input id="input-recorder" type="number" bind:value={numApartment}/>
        </div>
        <div class="centered">
          <button id="btn-record-card" on:click={recordCard}>Gravar Cartão</button>
        </div>
      </div>
    </div>
    <div class="box-log">
      <pre id="communication-log">{log}</pre>
    </div>
  </div>
</main>

<script>
	import remoteService from './remoteService';
  const socket = new WebSocket("ws://localhost:8081");

	let numRecorder = 1
	let numApartment = 1
	let ports = []
	let port
	let connected = false
	let log = ''

	for (let i = 0; i < 256; i++) {
		ports[i] = "COM" + (i + 1);
  }

  function print(message) {
    log += `${message}\n`
    let boxLog = document.querySelector(".box-log")
    boxLog.scrollTop = boxLog.scrollHeight;
  }

  (function() {
    remoteService.lastLog().then(({data}) => {
      print(data)
		})
		remoteService.isPortOpen().then(({data}) => {
      if (data.status) {
        connected = data.status
        port = data.port
      } else {
        connected = data
      }
		})
  })()
  
  socket.onmessage = function (event) {
    let data = event.data
    print(data)
  }
  
  socket.onerror = function(error) {
    print(error.message)
  };

	function connect() {
		remoteService.connectPort({port, numRecorder}).then(({data: retorno}) => {
      if (retorno.status && retorno.status == 'error') {
        connected = false
        print(retorno.message)
      } else {
        connected = true
        print(retorno)
      }
		})
	}

	function disconnect() {
		remoteService.disconnectPort().then(({data: retorno}) => {
      connected = false
      if (retorno.status && retorno.status == 'error') {
        print(retorno.message)
      } else {
        print(retorno)
      }
		})
  }
  
  function recordCard() {
    remoteService.recordCard({apartamentoId: numApartment})
  }
  
</script>

<style>
	:global(body) {
		background-color: black;
	}

  div {
    padding: 5px;
  }

  h1 {
    color: #008cba;
    font-size: 32px;
    font-weight: 300;
  }

  h1,
  span {
    font-family: "Times New Roman", Times, serif;
  }

  span {
    color: #dfdede;
  }

  input {
    width: 70px;
    border: 1px solid rgb(59, 59, 59);
    background-color: black;
    color: #dfdede;
    height: 30px;
    padding: 5px 10px 5px 5px;
    margin-left: 10px;
    border-radius: 3px;
  }

  input:focus {
    outline: none !important;
    border: 1px solid #dfdede;
    box-shadow: 0 0 3px #dfdede;
  }

  select {
    width: 130px;
    border: 1px solid rgb(59, 59, 59);
    background-color: black;
    color: #dfdede;
    padding: 5px 10px 5px 5px;
    margin-left: 10px;
    border-radius: 3px;
  }

  select:focus {
    outline: none !important;
    border: 1px solid #dfdede;
    box-shadow: 0 0 3px #dfdede;
  }

  option {
    color: #dfdede;
  }

  button {
    outline: none;
    border: none;
    color: white;
    padding: 10px 25px;
    margin-top: 10px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 14px;
    border-radius: 20px;
    box-shadow: 0 0 10px #424242d2;
  }

  button:active {
    opacity: 0.8;
    box-shadow: 0 0 0px;
  }

  #btn-connect {
    background-color: #008cba;
  }

  #btn-disconnect {
    background-color: rgb(245, 11, 11);
  }

  #btn-record-card {
    background-color: #28a745;
  }

  .form {
    display: flex;
    justify-content: space-around;
  }

  .centered {
    display: flex;
    justify-content: center;
  }

  .box-log {
    margin-top: 20px;
    background-color: #1f1f1f;
    color: rgb(168, 168, 168);
    height: 310px;
    overflow: auto;
    border-radius: 3px;
    font-family: "Lucida Sans", "Lucida Sans Regular", "Lucida Grande",
      "Lucida Sans Unicode", Geneva, Verdana, sans-serif;
    font-size: 12px;
  }
</style>