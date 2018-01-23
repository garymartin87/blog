import React, { Component } from 'react';
//Importamos reduxForm que es un helper para conectar ReduxForm con React
import { Field, reduxForm } from 'redux-form';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { createPost } from '../actions';

class PostsNew extends Component {
	//El argumento field contiene manejadores de eventos
	//que necesitamos conectar al GSX que vamos a generar
	renderField(field) {
		//ES6, esto desestructura solo touched y error del objeto meta (desestructura añidadamente)
		const { meta: { touched, error } } = field;
		const className = `font-group ${ touched && error ? 'has-danger' : '' }`;

		return (
			<div className={ className }>
				<label>{ field.label }</label>
				<input 
					type="text"
					className="form-control"
					//field.input tiene diferentes manejadores de eventos
					//y diferentes propiedades (onChange, onBlur, etc).
					//El resultado de el siguiente GSX sería lo mismo que hacer
					//onChange={ field.input.onChange }
					//onFocus={ field.input.onFocus }
					//etc...
					{ ...field.input }
				/>
				<div className="text-help">
					{ touched ? error : '' }
				</div>
			</div>
		)
	}

	onSubmit(values) {
		//this === component

		//Este segundo parámetro que pasamos es una función callback.
		//El action creator la recibe como segundo parámetro.
		this.props.createPost(values, () => {
			this.props.history.push('/');
		});
	}

	render() {
		//Al conectar el componente con reduxForm, tenemos dentro de
		//this.props la propiedad handleSubmit que es una función que vamos a utilizar
		//mas abajo para conectar nuestra función que submitea con reduxForm.
		const { handleSubmit } = this.props;

		return (
			//handleSubmit() es una función de reduxForm que lo que hace es antes
			//de hacer el submit valida todo, y si la validación va bien ejecuta la función
			//que le pasas como parámetro para que haga el submit.
			//El .bind(this) es para que dentro de nuestra función onSubmit (declarada mas arriba),
			//el this haga referencia al componente.
			<form onSubmit={ handleSubmit(this.onSubmit.bind(this)) }>
				<Field
					//Esta propiedad custom se atachea automagicamente al objeto field 
					//que out of the box se pasa como argumento a la funcion
					//renderField
					label="Title"
					//La propiedad name es importante porque es la que usa para machear
					//el error que se pasa a la función renderField (a traves de field.meta.error)
					name="title"
					//Field no sabe como renderizar el input,
					//solo sabe atachearle al elemento los eventos
					//que generan actions
					component={ this.renderField } 
				/>
				<Field
					label="Categories"
					name="categories"
					component={ this.renderField } 
				/>
				<Field
					label="Post Content"
					name="content"
					component={ this.renderField } 
				/>
				<button type="submit" className="btn btn-primary">Submit</button>
				<Link to="/" className="btn btn-danger">Cancel</Link>
			</form>
		);
	}
}

function validate(values) {
	//console.log(values) -> { title: 'asdf', categories: 'asd', content: 'asd' }
	const errors = {};

	//Validate the inputs from 'values'
	if(!values.title) {
		errors.title = "Enter a title";
	}
	if(!values.categories) {
		errors.categories = "Enter some categories";
	}
	if(!values.content) {
		errors.content = "Enter some content please";
	}

	//If errors is empty, the form is fine to submite
	//If errors has any properties, redux form assumes form is invalid
	return errors;
}

//Esta función comunica el componente PostsNew con el reducer
//Lo que hace es agregar varias propiedades adicionales al componente
export default reduxForm({
	validate, //Es igual que poner validate: validate
	form: 'PostsNewForm'
})(
	connect(null, { createPost })(PostsNew)
);