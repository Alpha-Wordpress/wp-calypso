import classnames from 'classnames';
import { FunctionComponent, InputHTMLAttributes } from 'react';

import './style.scss';

type CheckboxProps = InputHTMLAttributes< HTMLInputElement >;

const FormInputCheckbox: FunctionComponent< CheckboxProps > = ( { className, ...otherProps } ) => {
	const { name, checked } = otherProps;
	console.log( `${ name }, ${ checked }` );
	return (
		<input
			{ ...otherProps }
			type="checkbox"
			className={ classnames( className, 'form-checkbox' ) }
		/>
	);
};

export default FormInputCheckbox;
