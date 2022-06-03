import Head from 'next/head';

export default function Menu() {
    return (
        <div className="app">
            <Head>
                <title>Good Browser Games</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>
            <div className="wrapper">
                <div className="main-container">
                    <div className="content-wrapper" style={{minHeight: '100vh'}}>
                        <div className="content-section menu-page" style={{minHeight: '80%'}}>
                            <a href="/">Catalogo</a>
                            <a href="/conta">Minha conta</a>
                            <a href="/admin">Painel de controle</a>
                        </div>
                    </div>
                </div>
            </div>
            <div className="overlay-app">

            </div>
        </div>
    )
}
