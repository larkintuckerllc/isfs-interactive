import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

class Disease extends Component {
  componentWillMount() {
    const { map } = this.props;
    window.console.log(map);
  }
  componentWillUnmount() {
    const { map } = this.props;
    window.console.log(map);
  }
  render() {
    return null;
  }
}
Disease.propTypes = {
  map: PropTypes.object,
};
export default connect(
  null,
  null
)(Disease);
