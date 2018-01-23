import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchPost, deletePost } from '../actions';

class PostsShow extends Component {
	componentDidMount() {
		const { id } = this.props.match.params;
		this.props.fetchPost(id);
	}

	onDeleteClick() {
		const { id } = this.props.match.params;
		this.props.deletePost(id, () => {
			this.props.history.push('/');
		});
	}

	render() {
		const { post } = this.props;

		if(!post) {
			return <div>Loading...</div>;
		}

		return (
			<div>
				<Link to="/">Back To Index</Link>
				<button
					className="btn btn-danger pull-xs-right"
					onClick={ this.onDeleteClick.bind(this) }
				>
					Delete Post	
				</button>
				<h3>{ post.title }</h3>
				<h6>Categories: { post.categories }</h6>
				<p>{ post.content }</p>
			</div>
		);
	}
}

//El segundo parametro es el parametro ownProps
function mapStateToProps({ posts }, ownProps) {
	//ownProps === this.props del componente.
	//Por lo tanto ownProps.match.params.id es lo mismo que this.props.match.params
	ownProps.match.params.id
	return { post: posts[ownProps.match.params.id] };
}

//Acá conecta el fetchPost (action creator), con el component.
//De esta forma el componente lo tiene en sus props, y cuando lo ejecuta,
//la accion es brodcasteada a todos los reducers.
//También conectamos el mapSateToProps para conectar el reducer con las 
//props del componente.
export default connect(mapStateToProps, { fetchPost, deletePost })(PostsShow);