import React from 'react';
import Slider from 'material-ui/Slider';
import Checkbox from 'material-ui/Checkbox';
import SockJS from 'sockjs-client';

import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

import {
  Card,
  CardHeader,
  CardText,
  CardTitle,
} from 'material-ui/Card';

const canvasStyle = {
  'backgroundColor': 'black',
  'width':           '100%',
};

export default class Home extends React.Component {
  constructor() {
    super();

    this.state = {
      patterns:       [],
      strips:         [],
      activePattern:  null,
      autoBrightness: false,
    };

    this.socket = null;
    this.strips = [];
  }

  send(method, params) {
    this.socket.send(JSON.stringify({
      jsonrpc: '2.0',
      method,
      params,
    }));
  }

  configureWS() {
    console.log('Reconnecting WS');
    const socketPath = `${window.location.protocol}//${window.location.hostname}/ws`;

    this.socket = new SockJS(socketPath);
    this.socket.onopen = () => {
      this.send('stripsSubscribe');
    };

    this.socket.onclose = () => {
      setTimeout(this.configureWS.bind(this), 1000);
    };

    this.socket.onmessage = e => {
      const message = JSON.parse(e.data);

      if (message.method === 'sync') {
        this.setState(message.params);
      } else if (message.method === 'strips') {
        const strips = message.params;
        strips.forEach((strip, index) => {
          this.updateCanvas(strip, index);
        });

        this.strips = strips;
        this.setState({ strips: Object.keys(strips) });
      } else if (message.method === 'patterns') {
        this.setState({ patterns: message.params });
      } else if (message.method === 'activate') {
        this.setState({ activePattern: message.params });
      } else if (message.method === 'autoBrightness') {
        // TODO: wrong
        this.setState({ autoBrightness: message.params });
      } else {
        console.log('unknown message', message);
      }
    };
  }

  componentDidMount() {
    this.configureWS();
  }

  componentWillUnmount() {
    this.state.socket.close();
  }

  changeBrightness(index, value) {
    this.state.socket.emit('setBrightness', {
      index,
      value,
    });
  }

  changePattern(activePattern) {
    this.setState({ activePattern });
    this.state.socket.emit('activate', activePattern);
  }

  autoBrightness(autoBrightness) {
    console.log(autoBrightness);
    this.setState({ autoBrightness });
    this.state.socket.emit('autoBrightness', autoBrightness);
  }

  updateCanvas() {
    const canvas = this.refs.strip0;

    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    this.strips.forEach(strip => {
      strip.colors.forEach((color, index) => {
        const h = canvas.height;
        const w = canvas.width / strip.colors.length;
        const offset = index * canvas.width / strip.colors.length;

        ctx.fillStyle = `rgb(
          ${Math.round(color.r)},
          ${Math.round(color.g)},
          ${Math.round(color.b)}
        )`;
        ctx.beginPath();
        ctx.arc(offset + w / 2, h / 2, w / 2, 0, 2 * Math.PI);
        ctx.fill();
      });
    });
  }

  render() {
    const patterns = [];

    const cardStyle = {
      margin:       this.context.muiTheme.spacing.desktopGutter,
      marginBottom: 0,
    };

    this.state.patterns.forEach((pattern, index) => {
      patterns.push(
        <MenuItem primaryText={ pattern } key={ index } value={ pattern } />
      );
    });

    const strips = [];

    this.strips.forEach((strip, index) => {
      strips.push(
        <Card style={cardStyle} key={index}>
          <CardHeader
            title={`RGB LED strip ${index}`}
            subtitle={`
              name: ${strip.name},
              device: ${strip.dev},
              numLeds: ${strip.numLeds},
              reversed: ${strip.reversed ? 'true' : 'false'},
              fps: ${Math.round(strip.fps)}
            `}
          />

          <CardTitle subtitle='Brightness:'>
            <Slider
              step={0.0001}
              value={strip.brightness}
              min={0.1}
              disabled={this.state.autoBrightness}
              onChange={(event, value) => this.changeBrightness(index, value)} />
          </CardTitle>

          <CardTitle subtitle='Preview:'>
            <canvas style={ canvasStyle } width={1920} ref={`strip${index}`} />
          </CardTitle>
        </Card>
      );
    });

    return (
      <div>
        <Card style={cardStyle}>
          <CardHeader
            title={'rgbd-admin'}
            subtitle={'General settings'}
          />
          <CardTitle subtitle='Active pattern:'>
            <SelectField
              value={this.state.activePattern}
              onChange={(event, index, value) => {
                this.changePattern(value);
              }} >
              { patterns }
            </SelectField>
          </CardTitle>

          <CardText>
            <Checkbox
              label='Automatic brightness'
              switched={this.state.autoBrightness}
              checked={this.state.autoBrightness}
              style={styles.checkbox}
              onCheck={(event, value) => {
                this.autoBrightness(value);
              }}
            />
          </CardText>
        </Card>

        { strips }
      </div>
    );
  }
}

const styles = {
  block: {
    maxWidth: 250,
  },
  checkbox: {
    marginBottom: 16,
  },
};

Home.contextTypes = {
  muiTheme: React.PropTypes.object.isRequired,
};
