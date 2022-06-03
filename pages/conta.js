import { getCookie } from 'cookies-next'
import Head from 'next/head'
import Header from '../components/Header'
import MenuLateral from '../components/MenuLateral'

export default function Home() {
    function iniciar() {
        validarLogin()
        categorias()
    }

    function validarLogin() {
        if (typeof window !== 'undefined') {

            if(getCookie('usuario') == undefined || getCookie('senha') == undefined) {
                window.location.href = '/login'
            }

            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            var raw = JSON.stringify({
                "usuario": getCookie('usuario'),
                "senha": getCookie('senha')
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
                    if(result.error) {
                        window.location.href = '/login'
                    }
                })
                .catch(error => console.log('error', error));
        }
    }

    function atualizarCadastro() {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        var raw = JSON.stringify({
            "usuario": getCookie('usuario'),
            "senha": document.getElementsByName('senha')[0].value,
            "email": document.getElementsByName('email')[0].value,
            "nome": document.getElementsByName('nome')[0].value,
            "pais": document.getElementsByName('pais')[0].value,
            "estado": document.getElementsByName('estado')[0].value,
            "dt_nascimento": document.getElementsByName('data_nascimento')[0].value
        });
        console.log(raw)

        var requestOptions = {
            method: 'PUT',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("https://gbg-api.herokuapp.com/api/usuarios/" + getCookie('usuarioId'), requestOptions)
            .then(response => response.text())
            .then(result => {
                console.log(result)
                document.getElementsByName('nome')[0].value = ""
                document.getElementsByName('senha')[0].value = ""
                document.getElementsByName('email')[0].value = ""
                document.getElementsByName('pais')[0].value = ""
                document.getElementsByName('estado')[0].value = ""
                document.getElementsByName('data_nascimento')[0].value = ""
            })
            .catch(error => console.log('error', error));
    }

    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    function categorias() {
        if (typeof window !== 'undefined') {
            fetch("https://gbg-api.herokuapp.com/api/categorias", requestOptions)
                .then(response => response.text())
                .then(result => {
                    document.getElementById('categorias-mnl').innerHTML = ""
                    var arr = JSON.parse(result)
                    for(var i = 0; i < 5; i++) {
                        document.getElementById('categorias-mnl').innerHTML += `
                            <a href="/?categoria=${arr[i].id}">
                                ${arr[i].nome}
                            </a>
                        `
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
            <Header />
            <div className="wrapper">
                <MenuLateral />
                <div className="main-container">
                    <div className="content-wrapper" style={{width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                        <h1>Cadastro pessoal</h1>
                        <br />
                        <div className='cadastro-pessoal' style={{width: '50%', display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', alignContent: 'center'}}>
                            <div style={{display: 'flex', flexWrap: 'wrap', flexDirection: 'column', justifyContent: 'flex-start', alignContent: 'center'}}>
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
                                    <input type="date" required name='data_nascimento'/>
                                    <span className="highlight"></span>
                                    <span className="bar"></span>
                                </div>
                            </div>
                            <div style={{display: 'flex', flexWrap: 'wrap', flexDirection: 'column', justifyContent: 'flex-start', alignContent: 'center'}}>
                                <div className="group">      
                                    <input type="text" required name='pais'/>
                                    <span className="highlight"></span>
                                    <span className="bar"></span>
                                    <label>País</label>
                                </div>
                                <div className="group">
                                    <input type="text" required name='estado'/>
                                    <span className="highlight"></span>
                                    <span className="bar"></span>
                                    <label>Estado</label>
                                </div>
                                <div className="group">      
                                    <input type="password" required name='senha'/>
                                    <span className="highlight"></span>
                                    <span className="bar"></span>
                                    <label>Senha</label>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={atualizarCadastro}
                            className="content-button"
                            style={{padding: '12px', fontSize: '14px', textTransform: 'uppercase', width: '25%'}}
                        >
                            Atualizar
                        </button>
                    </div>
                </div>
            </div>
            <div className="overlay-app">

            </div>
        </div>
    )
}
