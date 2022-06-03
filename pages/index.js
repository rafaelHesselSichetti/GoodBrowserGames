import Image from 'next/image'
import eldenring_logo from '../public/assets/eldenring_logo.png'
import MenuLateral from '../components/MenuLateral'
import Header from '../components/Header'
import { getCookie } from 'cookies-next';
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react';
import Head from 'next/head';

export default function Home() {
    const router = useRouter()

    function iniciar() {
        validarLogin()
        categorias()
        catalogo(router.query.categoria)
    }

    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

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

    function catalogo() {
        if (typeof window !== 'undefined') {
            if(router.isReady) {
                if(router.query.categoria != undefined) {
                    var requestOptions = {
                        method: 'GET',
                        redirect: 'follow'
                    };
                    fetch("https://gbg-api.herokuapp.com/api/categorias/" + router.query.categoria, requestOptions)
                        .then(response => response.text())
                        .then(result => {
                            document.getElementById('catalogo-index').innerHTML = ""
                            for (const iterator of JSON.parse(result)) {
                                document.getElementById('catalogo-index').innerHTML += `
                                    <div class="b-game-card" onClick="window.location.href = '/game?id=${iterator.gameId}'">
                                        <div class="b-game-card__cover" style='background-image: url(${iterator.banner})'>
                                        </div>
                                    </div>
                                `
                            }
                        })
                        .catch(error => console.log('error', error));
                } else {
                    fetch("https://gbg-api.herokuapp.com/api/games", requestOptions)
                        .then(response => response.text())
                        .then(result => {
                            document.getElementById('catalogo-index').innerHTML = ""
                            for (const iterator of JSON.parse(result)) {
                                document.getElementById('catalogo-index').innerHTML += `
                                    <div class="b-game-card" onClick="window.location.href = '/game?id=${iterator.id}'">
                                        <div class="b-game-card__cover" style='background-image: url(${iterator.banner})'>
                                        </div>
                                    </div>
                                `
                            }
                        })
                        .catch(error => console.log('error', error));
                }
            }
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
                        document.getElementById('sel-categoria').innerHTML += `
                            <option value="${arr[i].id}">${arr[i].nome}</option>
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
                        <div className="content-wrapper-header">
                            <div className="content-wrapper-context">
                                <h3 className="img-content">
                                    <Image src={eldenring_logo} alt="" width='96px' height='96px' style={{marginRight: '14px'}} />
                                    Elden Ring
                                </h3>
                                <div className="content-text">O NOVO RPG DE AÇÃO E FANTASIA.
                                    Levante-se, Maculado, e seja guiado pela graça para portar o poder do Anel Prístino e se
                                    tornar um Lorde Prístino nas Terras Intermédias.
                                </div>
                            </div>
                        </div>
                        <div className="content-section">
                            <div className="content-section-title">
                                <span>Catálogo</span>
                                <select className="sel-categoria" id="sel-categoria" onChange={() => {window.location.href = '/?categoria=' + document.getElementById('sel-categoria').value}} />
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
