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
import axios from "axios";
import 'semantic-ui-css/semantic.min.css'

export default function Home() {

  const [empresas, setEmpresas] = useState([]);
  const [novo, setNovo] = useState(false);
  const [checklists, setChecklists] = useState([]);
  const [cod_empresa, setcod_empresa] = useState('');
  const [cod_checklist, setcod_checklist] = useState('');
  const [num_contrato, setnum_contrato] = useState('');
  const [empresa_origem, setempresa_origem] = useState('');
  const [empresa_destino, setempresa_destino] = useState('');
  const [numero_container, setnumero_container] = useState('');
  const [numero_oic, setnumero_oic] = useState('');
  const [quantidade, setquantidade] = useState('');
  const [status, setstatus] = useState('Aguardando');
  const [data, setdata] = useState('');
  const [id, setId] = useState('');

  useEffect(() => {
    setcod_empresa(localStorage.getItem("Cd_impresa"))
  }, [])

  async function trazerEmpresas() {
    const options = {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        'Access-Control-Allow-Origin': '*',
      },
      data: { cd_impresa: cod_empresa },
      url: 'https://api.gulosinho.com/ListarEmpresas',
    };
    const res = await axios(options);
    if (res.data.length === 0) {

    } else {
      setEmpresas(
        res.data.map(r => (
          { key: r.nome, value: r.nome, text: r.nome }
        ))
      );
    };
  };

  async function cadCheclist() {
    const options = {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        'Access-Control-Allow-Origin': '*',
      },
      data: {
        cd_impresa: cod_empresa, cod_checklist, num_contrato, empresa_origem, empresa_destino, numero_container,
        numero_oic, quantidade, status, data
      },

      url: 'https://api.gulosinho.com/CriarChecklist',
    };
    const res = await axios(options);
    if (res.data.length === 0) {

    } else {
      ListarChecklist();
      setNovo(false);
    }
  };

  function formatarData(params) {
    let d = new Date(params).getDate();
    let m = new Date(params).getMonth() + 1;
    let a = new Date(params).getFullYear();

    return a + '-' + (m < 10 ? '0' + m : m) + '-' + (d < 10 ? '0' + d : d)

  }

  async function TrazerCheclist() {
    const options = {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        'Access-Control-Allow-Origin': '*',
      },
      data: {
        id
      },
      url: 'https://api.gulosinho.com/GetOneChecklist',
    };

    const res = await axios(options);
    if (res.data.length === 0) {

    } else {
      [res.data].map(r => (
        setcod_checklist(r.cod_checklist),
        setnum_contrato(r.num_contrato),
        setempresa_origem(r.empresa_origem),
        setempresa_destino(r.empresa_destino),
        setnumero_container(r.numero_container),
        setnumero_oic(r.numero_oic),
        setquantidade(r.quantidade),
        setdata(formatarData(r.data)),
        setNovo(true)

      ));

    }

  };

  useEffect(() => {
    if (id !== '') {
      TrazerCheclist();
    };
  }, [id]);

  useEffect(() => {
    if (novo === false) {
      setcod_checklist('');
      setnum_contrato('');
      setempresa_origem('');
      setempresa_destino('');
      setnumero_container('');
      setnumero_oic('');
      setquantidade('');
      setId('');
      setdata(formatarData(new Date()));
    };
  }, [novo]);

  async function UpdChecklist() {
    const options = {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        'Access-Control-Allow-Origin': '*',
      },
      data: {
        cod_checklist, num_contrato, empresa_origem, empresa_destino, numero_container,
        numero_oic, quantidade, data, id
      },

      url: 'https://api.gulosinho.com/UpdateChecklist',
    };
    const res = await axios(options);
    if (res.data.length === 0) {

    } else {
      ListarChecklist();
      setNovo(false);
    }
  };

  async function ListarChecklist() {
    const options = {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        'Access-Control-Allow-Origin': '*',
      },
      data: { cd_impresa: cod_empresa },
      url: 'https://api.gulosinho.com/ListarChecklist',
    };
    const res = await axios(options);
    if (res.data.length === 0) {
      setChecklists([]);
      trazerEmpresas()
    } else {
      setChecklists(res.data);
      trazerEmpresas()
    }
  };
  const [atualizador, setAtualizador] = useState(0);
  useEffect(() => {
    setTimeout(function () {
      setAtualizador(atualizador + 1);
    }, 2000)
  }, [atualizador]);

  useEffect(() => {
    ListarChecklist();
    trazerEmpresas();
  }, [cod_empresa, atualizador]);

  async function ExcluirChecklist(params) {
    const options = {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        'Access-Control-Allow-Origin': '*',
      },
      data: { id: params },
      url: 'https://api.gulosinho.com/DeletarChecklist',
    };
    const res = await axios(options);
    if (res.data.length === 0) {
      ListarChecklist();
    } else {
      ListarChecklist();
    }
  };

  async function updateStatus(params, params2) {

    const stat = params2 === 'Aguardando' ? 'Concluido' : params2 === 'Concluido' ? 'Cancelado' : params2 === 'Cancelado' ? 'Aguardando' : null
    const options = {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        'Access-Control-Allow-Origin': '*',
      },
      data: { id: params, status: stat },
      url: 'https://api.gulosinho.com/UpdateStatus',
    };
    const res = await axios(options);
    if (res.data.length === 0) {
      ListarChecklist();
    } else {
      ListarChecklist();
    }
  };

  async function AbrirPDF(params) {
    const options = {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        'Access-Control-Allow-Origin': '*',
      },
      data: { id: params },
      url: 'https://api.gulosinho.com/GetOneResultados',
    };
    const res = await axios(options);

    res.data.map(r => (window.open("https://api.gulosinho.com/pdf/" + r.pdf, "minhaJanela")))
  };

  function Lista() {
    return (
      <>
        {checklists.map(c => (
          <Table.Row>
            <Table.Cell> {c.num_contrato} </Table.Cell>
            <Table.Cell> {c.cod_checklist}  </Table.Cell>
            <Table.Cell> {c.empresa_origem}  </Table.Cell>
            <Table.Cell> {c.empresa_destino}  </Table.Cell>
            <Table.Cell> {c.quantidade}  </Table.Cell>
            <Table.Cell> <Button onClick={() => updateStatus(c.id, c.status)} color={c.status === 'Aguardando' ? 'orange' : c.status === 'Concluido' ? 'green' : c.status === 'Cancelado' ? 'red' : null}> {c.status} </Button> </Table.Cell>
            <Table.Cell>
              <Button.Group>
                <Button onClick={() => AbrirPDF(c.cod_checklist)} color="orange" >
                  <Icon name="file pdf" />
                </Button>
                <Button.Or text='ou' />
                <Button onClick={() => setId(c.id)}>
                  <Icon name="pencil" />
                </Button>
                <Button.Or text='ou' />
                <Button onClick={() => ExcluirChecklist(c.id)} color='red'>
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
          <Header>Lista de Checklists   <Button onClick={() => setNovo(!novo)} color='green'>Novo Checklist</Button></Header>
          <Table compact celled>
            <Table.Header fullWidth>
              <Table.Row>
                <Table.HeaderCell>Nº Contrato</Table.HeaderCell>
                <Table.HeaderCell>Nº do Checklist</Table.HeaderCell>
                <Table.HeaderCell>Empresa de Origem</Table.HeaderCell>
                <Table.HeaderCell>Empresa de Destino</Table.HeaderCell>
                <Table.HeaderCell>Quantidade de Sacas</Table.HeaderCell>
                <Table.HeaderCell>Status</Table.HeaderCell>
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
                <label>Empresa de Origem</label>
                <Dropdown
                  placeholder='Nome da empresa de origem.'
                  fluid
                  search
                  selection
                  value={empresa_origem}
                  onSearchChange={(e, { searchQuery }) => setempresa_origem([searchQuery].toString())}
                  onChange={(e, { value }) => setempresa_origem([value].toString())}
                  options={empresas}
                />
              </Form.Field>

              <Form.Field>
                <label>Empresa de Destino</label>
                <Dropdown
                  placeholder='Nome da empresa de Destino.'
                  fluid
                  search
                  selection
                  value={empresa_destino}
                  onSearchChange={(e, { searchQuery }) => setempresa_destino([searchQuery].toString())}
                  onChange={(e, { value }) => setempresa_destino([value].toString())}
                  options={empresas}
                />
              </Form.Field>
            </Form.Group>

            <Form.Group unstackable widths={2}>
              <Form.Field>
                <label>Número do contrato</label>
                <Input
                  type="number"
                  onChange={(e, { value }) => setnum_contrato([value].toString())}
                  value={num_contrato}
                  placeholder="Número do contrato."
                />
              </Form.Field>
              <Form.Field>
                <label>Número do container</label>
                <Input
                  type="text"
                  onChange={(e, { value }) => setnumero_container([value].toString())}
                  value={numero_container}
                  placeholder="Número do container."
                  fluid
                />
              </Form.Field>
            </Form.Group>
            <Form.Group unstackable widths={2}>
              <Form.Field>
                <label>Número do checklist</label>
                <Input
                  type="text"
                  onChange={(e, { value }) => setcod_checklist([value].toString())}
                  value={cod_checklist}
                  placeholder="Número do checklist."
                />
              </Form.Field>
              <Form.Field>
                <label>Código do OIC</label>
                <Input
                  type="number"
                  onChange={(e, { value }) => setnumero_oic([value].toString())}
                  value={numero_oic}
                  placeholder="Código do OIC."
                  fluid
                />
              </Form.Field>
            </Form.Group>
            <Form.Group unstackable widths={2}>
              <Form.Field>
                <label>Data do Checklist</label>
                <Input
                  type="date"
                  onChange={(e, { value }) => console.log([value].toString())}
                  value={data}
                  placeholder="Data do Checklist."
                />
              </Form.Field>
              <Form.Field>
                <label>Quantidade de Sacas</label>
                <Input
                  type="number"
                  onChange={(e, { value }) => setquantidade([value].toString())}
                  value={quantidade}
                  placeholder="Quantidade de Sacas."
                  fluid
                />
              </Form.Field>
            </Form.Group>
            <Button onClick={() => id !== '' ? UpdChecklist() : cadCheclist()} primary type="submit" >
              {id !== '' ? 'Editar' : 'Salvar'}
            </Button>
            <Button onClick={() => setNovo(!novo)}>Cancelar</Button>
          </Form>
        </Segment>
        : null}
    </>

  );

};