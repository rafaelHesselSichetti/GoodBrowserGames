import Header from '../components/Header'
import MenuLateral from '../components/MenuLateral'
import Image from 'next/image'
import ReactStars from 'react-stars'
import { getCookie } from 'cookies-next'
import { useRouter } from 'next/router'
import { createElement, useEffect, useState } from 'react'
import Avaliacao from '../components/Avaliacao'
import Head from 'next/head'


export default function Game(req, res) {
    const router = useRouter()
    const [imgSrc, setImgSrc] = useState("");
    const [urlSrc, setUrlSrc] = useState("")
    const [rate, setRate] = useState(0)
    const [avaliacoes, setAvaliacoes] = useState([]);

    function iniciar() {
        if (typeof window !== 'undefined') {
            validarLogin()
            categorias()
        }
    }

    function avaliar() {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        var raw = JSON.stringify({
          "usuarioId": getCookie('usuarioId'),
          "gameId": router.query.id,
          "nota": rate,
          "texto": document.getElementsByName('avaliar-texto')[0].value
        });
        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };
        fetch("https://gbg-api.herokuapp.com/api/rate/", requestOptions)
            .then(response => response.text())
            .then(result => {
                document.location.reload(true);
            })
            .catch(error => console.log('error', error));
    }

    function avaliarAvl(avaliacaoId, nota) {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "usuarioId": getCookie('usuarioId'),
            "avaliacaoId": avaliacaoId,
            "util": nota
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("https://gbg-api.herokuapp.com/api/util", requestOptions)
            .then(response => response.text())
            .then(result => console.log(result))
            .catch(error => console.log('error', error));
    }

    const ratingChanged = (newRating) => {
        setRate(newRating)
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

    useEffect(function effectFunction() {
        if(router.isReady) {
            fetch("https://gbg-api.herokuapp.com/api/games/" + router.query.id, requestOptions)
                .then(response => response.text())
                .then(result => {
                    result = JSON.parse(result)
                    document.getElementById('game-nome').innerHTML = result.nome
                    document.getElementById('game-descricao').innerHTML = result.descricao
                    setImgSrc(result.banner)
                    setUrlSrc(result.url)
                })
                .catch(error => console.log('error', error));

            fetch('https://gbg-api.herokuapp.com/api/rate/' + router.query.id)
                .then(response => response.json())
                .then((result) => {
                    var x = []
                    result.forEach(element => {
                        x.push(<Avaliacao rateValue={element.nota} texto={element.texto} autor={element.autor} key={element.id} id={element.id} util={element.util} />)
                    });
                    setAvaliacoes(x);
                });
        }
    }, [router.isReady]);

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
                            <div className="content-section-title game-container">
                                <div className="banner" style={{maxHeight: '80%', position: 'relative', padding: "0 2.5%"}}>
                                    <img 
                                        className='game-image'
                                        src={imgSrc}
                                        alt=''
                                        onError={({ currentTarget }) => {
                                            currentTarget.onerror = null; // prevents looping
                                            currentTarget.src=imgSrc;
                                        }}
                                    />
                                </div>
                                <div className='info'>
                                    <h1 id='game-nome'></h1>
                                    <br />
                                    <span id='game-descricao' />
                                    <button
                                        onClick={() => window.location.href = urlSrc}
                                        className="content-button"
                                        style={{padding: '12px', fontSize: '22px', textTransform: 'uppercase', width: '100%'}}
                                    >
                                        Obter game
                                    </button>
                                    <div className='avaliar-area'>
                                        <div>
                                            <ReactStars
                                                count={5}
                                                size={24}
                                                onChange={ratingChanged}
                                                color2={'#ffd700'}
                                                value={rate}
                                            />
                                            <button
                                                onClick={avaliar}
                                                className="content-button"
                                                style={{padding: '12px', fontSize: '14px', textTransform: 'uppercase', width: '100%'}}
                                            >
                                                Avaliar
                                            </button>
                                        </div>
                                        <div className='avaliacao-textarea'>
                                            <h5>Deixe um comentario!</h5>
                                            <textarea rows='5' name='avaliar-texto' />
                                        </div>
                                    </div>
                                    <h3>Avaliacoes</h3>
                                    <div className='avaliacoes-area' id='avaliacoes-area'>
                                        {avaliacoes}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="overlay-app"></div>
        </div>
    )
}