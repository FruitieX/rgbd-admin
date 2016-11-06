import React from 'react';
import io from 'socket.io-client';

const canvasStyle={
  'background-color': 'black',
  'width': '100%'
};

export default class Home extends React.Component {
  constructor() {
    super();

    this.state = {
      socket: io.connect('http://localhost:9009'),
    };
    this.state.socket.emit('stripsSubscribe');

    this.state.socket.on('strips', data => {
      const canvas = document.getElementById('strip');
      const ctx = canvas.getContext('2d');

      const colors = data[0].colors;

      colors.forEach((color, index) => {
        const h = canvas.height;
        const w = canvas.width / colors.length;
        const offset = index * canvas.width / colors.length;

        ctx.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;
        ctx.beginPath();
        ctx.arc(offset + w / 2, h / 2, w / 2, 0, 2 * Math.PI);
        ctx.fill();
      });
    });
  }

  componentWillUnmount() {
    this.state.socket.disconnect();
  }

  render() {
    return (
      <div>
        <canvas style={canvasStyle} width={1920} id='strip'/>
      </div>
    );
  }
}
