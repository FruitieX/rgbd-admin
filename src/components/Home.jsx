import React from 'react';
import io from 'socket.io-client';

const canvasStyle = {
  'backgroundColor': 'black',
  'width':           '100%',
};

export default class Home extends React.Component {
  constructor() {
    super();

    this.state = {
      socket: io.connect('http://192.168.1.101:9009'),
      strips: [],
    };
  }

  componentDidMount() {
    this.state.socket.emit('stripsSubscribe');
    this.state.socket.on('strips', strips => {
      strips.forEach((strip, index) => {
        this.updateCanvas(strip, index);
      });

      this.setState({
        strips,
      });
    });
  }

  componentWillUnmount() {
    this.state.socket.disconnect();
  }

  updateCanvas() {
    const canvas = this.refs.strip0;

    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    this.state.strips.forEach(strip => {
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
    const strips = [];

    this.state.strips.forEach((strip, index) => {
      strips.push(
        <div key={index}>
          <div>
            <b>RGB LED strip {index}, "{strip.name}"</b>
            <div>
              Configuration: {strip.dev},
                             {strip.numLeds} LEDs,
                             reversed: {strip.reversed ? 'true' : 'false'}
            </div>
          </div>

          <canvas style={ canvasStyle } width={1920} ref={`strip${index}`} />

          <div>
            Avg framerate: {Math.round(strip.fps)}
          </div>
        </div>
      );
    });

    return (
      <div>
        { strips }
      </div>
    );
  }
}
