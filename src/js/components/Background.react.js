var React = require('react');
var classNames = require('classnames');

var Background = React.createClass({
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
