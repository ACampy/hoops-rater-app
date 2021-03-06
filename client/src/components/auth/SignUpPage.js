import React from 'react';
import { Grid, Row, Col, FormGroup, ControlLabel, FormControl, Button, HelpBlock } from 'react-bootstrap';
import { withAuth } from '@okta/okta-react';
import OktaAuth from '@okta/okta-auth-js';
import config from '../auth-config.js';


export default withAuth(class RegisterPage extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            firstName : '',
            lastName : '',
            email: '',
            password: '',
            sessionToken: null
        }

        this.oktaAuth = new OktaAuth({url:config.oidc.url});
        this.checkAuthentication = this.checkAuthentication.bind(this);
        this.checkAuthentication();

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleFirstNameChange = this.handleFirstNameChange.bind(this);
        this.handleLastNameChange = this.handleLastNameChange.bind(this);
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
    }

    async checkAuthentication() {
      const authenticated = await this.props.auth.isAuthenticated();
      if (authenticated !== this.state.authenticated) {
        this.setState({ authenticated });
      }
    }

    componentDidUpdate() {
       this.checkAuthentication();
     }

    handleSubmit(e){
        e.preventDefault();
        fetch('/api/users',{
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.state)
        }).then(user => {
            this.oktaAuth.signIn({
                username: this.state.email,
                password:this.state.password
            })
            .then(res => this.setState({
                sessionToken : res.sessionToken
            }));
        })
        .catch(err => console.log);
    }

    handleFirstNameChange(e){
        this.setState({firstName:e.target.value});
    }
    handleLastNameChange(e){
        this.setState({lastName:e.target.value});
    }
    handleEmailChange(e){
        this.setState({email:e.target.value});
    }
    handlePasswordChange(e){
        this.setState({password:e.target.value});
    }
    /*            <form onSubmit={this.handleSubmit}>
                    <input type="email" id="email" value={this.state.email} onChange={this.handleEmailChange}/>
                    <input type="text" id="firstName" value={this.state.firstName} onChange={this.handleFirstNameChange}/>
                    <input type="text" id="lastName" value={this.state.lastName} onChange={this.handleLastNameChange}/>
                    <input type="password" id="password" value={this.state.password} onChange={this.handlePasswordChange}/>
                    <input type="submit" id="submit" value="Register"/>
                </form>*/
    render(){
        if(this.state.sessionToken){
            this.props.auth.redirect({sessionToken:this.state.sessionToken});
            return null;
        }
        return (
            <Grid>
                <Row>
                <h1> Sign Up </h1>
                    <Col lg={4} lgOffset={4}>
                        <form onSubmit={this.handleSubmit}>
                            <FormGroup controlId="formBasicText">
                                <ControlLabel>Email Address</ControlLabel>
                                <FormControl type="email" id="email" value={this.state.email} onChange={this.handleEmailChange}/>
                                <br/>
                                <ControlLabel>First Name</ControlLabel>
                                <FormControl type="text" id="firstName" value={this.state.firstName} onChange={this.handleFirstNameChange}/>
                                <br/>
                                <ControlLabel>Last Name</ControlLabel>
                                <FormControl type="text" id="lastName" value={this.state.lastName} onChange={this.handleLastNameChange}/>
                                <br/>
                                <ControlLabel>Password</ControlLabel>
                                <FormControl type="password" id="password" value={this.state.password} onChange={this.handlePasswordChange}/>
                            </FormGroup>
                            <Button className="buttonLanding" type="submit">Register</Button>
                        </form>
                    </Col>
                </Row>
            </Grid>
        );
    }
});
