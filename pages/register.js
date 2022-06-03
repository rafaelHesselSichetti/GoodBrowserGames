import { setCookies } from 'cookies-next';
import Head from 'next/head'
import Header from '../components/Header'
import MenuLateral from '../components/MenuLateral'

export default function Home() {
    function iniciar() {
    }

    function cadastrar() {
        if (typeof window !== 'undefined') {
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            var raw = JSON.stringify({
                "usuario": document.getElementsByName('usuario')[0].value,
                "senha": document.getElementsByName('senha')[0].value,
                "email": document.getElementsByName('email')[0].value,
                "nome": document.getElementsByName('nome')[0].value,
                "pais": document.getElementsByName('pais')[0].value,
                "estado": document.getElementsByName('estado')[0].value,
                "dt_nascimento": document.getElementsByName('dt_nascimento')[0].value
            });

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            fetch("https://gbg-api.herokuapp.com/api/usuarios/", requestOptions)
                .then(response => response.text())
                .then(result => {
                    result = JSON.parse(result)
                    if(result.error) {
                        document.getElementById('error-notify').innerHTML = result.error + '<br/><br/>'
                    } else {
                        setCookies('usuarioId', result.id)
                        setCookies('usuario', result.usuario)
                        setCookies('senha', result.senha)
                        window.location.href = '/'
                    }
                })
                .catch(error => console.log('error', error));
        }
    }
    return (
        <div className="app" onLoad={iniciar()}>
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
                                    <h1>Cadastro de usuario</h1>
                                    <br/>
                                    <div id="error-notify" />
                                    <br/>
                                    <div className="group">      
                                        <input type="text" required name='usuario'/>
                                        <span className="highlight"></span>
                                        <span className="bar"></span>
                                        <label>Usuario</label>
                                    </div>
                                    <div className="group">      
                                        <input type="text" required name='nome'/>
                                        <span className="highlight"></span>
                                        <span className="bar"></span>
                                        <label>Nome completo</label>
                                    </div>
                                    <div className="group">
                                        <input type="email" required name='email'/>
                                        <span className="highlight"></span>
                                        <span className="bar"></span>
                                        <label>Email</label>
                                    </div>
                                    <div className="group">      
                                        <input type="password" required name='senha'/>
                                        <span className="highlight"></span>
                                        <span className="bar"></span>
                                        <label>Senha</label>
                                    </div>
                                    <div className="group">      
                                        <input type="date" required name='dt_nascimento' />
                                        <span className="highlight"></span>
                                        <span className="bar"></span>
                                    </div>
                                    <div className="group">      
                                        <input type="text" required name='pais'/>
                                        <span className="highlight"></span>
                                        <span className="bar"></span>
                                        <label>Pais</label>
                                    </div>
                                    <div className="group">
                                        <input type="text" required name='estado'/>
                                        <span className="highlight"></span>
                                        <span className="bar"></span>
                                        <label>Estado</label>
                                    </div>
                                    <button 
                                        className="content-button"
                                        style={{padding: '12px', fontSize: '14px', textTransform: 'uppercase', width: '100%'}}
                                        onClick={cadastrar}>
                                            Registrar
                                    </button>
                                    <br/><br/>
                                    <span style={{margin: '12px 0'}}>
                                        Clique para <a href='/login'>logar</a>
                                    </span>
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
