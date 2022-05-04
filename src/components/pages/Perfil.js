import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import 'semantic-ui-css/semantic.min.css'
import { Header, Segment, Image, Form, Input, Dropdown, Button } from "semantic-ui-react";
import axios from "axios";

export default function Perfil() {

    const [cod_empresa, setcod_empresa] = useState('');

    const [tipo_conta, settipo_conta] = useState('');
    const [logo, setlogo] = useState('logo2.png');
    const [responsavel, setresponsavel] = useState('');
    const [empresa, setempresa] = useState('');
    const [cnpj, setcnpj] = useState('');
    const [inscricao, setinscricao] = useState('');
    const [email, setemail] = useState('');
    const [telefone, settelefone] = useState('');
    const [usuario, setusuario] = useState('');
    const [senha, setsenha] = useState('');
    const [id, setid] = useState('');
    const [estado, setestado] = useState('');
    const [cidade, setcidade] = useState('');
    const [cidades, setCidades] = useState([]);
    const [estados, setEstados] = useState([]);

    function cpfCnpj(v) {

        //Remove tudo o que não é dígito
        v = v.replace(/\D/g, "")

        if (v.length <= 14) {

            //Coloca ponto entre o segundo e o terceiro dígitos
            v = v.replace(/^(\d{2})(\d{3})?(\d{3})?(\d{4})?(\d{2})?/, "$1.$2.$3/$4-$5")

        }
        return v

    }

    async function trazerDados() {
        const options = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                'Access-Control-Allow-Origin': '*',
            },
            data: { cd_funcionario: '', cd_impresa: cod_empresa },
            url: 'https://api.gulosinho.com/TrazerDados',
        };
        const res = await axios(options);
        const dad = res.data;
        if (dad.length !== undefined) {
            dad.map(d => (
                setresponsavel(d.nome),
                setempresa(d.empresa),
                setcnpj(cpfCnpj(d.cnpj)),
                setinscricao(d.inscricao),
                setemail(d.email),
                settelefone(d.telefone),
                setusuario(d.usuario),
                setsenha(d.senha),
                setestado(d.estado),
                setcidade(d.cidade),
                setlogo(d.logo),
                settipo_conta(d.tipo_cadastro),
                setid(d.id)
            ))
        }

    };

    async function update() {
        const options = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                'Access-Control-Allow-Origin': '*',
            },
            data: { id, logo, nome: responsavel, cnpj, inscricao, email, empresa, telefone, usuario, senha, tipo_cadastro: tipo_conta, estado, cidade },
            url: 'https://api.gulosinho.com/UpdateUsuarios',
        };
        const res = await axios(options);
        const est = res.data;
        trazerDados()
        alert('Dados atualizados com sucesso..')
    };

    async function trazerCidades() {
        const options = {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                'Access-Control-Allow-Origin': '*',
            },
            data: {},
            url: 'https://servicodados.ibge.gov.br/api/v1/localidades/estados/' + estado + '/municipios?orderBy=nome',
        };
        const res = await axios(options);
        const est = res.data;
        setCidades(
            est.map(e => (
                { key: e.id, value: e.nome, text: e.nome }
            ))
        )
    };

    useEffect(() => {
        trazerCidades()
    }, [estado])

    async function trazerEstados() {
        const options = {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                'Access-Control-Allow-Origin': '*',
            },
            data: {},
            url: 'https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome',
        };
        const res = await axios(options);
        const est = res.data;
        setEstados(
            est.map(e => (
                { key: e.id, value: e.sigla, text: e.nome }
            ))
        )
    };

    useEffect(() => {
        trazerEstados()
        trazerDados()
    }, [cod_empresa])

    useEffect(() => {
        setcod_empresa(localStorage.getItem("Cd_impresa"))
    }, [])

    async function encodeImageFileAsURL(e) {
        const formData = new FormData();
        formData.append('image', e);

        const headers = {
            'headers': {
                'Content-Type': 'application/json'
            }
        }

        await axios.post("https://api.gulosinho.com/Uploads", formData, headers)
            .then((response) => {
                setlogo(e.name)
            }).catch((err) => {

            });

    };

    function cpfCnpj(v) {

        //Remove tudo o que não é dígito
        v = v.replace(/\D/g, "")

        if (v.length <= 14) {

            //Coloca ponto entre o segundo e o terceiro dígitos
            v = v.replace(/^(\d{2})(\d{3})?(\d{3})?(\d{4})?(\d{2})?/, "$1.$2.$3/$4-$5")

        }
        return v

    }

    return (

        <>
            <Segment>
                <Header>Perfil da empresa </Header>
                <center>
                    <div style={{ width: 200 }}>
                        <Image style={{ width: 200}} src={'https://api.gulosinho.com/' + logo} size='medium'  />
                    </div>
                </center>

                <Form>
                    <Form.Group unstackable widths={2}>
                        <Form.Field>
                            <label>Tipo de conta</label>
                            <Dropdown
                                placeholder='Tipo de conta.'
                                fluid
                                search
                                selection
                                value={tipo_conta}
                                onSearchChange={(e, { searchQuery }) => settipo_conta([searchQuery].toString())}
                                onChange={(e, { value }) => settipo_conta([value].toString())}
                                options={[{ key: '1', value: 'Fisica', text: 'Conta Fisica' }, { key: '2', value: 'Juridica', text: 'Conta Juridica' }]}
                            />
                        </Form.Field>
                        <Form.Field>
                            <label>Logo da empresa</label>
                            <Input
                                type="file"
                                onChange={e => encodeImageFileAsURL(e.target.files[0])}
                                placeholder="Número do contrato."
                            />
                        </Form.Field>
                    </Form.Group>

                    <Form.Group unstackable widths={2}>
                        <Form.Field>
                            <label>Nome do responsavel</label>
                            <Input
                                type="text"
                                value={responsavel}
                                onChange={(value) => setresponsavel(value.target.value)}
                                placeholder="Nome do responsavel."
                            />
                        </Form.Field>
                        <Form.Field>
                            <label>Nome da empresa</label>
                            <Input
                                type="text"
                                value={empresa}
                                onChange={(value) => setempresa(value.target.value)}
                                placeholder="Nome da empresa."
                            />
                        </Form.Field>
                    </Form.Group>

                    <Form.Group unstackable widths={2}>
                        <Form.Field>
                            <label>Cnpj</label>
                            <Input
                                type="text"
                                value={cnpj}
                                onChange={(e, { value }) => setcnpj([value].toString().length <= 18 ? cpfCnpj([value].toString()) : cnpj)}
                                placeholder="Cnpj."
                            />
                        </Form.Field>
                        <Form.Field>
                            <label>Inscrição estadual</label>
                            <Input
                                type="number"
                                value={inscricao}
                                onChange={(value) => setinscricao(value.target.value)}
                                placeholder="Inscrição estadual."
                            />
                        </Form.Field>
                    </Form.Group>

                    <Form.Group unstackable widths={2}>
                        <Form.Field>
                            <label>Email</label>
                            <Input
                                type="email"
                                value={email}
                                onChange={(value) => setemail(value.target.value)}
                                placeholder="Email."
                            />
                        </Form.Field>
                        <Form.Field>
                            <label>Telefone</label>
                            <Input
                                type="number"
                                value={telefone}
                                onChange={(value) => settelefone(value.target.value)}
                                placeholder="Telefone."
                            />
                        </Form.Field>
                    </Form.Group>

                    <Form.Group unstackable widths={2}>
                        <Form.Field>
                            <label>Usuário</label>
                            <Input
                                type="text"
                                value={usuario}
                                onChange={(value) => setusuario(value.target.value)}
                                placeholder="Usuário."
                            />
                        </Form.Field>
                        <Form.Field>
                            <label>Senha</label>
                            <Input
                                type="password"
                                value={senha}
                                onChange={(value) => setsenha(value.target.value)}
                                placeholder="Senha."
                            />
                        </Form.Field>
                    </Form.Group>

                    <Form.Group unstackable widths={2}>
                        <Form.Field>
                            <label>Estado</label>
                            <Dropdown
                                placeholder='Estado.'
                                fluid
                                search
                                selection
                                value={estado}
                                onSearchChange={(e, { searchQuery }) => setestado([searchQuery].toString())}
                                onChange={(e, { value }) => setestado([value].toString())}
                                options={estados}
                            />
                        </Form.Field>
                        <Form.Field>
                            <label>Cidade</label>
                            <Dropdown
                                placeholder='Cidade.'
                                fluid
                                search
                                selection
                                value={cidade}
                                onSearchChange={(e, { searchQuery }) => setcidade([searchQuery].toString())}
                                onChange={(e, { value }) => setcidade([value].toString())}
                                options={cidades}
                            />
                        </Form.Field>
                    </Form.Group>

                </Form>
                <Button onClick={() => update()} color="green">Salvar</Button>

            </Segment>
        </>

    );

};