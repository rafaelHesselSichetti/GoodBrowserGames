import Image from 'next/image'
import logo from '../public/assets/controle-de-video-game.png'

export default function Header() {
    return (
        <div className="header">
            <Image src={logo} alt='' width='32px' height='32px' className='logo' onClick={() => window.location.href = '/menu'} />
            <div className="header-menu">
                <a className="menu-link" href="/">Catálogo</a>
                <a className="menu-link" href="/conta">Minha conta</a>
                <a className="menu-link" href="/admin">Painel de controle</a>
            </div>
        </div>
    )
}