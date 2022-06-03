import { getCookie } from 'cookies-next'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router'
import CreatableSelect from 'react-select/creatable';
import Header from '../components/Header'
import MenuLateral from '../components/MenuLateral'
import Head from 'next/head'

export default function Home() {
    const router = useRouter()
    const [imgSrc, setImgSrc] = useState("");
    var options;

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
                    } else if (result.cargo != 'Admin') {
                        window.location.href = '/'
                    }
                })
                .catch(error => console.log('error', error));
        }
    }

    function atualizar() {
        /*
        if (typeof window !== 'undefined') {
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            var categorias = []

            selectedOption.forEach(element => {
                categorias.push(element.value)
            });

            if(document.getElementsByName('nome')[0].value == "" ||
                document.getElementsByName('descricao')[0].value == "" ||
                document.getElementsByName('banner')[0].value == "" ||
                document.getElementsByName('dt_lancamento')[0].value == "" ||
                document.getElementsByName('url')[0].value == "" ||
                categorias.length == 0
            ) {
                return;
            }

            var raw = JSON.stringify({
                "nome": document.getElementsByName('nome')[0].value,
                "descricao": document.getElementsByName('descricao')[0].value,
                "banner": document.getElementsByName('banner')[0].value,
                "data_lancamento": document.getElementsByName('dt_lancamento')[0].value,
                "video": document.getElementsByName('video')[0].value,
                "url": document.getElementsByName('url')[0].value,
                "categoria": categorias
            });

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            fetch("https://gbg-api.herokuapp.com/api/games/", requestOptions)
                .then(response => response.text())
                .then(result => window.location.href = '/admin')
                .catch(error => console.log('error', error));
        }
        */
    }

    useEffect(function effectFunction() {
        if(router.isReady) {
            fetch("https://gbg-api.herokuapp.com/api/games/" + router.query.id, requestOptions)
                .then(response => response.text())
                .then(result => {
                    result = JSON.parse(result)
                    document.getElementsByName('nome')[0].value = result.nome
                    document.getElementsByName('descricao')[0].value = result.descricao
                    document.getElementsByName('video')[0].value = result.video
                    document.getElementsByName('banner')[0].value = result.banner
                    document.getElementsByName('url')[0].value = result.url
                    
                    document.getElementsByName('dt_lancamento')[0].value = result.data_lancamento
                    setImgSrc(result.banner)
                    //setSelectedOption(result.categorias)
                    
                })
                .catch(error => console.log('error', error));
        }
    }, [router.isReady]);

    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    function categorias() {
        if (typeof window !== 'undefined') {
            options = []
            fetch("https://gbg-api.herokuapp.com/api/categorias", requestOptions)
                .then(response => response.text())
                .then(result => {
                    document.getElementById('categorias-mnl').innerHTML = ""
                    var arr = JSON.parse(result)
                    for (const i in arr) {
                        document.getElementById('categorias-mnl').innerHTML += `
                            <a href="/?categoria=${arr[i].id}">
                                ${arr[i].nome}
                            </a>
                        `
                        options.push({ value: arr[i].nome, label: arr[i].nome })
                    }
                })
                .catch(error => console.log('error', error));
        }
    }

    const [selectedOption, setSelectedOption] = useState(null);


    const selectStyles = {
        menuList: styles => ({
            ...styles,
            background: 'rgba(0, 0, 0, 0)'
        }),
        control: (styles, {isFocused, isSelected}) => ({
            ...styles,
            background: 'rgba(0, 0, 0, 0)',
            borderColor: isFocused ? '#5264AE'
                : isSelected ? '#5264AE'
                : undefined,
            boxShadow: isFocused ? '0 0 1px #5264AE'
            : isSelected ? '0 0 1px #5264AE'
            : undefined
        }),
        option: (styles, {isFocused, isSelected}) => ({
            ...styles,
            background: isFocused ? 'rgba(255, 255, 255, 1)'
                : isSelected ? 'hsla(291, 64%, 42%, 1)'
                : undefined,
            color: isFocused ? 'rgba(0, 0, 0, 1)' : 'white',
            zIndex: 1,
            cursor: 'pointer'
        }),
        menu: base => ({
            ...base,
            zIndex: 100,
            width: '100%',
            background: 'rgba(0, 0, 0)'
        })
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
                                <span>Atualizar game</span>
                            </div>
                            <div className="catalogo-container editar-container">
                                <div className="banner" style={{position: 'relative', padding: '0 5% 10% 5%'}}>
                                    <img 
                                        className='game-image'
                                        layout="responsive"
                                        src={imgSrc}
                                        alt=''
                                        onError={({ currentTarget }) => {
                                            currentTarget.onerror = null; // prevents looping
                                            currentTarget.src=imgSrc;
                                        }}
                                        style={{width: '100%', maxHeight: '80vh'}}
                                    />
                                </div>
                                <div>
                                    <div className="group">      
                                        <input type="text" required name='nome' />
                                        <span className="highlight"></span>
                                        <span className="bar"></span>
                                        <label>Nome</label>
                                    </div>
                                    <div className="group">
                                        <textarea required name='descricao' rows='5' />
                                    </div>
                                    <div className="group">      
                                        <input type="text" required name='video' />
                                        <span className="highlight"></span>
                                        <span className="bar"></span>
                                        <label>Video</label>
                                    </div>
                                    <div className="group">      
                                        <input type="text" required name='banner' />
                                        <span className="highlight"></span>
                                        <span className="bar"></span>
                                        <label>Banner</label>
                                    </div>
                                    <div className="group">      
                                        <input type="text" required name='url' />
                                        <span className="highlight"></span>
                                        <span className="bar"></span>
                                        <label>Url do jogo</label>
                                    </div>
                                    <div className="group">      
                                        <input type="date" required name='dt_lancamento' />
                                        <span className="highlight"></span>
                                        <span className="bar"></span>
                                    </div>
                                    <div className="group" style={{width: '100%'}}>
                                        <CreatableSelect
                                            isMulti
                                            onChange={setSelectedOption}
                                            options={selectedOption}
                                            styles={selectStyles}
                                        />
                                    </div>
                                    <div>
                                        <button
                                            onClick={atualizar}
                                            className="content-button"
                                            style={{padding: '12px', margin: "0 2.5%", fontSize: '14px', textTransform: 'uppercase', width: '60%'}}
                                        >
                                            Atualizar
                                        </button>
                                        <button
                                            onClick={atualizar}
                                            className="content-button"
                                            style={{padding: '12px', margin: "0 2.5%", fontSize: '14px', textTransform: 'uppercase', width: '30%', background: '#dc3545'}}
                                        >
                                            Deletar
                                        </button>
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
