import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import 'semantic-ui-css/semantic.min.css'

import {
    Button,
    Form,
    Header,
    Icon,
    Input,
    Dropdown,
    Segment,
    Table
} from "semantic-ui-react";
import axios from "axios";

export default function Empresas() {

    const [novo, setNovo] = useState(false);
    const [funcionarios, setFuncionarios] = useState([]);

    const [codigo_funcionario, setCodigo_funcionario] = useState('');
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [telefone, setTelefone] = useState('');
    const [usuario, setUsuario] = useState('');
    const [senha, setSenha] = useState('');
    const [Rsenha, setRSenha] = useState('');
    const [id, setId] = useState('');
    const [cod_empresa, setcod_empresa] = useState('');

    useEffect(()=>{
        setcod_empresa(localStorage.getItem("Cd_impresa"))
      },[])
    

    async function cadFuncionario() {
        if (senha === Rsenha) {
            const options = {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    'Access-Control-Allow-Origin': '*',
                },
                data: {
                    codigo_funcionario, cd_impresa: cod_empresa, nome, email, telefone, usuario, senha
                },

                url: 'https://api.gulosinho.com/CriarFuncionarios',
            };
            const res = await axios(options);
            if (res.data.length === 0) {

            } else {
                ListarFuncionarios();
                setNovo(false);
            }
        } else {
            alert('Corrija sua senha.');
        }
    };

    async function TrazerFuncionarios() {
        const options = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                'Access-Control-Allow-Origin': '*',
            },
            data: {
                id
            },
            url: 'https://api.gulosinho.com/GetOneFuncionarios',
        };

        const res = await axios(options);
        if (res.data.length === 0) {

        } else {
            [res.data].map(r => (
                setNome(r.nome),
                setTelefone(r.telefone),
                setEmail(r.email),
                setUsuario(r.usuario),
                setSenha(r.senha),
                setNovo(true)

            ));

        }

    };

    useEffect(() => {
        if (id !== '') {
            TrazerFuncionarios();
        };
    }, [id]);

    useEffect(() => {
        if (novo === false) {
            setNome('');
            setTelefone('');
            setEmail('');
            setUsuario('');
            setSenha('');
            setRSenha('');
            setId('');
            setCodigo_funcionario(parseInt(Math.random() * (999999 - 100000) + 100000))
        };
    }, [novo]);

    async function UpdFuncionario() {
        if (senha === Rsenha) {
            const options = {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    'Access-Control-Allow-Origin': '*',
                },
                data: {
                    nome, email, telefone, usuario, senha, id

                },

                url: 'https://api.gulosinho.com/UpdateFuncionarios',
            };
            const res = await axios(options);
            if (res.data.length === 0) {

            } else {
                ListarFuncionarios();
                setNovo(false);
            }
        } else {
            alert('Digite sua senha corretamente no campo "Repita a Senha"')
        }
    };

    async function ListarFuncionarios() {
        const options = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                'Access-Control-Allow-Origin': '*',
            },
            data: {cd_impresa:cod_empresa},
            url: 'https://api.gulosinho.com/ListarFuncionarios',
        };
        const res = await axios(options);
        if (res.data.length === 0) {
            setFuncionarios([]);
        } else {
            setFuncionarios(res.data);
        }
    };
    useEffect(() => {
        ListarFuncionarios();
    }, [cod_empresa]);

    async function ExcluirFuncionario(params) {
        const options = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                'Access-Control-Allow-Origin': '*',
            },
            data: { id: params },
            url: 'https://api.gulosinho.com/DeletarFuncionarios',
        };
        const res = await axios(options);
        if (res.data.length === 0) {
            ListarFuncionarios();
        } else {
            ListarFuncionarios();
        }
    };

    function Lista() {
        return (
            <>
                {funcionarios.map(c => (
                    <Table.Row>
                        <Table.Cell> {c.codigoF} </Table.Cell>
                        <Table.Cell> {c.nome} </Table.Cell>
                        <Table.Cell> {c.email}  </Table.Cell>
                        <Table.Cell> {c.telefone}  </Table.Cell>
                        <Table.Cell> {c.usuario}  </Table.Cell>
                        <Table.Cell> {c.senha}  </Table.Cell>
                        <Table.Cell>
                            <Button.Group>
                                <Button onClick={() => setId(c.id)}>
                                    <Icon name="pencil" />
                                </Button>
                                <Button.Or text='ou' />
                                <Button onClick={() => ExcluirFuncionario(c.id)} color='red'>
                                    <Icon name="delete" />
                                </Button>
                            </Button.Group>

                        </Table.Cell>
                    </Table.Row>
                ))}
            </>
        )
    };

    return (

        <>

            {novo === false ?
                <Segment>
                    <Header>Lista de Funcionarios   <Button onClick={() => setNovo(!novo)} color='green'>Novo Funcionario</Button></Header>
                    <Table compact celled>
                        <Table.Header fullWidth>
                            <Table.Row>
                                <Table.HeaderCell>Código do Funcionario</Table.HeaderCell>
                                <Table.HeaderCell>Nome</Table.HeaderCell>
                                <Table.HeaderCell>Email</Table.HeaderCell>
                                <Table.HeaderCell>Telefone</Table.HeaderCell>
                                <Table.HeaderCell>Usuario</Table.HeaderCell>
                                <Table.HeaderCell>Senha</Table.HeaderCell>
                                <Table.HeaderCell width={2}>Ações</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>{Lista()}</Table.Body>

                        <Table.Footer fullWidth>
                            <Table.Row>
                                <Table.HeaderCell colSpan={7} />
                            </Table.Row>
                        </Table.Footer>
                    </Table>
                </Segment>

                : null}


            {novo === true ?
                <Segment>
                    <Form>
                        <Form.Group unstackable widths={2}>

                            <Form.Field>
                                <label>Código do Funcionario</label>
                                <Input
                                    type="number"
                                    value={codigo_funcionario}
                                    placeholder="Código da Empresa."
                                    fluid
                                />
                            </Form.Field>
                        </Form.Group>
                        <Form.Group unstackable widths={2}>

                            <Form.Field>
                                <label>Nome do Funcionario</label>
                                <Input
                                    type="text"
                                    onChange={(e, { value }) => setNome([value].toString())}
                                    value={nome}
                                    placeholder="Nome da Empresa"
                                />
                            </Form.Field>

                            <Form.Field>
                                <label>Email</label>
                                <Input
                                    type="email"
                                    onChange={(e, { value }) => setEmail([value].toString())}
                                    value={email}
                                    placeholder="Email."
                                />
                            </Form.Field>
                        </Form.Group>

                        <Form.Group unstackable widths={2}>
                            <Form.Field>
                                <label>Telefone</label>
                                <Input
                                    type="number"
                                    onChange={(e, { value }) => setTelefone([value].toString())}
                                    value={telefone}
                                    placeholder="Telefone."
                                    fluid
                                />
                            </Form.Field>
                            <Form.Field>
                                <label>Usuário</label>
                                <Input
                                    type="text"
                                    onChange={(e, { value }) => setUsuario([value].toString())}
                                    value={usuario}
                                    placeholder="Usuário."
                                    fluid
                                />
                            </Form.Field>
                        </Form.Group>

                        <Form.Group unstackable widths={2}>
                            <Form.Field>
                                <label>Senha</label>
                                <Input
                                    type="password"
                                    onChange={(e, { value }) => setSenha([value].toString())}
                                    value={senha}
                                    placeholder="Senha."
                                    fluid
                                />
                            </Form.Field>
                            <Form.Field>
                                <label>Repita a Senha</label>
                                <Input
                                    icon={senha === Rsenha ? 'check' : 'close'}
                                    type="password"
                                    onChange={(e, { value }) => setRSenha([value].toString())}
                                    value={Rsenha}
                                    placeholder="Repita a Senha."
                                    fluid
                                />
                            </Form.Field>
                        </Form.Group>


                        <Button onClick={() => id !== '' ? UpdFuncionario() : cadFuncionario()} primary type="submit" >
                            {id !== '' ? 'Editar' : 'Salvar'}
                        </Button>
                        <Button onClick={() => setNovo(!novo)}>Cancelar</Button>
                    </Form>
                </Segment>
                : null}
        </>

    );

};