import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as appActions from '../state/actions/app';

const mapStateToProps = (state) => {
  return {app: state.app};
}

const mapDispatchToProps = (dispatch) => {
  return {
    appActions: bindActionCreators(appActions, dispatch),
  };
}

export const connectToApp = (target) => {
  return connect(mapStateToProps, mapDispatchToProps)(target);
}
