import React, { Component } from 'react'
import { 
    Modal,
    Button,
    Row,
	Input } 
from 'react-materialize'
import * as roles from '../../constants/roles'
import * as routes from '../../constants/routes'

const INITIAL_STATE = {
    email: '',
	password: '',
    error: null,
};

const updateByPropertyName = (propertyName, value) => () => ({
    [propertyName]: value,
});

export default class UserSignIn extends Component {
	constructor (props){
        super(props);
		this.state = {...INITIAL_STATE}
		
        this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleSubmit(event) {
		let user = this.state.email,
			password = this.state.password;

		Meteor.loginWithPassword(user, password, (error) => {
			if(error){
                this.setState(updateByPropertyName('error', error.reason));
			}else {
				if(Roles.getRolesForUser(Meteor.userId()).includes(roles.TEACHER)){
					FlowRouter.go(routes.TEACHER);
				}else{
					FlowRouter.go(routes.STUDENT);
				}
				$('.modal-overlay').hide();
			}
		});

		event.preventDefault();				
    }


  render() {
	const {
        password,
		email,
	  } = this.state;
	  

	let isInvalid = () =>
		password === '' ||
		email === '' ||
		!email.includes('@') ||
		!email.includes('.');

    return (
        <div>
            <div 
				onClick={() => {
                        	$('#user-sign-in-modal').modal('open')
                    	}}>
            	Sign In
            </div>
            <Modal
              id='user-sign-in-modal'
              header='Sign In'
              actions={[<Button> </Button>]}>
                <form
					type="submit"
                    onSubmit={this.handleSubmit.bind(this)}
				>
                	<Row>
                    	<Input 
							type="email" 
							placeholder="Email"
							value={email}
                        	validate
                        	onChange={event => this.setState(updateByPropertyName('email', event.target.value))}
                        	required 
							s={12} 
						/>
                    	<Input 
							type="password" 
							placeholder="password"
							value={password}
                        	validate
                       	 	onChange={event => this.setState(updateByPropertyName('password', event.target.value))}
                        	required 
							s={12} 
						/>
                  	</Row>
				  	<Button 
                        waves='light'
						ref='submit'
                        className="right sign-button"   
                        disabled={isInvalid()} 
                        onClick={this.handleSubmit}
                    >
                        Sign In
                	</Button>
					<blockquote>
                        {!!this.state.error && this.state.error}
                	</blockquote>
                </form>
            </Modal>
        </div>
    )       
  }
}
