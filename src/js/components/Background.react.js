var React = require('react');
var classNames = require('classnames');

var Background = React.createClass({
  componentDidMount: function() {
    // Background is mounted, switch body BG to black
    // for a nicer transition.
    document.body.style.backgroundColor = '#000000';
  },

  render: function(){
    var style = {};

    style.backgroundImage = 'url(' + this.props.backgroundImage.data + ')';

    var className = classNames({
    	'background': true,
    	'loading': this.props.isBackgroundLoading
    });

    return (
      <div className={className} style={style}></div>
    );
  }
});

module.exports = Background;
