import React from 'react';

class App extends React.Component {
  onComponentDidMount() {
    console.log('there');
  }

  render() {
    const containerStyle = {
      paddingBottom: this.context.muiTheme.spacing.desktopGutter,
    };

    return (
      <div>
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
