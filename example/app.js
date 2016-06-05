import React, { Component } from 'react';
import ReactDOM from 'react-dom';

class Application extends Component {
    render() {
        return (
            <div>
                <h1>My React Application</h1>
            </div>
        );
    }
}

const container = document.querySelector('#app-container');

ReactDOM.render(<Application />, container);

console.log('app loaded!');
