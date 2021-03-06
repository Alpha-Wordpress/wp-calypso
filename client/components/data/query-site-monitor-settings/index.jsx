import PropTypes from 'prop-types';
import { Component } from 'react';
import { connect } from 'react-redux';
import isRequestingSiteMonitorSettings from 'calypso/state/selectors/is-requesting-site-monitor-settings';
import { requestSiteMonitorSettings } from 'calypso/state/sites/monitor/actions';

class QuerySiteMonitorSettings extends Component {
	static propTypes = {
		siteId: PropTypes.number.isRequired,
		// Connected props
		requestingSiteMonitorSettings: PropTypes.bool,
		requestSiteMonitorSettings: PropTypes.func,
	};

	componentDidMount() {
		this.request( this.props );
	}

	// @TODO: Please update https://github.com/Automattic/wp-calypso/issues/58453 if you are refactoring away from UNSAFE_* lifecycle methods!
	UNSAFE_componentWillReceiveProps( nextProps ) {
		if ( this.props.siteId !== nextProps.siteId ) {
			this.request( nextProps );
		}
	}

	request( props ) {
		if ( props.siteId && ! props.requestingSiteMonitorSettings ) {
			props.requestSiteMonitorSettings( props.siteId );
		}
	}

	render() {
		return null;
	}
}

export default connect(
	( state, { siteId } ) => ( {
		requestingSiteMonitorSettings: isRequestingSiteMonitorSettings( state, siteId ),
	} ),
	{ requestSiteMonitorSettings }
)( QuerySiteMonitorSettings );
