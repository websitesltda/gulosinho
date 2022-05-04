import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import 'semantic-ui-css/semantic.min.css'
import { Button, Form, Icon, Input, Image } from "semantic-ui-react";
import axios from "axios";
import SideMenu from "../layout/SideMenu";
import TopMenu from "../layout/TopMenu";

function Login({ props }) {
    const [altura, setAltura] = useState(0);
    const [largura, setLargura] = useState(0);
    const [usuario, setUsuario] = useState('');
    const [senha, setSenha] = useState('');
    const [logado, setLogado] = useState(false);

    window.onresize = function () {
        var w = document.documentElement.clientWidth;
        var h = document.documentElement.clientHeight;
        setAltura(h);
        setLargura(w);
    };

    useEffect(() => {
        setAltura(window.innerHeight);
        setLargura(window.innerWidth);
    }, []);

    useEffect(() => {
        if (logado === true) {
            window.location.href = "/checklist";
        }
    }, []);

    useEffect(() => {
        localStorage.getItem("Logado") === 'true' ? setLogado(true) : setLogado(false)
    }, []);

    async function logar() {
        const options = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                'Access-Control-Allow-Origin': '*',
            },
            data: { usuario, senha },
            url: 'https://api.gulosinho.com/Login',
        };
        const res = await axios(options);
        const men = res.data.map(m => (m.mensagem)).toString();

        if (men === '') {
            setLogado(true);
            window.location.href = "/checklist";
            localStorage.setItem("Logado", 'true')
            localStorage.setItem("Cd_impresa", res.data.map(r => (r.codigo)).toString())
        } else {
            alert(men)
        }

    };
    if (logado === true) {
        return (
            <>
                <div className="menu">
                    <TopMenu />
                </div>
                <div className="main-content">
                    <SideMenu>
                        {props.children}
                    </SideMenu>
                </div>
            </>
        )
    } else {
        return (


            <div style={{ width: largura, height: altura, display: logado === true ? 'none' : 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'white' }}>

                <div style={{
                    width: 400, height: 350, shadowColor: '#470000',
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.2,
                    elevation: 5, borderRadius: 20, flexDirection: 'column', backgroundColor: '#cecece', display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <Image style={{ width: 300, position: 'absolute', top: 0, marginTop: 220 }} src="./logo2.png" />

                    <Form style={{ marginTop: 150 }}>

                        <Form.Group unstackable widths={1}>
                            <Form.Field>
                                <Input
                                    type="text"
                                    onChange={(e, { value }) => setUsuario([value].toString())}
                                    value={usuario}
                                    style={{ width: 300, height: 50, outline: 0, borderRadius: 50, borderWidth: 0, fontSize: 20, paddingLeft: 10 }}
                                    placeholder="Usuário"
                                    fluid
                                />
                            </Form.Field>
                        </Form.Group>
                        <Form.Group unstackable widths={1}>
                            <Form.Field>
                                <Input
                                    type="password"
                                    onChange={(e, { value }) => setSenha([value].toString())}
                                    value={senha}
                                    style={{ width: 300, height: 50, outline: 0, borderRadius: 50, borderWidth: 0, fontSize: 20, paddingLeft: 10 }}
                                    placeholder="Senha"
                                    fluid
                                />
                            </Form.Field>
                        </Form.Group>

                    </Form>

                    <Button onClick={logar} color="green">
                        <Icon name="sign in alternate" />
                        <text>Entrar</text>
                    </Button>

                </div>

            </div>

        )
    }
}

export default props => {
    return (
        <div className="grid">

            <Login props={props} />

        </div>
    )
};
