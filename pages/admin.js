import { getCookie } from 'cookies-next';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../components/Header'
import MenuLateral from '../components/MenuLateral'


export default function Home() {
    function iniciar() {
        validarLogin()
        catalogo()
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
                    } else if (result.cargo != 'Admin') {
                        window.location.href = '/'
                    }
                })
                .catch(error => console.log('error', error));
        }
    }

    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    function catalogo() {
        if (typeof window !== 'undefined') {
            fetch("https://gbg-api.herokuapp.com/api/games", requestOptions)
                .then(response => response.text())
                .then(result => {
                    document.getElementById('catalogo-index').innerHTML = ""
                    for (const iterator of JSON.parse(result)) {
                        document.getElementById('catalogo-index').innerHTML += `
                            <div class="b-game-card" onClick="window.location.href = '/editar-game?id=${iterator.id}'">
                                <div class="b-game-card__cover" style='background-image: url(${iterator.banner})'>
                                </div>
                            </div>
                        `
                    }
                })
                .catch(error => console.log('error', error));
        }
    }

    function categorias() {
        if (typeof window !== 'undefined') {
            fetch("https://gbg-api.herokuapp.com/api/categorias", requestOptions)
                .then(response => response.text())
                .then(result => {
                    document.getElementById('categorias-mnl').innerHTML = ""
                    document.getElementById('sel-categoria').innerHTML = ""
                    var arr = JSON.parse(result)
                    for (const i in arr) {
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
                    <div className="content-wrapper">
                        <div className="content-section">
                            <div className="content-section-title">
                                <span>Catálogo</span>
                                <div>
                                    <Link href='/cadastrar-game'>
                                        <button className="content-button" style={{margin: '0 12px', padding: '12px'}}>Cadastrar novo jogo</button>
                                    </Link>
                                </div>
                            </div>
                            <div className="catalogo-container" id='catalogo-index'></div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="overlay-app"></div>
        </div>
    )
}
