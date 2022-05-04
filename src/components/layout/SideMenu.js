import React, { Component } from 'react'
import { Menu } from 'semantic-ui-react'
import { Link } from "react-router-dom";
import TextIcon from "../extension/TextIcon";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { actionCreators } from "../../store/SideMenu";

class SideMenu extends Component {
    state = {
        activeItem: 'dashboard',
    };

    handleItemClick = (e, { name }) => this.setState({ activeItem: name });
    changeSize = () => this.setState({ smallSidebar: !this.props.smallMenu });

    getMenu() {
        const { activeItem } = this.state;
        return (
            <Menu fixed='left' borderless className={(this.props.smallMenu ? 'small-side' : '') + ' side'} vertical>
                <Menu.Item as={Link} to={'/checklist'} name='checklist' active={activeItem === 'checklist'}
                    onClick={this.handleItemClick}>
                    <TextIcon hideText={this.props.smallMenu} color='teal' name='home'>
                        Checklists
                    </TextIcon>
                </Menu.Item>

                <Menu.Item as={Link} to={'/empresas'}
                    name='empresas'
                    active={activeItem === 'empresas'}
                    onClick={this.handleItemClick}>
                    <TextIcon hideText={this.props.smallMenu} name='calendar'>
                        Empresas
                    </TextIcon>
                </Menu.Item>

                <Menu.Item
                    as={Link} to={'/funcionarios'}
                    name='funcionarios'
                    active={activeItem === 'funcionarios'}
                    onClick={this.handleItemClick}
                >
                    <TextIcon hideText={this.props.smallMenu} name='users'>
                        Funcionarios
                    </TextIcon>
                </Menu.Item>

                <Menu.Item as={Link} to={'/card'} name='card' active={activeItem === 'card'}
                    onClick={this.handleItemClick}>

                    <TextIcon hideText={this.props.smallMenu} name='time'>
                        Relatorio
                    </TextIcon>
                </Menu.Item>

                <Menu.Item as={Link} to={'/categoria'} name='categoria' active={activeItem === 'categoria'}
                    onClick={this.handleItemClick}>

                    <TextIcon hideText={this.props.smallMenu} name='time'>
                        Categorias
                    </TextIcon>
                </Menu.Item>

                <Menu.Item as={Link} to={'/perguntas'} name='perguntas' active={activeItem === 'perguntas'}
                    onClick={this.handleItemClick}>

                    <TextIcon hideText={this.props.smallMenu} name='time'>
                        Perguntas
                    </TextIcon>
                </Menu.Item>

                <Menu.Item as={Link} to={'/perfil'} name='perfil' active={activeItem === 'perfil'}
                    onClick={this.handleItemClick}>

                    <TextIcon hideText={this.props.smallMenu} name='time'>
                        Perfil
                    </TextIcon>
                </Menu.Item>

            </Menu>
        )
    }

    render() {
        return (
            <div className='parent'>
                <div className={(this.props.smallMenu ? 'small-side ' : '') + 'side'}>
                    {this.getMenu()}
                </div>
                <div className={(this.props.smallMenu ? 'small-content ' : '') + 'content'}>
                    {this.props.children}
                </div>
            </div>
        )
    }
}

export default connect(
    state => state.sideMenu,
    dispatch => bindActionCreators(actionCreators, dispatch)
)(SideMenu);
