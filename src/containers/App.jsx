import React from 'react';

import TopBar from '../components/TopBar';

class App extends React.Component {
  onComponentDidMount() {
    console.log('there');
  }

  render() {
    return (
      <div>
        <TopBar />
        {React.cloneElement(this.props.children, this.props)}
      </div>
    );
  }
}

App.propTypes = {
  children: React.PropTypes.object.isRequired,
};

App.contextTypes = {
  muiTheme: React.PropTypes.object.isRequired,
};

export default App;
