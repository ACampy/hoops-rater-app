import React from 'react';
import {Redirect} from 'react-router-dom';
import NotFound from './NotFoundPage';
import StarRatingComponent from 'react-star-rating-component';
import { Grid, Row, Col, Panel, Button, FormGroup, FormControl } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';

const styles = {
    panelStyle : {
        background : "rgba(248, 201, 149, 1)",
        color: "darkslategrey",
        borderColor: "rgba(222,127,24,.2)",

    }
}

class CourtView extends React.Component{
	constructor(props){
		super(props);
        this.handleCommentSubmit = this.handleCommentSubmit.bind(this);
        this.handleRatingSubmit = this.handleRatingSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.onStarClick = this.onStarClick.bind(this);
	}

	state = { response: [],
             courtNotFound: false,
             comment: '',
             rating: 0
			};
    handleChange(event){
        console.log(this.state.comment)
        this.setState({comment: event.target.value})
    }
    handleCommentSubmit(event){
        event.preventDefault();
        fetch('/api/form-submit-comment', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({comment: this.state.comment,
                                 id: this.props.match.params.id})
        })
        .then(this.setState({comment: ''}));
    }
    handleRatingSubmit(event){
        event.preventDefault();
        fetch('/api/form-submit-rating', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({rating: this.state.rating,
                                 id: this.props.match.params.id})
        })
    }
    onStarClick(value){
        this.setState({rating: value})
    }

	componentDidMount() {
	  this.callApi()
	    .then(res => {
	    	this.setState({ response: res })
	    })
	    .catch(err => {
	    	console.log('Did not setState to response.');
	    	console.log(err)
	    	this.setState({ courtNotFound: true })
	    });
	}

	callApi = async () => {
	  const response = await fetch('/api/court/'+this.props.match.params.id);
	  const body = await response.json();
      //console.log(body.slice(0,1));
	  if (response.status !== 200) {
	  	throw Error(body.message)
	  };

	  return body;
	};

	// Bools not yet rendered (Amenities, outdoor_status, membership_status)
	render(){
        console.log(this.state.rating)
		if(this.state.courtNotFound == true) {
			return <Redirect to="/404"/>
		}
		return (
			<div>
                <Grid>
                    <Row>
                        <Col lg={12}>
                            {this.state.response.slice(0,1).map((item) => (
                                <div>
                                    <section style={{margin:"20px 40px"}}>
                                        <Row>
                                            <Col lg={10}>
                                                <span style={{fontSize:"24px"}}>Location</span>
                                                <h1>{item.court_name.toUpperCase()}</h1>
                                            </Col>
                                            <Col lg={1} lgOffset={1} style={{textAlign:"center"}}>
                                                <FontAwesome name="star" size="2x"/>
                                                <h1>{item.avg_stars}</h1>
                                            </Col>
                                            <Col lg={12}>
                                                <h2>{item.address}  {item.court_zip}</h2>
                                            </Col>
                                        </Row>
                                    </section>
                                    <Panel style={styles.panelStyle} >
                                        <Panel.Body>
                                            <Row className="boldFont">
                                                <Col lg={2}>
                                                    <h4>busiest times</h4>
                                                    {item.busiest_times}
                                                </Col>
                                                <Col lg={2}>
                                                    <h4>open time</h4>
                                                    {item.open_time + ' AM'}
                                                </Col>
                                                <Col lg={2}>
                                                    <h4>close time</h4>
                                                    {item.close_time + ' PM'}
                                                </Col>
                                                <Col lg={2}>
                                                    <h4>court size</h4>
                                                    {item.court_size}
                                                </Col>
                                                <Col lg={2}>
                                                    <h4>membership status</h4>
                                                    {item.membership_status.toString()}
                                                </Col>
                                                <Col lg={2}>
                                                    <h4>indoor status</h4>
                                                    {item.outdoor_status.toString()}
                                                </Col>
                                                <Col lg={12}>
                                                    <br/>
                                                </Col>
                                                <Col lg={2}>
                                                    <h4>hoop height</h4>
                                                    {item.hoop_height}
                                                </Col>
                                                <Col lg={2}>
                                                    <h4>net quality</h4>
                                                    {item.net_quality}
                                                </Col>
                                                <Col lg={2}>
                                                    <h4>net type</h4>
                                                    {item.net_type}
                                                </Col>
                                                <Col lg={2}>
                                                    <h4>water fountain?</h4>
                                                    {item.has_fountain.toString()}
                                                </Col>
                                                <Col lg={2}>
                                                    <h4>vending machine?</h4>
                                                    {item.has_vending_machine.toString()}
                                                </Col>
                                                <Col lg={2}>
                                                    <h4>pavement quality</h4>
                                                    {item.pavement_quality}
                                                </Col>
                                                <Col lg={12}>
                                                    <br/>
                                                </Col>
                                                <Col lg={2}>
                                                    <h4>cleanliness</h4>
                                                    {item.cleanliness}
                                                </Col>
                                                <Col lg={2}>
                                                    <h4>rim quality</h4>
                                                    {item.rim_quality}
                                                </Col>
                                            </Row>
                                        </Panel.Body>
                                    </Panel>
                                </div>
                            ))}
                        </Col>
                    </Row>
                    <section style={{margin:"20px 40px"}}>
                        <h1>Comments</h1>
                    </section>
                    <Panel style={styles.panelStyle}>
                        <Panel.Body>
                            {this.state.response.slice(1).map((comment, index) => (
                                <Row>
                                    <Col lg={12}>
                                        <h1>{comment.comment_username}</h1>
                                    </Col>
                                    <Col lg={12} style={{margin:"0px 20px"}}>
                                        <p>{comment.comment_text}</p>
                                    </Col>
                                </Row>
                            ))}
                        </Panel.Body>
                    </Panel>
                    <Panel style={styles.panelStyle}>
                        <Panel.Body>
                            <Row>
                                <Col lg={12}>
                                    <form onSubmit={this.handleCommentSubmit}>
                                        <FormGroup controlId="formBasicText">
                                            <FormControl type="text"  placeholder="comment" onChange={this.handleChange} name="comment"/>
                                        </FormGroup>
                                        <Button type="submit">Add Comment</Button>
                                    </form>
                                    <form onSubmit={this.handleRatingSubmit}>
                                        <StarRatingComponent starColor='#ffff00' name="rate1" starCount={5} onStarClick={this.onStarClick.bind(this)}/>
                                        <br/>
                                        <Button type="submit" value="Add Rating">Add Rating</Button>
                                    </form>
                                </Col>
                            </Row>
                        </Panel.Body>
                    </Panel>
                </Grid>;
            </div>
		);
	}
}
export default CourtView;
