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

const onDOMReady = () => {
    const container = document.querySelector('#app-container');
    ReactDOM.render(<Application />, container);
};

if (document.readyState === 'complete' || document.readyState !== 'loading') {
    onDOMReady();
} else {
    document.addEventListener('DOMContentLoaded', onDOMReady);
}

console.log('app loaded!');
