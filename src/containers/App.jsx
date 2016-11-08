import React from 'react';

import TopBar from '../components/TopBar';

class App extends React.Component {
  onComponentDidMount() {
    console.log('there');
  }

  render() {
    const containerStyle = {
      padding: this.context.muiTheme.spacing.desktopGutter,
    };

    return (
      <div>
        <TopBar />
        <div style={containerStyle}>
          {React.cloneElement(this.props.children, this.props)}
        </div>
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
