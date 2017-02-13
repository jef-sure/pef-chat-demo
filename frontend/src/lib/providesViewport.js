import React from 'react';

export default
function providesViewport(Component) {
  return class ViewportProvider extends React.Component {
    constructor() {
      super();
      this.state = {viewport: this.getViewPort()};
    }

    getViewPort() {
      return {
        width: Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
        height: Math.max(document.documentElement.clientHeight, window.innerHeight || 0),
        mobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
      };
    }

    componentDidMount() {
      const handler = (e) => {
        this.setState({viewport: this.getViewPort()});
      };
      window.addEventListener('resize', handler, false);
      this.cleanup = () => window.removeEventListener('resize', handler, false);
    }

    componentWillUnmount() {
      this.cleanup();
    }

    render() {
      return (
        <Component
          {...this.props}
          viewport={this.state.viewport}
        />
      );
    }
  };
}

