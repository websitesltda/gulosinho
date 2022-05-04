import React from "react";
import { useState } from "react";
import { useEffect } from "react";
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
import 'semantic-ui-css/semantic.min.css'

import axios from "axios";

export default function Empresas() {

  const [novo, setNovo] = useState(false);
  const [empresas, setEmpresas] = useState([]);
  const [cidades, setCidades] = useState([]);
  const [estados, setEstados] = useState([]);

  const [cd_impresa, setcd_impresa] = useState('');
  const [codigo_impresa, setCodigo_empresa] = useState('');
  const [nome, setNome] = useState('');
  const [cnpj, setcnpj] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [celular, setCelular] = useState('');
  const [estado, setEstado] = useState('MG');
  const [cidade, setCidade] = useState('');
  const [id, setId] = useState('');

  useEffect(()=>{
    setcd_impresa(localStorage.getItem("Cd_impresa"))
  },[])

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

  async function cadEmpresa() {
    const options = {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        'Access-Control-Allow-Origin': '*',
      },
      data: {
        cd_impresa, codigo_impresa, nome, cnpj, email, telefone, celular, estado, cidade
      },
      url: 'https://api.gulosinho.com/CriarEmpresas',
    };
    const res = await axios(options);
    if (res.data.length === 0) {

    } else {
      ListarEmpresas();
      setNovo(false);
    }
  };

  async function TrazerEmpresa() {
    const options = {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        'Access-Control-Allow-Origin': '*',
      },
      data: {
        id
      },
      url: 'https://api.gulosinho.com/GetOneEmpresas',
    };

    const res = await axios(options);
    if (res.data.length === 0) {

    } else {
      [res.data].map(r => (
        setNome(r.nome),
        setCodigo_empresa(r.codigo_impresa),
        setcnpj(r.cnpj),
        setCelular(r.celular),
        setTelefone(r.telefone),
        setEmail(r.email),
        setEstado(r.estado),
        setCidade(r.cidade),
        setNovo(true)

      ));

    }

  };

  useEffect(() => {
    if (id !== '') {
      TrazerEmpresa();
    };
  }, [id]);

  useEffect(() => {
    if (novo === false) {
      setNome('');
      setcnpj('');
      setCelular('');
      setTelefone('');
      setEmail('');
      setEstado('');
      setCidade('');
      setId('');
      setCodigo_empresa(parseInt(Math.random() * (999999 - 100000) + 100000))
    };
  }, [novo]);

  async function UpdEmpresa() {
    const options = {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        'Access-Control-Allow-Origin': '*',
      },
      data: {
        nome, cnpj, email, telefone, celular, estado, cidade, id
      },

      url: 'https://api.gulosinho.com/UpdateEmpresas',
    };
    const res = await axios(options);
    if (res.data.length === 0) {

    } else {
      ListarEmpresas();
      setNovo(false);
    }
  };

  async function ListarEmpresas() {
    const options = {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        'Access-Control-Allow-Origin': '*',
      },
      data: {cd_impresa},
      url: 'https://api.gulosinho.com/ListarEmpresas',
    };
    const res = await axios(options);
    if (res.data.length === 0) {
      setEmpresas([]);
    } else {
      setEmpresas(res.data);
    }
  };
  useEffect(() => {
    ListarEmpresas();
    trazerEstados()
  }, [cd_impresa]);

  async function ExcluirEmpresa(params) {
    const options = {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        'Access-Control-Allow-Origin': '*',
      },
      data: { id: params },
      url: 'https://api.gulosinho.com/DeletarEmpresas',
    };
    const res = await axios(options);
    if (res.data.length === 0) {
      ListarEmpresas();
    } else {
      ListarEmpresas();
    }
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



  function Lista() {
    return (
      <>
        {empresas.map(c => (
          <Table.Row>
            <Table.Cell> {c.codigo_impresa} </Table.Cell>
            <Table.Cell> {c.nome} </Table.Cell>
            <Table.Cell> {c.cnpj}  </Table.Cell>
            <Table.Cell> {c.email}  </Table.Cell>
            <Table.Cell> {c.telefone}  </Table.Cell>
            <Table.Cell> {c.celular}  </Table.Cell>
            <Table.Cell> {c.estado}  </Table.Cell>
            <Table.Cell> {c.cidade}  </Table.Cell>
            <Table.Cell>
              <Button.Group>
                <Button onClick={() => setId(c.id)}>
                  <Icon name="pencil" />
                </Button>
                <Button.Or text='ou' />
                <Button onClick={() => ExcluirEmpresa(c.id)} color='red'>
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
          <Header>Lista das Empresas   <Button onClick={() => setNovo(!novo)} color='green'>Nova Empresa</Button></Header>
          <Table compact celled>
            <Table.Header fullWidth>
              <Table.Row>
                <Table.HeaderCell>Código</Table.HeaderCell>
                <Table.HeaderCell>Nome</Table.HeaderCell>
                <Table.HeaderCell>CNPJ</Table.HeaderCell>
                <Table.HeaderCell>Email</Table.HeaderCell>
                <Table.HeaderCell>Telefone</Table.HeaderCell>
                <Table.HeaderCell>Celular</Table.HeaderCell>
                <Table.HeaderCell>Estado</Table.HeaderCell>
                <Table.HeaderCell>Cidade</Table.HeaderCell>
                <Table.HeaderCell width={2}>Ações</Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>{Lista()}</Table.Body>

            <Table.Footer fullWidth>
              <Table.Row>
                <Table.HeaderCell colSpan={9} />
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
                <label>Código da Empresa</label>
                <Input
                  type="number"
                  value={codigo_impresa}
                  placeholder="Código da Empresa."
                  fluid
                />
              </Form.Field>
            </Form.Group>
            <Form.Group unstackable widths={2}>

              <Form.Field>
                <label>Nome da empresa</label>
                <Input
                  type="text"
                  onChange={(e, { value }) => setNome([value].toString())}
                  value={nome}
                  placeholder="Nome da Empresa"
                />
              </Form.Field>

              <Form.Field>
                <label>CNPJ</label>
                <Input
                  type="text"
                  onChange={(e, { value }) => setcnpj([value].toString().length <= 18 ? cpfCnpj([value].toString()) : cnpj)}
                  value={cnpj}
                  placeholder="CNPJ"
                />
              </Form.Field>
            </Form.Group>

            <Form.Group unstackable widths={2}>
              <Form.Field>
                <label>Email</label>
                <Input
                  type="email"
                  onChange={(e, { value }) => setEmail([value].toString())}
                  value={email}
                  placeholder="Email."
                />
              </Form.Field>
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
            </Form.Group>
            <Form.Group unstackable widths={2}>
              <Form.Field>
                <label>Celular</label>
                <Input
                  type="number"
                  onChange={(e, { value }) => setCelular([value].toString())}
                  value={celular}
                  placeholder="Celular."
                />
              </Form.Field>
              <Form.Field>
                <label>Estado</label>
                <Dropdown
                  placeholder='Estado.'
                  fluid
                  search
                  selection
                  value={estado}
                  onSearchChange={(e, { searchQuery }) => setEstado([searchQuery].toString())}
                  onChange={(e, { value }) => setEstado([value].toString())}
                  options={estados}
                />
              </Form.Field>
            </Form.Group>
            <Form.Group unstackable widths={2}>
              <Form.Field>
                <label>Cidade</label>
                <Dropdown
                  placeholder='Cidade.'
                  fluid
                  search
                  selection
                  value={cidade}
                  onSearchChange={(e, { searchQuery }) => setCidade([searchQuery].toString())}
                  onChange={(e, { value }) => setCidade([value].toString())}
                  options={cidades}
                />
              </Form.Field>
            </Form.Group>
            <Button onClick={() => id !== '' ? UpdEmpresa() : cadEmpresa()} primary type="submit" >
              {id !== '' ? 'Editar' : 'Salvar'}
            </Button>
            <Button onClick={() => setNovo(!novo)}>Cancelar</Button>
          </Form>
        </Segment>
        : null}
    </>

  );

};