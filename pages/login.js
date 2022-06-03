import { setCookies } from 'cookies-next'
import Head from 'next/head';
import MenuLateral from '../components/MenuLateral'


export default function Home() {

    function logar() {
        if (typeof window !== 'undefined') {
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            var raw = JSON.stringify({
                "usuario": document.getElementsByName('usuario')[0].value,
                "senha": document.getElementsByName('senha')[0].value
            });

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };
            fetch("https://gbg-api.herokuapp.com/api/usuarios/validar", requestOptions)
                .then(response => response.text())
                .then(result => {
                    result = JSON.parse(result)
                    if(!result.error) {
                        setCookies('usuarioId', result.id)
                        setCookies('usuario', result.usuario)
                        setCookies('senha', result.senha)
                        window.location.href = '/'
                    } else {
                        document.getElementById('login-alerta').innerHTML = `<br> Usuario ou senha incorreta! <br><br>`
                    }
                })
                .catch(error => console.log('error', error));
        }
    }
    return (
        <div className="app">
            <Head>
                <title>Good Browser Games</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>
            <div className="wrapper">
                <div className="main-container">
                    <div className="content-wrapper">
                        <div className="content-section">
                            <div className="content-section-title">
                                <span>Good Game Browser</span>
                            </div>
                            <div className="catalogo-container login-container">
                                <div>
                                    <h1>Acesso de usuario</h1>
                                    <span id='login-alerta' />
                                    <br/>
                                    <div className="group">      
                                        <input type="text" required name='usuario' />
                                        <span className="highlight"></span>
                                        <span className="bar"></span>
                                        <label>Usuario</label>
                                    </div>
                                    <div className="group">      
                                        <input type="password" required name='senha' />
                                        <span className="highlight"></span>
                                        <span className="bar"></span>
                                        <label>Senha</label>
                                    </div>
                                    <div style={{display: 'flex' ,flexDirection: 'column'}}>
                                        <button 
                                            className="content-button"
                                            style={{padding: '12px', fontSize: '14px', textTransform: 'uppercase'}}
                                            onClick={logar}>
                                                Logar
                                        </button>
                                        <br />
                                        <span style={{margin: '12px 0'}}>
                                            Clique para se <a href='/register'>cadastrar</a>
                                        </span>
                                    </div>
                                </div>
                            </div> 
                        </div>
                    </div>
                </div>
            </div>
            <div className="overlay-app">

            </div>
        </div>
    )
}
