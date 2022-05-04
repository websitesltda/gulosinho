import React, {Component} from 'react'
import {Icon,
        Image,
        Menu,  
       } from 'semantic-ui-react'
import {actionCreators as sideAction} from "../../store/SideMenu";
import {actionCreators as searchAction} from "../../store/SearchStore";
import {bindActionCreators} from "redux";
import { connect } from 'react-redux';

function sair(){
  localStorage.setItem("Logado", 'flase') 
  localStorage.setItem("Cd_impresa", '') 
  window.location.href = "/";
}
class TopMenu extends Component {
  state = {};
  

  handleItemClick = (e, { name }) => this.setState({ activeItem: name });

  doSearch(event) {
      this.props.actions.search(event.target.value);  
  } 

  render() {
    return (
      <Menu fixed="top" className="top-menu">
        <Menu.Item className="logo-space-menu-item">
          <div className="display-inline logo-space">
            <Image src="./logo.png" />
          </div>
        </Menu.Item>

        <Menu.Item
          className="no-border"
          onClick={this.props.actions.toggleSideMenu}
        >
          <Icon name="bars" />
        </Menu.Item>

        <Menu.Menu position="right">
    
          <Menu.Item className="no-border" position="right">
            <div onClick={sair}  className="display-inline">
              <Image
                circular
                size={"mini"}
                src="https://react.semantic-ui.com/images/avatar/large/jenny.jpg"
              />
              Sair
            </div>
          </Menu.Item>
        </Menu.Menu>
      </Menu>
    );
  }
}

export default connect(
    state => state.sideMenu,
     dispatch => {
        return {
            actions: bindActionCreators(Object.assign({}, sideAction, searchAction), dispatch)
        }}
)(TopMenu);
